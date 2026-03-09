import type { AccountBase } from "./Account";
import type { CommonDataType, MessageStatus, PageStatus } from "./Common";
import type { CompanyBase } from "./Company";

export interface JournalVoucherEntryBase {
  accountId: AccountBase | string;
  debit: number;
  credit: number;
  description?: string;
}

export interface JournalVoucherBase extends CommonDataType {
  companyId: CompanyBase | string;
  paymentNo: string;
  date: string;
  description?: string;
  entries: JournalVoucherEntryBase[];
  totalDebit: number;
  totalCredit: number;
  status: "draft" | "posted";
  isActive: boolean;
}

export interface JournalVoucherDataResponse extends PageStatus {
  journalVoucher_data: JournalVoucherBase[];
}

export interface JournalVoucherApiResponse extends MessageStatus {
  data: JournalVoucherDataResponse;
}

export interface JournalVoucherDropdownApiResponse extends MessageStatus {
  data: JournalVoucherBase[];
}

export interface AddJournalVoucherPayload {
  companyId: string;
  date: string;
  description?: string;
  entries: {
    accountId: string;
    debit: number;
    credit: number;
    description?: string;
  }[];
  totalDebit: number;
  totalCredit: number;
  status: "draft" | "posted";
  isActive: boolean;
}

export interface EditJournalVoucherPayload extends Partial<AddJournalVoucherPayload> {
  journalVoucherId: string;
}

export interface JournalVoucherFormValues {
  companyId: string;
  date: string;
  description?: string;
  entries: {
    accountId: string;
    debit: number | "";
    credit: number | "";
    description?: string;
  }[];
  totalDebit?: number;
  totalCredit?: number;
  status: "draft" | "posted";
  isActive: boolean;
  _submitAction?: "save" | "saveAndNew";
}
