import type { PhoneNumberType } from "./Common";

export interface CallRequestFormValues {
  businessName?: string;
  contactName?: string;
  contactNo?: PhoneNumberType;
  note?: string;
}
