import type { GridValidRowModel } from "@mui/x-data-grid";
import { saveAs } from "file-saver";
import * as XLSX from "xlsx-js-style";
import type { AppGridColDef } from "../../../Types";

export const ExportDataGridToExcel = <T extends GridValidRowModel>({ columns, rows, fileName = "data", title = "Report", companyName }: { columns: AppGridColDef<T>[]; rows: readonly T[]; fileName?: string; title?: string; companyName?: string }) => {
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

  /* ---------------------------------- */
  /* Summary Row                        */
  /* ---------------------------------- */
  const hasSummary = exportableColumns.some((col) => (col as any).isSummary);
  const getNestedValue = (obj: any, path: string) => {
    return path.split(".").reduce((acc, key) => acc?.[key], obj);
  };

  const summaryRow: (string | number)[] | null = hasSummary
    ? exportableColumns.map((col, colIndex) => {
        if (colIndex === 0) return "Total";

        if ((col as any).isSummary) {
          const total = rows.reduce((sum, row) => {
            const value = getNestedValue(row, col.field);

            if (typeof value === "number") return sum + value;
            if (!isNaN(Number(value))) return sum + Number(value);

            return sum;
          }, 0);

          return total.toFixed(2);
        }

        return "";
      })
    : null;

  /* ---------------------------------- */
  /* Sheet Data (Title + Subtitle)      */
  /* ---------------------------------- */
  const sheetData = [
    [companyName],
    [title], // subtitle
    headers,
    ...dataRows,
    ...(summaryRow ? [summaryRow] : []),
  ];

  const worksheet = XLSX.utils.aoa_to_sheet(sheetData);

  /* ---------------------------------- */
  /* Merge Title & Subtitle             */
  /* ---------------------------------- */
  worksheet["!merges"] = [
    { s: { r: 0, c: 0 }, e: { r: 0, c: headers.length - 1 } },
    { s: { r: 1, c: 0 }, e: { r: 1, c: headers.length - 1 } },
  ];

  /* ---------------------------------- */
  /* Column Width                       */
  /* ---------------------------------- */
  worksheet["!cols"] = headers.map((h, i) => ({
    wch: Math.min(Math.max(h.length, ...dataRows.map((r) => String(r[i] ?? "").length)) + 4, 30),
  }));

  /* ---------------------------------- */
  /* Row Heights                        */
  /* ---------------------------------- */
  worksheet["!rows"] = [
    { hpt: 28 }, // title
    { hpt: 22 }, // subtitle
    { hpt: 20 }, // header
  ];

  /* ---------------------------------- */
  /* Title Style                        */
  /* ---------------------------------- */
  if (worksheet["A1"]) {
    worksheet["A1"].s = {
      font: { bold: true, sz: 16 },
      alignment: { horizontal: "center", vertical: "center" },
    };
  }

  /* ---------------------------------- */
  /* Subtitle Style                     */
  /* ---------------------------------- */
  if (worksheet["A2"]) {
    worksheet["A2"].s = {
      font: { bold: true, sz: 12 },
      alignment: { horizontal: "center", vertical: "center" },
    };
  }

  /* ---------------------------------- */
  /* Header Style                       */
  /* ---------------------------------- */
  headers.forEach((_, i) => {
    const ref = XLSX.utils.encode_cell({ r: 2, c: i });

    if (worksheet[ref]) {
      worksheet[ref].s = {
        font: { bold: true },
        alignment: { horizontal: "center", vertical: "center" },
        fill: {
          fgColor: { rgb: "E7E6E6" },
        },
        border: {
          top: { style: "thin" },
          bottom: { style: "thin" },
          left: { style: "thin" },
          right: { style: "thin" },
        },
      };
    }
  });

  /* ---------------------------------- */
  /* Data Cell Styling                  */
  /* ---------------------------------- */
  const startRow = 3;

  dataRows.forEach((row, rowIndex) => {
    row.forEach((_, colIndex) => {
      const ref = XLSX.utils.encode_cell({
        r: startRow + rowIndex,
        c: colIndex,
      });

      if (worksheet[ref]) {
        worksheet[ref].s = {
          alignment: {
            horizontal: colIndex === 0 ? "center" : "left",
            vertical: "center",
          },
          border: {
            top: { style: "thin" },
            bottom: { style: "thin" },
            left: { style: "thin" },
            right: { style: "thin" },
          },
        };
      }
    });
  });

  /* ---------------------------------- */
  /* Summary Row Styling                */
  /* ---------------------------------- */
  if (summaryRow) {
    const summaryRowIndex = 3 + dataRows.length;

    exportableColumns.forEach((_, colIndex) => {
      const ref = XLSX.utils.encode_cell({
        r: summaryRowIndex,
        c: colIndex,
      });

      if (worksheet[ref]) {
        worksheet[ref].s = {
          font: { bold: true },
          alignment: {
            horizontal: colIndex === 0 ? "left" : "right",
          },
          fill: {
            fgColor: { rgb: "F5F5F5" },
          },
          border: {
            top: { style: "thin" },
            bottom: { style: "thin" },
            left: { style: "thin" },
            right: { style: "thin" },
          },
        };
      }
    });
  }

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
