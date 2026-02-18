import type { CommonDataType, MessageStatus, PageStatus, PhoneNumberType } from "./Common";
import type { LocationBase } from "./Location";
export interface Address {
  gstType?: string;
  gstIn?: string;
  contactFirstName?: string;
  contactLastName?: string;
  contactNo?: PhoneNumberType;
  contactEmail?: string;
  addressLine1?: string;
  addressLine2?: string;
  country?: string;
  state?: string;
  city?: string;
  pinCode?: string;
  contactCompanyName?: string;
}

export interface ContactAddressApi extends Omit<Address, "country" | "state" | "city"> {
  country?: LocationBase;
  state?: LocationBase;
  city?: LocationBase;
}

export interface ContactBankDetails {
  ifscCode?: string;
  name?: string;
  branch?: string;
  accountNumber?: string;
}

export interface ContactFormValues {
  contactType?: string;
  firstName?: string;
  lastName?: string;
  email?: string;
  phoneNo?: PhoneNumberType;
  whatsappNo?: PhoneNumberType;
  panNo?: string;
  customerCategory?: string;
  paymentMode?: string;
  paymentTerms?: string;
  tanNo?: string;
  openingBalance?: {
    creditBalance?: string;
    debitBalance?: string;
  };
  customerType?: string;
  vendorType?: string;
  address?: Address[];
  isActive?: boolean;
  loyaltyPoints?: number;
  dob?: string;
  anniversaryDate?: string;
  telephoneNo?: string;
  remarks?: string;
  supplierType?: string;
  bankDetails?: ContactBankDetails;
  transporterId?: string;
  companyName?: string;
  _submitAction?: "save" | "saveAndNew";
}

export type AddContactPayload = ContactFormValues & { companyId?: string };

export type EditContactPayload = AddContactPayload & { contactId?: string };

export interface ContactFormFormikValues extends Omit<ContactFormValues, "address"> {
  address?: Address;
}
export interface ContactBase extends Omit<ContactFormValues, "address">, CommonDataType {
  address?: ContactAddressApi[];
}

export interface ContactDataResponse extends PageStatus {
  contact_data: ContactBase[];
}

export interface ContactApiResponse extends MessageStatus {
  data: ContactDataResponse;
}

export interface ContactDropdownApiResponse extends PageStatus {
  data: ContactBase[];
}
