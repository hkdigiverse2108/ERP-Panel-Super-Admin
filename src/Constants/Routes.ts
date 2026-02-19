export const ROUTES = {
  HOME: "/",
  DASHBOARD: "/dashboard",
  NOT_FOUND: "/not-found",
  ACCESS_DENIED: "/access-denied",
  AUTH: {
    SIGNIN: "/auth/signin",
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
  ACCOUNT_GROUP: {
    BASE: "/account-group",
    TREE: "/account-group/tree",
  },
  ACCOUNT: {
    BASE: "/account",
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
} as const;
