import type { CommonDataType, MessageStatus, PageStatus } from "./Common";
import type { CompanyBase } from "./Company";
import type { ContactBase } from "./Contacts";
import type { EmployeeBase } from "./Employee";
import type { PosOrderBase } from "./PosOrder";
import type { ProductBase } from "./Product";

export interface ReturnPosOrderFormValues {
  bankAccountId?: string;
  isActive?: boolean;
  reason?: string;
  refundDescription?: string;
  refundViaBank?: number;
  refundViaCash?: number;
  returnOrderNo?: string;
  total?: number;
  type?: string;
  items?: {
    productId?: ProductBase;
    quantity?: number;
    price?: number;
    total?: number;
  }[];
  companyId?: string;
  customerId?: string;
  salesManId?: string;
  posOrderId?: string;
}

export type AddReturnPosOrderPayload = ReturnPosOrderFormValues;

export type EditReturnPosOrderPayload = ReturnPosOrderFormValues & { creditNoteId?: string };

export interface ReturnPosOrderBase extends Omit<ReturnPosOrderFormValues, "companyId" | "customerId" | "salesManId" | "posOrderId">, CommonDataType {
  creditNoteNo: string;
  companyId: CompanyBase;
  customerId: ContactBase;
  salesManId: EmployeeBase;
  posOrderId: PosOrderBase;
}

export interface ReturnPosOrderDataResponse extends PageStatus {
  returnPosOrder_data: ReturnPosOrderBase[];
}

export interface ReturnPosOrderApiResponse extends MessageStatus {
  data: ReturnPosOrderDataResponse;
}

export interface ReturnPosOrderDropdownApiResponse extends MessageStatus {
  data: ReturnPosOrderBase[];
}
