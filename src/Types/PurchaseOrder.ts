import type { CommonDataType, PageStatus, MessageStatus } from "./Common";
import type { ContactBase } from "./Contact";
// import { TAX_TYPE, ORDER_STATUS } from "../../Data";

export interface PurchaseOrderBase extends Omit<PurchaseOrderFormValues, "supplierId">, CommonDataType {
  _id: string;
  supplierId?: ContactBase;
}
export type Supplier = ContactBase;

export interface PurchaseOrderItem {
  productId: string;
  qty: number;
  uomId?: string;
  unitCost?: number;
  tax?: string | null;
  landingCost?: string | null;
  margin?: string | null;
  total?: number;
}
export interface PurchaseOrderFormValues {
  supplierId?: string;
  contactId?: string;
  companyId?: string;

  date?: string | Date;
  orderDate?: string | Date;
  orderNo?: string | null;

  shippingDate?: string | Date | null;
  shippingNote?: string | null;

  // taxType?: TAX_TYPE;

  items?: PurchaseOrderItem[];

  termsAndConditionIds?: string[];

  notes?: string | null;

  totalQty?: string | null;
  totalTax?: string | null;
  total?: string | null;

  flatDiscount?: number;
  grossAmount?: number;
  discountAmount?: number;
  taxableAmount?: number;
  tax?: number;
  roundOff?: number;
  netAmount?: number;

  status?: string;
  taxType?: string;

  isActive?: boolean;
  _submitAction?: string;
}
export interface AddPurchaseOrderPayload extends Omit<PurchaseOrderFormValues, "supplierId" | "contact"> {
  supplierId: string;
  items: PurchaseOrderItem[];
}
export interface EditPurchaseOrderPayload extends PurchaseOrderFormValues {
  purchaseOrderId: string;
}
export interface PurchaseOrderDataResponse extends PageStatus {
  purchaseOrder_data: PurchaseOrderBase[];
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
