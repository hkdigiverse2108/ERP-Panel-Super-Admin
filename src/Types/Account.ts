
import type { AccountGroupBase } from "./AccountGroup";
import type { CommonDataType, MessageStatus, PageStatus } from "./Common";

export interface AccountFormValues {
  name?: string;
  type?: string;
  groupId?: string;
  openingBalance?: number;
  currentBalance?: number;
  isActive?: boolean;
};

export type AddAccountPayload = AccountFormValues;

export type EditAccountPayload = AccountFormValues & {
  accountId?: string;
};

export interface AccountBase extends Omit<AccountFormValues, "groupId">, CommonDataType {
  groupId?: AccountGroupBase;
}

export interface AccountDataResponse extends PageStatus {
  account_data: AccountBase[];
}

export interface AccountApiResponse extends MessageStatus {
  data: AccountDataResponse;
}

export interface AccountDropdownApiResponse extends MessageStatus {
  data: AccountBase[];
}

