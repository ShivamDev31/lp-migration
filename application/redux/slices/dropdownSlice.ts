import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Option } from "../../interfaces";

interface DropdownState {
  selectedProtocol: Option | null;
  selectedLpPairAddress: string | null;
}

const initialState: DropdownState = {
  selectedProtocol: null,
  selectedLpPairAddress: null,
};

const dropdownSlice = createSlice({
  name: "dropdown",
  initialState,
  reducers: {
    selectProtocol: (state, action: PayloadAction<Option>) => {
      state.selectedProtocol = action.payload;
      state.selectedLpPairAddress = null; // Reset LP pair address when a new protocol is selected
    },
    selectLpPairAddress: (state, action: PayloadAction<string>) => {
      state.selectedLpPairAddress = action.payload;
    },
  },
});

export const { selectProtocol, selectLpPairAddress } = dropdownSlice.actions;
export default dropdownSlice.reducer;
