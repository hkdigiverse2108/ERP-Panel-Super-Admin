import { createSlice } from "@reduxjs/toolkit";
import type { ModalStateSlice } from "../../Types";

const initialState: ModalStateSlice = {
  isUploadModal: { open: false, type: "image", multiple: false },
  selectedFiles: [],
  selectedTermIds: [],
  isModalVideoPlay: { open: false, link: "" },
  isBrandModal: { open: false, data: null },
  isUomModal: { open: false, data: null },
  isTaxModal: { open: false, data: null },
  isCategoryModal: { open: false, data: null },
  isLocationModal: { open: false, data: null },
  isRoleModal: { open: false, data: null },
  isTermsSelectionModal: { open: false, data: null },
  isAdditionalChargeModal: { open: false, data: null },
  isBankTransactionModal: { open: false, data: null },
  isOrderRefundModal: { open: false, data: null },
  isProductTypeModal: { open: false, data: null },
  isTermsAndConditionFormModal: { open: false, data: null, companyId: "" },
  isTermsAndConditionSelectionModal: {
    open: false,
    alreadySelectedIds: [],
    companyId: "",
  },
  isPrefixModal: { open: false, data: null },
  isConsumptionTypeModal: { open: false, data: null },
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
    setSelectedTermIds: (state, action) => {
      state.selectedTermIds = action.payload;
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
    setRoleModal(state, action) {
      state.isRoleModal = action.payload;
    },
    setBankTransactionModal: (state, action) => {
      state.isBankTransactionModal = action.payload;
    },
    setAdditionalChargeModal: (state, action) => {
      state.isAdditionalChargeModal = action.payload;
    },
    setOrderRefundModal: (state, action) => {
      state.isOrderRefundModal = action.payload;
    },
    setProductTypeModal: (state, action) => {
      state.isProductTypeModal = action.payload;
    },
    setTermsAndConditionFormModal: (state, action) => {
      state.isTermsAndConditionFormModal = action.payload;
    },
    setTermsAndConditionSelectionModal: (state, action) => {
      state.isTermsAndConditionSelectionModal = action.payload;
    },
    setPrefixModal: (state, action) => {
      state.isPrefixModal = action.payload;
    },
    setConsumptionTypeModal: (state, action) => {
      state.isConsumptionTypeModal = action.payload;
    },
  },
});

export const { setBankTransactionModal, setRoleModal, setUploadModal, setAdditionalChargeModal, setSelectedFiles, setSelectedTermIds, setModalVideoPlay, setBrandModal, setCategoryModal, setUomModal, setTaxModal, setLocationModal, setOrderRefundModal, setProductTypeModal, setTermsAndConditionFormModal, setTermsAndConditionSelectionModal, setPrefixModal, setConsumptionTypeModal } = ModalSlice.actions;

export default ModalSlice.reducer;
