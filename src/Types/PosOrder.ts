import type { AccountGroupBase } from "./AccountGroup";
import type { AdditionalChargesBase } from "./AdditionalCharges";
import type { CommonDataType, MessageStatus, PageStatus } from "./Common";
import type { CompanyBase } from "./Company";
import type { ContactBase } from "./Contacts";
import type { EmployeeBase } from "./Employee";
import type { MultiplePaymentType, PayLaterType, PosProductDataModal, PosProductOrderItem } from "./POS";
import type { TaxBase } from "./Tax";

export interface PosOrderFormValues {
  isActive: boolean;
  companyId: CompanyBase;
  orderNo: string;
  customerId: ContactBase;
  orderType: string;
  salesManId: EmployeeBase;
  items: (Partial<PosProductOrderItem> & { productId?: PosProductDataModal })[];
  remark: string;
  totalQty: number;
  totalMrp: number;
  totalTaxAmount: number;
  totalAdditionalCharge: number;
  totalDiscount: number;
  flatDiscountAmount: number;
  roundOff: number;
  totalAmount: number;
  additionalCharges: {
    chargeId: AdditionalChargesBase;
    value: number;
    taxId: TaxBase;
    accountGroupId: AccountGroupBase;
    totalAmount: number;
  }[];
  multiplePayments: MultiplePaymentType[];
  paymentMethod: string;
  paymentStatus: string;
  status: string;
  paidAmount: number;
  dueAmount: number;
  payLater: PayLaterType;
  couponId: string;
  couponDiscount: number;
}

export type AddPosOrderPayload = PosOrderFormValues;

export type EditPosOrderPayload = AddPosOrderPayload;

export type PosOrderBase = PosOrderFormValues & CommonDataType;

export interface PosOrderDataResponse extends PageStatus {
  posOrder_data: PosOrderBase[];
}

export interface PosOrderApiResponse extends MessageStatus {
  data: PosOrderDataResponse;
}

export interface PosOrderDropdownApiResponse extends MessageStatus {
  data: PosOrderBase[];
}
