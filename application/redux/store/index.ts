import { configureStore } from "@reduxjs/toolkit";
import dropdownReducer from "../slices/dropdownSlice";
import pricesReducer from "../slices/priceSlice"; 

const store = configureStore({
  reducer: {
    dropdown: dropdownReducer,
    prices: pricesReducer, 
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;
