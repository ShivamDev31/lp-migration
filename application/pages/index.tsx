import type { NextPage } from "next";
import { useEffect, useState } from "react";

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
import { protocols } from "../const/protocols";
import PriceComponent from "@/components/ui/price-component";
import { setMinPrice, setMaxPrice } from "../redux/slices/priceSlice";

const Home: NextPage = () => {
  const dispatch = useDispatch();
  const selectedFromProtocol = useSelector(
    (state: RootState) => state.dropdown.selectedFromProtocol
  );
  const selectedToProtocol = useSelector(
    (state: RootState) => state.dropdown.selectedToProtocol
  );
  const [lpFromPairOptions, setLpFromPairOptions] = useState<Option[]>([]);
  const [lpToPairOptions, setLpToPairOptions] = useState<Option[]>([]);

  useEffect(() => {
    loadLpPairOptions(selectedFromProtocol, setLpFromPairOptions);
    loadLpPairOptions(selectedToProtocol, setLpToPairOptions);
  }, [selectedFromProtocol, selectedToProtocol]);

  const loadLpPairOptions = (
    selectedProtocol: typeof selectedFromProtocol, // Using the type of selectedFromProtocol for both cases
    setLpPairOptions: React.Dispatch<React.SetStateAction<Option[]>>
  ) => {
    if (selectedProtocol?.value) {
      const protocolData = protocols[selectedProtocol.value];
      const pairs = protocolData?.pairs || {};

      const pairOptions = Object.entries(pairs).map(([key, value]) => ({
        label: key,
        value: value["pair-address"],
      }));

      setLpPairOptions(pairOptions);
    } else {
      setLpPairOptions([]);
    }
  };
  const handleProtocolSelect = (value: string, type: "from" | "to") => {
    const action = type === "from" ? selectFromProtocol : selectToProtocol;
    dispatch(action({ label: value, value }));
  };

  const handleLpPairSelect = (address: string, type: "from" | "to") => {
    const action =
      type === "from" ? selectLpFromPairAddress : selectLpToPairAddress;
    dispatch(action(address));
  };

  const protocolOptions = Object.keys(protocols).map((key) => ({
    label: key,
    value: key,
  }));

  const handleClick = () => {
    console.log("vlaue");
  };

  const prices = useSelector((state: RootState) => state.prices);

  const handleMinPriceChange = (delta: number): void => {
    dispatch(setMinPrice(prices.minPrice + delta));
  };

  const handleMaxPriceChange = (delta: number): void => {
    dispatch(setMaxPrice(prices.maxPrice + delta));
  };

  return (
    <div className="w-full mx-auto max-w-2xl relative mt-32">
      <div className="flex flex-col justify-between items-center h-auto bg-[#fefeff] rounded-lg p-8">
        <div className="flex justify-around items-center w-full mb-8">
          <div>
            <p> From </p>
            <Dropdown
              options={protocolOptions}
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
              options={protocolOptions}
              onSelect={(value) => handleProtocolSelect(value, "to")}
              placeholder="Select Protocol"
            />
          </div>
          <div>
            <p>Select Pair</p>
            <Dropdown
              options={lpToPairOptions}
              onSelect={(address) => handleLpPairSelect(address, "to")}
              placeholder="Select LP Pair"
            />
          </div>
        </div>
        <div className="flex justify-between my-2">
          <p className="p-2">Current Price:</p>
          <p className="p-2"> 122r per eth</p>
        </div>
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
