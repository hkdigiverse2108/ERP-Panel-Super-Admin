import type { BranchBase } from "./Branch";
import type { CommonDataType, MessageStatus, PageStatus } from "./Common";
import type { CompanyBase } from "./Company";
import type { ConsumptionTypeBase } from "./ConsumptionType";
import type { ProductBase } from "./Product";

export interface MaterialConsumptionRow {
  productId: string;
  qty: number;
  price: number;
  totalPrice: number;
}
export interface MaterialConsumptionItem extends MaterialConsumptionRow {
  name: string;
}

export interface MaterialConsumptionFormValues {
  companyId?: string;
  branchId?: string;
  number?: string;
  date?: string;
  remark?: string;
  items?: MaterialConsumptionRow[];
  totalQty?: number;
  totalAmount?: number;
  isActive?: boolean;
  _submitAction?: string;
}

export type AddMaterialConsumptionPayload = MaterialConsumptionFormValues;

export type EditMaterialConsumptionPayload = MaterialConsumptionFormValues & { materialConsumptionId?: string };

export interface MaterialConsumptionBase extends Omit<MaterialConsumptionFormValues, "companyId" | "branchId" | "items"| "consumptionTypeId">, CommonDataType {
  companyId: CompanyBase;
  branchId: BranchBase;
  consumptionTypeId?: ConsumptionTypeBase;
  items: (Omit<MaterialConsumptionItem, "productId"> & {
    productId: ProductBase;
  })[];
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
