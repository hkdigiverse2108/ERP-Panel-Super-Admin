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
  USER: {
    BASE: "/user",
    EDIT: "/user/edit",
  },
  COMPANY: {
    BASE: "/company",
    ALL: "/company/all",
    ADD: "/company/add",
    EDIT: "/company/edit",
  },
  EMPLOYEE: {
    BASE: "/user",
    ALL: "/user/all",
    ADD: "/user/add",
    EDIT: "/user/edit",
  },
  BRANCH: {
    BASE: "/branch",
    ALL: "/branch/all",
    ADD: "/branch/add",
    EDIT: "/branch/edit",
  },
  BRAND: {
    BASE: "/brand",
    ALL: "/brand/all",
    ADD: "/brand/add",
    EDIT: "/brand/edit",
  },
  CATEGORY: {
    BASE: "/category",
    ALL: "/category/all",
    ADD: "/category/add",
    EDIT: "/category/edit",
  },
  ANNOUNCEMENT: {
    ALL: "/announcement/all",
  },
  PRODUCT: {
    BASE: "/product",
    ADD: "/product/add",
    ALL: "/product/all",
    EDIT: "/product/edit",
  },
  PRODUCT_REQUEST: {
    BASE: "/product-request",
    ALL: "/product-request/all",
    ADD: "/product-request/add",
    EDIT: "/product-request/edit",
  },
  CALL_REQUEST: {
    BASE: "/call-request",
    ADD: "/call-request/add",
  },
} as const;
