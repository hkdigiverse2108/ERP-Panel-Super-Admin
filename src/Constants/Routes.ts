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
  PRODUCT: {
    BASE: "/product",
    ADD_EDIT: "/product/add-edit",
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
} as const;
