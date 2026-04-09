import type { BranchBase } from "./Branch";
import type { CommonDataType, MessageStatus, PageStatus } from "./Common";
import type { CompanyBase } from "./Company";
import type { ContactBase } from "./Contacts";
import type { SalaryBase } from "./Salary";
import type { UserBase } from "./User";

export interface ExpenseFormValues {
  partyId?: string;
  bankId?: string;
  posOrderId?: string;
  fromDate?: string | Date | null;
  amount?: number;
  isActive?: boolean;
  companyId?: string;
  branchId?: string;
  description?: string;
  status?: string;
  _submitAction?: string;
  type?: string;
  image?: string | File | null;
  isSalary?: boolean;
}

export type AddExpensePayload = ExpenseFormValues & {
  companyId?: string;
};

export type EditExpensePayload = AddExpensePayload & {
  expenseId: string;
};

/* ================= BASE MODEL ================= */
export type ExpenseBase = Omit<ExpenseFormValues, "partyId" | "companyId" | "branchId"> &
  CommonDataType & {
    partyId?: ContactBase | UserBase;
    companyId?: CompanyBase;
    total?: SalaryBase;
    branchId?: BranchBase;
  };

/* ================= API RESPONSES ================= */
export interface ExpenseDataResponse extends PageStatus {
  expense_data: ExpenseBase[];
}

export interface ExpenseApiResponse extends MessageStatus {
  data: ExpenseDataResponse;
}
