import type { CommonDataType, MessageStatus, PageStatus } from "./Common";

export interface BranchFormValues {
  address?: string;
  name?: string;
  isActive?: boolean;
  _submitAction?: string;
}

export type AddBranchPayload = BranchFormValues & { companyId?: string };

export type EditBranchPayload = AddBranchPayload & { branchId: string };

export type BranchBase = BranchFormValues & CommonDataType;

export interface BranchDataResponse extends PageStatus {
  branch_data: BranchBase[];
}

export interface BranchApiResponse extends MessageStatus {
  data: BranchDataResponse;
}
