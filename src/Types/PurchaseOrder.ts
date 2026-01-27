import type { CommonDataType, MessageStatus, PageStatus } from "./Common";

export interface PurchaseOrderItem {
  productId: string;
  qty: number;
  uom?: string | null;
  unitCost?: number;
  tax?: string | null;
  landingCost?: string | null;
  margin?: string | null;
  total?: number;
}
export interface PurchaseOrderFormValues {
  supplierId?: string;
  orderDate?: string | Date;
  orderNo?: string | null;
  shippingDate?: string | Date | null;
  shippingNote?: string | null;

  taxType?: string;

  items?: PurchaseOrderItem[];

  finalQty?: string | null;
  finalTax?: string | null;
  finalTotal?: string | null;

  flatDiscount?: number;
  grossAmount?: number;
  discountAmount?: number;
  taxableAmount?: number;
  tax?: number;
  roundOff?: number;
  netAmount?: number;

  notes?: string | null;
  status?: string;

  isActive?: boolean;
  _submitAction?: string;
}

export type AddPurchaseOrderPayload = PurchaseOrderFormValues;

export type EditPurchaseOrderPayload = PurchaseOrderFormValues & {
  purchaseOrderId: string;
};

export interface PurchaseOrderBase extends PurchaseOrderFormValues, CommonDataType {
  _id: string;
  
  
}

export interface PurchaseOrderDataResponse extends PageStatus {
  purchase_orders: PurchaseOrderBase[];
}

export interface PurchaseOrderApiResponse extends MessageStatus {
  data: PurchaseOrderDataResponse;
}

export interface SinglePurchaseOrderApiResponse extends MessageStatus {
  data: PurchaseOrderBase;
}

export interface PurchaseOrderDropdownApiResponse extends MessageStatus {
  data: PurchaseOrderBase[];
}
