import type { AccountBase } from "./Account";
import type { BankBase } from "./Bank";
import type { CommonDataType, MessageStatus, PageStatus } from "./Common";
import type { CompanyBase } from "./Company";
import type { ContactBase } from "./Contacts";
import type { PosOrderBase } from "./PosOrder";

export interface PosPaymentFormValues {
  paymentNo?: string;
  voucherType?: string;
  paymentType?: string;
  partyId?: string;
  bankId?: string;
  posOrderId?: string;
  paymentMode?: string;
  paymentDate?: string | Date | null;
  totalAmount?: number;
  paidAmount?: number;
  pendingAmount?: number;
  kasar?: number;
  amount?: number;
  isNonGST?: boolean;
  isActive?: boolean;
  companyId?: string;
  accountId?: string;
  transactionType?: string;
  transactionDate?: string | Date | null;
  transactionNo?: string;
  remark?: string;
  voucherDetails?: VoucherRow[];
  _submitAction?: "SAVE" | "SAVE_AND_NEW";
  posCashRegisterId?: string;
}

export type AddPosPaymentPayload = PosPaymentFormValues & {
  companyId?: string;
};

export type EditPosPaymentPayload = AddPosPaymentPayload & {
  paymentId: string;
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
  netAmount: number;
  paidAmount: number;
  pendingAmount: number;
  kasarAmount: number;
  amount: number;
  paymentAmount: number;
}
