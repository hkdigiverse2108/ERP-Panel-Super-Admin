import type { BranchBase } from "./Branch";
import type { RolesBase } from "./Roles";
import type { AddressApi, AddressBase, CommonDataType, MessageStatus, PageStatus, PhoneNumberType } from "./Common";
import type { CompanyBase } from "./Company";

export interface BankDetails {
  name?: string;
  branchName?: string;
  accountNumber?: string;
  bankHolderName?: string;
  swiftCode?: string;
  IFSCCode?: string;
}

export interface UserFormValues {
  userType?: string;
  password?: string;
  fullName?: string;
  username?: string;
  designation?: string;
  phoneNo?: PhoneNumberType;
  email?: string;
  branchId?: string;
  panNumber?: string;
  role?: string;
  address?: AddressBase;
  bankDetails?: BankDetails;
  wages?: number;
  commission?: number;
  extraWages?: number;
  target?: number;
  isActive?: boolean;
  _submitAction?: string;
  companyId?: string;
}

export type AddUserPayload = UserFormValues;

export type EditUserPayload = AddUserPayload & { userId: string };

export interface UserBase extends Omit<UserFormValues, "branchId" | "role" | "companyId" | "address">, CommonDataType {
  branchId: BranchBase;
   role: RolesBase;
  companyId: CompanyBase;
  address?: AddressApi;
}

export interface UserDataResponse extends PageStatus {
  user_data: UserBase[];
}

export interface UserApiResponse extends MessageStatus {
  data: UserDataResponse;
}
