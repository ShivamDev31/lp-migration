import type { NextPage } from "next";
import { useEffect, useState } from "react";
import { buttonVariants } from "@/components/ui/button";
import * as Select from "@radix-ui/react-select";

import Link from "next/link";
import WalletConnection from "@/components/demo/WalletConnection";
import UserAuthentication from "@/components/demo/UserAuthentication";
import DecentralizedStorage from "@/components/demo/DecentralizedStorage";
import ContractInteraction from "@/components/demo/ContractInteraction";
import { DropdownMenuItem } from "@thirdweb-dev/react/dist/declarations/src/wallet/ConnectWallet/Details";
import Dropdown from "@/components/ui/dropdown";
import { Option } from "../interfaces";
import {
  selectProtocol,
  selectLpPairAddress,
} from "../redux/slices/dropdownSlice";

import ArrowButton from "@/components/ui/arrow-button";
import { RootState } from "../redux/store";
// import { selectProtocol } from "../redux/slices/dropdownSlice";
import { useDispatch, useSelector } from "react-redux";
import { protocols } from "../const/protocols";

const Home: NextPage = () => {
  const dispatch = useDispatch();
  const selectedProtocol = useSelector(
    (state: RootState) => state.dropdown.selectedProtocol
  );
  const [lpPairOptions, setLpPairOptions] = useState<Option[]>([]);

  useEffect(() => {
    if (selectedProtocol && typeof selectedProtocol.value === "string") {
      if (selectedProtocol.value in protocols) {
        const selectedProtocolData = protocols[selectedProtocol.value];

        if ("pairs" in selectedProtocolData) {
          const pairs = selectedProtocolData.pairs;
          const pairOptions = Object.keys(pairs).map((pairKey) => ({
            label: pairKey,
            value: pairs[pairKey]["pair-address"],
          }));

          setLpPairOptions(pairOptions);

          // Automatically select the first pair address if pair options are available
          if (pairOptions.length > 0) {
            const firstPairAddress = pairOptions[0].value;
            dispatch(selectLpPairAddress(firstPairAddress));
          }
        } else {
          setLpPairOptions([]);
        }
      }
    }
  }, [selectedProtocol, dispatch]);

  const handleProtocolSelect = (value: string) => {
    dispatch(selectProtocol({ label: value, value }));
  };

  const handleLpPairSelect = (address: string) => {
    dispatch(selectLpPairAddress(address));
  };

  const protocolOptions = Object.keys(protocols).map((key) => ({
    label: key,
    value: key,
  }));

  const handleClick = (value: any) => {
    console.log("vlaue", value);
  };

  return (
    <div className="w-full mx-auto max-w-2xl relative mt-32">
      <div className="flex flex-col justify-between items-center h-auto bg-slate-400 rounded-lg p-8">
        <div className="flex justify-around items-center w-full mb-8">
          <Dropdown
            options={protocolOptions}
            onSelect={handleProtocolSelect}
            placeholder="Select Protocol"
          />
          <Dropdown
            options={lpPairOptions}
            onSelect={handleLpPairSelect}
            placeholder="Select LP Pair"
          />
        </div>
        <ArrowButton onClick={handleClick} />
        <div className="flex justify-around items-center w-full mt-8">
          {/* <Dropdown options={options} onSelect={handleSelect} />
          <Dropdown options={options} onSelect={handleSelect} /> */}
        </div>
      </div>
    </div>
  );
};

export default Home;
