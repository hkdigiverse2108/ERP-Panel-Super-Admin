import type { CommonDataType, MessageStatus, PageStatus } from "./Common";
import type { CompanyBase } from "./Company";

export interface ConsumptionTypeFormValues {
  name?: string;
  isActive?: boolean;
}

export type AddConsumptionTypePayload = ConsumptionTypeFormValues;

export type EditConsumptionTypePayload = AddConsumptionTypePayload & { consumptionTypeId?: string };

export type ConsumptionTypeBase = ConsumptionTypeFormValues & CommonDataType & { companyId: CompanyBase };

export interface ConsumptionTypeDataResponse extends PageStatus {
  consumptionType_data: ConsumptionTypeBase[];
}

export interface ConsumptionTypeApiResponse extends MessageStatus {
  data: ConsumptionTypeDataResponse;
}

export interface ConsumptionTypeDropdownApiResponse extends MessageStatus {
  data: ConsumptionTypeBase[];
}
