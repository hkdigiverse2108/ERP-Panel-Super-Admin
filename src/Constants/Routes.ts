export const ROUTES = {
  HOME: "/",
  DASHBOARD: "/dashboard",
  NOT_FOUND: "/not-found",
  ACCESS_DENIED: "/access-denied",
  AUTH: {
    SIGNIN: "/auth/signin",
    CHANGE_PASSWORD: "/auth/change-password",
    VERIFY_OTP: "/auth/verify-otp",
  },
  USER: {
    BASE: "/user",
    ADD_EDIT: "/user/add-edit",
    PERMISSION_ADD_EDIT: "/user/permission/add-edit",
  },
  COMPANY: {
    BASE: "/company",
    ADD_EDIT: "/company/add-edit",
  },
  PRODUCT: {
    BASE: "/product",
    ADD_EDIT: "/product/add-edit",
    ITEM_ADD_EDIT: "/product/item/add-edit",
  },
  PRODUCT_TYPE: {
    BASE: "/product-type",
    ADD_EDIT: "/product-type/add-edit",
  },
  ADMIN_SETTING: {
    BASE: "/admin-setting",
    ADD_EDIT: "/admin-setting/add-edit",
  },
  BRAND: {
    BASE: "/brand",
  },
  UOM: {
    BASE: "/uom",
  },
  TAX: {
    BASE: "/tax",
  },
  CATEGORY: {
    BASE: "/category",
  },
  MATERIAL_CONSUMPTION: {
    BASE: "/material-consumption",
    ADD_EDIT: "/material-consumption/add-edit",
  },
  BRANCH: {
    BASE: "/branch",
    ADD_EDIT: "/branch/add-edit",
  },
  LOCATION: {
    BASE: "/location",
    ADD_EDIT: "/location/add-edit",
  },
  DEBIT_NOTE: {
    BASE: "/debit-note",
    ADD_EDIT: "/debit-note/add-edit",
  },
  CREDIT_NOTE: {
    BASE: "/credit-note",
    ADD_EDIT: "/credit-note/add-edit",
  },
  ROLE: {
    BASE: "/role",
  },
  MODULE: {
    BASE: "/module",
    ADD_EDIT: "/module/add-edit",
  },
  PURCHASE: {
    BASE: "/purchase",
    ADD_EDIT: "/purchase/add-edit",
  },
  PURCHASE_ORDER: {
    BASE: "/purchase-order",
    ADD_EDIT: "/purchase-order/add-edit",
  },
  SUPPLIER_BILL: {
    BASE: "/supplier-bill",
    ADD_EDIT: "/supplier-bill/add-edit",
  },
  ADDITIONAL_CHARGES: {
    BASE: "/additional-charge",
    ADD_EDIT: "/additional-charge/add-edit",
  },
  // TERMS_CONDITION: {
  //   BASE: "/terms-condition",
  //   ADD_EDIT: "/terms-condition/add-edit",
  // },
  CONTACTS: {
    BASE: "/contacts",
    ADD_EDIT: "/contacts/add-edit",
  },
  RECIPE: {
    BASE: "/recipe",
    ADD_EDIT: "/recipe/add-edit",
  },
  STOCK: {
    BASE: "/stock",
  },
  STOCK_VERIFICATION: {
    BASE: "/stock-verification",
    ADD_EDIT: "/stock-verification/add-edit",
  },
  BILL_OF_LIVE_PRODUCT: {
    BASE: "/bill-of-live-product",
    ADD_EDIT: "/bill-of-live-product/add-edit",
  },
  BANK: {
    BASE: "/bank",
    ADD_EDIT: "/bank/add-edit",
  },
  COUPON: {
    BASE: "/coupon",
    ADD_EDIT: "/coupon/add-edit",
  },
  LOYALTY: {
    BASE: "/loyalty",
    ADD_EDIT: "/loyalty/add-edit",
  },
  SETTINGS: {
    BASE: "/settings",
    ADDITIONAL_CHARGES: "/settings/additional-charges",
  },
  PROFILE: {
    BASE: "/profile",
    EDIT: "/profile/edit",
  },
  SALES_REGISTER: {
    BASE: "/pos/sales-register",
  },
  ANNOUNCEMENT: {
    BASE: "/announcement",
    ADD_EDIT: "/announcement/add-edit",
  },
  CALL_REQUEST: {
    BASE: "/call-request",
    ADD_EDIT: "/call-request/add-edit",
  },
  POS_CREDIT_NOTE: {
    BASE: "/pos/credit-note",
  },
  POS_ORDER_LIST: {
    BASE: "/pos-order-list",
    ADD_EDIT: "/pos-order-list/add-edit",
  },
  ESTIMATE: {
    BASE: "/estimate",
    ADD_EDIT: "/estimate/add-edit",
  },

  SALES_ORDER: {
    BASE: "/sales-order",
    ADD_EDIT: "/sales-order/add-edit",
  },

  INVOICE: {
    BASE: "/invoice",
    ADD_EDIT: "/invoice/add-edit",
  },
  DELIVERY_CHALLAN: {
    BASE: "/delivery-challan",
    ADD_EDIT: "/delivery-challan/add-edit",
  },
  SALES_CREDIT_NOTE: {
    BASE: "/sales-credit-note",
    ADD_EDIT: "/sales-credit-note/add-edit",
  },
} as const;
