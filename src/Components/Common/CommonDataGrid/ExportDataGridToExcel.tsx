import type { GridValidRowModel } from "@mui/x-data-grid";
import { saveAs } from "file-saver";
import * as XLSX from "xlsx-js-style";
import type { AppGridColDef } from "../../../Types";

export const ExportDataGridToExcel = <T extends GridValidRowModel>({ columns, rows, fileName = "data", title = "Report" }: { columns: AppGridColDef<T>[]; rows: readonly T[]; fileName?: string; title?: string }) => {
  const exportableColumns = columns.filter((col) => !col.disableExport && col.field !== "actions");

  /* ---------------------------------- */
  /* Headers & Rows                     */
  /* ---------------------------------- */
  const headers = exportableColumns.map((col) => col.headerName ?? col.field);

  const dataRows = rows.map((row, index) =>
    exportableColumns.map((col) => {
      if (col.field === "srNo") return index + 1;

      const raw = (row as Record<string, unknown>)[col.field];
      if (typeof col.exportFormatter === "function") {
        return col.exportFormatter(raw, row);
      }
      return raw ?? "-";
    }),
  );

  const sheetData = [[title], headers, ...dataRows];
  const worksheet = XLSX.utils.aoa_to_sheet(sheetData);

  /* ---------------------------------- */
  /* Merge title                        */
  /* ---------------------------------- */
  worksheet["!merges"] = [
    {
      s: { r: 0, c: 0 },
      e: { r: 0, c: headers.length - 1 },
    },
  ];

  /* ---------------------------------- */
  /* Column width                       */
  /* ---------------------------------- */
  worksheet["!cols"] = headers.map((h, i) => ({
    wch: Math.min(Math.max(h.length, ...dataRows.map((r) => String(r[i] ?? "").length)) + 4, 30),
  }));

  /* ---------------------------------- */
  /* Title style                        */
  /* ---------------------------------- */
  worksheet["A1"].s = {
    font: { bold: true, sz: 14 },
    alignment: { horizontal: "center", vertical: "center" },
  };

  worksheet["!rows"] = [{ hpt: 30 }];

  /* ---------------------------------- */
  /* Header style                       */
  /* ---------------------------------- */
  headers.forEach((_, i) => {
    const ref = XLSX.utils.encode_cell({ r: 1, c: i });
    worksheet[ref].s = {
      font: { bold: true },
      alignment: { horizontal: "center" },
      border: {
        bottom: { style: "thin" },
      },
    };
  });

  /* ---------------------------------- */
  /* Workbook                           */
  /* ---------------------------------- */
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, "Sheet1");

  const buffer = XLSX.write(workbook, {
    type: "array",
    bookType: "xlsx",
  });

  saveAs(
    new Blob([buffer], {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    }),
    `${fileName}.xlsx`,
  );
};
