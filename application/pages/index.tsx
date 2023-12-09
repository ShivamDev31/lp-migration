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
import { ProtocolVersion, protocols } from "../const/protocols";
import PriceComponent from "@/components/ui/price-component";
import { setMinPrice, setMaxPrice } from "../redux/slices/priceSlice";
import { useChainId } from "@thirdweb-dev/react";

const Home: NextPage = () => {
  const dispatch = useDispatch();
  const chainId = useChainId();
  const selectedFromProtocol = useSelector((state: RootState) => state.dropdown.selectedFromProtocol);
  const selectedToProtocol = useSelector((state: RootState) => state.dropdown.selectedToProtocol);
  const [lpFromPairOptions, setLpFromPairOptions] = useState<Option[]>([]);
  const [lpToPairOptions, setLpToPairOptions] = useState<Option[]>([]);
  const [selectedLpPair, setSelectedLpPair] = useState<string>("");

  const loadLpPairOptions = (
    selectedProtocolKey: string,
    setLpPairOptions: React.Dispatch<React.SetStateAction<Option[]>>
  ) => {
    if (chainId) {
      const chainProtocols = protocols[chainId.toString()];
      if (chainProtocols) {
        ["v2", "v3"].forEach((version) => {
          const versionProtocols = chainProtocols[version];
          if (versionProtocols) {
            const selectedProtocolData = versionProtocols[selectedProtocolKey];
            if (selectedProtocolData && selectedProtocolData.pairs) {
              const pairs = selectedProtocolData.pairs;
              const pairOptions = Object.entries(pairs).map(([key, value]) => ({
                label: `${value.token0.name}/${value.token1.name}`,
                value: key,
              }));
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

  const generateProtocolOptions = (
    chainProtocols: any,
    isToDropdown: boolean = false
  ) => {
    const options: Option[] = [];
    if (chainProtocols && typeof chainProtocols === "object") {
      Object.entries(chainProtocols).forEach(([versionKey, versionValue]) => {
        if (isToDropdown && versionKey !== "v3") return;
        if (typeof versionValue === "object" && versionValue !== null) {
          Object.entries(versionValue).forEach(([protocolKey, protocolData]) => {
            if (protocolData && typeof protocolData === "object" && "name" in protocolData) {
              options.push({ label: protocolData.name, value: protocolKey });
            }
          });
        }
      });
    }
    return options;
  };

  const chainProtocols = protocols[chainId?.toString()] as ProtocolVersion;
  const fromProtocolOptions = chainProtocols ? generateProtocolOptions(chainProtocols) : [];
  const toProtocolOptions = chainProtocols ? generateProtocolOptions(chainProtocols, true) : [];

  const prices = useSelector((state: RootState) => state.prices);

  const handleMinPriceChange = (delta: number): void => {
    dispatch(setMinPrice(prices.minPrice + delta));
  };

  const handleMaxPriceChange = (delta: number): void => {
    dispatch(setMaxPrice(prices.maxPrice + delta));
  };


  const handleClick = () => {};
  return (
    <div className="w-full mx-auto max-w-2xl relative mt-32">
      <div className="flex flex-col justify-between items-center h-auto bg-[#fefeff] rounded-lg p-8">
        <div className="flex justify-around items-center w-full mb-8">
          <div>
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
              options={lpFromPairOptions} // Use the same options as from dropdown
              onSelect={() => {}} // Empty function to prevent changes
              placeholder="Select LP Pair"
              value={selectedLpPair} // Set the value to be the same as the first dropdown
              disabled={true} // Disable the dropdown
            />
          </div>
        </div>
        <div className="flex justify-between my-2">
          <p className="p-2">Current Price:</p>
          <p className="p-2"> 122r per eth</p>
        </div>
        <p>{chainId}</p>
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
