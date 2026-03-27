import * as Yup from "yup";
import { DISCOUNT_APPLY_TO_ENUM, DISCOUNT_MODE_ENUM, MINIMUM_REQUIREMENT_ENUM } from "../../Data";
import type { Primitive } from "../../Types";
import { Validation } from "./Validation";

const RequiredWhenTrue = (dependentField: string, message: string, baseSchema: Yup.AnySchema) => {
  return baseSchema.when(dependentField, {
    is: true,
    then: (schema) => schema.required(`${message} is required`),
    otherwise: (schema) => schema.notRequired(),
  });
};

// export const RequiredWhen = (dependentField: string, requiredValues: Primitive[], label: string, type: "string" | "number" | "array" = "string") => {
//   return Yup.mixed().when(dependentField, (value: DepValue) => {
//     const match = Array.isArray(value) ? value.some((v) => requiredValues.includes(v)) : requiredValues.includes(value as Primitive);

//     if (match) {
//       return Validation(type, label, { required: true, ...(type === "array" && { minItems: 1 }) });
//     }

//     return Validation(type, label, { required: false, ...(type === "array" && { minItems: 1 }) });
//   });
// };

export const RequiredWhen = (dependentField: string, requiredValues: Primitive[], label: string, type: "string" | "number" | "array" = "string", options?: { extraRules?: (schema: Yup.AnySchema) => Yup.AnySchema }) => {
  let schema: Yup.AnySchema;

  // Base schema by type
  if (type === "number") schema = Yup.number();
  else if (type === "array") schema = Yup.array();
  else schema = Yup.string();

  // Apply extra rules if provided
  if (options?.extraRules) schema = options.extraRules(schema);

  return schema.test("required-when", `${label} is required`, (value, { from }) => {
    const root = from?.[from.length - 1]?.value;
    const dependentValue = root?.[dependentField];
    const match = requiredValues.includes(dependentValue);

    if (match) {
      if (type === "array") return Array.isArray(value) && value.length > 0;
      if (type === "number") return value !== undefined && value !== null;
      return !!value;
    }

    return true;
  });
};

export const FormatCountryCode = (code?: string) => {
  if (!code) return "";
  return code.startsWith("+") ? code : `+${code}`;
};

// ---------- Reusable helpers ----------

export const PhoneValidation = (label = "Phone No", options?: { requiredCountryCode?: boolean; requiredNumber?: boolean }) =>
  Yup.object({
    countryCode: Validation("string", "Country code", {
      required: options?.requiredCountryCode ?? true,
    }),

    phoneNo: Validation("string", label, {
      required: options?.requiredNumber ?? true,
      extraRules: (s) => s.trim().matches(/^[0-9]{10}$/, "Phone number must be 10 digits"),
    }),
  });

