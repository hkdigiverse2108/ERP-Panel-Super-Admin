import type { CommonDataType, MessageStatus, PageStatus } from "./Common";

export interface AnnouncementBase extends CommonDataType {
  companyId: string;
  desc: string[];
  link: string;
  version: string;
}

export interface AnnouncementDataResponse extends PageStatus {
  announcement_data: AnnouncementBase[];
}

export interface AnnouncementApiResponse extends MessageStatus {
  data: AnnouncementDataResponse;
}
