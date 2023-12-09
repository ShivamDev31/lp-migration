// import { ThirdwebProvider } from "@thirdweb-dev/react";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import {
  ConnectWallet,
  ThirdwebProvider,
  coinbaseWallet,
  localWallet,
  magicLink,
  metamaskWallet,
  safeWallet,
  smartWallet,
  walletConnect,
} from "@thirdweb-dev/react";
import { CHAIN } from "../const/chains";

const smartWalletConfig = {
  gasless: true,
  factoryAddress: process.env.NEXT_PUBLIC_WALLET_FACTORY as string,
};

const options = {
  "Browser Wallets": [metamaskWallet(), coinbaseWallet(), walletConnect()],
  "Safe Wallets": [safeWallet()],
  "Local Wallets": [localWallet()],
  "Email Wallets": [
    magicLink({
      apiKey: process.env.NEXT_PUBLIC_MAGIC_LINK_API_KEY as string,
    }),
  ],

  // Configure when smart wallets should be created based on the selected wallet.
  // E.g. Create a smart wallet when the user selects local wallet as EOA:
  "Smart Wallets (ERC4337)": [smartWallet(localWallet(), smartWalletConfig)],
};
export function Nav() {
  const [selectedOptions, setSelectedOptions] = useState<string[]>([
    "Browser Wallets",
  ]);

  return (
    <div className="w-full flex items-center justify-center fixed top-0 left-0 z-50 rounded-xl shadow-md backdrop-blur-lg">
      <nav className="flex items-center justify-between w-full max-w-7xl py-5 px-4 border-b-2">
        <div className="flex justify-between items-center w-full">
          <h1>LP Migration</h1>
          <ThirdwebProvider
            supportedWallets={
              selectedOptions.length === 0
                ? options["Browser Wallets"]
                : [
                    // For each selected option, spread the array of wallets into the supportedWallets array
                    ...selectedOptions
                      .map((option) => options[option as keyof typeof options])
                      .flat(),
                  ]
            }
            activeChain={CHAIN}
            clientId={process.env.NEXT_PUBLIC_THIRDWEB_API_KEY}
          >
            <ConnectWallet />
          </ThirdwebProvider>
        </div>
      </nav>
    </div>
  );
}
