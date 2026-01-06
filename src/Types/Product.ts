import type { CommonDataType, MessageStatus, PageStatus } from "./Common";
export interface NutritionInfo {
  name: string;
  value: string;
}
export interface ProductFormValues {
  itemCode: string;
  name: string;
  printName?: string;

  categoryId?: string;
  subCategoryId?: string;
  brandId?: string;
  subBrandId?: string;

  productType?: string;

  uomId: string;

  purchasePrice?: number;
  landingCost?: number;
  mrp?: number;
  sellingPrice?: number;
  sellingDiscount?: number;
  sellingMargin?: number;

  retailerDiscount?: number;
  retailerPrice?: number;
  retailerMargin?: number;

  wholesalerDiscount?: number;
  wholesalerPrice?: number;
  wholesalerMargin?: number;

  onlinePrice?: number;

  minimumQty?: number;
  openingQty?: number;
  masterQty?: number;

  hsnCode?: string;
  purchaseTaxId?: string;
  salesTaxId?: string;

  isPurchaseTaxIncluding?: boolean;
  isSalesTaxIncluding?: boolean;
  cessPercentage?: number;

  manageMultipleBatch?: boolean;
  isExpiryProductSaleable?: boolean;
  hasExpiry?: boolean;

  expiryDays?: number;
  calculateExpiryOn?: string;
  expiryReferenceDate?: string;

  ingredients?: string;
  description?: string;
  shortDescription?: string;

  netWeight?: number;

  nutrition?: NutritionInfo[];

  images?: string[];

  additionalInfo?: string | null;
}
// export interface ProductFormValues {
//   variants?: any;
//   _id?: string;
//   _submitAction?: string;
//   companyId?: string;

//   itemCode?: string;
//   name?: string;
//   printName?: string;
//   slug?: string;
//   productType?: string;
//   categoryId?: string;
//   subCategoryId?: string;
//   brandId?: string;
//   subBrandId?: string;
//   departmentId?: string;
//   uomId?: string;
//   purchaseTaxId?: string;
//   salesTaxId?: string;
//   isPurchaseTaxInclusive?: boolean;
//   isSalesTaxInclusive?: boolean;
//   cessPercentage?: number;
//   mrp?: number;
//   sellingPrice?: number;
//   purchasePrice?: number;
//   landingCost?: number;
//   masterQuantity?: number;
//   minimumQuantity?: number;
//   hsnCode?: string;
//   expiryDays?: string;
//   expiryType?: string;
//   shortDescription?: string;
//   description?: string;
//   netWeight?: string;
//   nutritionInfo?: string;
//   ingredients?: string;
//   image?: string;

//   manageBatch?: boolean;
//   hasExpiry?: boolean;
//   status?: string;

//   code?: string;
//   category?: string;
//   price?: number;
//   quantity?: number;
//   gst?: number;
//   isActive?: boolean;
//   imageUrl?: string;
// }

export type AddProductPayload = ProductFormValues;

export type EditProductPayload = AddProductPayload & { productId: string };

export type ProductBase = ProductFormValues & CommonDataType;

export interface ProductDataResponse extends PageStatus {
  product_data: ProductBase[];
}

export interface ProductApiResponse extends MessageStatus {
  data: ProductDataResponse;
}
