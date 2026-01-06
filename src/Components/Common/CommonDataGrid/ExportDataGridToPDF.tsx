import type { GridValidRowModel } from "@mui/x-data-grid";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import type { ExportToPDFProps } from "../../../Types";

/* -------------------------------------------------------
   Helper: Normalize any value to PDF-safe output
------------------------------------------------------- */
const normalizeExportValue = (value: unknown): string | number => {
  if (typeof value === "number") return value;
  if (typeof value === "string") return value;
  if (value instanceof Date) return value.toLocaleDateString();
  if (value === null || value === undefined) return "";
  return String(value);
};

/* -------------------------------------------------------
   Export Function
------------------------------------------------------- */
export const ExportDataGridToPDF = <T extends GridValidRowModel>({ columns, rows, fileName = "data.pdf" }: ExportToPDFProps<T>): void => {
  const doc = new jsPDF("l", "pt", "a4");

  /* -----------------------------------------------
     Filter exportable columns
  ----------------------------------------------- */
  const exportableColumns = columns.filter((col) => !col.disableExport && col.field !== "actions");

  /* -----------------------------------------------
     Table headers
  ----------------------------------------------- */
  const tableHeaders: string[] = exportableColumns.map((col) => col.headerName ?? col.field);

  /* -----------------------------------------------
     Table rows (TYPE-SAFE)
  ----------------------------------------------- */
  const tableRows: (string | number)[][] = rows.map((row, index) =>
    exportableColumns.map((col) => {
      if (col.field === "srNo") return index + 1;

      const rawValue = (row as Record<string, unknown>)[col.field];

   if ("exportFormatter" in col && typeof col.exportFormatter === "function") {
      return col.exportFormatter(rawValue, row);
    }

      return normalizeExportValue(rawValue);
    })
  );

  /* -----------------------------------------------
     PDF Table
  ----------------------------------------------- */
  autoTable(doc, {
    head: [tableHeaders],
    body: tableRows,
    startY: 40,
    styles: { fontSize: 9 },
    headStyles: { fillColor: [22, 160, 133] },
  });

  doc.save(fileName);
};
