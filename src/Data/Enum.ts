import type { BranchFormValues } from "../Types";

export const PRODUCT_TYPE = ["finished", "raw_material", "semi_finished", "service", "non_inventory"] as const;

export const RECIPE_TYPE = ["assemble", "unassemble"] as const;

export const PRODUCT_STATUS = ["active", "inactive"] as const;
export const CONTACT_TYPE = ["customer", "supplier", "transporter"] as const;
export const POS_PAYMENT_MODE = ["cash", "bank"] as const;
export const CUSTOMER_TYPE = ["retailer", "wholesaler", "merchant", "other"] as const;
export const SUPPLIER_TYPE = ["manufacturer", "stockiest", "trader", "other"] as const;
export const CONTACT_STATUS = ["active", "inactive"] as const;
export const COUPON_DISCOUNT_TYPE = ["percentage", "flat"] as const;
export const COUPON_STATUS = ["active", "inactive"] as const;
export const DISCOUNT_TYPE = ["percentage", "flat"] as const;
export const DISCOUNT_STATUS = ["active", "inactive"] as const;
export const EMPLOYEE_STATUS = ["active", "inactive"] as const;
export const INVOICE_PAYMENT_STATUS = ["paid", "unpaid", "partial"] as const;
export const LOYALTY_STATUS = ["active", "inactive"] as const;
// export const LOYALTY_TYPE = ["points", "cashback"] as const;
export const SUPPLIER_PAYMENT_STATUS = ["paid", "unpaid", "partial"] as const;
export const VOUCHAR_TYPE = ["journal", "payment", "receipt", "expense", "contra"] as const;

export const PRODUCT_TYPE_OPTIONS = [
  { label: "Finished", value: "finished" },
  { label: "Raw Material", value: "raw_material" },
  { label: "Semi Finished", value: "semi_finished" },
  { label: "Service", value: "service" },
  { label: "Non Inventory", value: "non_inventory" },
];

export const CATEGORY_OPTIONS = [{ label: "Flour", value: "679a1c2f8f4de1a01234abcd" }];
export const SUB_CATEGORY_OPTIONS = [{ label: "Whole Wheat", value: "679a1c3d8f4e1a001234abce" }];

export const BRAND_OPTIONS = [{ label: "Organic Brand", value: "679a1c4e8f4e1a001234abcf" }];

export const SUB_BRAND_OPTIONS = [{ label: "Premium", value: "679a1c5f8f4e1a001234abd0" }];
export const DEPARTMENT_OPTIONS = [{ label: "Grocery", value: "679a1c6f8f4e1a001234abd1" }];

export const UOM_OPTIONS = [{ label: "KG", value: "679a1c7f8f4e1a001234abd2" }];

export const TOOLBAR_OPTIONS = [["bold", "italic", "underline"], ["blockquote", "code-block"], [{ header: 1 }, { header: 2 }], [{ list: "ordered" }, { list: "bullet" }, { list: "check" }], [{ script: "sub" }, { script: "super" }], [{ indent: "-1" }, { indent: "+1" }], [{ direction: "rtl" }], [{ size: ["small", false, "large", "huge"] }], [{ header: [1, 2, 3, 4, 5, 6, false] }], [{ color: [] }, { background: [] }], [{ align: [] }]];
export const CHAT_TOOLBAR_OPTIONS = [["bold", "italic"], ["blockquote"], ["link"], [{ header: 1 }, { header: 2 }], [{ list: "ordered" }, { list: "bullet" }, { list: "check" }], [{ script: "sub" }, { script: "super" }], [{ indent: "-1" }, { indent: "+1" }], [{ header: [1, 2, 3, 4, 5, 6, false] }], [{ align: [] }], ["clean"]];

export const TAX_OPTIONS = [
  { label: "NON GST 0%", value: "NON_GST_0" },
  { label: "EXEMPT 0%", value: "EXEMPT_0" },
  { label: "GST 0%", value: "GST_0" },
  { label: "GST 5%", value: "GST_5" },
  { label: "GST 12%", value: "GST_12" },
  { label: "GST 18%", value: "GST_18" },
  { label: "GST 28%", value: "GST_28" },
];

export const GROUP_OPTIONS = [
  { label: "Select Group", value: "" },
  { label: "Direct Incomes", value: "Direct Incomes" },
  { label: "Indirect Incomes", value: "Indirect Incomes" },
];

