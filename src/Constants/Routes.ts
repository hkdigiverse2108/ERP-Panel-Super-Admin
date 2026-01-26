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
  ROLE: {
    BASE: "/role",
  },
  MODULE: {
    BASE: "/module",
    ADD_EDIT: "/module/add-edit",
  }
} as const;
