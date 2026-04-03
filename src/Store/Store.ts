import { configureStore } from "@reduxjs/toolkit";
import LayoutSlice from "./Slices/LayoutSlice";
import AuthSlice from "./Slices/AuthSlice";
import ModalSlice from "./Slices/ModalSlice";
import DrawerSlice from "./Slices/DrawerSlice";
import PosSlice from "./Slices/PosSlice";
import BillSnapSlice from "./Slices/BillSnapSlice";

const Store = configureStore({
  reducer: {
    layout: LayoutSlice,
    auth: AuthSlice,
    modal: ModalSlice,
    drawer: DrawerSlice,
    pos: PosSlice,
    billsnap: BillSnapSlice,
  },
});

export default Store;

export type RootState = ReturnType<typeof Store.getState>;
export type AppDispatch = typeof Store.dispatch;
