import type { BrandBase } from "./Brand";
import type { CategoryBase } from "./Category";
import type { CommonDataType, MessageStatus, PageStatus } from "./Common";

export interface NutritionInfo {
  name?: string;
  value?: string;
  _id?: string;
}

export interface ProductFormValues {
  productType?: string;
  name?: string;
  printName?: string;
  hsnCode?: string;
  categoryId?: string;
  subCategoryId?: string;
  purchaseTaxId?: string;
  isPurchaseTaxIncluding?: boolean;
  brandId?: string;
  subBrandId?: string;
  salesTaxId?: string;
  isSalesTaxIncluding?: boolean;
  cessPercentage?: number | null;
  // uomId?: string;
  manageMultipleBatch?: boolean;
  hasExpiry?: boolean;
  expiryDays?: number | null;
  calculateExpiryOn?: string;
  expiryReferenceDate?: string;
  isExpiryProductSaleable?: boolean;
  ingredients?: string;
  shortDescription?: string;
  description?: string;
  nutrition?: NutritionInfo[];
  netWeight?: number | null;
  masterQty?: number | null;
  purchasePrice?: number | null;
  landingCost?: number | null;
  mrp?: number | null;
  sellingDiscount?: number | null;
  sellingPrice?: number | null;
  sellingMargin?: number | null;
  retailerDiscount?: number | null;
  retailerPrice?: number | null;
  retailerMargin?: number | null;
  wholesalerDiscount?: number | null;
  wholesalerPrice?: number | null;
  wholesalerMargin?: number | null;
  minimumQty?: number | null;
  openingQty?: number | null;
  isActive?: boolean;
  images?: string[];
  _submitAction?: string;
}

export type AddProductPayload = ProductFormValues;

export type EditProductPayload = AddProductPayload & { productId: string };

export interface ProductBase extends Omit<ProductFormValues, "categoryId" | "subCategoryId" | "brandId" | "subBrandId">, CommonDataType {
  categoryId?: CategoryBase;
  subCategoryId?: CategoryBase;
  brandId?: BrandBase;
  subBrandId?: BrandBase;
}

export interface ProductDataResponse extends PageStatus {
  product_data: ProductBase[];
}

export interface ProductApiResponse extends MessageStatus {
  data: ProductDataResponse;
}
