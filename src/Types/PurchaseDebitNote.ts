import type { AdditionalChargeItem, CommonDataType, MessageStatus, PageStatus, ShippingDetails } from "./Common";
import type { ProductBase } from "./Product";
import type { ContactBase } from "./Contacts";
import type { TermsConditionBase } from "./TermsCondition";
import type { TaxBase } from "./Tax";
import type { UomBase } from "./Uom";

/* ===================== PRODUCT (FORM) ===================== */

export interface PurchaseDebitNoteProductItem {
  productId?: ProductBase | string;
  _prevProductId?: string;
  qty?: number;
  freeQty?: number;
  unit?: string;
  uomId?: string | UomBase;
  unitCost?: number;
  mrp?: number;
  sellingPrice?: number;
  discount1?: number;
  tax?: number | string;
  taxId?: string | TaxBase;
  landingCost?: number;
  margin?: number;
  total?: number;
}

export interface PurchaseDebitNoteProductDetails {
  items?: PurchaseDebitNoteProductItem[];
  totalQty?: number;
  totalTax?: number;
  totalAmount?: number;
}

/* ===================== SUMMARY ===================== */

export interface PurchaseDebitNoteSummary {
  flatDiscount?: number;
  grossAmount?: number;
  discountAmount?: number;
  taxableAmount?: number;
  taxAmount?: number;
  roundOff?: number;
  netAmount?: number;
}

/* ===================== FORM VALUES ===================== */

export interface PurchaseDebitNoteFormValues {
  supplierId: string;
  placeOfSupply?: string;
  billingAddress?: string;
  shippingAddress?: string;
  referenceBillNo?: string;
  debitNoteDate: string | Date;
  dueDate?: string | Date;
  shippingDate?: string | Date;
  paymentTerm?: string;
  purchaseId?: string;
  reverseCharge?: string | boolean;
  reason?: string;
  exportSez?: string;

  productDetails?: PurchaseDebitNoteProductItem[];
  additionalCharges?: AdditionalChargeItem[];
  termsAndConditionIds?: string[];
  shippingDetails?: ShippingDetails;
  summary?: PurchaseDebitNoteSummary;

  notes?: string;
  status?: "open" | "closed" | "cancelled";
  companyId?: string;
  isActive?: boolean;
  _submitAction?: string;
}

/* ===================== API BASE ===================== */

export interface PurchaseDebitNoteBase extends CommonDataType {
  debitNoteNo: string;
  supplierId?: ContactBase;
  placeOfSupply?: string;
  billingAddress?: string;
  shippingAddress?: string;
  referenceBillNo?: string;
  debitNoteDate?: string;
  dueDate?: string;
  shippingDate?: string;
  paymentTerm?: string;
  purchaseId?: string;
  reverseCharge?: boolean;
  reason?: string;
  exportSez?: string;

  productDetails?: (Omit<PurchaseDebitNoteProductItem, "productId"> & {
    productId?: ProductBase;
  })[];

  additionalCharges?: (Omit<AdditionalChargeItem, "chargeId"> & {
    chargeId?: {
      _id: string;
      name?: string;
      type?: string;
    };
  })[];

  termsAndConditionIds?: TermsConditionBase[];
  shippingDetails?: ShippingDetails;
  summary?: PurchaseDebitNoteSummary;

  notes?: string;
  status?: "open" | "closed" | "cancelled";
  companyId?: {
    _id: string;
    name?: string;
  };
  isActive?: boolean;
}

/* ===================== PAYLOADS ===================== */

export type AddPurchaseDebitNotePayload = PurchaseDebitNoteFormValues;

export type EditPurchaseDebitNotePayload = Partial<PurchaseDebitNoteFormValues> & {
  purchaseDebitNoteId?: string;
};

/* ===================== API RESPONSES ===================== */

export interface PurchaseDebitNoteDataResponse extends PageStatus {
  purchaseDebitNote_data: PurchaseDebitNoteBase[];
  totalAmount: number;
}

export interface PurchaseDebitNoteApiResponse extends MessageStatus {
  data: PurchaseDebitNoteDataResponse;
}

export interface SinglePurchaseDebitNoteApiResponse extends MessageStatus {
  data: PurchaseDebitNoteBase;
}

export interface PurchaseDebitNoteDropdownApiResponse extends MessageStatus {
  data: { _id: string; debitNoteNo: string }[];
}
