import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  isHoldBillDrawer: false,
};

const DrawerSlice = createSlice({
  name: "Drawer",
  initialState,
  reducers: {
    setHoldBillDrawer: (state) => {
      state.isHoldBillDrawer = !state.isHoldBillDrawer;
    },
  },
});

export const { setHoldBillDrawer } = DrawerSlice.actions;
export default DrawerSlice.reducer;
