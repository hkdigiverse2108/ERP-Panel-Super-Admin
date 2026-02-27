import type { CommonDataType, MessageStatus, PageStatus } from "./Common";

export type PaymentMode = "CASH" | "BANK";
export type PaymentType = "ON_ACCOUNT" | "ADVANCE" | "AGAINST_VOUCHER";
export type BankMode = "ONLINE" | "CHEQUE";
export interface PaymentFormValues {
  paymentMode?: PaymentMode;
  paymentType?: PaymentType;
  bankMode?: BankMode;

  party?: string;
  paymentDate?: string;
  transactionDate?: string;
  transactionNo?: string;
  amount?: number | null;
  description?: string;

  isActive?: boolean;
  _submitAction?: string;
}

export type AddPaymentPayload = PaymentFormValues & {
  companyId?: string;
};

export type EditPaymentPayload = AddPaymentPayload & {
  paymentId: string;
};

/* ================= BASE MODEL ================= */
export type PaymentBase = PaymentFormValues & CommonDataType;

/* ================= API RESPONSES ================= */
export interface PaymentDataResponse extends PageStatus {
  payment_data: PaymentBase[];
}

export interface PaymentApiResponse extends MessageStatus {
  data: PaymentDataResponse;
}
