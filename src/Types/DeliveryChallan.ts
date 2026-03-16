import type { MessageStatus } from "./Common";

export interface DeliveryChallanDropdownApiResponse extends MessageStatus {
  data: any[]; // Using any[] for now as we only need it for GenerateOptions which handles various name/title fields
}
