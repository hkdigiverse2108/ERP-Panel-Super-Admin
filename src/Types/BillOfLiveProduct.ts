import type { CommonDataType, MessageStatus, PageStatus } from "./Common";
import type { ProductBase } from "./Product";
import type { RecipeBase } from "./Recipe";

/* ================= UI MODELS ================= */

export interface IngredientUI {
  productId: ProductBase;
  batch?: string;
  availableQty?: number;
  useQty: number;
}

export interface BillOfLiveProductDetailUI {
  productId: ProductBase;
  qty: number;
  recipe?: RecipeBase;

  purchasePrice?: number;
  landingCost?: number;
  mrp?: number;
  sellingPrice?: number;

  mfgDate?: string;
  expiryDays?: number;
  expiryDate?: string;

  batchNo?: string;

  ingredients?: IngredientUI[];
}

/* ================= FORM ================= */

export interface BillOfLiveProductFormValues {
  date?: string;
  number?: string;
  recipeId?: string[];
  allowReverseCalculation?: boolean;
  productDetails?: BillOfLiveProductDetailUI[];
  isActive?: boolean;
  _submitAction?: string;
}

/* ================= PAYLOAD ================= */

export interface IngredientPayload {
  productId: string;
  batch?: string;
  availableQty?: number;
  useQty: number;
}

export interface BillOfLiveProductDetailPayload {
  productId: string;
  qty: number;

  purchasePrice?: number;
  landingCost?: number;
  mrp?: number;
  sellingPrice?: number;

  mfgDate?: string;
  expiryDays?: number;
  expiryDate?: string;

  batchNo?: string;

  ingredients?: IngredientPayload[];
}

export type AddBillOfLiveProductPayload = {
  number?: string;
  date?: string;
  recipeId?: string[];
  allowReverseCalculation?: boolean;
  productDetails?: BillOfLiveProductDetailPayload[];
  companyId?: string;
};

export type EditBillOfLiveProductPayload = AddBillOfLiveProductPayload & {
  billOfLiveProductId: string;
  isActive?: boolean;
};

/* ================= BASE ================= */

export interface BillOfLiveProductBase extends CommonDataType {
  number?: string;
  date?: string;
  recipeId?: RecipeBase[];
  allowReverseCalculation?: boolean;
  productDetails?: BillOfLiveProductDetailUI[];
  isActive?: boolean;
}

/* ================= API RESPONSE ================= */

export interface BillOfLiveProductDataResponse extends PageStatus {
  billOfLiveProduct_data: BillOfLiveProductBase[];
}

export interface BillOfLiveProductApiResponse extends MessageStatus {
  data: BillOfLiveProductDataResponse;
}
