import type { AccountBase } from "./Account";
import type { CommonDataType, MessageStatus, PageStatus } from "./Common";
import type { CompanyBase } from "./Company";

export interface DebitNoteFormValues {
  companyId?: string;
  voucherNumber?: string;
  date?: string;
  fromAccountId?: string;
  toAccountId?: string;
  amount?: string;
  description?: string;
  isActive?: boolean;
  _submitAction?: string;
}

export type AddDebitNotePayload = DebitNoteFormValues;

export type EditDebitNotePayload = DebitNoteFormValues & { debitNoteId: string };

export interface DebitNoteBase extends Omit<DebitNoteFormValues, "fromAccountId" | "toAccountId" | "companyId">, CommonDataType {
  companyId: CompanyBase;
  fromAccountId: AccountBase;
  toAccountId: AccountBase;
}

export interface DebitNoteDataResponse extends PageStatus {
  debitNote_data: DebitNoteBase[];
}

export interface DebitNoteApiResponse extends MessageStatus {
  data: DebitNoteDataResponse;
}

export interface DebitNoteDropdownApiResponse extends MessageStatus {
  data: DebitNoteBase[];
}
