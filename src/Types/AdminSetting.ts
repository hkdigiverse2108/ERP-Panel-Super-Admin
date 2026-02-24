import type { CommonDataType, MessageStatus, PhoneNumberType } from "./Common";

export interface AdminSettingLink {
  title?: string;
  link?: string;
  icon?: string;
  isActive?: boolean;
}

export interface AdminSettingWorkingHours {
  startTime?: string;
  endTime?: string;
  timezone?: string;
}

export interface AdminSettingFormValues {
  logo?: string | File | null;
  favicon?: string | File | null;
  themeImage?: string | File | null;
  phoneNo?: PhoneNumberType;
  email?: string;
  address?: string;
  workingHours?: AdminSettingWorkingHours;
  links?: AdminSettingLink[];
}

export type AddAdminSettingPayload = AdminSettingFormValues;

export type EditAdminSettingPayload = AdminSettingFormValues;

export interface AdminSettingBase extends AdminSettingFormValues, CommonDataType {}

export interface AdminSettingApiResponse extends MessageStatus {
  data: AdminSettingBase | AdminSettingBase[];
}

export interface AdminSettingDropdownApiResponse extends MessageStatus {
  data: AdminSettingBase[];
}
