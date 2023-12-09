/*
    Copyright 2022 https://www.dzap.io
SPDX-License-Identifier: BUSL-1.1
*/

pragma solidity 0.8.20;

import "uniswap-v2-periphery/contracts/interfaces/IUniswapV2Router02.sol";
import "@uniswap/v2-core/contracts/interfaces/IUniswapV2Pair.sol";
import "@uniswap/v3-core/contracts/interfaces/IUniswapV3Pool.sol";
import "@uniswap/v3-periphery/contracts/interfaces/IPoolInitializer.sol";
import "@uniswap/v3-core/contracts/interfaces/IUniswapV3Factory.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";

import "./interfaces/INonfungiblePositionManager.sol";
import "./interfaces/INative.sol";
import "./libraries/TransferHelper.sol";

struct RemoveLiquidityParamsV2 {
    address pair;
    address routerV2;
    uint256 liquidity;
    uint256 amount0ToAdd;
    uint256 amount1ToAdd;
    uint256 amount0Min;
    uint256 amount1Min;
    bool refundAsETH;
}

struct DecreaseLiquidityParamsV3 {
    address positionManager;
    uint256 tokenId;
    uint128 liquidity;
    uint256 amount0ToAdd;
    uint256 amount1ToAdd;
    uint256 amount0Min;
    uint256 amount1Min;
    bool refundAsETH;
}

struct AddLiquidityParamsV3 {
    address positionManager;
    uint24 fee;
    int24 tickLower;
    int24 tickUpper;
    uint256 amount0Min;
    uint256 amount1Min;
}

