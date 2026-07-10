import type { CommonDataType, MessageStatus, PageStatus } from "./Common";

export interface MetaWhatsAppAccount {
  _id?: string;
  companyId?: string;
  branchId?: string;
  businessAccountId: string;
  phoneNumberId: string;
  displayPhoneNumber?: string;
  accessToken: string;
  graphVersion?: string;
  isDefault?: boolean;
  lastTemplateSyncAt?: string;
}

export interface MetaTemplateComponent {
  type: string;
  format?: string;
  text?: string;
  buttons?: any[];
  example?: any;
}

export interface MetaTemplate extends CommonDataType {
  name: string;
  language: string;
  category: "UTILITY" | "MARKETING" | "AUTHENTICATION";
  status: string;
  accountId?: string | { _id: string; displayPhoneNumber?: string; phoneNumberId?: string };
  companyId?: string | { _id: string; name?: string; displayName?: string };
  branchId?: string;
  useFor: "POS_BILL" | "CONTACT_BULK" | "INVOICE" | "CUSTOM";
  components: MetaTemplateComponent[];
  localVariables?: unknown[];
  metaTemplateId?: string;
  rejectionReason?: string;
  sendAttachment?: boolean;
  attachmentType?: string;
  companyIds?: string[];
}

export interface MetaMessageLog extends CommonDataType {
  contactId?: string | { _id: string; firstName?: string; lastName?: string };
  accountId?: string;
  templateId?: string | { _id: string; name?: string; status?: string };
  companyId?: string | { _id: string; name?: string; displayName?: string };
  branchId?: string;
  sourceType: "POS_BILL" | "CONTACT_BULK" | "INVOICE" | "CUSTOM";
  sourceId?: string;
  recipientName?: string;
  recipientPhone: string;
  messageType: "template" | "text" | "document";
  status: "queued" | "sent" | "failed" | "skipped";
  metaMessageId?: string;
  requestPayload?: any;
  responsePayload?: any;
  errorCode?: string;
  errorMessage?: string;
  pricing?: { model?: string; billable?: boolean; category?: string };
  conversationCategory?: string;
  billedAmount?: number;
  fileUrl?: string;
  sentAt?: string;
}

export interface MetaWhatsAppAccountApiResponse extends MessageStatus {
  data: MetaWhatsAppAccount[];
}

export interface MetaTemplateApiResponse extends MessageStatus {
  data: PageStatus & { template_data: MetaTemplate[] };
}

export interface MetaMessageLogApiResponse extends MessageStatus {
  data: PageStatus & { log_data: MetaMessageLog[] };
}

export interface UpsertMetaWhatsAppAccountPayload {
  accountId?: string;
  businessAccountId: string;
  phoneNumberId: string;
  displayPhoneNumber?: string;
  accessToken: string;
  graphVersion?: string;
  isDefault?: boolean;
  branchId?: string;
  companyId?: string;
}

export interface CreateMetaTemplatePayload {
  accountId: string;
  name: string;
  language?: string;
  category?: "UTILITY" | "MARKETING" | "AUTHENTICATION";
  components: unknown[];
  useFor?: "POS_BILL" | "CONTACT_BULK" | "INVOICE" | "CUSTOM";
  sendAttachment?: boolean;
  attachmentType?: string;
  companyIds?: string[];
  branchId?: string;
  companyId?: string;
}

export interface SendPosBillWhatsAppPayload {
  posOrderId: string;
  templateId?: string;
}

export interface BulkSendContactWhatsAppPayload {
  templateId: string;
  contactIds: string[];
  sourceType?: "CONTACT_BULK" | "CUSTOM";
  variables?: Record<string, unknown>;
}

export interface BulkSendWhatsAppResponse extends MessageStatus {
  data: {
    total: number;
    sent: number;
    failed: number;
    skipped: number;
  };
}
