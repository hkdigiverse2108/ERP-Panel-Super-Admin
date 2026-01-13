export * from "./FormHelpers";
export * from "./DateFormatted";
export * from "./DateConfig";
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

export const GenerateOptions = (data?: { _id: string; name?: string; firstName?: string; lastName?: string; title?: string }[]) => {
  if (!data || !  Array.isArray(data)) return [];

  return data.map((item) => {
    const label = item.name?.trim() || [item.firstName, item.lastName].filter(Boolean).join(" ") || item.title?.trim() || "Unnamed";

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
