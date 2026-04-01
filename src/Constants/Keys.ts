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

  POS_PAYMENT: {
    BASE: "pos-payment",
    ADD: "pos-payment-add",
    EDIT: "pos-payment-edit",
    DELETE: "pos-payment-delete",
  },
  BANK_TRANSACTION: {
    BASE: "bank-transaction",
    ADD: "bank-transaction-add",
    EDIT: "bank-transaction-edit",
    DELETE: "bank-transaction-delete",
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
  PRODUCT_TYPE: {
    BASE: "product-type",
    ADD: "product-type-add",
    EDIT: "product-type-edit",
    DELETE: "product-type-delete",
  },
  // ----------------------------- accounts -----------------------------
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
  PURCHASE_DEBIT_NOTE: {
    BASE: "purchase-debit-note",
    ADD: "purchase-debit-note-add",
    EDIT: "purchase-debit-note-edit",
    DELETE: "purchase-debit-note-delete",
    DROPDOWN: "purchase-debit-note-dropdown",
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

  DISCOUNT: {
    BASE: "discount",
    ADD: "discount-add",
    EDIT: "discount-edit",
    DELETE: "discount-delete",
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
    DROPDOWN: "pos-cash-register-dropdown",
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
  EXPENSE: {
    BASE: "expense",
    ADD: "expense-add",
    EDIT: "expense-edit",
    DELETE: "expense-delete",
  },
  SALARY: {
    BASE: "salary",
    ADD: "salary-add",
    EDIT: "salary-edit",
    DELETE: "salary-delete",
  },

  //*************** Estimate **************** */
  ESTIMATE: {
    BASE: "estimate",
    ADD: "estimate-add",
    EDIT: "estimate-edit",
    DELETE: "estimate-delete",
    DROPDOWN: "estimate-dropdown",
  },

  //*************** Sales Order **************** */
  SALES_ORDER: {
    BASE: "sales-order",
    ADD: "sales-order-add",
    EDIT: "sales-order-edit",
    DELETE: "sales-order-delete",
    DROPDOWN: "sales-order-dropdown",
  },

  //*************** Invoice **************** */
  INVOICE: {
    BASE: "invoice",
    ADD: "invoice-add",
    EDIT: "invoice-edit",
    DELETE: "invoice-delete",
    DROPDOWN: "invoice-dropdown",
  },
  //*************** Delivery Challan **************** */
  DELIVERY_CHALLAN: {
    BASE: "delivery-challan",
    ADD: "delivery-challan-add",
    EDIT: "delivery-challan-edit",
    DELETE: "delivery-challan-delete",
    DROPDOWN: "delivery-challan-dropdown",
  },
  SALES_CREDIT_NOTE: {
    BASE: "sales-credit-note",
    ADD: "sales-credit-note-add",
    EDIT: "sales-credit-note-edit",
    DELETE: "sales-credit-note-delete",
    DROPDOWN: "sales-credit-note-dropdown",
  },

  PREFIX: {
    BASE: "prefix",
    ADD: "prefix-add",
    EDIT: "prefix-edit",
    DELETE: "prefix-delete",
  },
  CONSUMPTION_TYPE: {
    BASE: "consumption-type",
    ADD: "consumption-type-add",
    EDIT: "consumption-type-edit",
    DELETE: "consumption-type-delete",
  },
  PAYMENT_TERM: {
    BASE: "payment-terms",
    ADD: "payment-terms-add",
    EDIT: "payment-terms-edit",
    DELETE: "payment-terms-delete",
  },
  SPECIALS: {
    BASE: "specials",
    ADD: "specials-add",
    EDIT: "specials-edit",
    DELETE: "specials-delete",
  },
  CREDENTIALS: {
    BASE: "credentials",
    ADD: "credentials-add",
    EDIT: "credentials-edit",
    DELETE: "credentials-delete",
  },
  AI: {
    ANALYZE: "ai-analyze",
  },
};
