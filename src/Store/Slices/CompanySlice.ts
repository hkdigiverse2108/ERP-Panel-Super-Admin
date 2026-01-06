import { createSlice } from "@reduxjs/toolkit";
import { Storage, Stringify } from "../../Utils";
import { STORAGE_KEYS } from "../../Constants";

const StoredCompany = JSON.parse(Storage.getItem(STORAGE_KEYS.COMPANY) || "null");

const initialState = {
  company: StoredCompany,
};

const companySlice = createSlice({
  name: "companySlice",
  initialState: initialState,
  reducers: {
    setCompany: (state, action) => {
      state.company = action.payload;
      Storage.setItem(STORAGE_KEYS.COMPANY, Stringify(action.payload));
    },
  },
});

export const { setCompany } = companySlice.actions;
export default companySlice.reducer;
