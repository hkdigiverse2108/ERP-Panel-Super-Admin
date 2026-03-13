import type { CommonDataType, MessageStatus, PageStatus } from "./Common";

export interface SalaryFormValues {
  companyId?: string;
  amount?: number;
  image?: string | File | null;
  description?: string;
  partyId?: string;
  type?: string;
  incentive?: string;
  fromDate?: string | Date | null;
  toDate?: string | Date | null;
  isActive?: boolean;
  _submitAction?: string;
}

export type AddSalaryPayload = SalaryFormValues;

export type EditSalaryPayload = AddSalaryPayload & { salaryId?: string };

export type SalaryBase = SalaryFormValues & CommonDataType;

export interface SalaryDataResponse extends PageStatus {
  salary_data: SalaryBase[];
}

export interface SalaryApiResponse extends MessageStatus {
  data: SalaryDataResponse;
}

export interface SalaryDropdownApiResponse extends MessageStatus {
  data: SalaryBase[];
}
