// {
//   "uniswap v2":{
//     "router":"",
//     "pairs":{
//       "weth-usdt":{
//         "pair address":{

//         }
//       }
//     }
//   },
//   "uniswap v3":{

//   }
// }

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
          quote_rate: null,
          verified: true,
          balance: "0",
        },
        "token-1": {
          contract: "0x94b008aa00579c1307b0ef2c499ad98a8ce58e58",
          name: "Tether USD",
          symbol: "USDT",
          decimals: 6,
          logo: "https://tokens.1inch.io/0x94b008aa00579c1307b0ef2c499ad98a8ce58e58.png",
          quote_rate: null,
          verified: true,
          balance: "0",
        },
      },
    },
  },
  "uniswap v3": {},
};
