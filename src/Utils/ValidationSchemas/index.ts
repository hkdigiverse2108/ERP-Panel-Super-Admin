import * as Yup from "yup";
import type { DepValue, Primitive } from "../../Types";
import { Validation } from "./Validation";

const RequiredWhenTrue = (dependentField: string, message: string, baseSchema: Yup.AnySchema) => {
  return baseSchema.when(dependentField, {
    is: true,
    then: (schema) => schema.required(`${message} is required`),
    otherwise: (schema) => schema.notRequired(),
  });
};

export const RequiredWhen = (dependentField: string, requiredValues: Primitive[], label: string, type: "string" | "number" = "string") => {
  return Yup.mixed().when(dependentField, (value: DepValue) => {
    const match = Array.isArray(value) ? value.some((v) => requiredValues.includes(v)) : requiredValues.includes(value as Primitive);

    if (match) {
      return Validation(type, label);
    }

    return Validation(type, label, { required: false });
  });
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
  companyId: Validation("string", "Company Name"),
  fullName: Validation("string", "FullName"),
  username: Validation("string", "Username"),
  designation: Validation("string", "Designation", { required: false }),
  role: Validation("string", "Role"),
  phoneNo: PhoneValidation(),
  email: Validation("string", "Email", { required: false, extraRules: (s) => s.trim().email("Invalid email address") }),
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
  ingredients: Validation("string", "Ingredients", { required: false }),
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
  images: Yup.array().of(Yup.mixed().required("Image is required")).min(2, "At least two image is required"),
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
  supportEmail: Validation("string", "support Email", { extraRules: (s) => s.trim().email("Invalid email address") }),
  customerCareNumber: Validation("string", "customer Care Number"),
  phoneNo: PhoneValidation(),
  ownerNo: PhoneValidation(),

  address: Validation("string", "address"),
  city: Validation("string", "city"),
  state: Validation("string", "State"),
  country: Validation("string", "country"),
  pinCode: Validation("string", "pinCode", { extraRules: (s) => s.trim().matches(/^[0-9]{6}$/, "Pin code must be 6 digits") }),

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

export const AccountGroupFormSchema = Yup.object({
  name: Validation("string", "Group name"),
  nature: Validation("string", "Nature"),
  parentGroupId: Validation("string", "Parent Group", { required: false }),
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
  voucherNumber: Validation("string", "Voucher Number", { required: false }),
  companyId: Validation("string", "Company"),
  date: Validation("string", "Date"),
  fromAccountId: Validation("string", "From Account"),
  toAccountId: Validation("string", "To Account"),
  amount: Validation("string", "Amount", { required: true, extraRules: (s) => s?.matches(/^\d+(\.\d{1,2})?$/, "The amount no can only consist of number").max(10, "The amount no must be 10 digit long") }),
  description: Validation("string", "Description", { required: false, extraRules: (s) => s?.trim().max(200, "Maximum 200 characters allowed") }),
});

export const CreditNoteFormSchema = Yup.object({
  voucherNumber: Validation("string", "Voucher Number", { required: false }),
  companyId: Validation("string", "Company"),
  date: Validation("string", "Date"),
  fromAccountId: Validation("string", "From Account"),
  toAccountId: Validation("string", "To Account"),
  amount: Validation("string", "Amount", { required: true, extraRules: (s) => s?.matches(/^\d+(\.\d{1,2})?$/, "The amount no can only consist of number").max(10, "The amount no must be 10 digit long") }),
  description: Validation("string", "Description", { required: false, extraRules: (s) => s?.trim().max(200, "Maximum 200 characters allowed") }),
});

export const MaterialConsumptionFormSchema = Yup.object({
  companyId: Validation("string", "Company"),
  branchId: Validation("string", "Branch"),
  date: Validation("string", "Date"),
  type: Validation("string", "Type", { required: false }),
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
