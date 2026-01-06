import type { GridValidRowModel } from "@mui/x-data-grid";
import type { AppGridColDef, PhoneNumberType } from "../../../Types";

const CommonPhoneColumns = <T extends GridValidRowModel & { phoneNo?: PhoneNumberType }>(options?: { headerName?: string; width?: number }): AppGridColDef<T> => ({
  field: "phoneNo",
  headerName: options?.headerName ?? "Phone No",
  width: options?.width ?? 150,

  // ✅ UI display
  renderCell: (params) => {
    const phone = params?.row?.phoneNo;
    return phone ? `+${phone.countryCode} ${phone.phoneNo}` : "-";
  },

  // ✅ Export (PDF / Excel / CSV)
  exportFormatter: (value) => {
    const phone = value as PhoneNumberType | null;
    return phone ? `+${phone.countryCode} ${phone.phoneNo}` : "-";
  },
});

export default CommonPhoneColumns;
