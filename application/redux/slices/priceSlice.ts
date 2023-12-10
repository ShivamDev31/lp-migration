import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface PricesState {
  minPrice: number;
  maxPrice: number;
}

const initialState: PricesState = {
  minPrice: 10,
  maxPrice: 15,
};

const pricesSlice = createSlice({
  name: "prices",
  initialState,
  reducers: {
    setMinPrice: (state, action: PayloadAction<number>) => {
      state.minPrice = action.payload;
    },
    setMaxPrice: (state, action: PayloadAction<number>) => {
      state.maxPrice = action.payload;
    },
    // Optionally, if you want to adjust both prices at once
    setPrices: (state, action: PayloadAction<PricesState>) => {
      const { minPrice, maxPrice } = action.payload;
      state.minPrice = minPrice;
      state.maxPrice = maxPrice;
    },
  },
});

export const { setMinPrice, setMaxPrice, setPrices } = pricesSlice.actions;
export default pricesSlice.reducer;
