import type { CommonDataType, MessageStatus, PageStatus } from "./Common";
import type { CompanyBase } from "./Company";
import type { TaxBase } from "./Tax";

/* ===================== FORM VALUES ===================== */
export interface AdditionalChargesFormValues {
  type?: string;
  name?: string;
  defaultValue?: number;
  taxId?: string | null;
  hsnSac?: string;
  isActive?: boolean;
  isTaxIncluding?: boolean;
  companyId?: string;
}

/* ===================== PAYLOADS ===================== */

export type AddAdditionalChargesPayload = AdditionalChargesFormValues;

export type EditAdditionalChargesPayload = AddAdditionalChargesPayload & { additionalChargeId?: string };

/* ===================== BASE MODEL ===================== */

export interface AdditionalChargesBase extends Omit<AdditionalChargesFormValues, "taxId" | "companyId">, CommonDataType {
  taxId?: TaxBase;
  companyId?: CompanyBase;
}

/* ===================== API RESPONSES ===================== */

export interface AdditionalChargesDataResponse extends PageStatus {
  additional_charge_data: AdditionalChargesBase[];
}

export interface AdditionalChargesApiResponse extends MessageStatus {
  data: AdditionalChargesDataResponse;
}

export interface AdditionalChargesDropdownApiResponse extends MessageStatus {
  data: AdditionalChargesBase[];
}
