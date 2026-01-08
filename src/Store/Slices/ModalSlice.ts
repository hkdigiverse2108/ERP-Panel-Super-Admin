import { createSlice } from "@reduxjs/toolkit";
import type { ModalStateSlice } from "../../Types";

const initialState: ModalStateSlice = {
  isUploadModal: { open: false, type: "image" },
  selectedFiles: [],
  isModalVideoPlay: { open: false, link: "" },
  isBrandModal: { open: false, data: null },
  isCategoryModal: { open: false, data: null },
};

const ModalSlice = createSlice({
  name: "modal",
  initialState,
  reducers: {
    setUploadModal: (state, action) => {
      state.isUploadModal = action.payload;
    },

    setSelectedFiles: (state, action) => {
      state.selectedFiles = action.payload;
    },
    setBrandModal: (state, action) => {
      state.isBrandModal = action.payload;
    },
    setCategoryModal: (state, action) => {
      state.isCategoryModal = action.payload;
    },
    setModalVideoPlay(state, action) {
      state.isModalVideoPlay = action.payload;
    },
  },
});

export const { setUploadModal, setSelectedFiles, setModalVideoPlay, setBrandModal, setCategoryModal } = ModalSlice.actions;

export default ModalSlice.reducer;
