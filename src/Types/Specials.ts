import type { CommonDataType } from "./Common";

export interface SpecialsBase extends CommonDataType {
  name: string;
  price: number;
  image: string | null;
  description?: string;
}

export interface SpecialsApiResponse {
  data: {
    specials_data: SpecialsBase[];
    totalData: number;
    state: {
      page: number;
      limit: number;
      totalPages: number;
    };
  };
  message: string;
}

export interface AddSpecialPayload {
  name: string;
  price: number;
  image: string | null;
}

export interface EditSpecialPayload extends Partial<AddSpecialPayload> {
  specialId: string;
  isActive?: boolean;
}

export interface SpecialsFormValues {
  name: string;
  price: number | "";
  image: string | null;
  description: string;
  isActive: boolean;
}