export const ORDER_TYPE = [
  { label: "Walk In", value: "Walk In" },
  { label: "Delivery", value: "Delivery" },
];

export const RECIPE_TYPE_OPTIONS = [
  { label: "Assemble", value: "assemble" },
  { label: "Unassemble", value: "unassemble" },
];

export const DATA_STATUS = [
  { label: "Pending", value: "pending" },
  { label: "Approved", value: "approved" },
  { label: "Rejected", value: "rejected" },
];

export const USER_TYPE = [
  { label: "User", value: "user" },
  { label: "Employee", value: "employee" },
  { label: "Admin", value: "admin" },
  { label: "Super Admin", value: "super-admin" },
];

export const BAUD_RATE = [
  { label: "300 baud", value: "300" },
  { label: "1200 baud", value: "1200" },
  { label: "2400 baud", value: "2400" },
  { label: "4800 baud", value: "4800" },
  { label: "96000 baud", value: "96000" },
  { label: "19200 baud", value: "19200" },
  { label: "38400 baud", value: "38400" },
  { label: "57600 baud", value: "57600" },
  { label: "115200 baud", value: "115200" },
];

export const DATA_BITS = [
  { label: "5", value: "5" },
  { label: "6", value: "6" },
  { label: "7", value: "7" },
  { label: "8", value: "8" },
];

export const STOP_BITS = [
  { label: "1", value: "1" },
  { label: "2", value: "2" },
];

export const PARITY = [
  { label: "None", value: "None" },
  { label: "Even", value: "Even" },
  { label: "Odd", value: "Odd" },
  { label: "Mark", value: "Mark" },
  { label: "Space", value: "Space" },
];

export const FLOW_CONTROL = [
  { label: "None", value: "None" },
  { label: "RTC/CTS", value: "RTC/CTS" },
  { label: "DTR/DSR", value: "DTR/DSR" },
  { label: "XON/XOFF", value: "XON/XOFF" },
];

export const PRECISION = [
  { label: "None", value: "None" },
  { label: "Adjust 3 places", value: "Adjust 3 places" },
];

export const GST_TYPE = [
  { label: "UnRegistered", value: "UnRegistered" },
  { label: "Registered Regular", value: "Registered Regular" },
  { label: "Registered Composition", value: "Registered Composition" },
  { label: "Input Service Distributor", value: "Input Service Distributor" },
  { label: "E-Commerce Operator", value: "E-Commerce Operator" },
  { label: "Other", value: "Other" },
];

export const PAYMENTS = [
  { label: "Receipt", value: "Receipt" },
  { label: "Payment", value: "Payment" },
  { label: "Expense", value: "Expense" },
];

export const VOUCHER_TYPE = [
  { label: "Sales", value: "sales" },
  { label: "Purchase", value: "purchase" },
  { label: "Expense", value: "expense" },
];

export const PAYMENT_TYPE = [
  { label: "Advance Payment", value: "advancePayment" },
  { label: "Against Bill", value: "againstBill" },
];

export const PAYMENT_MODE = [
  { label: "Cash", value: "cash" },
  { label: "Card", value: "card" },
  { label: "UPI", value: "upi" },
  { label: "Wallet", value: "wallet" },
  { label: "Bank", value: "bank" },
  { label: "Cheque", value: "cheque" },
];

export const CASH_CONTROL = [
  { label: "Opening Balance", value: "openingBalance" },
  { label: "Add Money In", value: "addMoneyIn" },
];

export const REDEEM_CREDIT_TYPE = [
  { label: "Credit Note", value: "creditNote" },
  { label: "Advance Payment", value: "advancePayment" },
];

export const PAYMENT_TERMS = [
  { label: "7 Days", value: "7_days" },
  { label: "15 Days", value: "15_days" },
  { label: "30 Days", value: "30_days" },
  { label: "60 Days", value: "60_days" },
  { label: "90 Days", value: "90_days" },
];

export const PAYMENT_TERMS_OPTIONS = PAYMENT_TERMS;

export const SEND_REMINDER = [
  { label: "Yes", value: "yes" },
  { label: "No", value: "no" },
];

