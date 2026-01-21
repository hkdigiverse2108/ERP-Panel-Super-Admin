import type { CommonDataType, MessageStatus, PageStatus } from "./Common";

export interface AccountGroupFormValues {
  name?: string;
  parentGroupId?: string;
  nature?: string;
  isActive?: boolean;
}

export type AddAccountGroupPayload = AccountGroupFormValues;

export type EditAccountGroupPayload = AddAccountGroupPayload & { accountGroupId?: string };

export interface AccountGroupBase extends Omit<AccountGroupFormValues, "parentGroupId">, CommonDataType {
  parentGroupId?: AccountGroupBase 
}

export interface AccountGroupDataResponse extends PageStatus {
  accountGroup_data: AccountGroupBase[];
}

export interface AccountGroupApiResponse extends MessageStatus {
  data: AccountGroupDataResponse;
}
export interface AccountGroupDropdownApiResponse extends MessageStatus {
  data: AccountGroupBase[];
}