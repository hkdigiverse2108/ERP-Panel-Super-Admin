import type { BranchBase } from "./Branch";
import type { AddressApi, AddressBase, CommonDataType, MessageStatus, PageStatus, PhoneNumberType } from "./Common";
import type { CompanyBase } from "./Company";
import type { RolesBase } from "./Roles";

export interface EmployeeBankDetails {
  name?: string;
  branchName?: string;
  accountNumber?: string;
  bankHolderName?: string;
  swiftCode?: string;
  IFSCCode?: string;
}

export interface EmployeeFormValues {
  fullName?: string;
  username?: string;
  designation?: string;
  phoneNo?: PhoneNumberType;
  email?: string;
  branchId?: string;
  panNumber?: string;
  role?: string;
  address?: AddressBase;
  bankDetails?: EmployeeBankDetails;
  wages?: number;
  commission?: number;
  extraWages?: number;
  target?: number;
  userType?: string;
  password?: string;
  isActive?: boolean;
  _submitAction?: string;
  companyId?: string;
}

export type AddEmployeePayload = EmployeeFormValues;

export type EditEmployeePayload = AddEmployeePayload & { userId: string };

export interface EmployeeBase extends Omit<EmployeeFormValues, "branchId" | "role" | "companyId" | "address">, CommonDataType {
  branchId: BranchBase;
  role: RolesBase;
  companyId: CompanyBase;
  address: AddressApi;
}

export interface EmployeeDataResponse extends PageStatus {
  user_data: EmployeeBase[];
}

export interface EmployeeApiResponse extends MessageStatus {
  data: EmployeeDataResponse;
}

export interface SingleEmployeeApiResponse extends MessageStatus {
  data: EmployeeBase[];
}
