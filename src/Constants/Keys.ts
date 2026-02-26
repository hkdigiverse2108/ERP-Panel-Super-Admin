export const KEYS = {
  AUTH: {
    SIGNIN: "admin-signin",
    CHANGE_PASSWORD: "change-password",
    VERIFY_OTP: "verify-otp",
    RESEND_OTP: "resend-otp",
  },

  ADMIN_SETTING: {
    BASE: "admin-setting",
    ADD: "admin-setting-add",
    UPDATE: "admin-setting-update",
  },

  UPLOAD: {
    ALL_IMAGE: "upload-image",
    ALL_PDF: "upload-pdf",
    ADD: "upload",
    DELETE: "upload-delete",
  },

  COMPANY: {
    BASE: "company",
    ADD: "company-add",
    EDIT: "company-edit",
    DELETE: "company-delete",
  },

  // CONTACT: {
  //   BASE: "contact",
  //   // DROPDOWN: "contact-dropdown",
  // },

  USER: {
    BASE: "user",
    ADD: "user-add",
    EDIT: "user-edit",
    DELETE: "user-delete",
    DROPDOWN: "user-dropdown",
  },

  BRANCH: {
    BASE: "branch",
    ADD: "branch-add",
    EDIT: "branch-edit",
    DELETE: "branch-delete",
  },

  ROLE: {
    BASE: "role",
    ADD: "role-add",
    EDIT: "role-edit",
    DELETE: "role-delete",
  },

  ANNOUNCEMENT: {
    BASE: "announcement",
    ADD: "announcement-add",
    EDIT: "announcement-edit",
    DELETE: "announcement-delete",
  },

  CALL_REQUEST: {
    BASE: "call-request",
    ADD: "call-request-add",
    EDIT: "call-request-edit",
    DELETE: "call-request-delete",
  },

  LOCATION: {
    BASE: "location",
    ADD: "location-add",
    EDIT: "location-edit",
    DELETE: "location-delete",
  },

  MODULE: {
    BASE: "module",
    USER_PERMISSION: "module-user-permission",
    ADD: "module-add",
    EDIT: "module-edit",
    DELETE: "module-delete",
  },

  PERMISSION: {
    BASE: "permission",
    EDIT: "permission-edit",
    DETAILS: "permission-details",
  },

  // ----------------------------- bank -----------------------------
  BANK: {
    BASE: "bank",
    ADD: "bank-add",
    EDIT: "bank-edit",
    DELETE: "bank-delete",
  },

  // ----------------------------- inventory -----------------------------

  PRODUCT: {
    BASE: "product",
    DROPDOWN: "product-dropdown",
    ADD: "product-add",
    EDIT: "product-edit",
    DELETE: "product-delete",
  },
  BRAND: {
    BASE: "brand",
    ADD: "brand-add",
    EDIT: "brand-edit",
    DELETE: "brand-delete",
  },
  UOM: {
    BASE: "uom",
    ADD: "uom-add",
    EDIT: "uom-edit",
    DELETE: "uom-delete",
  },
  TAX: {
    BASE: "tax",
    ADD: "tax-add",
    EDIT: "tax-edit",
    DELETE: "tax-delete",
  },
  CATEGORY: {
    BASE: "category",
    ADD: "category-add",
    EDIT: "category-edit",
    DELETE: "category-delete",
  },
  STOCK: {
    BASE: "stock",
    ADD: "stock-add",
    BULK_ADJUSTMENT: "stock-bulk-adjustment",
  },
  MATERIAL_CONSUMPTION: {
    BASE: "material-consumption",
    ADD: "material-consumption-add",
    EDIT: "material-consumption-edit",
    DELETE: "material-consumption-delete",
  },
  RECIPE: {
    BASE: "recipe",
    ADD: "recipe-add",
    EDIT: "recipe-edit",
    DELETE: "recipe-delete",
  },
  STOCK_VERIFICATION: {
    BASE: "stock-verification",
    ADD: "stock-verification-add",
    EDIT: "stock-verification-edit",
    DELETE: "stock-verification-delete",
  },
  BILL_OF_LIVE_PRODUCT: {
    BASE: "bill-of-live-product",
    ADD: "bill-of-live-product-add",
    EDIT: "bill-of-live-product-edit",
    DELETE: "bill-of-live-product-delete",
  },
  // ----------------------------- accounts -----------------------------
  ACCOUNT_GROUP: {
    BASE: "account-group",
    ADD: "account-group-add",
    EDIT: "account-group-edit",
    DELETE: "account-group-delete",
  },
  ACCOUNT: {
    BASE: "account",
    ADD: "account-add",
    EDIT: "account-edit",
    DELETE: "account-delete",
  },
  DEBIT_NOTE: {
    BASE: "debit-note",
    ADD: "debit-note-add",
    EDIT: "debit-note-edit",
    DELETE: "debit-note-delete",
  },
  CREDIT_NOTE: {
    BASE: "credit-note",
    ADD: "credit-note-add",
    EDIT: "credit-note-edit",
    DELETE: "credit-note-delete",
  },

  // ----------------------------- purchase -----------------------------
  PURCHASE_ORDER: {
    BASE: "purchase-order",
    ADD: "purchase-order-add",
    EDIT: "purchase-order-edit",
    DELETE: "purchase-order-delete",
  },
  TERMS_CONDITION: {
    BASE: "terms-condition",
    ADD: "terms-condition-add",
    EDIT: "terms-condition-edit",
    DELETE: "terms-condition-delete",
  },
  SUPPLIER_BILL: {
    BASE: "supplier-bill",
    ADD: "supplier-bill-add",
    EDIT: "supplier-bill-edit",
    DELETE: "supplier-bill-delete",
  },
  ADDITIONAL_CHARGE: {
    BASE: "additional-charge",
    DROPDOWN: "additional-charge-dropdown",
    ADD: "additional-charge-add",
    EDIT: "additional-charge-edit",
    DELETE: "additional-charge-delete",
  },
  CONTACT: {
    BASE: "contact",
    ADD: "contact-add", // dropdown can also use this key as it is used for fetching contact list for dropdown
    EDIT: "contact-edit",
    DELETE: "contact-delete",
  },
  COUPON: {
    BASE: "coupon",
    ADD: "coupon-add",
    APPLY: "coupon-apply",
    EDIT: "coupon-edit",
    DELETE: "coupon-delete",
  },
  LOYALTY: {
    BASE: "loyalty",
    ADD: "loyalty-add",
    EDIT: "loyalty-edit",
    DELETE: "loyalty-delete",
    POINTS: "loyalty-points",
    POINTS_ADD: "loyalty-points-add",
  },

  SALES_REGISTER: {
    BASE: "sales-register",
    ADD: "sales-register-add",
    EDIT: "sales-register-edit",
    DELETE: "sales-register-delete",
  },

  POS_CASH_REGISTER: {
    BASE: "pos-cash-register",
    DETAILS: "pos-cash-register-details",
  },

  POS_CREDIT_NOTE: {
    BASE: "pos-credit-note",
    ADD: "pos-credit-note-add",
    EDIT: "pos-credit-note-edit",
    DELETE: "pos-credit-note-delete",
    REFUND: "pos-credit-note-refund",
  },
  RETURN_POS_ORDER: {
    BASE: "return-pos-order",
    ADD: "return-pos-order-add",
    EDIT: "return-pos-order-edit",
    DELETE: "return-pos-order-delete",
  },
  POS_ORDER: {
    BASE: "pos-order",
    ADD: "pos-order-add",
    EDIT: "pos-order-edit",
    DELETE: "pos-order-delete",
    DROPDOWN: "pos-order-dropdown",
  },
  POS: {
    BASE: "pos",
    HOLD_ORDER: "pos-order-hold",
    CUSTOMER_DETAIL: "pos-order-customer-detail",
    ADD: "pos-add",
    EDIT: "pos-edit",
    DELETE: "pos-delete",
  },
};
