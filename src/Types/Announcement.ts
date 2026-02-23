import type { CommonDataType, MessageStatus, PageStatus } from "./Common";
import type { CompanyBase } from "./Company";

export interface AnnouncementFormValues {
  companyId?: string;
  desc?: string;
  link?: string;
  version?: string;
  isActive?: boolean;
  _submitAction?: string;
}

export type AddAnnouncementPayload = AnnouncementFormValues;

export type EditAnnouncementPayload = AnnouncementFormValues & { announcementId: string };

export interface AnnouncementBase extends Omit<AnnouncementFormValues, "companyId">, CommonDataType {
  companyId: CompanyBase;
}

export interface AnnouncementDataResponse extends PageStatus {
  announcement_data: AnnouncementBase[];
}

export interface AnnouncementApiResponse extends MessageStatus {
  data: AnnouncementDataResponse;
}
