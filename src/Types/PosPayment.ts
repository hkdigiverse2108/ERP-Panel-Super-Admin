import type { AccountBase } from "./Account";
import type { BankBase } from "./Bank";
import type { CommonDataType, MessageStatus, PageStatus } from "./Common";
import type { CompanyBase } from "./Company";
import type { ContactBase } from "./Contacts";
import type { PosOrderBase } from "./PosOrder";

export interface PosPaymentFormValues {
  voucherType?: string;
  paymentType?: string;
  partyId?: string;
  bankId?: string;
  posOrderId?: string;
  paymentMode?: string;
  date?: string | Date | null;
  totalAmount?: number;
  paidAmount?: number;
  pendingAmount?: number;
  kasar?: number;
  amount?: number;
  isNonGST?: boolean;
  isActive?: boolean;
  companyId?: string;
  accountId?: string;
  remark?: string;
  status?: string;
  voucherDetails?: VoucherRow[];
  _submitAction?: string;
  posCashRegisterId?: string;
}

export type AddPosPaymentPayload = PosPaymentFormValues & {
  companyId?: string;
};

export type EditPosPaymentPayload = AddPosPaymentPayload & {
  posPaymentId: string;
};

/* ================= BASE MODEL ================= */
export type PosPaymentBase = Omit<PosPaymentFormValues, "partyId" | "bankId" | "posOrderId" | "companyId" | "accountId"> &
  CommonDataType & {
    partyId?: ContactBase;
    bankId?: BankBase;
    posOrderId?: PosOrderBase;
    companyId?: CompanyBase;
    accountId?: AccountBase;
  };

/* ================= API RESPONSES ================= */
export interface PosPaymentDataResponse extends PageStatus {
  posPayment_data: PosPaymentBase[];
}

export interface PosPaymentApiResponse extends MessageStatus {
  data: PosPaymentDataResponse;
}
export interface VoucherRow {
  id: string;
  posOrderId?: string;
  paymentMode?: string;
  bankId?: string;
  netAmount: number;
  paidAmount: number;
  pendingAmount: number;
  kasarAmount: number;
  amount: number;
  paymentAmount: number;
}
