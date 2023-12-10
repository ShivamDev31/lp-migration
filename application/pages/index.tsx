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

import ArrowButton from "@/components/ui/arrow-button";
import { RootState } from "../redux/store";
import { useDispatch, useSelector } from "react-redux";
import { Pair, ProtocolVersion, protocols } from "../const/protocols";
import PriceComponent from "@/components/ui/price-component";
import { setMinPrice, setMaxPrice } from "../redux/slices/priceSlice";
import { useAddress, useChainId } from "@thirdweb-dev/react";
import { ethers, Contract, BigNumber } from "ethers";
import LpMigrator from "../abi/LpMigrator.json";
import INonfungiblePositionManagerABI from "../abi/PositionManager.json";
const Home: NextPage = () => {
  const dispatch = useDispatch();
  const chainId = useChainId();
  const address = useAddress();

  // let chainIdString = chainId?.toString();

  // Access the specific protocol version (e.g., 'v3') you need.
  // const chainProtocolsV3 = chainIdString ? protocols[chainIdString]?.v3 : null;

  const selectedFromProtocol = useSelector(
    (state: RootState) => state.dropdown.selectedFromProtocol
  );
  const selectedToProtocol = useSelector(
    (state: RootState) => state.dropdown.selectedToProtocol
  );
  const [lpFromPairOptions, setLpFromPairOptions] = useState<Option[]>([]);
  const [lpToPairOptions, setLpToPairOptions] = useState<Option[]>([]);
  const [selectedLpPair, setSelectedLpPair] = useState<string>("");

  const chainIdString = chainId?.toString();
  let chainProtocols: ProtocolVersion | undefined;

  if (chainIdString && protocols[chainIdString]) {
    chainProtocols = protocols[chainIdString].v3;
  }

  useEffect(() => {
    if (selectedFromProtocol?.value && chainProtocols) {
      loadLpPairOptions(selectedFromProtocol.value, setLpFromPairOptions);
    }
    if (selectedToProtocol?.value && chainProtocols) {
      loadLpPairOptions(selectedToProtocol.value, setLpToPairOptions);
    }
  }, [selectedFromProtocol, selectedToProtocol, chainProtocols]);

  const loadLpPairOptions = (
    selectedProtocolKey: string,
    setLpPairOptions: React.Dispatch<React.SetStateAction<Option[]>>
  ) => {
    if (chainId) {
      const chainProtocols = protocols[chainId.toString()];
      if (chainProtocols) {
        ["v2", "v3"].forEach((version) => {
          const versionProtocols =
            chainProtocols[version as keyof typeof chainProtocols];

          if (versionProtocols) {
            const selectedProtocolData = versionProtocols[selectedProtocolKey];
            if (selectedProtocolData && selectedProtocolData.pairs) {
              const pairs = selectedProtocolData.pairs;
              const pairOptions = Object.entries(pairs).map(([key, value]) => {
                const pair = value as Pair; // Assuming Pair is the correct type
                return {
                  label: `${pair.token0.name}/${pair.token1.name}`,
                  value: key,
                };
              });

              setLpPairOptions(pairOptions);
            } else {
              setLpPairOptions([]);
            }
          }
        });
      }
    }
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
  //         Object.entries(versionValue).forEach(([protocolKey, protocolData]) => {
  //           if (protocolData && typeof protocolData === "object" && "name" in protocolData) {
  //             options.push({ label: protocolData.name, value: protocolKey });
  //           }
  //         });
  //       }
  //     });
  //   }
  //   return options;
  // };

  const generateProtocolOptions = (
    chainProtocols: any,
    isToDropdown: boolean = false
  ) => {
    const options: Option[] = [];
    if (chainProtocols && typeof chainProtocols === "object") {
      Object.entries(chainProtocols).forEach(([versionKey, versionValue]) => {
        if (isToDropdown && versionKey !== "v3") return;

        if (typeof versionValue === "object" && versionValue !== null) {
          Object.entries(versionValue).forEach(
            ([protocolKey, protocolData]) => {
              if (
                protocolData &&
                typeof protocolData === "object" &&
                "name" in protocolData
              ) {
                // Exclude the selected "From" protocol for the "To" dropdown
                if (
                  !isToDropdown ||
                  (isToDropdown && protocolKey !== selectedFromProtocol?.value)
                ) {
                  options.push({
                    label: protocolData.name,
                    value: protocolKey,
                  });
                }
              }
            }
          );
        }
      });
    }
    return options;
  };

  const fromProtocolOptions = chainProtocols
    ? generateProtocolOptions(chainProtocols)
    : [];
  const toProtocolOptions = chainProtocols
    ? generateProtocolOptions(chainProtocols, true)
    : [];

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

  const [lpMigrator, setLpMigrator] = useState<string | null>(null);
  useEffect(() => {
    const initContract = async () => {
      try {
        // Assuming you are using MetaMask for web3 provider
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        await provider.send("eth_requestAccounts", []);

        console.log(" provider.getSigner()", provider.getSigner());

        // Replace with your contract's address
        const contractAddress = "0xF5Bee5b02Ee854A71E0b43A2f69b1e017A7720C8";

        // Replace with your contract's ABI
        const lpMigratorAbi = LpMigrator;

        const lpMigratorContract = new ethers.Contract(
          contractAddress,
          lpMigratorAbi,
          provider.getSigner()
        );
        console.log("lpMigratorContract", lpMigratorContract);
        //setLpMigrator(lpMigratorContract as string);
      } catch (error) {
        console.error("Error initializing contract:", error);
      }
    };

    initContract();
  }, []);

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

  function calculatePriceUsingTicks(
    tick: number,
    decimal0: number,
    decimal1: number
  ) {
    const p = 1.0001 ** tick;
    return (p * decimal0) / decimal1;
  }

  const [positionManager, setPositionManager] = useState<Contract | null>(null);
  useEffect(() => {
    const initContract = async () => {
      if (!chainId || !selectedFromProtocol) return;
      const tokenIds: BigNumber[] = [];
      try {
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        await provider.send("eth_requestAccounts", []);

        if (!selectedFromProtocol?.value) return;
        const protocolKey = selectedFromProtocol.value;
        const protocolData = protocols[chainId.toString()].v3[protocolKey];
        console.log("protocolData", protocolData);

        // Check if routerAddress is available in protocolData
        const routerAddress = protocolData?.positionManagerAddress;
        if (!routerAddress) {
          console.error("Router address not found for the selected protocol");
          return;
        }

        const positionManagerContract = new ethers.Contract(
          routerAddress,
          INonfungiblePositionManagerABI, // Replace with actual ABI
          provider.getSigner()
        );
        console.log("positionManagerContract", positionManagerContract);
        if (address) {
          const noOfTokens = await positionManagerContract.balanceOf(address);
          console.log("noOfTokens", noOfTokens);
          for (let i = 0; i < noOfTokens.toNumber(); i++) {
            tokenIds.push(
              await positionManagerContract.tokenOfOwnerByIndex(address, i)
            );
          }
          console.log("tokenIds", tokenIds);
        }
        setPositionManager(positionManagerContract);

        const userPositions = await Promise.all(
          tokenIds.map(async (id) => positionManagerContract.positions(id))
        );

        console.log("userPositions", userPositions);

        const userActivePortions: any = [];

        userPositions.map((data, i) => {
          // console.log(data)
          // console.log(data.token0 == pairUni.token0.address)
          // console.log(data.token1, pairUni.token1.address, data.token1 == pairUni.token1.address)
          // console.log(data.fee, pairUni.fee.value, data.fee == pairUni.fee.value)
          // console.log(data.liquidity, data.liquidity.gt(0))
          // if (
          //   ethers.utils.getAddress(data.token0) ==
          //     ethers.utils.getAddress(pairUni.token0.address) &&
          //   ethers.utils.getAddress(data.token1) ==
          //     ethers.utils.getAddress(pairUni.token1.address) &&
          //   data.fee == pairUni.fee.value &&
          //   data.liquidity.gt(0)
          // ) {

          // }

          userActivePortions.push({ ...data, tokenId: tokenIds[i] });
        });
      } catch (error) {
        console.error("Error initializing contract:", error);
      }
    };

    initContract();
  }, [chainId, selectedFromProtocol]);
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
        <div className="flex justify-between my-2">
          <p className="p-2">Current Price:</p>
          <p className="p-2"> 122r per eth</p>
        </div>
        <p>{chainId}</p>
        <p>{address}</p>
        <div className="flex justify-evenly gap-x-4 w-full">
          <PriceComponent
            label="Min Price"
            value={prices.minPrice}
            unit="CAKE per BNB"
            onIncrease={() => handleMinPriceChange(1)}
            onDecrease={() => handleMinPriceChange(-1)}
          />
          <PriceComponent
            label="Max Price"
            value={prices.maxPrice}
            unit="CAKE per BNB"
            onIncrease={() => handleMaxPriceChange(1)}
            onDecrease={() => handleMaxPriceChange(-1)}
          />
        </div>
        <button
          onClick={() => handleMigrate()}
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
