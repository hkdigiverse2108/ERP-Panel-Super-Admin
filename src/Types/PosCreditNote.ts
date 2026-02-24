import type { ContactBase } from "./Contacts";
import type { CommonDataType, MessageStatus, PageStatus } from "./Common";
import type { UserBase } from "./User";

export interface PosCreditNoteBase extends Omit<CommonDataType, "createdBy"> {
  creditNoteNo?: string;
  customerId?: ContactBase | null;
  returnPosOrderId?: any; // Could be typed if we need it
  totalAmount?: number;
  creditsUsed?: number;
  creditsRemaining?: number;
  notes?: string;
  status?: string;
  isActive?: boolean;
  createdBy?: UserBase | null;
}

export interface PosCreditNoteDataResponse extends PageStatus {
  posCreditNote_data: PosCreditNoteBase[];
}

export interface PosCreditNoteApiResponse extends MessageStatus {
  data: PosCreditNoteDataResponse;
}
