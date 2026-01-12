import type { BranchBase } from "./Branch";
import type { RolesBase } from "./Roles";
import type { CommonDataType, MessageStatus, PageStatus, PhoneNumberType } from "./Common";
import type { CompanyBase } from "./Company";


export interface Address {
  address?: string;
  country?: string;
  state?: string;
  city?: string;
  postalCode?: string;
}

export interface BankDetails {
  name?: string;
  branchName?: string;
  accountNumber?: string;
  bankHolderName?: string;
  swiftCode?: string;
  IFSCCode?: string;
}

export interface UserFormValues {
  password?: string;
  fullName?: string;
  username?: string;
  designation?: string;
  phoneNo?: PhoneNumberType;
  email?: string;
  branchId?: string;
  panNumber?: string;
  role?: string;
  address?: Address;
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

export interface UserBase extends Omit<UserFormValues, "branchId" | "role" | "companyId">, CommonDataType {
  branchId: BranchBase;
   role: RolesBase;
  companyId: CompanyBase;
}

export interface UserDataResponse extends PageStatus {
  user_data: UserBase[];
}

export interface UserApiResponse extends MessageStatus {
  data: UserDataResponse;
}
