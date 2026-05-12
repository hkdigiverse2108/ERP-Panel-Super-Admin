import type { BankBase } from "./Bank";
import type { BranchBase } from "./Branch";
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
  invoiceId?: string;
  purchaseBillId?: string;
  posCreditNoteId?: string;
  salesCreditNoteId?: string;
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
  branchId?: string;
  remark?: string;
  status?: string;
  voucherDetails?: VoucherRow[];
  _submitAction?: string;
  posCashRegisterId?: string;
  discountAmount?: number;
  taxId?: string;
  docType?: string;
}

export type AddPosPaymentPayload = PosPaymentFormValues & {
  companyId?: string;
};

export type EditPosPaymentPayload = AddPosPaymentPayload & {
  posPaymentId: string;
};

/* ================= BASE MODEL ================= */
export type PosPaymentBase = Omit<PosPaymentFormValues, "partyId" | "bankId" | "posOrderId" | "companyId" | "branchId"> &
  CommonDataType & {
    partyId?: ContactBase;
    bankId?: BankBase;
    posOrderId?: PosOrderBase;
    companyId?: CompanyBase;
    branchId?: BranchBase;
  };

/* ================= API RESPONSES ================= */
export interface PosPaymentDataResponse extends PageStatus {
  posPayment_data: PosPaymentBase[];
}

export interface PosPaymentApiResponse extends MessageStatus {
  data: PosPaymentDataResponse;
}
export interface PosPendingPaymentDropdownApiResponse extends MessageStatus {
  data: {
    _id: string;
    balanceAmount: number;
    customerId: string;
    docNo: string;
    docType: string;
    name: string;
    paidAmount: number;
  }[];
}
export interface PosPendingCreditDropdownApiResponse extends MessageStatus {
  data: {
    balanceAmount: number;
    customerId: string;
    docNo: string;
    docType: string;
    name: string;
    totalAmount: number;
    _id: string;
  }[];
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
