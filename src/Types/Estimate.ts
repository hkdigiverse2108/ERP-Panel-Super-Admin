import type { AdditionalChargeItem, CommonDataType, MessageStatus, PageStatus, ShippingDetails, TransactionSummary } from "./Common";
import type { CompanyBase } from "./Company";
import type { Address, ContactBase } from "./Contacts";
import type { TermsConditionBase } from "./TermsCondition";

// Local ShippingDetails removed, now using common from ./Common

export interface AdditionalCharge {
  chargeId: string;
  taxId: string;
  amount: number;
  totalAmount: number;
}

export interface EstimateItem {
  productId: string;
  qty: number;
  freeQty: number;
  uomId: string;
  price: number;
  discount1: number;
  // discount2: number;
  taxId: string;
  taxableAmount: number;
  totalAmount: number;
  unit?: string;
  tax?: number;
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
  // sez?: string;
  termsAndConditionIds?: string[];
  items?: EstimateItem[];
  additionalCharges?: AdditionalCharge[];
  shippingDetails?: ShippingDetails;
  transactionSummary?: TransactionSummary;
  isActive?: boolean;
  _submitAction?: string;
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

/* ===================== NEW UI TYPES ===================== */

export interface EstimateDetailsProps {
  customerOptions: { label: string; value: string }[];
  selectedCustomer?: ContactBase | null;
  isEditing: boolean;
  companyOptions: { label: string; value: string }[];
  isCompanyLoading: boolean;
  isCustomerDisabled?: boolean;
}

export interface EstimateTabsProps {
  selectedTermIds: string[];
  onTermsChange: (ids: string[]) => void;
}
