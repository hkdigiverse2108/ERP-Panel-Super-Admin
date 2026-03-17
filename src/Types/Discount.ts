import type { CommonDataType, MessageStatus, PageStatus } from "./Common";
import type { CategoryBase } from "./Category";
import type { BrandBase } from "./Brand";
import type { ProductBase } from "./Product";
import type { BranchBase } from "./Branch";
import type { CompanyBase } from "./Company";

/* ---------------- SUB TYPES ---------------- */

export interface RangeWiseRule {
  minQty?: number;
  maxQty?: number;
  discountType?: string;
  discountValue?: number;
}

export interface BuyXGetY {
  buyQty?: number;
  getQty?: number;
  getProductIds?: string[];
  getDiscountType?: string;
  getDiscountValue?: number;
}

export interface ProductAtFixAmount {
  minimumAmount?: number;
  freeProductIds?: string[];
  freeQty?: number;
}

/* ---------------- FORM VALUES ---------------- */

export interface DiscountFormValues {
  companyId?: string;
  title?: string;
  discountCode?: string;
  autoApply?: boolean;
  excludeAlreadyDiscounted?: boolean;
  discountApplicable?: string;
  discountMode?: string;
  discountType?: string;
  discountValue?: number;
  rangeWiseRules?: RangeWiseRule[];
  buyXGetY?: BuyXGetY;
  productAtFixAmount?: ProductAtFixAmount;
  appliesTo?: string;
  applyToEntireSelection?: boolean;
  categoryIds?: string[];
  subcategoryIds?: string[];
  brandIds?: string[];
  productIds?: string[];
  excludedProductIds?: string[];
  minimumRequirement?: string;
  minimumPurchaseAmount?: number;
  minimumQuantity?: number;
  usageLimitTotal?: number;
  usageLimitPerCustomer?: boolean;
  startDateTime?: string;
  hasEndDate?: boolean;
  endDateTime?: string;
  branchIds?: string[];
  status?: string;
  isActive?: boolean;
  _submitAction?: string;
}

/* ---------------- PAYLOAD ---------------- */

export type AddDiscountPayload = DiscountFormValues;

export type EditDiscountPayload = AddDiscountPayload & {
  discountId: string;
};

/* ---------------- BASE TYPE ---------------- */

export interface DiscountBase extends Omit<DiscountFormValues,
  "categoryIds" | "subcategoryIds" | "brandIds" | "productIds" | "excludedProductIds" | "branchIds" | "companyId" | "buyXGetY" | "productAtFixAmount"
>, CommonDataType {
  categoryIds?: CategoryBase[];
  subcategoryIds?: CategoryBase[];
  brandIds?: BrandBase[];
  productIds?: ProductBase[];
  excludedProductIds?: ProductBase[];
  branchIds?: BranchBase[];
  companyId?: CompanyBase;
  buyXGetY?: Omit<BuyXGetY, "getProductIds"> & { getProductIds?: ProductBase[] };
  productAtFixAmount?: Omit<ProductAtFixAmount, "freeProductIds"> & { freeProductIds?: ProductBase[] };
}

/* ---------------- API RESPONSES ---------------- */

export interface DiscountDataResponse extends PageStatus {
  discount_data: DiscountBase[];
}

export interface DiscountApiResponse extends MessageStatus {
  data: DiscountDataResponse;
}

export interface DiscountDropdownApiResponse extends MessageStatus {
  data: DiscountBase[];
}
