import type { CommonDataType, MessageStatus, PhoneNumberType } from "./Common";

export interface CompanyFormValues {
  name?: string;
  displayName?: string;
  contactName?: string;
  email?: string;
  supportEmail?: string;
  phoneNo?: PhoneNumberType;
  ownerNo?: PhoneNumberType;
  customerCareNumber?: string;

  address?: string;
  city?: string;
  state?: string;
  country?: string;
  pinCode?: string;
  timeZone?: string;

  bankName?: string;
  bankIFSC?: string;
  upiId?: string;
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
}

export type EditCompanyPayload = CompanyFormValues & { companyId: string };

export type CompanyBase = CompanyFormValues & CommonDataType;

export interface CompanyApiResponse extends MessageStatus {
  data: CompanyBase;
}
