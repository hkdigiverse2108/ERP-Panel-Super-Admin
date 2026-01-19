import type { CommonDataType, MessageStatus, PageStatus } from "./Common";

export interface LocationFormValues {
  code?: string;
  name?: string;
  type?: string;
  parentLocationId?: string;
  isActive?: boolean;
}

export type AddLocationPayload = LocationFormValues;

export type EditLocationPayload = AddLocationPayload & { LocationId?: string };


export interface LocationBase extends Omit<LocationFormValues, "parentLocationId">, CommonDataType {
  parentLocationId?: LocationBase 
}

export interface LocationDataResponse extends PageStatus {
  location_data: LocationBase[];
}

export interface LocationApiResponse extends MessageStatus {
  data: LocationDataResponse;
} 

export interface LocationDropdownApiResponse extends MessageStatus {
  data: LocationBase[];
}  
