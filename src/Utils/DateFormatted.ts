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

export const FormatValidity = (_v: any, row: any): string => {
  const start = row?.startDateTime || row?.startDate || row?.campaignLaunchDate;
  const end = row?.endDateTime || row?.endDate || row?.campaignExpiryDate;
  const hasEnd = row?.hasEndDate !== undefined ? row?.hasEndDate : !!end;

  const formattedStart = FormatDate(start);
  const formattedEnd = hasEnd ? FormatDate(end) : "No End Date";
  return `${formattedStart || "N/A"} - ${formattedEnd || "No End Date"}`;
};
