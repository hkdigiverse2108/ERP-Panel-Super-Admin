import type { CommonDataType, MessageStatus, PageStatus } from "./Common";

export interface AdminSettingLink {
  title?: string;
  link?: string;
  icon?: string;
}

export interface AdminSettingFormValues {
  links?: AdminSettingLink[];
}

export type AddAdminSettingPayload = AdminSettingFormValues;

export type EditAdminSettingPayload = AdminSettingFormValues & {
  AdminSettingId?: string;
};

export interface AdminSettingBase extends AdminSettingFormValues, CommonDataType {}

export interface AdminSettingDataResponse extends PageStatus {
  aetting_data: AdminSettingBase[];
}

export interface AdminSettingApiResponse extends MessageStatus {
  data: AdminSettingDataResponse;
}

export interface AdminSettingDropdownApiResponse extends MessageStatus {
  data: AdminSettingBase[];
}
