import type { GridValidRowModel } from "@mui/x-data-grid";
import { saveAs } from "file-saver";
import * as XLSX from "xlsx";
import type { ExportToExcelProps } from "../../../Types";

export const ExportDataGridToExcel = <T extends GridValidRowModel>({ columns, rows, fileName = "data.xlsx" }: ExportToExcelProps<T>): void => {
  const exportableColumns = columns.filter((col) => !col.disableExport && col.field !== "actions");

  const excelData: Record<string, unknown>[] = rows.map((row, index) => {
    const record: Record<string, unknown> = {};

    exportableColumns.forEach((col) => {
      const header = col.headerName ?? col.field;

      if (col.field === "srNo") {
        record[header] = index + 1;
        return;
      }

      const rawValue = (row as Record<string, unknown>)[col.field];

      if ("exportFormatter" in col && typeof col.exportFormatter === "function") {
        record[header] = col.exportFormatter(rawValue, row);
      } else {
        record[header] = rawValue ?? "";
      }
    });

    return record;
  });

  const worksheet = XLSX.utils.json_to_sheet(excelData);
  const workbook = XLSX.utils.book_new();

  XLSX.utils.book_append_sheet(workbook, worksheet, "Sheet1");

  const excelBuffer = XLSX.write(workbook, {
    bookType: "xlsx",
    type: "array",
  });

  saveAs(
    new Blob([excelBuffer], {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    }),
    fileName
  );
};
