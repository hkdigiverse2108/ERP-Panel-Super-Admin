import type { BankBase } from "./Bank";
import type { CommonDataType, MessageStatus, PageStatus, PhoneNumberType } from "./Common";

export interface CreditNoteFormValues {
  companyId?: string;
  branchId?: string;
  type?: string;
  date?: string;
  bankAccountId?: string;
  amount?: string;
  description?: string;
  isActive?: boolean;
  image?: string | File | null;
  _submitAction?: string;
  phoneNo?: PhoneNumberType;
  personName?: string;
}

export type AddCreditNotePayload = CreditNoteFormValues;

export type EditCreditNotePayload = CreditNoteFormValues & { creditNoteId: string };

export interface CreditNoteBase extends Omit<CreditNoteFormValues, "bankAccountId">, CommonDataType {
 BankAccountId: BankBase;
}

export interface CreditNoteDataResponse extends PageStatus {
  creditNote_data: CreditNoteBase[];
}

export interface CreditNoteApiResponse extends MessageStatus {
  data: CreditNoteDataResponse;
}

export interface CreditNoteDropdownApiResponse extends MessageStatus {
  data: CreditNoteBase[];
}
