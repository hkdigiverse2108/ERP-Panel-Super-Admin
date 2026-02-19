import type { CommonDataType, MessageStatus, PageStatus } from "./Common";
import type { ProductBase } from "./Product";

export interface StockVerificationItem {
  productId: string;
  landingCost: number;
  price: number;
  mrp: number;
  sellingPrice: number;
  systemQty: number;
  physicalQty: number;
  differenceQty: number;
  differenceAmount: number;
  approvedQty: number;
}

export interface StockVerificationRow extends StockVerificationItem {
  name: string;
}

export interface StockVerificationFormValues {
  items?: StockVerificationItem[];
  totalProducts?: number;
  totalPhysicalQty?: number;
  totalDifferenceAmount?: number;
  approvedQty?: number;
  stockVerificationNo?: string;
  totalApprovedQty?: number;
  status?: "pending" | "approved" | "rejected" | string;
  remark?: string;
  companyId?: string;
}

export type AddStockVerificationPayload = StockVerificationFormValues;

export type EditStockVerificationPayload = AddStockVerificationPayload & { stockVerificationId?: string };

export interface StockVerificationBase extends Omit<StockVerificationFormValues, "items" | "companyId">, CommonDataType {
  companyId?: { _id: string; name: string };
  items: (Omit<StockVerificationItem, "productId"> & {
    productId: ProductBase;
  })[];
}

export interface StockVerificationDataResponse extends PageStatus {
  stockVerification_data: StockVerificationBase[];
}

export interface StockVerificationApiResponse extends MessageStatus {
  data: StockVerificationDataResponse;
}

export interface StockVerificationFilter {
  companyFilter?: string;
  categoryFilter?: string;
  brandFilter?: string;
}
