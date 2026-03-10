import { createSlice } from "@reduxjs/toolkit";
import type { ModalStateSlice } from "../../Types";

const initialState: ModalStateSlice = {
  isUploadModal: { open: false, type: "image", multiple: false },
  selectedFiles: [],
  isModalVideoPlay: { open: false, link: "" },
  isCustomerModal: { open: false, data: null },
  isContactModal: { open: false, data: null },
  isBrandModal: { open: false, data: null },
  isUomModal: { open: false, data: null },
  isTaxModal: { open: false, data: null },
  isCategoryModal: { open: false, data: null },
  isLocationModal: { open: false, data: null },
  isAccountGroupModal: { open: false, data: null },
  isAccountModal: { open: false, data: null },
  isRoleModal: { open: false, data: null },
  isTermsAndConditionModal: { open: false, data: null },
  isTermsSelectionModal: { open: false, data: null },
  isProductTypeModal: { open: false, data: null },
  isPaymentListModal: false,
  isAddPaymentModal: false,
  isRedeemLoyaltyModal: false,
  isCreditNoteModal: false,
  isOrderModal: false,
  isCashControlModal: false,
  isRedeemCreditModal: false,
  isCardModal: false,
  isApplyCouponModal: false,
  isPayLaterModal: { open: false, data: [] },
  isCashModal: false,
  isAdditionalChargeModal: { open: false, data: null },
  isProductDetailsModal: { open: false, data: null },
  isQtyCountModal: { open: false, data: null },
  isOrderRefundModal: { open: false, data: null },
  isDiscardModal: false,
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
    setTermsAndConditionModal(state, action) {
      state.isTermsAndConditionModal = action.payload;
    },
    setTermsSelectionModal(state, action) {
      state.isTermsSelectionModal = action.payload;
    },setAdditionalChargeModal: (state, action) => {
      state.isAdditionalChargeModal = action.payload;
    },
     setOrderRefundModal: (state, action) => {
      state.isOrderRefundModal = action.payload;
    },
    setProductTypeModal: (state, action) => {
      state.isProductTypeModal = action.payload;
    },
  },
});

export const { setRoleModal, setUploadModal,setAdditionalChargeModal, setSelectedFiles, setModalVideoPlay, setBrandModal, setCategoryModal, setUomModal, setTaxModal, setLocationModal, setAccountGroupModal, setAccountModal, setTermsAndConditionModal,setTermsSelectionModal, setOrderRefundModal, setProductTypeModal } = ModalSlice.actions;

export default ModalSlice.reducer;
