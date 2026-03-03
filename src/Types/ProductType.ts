import type { CommonDataType, MessageStatus, PageStatus } from "./Common";

export interface ProductTypeFormValues {
  name?: string;
  isActive?: boolean;
}

export type AddProductTypePayload = ProductTypeFormValues;

export type EditProductTypePayload = AddProductTypePayload & { productTypeId?: string };

export type ProductTypeBase = ProductTypeFormValues & CommonDataType;

export interface ProductTypeDataResponse extends PageStatus {
  product_type_data: ProductTypeBase[];
}

export interface ProductTypeApiResponse extends MessageStatus {
  data: ProductTypeDataResponse;
}

export interface ProductTypeDropdownApiResponse extends MessageStatus {
  data: ProductTypeBase[];
}
