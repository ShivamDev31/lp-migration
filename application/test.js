import { ethers } from 'hardhat'
import { networks } from '../common'
import { WETH9 } from '@uniswap/sdk-core'
import { INonfungiblePositionManager, IUniswapV3Pool, LpMigrator } from '../typechain-types'
import { readFileSync } from 'fs'
import { concat, formatUnits } from 'ethers/lib/utils'
import { BigNumber } from 'ethers'
import { nearestUsableTick } from '@uniswap/v3-sdk'

async function main() {
  const { chainId } = await ethers.provider.getNetwork()
  const networkName: string = networks[chainId]
  const [user] = await ethers.getSigners()

  console.log({ chainId, networkName, user: user.address, balance: formatUnits(await user.getBalance()) })

  /* ------------------------------------------- */

  const data = JSON.parse(readFileSync(__dirname + '/..' + '/data/data.json', 'utf8'))

  const dexKey = Object.keys(data[chainId].v3)
  const pairKeys = Object.keys(data[chainId].v3[dexKey[0]].pairs)
  console.log(pairKeys)

  /* ------------------------------------------- */
  // polygon

  const lpMigrator = await ethers.getContractAt('LpMigrator', '0xF5Bee5b02Ee854A71E0b43A2f69b1e017A7720C8')

  const uniPositionManagerAddress = data[chainId].v3[dexKey[0]].positionManagerAddress
  const sushiPositionManagerAddress = data[chainId].v3[dexKey[1]].positionManagerAddress
  const pairUni = data[chainId].v3[dexKey[0]].pairs[pairKeys[0]]
  const pairSushi = data[chainId].v3[dexKey[1]].pairs[pairKeys[0]]

  console.log({
    uniPositionManagerAddress,
    sushiPositionManagerAddress,
    pairUni,
    pairSushi,
  })

  const positionManageUni = (await ethers.getContractAt(
    'INonfungiblePositionManager',
    uniPositionManagerAddress
  )) as INonfungiblePositionManager

  const positionManageSushi = (await ethers.getContractAt(
    'INonfungiblePositionManager',
    sushiPositionManagerAddress
  )) as INonfungiblePositionManager

  const wMaticUsdtUniPoolV3Contract = (await ethers.getContractAt('IUniswapV3Pool', pairUni.address)) as IUniswapV3Pool

  const wMaticUsdtSushiPoolV3Contract = (await ethers.getContractAt(
    'IUniswapV3Pool',
    pairSushi.address
  )) as IUniswapV3Pool

  /* ------------------------------------------- */

  let uniPoolInfo = await getPoolInfo(wMaticUsdtUniPoolV3Contract)
  let sushiPoolInfo = await getPoolInfo(wMaticUsdtSushiPoolV3Contract)

  /* ------------------------------------------- */
  // uni to sushi
  const noOfTokens = await positionManageUni.balanceOf(user.address)
  const tokenIds: BigNumber[] = []
  for (let i = 0; i < noOfTokens.toNumber(); i++) {
    tokenIds.push(await positionManageUni.tokenOfOwnerByIndex(user.address, i))
  }
  console.log({ noOfTokens, tokenIds })

  const userPositions = await Promise.all(tokenIds.map(async (id) => positionManageUni.positions(id)))

  const userActivePortions: any = []
  userPositions.map((data, i) => {
    // console.log(data)
    // console.log(data.token0 == pairUni.token0.address)
    // console.log(data.token1, pairUni.token1.address, data.token1 == pairUni.token1.address)
    // console.log(data.fee, pairUni.fee.value, data.fee == pairUni.fee.value)
    // console.log(data.liquidity, data.liquidity.gt(0))
    if (
      ethers.utils.getAddress(data.token0) == ethers.utils.getAddress(pairUni.token0.address) &&
      ethers.utils.getAddress(data.token1) == ethers.utils.getAddress(pairUni.token1.address) &&
      data.fee == pairUni.fee.value &&
      data.liquidity.gt(0)
    ) {
      userActivePortions.push({ ...data, tokenId: tokenIds[i] })
    }
  })

  console.log({ userActivePortions })

  /* ------------------------------------------- */

  const tickLeftNo = 10
  const tickRightNo = 15

  let tickLower =
    Math.floor((sushiPoolInfo.tick - sushiPoolInfo.tickSpacing * tickLeftNo) / sushiPoolInfo.tickSpacing) *
    sushiPoolInfo.tickSpacing
  let tickUpper =
    Math.ceil((sushiPoolInfo.tick + sushiPoolInfo.tickSpacing * tickRightNo) / sushiPoolInfo.tickSpacing) *
    sushiPoolInfo.tickSpacing
  tickLower = nearestUsableTick(tickLower, sushiPoolInfo.tickSpacing)
  tickUpper = nearestUsableTick(tickUpper, sushiPoolInfo.tickSpacing)

  const priceLower = calculatePriceUsingTicks(tickLower, pairSushi.token0.decimal, pairSushi.token1.decimal)
  const priceHigher = calculatePriceUsingTicks(tickUpper, pairSushi.token0.decimal, pairSushi.token1.decimal)

  console.log({
    tickLower,
    tickUpper,
    priceLower,
    priceHigher,
  })

  /* ------------------------------------------- */

  const tokenId = userActivePortions[0].tokenId
  const decreaseLiquidityParamsV3 = {
    positionManager: uniPositionManagerAddress,
    tokenId: tokenId,
    liquidity: userActivePortions[0].liquidity,
    amount0ToAdd: 0,
    amount1ToAdd: 0,
    amount0Min: 0,
    amount1Min: 0,
    refundAsETH: false,
  }

  const addLiquidityParamsV3 = {
    positionManager: sushiPositionManagerAddress,
    fee: sushiPoolInfo.fee,
    tickLower: tickLower,
    tickUpper: tickUpper,
    amount0Min: 0,
    amount1Min: 0,
  }

  console.log({ decreaseLiquidityParamsV3, addLiquidityParamsV3 })

  // --------------

  //  const tx1 = await positionManageUni.connect(user).approve(lpMigrator.address, tokenId)
  //   await tx1.wait()

  const tx = await lpMigrator
    .connect(user)
    .migrateLpFromV3ToV3(user.address, decreaseLiquidityParamsV3, addLiquidityParamsV3)
  await tx.wait()

  // --------------

  const events = await lpMigrator.queryFilter(lpMigrator.filters.LPMigrated())

  const args = events[0].args
}

async function getPoolInfo(poolV3Contract: IUniswapV3Pool) {
  const [token0, token1, fee, liquidity, slot0, tickSpacing] = await Promise.all([
    poolV3Contract.token0(),
    poolV3Contract.token1(),
    poolV3Contract.fee(),
    poolV3Contract.liquidity(),
    poolV3Contract.slot0(),
    poolV3Contract.tickSpacing(),
  ])

  return {
    token0,
    token1,
    fee,
    liquidity,
    sqrtPriceX96: slot0[0],
    tick: slot0[1],
    tickSpacing,
  }
}
function calculatePriceUsingTicks(tick, decimal0, decimal1) {
  const p = 1.0001 ** tick
  return (p * decimal0) / decimal1
}

main().catch((error) => {
  console.error(error)
  process.exitCode = 1
})