export const PRODUCT_EXPIRY_TYPE = [
  { label: "MFG", value: "MFG" },
  { label: "EXP", value: "expiry" },
];

export const REVERSE_CHARGE = [
  { label: "Yes", value: "true" },
  { label: "No", value: "false" },
];

// export const SEZ_OPTIONS = [
//   { label: "Yes", value: "YES" },
//   { label: "No", value: "NO" },
// ];

export const SHIPPING_TYPE_OPTIONS = [
  { label: "Delivery", value: "delivery" },
  { label: "Pickup", value: "pickup" },
];

export const COMPANY = [
  { label: "Dhruvi Bakery", value: "Dhruvi Bakery" },
  { label: "Rakesh Enterprises", value: "Rakesh Enterprises" },
];

export const ROLE_OPTIONS = [
  { label: "Admin", value: "admin" },
  { label: "Manager", value: "manager" },
  { label: "Employee", value: "employee" },
];

export const CONSUMPTION_TYPE = [
  { label: "Expired", value: "expired" },
  { label: "Sample", value: "sample" },
  { label: "Production", value: "production" },
  { label: "Scrap / Wastage", value: "scrap_wastage" },
];

export const DATE_FORMATS = [
  { label: "DD/MM/YYYY", value: "DD/MM/YYYY" },
  { label: "DD-MM-YYYY", value: "DD-MM-YYYY" },
  { label: "DD.MM.YYYY", value: "DD.MM.YYYY" },
  { label: "DD Month YYYY", value: "DD MMMM YYYY" },
];

export const ACCOUNTING_TYPE = [{ label: "Centralized", value: "centralized" }];

export const LOCATION_TYPE = [
  { label: "Country", value: "country" },
  { label: "State", value: "state" },
  { label: "City", value: "city" },
];
export const ORDER_STATUS = [
  { label: "Exceed", value: "exceed" },
  { label: "In Progress", value: "in_progress" },
  { label: "Delivered", value: "delivered" },
  { label: "Partially Delivered", value: "partially_delivered" },
  { label: "Completed", value: "completed" },
  { label: "Cancelled", value: "cancelled" },
];

export const INVOICE_STATUS = [
  { label: "Invoiced", value: "invoiced" },
  { label: "Delivery Challan Created", value: "delivery_challan_created" },
  { label: "Cancelled", value: "cancelled" },
];

export const INVOICE_PAYMENT_STATUS_OPTIONS = [
  { label: "Paid", value: "paid" },
  { label: "Unpaid", value: "unpaid" },
  { label: "Partial", value: "partial" },
];

export const INVOICE_STATUS_STATS = [
  { label: "All", value: "all" },
  { label: "Invoiced", value: "invoiced" },
  { label: "Delivery Challan Created", value: "delivery_challan_created" },
  { label: "Partial Delivery Challan Created", value: "partial_delivery_challan_created" },
  { label: "Partially Cancelled", value: "partially_cancelled" },
  { label: "Cancelled", value: "cancelled" },
  { label: "Total Sales", value: "total_sales" },
  { label: "Paid", value: "paid" },
  { label: "UnPaid", value: "unpaid" },
];

export const TAX_TYPE = [
  { label: "Default", value: "default" },
  { label: "Tax Inclusive", value: "tax_inclusive" },
  { label: "Tax Exclusive", value: "tax_exclusive" },
  { label: "Out Of Scope", value: "out_of_scope" },
];

export const BANK_UI_FIELDS: (keyof BranchFormValues)[] = ["bankName", "bankIFSC", "branchName", "accountHolderName", "bankAccountNumber"];

export const PAYMENT_STATUS_OPTIONS = [
  { label: "All", value: "" },
  { label: "Paid", value: "paid" },
  { label: "Unpaid", value: "unpaid" },
];
export const OPTION_TYPE = [
  { label: "Purchase", value: "purchase" },
  { label: "Sales", value: "sales" },
];
export const CUSTOMER_CATEGORY = [
  { label: "Retail", value: "retail" },
  { label: "Customer", value: "customer" },
];

export const CONTACT_CATEGORY_CUSTOMER = [
  { label: "Retailer", value: "retailer" },
  { label: "Wholesaler", value: "wholesaler" },
  { label: "Merchant", value: "merchant" },
  { label: "Other", value: "other" },
];

