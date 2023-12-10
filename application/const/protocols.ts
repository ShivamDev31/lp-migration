interface Token {
  name: string;
  decimal: number;
  address: string;
}

export interface Pair {
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
  [protocolName: string]: Protocol; // Adding index signature
}

export interface Protocols {
  [chainId: string]: {
    v3: ProtocolVersion;
    v2?: ProtocolVersion;
  };
}

export const contractAddresses = {
  "137": "0xF5Bee5b02Ee854A71E0b43A2f69b1e017A7720C8",
  "1101": "0xB0F2828f3751227115aAe873560EB613983a009d",
  "42161": "0x7782BA350D2CD7Be7140cE197cf17fCd325D62Fd",
  "534352": "0x479cDAAF40f5E42728C97e454623d67235ce4007",
  "8453": "0xB0F2828f3751227115aAe873560EB613983a009d",
};

export const protocols: Protocols = {
  "137": {
    v2: {
      "sushiswap-v2": {
        name: "SushiSwapV2",
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
        positionManagerAddress: "0xC36442b4a4522E871399CD717aBDD847Ab11FE88",
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
              address: "0x0d500B1d8E8eF31E21C99d1Db9A6444d3ADf1270",
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
        name: "SushiSwapV3",
        positionManagerAddress: "0xb7402ee99F0A008e461098AC3A27F4957Df89a40",
        pairs: {
          "wmatic-usdt": {
            fee: {
              percent: "0.3",
              value: 3000,
            },
            name: "wmatic/usdt",
            address: "0xdb0101be2132408e65b30246aa662e4d6f49599c",
            token0: {
              name: "wmatic",
              decimal: 18,
              address: "0x0d500B1d8E8eF31E21C99d1Db9A6444d3ADf1270",
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
  "1101": {
    v2: {},
    v3: {
      "pancake-v3": {
        name: "PancakeSwapV3",
        positionManagerAddress: "0x46A15B0b27311cedF172AB29E4f4766fbE7F4364",
        pairs: {
          "weth-wmatic": {
            fee: {
              percent: "0.05",
              value: 500,
            },
            name: "weth/wmatic",
            address: "0x7a816241edaf060e33b774d6d3d6398485dff9af",
            token0: {
              name: "weth",
              decimal: 18,
              address: "0x4f9a0e7fd2bf6067db6994cf12e4495df938e6e9",
            },
            token1: {
              name: "wmatic",
              decimal: 18,
              address: "0xa2036f0538221a77a3937f1379699f44945018d0",
            },
          },
          "usdt-usdc": {
            fee: {
              percent: "0.01",
              value: 100,
            },
            name: "usdt/usdc",
            address: "0xca06375be938a2d6ef311dfafab7e326d55d23cc",
            token0: {
              name: "usdt",
              decimal: 6,
              address: "0x1e4a5963abfd975d8c9021ce480b42188849d41d",
            },
            token1: {
              name: "usdc",
              decimal: 6,
              address: "0xa8ce8aee21bc2a48a5ef670afcc9274c7bbbc035",
            },
          },
        },
      },
      "sushiswap-v3": {
        name: "SushiSwapV3",
        positionManagerAddress: "0xF4d73326C13a4Fc5FD7A064217e12780e9Bd62c3",
        pairs: {
          "weth-matic": {
            fee: {
              percent: "0.01",
              value: 100,
            },
            name: "weth/matic",
            address: "0xc063f9ab38dd6c45fcbe9fd4f7dd5edf8e7503a1",
            token0: {
              name: "weth",
              decimal: 18,
              address: "0x4f9a0e7fd2bf6067db6994cf12e4495df938e6e9",
            },
            token1: {
              name: "matic",
              decimal: 18,
              address: "0xa2036f0538221a77a3937f1379699f44945018d0",
            },
          },
          "usdt-usdc": {
            fee: {
              percent: "0.01",
              value: 100,
            },
            name: "usdt/usdc",
            address: "0x1a59ac9eb718c7619904aa2456ee954e42f12f29",
            token0: {
              name: "usdt",
              decimal: 6,
              address: "0x1e4a5963abfd975d8c9021ce480b42188849d41d",
            },
            token1: {
              name: "usdc",
              decimal: 6,
              address: "0xa8ce8aee21bc2a48a5ef670afcc9274c7bbbc035",
            },
          },
        },
      },
    },
  },
  "8453": {
    v2: {},
    v3: {
      "sushiswap-v3": {
        name: "SushiSwapV3",
        positionManagerAddress: "0x80C7DD17B01855a6D2347444a0FCC36136a314de",
        pairs: {
          "weth-usdbc": {
            fee: {
              percent: "0.05",
              value: 500,
            },
            name: "weth/usdbc",
            address: "0x22ca6d83ab887a535ae1c6011cc36ea9d1255c31",
            token0: {
              name: "weth",
              decimal: 18,
              address: "0x4200000000000000000000000000000000000006",
            },
            token1: {
              name: "usdbc",
              decimal: 6,
              address: "0xd9aAEc86B65D86f6A7B5B1b0c42FFA531710b6CA",
            },
          },
          "weth-toshi": {
            fee: {
              percent: "1",
              value: 10000,
            },
            name: "weth/toshi",
            address: "0x5f0a153a64fd734c111b770da11de2c385ca8042",
            token0: {
              name: "weth",
              decimal: 18,
              address: "0x4200000000000000000000000000000000000006",
            },
            token1: {
              name: "toshi",
              decimal: 18,
              address: "0x8544FE9D190fD7EC52860abBf45088E81Ee24a8c",
            },
          },
          "bald-weth": {
            fee: {
              percent: "1",
              value: 10000,
            },
            name: "bald/weth",
            address: "0x23e55d60b685d794ec83d0f9489bc5ce027ebc7b",
            token0: {
              name: "bald",
              decimal: 18,
              address: "0x27D2DECb4bFC9C76F0309b8E88dec3a601Fe25a8",
            },
            token1: {
              name: "weth",
              decimal: 18,
              address: "0x4200000000000000000000000000000000000006",
            },
          },
        },
      },
      "uniswap-v3": {
        name: "UniSwapV3",
        positionManagerAddress: "0x03a520b32C04BF3bEEf7BEb72E919cf822Ed34f1",
        pairs: {
          "weth-usdbc": {
            fee: {
              percent: "0.05",
              value: 500,
            },
            name: "weth/usdbc",
            address: "0x4c36388be6f416a29c8d8eee81c771ce6be14b18",
            token0: {
              name: "weth",
              decimal: 18,
              address: "0x4200000000000000000000000000000000000006",
            },
            token1: {
              name: "usdbc",
              decimal: 6,
              address: "0xd9aAEc86B65D86f6A7B5B1b0c42FFA531710b6CA",
            },
          },
          "weth-mochi": {
            fee: {
              percent: "1",
              value: 10000,
            },
            name: "weth/mochi",
            address: "0xfcc89a1f250d76de198767d33e1ca9138a7fb54b",
            token0: {
              name: "weth",
              decimal: 18,
              address: "0x4200000000000000000000000000000000000006",
            },
            token1: {
              name: "mochi",
              decimal: 18,
              address: "0xf6e932ca12afa26665dc4dde7e27be02a7c02e50",
            },
          },
        },
      },
    },
  },
  "42161": {
    v2: {},
    v3: {
      "sushiswap-v3": {
        name: "SushiSwapV3",
        positionManagerAddress: "0xF0cBce1942A68BEB3d1b73F0dd86C8DCc363eF49",
        pairs: {
          "weth-usdt": {
            fee: {
              percent: "0.3",
              value: 3000,
            },
            name: "weth-usdt",
            address: "3A0xcb0e5bfa72bbb4d16ab5aa0c60601c438f04b4ad",
            token0: {
              name: "weth",
              decimal: 18,
              address: "0x82af49447d8a07e3bd95bd0d56f35241523fbab1",
            },
            token1: {
              name: "usdt",
              decimal: 6,
              address: "0xFd086bC7CD5C481DCC9C85ebE478A1C0b69FCbb9",
            },
          },
          "wbtc-weth": {
            fee: {
              percent: "0.3",
              value: 3000,
            },
            name: "wbtc/weth",
            address: "3A0x515e252b2b5c22b4b2b6df66c2ebeea871aa4d69",
            token0: {
              name: "wbtc",
              decimal: 18,
              address: "0x2f2a2543b76a4166549f7aab2e75bef0aefc5b0f",
            },
            token1: {
              name: "weth",
              decimal: 18,
              address: "0x82af49447d8a07e3bd95bd0d56f35241523fbab1",
            },
          },
          "weth-arb": {
            name: "weth/arb",
            fee: {
              percent: "0.3",
              value: 3000,
            },
            address: "3A0xb3942c9ffa04efbc1fa746e146be7565c76e3dc1",
            token0: {
              name: "weth",
              decimal: 18,
              address: "0x82aF49447D8a07e3bd95BD0d56f35241523fBab1",
            },
            token1: {
              name: "arb",
              decimal: 18,
              address: "0x912ce59144191c1204e64559fe8253a0e49e6548",
            },
          },
        },
      },
      "uniswap-v3": {
        name: "UniSwapV3",
        positionManagerAddress: "0xC36442b4a4522E871399CD717aBDD847Ab11FE88",
        pairs: {
          "weth-usdc": {
            fee: {
              percent: "0.05",
              value: 500,
            },
            name: "weth-usdc",
            address: "0xc31e54c7a869b9fcbecc14363cf510d1c41fa443",
            token0: {
              name: "weth",
              decimal: 18,
              address: "0x82af49447d8a07e3bd95bd0d56f35241523fbab1",
            },
            token1: {
              name: "usdc",
              decimal: 6,
              address: "0xff970a61a04b1ca14834a43f5de4533ebddb5cc8",
            },
          },
          "wbtc-weth": {
            fee: {
              percent: "0.05",
              value: 500,
            },
            name: "wbtc/weth",
            address: "0x2f5e87c9312fa29aed5c179e456625d79015299c",
            token0: {
              name: "wbtc",
              decimal: 18,
              address: "0x2f2a2543b76a4166549f7aab2e75bef0aefc5b0f",
            },
            token1: {
              name: "weth",
              decimal: 18,
              address: "0x82af49447d8a07e3bd95bd0d56f35241523fbab1",
            },
          },
          "weth-arb": {
            name: "weth/arb",
            fee: {
              percent: "0.01",
              value: 100,
            },
            address: "0xdac8a8e6dbf8c690ec6815e0ff03491b2770255d",
            token0: {
              name: "weth",
              decimal: 18,
              address: "0x82af49447d8a07e3bd95bd0d56f35241523fbab1",
            },
            token1: {
              name: "arb",
              decimal: 18,
              address: "0x912ce59144191c1204e64559fe8253a0e49e6548",
            },
          },
        },
      },
    },
  },
  "534352": {
    v2: {},
    v3: {
      "sushiswap-v3": {
        name: "SushiSwapV3",
        positionManagerAddress: "0x0389879e0156033202C44BF784ac18fC02edeE4f",
        pairs: {
          "usdc-weth": {
            fee: {
              percent: "0.3",
              value: 3000,
            },
            name: "usdc-weth",
            address: "0xe64ae4128e725868e8fe52e771e3d272e787b041",
            token0: {
              name: "usdc",
              decimal: 6,
              address: "0x06eFdBFf2a14a7c8E15944D1F4A48F9F95F663A4",
            },
            token1: {
              name: "weth",
              decimal: 18,
              address: "0x5300000000000000000000000000000000000004",
            },
          },
          "wbtc-weth": {
            fee: {
              percent: "0.3",
              value: 3000,
            },
            name: "wbtc/weth",
            address: "0x08d8b29864348f8d1b7266bf02879c9d0af04eba",
            token0: {
              name: "wbtc",
              decimal: 8,
              address: "0x3C1BCa5a656e69edCD0D4E36BEbb3FcDAcA60Cf1",
            },
            token1: {
              name: "weth",
              decimal: 18,
              address: "0x5300000000000000000000000000000000000004",
            },
          },
          "usdc-usdt": {
            name: "usdc/usdt",
            fee: {
              percent: "0.01",
              value: 100,
            },
            address: "0x5300000000000000000000000000000000000004",
            token0: {
              name: "usdc",
              decimal: 6,
              address: "0x06eFdBFf2a14a7c8E15944D1F4A48F9F95F663A4",
            },
            token1: {
              name: "usdt",
              decimal: 6,
              address: "0xf55BEC9cafDbE8730f096Aa55dad6D22d44099Df",
            },
          },
        },
      },
    },
  },
};
