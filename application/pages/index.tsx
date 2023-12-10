import type { NextPage } from "next";
import { useEffect, useMemo, useState } from "react";
import Dropdown from "@/components/ui/dropdown";
import { Option } from "../interfaces";
import {
  selectFromProtocol,
  selectToProtocol,
  selectLpToPairAddress,
  selectLpFromPairAddress,
} from "../redux/slices/dropdownSlice";
import { BigNumber as BN } from "bignumber.js";
import ArrowButton from "@/components/ui/arrow-button";
import { RootState } from "../redux/store";
import { useDispatch, useSelector } from "react-redux";
import { ProtocolVersion, contractAddresses, protocols } from "../const/protocols";
import PriceComponent from "@/components/ui/price-component";
import { setMinPrice, setMaxPrice } from "../redux/slices/priceSlice";
import { useAddress, useChainId } from "@thirdweb-dev/react";
import { ethers, Contract, BigNumber } from "ethers";
import LpMigrator from "../abi/LpMigrator.json";
import INonfungiblePositionManagerABI from "../abi/PositionManager.json";
import { nearestUsableTick } from "@uniswap/v3-sdk";
import IUniswapV3Pool from "../abi/UniswapV3Pool.json";

const Home: NextPage = () => {
  const dispatch = useDispatch();
  const chainId = useChainId();
  const address = useAddress();

  const selectedFromProtocol = useSelector((state: RootState) => state.dropdown.selectedFromProtocol);
  const selectedToProtocol = useSelector((state: RootState) => state.dropdown.selectedToProtocol);
  const [lpFromPairOptions, setLpFromPairOptions] = useState<Option[]>([]);
  const [lpToPairOptions, setLpToPairOptions] = useState<Option[]>([]);
  const [selectedLpPair, setSelectedLpPair] = useState<string>("");

  const loadLpPairOptions = (
    selectedProtocolKey: string,
    setLpPairOptions: React.Dispatch<React.SetStateAction<Option[]>>
  ) => {
    if (chainId) {
      const chainProtocols = protocols[chainId.toString()];
      if (chainProtocols) {
        ["v2", "v3"].forEach((version) => {
          //@ts-ignore
          const versionProtocols = chainProtocols[version];
          if (versionProtocols) {
            const selectedprotocolFromData = versionProtocols[selectedProtocolKey];
            if (selectedprotocolFromData && selectedprotocolFromData.pairs) {
              const pairs = selectedprotocolFromData.pairs;
              const pairOptions = Object.entries(pairs).map(([key, value]) => ({
                //@ts-ignore
                label: `${value.token0.name}/${value.token1.name}`,
                value: key,
              }));
              setLpPairOptions(pairOptions);
            } else {
              setLpPairOptions([]);
            }
          }
        });
      }
    }
  };

  const getPoolInfo = async (poolV3Contract: Contract) => {
    const [token0, token1, fee, liquidity, slot0, tickSpacing] = await Promise.all([
      poolV3Contract.token0(),
      poolV3Contract.token1(),
      poolV3Contract.fee(),
      poolV3Contract.liquidity(),
      poolV3Contract.slot0(),
      poolV3Contract.tickSpacing(),
    ]);
    return {
      token0,
      token1,
      fee,
      liquidity,
      sqrtPriceX96: slot0[0],
      tick: slot0[1],
      tickSpacing,
    };
  };

  useEffect(() => {
    if (selectedFromProtocol?.value) {
      loadLpPairOptions(selectedFromProtocol.value, setLpFromPairOptions);
    }
    if (selectedToProtocol?.value) {
      loadLpPairOptions(selectedToProtocol.value, setLpToPairOptions);
    }
  }, [selectedFromProtocol, selectedToProtocol, chainId]);

  const handleProtocolSelect = (value: string, type: "from" | "to") => {
    const action = type === "from" ? selectFromProtocol : selectToProtocol;
    dispatch(action({ label: value, value }));
  };

  const handleLpPairSelect = (address: string, type: "from" | "to") => {
    if (type === "from") {
      setSelectedLpPair(address);
      dispatch(selectLpFromPairAddress(address));
      dispatch(selectLpToPairAddress(address));
    }
  };

  // const generateProtocolOptions = (
  //   chainProtocols: any,
  //   isToDropdown: boolean = false
  // ) => {
  //   const options: Option[] = [];
  //   if (chainProtocols && typeof chainProtocols === "object") {
  //     Object.entries(chainProtocols).forEach(([versionKey, versionValue]) => {
  //       if (isToDropdown && versionKey !== "v3") return;
  //       if (typeof versionValue === "object" && versionValue !== null) {
  //         Object.entries(versionValue).forEach(([protocolKey, protocolFromData]) => {
  //           if (protocolFromData && typeof protocolFromData === "object" && "name" in protocolFromData) {
  //             options.push({ label: protocolFromData.name, value: protocolKey });
  //           }
  //         });
  //       }
  //     });
  //   }
  //   return options;
  // };

  const generateProtocolOptions = (chainProtocols: any, isToDropdown: boolean = false) => {
    const options: Option[] = [];
    if (chainProtocols && typeof chainProtocols === "object") {
      Object.entries(chainProtocols).forEach(([versionKey, versionValue]) => {
        if (isToDropdown && versionKey !== "v3") return;

        if (typeof versionValue === "object" && versionValue !== null) {
          Object.entries(versionValue).forEach(([protocolKey, protocolFromData]) => {
            if (protocolFromData && typeof protocolFromData === "object" && "name" in protocolFromData) {
              // Exclude the selected "From" protocol for the "To" dropdown
              if (!isToDropdown || (isToDropdown && protocolKey !== selectedFromProtocol?.value)) {
                options.push({
                  label: protocolFromData.name,
                  value: protocolKey,
                });
              }
            }
          });
        }
      });
    }
    return options;
  };
  //@ts-ignore
  const chainProtocols = protocols[chainId?.toString()] as ProtocolVersion;
  const fromProtocolOptions = chainProtocols ? generateProtocolOptions(chainProtocols) : [];
  const toProtocolOptions = chainProtocols ? generateProtocolOptions(chainProtocols, true) : [];

  const prices = useSelector((state: RootState) => state.prices);

  const handleMinPriceChange = (delta: number): void => {
    dispatch(setMinPrice(prices.minPrice + delta));
  };

  const handleMaxPriceChange = (delta: number): void => {
    dispatch(setMaxPrice(prices.maxPrice + delta));
  };

  const handleClick = () => {};

  const [userBalance, setUserBalance] = useState("");
  const [migrationStatus, setMigrationStatus] = useState("");

  const [lpMigrator, setLpMigrator] = useState<Contract | null>(null);

  useEffect(() => {
    const initContract = async () => {
      try {
        // Assuming you are using MetaMask for web3 provider
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        await provider.send("eth_requestAccounts", []);

        console.log(" provider.getSigner()", provider.getSigner());

        // Replace with your contract's address

        console.log(chainId, contractAddresses);
        // @ts-ignore
        const contractAddress = contractAddresses[chainId];
        console.log("contractAddress", chainId, contractAddress);

        // Replace with your contract's ABI
        const lpMigratorAbi = LpMigrator;

        const lpMigratorContract = new ethers.Contract(contractAddress, lpMigratorAbi, provider.getSigner());
        console.log("lpMigratorContract", lpMigratorContract);
        setLpMigrator(lpMigratorContract);
      } catch (error) {
        console.error("Error initializing contract:", error);
      }
    };

    initContract();
  }, [chainId]);

  const getPositions = async () => {
    try {
    } catch (error) {}
  };

  const handleMigrate = async () => {
    try {
      // Connect to Ethereum network
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      await provider.send("eth_requestAccounts", []);
      const signer = provider.getSigner();

      console.log("singer", signer);
      // Add logic from your provided script here
      // For example, create contract instances, fetch user balance, etc.

      // Update state variables as needed
      // setUserBalance(...);
      // setMigrationStatus("Migration successful");
    } catch (error) {
      console.error(error);
      setMigrationStatus("Migration failed");
    }
  };

  function calculatePriceUsingTicks(tick: number, decimal0: number, decimal1: number) {
    // Calculate the price based on the tick
    const p = new BN(1.0001).pow(tick);

    // Create BigNumber instances for the unit conversion, respecting the decimals
    const unit0 = new BN(10).pow(decimal0);
    const unit1 = new BN(10).pow(decimal1);

    // Calculate the price and return the result as a string
    return p.multipliedBy(unit0).dividedBy(unit1).toString();
  }

  const [positionManager, setPositionManager] = useState<Contract | null>(null);

  const [positionManagerFrom, setPositionManagerFrom] = useState<Contract | null>(null);
  const [positionManagerTo, setPositionManagerTo] = useState<Contract | null>(null);

  const [fromPoolV3Contract, setFromPoolV3Contract] = useState<Contract | null>(null);
  const [toPoolV3Contract, setToPoolV3Contract] = useState<Contract | null>(null);

  // useEffect(() => {}, [chainId, selectedFromProtocol]);

  const handleMigrateFun = async () => {
    if (!chainId || !selectedFromProtocol || !selectedToProtocol) return;
    const tokenIds: BigNumber[] = [];
    try {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      await provider.send("eth_requestAccounts", []);

      const protocolFromKey = selectedFromProtocol.value;
      const protocolToKey = selectedToProtocol?.value;
      const protocolFromData = protocols[chainId.toString()].v3[protocolFromKey];
      console.log("protocolFromData", protocolFromData);
      const protocolToData = protocols[chainId.toString()].v3[protocolToKey];
      console.log("protocolToData", protocolToData);

      // Check if routerAddress is available in protocolFromData
      const positionMangerFromAddress = protocolFromData?.positionManagerAddress;

      const positionMangerToAddress = protocolToData?.positionManagerAddress || "";

      if (!positionMangerFromAddress) {
        console.error("Router address not found for the selected protocol");
        return;
      }

      const positionMangerFromContract = new ethers.Contract(
        positionMangerFromAddress,
        INonfungiblePositionManagerABI, // Replace with actual ABI
        provider.getSigner()
      );

      const positionMangerToContract = new ethers.Contract(
        positionMangerToAddress,
        INonfungiblePositionManagerABI, // Replace with actual ABI
        provider.getSigner()
      );
      console.log("positionMangerFromContract", positionMangerFromContract);
      if (address) {
        const noOfTokens = await positionMangerFromContract.balanceOf(address);
        console.log("noOfTokens", noOfTokens);
        for (let i = 0; i < noOfTokens.toNumber(); i++) {
          tokenIds.push(await positionMangerFromContract.tokenOfOwnerByIndex(address, i));
        }
        console.log("tokenIds", tokenIds);
      }
      setPositionManager(positionMangerFromContract);

      const userPositions = await Promise.all(tokenIds.map(async (id) => positionMangerFromContract.positions(id)));

      console.log("userPositions", userPositions);

      const userActivePortions: any = [];

      console.log(selectedLpPair, protocolFromData);
      const fromPairData = protocolFromData?.pairs[selectedLpPair];

      console.log(fromPairData);

      userPositions.map((data, i) => {
        console.log(ethers.utils.getAddress(data.token0), ethers.utils.getAddress(fromPairData.token0.address));
        console.log(ethers.utils.getAddress(data.token1), ethers.utils.getAddress(fromPairData.token1.address));
        //@ts-ignore
        console.log(data.fee, fromPairData?.fee.value);
        if (
          ethers.utils.getAddress(data.token0) == ethers.utils.getAddress(fromPairData.token0.address) &&
          ethers.utils.getAddress(data.token1) == ethers.utils.getAddress(fromPairData.token1.address) &&
          //@ts-ignore
          data.fee == fromPairData?.fee.value &&
          data.liquidity.gt(0)
        ) {
          userActivePortions.push({ ...data, tokenId: tokenIds[i] });
        }
      });

      console.log({ userActivePortions });

      const fromPoolV3Address = protocolFromData?.pairs[selectedLpPair]?.address;
      const toPoolV3Address = protocolToData?.pairs[selectedLpPair]?.address;

      const fromPoolV3Contract = new ethers.Contract(fromPoolV3Address, IUniswapV3Pool, provider.getSigner());
      const toPoolV3Contract = new ethers.Contract(toPoolV3Address, IUniswapV3Pool, provider.getSigner());
      setPositionManagerFrom(positionMangerFromContract);
      setPositionManagerTo(positionMangerToContract);
      setFromPoolV3Contract(fromPoolV3Contract);
      setToPoolV3Contract(toPoolV3Contract);

      let fromPoolInfo = await getPoolInfo(fromPoolV3Contract);
      let toPoolInfo = await getPoolInfo(toPoolV3Contract);
      let tickLower =
        nearestUsableTick(fromPoolInfo.tick, fromPoolInfo.tickSpacing) - fromPoolInfo.tickSpacing * prices.minPrice;
      let tickUpper =
        nearestUsableTick(fromPoolInfo.tick, fromPoolInfo.tickSpacing) + fromPoolInfo.tickSpacing * prices.maxPrice;

      const tokenId = userActivePortions[0].tokenId;
      const decreaseLiquidityParamsV3 = {
        positionManager: positionMangerFromAddress,
        tokenId: tokenId,
        liquidity: userActivePortions[0].liquidity,
        amount0ToAdd: 0,
        amount1ToAdd: 0,
        amount0Min: 0,
        amount1Min: 0,
        refundAsETH: false,
      };
      const addLiquidityParamsV3 = {
        positionManager: positionMangerToAddress,
        fee: toPoolInfo.fee,
        tickLower: tickLower,
        tickUpper: tickUpper,
        amount0Min: 0,
        amount1Min: 0,
      };

      if (lpMigrator) {
        let tx = await positionMangerFromContract.approve(lpMigrator.address, tokenId);
        let approvalReceipt = await tx.wait();
        tx = await lpMigrator.migrateLpFromV3ToV3(address, decreaseLiquidityParamsV3, addLiquidityParamsV3);
        let txReceipt = await tx.wait();
      }
    } catch (error) {
      console.error("Error initializing contract:", error);
    }
  };
  // useEffect(() => {
  //   const initContracts = async () => {
  //     if (!chainId || !selectedFromProtocol || !selectedToProtocol) return;

  //     try {
  //       const provider = new ethers.providers.Web3Provider(window.ethereum);
  //       await provider.send("eth_requestAccounts", []);

  //       const fromprotocolFromData =
  //         protocols[chainId.toString()]?.v3[selectedFromProtocol.value];
  //       const toprotocolFromData =
  //         protocols[chainId.toString()]?.v3[selectedToProtocol.value];

  //       const positionManagerFromAddress =
  //         fromprotocolFromData?.positionManagerAddress;
  //       const positionManagerToAddress = toprotocolFromData?.positionManagerAddress;

  //       // Assuming the selected LP pair is relevant to the 'from' protocol
  //       const fromPoolV3Address =
  //         fromprotocolFromData?.pairs[selectedLpPair]?.address;
  //       // For the 'to' protocol, it might be different depending on your application logic
  //       const toPoolV3Address = toprotocolFromData?.pairs[selectedLpPair]?.address;

  //       if (
  //         positionManagerFromAddress &&
  //         positionManagerToAddress &&
  //         fromPoolV3Address &&
  //         toPoolV3Address
  //       ) {
  //         const positionManagerFromContract = new ethers.Contract(
  //           positionManagerFromAddress,
  //           INonfungiblePositionManagerABI,
  //           provider.getSigner()
  //         );

  //         const positionManagerToContract = new ethers.Contract(
  //           positionManagerToAddress,
  //           INonfungiblePositionManagerABI,
  //           provider.getSigner()
  //         );

  //         const fromPoolV3Contract = new ethers.Contract(
  //           fromPoolV3Address,
  //           IUniswapV3Pool,
  //           provider.getSigner()
  //         );

  //         const toPoolV3Contract = new ethers.Contract(
  //           toPoolV3Address,
  //           IUniswapV3Pool,
  //           provider.getSigner()
  //         );

  //         setPositionManagerFrom(positionManagerFromContract);
  //         setPositionManagerTo(positionManagerToContract);
  //         setFromPoolV3Contract(fromPoolV3Contract);
  //         setToPoolV3Contract(toPoolV3Contract);

  //         let fromPoolInfo = await getPoolInfo(fromPoolV3Contract);
  //         let toPoolInfo = await getPoolInfo(toPoolV3Contract);
  //         let tickLower =
  //           nearestUsableTick(fromPoolInfo.tick, fromPoolInfo.tickSpacing) -
  //           fromPoolInfo.tickSpacing * prices.minPrice;
  //         let tickUpper =
  //           nearestUsableTick(fromPoolInfo.tick, fromPoolInfo.tickSpacing) +
  //           fromPoolInfo.tickSpacing * prices.maxPrice;
  //       }

  //       const tokenId = userActivePortions[0].tokenId;
  //       const decreaseLiquidityParamsV3 = {
  //         positionManager: sushiPositionManagerAddress,
  //         tokenId: tokenId,
  //         liquidity: userActivePortions[0].liquidity,
  //         amount0ToAdd: 0,
  //         amount1ToAdd: 0,
  //         amount0Min: 0,
  //         amount1Min: 0,
  //         refundAsETH: false,
  //       };
  //       const addLiquidityParamsV3 = {
  //         positionManager: uniPositionManagerAddress,
  //         fee: uniPoolInfo.fee,
  //         tickLower: tickLower,
  //         tickUpper: tickUpper,
  //         amount0Min: 0,
  //         amount1Min: 0,
  //       };
  //     } catch (error) {
  //       console.error("Error initializing contracts:", error);
  //     }
  //   };

  //   initContracts();
  // }, [chainId, selectedFromProtocol, selectedToProtocol, selectedLpPair]);

  return (
    <div className="w-full mx-auto max-w-2xl relative mt-32">
      <div className="flex flex-col justify-between items-center h-auto bg-[#fefeff] rounded-lg p-8">
        <div className="flex justify-around items-center w-full mb-8">
          <div className="">
            <p> From </p>
            <Dropdown
              options={fromProtocolOptions}
              onSelect={(value) => handleProtocolSelect(value, "from")}
              placeholder="Select Protocol"
            />
          </div>
          <div>
            <p>Select Pair</p>
            <Dropdown
              options={lpFromPairOptions}
              onSelect={(address) => handleLpPairSelect(address, "from")}
              placeholder="Select LP Pair"
            />
          </div>
        </div>
        <ArrowButton onClick={handleClick} />
        <div className="flex justify-around items-center w-full mb-8">
          <div>
            <p> To </p>
            <Dropdown
              options={toProtocolOptions}
              onSelect={(value) => handleProtocolSelect(value, "to")}
              placeholder="Select Protocol"
            />
          </div>
          <div>
            <p>Select Pair</p>
            <Dropdown
              options={lpFromPairOptions}
              onSelect={() => {}}
              placeholder="Select LP Pair"
              value={selectedLpPair}
              disabled={true}
            />
          </div>
        </div>
        {/* <div className="flex justify-between my-2">
          <p className="p-2">Current Price:</p>
          <p className="p-2"> 122r per eth</p>
        </div>
        <p>{chainId}</p>
        <p>{address}</p> */}
        <div className="flex justify-evenly gap-x-4 w-full">
          <PriceComponent
            label="Min Price"
            value={prices.minPrice}
            unit=""
            onIncrease={() => handleMinPriceChange(1)}
            onDecrease={() => handleMinPriceChange(-1)}
          />
          <PriceComponent
            label="Max Price"
            value={prices.maxPrice}
            unit=""
            onIncrease={() => handleMaxPriceChange(1)}
            onDecrease={() => handleMaxPriceChange(-1)}
          />
        </div>
        <button
          onClick={() => handleMigrateFun()}
          className="
        bg-[#27b992]
        px-4 py-2 
        rounded-md

        "
        >
          migrate
        </button>
      </div>
    </div>
  );
};

export default Home;
