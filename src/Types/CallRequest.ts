import type { CommonDataType, MessageStatus, PageStatus, PhoneNumberType } from "./Common";
import type { CompanyBase } from "./Company";

export interface CallRequestFormValues {
  businessName?: string;
  contactName?: string;
  contactNo?: PhoneNumberType;
  note?: string;
  is_active?: boolean;
  companyId?: string;
}
export type AddCallRequestPayload = CallRequestFormValues;

export type EditCallRequestPayload = CallRequestFormValues & { callRequestId: string };

export interface CallRequestBase extends Omit<CallRequestFormValues, "companyId">, CommonDataType {
  companyId: CompanyBase;
}

export interface CallRequestDataResponse extends PageStatus {
  call_Request_data: CallRequestBase[];
}

export interface CallRequestApiResponse extends MessageStatus {
  data: CallRequestDataResponse;
}

