import { createSlice } from "@reduxjs/toolkit";
import { registerUser, userLogin, editState } from "./auth/authActions";

let userToken =
  typeof window !== "undefined" ? localStorage.getItem("userToken") : null;

const initialState = {
  loading: false,
  userInfo: null,
  userToken: userToken,
  error: null,
  success: false,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    logout: (state) => {
      state.loading = false;
      state.userInfo = null;
      state.userToken = null;
      state.error = null;
    },
  },
  extraReducers: {
    [registerUser.pending]: (state) => {
      state.loading = true;
      state.error = null;
    },
    [registerUser.fulfilled]: (state, { payload }) => {
      state.loading = false;
      state.success = true;
      state.userInfo = payload.user;
      state.userToken = payload.token;
    },
    [registerUser.rejected]: (state, { payload }) => {
      state.loading = false;
      state.error = payload;
    },
    [userLogin.pending]: (state) => {
      state.loading = true;
      state.error = null;
    },
    [userLogin.fulfilled]: (state, { payload }) => {
      state.loading = false;
      state.userInfo = payload.user;
      state.userToken = payload.token;
    },
    [userLogin.rejected]: (state, { payload }) => {
      state.loading = false;
      state.error = payload;
    },
    [editState.pending]: (state) => {
      state.loading = true;
      state.error = null;
    },
    [editState.fulfilled]: (state, { payload }) => {
      console.log("a");
      state.loading = false;
      state.success = true;
      state.userInfo = payload.user;
    },
    [editState.rejected]: (state, { payload }) => {
      state.loading = false;
      state.error = payload;
    },
  },
});

export const { logout } = authSlice.actions;
export default authSlice.reducer;
