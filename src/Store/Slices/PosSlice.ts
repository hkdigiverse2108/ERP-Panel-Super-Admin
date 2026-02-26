import { createSlice } from "@reduxjs/toolkit";
import type { PosProductDataModal, PosSliceState } from "../../Types";

const initialState: PosSliceState = {
  isMultiplePay: false,
  isSelectProduct: "",
  isPosLoading: false,
  isBtnStatus: "",
  PosProduct: {
    items: [],
    customerId: "",
    orderType: "walk_in",
    salesManId: "",
    totalQty: 0,
    totalMrp: 0,
    totalTaxAmount: 0,
    totalDiscount: 0,
    totalAdditionalCharge: 0,
    flatDiscountAmount: 0,
    additionalCharges: [],
    roundOff: 0,
    remark: "",
    totalAmount: 0,
    posOrderId: "",
    couponId: "",
    couponDiscount: 0,
    loyaltyId: "",
    loyaltyDiscount: 0,
  },
};

const calculateAmounts = (row: PosProductDataModal) => {
  const net = (row.mrp - row.discount - row.additionalDiscount) * row.posQty;
  const taxRate = row.salesTaxId?.percentage || 0;

  const taxAmount = row.isSalesTaxIncluding ? net : (net * taxRate) / 100 + net;

  row.unitCost = Number((taxAmount / row.posQty).toFixed(2));
  row.netAmount = Number(taxAmount.toFixed(2));
};

const PosSlice = createSlice({
  name: "Pos",
  initialState,
  reducers: {
    setMultiplePay: (state) => {
      state.isMultiplePay = !state.isMultiplePay;
    },
    setPosLoading: (state, action) => {
      state.isPosLoading = action.payload;
    },
    setBtnStatus: (state, action) => {
      state.isBtnStatus = action.payload;
    },
    setIsSelectProduct: (state, action) => {
      state.isSelectProduct = action.payload;
    },

    setPosProduct: (state, action) => {
      state.PosProduct = action.payload;
    },

    addOrUpdateProduct: (state, action) => {
      if (!action.payload || !action.payload._id) return;

      const existingProduct = state.PosProduct.items.find((item) => item._id === action.payload._id);

      if (existingProduct) {
        if (existingProduct.posQty >= action.payload.qty) return;
        existingProduct.posQty += 1;
        calculateAmounts(existingProduct);
      } else {
        const newRow = {
          ...action.payload,
          posQty: 1,
          discount: action.payload.sellingDiscount || 0,
          additionalDiscount: 0,
          unitCost: 0,
          netAmount: 0,
        };

        calculateAmounts(newRow);
        state.PosProduct.items.push(newRow);
      }
    },
    updateProduct: (state, action) => {
      const row = state.PosProduct.items.find((item) => item._id === action.payload._id);
      if (!row) return;
      Object.assign(row, action.payload.data);
      calculateAmounts(row);
    },

    removeProduct: (state, action) => {
      state.PosProduct.items = state.PosProduct.items.filter((item) => item._id !== action.payload);
    },
    clearProductDataModal: (state) => {
      state.PosProduct.items = [];
    },
    clearPosProduct: (state) => {
      state.PosProduct = {
        items: [],
        customerId: "",
        orderType: "walk_in",
        salesManId: "",
        totalQty: 0,
        totalMrp: 0,
        totalTaxAmount: 0,
        totalDiscount: 0,
        totalAdditionalCharge: 0,
        flatDiscountAmount: 0,
        additionalCharges: [],
        roundOff: 0,
        remark: "",
        totalAmount: 0,
        posOrderId: "",
        couponId: "",
        couponDiscount: 0,
        loyaltyId: "",
        loyaltyDiscount: 0,
      };
      state.isSelectProduct = "";
    },

    setCustomerId: (state, action) => {
      state.PosProduct.customerId = action.payload;
    },

    setOrderType: (state, action) => {
      state.PosProduct.orderType = action.payload;
    },

    setSalesManId: (state, action) => {
      state.PosProduct.salesManId = action.payload;
    },

    setTotalQty: (state, action) => {
      state.PosProduct.totalQty = action.payload;
    },
    setTotalMrp: (state, action) => {
      state.PosProduct.totalMrp = action.payload;
    },
    setTotalDiscount: (state, action) => {
      state.PosProduct.totalDiscount = action.payload;
    },
    setTotalTaxAmount: (state, action) => {
      state.PosProduct.totalTaxAmount = action.payload;
    },
    setTotalAdditionalCharge: (state, action) => {
      state.PosProduct.totalAdditionalCharge = action.payload;
    },
    setFlatDiscountAmount: (state, action) => {
      state.PosProduct.flatDiscountAmount = action.payload;
    },
    setAdditionalCharges: (state, action) => {
      state.PosProduct.additionalCharges = action.payload;
    },
    setRoundOff: (state, action) => {
      state.PosProduct.roundOff = action.payload;
    },
    setRemarks: (state, action) => {
      state.PosProduct.remark = action.payload;
    },
    setTotalAmount: (state, action) => {
      state.PosProduct.totalAmount = action.payload;
    },
    setCoupon: (state, action) => {
      state.PosProduct.couponId = action.payload.couponId;
      state.PosProduct.couponDiscount = action.payload.couponDiscount;
    },
    setLoyalty: (state, action) => {
      state.PosProduct.loyaltyId = action.payload.loyaltyId;
      state.PosProduct.loyaltyDiscount = action.payload.loyaltyDiscount;
    },
  },
});

export const { setLoyalty, setCoupon, setBtnStatus, setPosLoading, setPosProduct, setIsSelectProduct, setAdditionalCharges, setTotalAdditionalCharge, setMultiplePay, updateProduct, removeProduct, clearProductDataModal, addOrUpdateProduct, setCustomerId, setSalesManId, setTotalMrp, setTotalDiscount, setTotalTaxAmount, setFlatDiscountAmount, setRoundOff, setTotalAmount, setTotalQty, setRemarks, setOrderType, clearPosProduct } = PosSlice.actions;
export default PosSlice.reducer;
