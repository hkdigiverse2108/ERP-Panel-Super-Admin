import type { CommonDataType, MessageStatus, PageStatus, PhoneNumberType } from "./Common";
import type { CompanyBase } from "./Company";
import type { UserBase } from "./User";

export interface BranchAddress {
  address?: string;
  city?: string;
  state?: string;
  country?: string;
  pinCode?: string;
  timeZone?: string;
}
export interface BranchFormValues {

  companyId?: string;
  name?: string;
  displayName?: string;
  contactName?: string;

  phoneNo?: PhoneNumberType;
  telephoneNumber?: string;
  email?: string;
  userName?: string;
  password?: string;
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
  timeZone?: string;
  address?: BranchAddress;

  bankId?: string;
  upiId?: string;

  outletSize?: string;
  userIds?: string[];

  isActive?: boolean;
 
  _submitAction?: string;
}
export type AddBranchPayload = BranchFormValues;

export type EditBranchPayload = BranchFormValues & {
  branchId: string;
};
export interface BranchBase extends Omit<BranchFormValues, "companyId" | "userIds" | "password" | "_submitAction">, CommonDataType {
  companyId: CompanyBase;
  userIds?: UserBase[];
}
export interface BranchDataResponse extends PageStatus {
  branch_data: BranchBase[];
}

export interface BranchApiResponse extends MessageStatus {
  data: BranchDataResponse;
}
