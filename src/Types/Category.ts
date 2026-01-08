import type { CommonDataType, MessageStatus, PageStatus } from "./Common";

export interface CategoryFormValues {
  code?: string;
  name?: string;
  description?: string;
  parentCategoryId?: string;
  image?: string | File | null;
  isActive?: boolean;
}

export type AddCategoryPayload = CategoryFormValues & { companyId?: string };

export type EditCategoryPayload = AddCategoryPayload & { categoryId?: string };


export interface CategoryBase extends Omit<CategoryFormValues, "parentCategoryId">, CommonDataType {
   parentCategoryId?: CategoryBase 
}

export interface CategoryDataResponse extends PageStatus {
  category_data: CategoryBase[];
}

export interface CategoryApiResponse extends MessageStatus {
  data: CategoryDataResponse;
}  
