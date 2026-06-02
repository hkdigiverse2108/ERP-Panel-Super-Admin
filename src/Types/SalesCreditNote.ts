import type { BranchBase } from "./Branch";
import type { AdditionalChargeItem, CommonDataType, MessageStatus, PageStatus, ShippingDetails, TransactionSummary } from "./Common";
import type { CompanyBase } from "./Company";
import type { Address, ContactBase } from "./Contacts";
import type { ProductBase } from "./Product";
import type { TaxBase } from "./Tax";
import type { TermsConditionBase } from "./TermsCondition";
import type { UomBase } from "./Uom";

export const SALES_CREDIT_NOTE_STATUS = {
  OPEN: "open",
  PAID: "paid",
  DUE: "due",
} as const;

export type SalesCreditNoteStatus = (typeof SALES_CREDIT_NOTE_STATUS)[keyof typeof SALES_CREDIT_NOTE_STATUS];

export const SALES_CREDIT_NOTE_PRODUCT_TYPE = {
  EXPIRY: "expiry",
  ALL: "all",
} as const;

export type SalesCreditNoteProductType = (typeof SALES_CREDIT_NOTE_PRODUCT_TYPE)[keyof typeof SALES_CREDIT_NOTE_PRODUCT_TYPE];

export interface SalesCreditNoteItem {
  productId: string | ProductBase;
  variantId?: string | null;
  qty: number;
  freeQty: number;
  uomId?: string | UomBase;
  unit?: string;
  price?: number;
  discount1?: number;
  taxId?: string | TaxBase;
  tax?: number;
  total?: number;
}

export interface SalesCreditNoteFormValues {
  companyId?: string;
  branchId?: string;
  customerId?: string;
  placeOfSupply?: string;
  billingAddress?: string;
  shippingAddress?: string;
  creditNoteDate?: string;
  dueDate?: string;
  salesId?: string;
  reverseCharge?: boolean | string;
  reason?: string;
  sez?: string;
  paymentReminder?: boolean;
  productType?: SalesCreditNoteProductType;
  salesManId?: string;
  productDetails?: SalesCreditNoteItem[];
  additionalCharges?: AdditionalChargeItem[];
  termsAndConditionIds?: string[];
  notes?: string;
  shippingDetails?: ShippingDetails;
  summary?: TransactionSummary;
  status?: SalesCreditNoteStatus;
  isActive?: boolean;
  _submitAction?: string;
}

export type AddSalesCreditNotePayload = SalesCreditNoteFormValues;

export type EditSalesCreditNotePayload = Partial<SalesCreditNoteFormValues> & { salesCreditNoteId?: string };

export interface SalesCreditNoteBase extends Omit<SalesCreditNoteFormValues, "customerId" | "companyId" | "branchId" | "termsAndConditionIds" | "additionalCharges" | "billingAddress" | "shippingAddress">, CommonDataType {
  creditNoteNo: string;
  companyId: CompanyBase;
  branchId: BranchBase;
  customerId: ContactBase;
  termsAndConditionIds: TermsConditionBase[];
  additionalCharges: AdditionalChargeItem[];
  billingAddress: Address;
  shippingAddress: Address;
  creditUsed?: number;
  creditRemaining?: number;
}

export interface SalesCreditNoteDataResponse extends PageStatus {
  salesCreditNote_data: SalesCreditNoteBase[];
}

export interface SalesCreditNoteApiResponse extends MessageStatus {
  data: SalesCreditNoteDataResponse;
}

export interface SingleSalesCreditNoteApiResponse extends MessageStatus {
  data: SalesCreditNoteBase;
}

export interface SalesCreditNoteDropdownApiResponse extends MessageStatus {
  data: SalesCreditNoteBase[];
}