export const CONTACT_CATEGORY_SUPPLIER = [
  { label: "Manufacturer", value: "manufacturer" },
  { label: "Stockiest", value: "stockiest" },
  { label: "Trader", value: "trader" },
  { label: "Other", value: "other" },
];
export const LOYALTY_TYPE = [
  { label: "Discount", value: "discount" },
  { label: "Free Product", value: "free_product" },
];

export const LOYALTY_REDEMPTION_TYPE = [
  { label: "Single", value: "single" },
  { label: "Multiple", value: "multiple" },
];

export const DISCOUNT_APPLICABLE = [
  { label: "Product Wise", value: "product_wise" },
  { label: "Entire Bill", value: "entire_bill" },
];

export const DISCOUNT_MODE = [
  { label: "Normal", value: "normal" },
  { label: "Range Wise", value: "range_wise" },
  { label: "Buy X Get Y", value: "buy_x_get_y" },
  { label: "Product at Fix Amount", value: "product_at_fix_amount" },
];

export const DISCOUNT_VALUE_TYPE = [
  { label: "Percentage", value: "percentage" },
  { label: "Flat", value: "flat" },
];

export const DISCOUNT_APPLY_TO = [
  { label: "Specific Category", value: "specific_category" },
  { label: "Specific Brand", value: "specific_brand" },
  { label: "Specific Products", value: "specific_products" },
];

export const  MINIMUM_REQUIRMENT = [
  { label: "None", value: "none" },
  { label: "Min Purchase Amount", value: "min_purchase_amount" },
  { label: "Min Quantity", value: "min_quantity" },
];

export const CONDITION_OPTIONS = [
  { label: "Purchase Amount", value: "min_purchase_amount" },
  { label: "Product Quantity", value: "min_quantity" }
];
export const PAYMENT_MODE_OPTIONS = [
  { label: "Online", value: "online" },
  { label: "Cheque", value: "cheque" },
];

export const EXPENSE_TYPE_OPTIONS = [
  { label: "Income", value: "income" },
  { label: "Expense", value: "expense" },
];

export const TRANSACTION_TYPE = [
  { label: "Deposit", value: "deposit" },
  { label: "Withdrawal", value: "withdrawal" },
  { label: "Transfer", value: "transfer" },
];

export const ESTIMATE_STATUS = [
  { label: "Pending", value: "pending" },
  { label: "Order Created", value: "order-created" },
  { label: "Invoice Created", value: "invoice-created" },
];

export const SALES_ORDER_STATUS_OPTIONS = [
  { label: "All", value: "all" },
  { label: "Pending", value: "pending" },
  { label: "Invoice Created", value: "invoice_created" },
  { label: "Partial Invoice Created", value: "partial_invoice_created" },
  { label: "Delivery Challan Created", value: "delivery_challan_created" },
  { label: "Partial Delivery Challan Created", value: "partial_delivery_challan_created" },
  { label: "Partially Cancelled", value: "partially_cancelled" },
  { label: "Cancelled", value: "cancelled" },
];

export const INVOICE_CREATED_FROM_OPTIONS = [
  { label: "Sales Order", value: "sales-order" },
  { label: "Delivery Challan", value: "delivery-challan" },
];

export const DELIVERY_CHALLAN_STATUS_OPTIONS = [
  { label: "Invoice Created", value: "invoice_created" },
  { label: "Delivered", value: "delivered" },
  { label: "Cancelled", value: "cancelled" },
];

export const DELIVERY_CHALLAN_CREATED_FROM_OPTIONS = [
  { label: "Invoice", value: "invoice" },
  { label: "Sales Order", value: "sales-order" },
];

export const SALES_CREDIT_NOTE_STATUS_OPTIONS = [
  { label: "All", value: "all" },
  { label: "Open", value: "open" },
  { label: "Paid", value: "paid" },
  { label: "Due", value: "due" },
];

export const SALES_CREDIT_NOTE_PRODUCT_TYPE_OPTIONS = [
  { label: "All", value: "all" },
  { label: "Expiry", value: "expiry" },
];

export const PURCHASE_DEBIT_NOTE_STATUS_OPTIONS = [
  { label: "All", value: "all" },
  { label: "Open", value: "open" },
  { label: "Closed", value: "closed" },
  { label: "Cancelled", value: "cancelled" },
];

