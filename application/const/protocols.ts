interface Token {
  contract: string;
  name: string;
  symbol: string;
  decimals: number;
  logo: string;
}

interface Pair {
  "pair-address": string;
  "token-0": Token;
  "token-1": Token;
}

export interface Protocol {
  router: string;
  pairs: Record<string, Pair>;
}

interface Protocols {
  [key: string]: Protocol; // Add this index signature
  "uniswap v2": Protocol;
  "uniswap v3": Protocol; // Assuming "uniswap v3" has the same structure as "uniswap v2"
}
export const protocols = {
  "uniswap v2": {
    router: "",
    pairs: {
      "weth-usdt": {
        "pair-address": "",
        "token-0": {
          contract: "0x4200000000000000000000000000000000000006",
          name: "Wrapped Ether",
          symbol: "WETH",
          decimals: 18,
          logo: "https://tokens.1inch.io/0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2.png",
        },
        "token-1": {
          contract: "0x94b008aa00579c1307b0ef2c499ad98a8ce58e58",
          name: "Tether USD",
          symbol: "USDT",
          decimals: 6,
          logo: "https://tokens.1inch.io/0x94b008aa00579c1307b0ef2c499ad98a8ce58e58.png",
        },
      },
      "matic-usdt": {
        "pair-address": "",
        "token-0": {
          contract: "0x4200000000000000000000000000000000000006",
          name: "Wrapped Ether",
          symbol: "WETH",
          decimals: 18,
          logo: "https://tokens.1inch.io/0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2.png",
        },
        "token-1": {
          contract: "0x94b008aa00579c1307b0ef2c499ad98a8ce58e58",
          name: "Tether USD",
          symbol: "USDT",
          decimals: 6,
          logo: "https://tokens.1inch.io/0x94b008aa00579c1307b0ef2c499ad98a8ce58e58.png",
        },
      },
    },
  },
  "uniswap v3": {},
};
