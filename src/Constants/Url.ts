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
  USER: {
    BASE: "/user",
    ALL: "/user/all",
    ADD: "/user/add",
    EDIT: "/user/edit",
  },
  BRANCH: {
    BASE: "/branch",
    DROPDOWN: "/branch/dropdown",
    ALL: "/branch/all",
    ADD: "/branch/add",
    EDIT: "/branch/edit",
  },
  BRAND: {
    BASE: "/brand",
    DROPDOWN: "/brand/dropdown",
    ALL: "/brand/all",
    ADD: "/brand/add",
    EDIT: "/brand/edit",
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
  ANNOUNCEMENT: {
    ALL: "/announcement/all",
  },
  PRODUCT: {
    BASE: "/product",
    DROPDOWN: "/product/dropdown",
    ADD: "/product/add",
    ALL: "/product/all",
    EDIT: "/product/edit",
  },
  CALL_REQUEST: {
    BASE: "/call-request",
    ADD: "/call-request/add",
  },
  ROLE: {
    BASE: "/role",
    ALL: "/role/all",
    ADD: "/role/add",
    EDIT: "/role/edit",
  },
  STOCK: {
    BASE: "/stock",
    ALL: "/stock/all",
    ADD: "/stock/add",
    BULK_ADJUSTMENT: "/stock/bulk-adjustment",
  },
  BANK: {
    BASE: "/bank",
    DROPDOWN: "/bank/dropdown",
    ALL: "/bank/all",
    ADD: "/bank/add",
  },
  LOCATION: {
    BASE: "/location",
    ALL: "/location/all",
    COUNTRY: "/location/country",
    STATE: "/location/state",
    CITY: "/location/city",
    ADD: "/location/add",
    EDIT: "/location/edit",
  }
} as const;
