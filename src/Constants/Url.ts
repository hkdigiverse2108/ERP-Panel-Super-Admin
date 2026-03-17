export const URL_KEYS = {
  AUTH: {
    SIGNIN: "/auth/login",
    CHANGE_PASSWORD: "/auth/reset-password",
    VERIFY_OTP: "/auth/verify-otp",
    RESEND_OTP: "/auth/resend-otp",
  },
  UPLOAD: {
    ADD: "/upload",
    DELETE: "/upload",
    ALL_IMAGE: "/upload/images",
    ALL_PDF: "/upload/pdf",
  },
  ADMIN_SETTING: {
    BASE: "/settings",
    ALL: "/settings/all",
    UPDATE: "/settings/update",
  },

  COMPANY: {
    BASE: "/company",
    DROPDOWN: "/company/dropdown",
    ALL: "/company/all",
    ADD: "/company/add",
    EDIT: "/company/edit",
  },

  USER: {
    BASE: "/user",
    ALL: "/user/all",
    ADD: "/user/add",
    EDIT: "/user/edit",
    DROPDOWN: "/user/dropdown",
  },

  LOCATION: {
    BASE: "/location",
    ALL: "/location/all",
    COUNTRY: "/location/country",
    STATE: "/location/state",
    CITY: "/location/city",
    ADD: "/location/add",
    EDIT: "/location/edit",
  },
  MODULE: {
    BASE: "/module",
    DROPDOWN: "/module/dropdown",
    ALL: "/module/all",
    ADD: "/module/add",
    EDIT: "/module/edit",
    USER_PERMISSION: "/module/user/permissions",
    BULK_EDIT: "/module/bulk/edit",
  },
  PERMISSION: {
    BASE: "/permission",
    DETAILS: "/permission/details",
    CHILD: "/permission/child/details",
    ALL: "/permission/all",
    EDIT: "/permission/edit",
  },
  BRANCH: {
    BASE: "/branch",
    DROPDOWN: "/branch/dropdown",
    ALL: "/branch/all",
    ADD: "/branch/add",
    EDIT: "/branch/edit",
  },
  ANNOUNCEMENT: {
    ALL: "/announcement/all",
    ADD: "/announcement/add",
    EDIT: "/announcement/edit",
    BASE: "/announcement",
  },
  CALL_REQUEST: {
    BASE: "/call-request",
    ADD: "/call-request/add",
    EDIT: "/call-request/edit",
    ALL: "/call-request/all",
  },
  ROLE: {
    BASE: "/role",
    DROPDOWN: "/role/dropdown",
    ALL: "/role/all",
    ADD: "/role/add",
    EDIT: "/role/edit",
  },
  // ----------------------------- bank -----------------------------
  BANK: {
    BASE: "/bank",
    DROPDOWN: "/bank/dropdown",
    ALL: "/bank/all",
    ADD: "/bank/add",
    EDIT: "/bank/edit",
  },

  // ----------------------------- inventory -----------------------------
  PRODUCT: {
    BASE: "/product",
    DROPDOWN: "/product/dropdown",
    ADD: "/product/add",
    ALL: "/product/all",
    EDIT: "/product/edit",
  },
  UOM: {
    BASE: "/uom",
    DROPDOWN: "/uom/dropdown",
    ALL: "/uom/all",
    ADD: "/uom/add",
    EDIT: "/uom/edit",
  },
  TAX: {
    BASE: "/tax",
    DROPDOWN: "/tax/dropdown",
    ALL: "/tax/all",
    ADD: "/tax/add",
    EDIT: "/tax/edit",
  },
  CATEGORY: {
    BASE: "/category",
    DROPDOWN: "/category/dropdown",
    ALL: "/category/all",
    ADD: "/category/add",
    EDIT: "/category/edit",
  },
  BRAND: {
    BASE: "/brand",
    DROPDOWN: "/brand/dropdown",
    ALL: "/brand/all",
    ADD: "/brand/add",
    EDIT: "/brand/edit",
  },
  STOCK: {
    BASE: "/stock",
    ALL: "/stock/all",
    ADD: "/stock/add",
    BULK_ADJUSTMENT: "/stock/bulk-adjustment",
  },
  MATERIAL_CONSUMPTION: {
    BASE: "/material-consumption",
    DROPDOWN: "/material-consumption/dropdown",
    ALL: "/material-consumption/all",
    ADD: "/material-consumption/add",
    EDIT: "/material-consumption/edit",
  },
  RECIPE: {
    BASE: "/recipe",
    DROPDOWN: "/recipe/dropdown",
    ALL: "/recipe/all",
    ADD: "/recipe/add",
    EDIT: "/recipe/edit",
  },
  STOCK_VERIFICATION: {
    BASE: "/stock-verification",
    ALL: "/stock-verification/all",
    ADD: "/stock-verification/add",
    EDIT: "/stock-verification/edit",
  },
  BILL_OF_LIVE_PRODUCT: {
    BASE: "/bill-of-live-product",
    ALL: "/bill-of-live-product/all",
    ADD: "/bill-of-live-product/add",
    EDIT: "/bill-of-live-product/edit",
  },

  PRODUCT_TYPE: {
    BASE: "/product-type",
    ALL: "/product-type/all",
    DROPDOWN: "/product-type/dropdown",
    ADD: "/product-type/add",
    EDIT: "/product-type/edit",
  },

  // ----------------------------- accounts -----------------------------
  DEBIT_NOTE: {
    BASE: "/debit-note",
    ALL: "/debit-note/all",
    ADD: "/debit-note/add",
    EDIT: "/debit-note/edit",
  },
  CREDIT_NOTE: {
    BASE: "/credit-note",
    ALL: "/credit-note/all",
    ADD: "/credit-note/add",
    EDIT: "/credit-note/edit",
  },

  // ----------------------------- purchase -----------------------------
  PURCHASE_ORDER: {
    BASE: "/purchase-order",
    ADD: "/purchase-order/add",
    EDIT: "/purchase-order/edit",
    ALL: "/purchase-order/all",
    DROPDOWN: "/purchase-order/dropdown",
  },
  TERMS_CONDITION: {
    BASE: "/terms-condition",
    ADD: "/terms-condition/add",
    EDIT: "/terms-condition/edit",
    ALL: "/terms-condition/all",
    DROPDOWN: "/terms-condition/dropdown",
  },
  SUPPLIER_BILL: {
    BASE: "/supplier-bill",
    ADD: "/supplier-bill/add",
    EDIT: "/supplier-bill/edit",
    ALL: "/supplier-bill/all",
  },
  PURCHASE_DEBIT_NOTE: {
    BASE: "/purchase-debit-note",
    ALL: "/purchase-debit-note/all",
    ADD: "/purchase-debit-note/add",
    EDIT: "/purchase-debit-note/edit",
    DELETE: "/purchase-debit-note/delete",
    DROPDOWN: "/purchase-debit-note/dropdown",
    ADD_EDIT: "/purchase-debit-note/add-edit",
  },
  ADDITIONAL_CHARGE: {
    BASE: "/additional-charge",
    DROPDOWN: "/additional-charge/dropdown",
    ADD: "/additional-charge/add",
    EDIT: "/additional-charge/edit",
    ALL: "/additional-charge/all",
  },
  CONTACT: {
    BASE: "/contacts",
    DROPDOWN: "/contacts/dropdown",
    ADD: "/contacts/add",
    EDIT: "/contacts/edit",
    ALL: "/contacts/all",
  },
  COUPON: {
    BASE: "/coupon",
    DROPDOWN: "/coupon/dropdown",
    APPLY: "/coupon/apply",
    ALL: "/coupon/all",
    ADD: "/coupon/add",
    EDIT: "/coupon/edit",
  },
  LOYALTY: {
    BASE: "/loyalty",
    DROPDOWN: "/loyalty/dropdown",
    POINTS: "/loyalty-points",
    POINTS_ADD: "/loyalty-points",
    ALL: "/loyalty/all",
    ADD: "/loyalty/add",
    EDIT: "/loyalty/edit",
  },

  SALES_REGISTER: {
    BASE: "/sales-register",
    ADD: "/sales-register/add",
    EDIT: "/sales-register/edit",
    ALL: "/sales-register/all",
  },

  POS_CASH_REGISTER: {
    BASE: "/pos-cash-register",
    ALL: "/pos-cash-register/all",
  },

  POS_CREDIT_NOTE: {
    BASE: "/pos-credit-note",
    ALL: "/pos-credit-note/all",
    ADD: "/pos-credit-note/add",
    EDIT: "/pos-credit-note/edit",
    DELETE: "/pos-credit-note/delete",
    REFUND: "/pos-credit-note/refund",
  },

  RETURN_POS_ORDER: {
    BASE: "/return-pos-order",
    ALL: "/return-pos-order/all",
    ADD: "/return-pos-order/add",
    EDIT: "/return-pos-order/edit",
  },
  POS_ORDER: {
    BASE: "/pos-order",
    ALL: "/pos-order/all",
    ADD: "/pos-order/add",
    EDIT: "/pos-order/edit",
    DELETE: "/pos-order/delete",
    DROPDOWN: "/pos-order/dropdown",
  },
  POS: {
    BASE: "/pos-order",
    HOLD_ORDER: "/pos-order/hold",
    CUSTOMER_DETAIL: "/pos-order/customer",
    ADD: "/pos-order/add",
    EDIT: "/pos-order/edit",
    DELETE: "/pos-order/delete",
  },

  //*************** Estimate **************** */
  ESTIMATE: {
    BASE: "/estimate",
    ALL: "/estimate/all",
    ADD: "/estimate/add",
    EDIT: "/estimate/edit",
    DELETE: "/estimate/delete",
    DROPDOWN: "/estimate/dropdown",
  },

  //*************** Sales Order **************** */
  SALES_ORDER: {
    BASE: "/sales-order",
    ALL: "/sales-order/all",
    ADD: "/sales-order/add",
    EDIT: "/sales-order/edit",
    DELETE: "/sales-order/delete",
    DROPDOWN: "/sales-order/dropdown",
  },

  //*************** Invoice **************** */
  INVOICE: {
    BASE: "/invoice",
    ALL: "/invoice/all",
    ADD: "/invoice/add",
    EDIT: "/invoice/edit",
    DELETE: "/invoice/delete",
    DROPDOWN: "/invoice/dropdown",
  },
  //*************** Delivery Challan **************** */
  DELIVERY_CHALLAN: {
    BASE: "/delivery-challan",
    ALL: "/delivery-challan/all",
    ADD: "/delivery-challan/add",
    EDIT: "/delivery-challan/edit",
    DELETE: "/delivery-challan/delete",
    DROPDOWN: "/delivery-challan/dropdown",
  },
  SALES_CREDIT_NOTE: {
    BASE: "/sales-credit-note",
    ALL: "/sales-credit-note/all",
    ADD: "/sales-credit-note/add",
    EDIT: "/sales-credit-note/edit",
    DELETE: "/sales-credit-note/delete",
    DROPDOWN: "/sales-credit-note/dropdown",
    ADD_EDIT: "/sales-credit-note/add-edit",
  },
} as const;
