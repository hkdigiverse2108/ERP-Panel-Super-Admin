import * as Yup from "yup";
import { Validation } from "./Validation";

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
  password: Validation("string", "Password", { required: false, extraRules: (s) => s.matches(/[!@#$%^&*()_+={}:;"'<>,.?/-]/, "Password must include at least one special character") }),

  // ---------- ADDRESS ----------
  address: Yup.object({
    address: Validation("string", "Address"),
    country: Validation("string", "Country"),
    state: Validation("string", "State"),
    city: Validation("string", "City"),
    postalCode: Validation("string", "ZIP Code", { extraRules: (s) => s.matches(/^[0-9]{5,6}$/, "Invalid ZIP Code") }),
  }).nullable(),


  // ---------- SALARY ----------
  wages: Validation("number", "Wages", { required: false }).nullable(),
  commission: Validation("number", "Commission", { required: false }).nullable(),
  extraWages: Validation("number", "Extra Wages", { required: false }).nullable(),
  target: Validation("number", "Target", { required: false }).nullable(),

  // ---------- STATUS ----------
  isActive: Yup.boolean(),
});

export const BranchFormSchema = Yup.object({
  name: Validation("string", "Branch name"),
  address: Validation("string", "Address"),
  phoneNo: Validation("string", "Phone No.", { required: false }),
  isActive: Yup.boolean(),
});
export const BrandFormSchema = Yup.object({
  name: Validation("string", "Brand name"),
  code: Validation("string", "code"),
  description: Validation("string", "Description", { required: false }),
  parentBrandId: Validation("string", "Parent Brand", { required: false }),
  isActive: Validation("boolean", "is Active", { required: false }),
});

// ---------- Product Form Schema ----------
export const ProductFormSchema = Yup.object({
  productType: Validation("string", "Product Type"),
  name: Validation("string", "Product Name"),
  printName: Validation("string", "Print Name", { required: false }),
  slug: Validation("string", "Slug", { required: false }),

  categoryId: Validation("string", "Category"),
  subCategoryId: Validation("string", "Sub Category", { required: false }),

  brandId: Validation("string", "Brand", { required: false }),
  subBrandId: Validation("string", "Sub Brand", { required: false }),

  departmentId: Validation("string", "Department", { required: false }),
  uomId: Validation("string", "UOM"),

  tags: Validation("string", "Tags", { required: false }),

  description: Validation("string", "Description"),
  shortNote: Validation("string", "Short Note", { required: false }),

  mrp: Validation("number", "MRP"),
  sellingPrice: Validation("number", "Selling Price"),
  purchasePrice: Validation("number", "Purchase Price"),
  landingCost: Validation("number", "Landing Cost"),

  purchaseTaxId: Validation("string", "Purchase Tax", { required: false }),
  salesTaxId: Validation("string", "Sales Tax", { required: false }), 
  nutritionalFacts: Validation("string", "Nutritional Facts", { required: false }),
  status: Validation("string", "Status"),
});

export const CategoryFormSchema = Yup.object({
  name: Validation("string", "Category name"),
  code: Validation("string", "code"),
  description: Validation("string", "Description", { required: false }),
  parentCategoryId: Validation("string", "Parent Category", { required: false }),
  isActive: Validation("boolean", "is Active", { required: false }),
});

// ---------- Product Request Form Schema ----------
export const ProductRequestFormSchema = Yup.object({
  name: Validation("string", "Product Name"),
  printName: Validation("string", "Print Name", { required: false }),
  category: Validation("string", "Category"),
  subCategory: Validation("string", "Sub Category", { required: false }),
  brand: Validation("string", "Brand"),
  subBrand: Validation("string", "Sub Brand", { required: false }),
  productType: Validation("string", "Product Type"),
  hasExpiry: Validation("boolean", "Has Expiry", { required: false }),
  description: Validation("string", "Description", { required: false }),
  images: Yup.array().of(Yup.mixed().required("Image is required")).min(2, "At least two image is required"),
  isActive: Yup.boolean(),
});