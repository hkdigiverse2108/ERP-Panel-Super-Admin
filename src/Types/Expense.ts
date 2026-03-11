import type { AccountBase } from "./Account";
import type { BankBase } from "./Bank";
import type { CommonDataType, MessageStatus, PageStatus } from "./Common";
import type { CompanyBase } from "./Company";
import type { ContactBase } from "./Contacts";
import type { PosOrderBase } from "./PosOrder";

export interface ExpenseFormValues {
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
  _submitAction?: string;
  posCashRegisterId?: string;
  type?: string;
  discountAmount?: number;
  taxId?: string;
}

export type AddExpensePayload = ExpenseFormValues & {
  companyId?: string;
};

export type EditExpensePayload = AddExpensePayload & {
  expenseId: string;
};

/* ================= BASE MODEL ================= */
export type ExpenseBase = Omit<ExpenseFormValues, "partyId" | "bankId" | "posOrderId" | "companyId" | "accountId"> &
  CommonDataType & {
    partyId?: ContactBase;
    bankId?: BankBase;
    posOrderId?: PosOrderBase;
    companyId?: CompanyBase;
    accountId?: AccountBase;
  };

/* ================= API RESPONSES ================= */
export interface ExpenseDataResponse extends PageStatus {
  expense_data: ExpenseBase[];
}

export interface ExpenseApiResponse extends MessageStatus {
  data: ExpenseDataResponse;
}
