import { createSlice } from "@reduxjs/toolkit";
import type { ModalStateSlice } from "../../Types";

const initialState: ModalStateSlice = {
  isUploadModal: { open: false, type: "image", multiple: false },
  selectedFiles: [],
  isModalVideoPlay: { open: false, link: "" },
  isBrandModal: { open: false, data: null },
  isUomModal: { open: false, data: null },
  isTaxModal: { open: false, data: null },
  isCategoryModal: { open: false, data: null },
  isLocationModal: { open: false, data: null },
  isAccountGroupModal: { open: false, data: null },
  isAccountModal: { open: false, data: null },
  isRoleModal: { open: false, data: null },
  isModuleModal: { open: false, data: null },
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
    setUomModal: (state, action) => {
      state.isUomModal = action.payload;
    },
    setTaxModal: (state, action) => {
      state.isTaxModal = action.payload;
    },
    setCategoryModal: (state, action) => {
      state.isCategoryModal = action.payload;
    },
    setModalVideoPlay(state, action) {
      state.isModalVideoPlay = action.payload;
    },
    setLocationModal(state, action) {
      state.isLocationModal = action.payload;
    },
    setAccountGroupModal(state, action) {
      state.isAccountGroupModal = action.payload;
    },
    setAccountModal(state, action) {
      state.isAccountModal = action.payload;
    },
    setRoleModal(state, action) {
      state.isRoleModal = action.payload;
    },
    setModuleModal(state, action) {
      state.isModuleModal = action.payload;
    },
  },
});

export const { setModuleModal, setRoleModal, setUploadModal, setSelectedFiles, setModalVideoPlay, setBrandModal, setCategoryModal, setUomModal, setTaxModal, setLocationModal, setAccountGroupModal, setAccountModal } = ModalSlice.actions;

export default ModalSlice.reducer;
