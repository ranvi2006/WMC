import { configureStore } from "@reduxjs/toolkit";
import detailsReducer from "./slices/detailsSlice";
export const store = configureStore({
  reducer: {
    details: detailsReducer
  }
});
export default store;