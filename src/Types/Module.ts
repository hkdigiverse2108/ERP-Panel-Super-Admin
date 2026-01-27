import type { CommonDataType, MessageStatus, PageStatus } from "./Common";

/* =========================
   MODULE FORM
========================= */

export interface ModuleFormValues {
  tabName?: string;
  displayName?: string;
  tabUrl?: string;
  number?: string;
  default?: string;
  hasAdd?: boolean;
  hasEdit?: boolean;
  hasView?: boolean;
  hasDelete?: boolean;
  isActive?: boolean;
  parentId?: string;
  _submitAction?: string;
}

export type AddModulePayload = ModuleFormValues;

export type EditModulePayload = AddModulePayload & { moduleId?: string };

export interface ModuleBase extends Omit<ModuleFormValues, "parentId">, CommonDataType {
  parentId?: ModuleBase;
}

export interface ModuleDataResponse extends PageStatus {
  module_data: ModuleBase[];
}

export interface ModuleApiResponse extends MessageStatus {
  data: ModuleDataResponse;
}

/* =========================
   PERMISSIONS
========================= */

export type PermissionKey = "add" | "edit" | "delete" | "view";

export type PermissionColumnKey = PermissionKey | "all";

export interface ModulePermission {
  add: boolean;
  delete: boolean;
  edit: boolean;
  view: boolean;
  hasAccess?: boolean;
}

export interface UserModulePermissionDataResponse {
  email: string;
  fullName: string;
  role: string;
  _id: string;
  id?: string;
  permissions: ModulePermission;
}

export interface ModuleAccessProps {
  data?: ModuleBase;
}

export interface AddModulePermissionPayload {
  moduleId?: string;
  users: UserModulePermissionDataResponse[];
}

export interface UserModulePermissionApiResponse extends MessageStatus {
  data: UserModulePermissionDataResponse[];
}

export interface ChildDetailsApiResponse extends CommonDataType, ModulePermission, ModuleFormValues {
  children: ChildDetailsApiResponse[];
}

export interface PermissionChildApiResponse extends MessageStatus {
  data: UserModulePermissionDataResponse[];
}

export interface EditPermissionPayload {
  userId: string;
  modules: {_id?: string } & ModulePermission[];
}

export interface PermissionDetailsApiPayload extends CommonDataType, ModulePermission, ModuleFormValues {
  modules: string;
  parentTab: ModuleFormValues & CommonDataType;
  id?: string;
}

export interface PermissionDetailsApiResponse extends MessageStatus {
  data: PermissionDetailsApiPayload[];
}