import type { AddressApi, AddressBase, CommonDataType, MessageStatus, PageStatus, PhoneNumberType } from "./Common";
import type { CompanyBase } from "./Company";
import type { UserBase } from "./User";

export interface BranchFormValues {

  companyId?: string;
  name?: string;
  displayName?: string;
  contactName?: string;

  phoneNo?: PhoneNumberType;
  telephoneNumber?: string;
  email?: string;
  userName?: string;
  yearInterval?: string;

  gstRegistrationType?: string;
  gstIdentificationNumber?: string;
  panNo?: string;

  webSite?: string;
  fssaiNo?: string;
  country?: string;
  state?: string;
  city?: string;
  pinCode?: string;
  address?: AddressBase;

  bankId?: string;
  upiId?: string;
  bankName?: string;
  bankIFSC?: string;
  branchName?: string;
  accountHolderName?: string;
  bankAccountNumber?: string;

  outletSize?: string;
  userIds?: string[];

  isActive?: boolean;
 
  _submitAction?: string;
}
export type AddBranchPayload = BranchFormValues;

export type EditBranchPayload = BranchFormValues & {
  branchId: string;
};
export interface BranchBase extends Omit<BranchFormValues, "companyId" | "userIds" | "password" | "address">, CommonDataType {
  companyId: CompanyBase;
  userIds?: UserBase[];
  address?: AddressApi;
}


export interface BranchDataResponse extends PageStatus {
  branch_data: BranchBase[];
}

export interface BranchApiResponse extends MessageStatus {
  data: BranchDataResponse;
}
export interface BranchDropdownApiResponse extends MessageStatus {
  data: BranchBase[];
}