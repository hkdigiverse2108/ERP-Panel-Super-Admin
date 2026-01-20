export const ROUTES = {
  HOME: "/",
  DASHBOARD: "/dashboard",
  AUTH: {
    SIGNIN: "/auth/signin",
  },
  USER: {
    BASE: "/user",
    ADD_EDIT: "/user/add-edit",
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
  ACCOUNT_GROUP:{
    BASE: "/account-group",
    TREE: "/account-group/tree",
  }
} as const;