// Signin
export const SigninSchema = Yup.object({
  email: Validation("string", "Email", { extraRules: (s) => s.email("Invalid email address") }),
  password: Validation("string", "Password", { extraRules: (s) => s.matches(/[!@#$%^&*()_+={}:;"'<>,.?/-]/, "Password must include at least one special character") }),
});

export const UserFormSchema = Yup.object({
  // ---------- BASIC DETAILS ----------
  companyId: Validation("string", "Company Name", { required: false }),
  fullName: Validation("string", "FullName"),
  username: Validation("string", "Username"),
  designation: Validation("string", "Designation", { required: false }),
  role: Validation("string", "Role"),
  phoneNo: PhoneValidation(),
  email: Validation("string", "Email", { required: true, extraRules: (s) => s.trim().email("Invalid email address") }),
  branchId: Validation("string", "Branch Name", { required: false }),
  panNumber: Validation("string", "PAN Number", { required: false, extraRules: (s) => s.trim().matches(/^[A-Z]{5}[0-9]{4}[A-Z]{1}$/, "Invalid PAN Number") }),
  password: Validation("string", "Password", { extraRules: (s) => s.matches(/[!@#$%^&*()_+={}:;"'<>,.?/-]/, "Password must include at least one special character") }),

  // ---------- ADDRESS ----------
  address: Yup.object({
    address: Validation("string", "Address"),
    country: Validation("string", "Country"),
    state: Validation("string", "State"),
    city: Validation("string", "City"),
    pinCode: Validation("number", "Pin Code"),
  }).nullable(),

  // ---------- SALARY ----------
  wages: Validation("number", "Wages", { required: false }).nullable(),
  commission: Validation("number", "Commission", { required: false }).nullable(),
  extraWages: Validation("number", "Extra Wages", { required: false }).nullable(),
  target: Validation("number", "Target", { required: false }).nullable(),

  // ---------- STATUS ----------
  isActive: Yup.boolean(),
});

//----------- Branch ----------
export const BranchFormSchema = Yup.object({
  name: Validation("string", "Branch Name"),
  phoneNo: PhoneValidation(),
  telephoneNumber: Validation("string", "Telephone No.", { required: false }),
  email: Validation("string", "Email", { required: false, extraRules: (s) => s.trim().email("Invalid email address") }),
  webSite: Validation("string", "Website", { required: false }),
  fssaiNo: Validation("string", "FSSAI No.", { required: false }),
  contactName: Validation("string", "Contact Person", { required: false }),
  displayName: Validation("string", "Display Name"),
  userName: Validation("string", "Username"),
  yearInterval: Validation("string", "Year Interval"),
  companyId: Validation("string", "Company"),
  panNumber: Validation("string", "PAN No.", { required: false, extraRules: (s) => s.trim().matches(/^[A-Z]{5}[0-9]{4}[A-Z]{1}$/, "Invalid PAN Number") }),
  gstRegistrationType: Validation("string", "GST Registration Type", { required: false }),
  isActive: Yup.boolean(),
  address: Yup.object({
    address: Validation("string", "Address"),
    country: Validation("string", "Country"),
    state: Validation("string", "State"),
    city: Validation("string", "City"),
    pinCode: Validation("number", "Pin Code"),
  }).nullable(),
  bankId: Validation("string", "select Bank"),
});

export const BrandFormSchema = Yup.object({
  name: Validation("string", "Brand name"),
  code: Validation("string", "code", { required: false }),
  description: Validation("string", "Description", { required: false }),
  parentBrandId: Validation("string", "Parent Brand", { required: false }),
  isActive: Validation("boolean", "is Active", { required: false }),
});

export const ProductFormSchema = Yup.object({
  productTypeId: Validation("string", "Type"),
  sku: Validation("string", "sku", { required: false }),
  productType: Validation("string", "Product Type"),
  name: Validation("string", "Product Name"),
  printName: Validation("string", "Print Name"),
  hsnCode: Validation("string", "HSN Code", { required: false }),
  categoryId: Validation("string", "Category"),
  subCategoryId: Validation("string", "Sub Category", { required: false }),
  brandId: Validation("string", "Brand"),
  subBrandId: Validation("string", "Sub Brand", { required: false }),
  cessPercentage: Validation("number", "Cess Percentage", { required: false }),
  // uomId: Validation("string", "UOM"),
  manageMultipleBatch: Validation("boolean", "Multiple Batch", { required: false }),
  hasExpiry: RequiredWhenTrue("manageMultipleBatch", "Has Expiry", Yup.boolean()),
  expiryDays: RequiredWhenTrue("hasExpiry", "Expiry Days", Yup.number()),
  calculateExpiryOn: RequiredWhenTrue("hasExpiry", "Expiry Calculation", Yup.string()),
  expiryReferenceDate: RequiredWhenTrue("hasExpiry", "Expiry Reference Date", Yup.string()),

  isExpiryProductSaleable: Yup.boolean(),
  ingredients: Validation("array", "Ingredients", { required: false }),
  shortDescription: Validation("string", "Short Description", { required: false }),
  description: Validation("string", "Description", { required: false }),
  nutrition: Yup.array().of(
    Yup.object({
      name: Validation("string", "Nutrition Name", { required: false }),
      value: Validation("string", "Nutrition Value", { required: false }),
    }),
  ),
  netWeight: Validation("number", "Net Weight", { required: false }),
  masterQty: Validation("number", "Master Quantity", { required: false }),
  // images: Yup.array().of(Yup.mixed().required("Image is required")).min(2, "At least two image is required"),
  isActive: Yup.boolean(),
});

export const CategoryFormSchema = Yup.object({
  name: Validation("string", "Category name"),
  code: Validation("string", "code", { required: false }),
  description: Validation("string", "Description", { required: false }),
  parentCategoryId: Validation("string", "Parent Category", { required: false }),
  isActive: Validation("boolean", "is Active", { required: false }),
});

export const UomFormSchema = Yup.object({
  name: Validation("string", "Uom name"),
  code: Validation("string", "code"),
});

export const TaxFormSchema = Yup.object({
  name: Validation("string", "Tax Name"),
  percentage: Validation("number", "Percentage"),
});

export const ProductItemFormSchema = Yup.object({
  companyId: Validation("string", "Company"),
  productId: Validation("string", "Product"),
  uomId: Validation("string", "UOM"),
  purchasePrice: Validation("number", "Purchase Price"),
  landingCost: Validation("number", "Landing Cost"),
  mrp: Validation("number", "MRP"),
  sellingDiscount: Validation("number", "Selling Discount", { required: false }),
  sellingPrice: Validation("number", "Selling Price"),
  sellingMargin: Validation("number", "Selling Margin"),
  qty: Validation("number", "Quantity"),
});

export const ProductItemRemoveFormSchema = Yup.object({
  type: Validation("string", "Consumption Type"),
});

export const CompanyFormSchemas = Yup.object({
  accountingType: Validation("string", "Accounting Type"),
  name: Validation("string", "Company Name"),
  displayName: Validation("string", "display Name"),
  contactName: Validation("string", "contact Name"),
  email: Validation("string", "Email", { extraRules: (s) => s.trim().email("Invalid email address") }),
  supportEmail: Validation("string", "support Email", { required: false, extraRules: (s) => s.trim().email("Invalid email address") }),
  customerCareNumber: Validation("string", "customer Care Number", { required: false }),
  phoneNo: PhoneValidation(),
  ownerNo: PhoneValidation("Owner No.", { requiredCountryCode: false, requiredNumber: false }),
  planStartDate: Validation("string", "Plan Start Date"),
  planEndDate: Validation("string", "Plan End Date"),

  address: Yup.object({
    address: Validation("string", "Address", { required: false }),
    country: Validation("string", "Country", { required: false }),
    state: Validation("string", "State", { required: false }),
    city: Validation("string", "City", { required: false }),
    pinCode: Validation("string", "Pin Code", {
      required: false,
      extraRules: (s) => s.matches(/^[0-9]{6}$/, "Pin code must be 6 digits"),
    }),
  }).nullable(),

  bankId: Validation("string", "select Bank", { required: false }),
  upiId: Validation("string", "upiId", { required: false }),

  userName: Validation("string", "userName", { required: false }),
  GSTRegistrationType: Validation("string", "GSTRegistrationType", { required: false }),
  GSTIdentificationNumber: Validation("string", "GSTIdentificationNumber", { required: false }),
  PanNo: Validation("string", "PanNo", { required: false, extraRules: (s) => s.trim().matches(/^[A-Z]{5}[0-9]{4}[A-Z]{1}$/, "Invalid Pan Number") }),
  taxDeductionAndCollectionAccountNumber: Validation("string", "taxDeductionAndCollectionAccountNumber", { required: false }),
  webSite: Validation("string", "webSite", { required: false }),
  financialYear: Validation("string", "financialYear", { required: false }),
  corporateIdentificationNumber: Validation("string", "corporateIdentificationNumber", { required: false }),
  letterOfUndertaking: Validation("string", "letterOfUndertaking", { required: false }),
  importerExporterCode: Validation("string", "importerExporterCode", { required: false }),
  outletSize: Validation("string", "outletSize", { required: false }),
  fssaiNo: Validation("string", "fssaiNo", { required: false, extraRules: (s) => s.trim().matches(/^[0-9]{14}$/, "FSSAI number must be exactly 14 digits") }),
  currency: Validation("string", "currency", { required: false }),
  printDateFormat: Validation("string", "printDateFormat", { required: false }),
  decimalPoint: Validation("string", "decimalPoint", { required: false }),

  allowRoundOff: Validation("boolean", "allowRoundOff", { required: false }),
  enableFeedbackModule: Validation("boolean", "enableFeedbackModule", { required: false }),

  logo: Validation("string", "Logo", { required: false }),
  waterMark: Validation("string", "Water Mark", { required: false }),
  reportFormatLogo: Validation("string", "Report Format Logo", { required: false }),
  authorizedSignature: Validation("string", "Authorized Signature", { required: false }),
});

export const LocationFormSchema = Yup.object({
  code: Validation("string", "code", { required: false }),
  type: Validation("string", "Type"),
  name: Validation("string", "Location name"),
  parentId: RequiredWhen("type", ["state", "city"], "Parent Location", "string"),
  isActive: Validation("boolean", "is Active", { required: false }),
});

export const RoleFormSchema = Yup.object({
  name: Validation("string", "Role name"),
  isActive: Validation("boolean", "is Active", { required: false }),
});

export const ModuleFormSchema = Yup.object({
  tabName: Validation("string", "Tab name"),
  displayName: Validation("string", "Display name"),
  tabUrl: Validation("string", "Tab url", { required: false }),
  number: Validation("number", "Number"),
  parentId: Validation("string", "Parent Module", { required: false }),
  hasDefault: Validation("boolean", "hasDefault", { required: false }),
  hasAdd: Validation("boolean", "hasAdd", { required: false }),
  hasEdit: Validation("boolean", "hasEdit", { required: false }),
  hasView: Validation("boolean", "hasView", { required: false }),
  hasDelete: Validation("boolean", "hasDelete", { required: false }),
  isActive: Validation("boolean", "is Active", { required: false }),
});

export const AccountFormSchema = Yup.object({
  name: Validation("string", "Account name"),
  GroupId: Validation("string", "Group", { required: false }),
  type: Validation("string", "Type", { required: false }),
  nature: Validation("string", "Nature", { required: false }),
  isActive: Validation("boolean", "is Active", { required: false }),
});

export const DebitNoteFormSchema = Yup.object({
  companyId: Validation("string", "Company"),
  personName: Validation("string", "Person Name", { required: false }),
  date: Validation("string", "Date"),
  bankAccountId: Validation("string", "Bank Account"),
  phoneNo: PhoneValidation(),
  amount: Validation("string", "Amount", { required: true, extraRules: (s) => s?.matches(/^\d+(\.\d{1,2})?$/, "The amount no can only consist of number").max(10, "The amount no must be 10 digit long") }),
  description: Validation("string", "Description", { required: false, extraRules: (s) => s?.trim().max(200, "Maximum 200 characters allowed") }),
});

export const CreditNoteFormSchema = Yup.object({
  companyId: Validation("string", "Company"),
  personName: Validation("string", "Person Name", { required: false }),
  date: Validation("string", "Date"),
  bankAccountId: Validation("string", "Bank Account"),
  phoneNo: PhoneValidation(),
  amount: Validation("string", "Amount", { required: true, extraRules: (s) => s?.matches(/^\d+(\.\d{1,2})?$/, "The amount no can only consist of number").max(10, "The amount no must be 10 digit long") }),
  description: Validation("string", "Description", { required: false, extraRules: (s) => s?.trim().max(200, "Maximum 200 characters allowed") }),
});

export const MaterialConsumptionFormSchema = Yup.object({
  companyId: Validation("string", "Company"),
  consumptionTypeId: Validation("string", "Consumption Type", { required: false }),
  branchId: Validation("string", "Branch"),
  date: Validation("string", "Date"),
  remark: Validation("string", "Remark", { required: false, extraRules: (s) => s?.trim().max(200, "Maximum 200 characters allowed") }),
});

export const PurchaseOrderFormSchema = Yup.object({
  supplierId: Validation("string", "Supplier"),
  orderDate: Validation("string", "Order Date"),
  shippingDate: Validation("string", "Shipping Date"),
  taxType: Validation("string", "Tax Type", { required: false }),
  termsCondition: Validation("string", "Terms & Condition", { required: false }),
  notes: Validation("string", "Notes", { required: false, extraRules: (s) => s?.trim().max(200, "Maximum 200 characters allowed") }),

  items: Yup.array()
    .of(
      Yup.object({
        productId: Validation("string", "Product"),
        qty: Validation("number", "Quantity", { extraRules: (s) => s.min(1, "Quantity must be at least 1") }),
      }),
    )
    .min(1, "At least one item is required"),
});

export const TermsConditionFormSchema = Yup.object({
  termsCondition: Validation("string", "Terms and Condition"),
  isDefault: Validation("boolean", "Is Default", { required: false }),
  isActive: Validation("boolean", "is Active", { required: false }),
});
export const AdditionalChargesFormSchema = Yup.object({
  name: Validation("string", "Additional charge name"),
  type: Validation("string", "Type"),
  taxId: Validation("string", "Tax", { required: false }).nullable(),
  hsnSac: Validation("string", "HSN/SAC", { required: false }),
  defaultValue: Validation("number", "Default value", { required: false }).nullable(),
  isActive: Yup.boolean(),
});

export const RecipeFormSchema = Yup.object({
  name: Validation("string", "name"),
  date: Yup.mixed().required("Date is required"),
  number: Validation("string", "number", { required: false }),
  type: Validation("string", "type"),
  rawProducts: Yup.array()
    .of(
      Yup.object({
        productId: Validation("string", "Product").required("Product is required"),
        useQty: Validation("number", "Use Qty").required("Use Qty is required"),
        mrp: Validation("number", "MRP").nullable(),
      }),
    )
    .min(1, "At least one raw product is required")
    .required("Raw products are required"),

  finalProducts: Yup.object({
    productId: Validation("string", "Product").required("Product is required"),
    qtyGenerate: Validation("number", "Qty Generate").required("Qty Generate is required"),
    mrp: Validation("number", "MRP").nullable(),
  }).required("Final product is required"),
});

// ---------- Complete Contact Schema with conditional fields ----------

const ContactAddressSchema = Yup.object().shape({
  gstType: Validation("string", "GST Type", { required: false }),
  gstIn: Yup.string().when("gstType", {
    is: "UnRegistered",
    then: (schema) => schema.notRequired().nullable(),
    otherwise: (schema) => schema.required("GSTIN is required"),
  }),
  contactFirstName: Validation("string", "Contact First Name"),
  contactLastName: Validation("string", "Contact Last Name", { required: false }),
  contactCompanyName: Validation("string", "Contact Company Name", { required: false }),
  contactNo: PhoneValidation("Contact No", { requiredCountryCode: false, requiredNumber: false }).nullable().notRequired(),
  contactEmail: Validation("string", "Email", { required: false, extraRules: (s) => s.email("Invalid email address") }),
  addressLine1: Validation("string", "Address Line 1", { required: false }),
  addressLine2: Validation("string", "Address Line 2", { required: false }),
  country: Validation("string", "Country"),
  state: Validation("string", "State"),
  city: Validation("string", "City"),
  pinCode: Validation("string", "Pin Code", { required: false, extraRules: (s) => s.matches(/^[0-9]{6}$/, "Pin code must be 6 digits") }),
  tanNo: Validation("string", "Tan No", { required: false }),
});
const ContactBaseSchema = {
  firstName: Validation("string", "First Name"),
  lastName: Validation("string", "Last Name"),
  email: Validation("string", "Email", { required: false, extraRules: (s) => s.email("Invalid email address") }),
  companyId: Validation("string", "Company Name"),
  phoneNo: PhoneValidation(),
  whatsappNo: PhoneValidation("Whatsapp No", { requiredNumber: false, requiredCountryCode: false }),
  panNo: Validation("string", "PAN No", { required: false, extraRules: (s) => s.matches(/^[A-Z]{5}[0-9]{4}[A-Z]{1}$/, "Invalid PAN Number") }),
  paymentMode: Validation("string", "Payment Mode"),
  paymentTerms: Validation("string", "Payment Terms", { required: false }),
  openingBalance: Yup.object().shape({
    debitBalance: Validation("number", "Debit Balance", { required: false }),
    creditBalance: Validation("number", "Credit Balance", { required: false }),
  }),
  dob: Validation("string", "Date of Birth", { required: false }),
  anniversaryDate: Validation("string", "Anniversary Date", { required: false }),
  telephoneNo: Validation("string", "Telephone No", { required: false }),
  tanNo: Validation("string", "Tan No", { required: false }),
  remarks: Validation("string", "Remarks", { required: false }),
  address: Yup.array().of(
    ContactAddressSchema.when("$contactType", (contactType, schema) => {
      if (contactType?.[0] === "customer") return schema;
      return schema.shape({
        contactFirstName: Validation("string", "Contact First Name", { required: false }),
        country: Validation("string", "Country", { required: false }),
        state: Validation("string", "State", { required: false }),
        city: Validation("string", "City", { required: false }),
        gstIn: Yup.string().notRequired(),
      });
    }),
  ),
  bankDetails: Yup.object().shape({
    ifscCode: Validation("string", "IFSC Code", { required: false }),
    name: Validation("string", "Bank Name", { required: false }),
    branch: Validation("string", "Bank Branch", { required: false }),
    accountNumber: Validation("string", "Account Number", { required: false }),
  }),
};
export const getContactFormSchema = Yup.object({
  ...ContactBaseSchema,
  customerCategory: Validation("string", "Customer Category", { required: false }),
  customerType: Validation("string", "Customer Type", { required: false }),
  supplierType: Validation("string", "Supplier Type", { required: false }),
  transporterId: RequiredWhen("contactType", ["transporter"], "Transporter Id", "string"),
});
export const BankFormSchema = Yup.object().shape({
  companyId: Validation("string", "Company"),
  name: Validation("string", "Name"),
  branchName: Validation("string", "Branch Name"),
  accountHolderName: Validation("string", "Account Holder Name"),
  bankAccountNumber: Validation("string", "Account Number"),
  ifscCode: Validation("string", "IFSC Code"),
  swiftCode: Validation("string", "Swift Code", { required: false }),
  upiId: Validation("string", "UPI ID", { required: false, extraRules: (s) => s.trim().matches(/^[a-zA-Z0-9.\-_]{2,256}@[a-zA-Z]{2,64}$/, "Invalid UPI ID") }),
  openingBalance: Yup.object({
    creditBalance: Validation("number", "Credit Balance", { required: false }).nullable(),
    debitBalance: Validation("number", "Debit Balance", { required: false }).nullable(),
  }).nullable(),
  address: Yup.object({
    addressLine1: Validation("string", "Address Line1"),
    addressLine2: Validation("string", "Address Line2", { required: false }),
    country: Validation("string", "Country"),
    state: Validation("string", "State"),
    city: Validation("string", "City"),
    pinCode: Validation("string", "Pin Code", { extraRules: (s) => s.matches(/^[0-9]{5,6}$/, "Invalid Pin Code") }),
  }).nullable(),
});

export const BankTransactionFormSchema = Yup.object({
  companyId: Validation("string", "Company"),
  transactionDate: Validation("string", "Transaction Date"),
  transactionType: Validation("string", "Transaction Type"),
  fromAccount: Validation("string", "From Account"),
  toAccount: Validation("string", "To Account"),
  amount: Validation("number", "Amount"),
  description: Validation("string", "Description", { required: false }),
});

export const CouponFormSchema = Yup.object({
  companyId: Validation("string", "Company"),
  name: Validation("string", "Name"),
  couponPrice: Validation("number", "Coupon Price"),
  redeemValue: Validation("number", "Redeem Value"),
  usageLimit: Validation("number", "Usage Limit"),
  expiryDays: Validation("number", "Expiry Days"),
  startDate: Validation("string", "Start Date"),
  endDate: Validation("string", "End Date"),
  redemptionType: Validation("string", "Redemption Type"),
  singleTimeUse: Validation("boolean", "Single Time Use"),
  status: Validation("string", "Status"),
  isActive: Validation("boolean", "Is Active"),
});

export const LoyaltyFormSchema = Yup.object({
  name: Validation("string", "Name"),
  discountValue: Validation("number", "Discount Value"),
  type: Validation("string", "Type"),
  minimumPurchaseAmount: Validation("number", "Minimum Purchase Amount"),
  redemptionPoints: Validation("number", "Redemption Points"),
  singleTimeUse: Validation("boolean", "Single Time Use"),
  usageLimit: Validation("number", "Usage Limit"),
  campaignExpiryDate: Validation("string", "Campaign Expiry Date"),
  campaignLaunchDate: Validation("string", "Campaign Launch Date"),
  description: Validation("string", "Description", { required: false }),
  isActive: Validation("boolean", "Is Active"),
});
export const PointSetupSchema = Yup.object({
  amount: Validation("string", "Amount", {
    required: true,
    extraRules: (s) => s.min(1, "Amount must be at least 1").max(5, "Amount must not be greater than 5"),
  }),

  points: Validation("string", "Points", {
    required: true,
    extraRules: (s) => s.min(1, "Points must be at least 1").max(5, "Points must not be greater than 5"),
  }),
});

export const EmployeeFormSchema = Yup.object({
  // ---------- BASIC DETAILS ----------
  fullName: Validation("string", "FullName"),
  username: Validation("string", "Username"),
  designation: Validation("string", "Designation", { required: false }),
  phoneNo: PhoneValidation(),
  email: Validation("string", "Email", { required: true, extraRules: (s) => s.trim().email("Invalid email address") }),
  branchId: Validation("string", "Branch Name", { required: false }),
  panNumber: Validation("string", "PAN Number", { required: false, extraRules: (s) => s.trim().matches(/^[A-Z]{5}[0-9]{4}[A-Z]{1}$/, "Invalid PAN Number") }),
  password: Validation("string", "Password", { extraRules: (s) => s.matches(/[!@#$%^&*()_+={}:;"'<>,.?/-]/, "Password must include at least one special character") }),
  // role: Validation("string", "Role"),
  // ---------- ADDRESS ----------
  address: Yup.object({
    address: Validation("string", "Address"),
    country: Validation("string", "Country"),
    state: Validation("string", "State"),
    city: Validation("string", "City"),
    pinCode: Validation("string", "Pin Code", { extraRules: (s) => s.matches(/^[0-9]{5,6}$/, "Invalid Pin Code") }),
  }).nullable(),

  // ---------- SALARY ----------
  wages: Validation("number", "Wages", { required: false }).nullable(),
  commission: Validation("number", "Commission", { required: false }).nullable(),
  extraWages: Validation("number", "Extra Wages", { required: false }).nullable(),
  target: Validation("number", "Target", { required: false }).nullable(),

  // ---------- STATUS ----------
  isActive: Yup.boolean(),
});

export const ChangePasswordSchema = Yup.object({
  email: Validation("string", "Email", { required: true, extraRules: (s) => s.trim().email("Invalid email address") }),
  oldPassword: Validation("string", "Old Password", { extraRules: (s) => s.matches(/[!@#$%^&*()_+={}:;"'<>,.?/-]/, "Password must include at least one special character") }),
  newPassword: Validation("string", "New Password", { extraRules: (s) => s.matches(/[!@#$%^&*()_+={}:;"'<>,.?/-]/, "Password must include at least one special character") }),
  loginSource: Validation("string", "Login Source", { required: false }),
});

export const VerifyOtpSchema = Yup.object({
  otp: Validation("string", "OTP", { extraRules: (s) => s.matches(/^[0-9]{6}$/, "OTP must be 6 digits") }),
});

export const ProfileSchema = Yup.object({
  fullName: Validation("string", "Full Name"),
  username: Validation("string", "User Name"),
  phoneNo: PhoneValidation(),
  email: Validation("string", "Email", { extraRules: (s) => s.trim().email("Invalid email address") }),
});

export const AdminSettingFormSchema = Yup.object({
  logo: Validation("string", "Logo", { required: false }),
  favicon: Validation("string", "Favicon", { required: false }),
  themeImage: Validation("string", "Theme Image", { required: false }),
  phoneNo: PhoneValidation("Phone No", { requiredCountryCode: false, requiredNumber: false }),
  email: Validation("string", "Email", { required: false, extraRules: (s) => s.trim().email("Invalid email address") }),
  address: Validation("string", "Address", { required: false }),
  workingHours: Yup.object({
    startTime: Validation("string", "Start Time", { required: false }),
    endTime: Validation("string", "End Time", { required: false }),
    timezone: Validation("string", "Timezone", { required: false }),
  }).nullable(),
  links: Yup.array()
    .of(
      Yup.object({
        title: Validation("string", "Title", { required: false }),
        link: Validation("string", "Link", { required: false }),
        icon: Validation("string", "Icon", { required: false }),
        isActive: Yup.boolean().nullable(),
      }),
    )
    .nullable(),
});

export const ReturnPosOrderFormSchema = Yup.object({
  refundViaCash: Validation("number", "Refund Via Cash"),
  bankAccountId: Validation("string", "Bank Account", { required: false }),
  refundViaBank: Validation("number", "Refund Via Bank").when("bankAccountId", {
    is: (val: string | undefined) => !!val && val.trim() !== "",
    then: (schema) => schema.required("Refund Via Bank is required"),
    otherwise: (schema) => schema.notRequired(),
  }),
  refundDescription: Validation("string", "Refund Description", { required: false }),
});

export const ProductTypeFormSchema = Yup.object({
  name: Validation("string", "Product Type Name"),
  isActive: Yup.boolean(),
});

export const PaymentFormSchema = Yup.object({
  companyId: Validation("string", "Company"),
  partyId: Validation("string", "Party"),
  date: Yup.mixed().required("Payment Date is required"),
  paymentType: Validation("string", "Payment Type"),
  posOrderId: RequiredWhen("paymentType", ["against_bill"], "Sales", "string"),
  paymentMode: Validation("string", "Payment Mode"),
  bankId: RequiredWhen("paymentMode", ["bank", "upi", "cheque", "card"], "Bank", "string"),
  amount: Validation("string", "Amount", { required: true, extraRules: (s) => s?.matches(/^\d+(\.\d{1,2})?$/, "The amount no can only consist of number").max(10, "The amount no must be 10 digit long") }),
  totalAmount: Validation("number", "Total Amount", { required: false }).nullable(),
  paidAmount: Validation("number", "Paid Amount", { required: false }).nullable(),
  pendingAmount: Validation("number", "Pending Amount", { required: false }).nullable(),
  kasar: Validation("number", "Kasar Amount", { required: false }).nullable(),
  remark: Validation("string", "Description", {
    required: false,
    extraRules: (s) => s.trim().max(200, "Maximum 200 characters allowed"),
  }),
  isActive: Yup.boolean(),
});

export const ReciptFormSchema = Yup.object({
  companyId: Validation("string", "Company"),
  partyId: Validation("string", "Party"),
  date: Yup.mixed().required("Receipt Date is required"),
  paymentType: Validation("string", "Payment Type"),
  posOrderId: RequiredWhen("paymentType", ["against_bill"], "Sales", "string"),
  paymentMode: Validation("string", "Payment Mode"),
  bankId: RequiredWhen("paymentMode", ["bank", "upi", "cheque", "card"], "Bank", "string"),
  amount: Validation("string", "Amount", { required: true, extraRules: (s) => s?.matches(/^\d+(\.\d{1,2})?$/, "The amount no can only consist of number").max(10, "The amount no must be 10 digit long") }),
  totalAmount: Validation("number", "Total Amount", { required: false }).nullable(),
  paidAmount: Validation("number", "Paid Amount", { required: false }).nullable(),
  pendingAmount: Validation("number", "Pending Amount", { required: false }).nullable(),
  kasar: Validation("number", "Kasar Amount", { required: false }).nullable(),
  remark: Validation("string", "Description", {
    required: false,
    extraRules: (s) => s.trim().max(200, "Maximum 200 characters allowed"),
  }),
  isActive: Yup.boolean(),
});

export const ExpenseFormSchema = Yup.object({
  companyId: Validation("string", "Company"),
  partyId: Validation("string", "Party"),
  image: Validation("string", "Image", { required: false }),
  fromDate: Validation("string", "Date"),
  amount: Validation("number", "Amount"),
  remark: Validation("string", "Description", {
    required: false,
    extraRules: (s) => s.trim().max(200, "Maximum 200 characters allowed"),
  }),
  type: Validation("string", "Type", { required: false }),
  isActive: Yup.boolean(),
});

export const SalaryFormSchema = Yup.object({
  companyId: Validation("string", "Company"),
  partyId: Validation("string", "Party"),
  image: Validation("string", "Image", { required: false }),
  fromDate: Validation("string", "Date"),
  toDate: Validation("string", "Date"),
  amount: Validation("number", "Amount"),
  incentive: Validation("number", "Incentive", { required: false }),
  description: Validation("string", "Description", {
    required: false,
    extraRules: (s) => s.trim().max(200, "Maximum 200 characters allowed"),
  }),
  type: Validation("string", "Type", { required: false }),
  isActive: Yup.boolean(),
});

export const EstimateFormSchema = Yup.object({
  companyId: Validation("string", "Company"),
  customerId: Validation("string", "Customer"),
  date: Validation("string", "Date"),
  dueDate: Validation("string", "Due Date"),
  items: Yup.array()
    .of(
      Yup.object({
        productId: Validation("string", "Product"),
        qty: Validation("number", "Quantity", { extraRules: (s) => s.min(1, "Quantity must be at least 1") }),
        price: Validation("number", "Price", { extraRules: (s) => s.min(0.01, "Price must be greater than 0") }),
      }),
    )
    .min(1, "At least one item is required"),
});

export const SalesOrderFormSchema = Yup.object({
  companyId: Validation("string", "Company"),
  customerId: Validation("string", "Customer"),
  date: Validation("string", "Date"),
  dueDate: Validation("string", "Due Date", { required: false }),
  items: Yup.array()
    .of(
      Yup.object({
        productId: Validation("string", "Product"),
        qty: Validation("number", "Quantity", { extraRules: (s) => s.min(1, "Quantity must be at least 1") }),
        price: Validation("number", "Price", { extraRules: (s) => s.min(0.01, "Price must be greater than 0") }),
      }),
    )
    .min(1, "At least one item is required"),
});
export const InvoiceFormSchema = Yup.object({
  companyId: Validation("string", "Company"),
  customerId: Validation("string", "Customer"),
  date: Validation("string", "Date"),
  dueDate: Validation("string", "Due Date", { required: false }),
  items: Yup.array()
    .of(
      Yup.object({
        productId: Validation("string", "Product"),
        qty: Validation("number", "Quantity", { extraRules: (s) => s.min(1, "Quantity must be at least 1") }),
        price: Validation("number", "Price", { extraRules: (s) => s.min(0, "Price must be positive") }),
      }),
    )
    .min(1, "At least one item is required"),
});

export const DeliveryChallanFormSchema = Yup.object({
  companyId: Validation("string", "Company"),
  customerId: Validation("string", "Customer"),
  date: Validation("string", "Date"),
  dueDate: Validation("string", "Due Date"),
  items: Yup.array()
    .of(
      Yup.object({
        productId: Validation("string", "Product"),
        qty: Validation("number", "Quantity", { extraRules: (s) => s.min(1, "Quantity must be at least 1") }),
        price: Validation("number", "Price", { extraRules: (s) => s.min(0, "Price must be positive") }),
      }),
    )
    .min(1, "At least one item is required"),
});

export const SalesCreditNoteFormSchema = Yup.object({
  companyId: Validation("string", "Company"),
  customerId: Validation("string", "Customer"),
  creditNoteDate: Validation("string", "Credit Note Date"),
  dueDate: Validation("string", "Due Date", { required: false }),
  productDetails: Yup.array()
    .of(
      Yup.object({
        productId: Validation("string", "Product"),
        qty: Validation("number", "Quantity", { extraRules: (s) => s.min(0, "Quantity must be positive") }),
        price: Validation("number", "Price", { required: false, extraRules: (s) => s.min(0, "Price must be positive") }),
        discount1: Validation("number", "Discount", { required: false, extraRules: (s) => s.min(0) }),
      }),
    )
    .min(1, "At least one item is required"),
  summary: Yup.object({
    flatDiscount: Validation("number", "Flat Discount", { required: false }),
    roundOff: Validation("number", "Round Off", { required: false }),
  }),
});

export const SupplierBillFormSchema = Yup.object({
  companyId: Validation("string", "Company"),
  supplierId: Validation("string", "Supplier"),
  supplierBillDate: Validation("string", "Supplier Bill Date"),
  dueDate: Validation("string", "Due Date"),
  shippingDate: Validation("string", "Shipping Date"),
  invoiceAmount: Validation("string", "Invoice Amount"),
  productDetails: Yup.array()
    .of(
      Yup.object({
        productId: Validation("string", "Product"),
        qty: Validation("number", "Quantity", { extraRules: (s) => s.min(1, "Quantity must be at least 1") }),
        unitCost: Validation("number", "Unit Cost", { extraRules: (s) => s.min(0, "Unit cost must be positive") }),
      }),
    )
    .min(1, "At least one item is required"),
});

export const PurchaseDebitNoteFormSchema = Yup.object({
  companyId: Validation("string", "Company"),
  supplierId: Validation("string", "Supplier"),
  debitNoteDate: Validation("string", "Debit Note Date"),
  dueDate: Validation("string", "Due Date", { required: false }),
  productDetails: Yup.array()
    .of(
      Yup.object({
        productId: Validation("string", "Product"),
        qty: Validation("number", "Quantity", { extraRules: (s) => s.min(1, "Quantity must be at least 1") }),
        unitCost: Validation("number", "Unit Cost", { required: false, extraRules: (s) => s.min(0) }),
        discount1: Validation("number", "Discount", { required: false, extraRules: (s) => s.min(0) }),
      }),
    )
    .min(1, "At least one item is required"),
  summary: Yup.object({
    flatDiscount: Validation("number", "Flat Discount", { required: false }),
    roundOff: Validation("number", "Round Off", { required: false }),
  }),
});

export const DiscountFormSchema = Yup.object({
  companyId: Validation("string", "Company"),
  branchIds: Validation("array", "Branch", { minItems: 1 }),
  title: Validation("string", "Title"),
  discountCode: Validation("string", "Discount Code"),
  autoApply: Validation("boolean", "Auto Apply"),
  discountApplicable: Validation("string", "Discount Applicable"),
  excludeAlreadyDiscounted: RequiredWhenTrue("discountApplicable", "Exclude Already Discounted", Yup.boolean()),

  discountMode: Validation("string", "Discount Mode"),

  discountType: RequiredWhen("discountMode", [DISCOUNT_MODE_ENUM.NORMAL], "Discount Type", "string"),
  discountValue: RequiredWhen("discountMode", [DISCOUNT_MODE_ENUM.NORMAL], "Discount Value", "number", { extraRules: (s) => (s as Yup.NumberSchema).min(1, "Discount value must be at least 1") }),
  rangeWiseRules: Yup.array().of(
    Yup.object({
      minQty: RequiredWhen("discountMode", [DISCOUNT_MODE_ENUM.RANGE_WISE], "Minimum Quantity", "number", { extraRules: (s) => (s as Yup.NumberSchema).min(1, "Minimum quantity must be at least 1") }),
      maxQty: RequiredWhen("discountMode", [DISCOUNT_MODE_ENUM.RANGE_WISE], "Maximum Quantity", "number", { extraRules: (s) => (s as Yup.NumberSchema).min(1, "Maximum quantity must be at least 1") }),
      discountValue: RequiredWhen("discountMode", [DISCOUNT_MODE_ENUM.RANGE_WISE], "Discount Value", "number", { extraRules: (s) => (s as Yup.NumberSchema).min(1, "Discount value must be at least 1") }),
      discountType: RequiredWhen("discountMode", [DISCOUNT_MODE_ENUM.RANGE_WISE], "Discount Type", "string"),
    }),
  ),
  // .min(1, "At least one range wise rule is required"),

  categoryIds: RequiredWhen("appliesTo", [DISCOUNT_APPLY_TO_ENUM.SPECIFIC_CATEGORY], "Category", "array"),
  productIds: RequiredWhen("appliesTo", [DISCOUNT_APPLY_TO_ENUM.SPECIFIC_PRODUCTS], "Product", "array"),
  brandIds: RequiredWhen("appliesTo", [DISCOUNT_APPLY_TO_ENUM.SPECIFIC_BRAND], "Brand", "array"),
  excludedProductIds: RequiredWhen("appliesTo", [DISCOUNT_APPLY_TO_ENUM.SPECIFIC_BRAND, DISCOUNT_APPLY_TO_ENUM.SPECIFIC_CATEGORY, DISCOUNT_APPLY_TO_ENUM.SPECIFIC_PRODUCTS], "Brand", "array"),

  buyXGetY: Yup.object({
    buyQty: RequiredWhen("discountMode", [DISCOUNT_MODE_ENUM.BUY_X_GET_Y], "Select Quantity", "number", { extraRules: (s) => (s as Yup.NumberSchema).min(1, "Select Quantity must be at least 1") }),
    getProductIds: RequiredWhen("discountMode", [DISCOUNT_MODE_ENUM.BUY_X_GET_Y], "Select Products", "array"),
    getQty: RequiredWhen("discountMode", [DISCOUNT_MODE_ENUM.BUY_X_GET_Y], "Select Qty", "number", { extraRules: (s) => (s as Yup.NumberSchema).min(1, "Select Qty must be at least 1") }),
  }),

  productAtFixAmount: Yup.object({
    minimumAmount: RequiredWhen("discountMode", [DISCOUNT_MODE_ENUM.PRODUCT_AT_FIX_AMOUNT], "Minimum Purchase Amount", "number", { extraRules: (s) => (s as Yup.NumberSchema).min(1, "Minimum Purchase Amount must be at least 1") }),
    freeProductIds: RequiredWhen("discountMode", [DISCOUNT_MODE_ENUM.PRODUCT_AT_FIX_AMOUNT], "Select Products", "array"),
    freeQty: RequiredWhen("discountMode", [DISCOUNT_MODE_ENUM.PRODUCT_AT_FIX_AMOUNT], "Select Qty", "number", { extraRules: (s) => (s as Yup.NumberSchema).min(1, "Select Qty must be at least 1") }),
  }),

  minimumRequirement: RequiredWhen("discountMode", [DISCOUNT_MODE_ENUM.NORMAL], "Minimum Requirement", "string"),
  minimumPurchaseAmount: RequiredWhen("minimumRequirement", [MINIMUM_REQUIREMENT_ENUM.MIN_PURCHASE_AMOUNT], "Minimum Purchase Amount", "number", { extraRules: (s) => (s as Yup.NumberSchema).min(1, "Minimum Purchase Amount must be at least 1") }),
  minimumQuantity: RequiredWhen("minimumRequirement", [MINIMUM_REQUIREMENT_ENUM.MIN_QUANTITY], "Minimum Quantity", "number", { extraRules: (s) => (s as Yup.NumberSchema).min(1, "Minimum Quantity must be at least 1") }),

  usageLimitTotal: Validation("number", "Usage Limit Total", { required: false, extraRules: (s) => (s as Yup.NumberSchema).min(1, "Usage Limit Total must be at least 1") }),
  usageLimitPerCustomer: Validation("boolean", "Usage Limit Per Customer", { required: false }),

  startDateTime: Validation("string", "Start Date Time"),
  endDateTime: RequiredWhenTrue("hasEndDate", "End Date Time", Yup.string()),
});

export const PrefixFormSchema = Yup.object({
  prefixType: Validation("string", "Prefix Type"),
  prefix: Validation("string", "Prefix"),
  sequenceNumber: Validation("number", "Sequence Number", { required: false }),
});

export const ConsumptionTypeFormSchema = Yup.object({
  companyId: Validation("string", "Company", { required: false }),
  name: Validation("string", "Consumption Type Name"),
});

export const PaymentTermsFormSchema = Yup.object({
  companyId: Validation("string", "Company", { required: false }),
  name: Validation("string", "Payment Terms Name"),
  day: Validation("number", "Payment Terms Day", { extraRules: (s) => s.min(1, "Payment Terms Day must be at least 1") }),
});
