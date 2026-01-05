import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./slices/authSlice";
import storage from "redux-persist/lib/storage";
import {
  persistReducer,
  persistStore,
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
} from "redux-persist";

/* ================= PERSIST CONFIG ================= */

const persistConfig = {
  key: "root",
  storage,
  whitelist: ["auth"], // persist only auth slice
};

/* ================= PERSISTED REDUCER ================= */

const persistedReducer = persistReducer(persistConfig, authReducer);

/* ================= STORE ================= */

export const store = configureStore({
  reducer: {
    auth: persistedReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [
          FLUSH,
          REHYDRATE,
          PAUSE,
          PERSIST,
          PURGE,
          REGISTER,
        ],
      },
    }),
});

/* ================= PERSISTOR ================= */

export const persistor = persistStore(store);
