import type { CommonDataType, MessageStatus } from "./Common";
import type { ContactBase } from "./Contacts";
import type { EmployeeBase } from "./Employee";
import type { PosOrderBase } from "./PosOrder";
import type { ProductBase } from "./Product";

export interface WeightScaleFormValues {
  baudRate?: string;
  dataBits?: string;
  stopBits?: string;
  parity?: string;
  flowControl?: string;
  precision?: string;
}

export interface PosProductDataModal extends Omit<ProductBase, "sellingPrice" | "mrp" | "sellingDiscount"> {
  posQty: number;
  discount: number;
  sellingPrice: number;
  mrp: number;
  sellingDiscount: number;
  additionalDiscount: number;
  unitCost: number;
  netAmount: number;
  variant?: string;
}

export interface AdditionalChargeType {
  chargeId: string;
  value: number;
  taxId: string;
  accountGroupId: string;
  totalAmount: number;
}

export interface AdditionalChargeRowType extends Omit<AdditionalChargeType, "chargeId" | "taxId" | "accountGroupId"> {
  chargeId: string;
  taxId: string;
  accountGroupId: string;
}

export interface PosProductType {
  items: PosProductDataModal[];
  customerId: string;
  orderType: string;
  salesManId: string;
  totalQty: number;
  totalMrp: number;
  totalTaxAmount: number;
  totalDiscount: number;
  totalAdditionalCharge: number;
  flatDiscountAmount: number;
  additionalCharges: AdditionalChargeType[];
  roundOff: number;
  remark: string;
  totalAmount: number;
  posOrderId: string;
  couponId: string;
  couponDiscount: number;
  loyaltyId: string;
  loyaltyDiscount: number;
}

export interface PosSliceState {
  isMultiplePay: boolean;
  isSelectProduct: string;
  isPosLoading: boolean;
  PosProduct: PosProductType;
  isBtnStatus: string;
}
export interface PosProductOrderItem {
  qty: number;
  mrp: number;
  discountAmount: number;
  additionalDiscountAmount: number;
  unitCost: number;
  netAmount: number;
}

export interface MultiplePaymentType {
  amount: number;
  method: string;
  paymentAccountId: string;
  cardHolderName: string;
  cardTransactionNo: string;
  upiId: string;
  bankAccountNo: string;
  chequeNo: string;
}

export interface PayLaterType {
  dueDate: string;
  sendReminder: boolean;
  paymentTerm: string;
}

export interface PosProductOrderFormValues extends Omit<Partial<PosProductType>, "items"> {
  companyId?: string;
  orderNo?: string;
  items?: Partial<PosProductOrderItem> & { productId?: string }[];
  multiplePayments?: Partial<MultiplePaymentType>[];
  payLater?: Partial<PayLaterType>;
  paymentMethod?: string;
  paymentStatus?: string;
  status?: string;
  holdDate?: string;
  isActive?: boolean;
}

export type AddPosProductOrderPayload = PosProductOrderFormValues;

export type EditPosProductOrderPayload = AddPosProductOrderPayload & { posOrderId: string };

export interface PosProductOrderBase extends Omit<PosProductOrderFormValues, "customerId" | "salesManId" | "items">, CommonDataType {
  customerId: ContactBase;
  salesManId: EmployeeBase;
  items: (Partial<PosProductOrderItem> & { productId?: PosProductDataModal })[];
}

export interface PosProductOrderApiResponse extends MessageStatus {
  data: PosProductOrderBase[];
}

export interface PosCustomerDetailData {
  customer: ContactBase;
  lastBill: PosOrderBase;
  mostPurchasedProduct: ProductBase;
  totalDueAmount: number;
  totalPaidAmount: number;
  totalPurchaseAmount: number;
}

export interface PosCustomerDetailApiResponse extends MessageStatus {
  data: PosCustomerDetailData;
}
