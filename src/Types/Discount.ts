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
  discountType?: string | null;
  discountValue?: number | null;
  rangeWiseRules?: RangeWiseRule[] | [];
  buyXGetY?: BuyXGetY | null;
  productAtFixAmount?: ProductAtFixAmount | null;
  appliesTo?: string | null;
  categoryIds?: string[] | [];
  subcategoryIds?: string[] | [];
  brandIds?: string[] | [];
  productIds?: string[] | [];
  excludedProductIds?: string[];
  minimumRequirement?: string | null;
  minimumPurchaseAmount?: number | null;
  minimumQuantity?: number | null;
  usageLimitTotal?: number;
  hasUsageLimitTotal?: boolean;
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

export type EditDiscountPayload = AddDiscountPayload & { discountId: string };

/* ---------------- BASE TYPE ---------------- */

export interface DiscountBase extends Omit<DiscountFormValues, "categoryIds" | "brandIds" | "productIds" | "excludedProductIds" | "branchIds" | "companyId" | "buyXGetY" | "productAtFixAmount">, CommonDataType {
  companyId?: CompanyBase;
  branchIds?: BranchBase[];
  categoryIds?: CategoryBase[];
  brandIds?: BrandBase[];
  productIds?: ProductBase[];
  excludedProductIds?: ProductBase[];
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
