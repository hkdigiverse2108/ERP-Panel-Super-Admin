import type {
  AdditionalChargeItem,
  CommonDataType,
  MessageStatus,
  PageStatus,
  ShippingDetails,
  TransactionSummary,
} from "./Common";
import type { CompanyBase } from "./Company";
import type { Address, ContactBase } from "./Contacts";
import type { TermsConditionBase } from "./TermsCondition";

// Local ShippingDetails removed, now using common from ./Common

// export interface AdditionalCharge {
//   chargeId: string;
//   taxId: string;
//   amount: number;
//   totalAmount: number;
// }

export interface SalesOrderItem {
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

export interface SalesOrderFormValues {
  companyId?: string;
  date?: string;
  dueDate?: string;
  customerId?: string;
  placeOfSupply?: string;
  billingAddress?: string;
  shippingAddress?: string;
  paymentTerms?: string;
  taxType?: string;
  reverseCharge?: boolean | string;
  // sez?: string;
  termsAndConditionIds?: string[];
  items?: SalesOrderItem[];
  additionalCharges?: AdditionalChargeItem[];
  shippingDetails?: ShippingDetails;
  transactionSummary?: TransactionSummary;
  isActive?: boolean;
  notes?: string;
  _submitAction?: string;
}

export type AddSalesOrderPayload = SalesOrderFormValues;

export type EditSalesOrderPayload = SalesOrderFormValues & { salesOrderId?: string };

export interface SalesOrderBase
  extends
    Omit<
      SalesOrderFormValues,
      | "customerId"
      | "companyId"
      | "termsAndConditionIds"
      | "additionalCharges"
      | "billingAddress"
      | "shippingAddress"
    >,
    CommonDataType {
  estimateNo: string;
  companyId: CompanyBase;
  customerId: ContactBase;
  termsAndConditionIds: TermsConditionBase[];
  additionalCharges: AdditionalChargeItem[];
  billingAddress: Address;
  shippingAddress: Address;
  status?: string;
}

export interface SalesOrderDataResponse extends PageStatus {
  sales_order_data: SalesOrderBase[];
}

export interface SalesOrderApiResponse extends MessageStatus {
  data: SalesOrderDataResponse;
}

/* ===================== NEW UI TYPES ===================== */

export interface SalesOrderDetailsProps {
  customerOptions: { label: string; value: string }[];
  selectedCustomer?: ContactBase | null;
  isEditing: boolean;
  companyOptions: { label: string; value: string }[];
  isCompanyLoading: boolean;
  isCustomerDisabled?: boolean;
}

export interface SalesOrderTabsProps {
  selectedTermIds: string[];
  onTermsChange: (ids: string[]) => void;
}
