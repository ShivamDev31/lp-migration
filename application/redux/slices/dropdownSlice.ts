import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Option } from "../../interfaces";

interface DropdownState {
  selectedFromProtocol: Option | null;
  selectedToProtocol: Option | null;
  selectedLpFromPairAddress: string | null;
  selectedLpToPairAddress: string | null;
}

const initialState: DropdownState = {
  selectedFromProtocol: null,
  selectedToProtocol: null,
  selectedLpFromPairAddress: null,
  selectedLpToPairAddress: null,
};

const dropdownSlice = createSlice({
  name: "dropdown",
  initialState,
  reducers: {
    selectFromProtocol: (state, action: PayloadAction<Option>) => {
      state.selectedFromProtocol = action.payload;
      state.selectedLpFromPairAddress = null;
    },
    selectLpFromPairAddress: (state, action: PayloadAction<string>) => {
      state.selectedLpFromPairAddress = action.payload;
    },

    selectToProtocol: (state, action: PayloadAction<Option>) => {
      state.selectedToProtocol = action.payload;
      state.selectedLpToPairAddress = null;
    },
    selectLpToPairAddress: (state, action: PayloadAction<string>) => {
      state.selectedLpToPairAddress = action.payload;
    },
  },
});

export const {
  selectFromProtocol,
  selectLpFromPairAddress,
  selectLpToPairAddress,
  selectToProtocol,
} = dropdownSlice.actions;
export default dropdownSlice.reducer;
