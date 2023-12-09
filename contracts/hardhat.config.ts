import { config as dotenvConfig } from "dotenv";
import "@nomicfoundation/hardhat-toolbox";
import { HardhatUserConfig } from "hardhat/config";

dotenvConfig();

const mainnetKey: string = process.env.MAINNET_KEY || "";
const testnetKey: string = process.env.TESTNET_KEY || "";
const alchemyApiKey: string = process.env.ALCHEMY_API_KEY || "";

const config: HardhatUserConfig = {
  solidity: {
    compilers: [
      {
        version: "0.8.20",
        settings: {
          optimizer: {
            enabled: true,
            runs: 500,
          },
          viaIR: true,
        },
      },
    ],
  },
  networks: {
    mainnet: {
      chainId: 1,
      url: `https://mainnet.infura.io/v3/${alchemyApiKey}`,
      accounts: [mainnetKey],
    },
    polygonMainnet: {
      chainId: 137,
      url: `https://polygon-mainnet.g.alchemy.com/v2/${alchemyApiKey}`,
      accounts: [mainnetKey],
    },
    arbitrum: {
      chainId: 42161,
      url: `https://arb-mainnet.g.alchemy.com/v2/${alchemyApiKey}`,
      accounts: [mainnetKey],
    },
  },
};

export default config;
