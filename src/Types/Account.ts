import type { CommonDataType, MessageStatus, PageStatus } from "./Common";
import type { AccountGroupBase } from "./AccountGroup";

export interface AccountBase extends CommonDataType {
  name: string;
  groupId?: AccountGroupBase | string;
  openingBalance?: number;
  currentBalance?: number;
  type?: string;
  isActive?: boolean;
}
export interface AddAccountPayload {
  name: string;
  groupId: string;
  openingBalance?: number;
  currentBalance?: number;
  type?: string;
  isActive?: boolean;
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
export interface DeleteAccountPayload {
  id: string;
}

export interface GetAccountPayload {
  id: string;
}

export interface EditAccountPayload {
  account: AccountBase;
}