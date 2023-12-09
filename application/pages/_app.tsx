import { ThirdwebProvider } from "@thirdweb-dev/react";
import { CHAIN } from "../const/chains";
import { Inter } from "next/font/google";
import { Nav } from "../components/Navbar";
import Head from "next/head";
import "../styles/globals.css";
import type { AppProps } from "next/app";
import { Provider } from "react-redux";
import store from "../redux/store";
import { Polygon, Binance } from "@thirdweb-dev/chains";

const inter = Inter({ subsets: ["latin"] });

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <Provider store={store}>
      <div className={inter.className}>
        <Head>
          <title>LP Frontend</title>
          <meta name="description" content="Generated by create next app" />
          <meta name="viewport" content="width=device-width, initial-scale=1" />
          <link rel="icon" href="/favicon.ico" />
        </Head>
        <main className="">
          <ThirdwebProvider
            activeChain={Polygon}
            supportedChains={[Polygon, Binance]}
            authConfig={{
              domain: "LP Provider",
              authUrl: "/api/auth",
            }}
            clientId={process.env.NEXT_PUBLIC_THIRDWEB_API_KEY}
            autoConnect={true}
          >
            <Nav />
            <Component {...pageProps} />
          </ThirdwebProvider>
        </main>
      </div>
    </Provider>
  );
}

export default MyApp;
