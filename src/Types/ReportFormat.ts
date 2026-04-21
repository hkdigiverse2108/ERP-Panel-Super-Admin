import type { CommonDataType, MessageStatus } from "./Common";

export interface ReportFormat {
  name: string;
  isSelected: boolean;
  isActive: boolean;
}

export interface ReportFormatFormValues {
  type?: string;
  formats?: ReportFormat[] | null;
  isActive?: boolean;
  _submitAction?: string;
}

export type AddReportFormatPayload = ReportFormatFormValues;

export type EditReportFormatPayload = Partial<ReportFormatFormValues> & { reportFormatId: string };

export interface ReportFormatBase extends ReportFormatFormValues, CommonDataType {}

export interface ReportFormatApiResponse extends MessageStatus {
  data: ReportFormatBase[];
}
