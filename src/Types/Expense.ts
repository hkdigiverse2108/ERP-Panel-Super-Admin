import type { CommonDataType, MessageStatus, PageStatus } from "./Common";
import type { CompanyBase } from "./Company";
import type { ContactBase } from "./Contacts";


export interface ExpenseFormValues {
  partyId?: string;
  bankId?: string;
  posOrderId?: string;
  fromDate?: string | Date | null;
  amount?: number;
  isActive?: boolean;
  companyId?: string;
  remark?: string;
  status?: string;
  _submitAction?: string;
  type?: string;
  image?: string | File | null;
}

export type AddExpensePayload = ExpenseFormValues & {
  companyId?: string;
};

export type EditExpensePayload = AddExpensePayload & {
  expenseId: string;
};

/* ================= BASE MODEL ================= */
export type ExpenseBase = Omit<ExpenseFormValues, "partyId" |  "companyId" > &
  CommonDataType & {
    partyId?: ContactBase;
    companyId?: CompanyBase;
  };

/* ================= API RESPONSES ================= */
export interface ExpenseDataResponse extends PageStatus {
  expense_data: ExpenseBase[];
}

export interface ExpenseApiResponse extends MessageStatus {
  data: ExpenseDataResponse;
}
