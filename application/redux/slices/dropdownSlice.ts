import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Option } from "../../interfaces";

interface DropdownState {
  selectedProtocol: Option | null;
  lpPair: string|null;
}

const initialState: DropdownState = {
  selectedProtocol: null,
  lpPair:null,
};

const dropdownSlice = createSlice({
  name: "dropdown",
  initialState,
  reducers: {
    selectProtocol: (state, action: PayloadAction<Option>) => {
      state.selectedProtocol = action.payload;
    },
    selectLpPair: (state, action: PayloadAction<string>) => {
      state.lpPair = action.payload;
    },
  },
});

export const { selectProtocol } = dropdownSlice.actions;
export default dropdownSlice.reducer;
