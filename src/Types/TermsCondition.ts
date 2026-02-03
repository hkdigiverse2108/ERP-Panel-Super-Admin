import type { MessageStatus } from "./Common";

export interface TermsConditionBase {
  _id: string;
  termsCondition: string;
  isDefault?: boolean;
  isActive?: boolean;
}

export interface AddTermsConditionPayload {
  termsCondition: string;
  isDefault?: boolean;
}

export interface EditTermsConditionPayload extends AddTermsConditionPayload {
  termsConditionId: string;
  isActive?: boolean;
}

export interface TermsConditionApiResponse extends MessageStatus {
  data: TermsConditionBase[];
}

export interface TermsConditionDropdownApiResponse extends MessageStatus {
  data: TermsConditionBase[];
}
