import { STORAGE_KEYS } from "../Constants";

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
