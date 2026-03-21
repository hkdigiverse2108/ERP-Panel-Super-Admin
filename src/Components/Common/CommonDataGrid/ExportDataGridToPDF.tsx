import type { GridValidRowModel } from "@mui/x-data-grid";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import type { ExportToPDFProps } from "../../../Types";
import { Title } from "../../../Constants";

/* -------------------------------------------------------
   Helper: Normalize any value to PDF-safe output
------------------------------------------------------- */
const normalizeExportValue = (value: unknown): string | number => {
  if (typeof value === "number") return value;
  if (typeof value === "string") return value;
  if (value instanceof Date) return value.toLocaleDateString();
  if (value === null || value === undefined) return "-";
  return String(value);
};

/* -------------------------------------------------------
   Export Function
------------------------------------------------------- */
export const ExportDataGridToPDF = <T extends GridValidRowModel>({ columns, rows, fileName = "data.pdf", title = "", user }: ExportToPDFProps<T>): void => {
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
    }),
  );

  /* -----------------------------------------------
   Summary Row Calculation
----------------------------------------------- */
  const hasSummary = exportableColumns.some((col) => (col as any).isSummary);
  const summaryRow: (string | number)[] | null = hasSummary
    ? exportableColumns.map((col, colIndex) => {
        if (colIndex === 0) return "Total";

        if ((col as any).isSummary) {
          const total = rows.reduce((sum, row) => {
            const value = (row as Record<string, unknown>)[col.field];

            if (typeof value === "number") return sum + value;
            if (!isNaN(Number(value))) return sum + Number(value);

            return sum;
          }, 0);

          return total;
        }

        return "";
      })
    : null;

  /* -----------------------------------------------
     PDF Table
  ----------------------------------------------- */
  autoTable(doc, {
    head: [tableHeaders],
    body: tableRows,
    ...(summaryRow && { foot: [summaryRow] }),

    startY: 60,
    margin: { top: 20, bottom: 30, left: 20, right: 20 },

    styles: { fontSize: 10 },
    headStyles: { fillColor: "#e0e0e0", fontSize: 10, fontStyle: "normal", textColor: "#000000" },
    footStyles: { fillColor: "#f5f5f5", textColor: "#000", fontStyle: "bold" },

    didDrawPage: (data) => {
      const pageNumber = doc.getNumberOfPages();
      const pageWidth = doc.internal.pageSize.getWidth();
      const pageHeight = doc.internal.pageSize.getHeight();

      /* ---------------- HEADER (ONLY FIRST PAGE) ---------------- */
      if (pageNumber === 1) {
        doc.setFontSize(14);
        doc.text(title, pageWidth / 2, 30, { align: "center" });

        if (user) {
          doc.setFontSize(10);
          doc.text(`Exported by: ${user}`, pageWidth / 2, 48, {
            align: "center",
          });
        }

        data.settings.margin.top = 20;
      } else {
        data.settings.margin.top = 20;
      }

      /* ---------------- FOOTER (ALL PAGES) ---------------- */
      doc.setFontSize(10);

      // Left
      // doc.text(`Email: ${email}`, 40, pageHeight - 20);

      // Center (Page number)
      doc.text(`${pageNumber}`, pageWidth / 2, pageHeight - 20, {
        align: "center",
      });

      // Right
      doc.text(`Powered By: ${Title}`, pageWidth - 40, pageHeight - 20, {
        align: "right",
      });
    },
  });
  doc.save(fileName + ".pdf");
};
