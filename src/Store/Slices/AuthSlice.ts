import { createSlice } from "@reduxjs/toolkit";
import { STORAGE_KEYS } from "../../Constants";
import { Storage, Stringify } from "../../Utils";

const StoredUser = JSON.parse(Storage.getItem(STORAGE_KEYS.USER) || "null");

const initialState = {
  token: Storage.getItem(STORAGE_KEYS.TOKEN) || null,
  user: StoredUser || null,
  isAuthenticated: !!Storage.getItem(STORAGE_KEYS.TOKEN),
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setSignin: (state, action) => {
      state.token = action.payload.token;
      state.isAuthenticated = true;
      state.user = action.payload;
      Storage.setItem(STORAGE_KEYS.TOKEN, action.payload.token);
      Storage.setItem(STORAGE_KEYS.USER, Stringify(action.payload));
    },
    setSignOut(state) {
      state.token = null;
      state.user = null;
      state.isAuthenticated = false;
      Storage.clear();
    },
  },
});

export const { setSignOut, setSignin } = authSlice.actions;
export default authSlice.reducer;
