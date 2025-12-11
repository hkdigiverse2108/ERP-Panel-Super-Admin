import type { CommonDataType, MessageStatus } from "./Common";

// ************ Login ***********
export interface LoginPayload {
  email: string;
  password: string;
}

export interface User extends LoginPayload, CommonDataType {
  _id: string;
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
