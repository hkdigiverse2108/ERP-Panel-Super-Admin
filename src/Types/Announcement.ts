import type { CommonDataType, MessageStatus, PageStatus } from "./Common";

export interface AnnouncementBase extends CommonDataType {
  companyId: string;
  type: string;
  desc: string[];
  link: string;
  version: string;
  isActive?: boolean;
}
export type AddAnnouncementPayload = {
  companyId: string;
  type: string;
  desc: string[];
  link: string;
  version: string;
  isActive?: boolean;
};

export type EditAnnouncementPayload = Partial<AddAnnouncementPayload> & { announcementId: string };

export interface AnnouncementDataResponse extends PageStatus {
  announcement_data: AnnouncementBase[];
}

export interface AnnouncementApiResponse extends MessageStatus {
  data: AnnouncementDataResponse;
}
