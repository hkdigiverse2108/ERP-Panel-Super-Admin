import type { CommonDataType, MessageStatus, PageStatus } from "./Common";
import type { CompanyBase } from "./Company";
import type { ContactBase } from "./Contacts";

export interface PosCreditNoteFormValues {
  creditsRemaining: number;
  creditsUsed: number;
  isActive: true;
  returnPosOrderId: { _id: string; returnOrderNo: string };
  status: string;
  totalAmount: number;
}

export type AddPosCreditNotePayload = PosCreditNoteFormValues;

export type EditPosCreditNotePayload = PosCreditNoteFormValues & { creditNoteId?: string };

export interface PosCreditNoteBase extends PosCreditNoteFormValues, CommonDataType {
  creditNoteNo: string;
  companyId: CompanyBase;
  customerId: ContactBase;
}

export interface PosCreditNoteDataResponse extends PageStatus {
  posCreditNote_data: PosCreditNoteBase[];
}

export interface PosCreditNoteApiResponse extends MessageStatus {
  data: PosCreditNoteDataResponse;
}

export interface PosCreditNoteDropdownApiResponse extends MessageStatus {
  data: PosCreditNoteBase[];
}
