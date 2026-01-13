import type { CommonDataType, MessageStatus, PageStatus } from "./Common";

export interface TaxFormValues {
  name?: string;
  percentage?: number | "";
  isActive?: boolean;
}

export type AddTaxPayload = TaxFormValues;

export type EditTaxPayload = AddTaxPayload & { taxId?: string };

export type TaxBase = TaxFormValues & CommonDataType;

export interface TaxDataResponse extends PageStatus {
  tax_data: TaxBase[];
}

export interface TaxApiResponse extends MessageStatus {
  data: TaxDataResponse;
}

export interface TaxDropdownApiResponse extends MessageStatus {
  data: TaxBase[];
}
