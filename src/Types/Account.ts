
import type { CommonDataType, MessageStatus, PageStatus } from "./Common";

export interface AccountFormValues {
  name?: string;
  accountGroupId?: string;
  type?: string;
  nature?: string;
  openingBalance?: number;
  currentBalance?: number;
  groupLevel?: number;
  isActive?: boolean;
}

export type AddAccountPayload = AccountFormValues;

export type EditAccountPayload = AccountFormValues & {
  accountId?: string;
};

export interface AccountBase extends Omit<AccountFormValues, "accountGroupId">, CommonDataType {
  accountGroupId?: AccountGroupBase | string;
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

export interface AccountGroupBase extends CommonDataType {
  name?: string;
}
