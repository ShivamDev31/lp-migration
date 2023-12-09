import { ethers } from "hardhat";
import { WETH9 } from "@uniswap/sdk-core";

async function main() {
  const { chainId } = await ethers.provider.getNetwork();
  const [deployer] = await ethers.getSigners();

  console.log(`Deploying with account ${deployer.address} on ${chainId}`);
  console.log("Account balance deployer:", (await deployer.getBalance()).toString());

  /* ------------------------------------------- */

  const LpMigrator = await ethers.getContractFactory("LpMigrator");
  const lpMigrator = await LpMigrator.deploy(WETH9[chainId].address);
  await lpMigrator.deployed();

  console.log("lpMigrator", lpMigrator.address);

  /* ------------------------------------------- */
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
