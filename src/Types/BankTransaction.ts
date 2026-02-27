import type { AccountBase } from "./Account";
import type { CommonDataType, MessageStatus, PageStatus } from "./Common";
import type { CompanyBase } from "./Company";

/* ===================== FORM VALUES ===================== */

export interface BankTransactionFormValues {
  companyId?: string;
  voucherNo?: string;
  transactionDate?: string;
  transactionType?: "deposit" | "withdrawal" | "transfer";
  fromAccount?: string;
  toAccount?: string | null | "";
  amount?: number;
  description?: string | null | "";
  isActive?: boolean;
}

/* ===================== PAYLOADS ===================== */

export type AddBankTransactionPayload = BankTransactionFormValues;

export type EditBankTransactionPayload = AddBankTransactionPayload & { bankTransactionId: string };

/* ===================== BASE MODEL ===================== */

export interface BankTransactionBase extends Omit<BankTransactionFormValues, "fromAccount" | "toAccount" | "companyId">, CommonDataType {
  companyId: CompanyBase | string;
  fromAccount: AccountBase;
  toAccount: AccountBase;
}

/* ===================== API RESPONSES ===================== */

export interface BankTransactionDataResponse extends PageStatus {
  bankTransaction_data: BankTransactionBase[];
}

export interface BankTransactionApiResponse extends MessageStatus {
  data: BankTransactionDataResponse;
}

export interface SingleBankTransactionApiResponse extends MessageStatus {
  data: BankTransactionBase;
}

export interface BankTransactionDropdownApiResponse extends MessageStatus {
  data: BankTransactionBase[];
}
