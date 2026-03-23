import type { GridValidRowModel } from "@mui/x-data-grid";
import type { AppGridColDef, ColumnFormatType, CommonObjectNameColumnOptions, PhoneNumberType } from "../../../Types";
import { FormatCountryCode, FormatDate, FormatDateTime, FormatPayment } from "../../../Utils";

// Common Object Name Column
export const CommonObjectNameColumn = <T extends GridValidRowModel>(field: string, options?: CommonObjectNameColumnOptions): AppGridColDef<T> => ({
  field,
  headerName: options?.headerName ?? field,
  width: options?.width,
  flex: options?.flex,
  minWidth: options?.minWidth,

  // ✅ UI display
  renderCell: ({ value }) => (typeof value === "object" && value !== null ? value?.name || "-" : value || "-"),

  // ✅ Export (PDF / Excel / CSV)
  exportFormatter: (value) => (typeof value === "object" && value !== null ? (value as { name?: string })?.name || "-" : "-"),
});

// Common Phone Columns (dynamic - any phone field)
export const CommonPhoneColumns = <T extends GridValidRowModel, K extends keyof T = keyof T>(field?: K, options?: { headerName?: string; width?: number }): AppGridColDef<T> => {
  const colField = (field ?? ("phoneNo" as K)) as string;

  return {
    field: colField,
    headerName: options?.headerName ?? "Phone No",
    width: options?.width ?? 150,

    // ✅ UI display
    renderCell: (params) => {
      const phone = params.row?.[colField] as PhoneNumberType | undefined;
      return phone ? `+${phone.countryCode} ${phone.phoneNo}` : "-";
    },

    // ✅ Export (PDF / Excel / CSV)
    exportFormatter: (value) => {
      const phone = value as PhoneNumberType | null | undefined;
      if (!phone || typeof phone !== "object") return "-";
      return phone.countryCode && phone.phoneNo ? `${FormatCountryCode(phone.countryCode)} ${phone.phoneNo}` : "-";
    },
  };
};

const getNestedValue = (obj: any, path: string) => {
  return path.split(".").reduce((acc, key) => acc?.[key], obj);
};
const formatValues = (values: (string | number)[], type?: ColumnFormatType): string => {
  if (!values.length) return "-";

  const value = values[0]; // for date types we use first value

  switch (type) {
    case "phone": {
      const [code, number] = values;
      if (!code || !number) return "-";
      return `${FormatCountryCode(code.toString())} ${number}`;
    }

    case "date":
      return value ? FormatDate(value) : "-";

    case "datetime":
      return value ? FormatDateTime(value) : "-";

    case "format":
      return value ? FormatPayment(value.toString()) : "-";

    case "status":
      return value ? FormatPayment(value.toString()) : "-";

    default:
      return values.join(" ");
  }
};

export const CommonObjectPropertyColumn = <T extends GridValidRowModel>(field: string, sourceField: string, properties: string[], options?: CommonObjectNameColumnOptions): AppGridColDef<T> => ({
  field,
  headerName: options?.headerName ?? field,
  width: options?.width,
  flex: options?.flex,
  minWidth: options?.minWidth,

  valueGetter: (_value, row: any): string => {
    const obj = getNestedValue(row, sourceField);

    // ✅ HANDLE direct value (string/date)
    if (typeof obj === "string" || typeof obj === "number") {
      return formatValues([obj], options?.type);
    }

    if (typeof obj !== "object" || obj === null) return "-";

    const values = properties.map((prop) => obj?.[prop]).filter((val) => typeof val === "string" || typeof val === "number");

    return formatValues(values, options?.type);
  },

  renderCell: ({ value }) => {
    if (options?.type === "status") {
      const formatted = value?.toString().toLowerCase().replace(/\s/g, "_")||"";
      return <span className={`status-${formatted}`}>{value}</span>;
    }

    return String(value ?? "-");
  },

  exportFormatter: (_value, row: any) => {
    const obj = getNestedValue(row, sourceField);

    // ✅ HANDLE direct value
    if (typeof obj === "string" || typeof obj === "number") {
      return formatValues([obj], options?.type);
    }

    if (typeof obj !== "object" || obj === null) return "-";

    const values = properties.map((prop) => obj?.[prop]).filter((val) => typeof val === "string" || typeof val === "number");

    return formatValues(values, options?.type);
  },
});
