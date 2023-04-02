import { configureStore, getDefaultMiddleware } from "@reduxjs/toolkit";
import storage from "redux-persist/lib/storage";
import { combineReducers } from "@reduxjs/toolkit";
import { persistReducer } from "redux-persist";
import { authApi } from "./services/authService";
import authSlice from "./authSlice";

const reducers = combineReducers({
  auth: authSlice,
  [authApi.reducerPath]: authApi.reducer,
});

const persistConfig = {
  timeout: 1000,
  key: "root",
  storage,
};

const persistedReducer = persistReducer(persistConfig, reducers);

const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({ serializableCheck: false }),
});

export default store;
