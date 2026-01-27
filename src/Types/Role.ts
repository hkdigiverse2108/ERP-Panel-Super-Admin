import type { CommonDataType, MessageStatus, PageStatus } from "./Common";

export interface RoleFormValues {
  name?: string;
  isActive?: boolean;
  _submitAction?: string;
}

export type AddRolePayload = RoleFormValues;

export type EditRolePayload = AddRolePayload & { roleId?: string };

export type RoleBase = RoleFormValues & CommonDataType;

export interface RoleDataResponse extends PageStatus {
  role_data: RoleBase[];
}

export interface RoleApiResponse extends MessageStatus {
  data: RoleDataResponse;
}

export interface RoleDropdownApiResponse extends MessageStatus {
  data: RoleBase[];
}

