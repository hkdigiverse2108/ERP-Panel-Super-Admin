import type { BankBase } from "./Bank";
import type { CommonDataType, MessageStatus, PageStatus, PhoneNumberType } from "./Common";

export interface DebitNoteFormValues {
  companyId?: string;
  type?: string;
  bankAccountId?: string;
  date?: string;
  amount?: string;
  phoneNo?: PhoneNumberType;
  description?: string;
  isActive?: boolean;
  image?: string | File | null;
  personName?: string;
  _submitAction?: string;
}

export type AddDebitNotePayload = DebitNoteFormValues;

export type EditDebitNotePayload = DebitNoteFormValues & { debitNoteId: string };

export interface DebitNoteBase extends Omit<DebitNoteFormValues, "bankAccountId">, CommonDataType {
 bankAccountId: BankBase;
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
