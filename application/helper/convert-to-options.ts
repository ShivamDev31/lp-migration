import { Option } from "../interfaces";

export const convertProtocolsToOptions = (
  protocols: Record<string, any>
): Option[] => {
  return Object.keys(protocols).map((key) => ({
    label: key,
    value: key,
  }));
};
