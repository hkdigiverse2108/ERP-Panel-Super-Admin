import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { DetectedItem } from "../../Types";

interface BillSnapState {
  identifiedItems: DetectedItem[];
  capturedImage: string | null;
}

const initialState: BillSnapState = {
  identifiedItems: [],
  capturedImage: null,
};

const BillSnapSlice = createSlice({
  name: "billsnap",
  initialState,
  reducers: {
    setIdentifiedItems: (state, action: PayloadAction<DetectedItem[]>) => {
      state.identifiedItems = action.payload;
    },
    setCapturedImage: (state, action: PayloadAction<string | null>) => {
      state.capturedImage = action.payload;
    },
    clearBillSnap: (state) => {
      state.identifiedItems = [];
      state.capturedImage = null;
    },
  },
});

export const { setIdentifiedItems, setCapturedImage, clearBillSnap } = BillSnapSlice.actions;
export default BillSnapSlice.reducer;
