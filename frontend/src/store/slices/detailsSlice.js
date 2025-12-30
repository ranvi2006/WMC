// src/store/slices/detailsSlice.js
import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  otpId: null,
  otp: null,          // store OTP only if you insist (not recommended)
  otpVerified: false,
    email: null,
    user:null,
};

const detailsSlice = createSlice({
  name: "details",
  initialState,
  reducers: {
    otpSetter: (state, action) => {
      state.otp=action.payload;
    },

    otpGetter: (state, action) => {
     return state.otp;
    },
     emailSetter: (state, action) => {
      state.email=action.payload;
    },
    emailGetter: (state, action) => {
     return state.email;
    },
    clearOtp: () => initialState
  }
});

export const { otpSetter, otpGetter, clearOtp } = detailsSlice.actions;
export default detailsSlice.reducer;
