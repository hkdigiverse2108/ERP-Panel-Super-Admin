import type { CommonDataType, MessageStatus, PageStatus } from "./Common";

export interface RolesFormValues {
  name?: string;
  isActive?: boolean;
  _submitAction?: string;
}

export type AddRolesPayload = RolesFormValues;

export type EditRolesPayload = AddRolesPayload & { roleId: string };

export type RolesBase = RolesFormValues & CommonDataType;

export interface RolesDataResponse extends PageStatus {
  role_data: RolesBase[];
}

export interface RolesApiResponse extends MessageStatus {
  data: RolesDataResponse;
}
