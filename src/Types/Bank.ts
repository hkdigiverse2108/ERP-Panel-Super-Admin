import type { CommonDataType, MessageStatus, PageStatus } from "./Common";

export interface BankFormValues {
 
 _id?: string;
  _submitAction?: string;
  companyId?: string;
  name?: string;
  ifscCode?: string;
  branchName?: string;
  accountHolderName?: string;
  bankAccountNumber?: string;
  swiftCode?: string;
  
  openingBalance?: {
    creditBalance?: number;
    debitBalance?: number;
  };
  
  isUpiAvailable?: boolean;
  addressLine1?: string;
  addressLine2?: string;
  country?: string;
  state?: string;
  city?: string;
  zipCode?: number;
  branchIds?: string[]; 
  isActive?: boolean;
  status?: string;
  bankId?: string;
 
}



export type AddBankPayload = BankFormValues;

export type EditBankPayload = AddBankPayload & { bankId: string };

export type BankBase = BankFormValues & CommonDataType;

export interface BankDataResponse extends PageStatus {
  bank_data: BankBase[];
}

export interface BankApiResponse extends MessageStatus {
  data: BankDataResponse;
}