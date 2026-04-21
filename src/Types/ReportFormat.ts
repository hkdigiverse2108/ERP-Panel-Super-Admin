import type { CommonDataType, MessageStatus } from "./Common";

export interface ReportFormat {
  name: string;
  isSelected: boolean;
  isActive: boolean;
}

export interface ReportFormatFormValues extends CommonDataType {
  type?: string;
  formats?: ReportFormat[] | null;
}

export type AddReportFormatPayload = ReportFormatFormValues;

export type EditReportFormatPayload = Partial<ReportFormatFormValues> & { reportFormatId: string };

export interface ReportFormatBase extends ReportFormatFormValues {}

export interface ReportFormatApiResponse extends MessageStatus {
  data: ReportFormatBase[];
}
