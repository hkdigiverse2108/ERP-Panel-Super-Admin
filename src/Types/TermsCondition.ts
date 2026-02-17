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
  companyId?: string;
}

export interface  EditTermsConditionPayload extends AddTermsConditionPayload {
  termsConditionId: string;
  isActive?: boolean;
  companyId?: string;
}

export interface TermsConditionDataResponse extends MessageStatus {
  termsCondition_data: TermsConditionBase[];
  totalPages?: number;
  page?: number | null;
  limit?: number | null;
}

export interface TermsConditionApiResponse extends MessageStatus {
  data: TermsConditionDataResponse;
}

export interface TermsConditionDropdownApiResponse extends MessageStatus {
  data: TermsConditionBase[];
}

export interface TermsAndConditionModalProps {
  openModal: boolean;
  setOpenModal: (value: boolean) => void;
  onSave: (term: TermsConditionBase) => void;
  initialValues?: TermsConditionBase | null;
  isLoading?: boolean;
  companyId?: string;
}

export interface TermsConditionFormValues {
  termsCondition: string;
  isDefault?: boolean;
}

export interface TermsSelectionFormValues {
  selected: string[];
}

export interface TermsSelectionModalProps {
  companyId?: string;
}