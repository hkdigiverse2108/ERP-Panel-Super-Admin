import type { BranchBase } from "./Branch";
import type { AddressApi, CommonDataType, MessageStatus, PageStatus } from "./Common";

export interface BankAddressForm {
  addressLine1?: string;
  addressLine2?: string;
  country?: string;
  state?: string;
  city?: string;
  pinCode?: string;
}
export type BankAddressApi = AddressApi & Pick<BankAddressForm, "addressLine1" | "addressLine2" | "pinCode">;

export interface BankFormValues {
  companyId?: string;
  name?: string;
  ifscCode?: string;
  branchName?: string;
  accountHolderName?: string;
  bankAccountNumber?: string;
  upiId?: string;
  swiftCode?: string;
  openingBalance?: {
    creditBalance?: number;
    debitBalance?: number;
  };
  address?: BankAddressForm;
  branchIds?: string[];
  isActive?: boolean;
  _submitAction?: string;
}

export type AddBankPayload = BankFormValues;

export type EditBankPayload = AddBankPayload & { bankId: string };

export interface BankBase extends Omit<BankFormValues, "address" | "branchIds">, CommonDataType {
  address: BankAddressApi;
  branchIds: BranchBase[];
}

export interface BankDataResponse extends PageStatus {
  bank_data: BankBase[];
}

export interface BankApiResponse extends MessageStatus {
  data: BankDataResponse;
}

export interface BankDropdownApiResponse extends MessageStatus {
  data: BankBase[];
}
