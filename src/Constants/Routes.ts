export const ROUTES = {
  HOME: "/",
  DASHBOARD: "/dashboard",
  AUTH: {
    SIGNIN: "/auth/signin",
  },
  EMPLOYEE: {
    BASE: "/employee",
    ADD_EDIT: "/employee/add-edit",
  },
  PRODUCT: {
    BASE: "/product",
    ADD_EDIT: "/product/add-edit",
  },
  BRAND: {
    BASE: "/brand",
    ADD_EDIT: "/brand/add-edit",
  },
  BRANCH: {
    BASE: "/branch",
    ADD_EDIT: "/branch/add-edit",
  },
} as const;
