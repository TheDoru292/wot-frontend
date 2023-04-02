import { createAsyncThunk } from "@reduxjs/toolkit";

const backendURL = "http://localhost:3000";

export const registerUser = createAsyncThunk(
  "auth/register",
  async (
    { username, password, handle, profile_picture_url },
    { rejectWithValue }
  ) => {
    try {
      await fetch(`${backendURL}/api/user/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username,
          password,
          handle,
          profile_picture_url,
        }),
      }).then((res) => res.json());
    } catch (error) {
      if (error.success == false && error.status) {
        return rejectWithValue(error.status);
      } else {
        return rejectWithValue("failed");
      }
    }
  }
);

export const userLogin = createAsyncThunk(
  "auth/login",
  async ({ username, password }, { rejectWithValue }) => {
    try {
      const data = await fetch(`${backendURL}/api/auth/login`, {
        method: "POST",
        credentials: "include",
        headers: {
          "Access-Control-Allow-Credentials": "true",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, password }),
      }).then((res) => res.json());

      console.log(data);

      localStorage.setItem("token", data.token);
      // localStorage.setItem("id", data.user._id);
      return data;
    } catch (err) {
      console.log(err);
      if (err.success == false && err.status) {
        return rejectWithValue(err.status);
      } else {
        return rejectWithValue("failed");
      }
    }
  }
);
