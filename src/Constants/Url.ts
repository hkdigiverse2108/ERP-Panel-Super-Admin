export const URL_KEYS = {
  AUTH: {
    SIGNIN: "/auth/login",
  },
  UPLOAD: {
    ADD: "/upload",
    DELETE: "/upload",
    ALL_IMAGE: "/upload/images",
    ALL_PDF: "/upload/pdf",
  },

  COMPANY: {
    BASE: "/company",
    DROPDOWN: "/company/dropdown",
    ALL: "/company/all",
    ADD: "/company/add",
    EDIT: "/company/edit",
  },
  CONTACT: {
    DROPDOWN: "/contact/dropdown",
  },
  USER: {
    BASE: "/user",
    ALL: "/user/all",
    ADD: "/user/add",
    EDIT: "/user/edit",
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
  },
  CALL_REQUEST: {
    BASE: "/call-request",
    ADD: "/call-request/add",
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

  // ----------------------------- accounts -----------------------------
  ACCOUNT_GROUP: {
    BASE: "/account-group",
    DROPDOWN: "/account-group/dropdown",
    TREE: "/account-group/tree",
    ALL: "/account-group/all",
    ADD: "/account-group/add",
    EDIT: "/account-group/edit",
  },
  ACCOUNT: {
    BASE: "/account",
    DROPDOWN: "/account/dropdown",
    ALL: "/account/all",
    ADD: "/account/add",
    EDIT: "/account/edit",
  },
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
} as const;
