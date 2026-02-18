import type { CommonDataType, MessageStatus, PageStatus } from "./Common";
import type { ProductBase } from "./Product";

export interface RecipeProductItem {
  itemCode?: string | null;
  productId?: string | ProductBase;
  mrp?: number;
}
export interface RawRecipeProduct extends RecipeProductItem {
  useQty?: number;
}

export interface FinalRecipeProduct extends RecipeProductItem {
  qtyGenerate?: number;
  mfgDate?: string;
  expiryDays?: number;
  expDate?: string;
  batchNo?: string;
}

export interface RecipeFormValues {
  id?: string;
  name?: string;
  date?: string | Date;
  number?: string;
  type?: string;
  companyId?: string;
  rawProducts?: RawRecipeProduct[];
  rawrecipeId?: string;
  finalProducts?: FinalRecipeProduct;
  _submitAction?: string;
  isActive?: boolean;
  value?: { length: number };
}

export type AddRecipePayload = RecipeFormValues;

export type EditRecipePayload = AddRecipePayload & { recipeId: string };


export interface RecipeBase extends Omit<RecipeFormValues, "productId">, CommonDataType {
  productId: ProductBase;
}

export interface RecipeDataResponse extends PageStatus {
  recipe_data: RecipeBase[];
}

export interface RecipeApiResponse extends MessageStatus {
  data: RecipeDataResponse;
}

export interface RecipeDropdownApiResponse extends MessageStatus {
  data: RecipeBase[];
}
