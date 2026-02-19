import type { CommonDataType, MessageStatus, PageStatus } from "./Common";

export interface CouponFormValues {
  couponPrice?: number;
  companyId?: string;
  endDate?: string;
  expiryDays?: number;
  isActive?: boolean;
  name?: string;
  redeemValue?: number;
  redemptionType?: string;
  singleTimeUse?: boolean;
  startDate?: string;
  status?: string;
  usageLimit?: number;
  usedCount?: number;
  _submitAction?: string;
}

export type AddCouponPayload = CouponFormValues;

export type EditCouponPayload = AddCouponPayload & { couponId: string };

import type { CompanyBase } from "./Company";

export interface CouponBase extends Omit<CouponFormValues, "companyId">, CommonDataType {
  companyId: string | CompanyBase;
}

export interface CouponDataResponse extends PageStatus {
  coupon_data: CouponBase[];
}

export interface CouponApiResponse extends MessageStatus {
  data: CouponDataResponse;
}

export interface CouponDropdownApiResponse extends MessageStatus {
  data: CouponBase[];
}

export interface ApplyCouponPayload {
  couponId: string;
  totalAmount: number;
  customerId: string;
}
