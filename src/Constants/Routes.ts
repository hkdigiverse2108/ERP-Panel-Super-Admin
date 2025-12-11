export const ROUTES = {
  HOME: "/",
  DASHBOARD: "/dashboard",
  AUTH: {
    SIGNIN: "/auth/signin",
  },
  CONTACT: {
    BASE: "/contact",
  },
  EMPLOYEE: {
    BASE: "/employee",
  },
  INVENTORY: {
    STOCK: "/stock",
    PRODUCT: {
      BASE: "/product",
    },
    CATEGORY_BRAND: "/category-brand",
    DEPARTMENT: "/department",
    BILL_OF_MATERIALS: {
      BASE: "/bill-of-materials",
    },
    PRODUCT_B2B_MAPPING: "/product-b2b-mapping",
    RECIPE: {
      BASE: "/recipe",
    },
    MATERIAL_CONSUMPTION: {
      BASE: "/material-consumption",
    },
    STOCK_VERIFICATION: {
      BASE: "/stock-verification",
    },
    MATERIAL_CREATION: {
      BASE: "/material-creation",
    },
  },
  SETTINGS: {
    GENERAL: "/setting/general",
  }
} as const;
