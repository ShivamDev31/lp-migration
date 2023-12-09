import type { NextPage } from "next";
import { useState } from "react";
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
import ArrowButton from "@/components/ui/arrow-button";
import { RootState } from "../redux/store";
import { selectProtocol } from "../redux/slices/dropdownSlice";
import { useDispatch, useSelector } from "react-redux";
import { protocols } from "../const/protocols";

const tabs = [
  { name: "Wallet Connection", component: <WalletConnection /> },
  { name: "Contract Interaction", component: <ContractInteraction /> },
  { name: "User Authentication", component: <UserAuthentication /> },
  { name: "Decentralized Storage", component: <DecentralizedStorage /> },
];

const Home: NextPage = () => {
  // const [activeTab, setActiveTab] = useState<(typeof tabs)[number]>(tabs[0]);
  // const [selectedValue, setSelectedValue] = useState<string>("Apple");

  // const handleSelect = (value: string) => {
  //   setSelectedValue(value); // This will update the state with the selected value
  //   console.log(`You have selected: ${value}`);
  // };

  const dispatch = useDispatch();
  // Use useSelector hook to get the selected value from the store
  const selectedValue = useSelector(
    (state: RootState) => state.dropdown.selectedProtocol?.label
  );

  const handleSelect = (value: string) => {
    // Dispatch an action to update the selected value in the Redux store
    dispatch(selectProtocol({ label: value, value }));
    console.log(`You have selected: ${value}`);
  };
  const options: Option[] = [
    { label: "Apple", value: "apple" },
    { label: "Orange", value: "orange" },
  ];

  const handleClick = () => {
    console.log("The button was clicked!");
    // Define what should happen on click
  };

  const convertProtocolsToOptions = (
    protocols: Record<string, any>
  ): Option[] => {
    return Object.keys(protocols).map((key) => ({
      label: key,
      value: key,
    }));
  };

  const options1 = convertProtocolsToOptions(protocols);
  return (
   

    <div className="w-full mx-auto max-w-2xl relative mt-32">
      <div className="flex flex-col justify-between items-center h-auto bg-slate-400 rounded-lg p-8">
        <div className="flex justify-around items-center w-full mb-8">
          <Dropdown
            options={options1}
            onSelect={handleSelect}
            placeholder="To"
          />

          <Dropdown options={options} onSelect={handleSelect} />
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
