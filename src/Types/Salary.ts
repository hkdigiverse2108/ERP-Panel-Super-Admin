import type { CommonDataType, MessageStatus, PageStatus } from "./Common";
import type { CompanyBase } from "./Company";
import type { UserBase } from "./User";

export interface SalaryFormValues {
  companyId?: string;
  amount?: number;
  image?: string | File | null;
  description?: string;
  partyId?: string;
  type?: string;
  incentive?: number;
  fromDate?: string | Date | null;
  toDate?: string | Date | null;
  total?: number | null;
  isActive?: boolean;
  _submitAction?: string;
}

export type AddSalaryPayload = SalaryFormValues;

export type EditSalaryPayload = AddSalaryPayload & { salaryId?: string };
export type SalaryBase = Omit<SalaryFormValues, "partyId" | "companyId" > &
  CommonDataType & {
    partyId?: UserBase;
    companyId?: CompanyBase;
  };

export interface SalaryDataResponse extends PageStatus {
  salary_data: SalaryBase[];
}

export interface SalaryApiResponse extends MessageStatus {
  data: SalaryDataResponse;
}

export interface SalaryDropdownApiResponse extends MessageStatus {
  data: SalaryBase[];
}
