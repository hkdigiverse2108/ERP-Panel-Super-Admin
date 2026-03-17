export * from "./FormHelpers";
export * from "./DateFormatted";
export * from "./DateConfig";
export * from "./ValidationSchemas";
import { STORAGE_KEYS } from "../Constants";
import type { GridType, Params, SelectOptionType } from "../Types";

export const Stringify = (value: object): string => {
  try {
    return JSON.stringify(value);
  } catch {
    return "";
  }
};

export const Storage = localStorage;

export const getToken = () => {
  const token = Storage.getItem(STORAGE_KEYS.TOKEN);
  return token;
};

export const CleanParams = (params?: Params): Params | undefined => {
  if (!params) return undefined;

  return Object.fromEntries(Object.entries(params).filter(([, value]) => value !== undefined && value !== null && value !== ""));
};

export const GenerateOptions = (data?: { 
  _id: string; 
  name?: string; 
  productName?: string; 
  firstName?: string; 
  lastName?: string; 
  title?: string; 
  tabName?: string; 
  fullName?: string; 
  estimateNo?: string;
  salesOrderNo?: string;
  invoiceNo?: string;
  deliveryChallanNo?: string;
  orderNo?: string | null | undefined;
}[]) => {
  if (!data || !Array.isArray(data)) return [];

  return data.map((item) => {
    const label = item.name?.trim() || 
                 item.fullName?.trim() || 
                 item.productName?.trim() || 
                 item.estimateNo?.trim() || 
                 item.salesOrderNo?.trim() || 
                 item.invoiceNo?.trim() || 
                 item.deliveryChallanNo?.trim() || 
                 [item.firstName, item.lastName].filter(Boolean).join(" ") || 
                 item.title?.trim() || 
                 item.tabName?.trim() || 
                 item.orderNo?.trim() ||
                 "Unnamed";

    return {
      value: item._id,
      label,
    };
  });
};

export const CreateFilter = (label: string, filterKey: string, advancedFilter: Record<string, string[]>, updateAdvancedFilter: (key: string, value: string[]) => void, options: SelectOptionType[], isLoading?: boolean, grid?: GridType, multiple?: boolean, limitTags?: number) => ({
  label,
  options,
  value: advancedFilter[filterKey] || [],
  multiple,
  limitTags,
  onChange: (val: string[]) => updateAdvancedFilter(filterKey, val),
  grid,
  isLoading,
});

export const WithAllOption = <T extends { label: string; value: string }>(data: T[], allLabel = "All", allValue = ""): T[] => [{ label: allLabel, value: allValue } as T, ...data];

export const FormatPayment = (text?: string) =>
  text
    ? text
        .toLowerCase()
        .split("_")
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
        .join(" ")
    : "-";
