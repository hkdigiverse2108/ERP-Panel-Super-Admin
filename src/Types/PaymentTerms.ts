import type { CommonDataType, MessageStatus, PageStatus } from "./Common";
import type { CompanyBase } from "./Company";

export interface PaymentTermsFormValues {
  companyId?: string;
  name?: string;
  day?: number;
  isDefault?: boolean;
  isActive?: boolean;
}

export type AddPaymentTermsPayload = PaymentTermsFormValues;

export type EditPaymentTermsPayload = AddPaymentTermsPayload & { paymentTermId?: string };

export type PaymentTermsBase = PaymentTermsFormValues & CommonDataType & { companyId: CompanyBase };

export interface PaymentTermsDataResponse extends PageStatus {
  paymentTerm_data: PaymentTermsBase[];
}

export interface PaymentTermsApiResponse extends MessageStatus {
  data: PaymentTermsDataResponse;
}

export interface PaymentTermsDropdownApiResponse extends MessageStatus {
  data: PaymentTermsBase[];
}
