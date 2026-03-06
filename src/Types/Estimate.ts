import type { AdditionalChargeItem, CommonDataType, MessageStatus, PageStatus } from "./Common";
import type { CompanyBase } from "./Company";
import type { Address, ContactBase } from "./Contacts";
import type { TermsConditionBase } from "./TermsCondition";

export interface TransactionSummary {
  flatDiscount: number;
  grossAmount: number;
  discountAmount: number;
  taxableAmount: number;
  taxAmount: number;
  roundOff: number;
  netAmount: number;
}

export interface ShippingDetails {
  shippingType: "delivery" | "pickup";
  shippingDate: string;
  referenceNo: string;
  transportDate: string;
  modeOfTransport: string;
  transporterId: string;
  vehicleNo: string;
  weight: number;
}

export interface AdditionalCharge {
  chargeId: string;
  taxId: string;
  amount: number;
  totalAmount: number;
}

export interface InvoiceItem {
  productId: string;
  qty: number;
  freeQty: number;
  uomId: string;
  price: number;
  discount1: number;
  discount2: number;
  taxId: string;
  taxableAmount: number;
  totalAmount: number;
}

export interface EstimateFormValues {
  companyId?: string;
  date?: string;
  dueDate?: string;
  customerId?: string;
  placeOfSupply?: string;
  billingAddress?: string;
  shippingAddress?: string;
  paymentTerms?: string;
  taxType?: string;
  reverseCharge?: boolean;
  sez?: string;
  termsAndConditionIds?: string[];
  items?: InvoiceItem[];
  additionalCharges?: AdditionalCharge[];
  shippingDetails?: ShippingDetails;
  transactionSummary?: TransactionSummary;
  isActive?: boolean;
}

export type AddEstimatePayload = EstimateFormValues;

export type EditEstimatePayload = EstimateFormValues & { estimateId?: string };

export interface EstimateBase extends Omit<EstimateFormValues, "customerId" | "companyId" | "termsAndConditionIds" | "additionalCharges" | "billingAddress" | "shippingAddress">, CommonDataType {
  estimateNo: string;
  companyId: CompanyBase;
  customerId: ContactBase;
  termsAndConditionIds: TermsConditionBase[];
  additionalCharges: AdditionalChargeItem[];
  billingAddress: Address;
  shippingAddress: Address;
  status?: string;
}

export interface EstimateDataResponse extends PageStatus {
  estimate_data: EstimateBase[];
}

export interface EstimateApiResponse extends MessageStatus {
  data: EstimateDataResponse;
}
