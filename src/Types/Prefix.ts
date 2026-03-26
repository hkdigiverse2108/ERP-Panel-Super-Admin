import type { CommonDataType, MessageStatus, PageStatus } from "./Common";
import type { CompanyBase } from "./Company";

export interface PrefixFormValues {
  prefixType?: string;
  prefix?: string;
  sequenceNumber?: number;
  isActive?: boolean;
  companyId?: string | CompanyBase;
}

export type AddPrefixPayload = PrefixFormValues;

export type EditPrefixPayload = Partial<AddPrefixPayload> & { prefixId?: string };

export type PrefixBase = PrefixFormValues & CommonDataType;

export interface PrefixDataResponse extends PageStatus {
  prefix_data: PrefixBase[];
}

export interface PrefixApiResponse extends MessageStatus {
  data: PrefixDataResponse;
}

export interface PrefixDropdownApiResponse extends MessageStatus {
  data: PrefixBase[];
}
