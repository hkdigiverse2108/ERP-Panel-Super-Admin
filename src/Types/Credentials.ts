import type { CommonDataType } from "./Common";

export interface CredentialsBase extends CommonDataType {
  projectId: string;
  publishableKey: string;
  supabaseUrl: string;
  lastUsed: string | null;
}

export interface CredentialsApiResponse {
  data: {
    credential_data: CredentialsBase[];
    totalData: number;
    state: {
      page: number;
      limit: number;
      totalPages: number;
    };
  };
  message: string;
}

export interface AddCredentialPayload {
  projectId: string;
  publishableKey: string;
  supabaseUrl: string;
}

export interface EditCredentialPayload extends Partial<AddCredentialPayload> {
  credentialId: string;
  isActive?: boolean;
}

export interface CredentialsFormValues {
  projectId: string;
  publishableKey: string;
  supabaseUrl: string;
  isActive: boolean;
}
