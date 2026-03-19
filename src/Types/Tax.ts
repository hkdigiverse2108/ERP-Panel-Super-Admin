import type { CommonDataType, MessageStatus, PageStatus } from "./Common";
import type { CompanyBase } from "./Company";

export interface TaxFormValues {
  name?: string;
  percentage?: number | "";
  isActive?: boolean;
  companyId?: string | CompanyBase;
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
