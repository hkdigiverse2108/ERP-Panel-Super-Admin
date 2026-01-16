import type { CommonDataType, MessageStatus, PageStatus } from "./Common";

export interface UomFormValues {
  code?: string;
  name?: string;
  isActive?: boolean;
}

export type AddUomPayload = UomFormValues;

export type EditUomPayload = AddUomPayload & { uomId?: string };

export type UomBase = UomFormValues & CommonDataType;

export interface UomDataResponse extends PageStatus {
  uom_data: UomBase[];
}

export interface UomApiResponse extends MessageStatus {
  data: UomDataResponse;
}

export interface UomDropdownApiResponse extends MessageStatus {
  data: UomBase[];
}