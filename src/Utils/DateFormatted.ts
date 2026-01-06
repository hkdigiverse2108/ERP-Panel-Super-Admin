import dayjs from "dayjs";

export const FormatDate = (dateInput: any | Date): string => {
  return dayjs(dateInput).isValid() ? dayjs(dateInput).format("DD/MM/YYYY") : "";
};

export const FormatTime = (dateInput: any | Date): string => {
  return dayjs(dateInput).isValid() ? dayjs(dateInput).format("hh:mm A") : "";
};

export const FormatDateTime = (dateInput: any | Date): string => {
  return dayjs(dateInput).isValid() ? dayjs(dateInput).format("DD/MM/YYYY hh:mm A") : "";
};
