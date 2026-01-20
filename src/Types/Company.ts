import type { AddressApi, AddressBase, CommonDataType, MessageStatus, PageStatus, PhoneNumberType } from "./Common";

export interface CompanyFormValues {
  accountingType?: string;
  name?: string;
  displayName?: string;
  contactName?: string;
  email?: string;
  supportEmail?: string;
  phoneNo?: PhoneNumberType;
  ownerNo?: PhoneNumberType;
  customerCareNumber?: string;

  address?: AddressBase;

  bankId?: string;
  upiId?: string;
  bankName?: string;
  bankIFSC?: string;
  branchName?: string;
  accountHolderName?: string;
  bankAccountNumber?: string;

  userName?: string;
  GSTRegistrationType?: string;
  GSTIdentificationNumber?: string;
  PanNo?: string;
  webSite?: string;
  financialYear?: string;
  corporateIdentificationNumber?: string;
  letterOfUndertaking?: string;
  importerExporterCode?: string;
  outletSize?: string;
  fssaiNo?: string;
  taxDeductionAndCollectionAccountNumber?: string;
  printDateFormat?: string;
  decimalPoint?: string;
  currency?: string;

  enableFeedbackModule?: boolean;
  allowRoundOff?: boolean;
  logo?: string;
  waterMark?: string;
  reportFormatLogo?: string;
  authorizedSignature?: string;

  isActive?: boolean;
  _submitAction?: string;
}

export type AddCompanyPayload = CompanyFormValues;

export type EditCompanyPayload = CompanyFormValues & { companyId: string };

export interface CompanyBase extends Omit<CompanyFormValues, "address">, CommonDataType {
  address: AddressApi;
}

export interface CompanyDataResponse extends PageStatus {
  company_data: CompanyBase[];
}

export interface CompanyApiResponse extends MessageStatus {
  data: CompanyDataResponse;
}

export interface SingleCompanyApiResponse extends MessageStatus {
  data: CompanyBase;
}

export interface CompanyDropdownApiResponse extends MessageStatus {
  data: CompanyBase[];
}
