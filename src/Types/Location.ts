import type { CommonDataType, MessageStatus, PageStatus } from "./Common";

export interface LocationFormValues {
  code?: string;
  name?: string;
  type?: string;
  parentId?: string;
  isActive?: boolean;
}

export type AddLocationPayload = LocationFormValues;

export type EditLocationPayload = AddLocationPayload & { locationId?: string };


export interface LocationBase extends Omit<LocationFormValues, "parentId">, CommonDataType {
  parentId?: LocationBase 
}

export interface LocationDataResponse extends PageStatus {
  location_data: LocationBase[];
}

export interface LocationApiResponse extends MessageStatus {
  data: LocationDataResponse;
} 

export interface CountryApiResponse extends MessageStatus {
  data: LocationBase[];
}  
