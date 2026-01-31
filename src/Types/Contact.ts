
import type { MessageStatus } from "./Common";

export interface ContactBase {
  _id: string;
  name: string;
  phone?: string;
  email?: string;
  designation?: string;
}

export interface ContactDropdownApiResponse extends MessageStatus {
  data: ContactBase[];
}
