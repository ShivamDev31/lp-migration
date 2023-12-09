interface Token {
  name: string;
  decimal: number;
  address: string;
}

interface Pair {
  name: string;
  address: string;
  token0: Token;
  token1: Token;
  fee?: {
    percent: string;
    value: number;
  };
}

interface Protocol {
  name: string;
  routerAddress?: string;
  positionManagerAddress?: string;
  pairs: Record<string, Pair>;
}

export interface ProtocolVersion {
  [protocolName: string]: Protocol;
}

export interface Protocols {
  [chainId: string]: {
    v2: ProtocolVersion;
    v3: ProtocolVersion;
  };
}

export const protocols: Protocols = {
  "56": {
    v2: {
      "pancake-v2": {
        name: "PancakeSwapV2",
        routerAddress: "0x7a250d5630B4cF539739dF2C5dAcb4c659F2488D",
        pairs: {
          "usdt-wbnb": {
            name: "usdt/wbnb",
            address: "0x16b9a82891338f9ba80e2d6970fdda79d1eb0dae",
            token0: {
              name: "usdt",
              decimal: 18,
              address: "0x55d398326f99059ff775485246999027b3197955",
            },
            token1: {
              name: "wbnb",
              decimal: 18,
              address: "0xbb4CdB9CBd36B01bD1cBaEBF2De08d9173bc095c",
            },
          },
          "weth-usdt": {
            name: "weth/usdt",
            address: "0x531febfeb9a61d948c384acfbe6dcc51057aea7e",
            token0: {
              name: "weth",
              decimal: 18,
              address: "0x2170ed0880ac9a755fd29b2688956bd959f933f8",
            },
            token1: {
              name: "usdt",
              decimal: 18,
              address: "0x55d398326f99059ff775485246999027b3197955",
            },
          },
          "usdt-usdc": {
            name: "usdt/usdc",
            address: "0x4f31fa980a675570939b737ebdde0471a4be40eb",
            token0: {
              name: "usdt",
              decimal: 18,
              address: "0x55d398326f99059fF775485246999027B3197955",
            },
            token1: {
              name: "usdc",
              decimal: 18,
              address: "0x8AC76a51cc950d9822D68b83fE1Ad97B32Cd580d",
            },
          },
        },
      },
    },
    v3: {
      "pancake-v3": {
        name: "PancakeSwapV3",
        positionManagerAddress: "0x46A15B0b27311cedF172AB29E4f4766fbE7F4364",
        pairs: {
          "usdt-wbnb": {
            fee: {
              percent: "0.05",
              value: 500,
            },
            name: "usdt/wbnb",
            address: "0x36696169c63e42cd08ce11f5deebbcebae652050",
            token0: {
              name: "usdt",
              decimal: 18,
              address: "0x55d398326f99059ff775485246999027b3197955",
            },
            token1: {
              name: "wbnb",
              decimal: 18,
              address: "0xbb4CdB9CBd36B01bD1cBaEBF2De08d9173bc095c ",
            },
          },
          "weth-usdt": {
            fee: {
              percent: "0.05",
              value: 500,
            },
            name: "weth/usdt",
            address: "0xbe141893e4c6ad9272e8c04bab7e6a10604501a5",
            token0: {
              name: "weth",
              decimal: 18,
              address: "0x2170ed0880ac9a755fd29b2688956bd959f933f8",
            },
            token1: {
              name: "usdt",
              decimal: 18,
              address: "0x55d398326f99059ff775485246999027b3197955",
            },
          },
          "usdt-usdc": {
            fee: {
              percent: "0.01",
              value: 100,
            },

            name: "usdt/usdc",

            address: "0x92b7807bf19b7dddf89b706143896d05228f3121",
            token0: {
              name: "usdt",
              decimal: 18,
              address: "0x55d398326f99059fF775485246999027B3197955",
            },
            token1: {
              name: "usdc",
              decimal: 18,
              address: "0x8AC76a51cc950d9822D68b83fE1Ad97B32Cd580d",
            },
          },
        },
      },
      "uniswap-v3": {
        name: "UniSwapV3",
        positionManagerAddress: "0x0281E98322e4e8E53491D576Ee6A2BFCE644C55C",
        pairs: {
          "usdt-wbnb": {
            fee: {
              percent: "0.05",
              value: 500,
            },
            name: "usdt/wbnb",
            address: "0x6fe9e9de56356f7edbfcbb29fab7cd69471a4869",
            token0: {
              name: "usdt",
              decimal: 18,
              address: "0x55d398326f99059ff775485246999027b3197955",
            },
            token1: {
              name: "wbnb",
              decimal: 18,
              address: "0xbb4CdB9CBd36B01bD1cBaEBF2De08d9173bc095c ",
            },
          },
          "weth-usdt": {
            fee: {
              percent: "0.05",
              value: 500,
            },
            name: "weth/usdt",
            address: "0xf9878a5dd55edc120fde01893ea713a4f032229c",
            token0: {
              name: "weth",
              decimal: 18,
              address: "0x2170ed0880ac9a755fd29b2688956bd959f933f8",
            },
            token1: {
              name: "usdt",
              decimal: 18,
              address: "0x55d398326f99059ff775485246999027b3197955",
            },
          },
          "usdt-usdc": {
            name: "usdt/usdc",
            fee: {
              percent: "0.01",
              value: 100,
            },
            address: "0x2c3c320d49019d4f9a92352e947c7e5acfe47d68",
            token0: {
              name: "usdt",
              decimal: 18,
              address: "0x55d398326f99059fF775485246999027B3197955",
            },
            token1: {
              name: "usdc",
              decimal: 18,
              address: "0x8AC76a51cc950d9822D68b83fE1Ad97B32Cd580d",
            },
          },
        },
      },
    },
  },
  "137": {
    v2: {
      "sushiswap-v2": {
        name: "sushiswap-v2",

        routerAddress: "0x1b02dA8Cb0d097eB8D57A175b88c7D8b47997506",
        pairs: {
          "wmatic-usdt": {
            name: "wmatic/usdt",
            address: "0x0d500B1d8E8eF31E21C99d1Db9A6444d3ADf1270 ",
            token0: {
              name: "wMatic",
              decimal: 18,
              address: "0x2170ed0880ac9a755fd29b2688956bd959f933f8",
            },
            token1: {
              name: "usdt",
              decimal: 6,
              address: "0xc2132D05D31c914a87C6611C10748AEb04B58e8F",
            },
          },
          "weth-usdt": {
            name: "weth/usdt",
            address: "0xc2755915a85c6f6c1c0f3a86ac8c058f11caa9c9",
            token0: {
              name: "weth",
              decimal: 18,
              address: "0x7ceB23fD6bC0adD59E62ac25578270cFf1b9f619",
            },
            token1: {
              name: "usdt",
              decimal: 6,
              address: "0xc2132D05D31c914a87C6611C10748AEb04B58e8F",
            },
          },
          "usdc-usdt": {
            name: "usdc/usdt",
            address: "0x4b1f1e2435a9c96f7330faea190ef6a7c8d70001",
            token0: {
              name: "usdc",
              decimal: 6,
              address: "0x2791Bca1f2de4661ED88A30C99A7a9449Aa84174",
            },
            token1: {
              name: "usdt",
              decimal: 6,
              address: "0xc2132D05D31c914a87C6611C10748AEb04B58e8F",
            },
          },
        },
      },
    },
    v3: {
      "uniswap-v3": {
        name: "UniSwapV3",
        positionManagerAddress: "0x91ae842A5Ffd8d12023116943e72A606179294f3",
        pairs: {
          "wmatic-usdt": {
            fee: {
              percent: "0.05",
              value: 500,
            },
            name: "wmatic/usdt",
            address: "0x9b08288c3be4f62bbf8d1c20ac9c5e6f9467d8b7",
            token0: {
              name: "wmatic",
              decimal: 18,
              address: "0xc2132d05d31c914a87c6611c10748aeb04b58e8f",
            },
            token1: {
              name: "usdt",
              decimal: 6,
              address: "0xc2132d05d31c914a87c6611c10748aeb04b58e8f",
            },
          },
          "weth-usdt": {
            fee: {
              percent: "0.05",
              value: 500,
            },
            name: "weth/usdt",
            address: "0x4ccd010148379ea531d6c587cfdd60180196f9b1",
            token0: {
              name: "weth",
              decimal: 18,
              address: "0x7ceb23fd6bc0add59e62ac25578270cff1b9f619",
            },
            token1: {
              name: "usdt",
              decimal: 6,
              address: "0xc2132d05d31c914a87c6611c10748aeb04b58e8f",
            },
          },
          "usdc-usdt": {
            name: "usdc/usdt",
            fee: {
              percent: "0.01",
              value: 100,
            },
            address: "0xdac8a8e6dbf8c690ec6815e0ff03491b2770255d",
            token0: {
              name: "usdc",
              decimal: 6,
              address: "0xc2132d05d31c914a87c6611c10748aeb04b58e8f",
            },
            token1: {
              name: "usdt",
              decimal: 6,
              address: "0x2791bca1f2de4661ed88a30c99a7a9449aa84174",
            },
          },
        },
      },
      "sushiswap-v3": {
        name: "sushiswap-v3",
        positionManagerAddress: "0x8c990A53e3fc5e4dB1404baB33C6DfaCEABfFEcc",
        pairs: {
          "wmatic-usdt": {
            fee: {
              percent: "0.05",
              value: 500,
            },
            name: "wmatic/usdt",
            address: "3A0xc4e595acdd7d12fec385e5da5d43160e8a0bac0e",
            token0: {
              name: "wmatic",
              decimal: 18,
              address: "0xc2132d05d31c914a87c6611c10748aeb04b58e8f",
            },
            token1: {
              name: "usdt",
              decimal: 6,
              address: "0xc2132d05d31c914a87c6611c10748aeb04b58e8f",
            },
          },
          "weth-usdt": {
            fee: {
              percent: "0.05",
              value: 500,
            },
            name: "weth/usdt",
            address: "0xc2755915a85c6f6c1c0f3a86ac8c058f11caa9c9",
            token0: {
              name: "weth",
              decimal: 18,
              address: "0x7ceB23fD6bC0adD59E62ac25578270cFf1b9f619",
            },
            token1: {
              name: "usdt",
              decimal: 6,
              address: "0xc2132d05d31c914a87c6611c10748aeb04b58e8f",
            },
          },
          "usdc-usdt": {
            name: "usdc/usdt",
            fee: {
              percent: "0.01",
              value: 100,
            },
            address: "0x8cfaab34f5159abf9c35587ac40d09a05dc94765",
            token0: {
              name: "usdc",
              decimal: 6,
              address: "0xc2132d05d31c914a87c6611c10748aeb04b58e8f",
            },
            token1: {
              name: "usdt",
              decimal: 6,
              address: "0x2791bca1f2de4661ed88a30c99a7a9449aa84174",
            },
          },
        },
      },
    },
  },
};
