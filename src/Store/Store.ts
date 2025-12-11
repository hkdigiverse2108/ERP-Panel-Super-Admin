import { configureStore } from "@reduxjs/toolkit";
import layoutSlice from "./Slices/LayoutSlice";
import AuthSlice from "./Slices/AuthSlice";

const Store = configureStore({
  reducer: {
    layout: layoutSlice,
    auth: AuthSlice,
  },
});

export default Store;

export type RootState = ReturnType<typeof Store.getState>;
export type AppDispatch = typeof Store.dispatch;
