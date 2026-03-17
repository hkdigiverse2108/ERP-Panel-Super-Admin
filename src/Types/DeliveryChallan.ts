import type {
  AdditionalChargeItem,
  AddressApi,
  CommonDataType,
  MessageStatus,
  PageState,
  ShippingDetails,
  TransactionSummary,
} from "./Common";
import type { ContactBase } from "./Contacts";
import type { ProductBase } from "./Product";
import type { TaxBase } from "./Tax";

export interface DeliveryChallanItem {
  productId: string | ProductBase;
  qty: number;
  freeQty: number;
  price: number;
  mrp?: number;
  discount1: number;
  discountAmount?: number;
  uomId?: string | null;
  unit?: string | null;
  taxId?: string | TaxBase | null;
  tax?: number;
  taxAmount?: number;
  taxableAmount: number;
  totalAmount: number;
  _id?: string;
}

export interface DeliveryChallanBase extends CommonDataType {
  companyId: string;
  deliveryChallanNo: string;
  date: string;
  dueDate: string;
  customerId: string | ContactBase;
  salesOrderIds?: string[];
  invoiceIds?: string[];
  placeOfSupply?: string;
  billingAddress?: string | AddressApi;
  shippingAddress?: string | AddressApi;
  paymentTerms?: string;
  createdFrom?: string;
  taxType?: string;
  shippingDetails?: ShippingDetails;
  items: DeliveryChallanItem[];
  transactionSummary: TransactionSummary;
  additionalCharges?: AdditionalChargeItem[];
  termsAndConditionIds?: string[];
  status: string;
}

export interface DeliveryChallanFormValues extends Omit<
  DeliveryChallanBase,
  | keyof CommonDataType
  | "deliveryChallanNo"
  | "customerId"
  | "items"
  | "billingAddress"
  | "shippingAddress"
  | "companyId"
> {
  companyId: string;
  deliveryChallanNo?: string;
  customerId: string;
  items: DeliveryChallanItem[];
  billingAddress?: string;
  shippingAddress?: string;
  selectedSalesOrderId?: string[];
  selectedInvoiceId?: string[];
  _submitAction?: string;
}

export type AddDeliveryChallanPayload = DeliveryChallanFormValues;
export type EditDeliveryChallanPayload = Partial<AddDeliveryChallanPayload> & {
  deliveryChallanId: string;
  isActive?: boolean;
};

export interface DeliveryChallanDataResponse {
  deliveryChallan_data: DeliveryChallanBase[];
  state: PageState;
  totalData: number;
}

export interface DeliveryChallanApiResponse extends MessageStatus {
  data: DeliveryChallanDataResponse;
}

export interface SingleDeliveryChallanApiResponse extends MessageStatus {
  data: DeliveryChallanBase;
}

export interface DeliveryChallanDropdownApiResponse extends MessageStatus {
  data: any[];
}
