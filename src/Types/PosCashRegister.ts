import type { CommonDataType, MessageStatus, PageStatus } from "./Common";
import type { CompanyBase } from "./Company";
import type { BranchBase } from "./Branch";

export interface Denomination {
  currency: number;
  count: number;
  amount: number;
}

export interface PosCashRegisterFormValues {
  openingCash?: number;

  cashPayment?: number;
  chequePayment?: number;
  cardPayment?: number;
  bankPayment?: number;
  upiPayment?: number;

  salesReturn?: number;
  cashRefund?: number;
  bankRefund?: number;

  creditAdvanceRedeemed?: number;
  payLater?: number;

  expense?: number;
  purchasePayment?: number;

  totalSales?: number;

  denominations?: Denomination[];
  totalDenominationAmount?: number;

  bankAccountId?: string | null;
  bankTransferAmount?: number;

  cashFlow?: number;

  totalCashLeftInDrawer?: number;
  physicalDrawerCash?: number;

  closingNote?: string | null;

  status?: string;
  companyId?: string | CompanyBase;
  branchId?: string | BranchBase;
  isActive?: boolean;
}

export type AddPosCashRegisterPayload = PosCashRegisterFormValues;

export type EditPosCashRegisterPayload = PosCashRegisterFormValues & {
  posCashRegisterId: string;
};

export interface PosCashRegisterBase extends PosCashRegisterFormValues, CommonDataType {
  companyId?: CompanyBase;
  branchId?: BranchBase;
  createdBy?: string | { fullName?: string; username?: string };
  salesManId?: string | { _id: string; name?: string } | null;
}

export interface PosCashRegisterDataResponse extends PageStatus {
  posCashRegister_data?: PosCashRegisterBase[];
}

export interface PosCashRegisterApiResponse extends MessageStatus {
  data: PosCashRegisterDataResponse;
}

export interface PosCashRegisterSingleApiResponse extends MessageStatus {
  data: PosCashRegisterBase;
}

export interface PosCashRegisterDropdownApiResponse extends MessageStatus {
  data: PosCashRegisterBase[];
}
