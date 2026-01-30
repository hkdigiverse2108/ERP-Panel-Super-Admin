import type { BranchBase } from "./Branch";
import type { CommonDataType, MessageStatus, PageStatus } from "./Common";
import type { CompanyBase } from "./Company";

export interface MaterialConsumptionRow {
  productId: string;
  name: string;
  qty: number;
  price: number;
  totalPrice: number;
}

export interface MaterialConsumptionFormValues {
  companyId?: string;
  branchId?: string;
  prefix?: string;
  consumptionNo?: string;
  date?: string;
  type?: string;
  remark?: string;
  items?: MaterialConsumptionRow[];
  totalQty?: number;
  totalAmount?: number;
  isActive?: boolean;
  _submitAction?: string;
}

export type AddMaterialConsumptionPayload = MaterialConsumptionFormValues;

export type EditMaterialConsumptionPayload = MaterialConsumptionFormValues & { materialConsumptionId: string };

export interface MaterialConsumptionBase extends Omit<MaterialConsumptionFormValues, "companyId" | "branchId">, CommonDataType {
  companyId: CompanyBase;
  branchId: BranchBase;
}

export interface MaterialConsumptionDataResponse extends PageStatus {
  material_consumption_data: MaterialConsumptionBase[];
}

export interface MaterialConsumptionApiResponse extends MessageStatus {
  data: MaterialConsumptionDataResponse;
}

export interface MaterialConsumptionDropdownApiResponse extends MessageStatus {
  data: MaterialConsumptionBase[];
}
