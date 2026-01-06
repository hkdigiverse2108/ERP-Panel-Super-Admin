import type { PhoneNumberType } from "./Common";

export interface CustomerFormValues {
  name?: string;
  phoneNo?: PhoneNumberType;
  dateOfBirth?: string;
  anniversaryDate?: string;
  email?: string;
  address?: string;
  country?: string;
  state?: string;
  city?: string;
  gstType?: string;
  gstNo?: string;
  gstName?: string;
  gstAddress?: string;
}
