import type { CommonDataType, MessageStatus, PageStatus } from "./Common";

export interface ModuleFormValues {
  tabName?: string;
  displayName?: string;
  tabUrl?: string;
  number?: string;
  hasDefault?: string;
  hasAdd?: boolean;
  hasEdit?: boolean;
  hasView?: boolean;
  hasDelete?: boolean;
  isActive?: boolean;
  _submitAction?: string;
}

export type AddModulePayload = ModuleFormValues;

export type EditModulePayload = AddModulePayload & { moduleId?: string };


export interface ModuleBase extends Omit<ModuleFormValues, "parentId">, CommonDataType {
  parentId?: ModuleBase 
}

export interface ModuleDataResponse extends PageStatus {
  Module_data: ModuleBase[];
}

export interface ModuleApiResponse extends MessageStatus {
  data: ModuleDataResponse;
} 