contract LpMigrator {
    using SafeERC20 for IERC20;
    address public immutable WNATIVE;

    event LPMigrated(
        uint256 tokenId,
        uint128 liquidity,
        uint256 leftOver0,
        uint256 leftOver1
    );

    constructor(address wNative_) {
        WNATIVE = wNative_;
    }

    function migrateLpFromV2ToV3(
        address recipient_,
        RemoveLiquidityParamsV2 calldata removeParamsV2_,
        AddLiquidityParamsV3 calldata addParamsV3_
    ) external {
        require(removeParamsV2_.liquidity > 0, "Invalid amount");
        require(recipient_ != address(0), "Invalid address");

        address token0 = IUniswapV2Pair(removeParamsV2_.pair).token0();
        address token1 = IUniswapV2Pair(removeParamsV2_.pair).token1();

        IERC20(removeParamsV2_.pair).safeTransferFrom(
            msg.sender,
            address(this),
            removeParamsV2_.liquidity
        );

        TransferHelper.safeApprove(
            removeParamsV2_.pair,
            removeParamsV2_.routerV2,
            removeParamsV2_.liquidity
        );

        (uint256 amount0, uint256 amount1) = IUniswapV2Router02(
            removeParamsV2_.routerV2
        ).removeLiquidity(
                token0,
                token1,
                removeParamsV2_.liquidity,
                removeParamsV2_.amount0Min,
                removeParamsV2_.amount1Min,
                address(this),
                block.timestamp
            );

        if (removeParamsV2_.amount0ToAdd > 0) {
            IERC20(token0).safeTransferFrom(
                msg.sender,
                address(this),
                removeParamsV2_.amount0ToAdd
            );
            amount0 += removeParamsV2_.amount0ToAdd;
        }
        if (removeParamsV2_.amount1ToAdd > 0) {
            IERC20(token1).safeTransferFrom(
                msg.sender,
                address(this),
                removeParamsV2_.amount1ToAdd
            );
            amount1 += removeParamsV2_.amount1ToAdd;
        }

        TransferHelper.safeApprove(
            token0,
            addParamsV3_.positionManager,
            amount0
        );
        TransferHelper.safeApprove(
            token1,
            addParamsV3_.positionManager,
            amount1
        );

        (
            uint256 tokenId,
            uint128 liquidity,
            uint256 amount0V3,
            uint256 amount1V3
        ) = INonfungiblePositionManager(addParamsV3_.positionManager).mint(
                INonfungiblePositionManager.MintParams({
                    token0: token0,
                    token1: token1,
                    fee: addParamsV3_.fee,
                    tickLower: addParamsV3_.tickLower,
                    tickUpper: addParamsV3_.tickUpper,
                    amount0Desired: amount0,
                    amount1Desired: amount1,
                    amount0Min: addParamsV3_.amount0Min,
                    amount1Min: addParamsV3_.amount1Min,
                    recipient: recipient_,
                    deadline: block.timestamp
                })
            );

        uint256 leftOver0 = amount0 - amount0V3;
        uint256 leftOver1 = amount1 - amount1V3;

        if (leftOver0 > 0) {
            TransferHelper.safeApprove(token0, addParamsV3_.positionManager, 0);
            _transferTokenOrETH(
                token0,
                msg.sender,
                leftOver0,
                removeParamsV2_.refundAsETH
            );
        }

        if (leftOver1 > 0) {
            TransferHelper.safeApprove(token1, addParamsV3_.positionManager, 0);
            _transferTokenOrETH(
                token1,
                msg.sender,
                leftOver1,
                removeParamsV2_.refundAsETH
            );
        }

        emit LPMigrated(tokenId, liquidity, amount0V3, amount1V3);
    }

    function migrateLpFromV3ToV3(
        address recipient_,
        DecreaseLiquidityParamsV3 calldata decreaseParamsV3_,
        AddLiquidityParamsV3 calldata addParamsV3_
    ) external {
        require(decreaseParamsV3_.liquidity > 0, "Invalid amount");
        require(recipient_ != address(0), "Invalid address");

        (
            ,
            ,
            address token0,
            address token1,
            ,
            ,
            ,
            ,
            ,
            ,
            ,

        ) = INonfungiblePositionManager(decreaseParamsV3_.positionManager)
                .positions(decreaseParamsV3_.tokenId);

        INonfungiblePositionManager(decreaseParamsV3_.positionManager)
            .transferFrom(msg.sender, address(this), decreaseParamsV3_.tokenId);

        (uint256 amount0, uint256 amount1) = INonfungiblePositionManager(
            decreaseParamsV3_.positionManager
        ).decreaseLiquidity(
                INonfungiblePositionManager.DecreaseLiquidityParams({
                    tokenId: decreaseParamsV3_.tokenId,
                    liquidity: decreaseParamsV3_.liquidity,
                    amount0Min: decreaseParamsV3_.amount0Min,
                    amount1Min: decreaseParamsV3_.amount1Min,
                    deadline: block.timestamp
                })
            );

        (
            ,
            ,
            ,
            ,
            ,
            ,
            ,
            ,
            ,
            ,
            uint128 tokensOwed0,
            uint128 tokensOwed1
        ) = INonfungiblePositionManager(decreaseParamsV3_.positionManager)
                .positions(decreaseParamsV3_.tokenId);

        INonfungiblePositionManager(decreaseParamsV3_.positionManager).collect(
            INonfungiblePositionManager.CollectParams({
                tokenId: decreaseParamsV3_.tokenId,
                recipient: address(this),
                amount0Max: tokensOwed0,
                amount1Max: tokensOwed1
            })
        );

        if (decreaseParamsV3_.amount0ToAdd > 0) {
            IERC20(token0).safeTransferFrom(
                msg.sender,
                address(this),
                decreaseParamsV3_.amount0ToAdd
            );
            amount0 += decreaseParamsV3_.amount0ToAdd;
        }
        if (decreaseParamsV3_.amount1ToAdd > 0) {
            IERC20(token1).safeTransferFrom(
                msg.sender,
                address(this),
                decreaseParamsV3_.amount1ToAdd
            );
            amount1 += decreaseParamsV3_.amount1ToAdd;
        }

        TransferHelper.safeApprove(
            token0,
            addParamsV3_.positionManager,
            amount0
        );
        TransferHelper.safeApprove(
            token1,
            addParamsV3_.positionManager,
            amount1
        );

        (
            uint256 tokenId,
            uint128 liquidity,
            uint256 amount0V3,
            uint256 amount1V3
        ) = INonfungiblePositionManager(addParamsV3_.positionManager).mint(
                INonfungiblePositionManager.MintParams({
                    token0: token0,
                    token1: token1,
                    fee: addParamsV3_.fee,
                    tickLower: addParamsV3_.tickLower,
                    tickUpper: addParamsV3_.tickUpper,
                    amount0Desired: amount0,
                    amount1Desired: amount1,
                    amount0Min: addParamsV3_.amount0Min,
                    amount1Min: addParamsV3_.amount1Min,
                    recipient: recipient_,
                    deadline: block.timestamp
                })
            );

        uint256 leftOver0 = amount0 - amount0V3;
        uint256 leftOver1 = amount1 - amount1V3;

        if (leftOver0 > 0) {
            TransferHelper.safeApprove(token0, addParamsV3_.positionManager, 0);
            _transferTokenOrETH(
                token0,
                msg.sender,
                leftOver0,
                decreaseParamsV3_.refundAsETH
            );
        }

        if (leftOver1 > 0) {
            TransferHelper.safeApprove(token1, addParamsV3_.positionManager, 0);
            _transferTokenOrETH(
                token1,
                msg.sender,
                leftOver1,
                decreaseParamsV3_.refundAsETH
            );
        }

        emit LPMigrated(tokenId, liquidity, leftOver0, leftOver1);
    }

    function _transferTokenOrETH(
        address token,
        address recipient,
        uint256 amount,
        bool refundAsETH
    ) internal {
        if (refundAsETH && token == WNATIVE) {
            INative(WNATIVE).withdraw(amount);
            TransferHelper.safeTransferETH(recipient, amount);
        } else {
            TransferHelper.safeTransfer(token, recipient, amount);
        }
    }

    receive() external payable {
        require(msg.sender == WNATIVE, "Not WNATIVE");
    }
}
