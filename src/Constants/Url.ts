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
  ANNOUNCEMENT: {
    ALL: "/announcement/all",
  },
  PRODUCT: {
    BASE: "/product",
    ADD: "/product/add",
    ALL: "/product/all",
    EDIT: "/product/edit",
  },
  CALL_REQUEST: {
    BASE: "/call-request",
    ADD: "/call-request/add",
  },
} as const;
