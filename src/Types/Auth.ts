import type { CommonDataType, MessageStatus } from "./Common";

// ************ Login ***********
export interface LoginPayload {
  email: string;
  password: string;
  loginSource?: string;
}

export interface ChangePasswordPayload {
  email?: string;
  oldPassword?: string;
  newPassword?: string;
  loginSource?: string;
}

export interface User extends LoginPayload, CommonDataType {
  fullName: string;
  phoneNumber: string;
  profileImage: string;
  role: string;
}

export interface LoginResponse extends MessageStatus {
  data: {
    token: string;
    user: User;
  };
}
