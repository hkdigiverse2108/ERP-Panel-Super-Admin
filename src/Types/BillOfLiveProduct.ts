import type { BranchBase } from "./Branch";
import type { CommonDataType, MessageStatus, PageStatus } from "./Common";
import type { CompanyBase } from "./Company";
import type { ProductBase } from "./Product";
import type { RecipeBase } from "./Recipe";

/* ================= INGREDIENT ================= */

export interface BillOfLiveProductIngredient {
  productId: ProductBase | string;
  availableQty: number;
  useQty: number;
}

/* ================= DETAIL ================= */

export interface BillOfLiveProductDetail {
  productId: ProductBase | string;
  qty: number;
  purchasePrice: number;
  landingCost: number;
  mrp: number;
  sellingPrice: number;
  mfgDate?: string;
  expiryDays: number;
  expiryDate?: string;
  ingredients?: BillOfLiveProductIngredient[];
}

/* ================= FORM ================= */

export interface BillOfLiveProductFormValues {
  companyId?: string;
  branchId?: string;
  date?: string;
  number?: string;
  recipeId?: string[];
  allowReverseCalculation?: boolean;
  isActive?: boolean;
  _submitAction?: string;
  productDetails?: BillOfLiveProductDetail[];
}

export type AddBillOfLiveProductPayload = BillOfLiveProductFormValues;

export type EditBillOfLiveProductPayload = AddBillOfLiveProductPayload & { billOfLiveProductId?: string };

/* ================= BASE ================= */

export interface BillOfLiveProductBase extends Omit<BillOfLiveProductFormValues, "recipeId" | "productId" | "productDetails" | "companyId" | "branchId">, CommonDataType {
  recipeId?: RecipeBase[];
  productId: ProductBase;
  productDetails?: BillOfLiveProductDetail[];
  companyId?: CompanyBase;
  branchId?: BranchBase;
}

/* ================= API RESPONSE ================= */

export interface BillOfLiveProductDataResponse extends PageStatus {
  billOfLiveProduct_data: BillOfLiveProductBase[];
}

export interface BillOfLiveProductApiResponse extends MessageStatus {
  data: BillOfLiveProductDataResponse;
}
