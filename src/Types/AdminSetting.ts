import type { CommonDataType, MessageStatus } from "./Common";

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

export interface AdminSettingApiResponse extends MessageStatus {
  data: AdminSettingBase;
}

export interface AdminSettingDropdownApiResponse extends MessageStatus {
  data: AdminSettingBase[];
}
