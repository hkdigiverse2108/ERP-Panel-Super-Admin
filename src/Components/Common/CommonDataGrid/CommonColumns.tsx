import type { GridValidRowModel } from "@mui/x-data-grid";
import type { AppGridColDef, CommonObjectNameColumnOptions, PhoneNumberType } from "../../../Types";

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
      const phone = value as PhoneNumberType | null;
      return phone ? `+${phone.countryCode} ${phone.phoneNo}` : "-";
    },
  };
};

export const CommonObjectPropertyColumn = <T extends GridValidRowModel>(field: string, sourceField: string, property: string, options?: CommonObjectNameColumnOptions): AppGridColDef<T> => ({
  field,
  headerName: options?.headerName ?? field,
  width: options?.width,
  flex: options?.flex,
  minWidth: options?.minWidth,

  valueGetter: (_value, row: any): string | number => {
    const obj = row?.[sourceField];
    const val = typeof obj === "object" && obj !== null ? obj?.[property] : "-";
    return typeof val === "string" || typeof val === "number" ? val : "-";
  },

  renderCell: ({ value }) => String(value ?? "-"),

  // ✅ THIS IS THE IMPORTANT PART
  exportFormatter: (_value, row: any) => {
    const obj = row?.[sourceField];
    const val = typeof obj === "object" && obj !== null ? obj?.[property] : "-";
    return typeof val === "string" || typeof val === "number" ? val : "-";
  },
});
