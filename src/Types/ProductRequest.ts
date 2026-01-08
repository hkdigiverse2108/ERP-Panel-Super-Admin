import type { CommonDataType, MessageStatus, PageStatus } from "./Common";

export interface ProductRequestFormValues {
  name?: string;
  printName?: string;
  category?: string;
  subCategory?: string;
  brand?: string;
  subBrand?: string;
  productType?: string;
  hasExpiry?: boolean;
  description?: string;
  uomId?: string;
  status?: string;
  images?: string[];
  _submitAction?: string;
}
export type AddProductRequestPayload = ProductRequestFormValues;

export type ProductRequestBase = ProductRequestFormValues & CommonDataType;

export interface ProductRequestDataResponse extends PageStatus {
  product_data: ProductRequestBase[];
}

export interface ProductRequestApiResponse extends MessageStatus {
  data: ProductRequestDataResponse;
}
