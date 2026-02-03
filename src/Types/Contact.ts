
import type { MessageStatus } from "./Common";

export interface ContactAddress {
  addressLine1?: string;
  addressLine2?: string;
  gstIn?: string;
  city?: { _id: string; name: string };
  state?: { _id: string; name: string };
  country?: { _id: string; name: string };
  pinCode?: string;
}

export interface SupplierBase {
  _id: string;
  name: string;
  phone?: string;
  email?: string;
  designation?: string;
  address?: ContactAddress[];
}

export interface ContactApiResponse extends MessageStatus {
  data: SupplierBase[];
}
export interface ContactDropdownApiResponse extends MessageStatus {
  data: SupplierBase[];
}
