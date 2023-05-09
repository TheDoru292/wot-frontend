import { createAction, createAsyncThunk } from "@reduxjs/toolkit";

const backendURL = "https://wot-backend-production.up.railway.app";

export const registerUser = createAsyncThunk(
  "auth/register",
  async (
    { username, password, handle, profile_picture_url },
    { rejectWithValue }
  ) => {
    try {
      const data = await fetch(`${backendURL}/api/user/register`, {
        method: "POST",
        credentials: "include",
        headers: {
          "Access-Control-Allow-Credentials": "true",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username,
          password,
          handle,
          profile_picture_url,
        }),
      }).then((res) => res.json());

      localStorage.setItem("token", data.token);
      return data;
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
  async ({ handle, password }, { rejectWithValue }) => {
    try {
      const data = await fetch(`${backendURL}/api/auth/login`, {
        method: "POST",
        credentials: "include",
        headers: {
          "Access-Control-Allow-Credentials": "true",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ handle, password }),
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

export const editState = createAsyncThunk(
  "auth/edit",
  async (
    { pfpLink, coverUrl, username, bio },
    { rejectWithValue, getState }
  ) => {
    try {
      const state = getState();
      const user = {
        profile_picture_url: pfpLink,
        cover_url: coverUrl,
        username,
        bio,
      };

      const data = await fetch(
        `${backendURL}/api/user/${state.auth.userInfo.handle}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${state.auth.userToken}`,
          },
          body: JSON.stringify(user),
        }
      ).then((res) => res.json());

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
