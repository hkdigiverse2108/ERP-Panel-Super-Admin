import { Box } from "@mui/material";
import { GridFooterContainer, gridVisibleColumnDefinitionsSelector, useGridApiContext, useGridSelector } from "@mui/x-data-grid";

export const CommonDataGridSummaryFooter = ({ summary, label = "Total" }: { summary: Record<string, string | number>; label?: string }) => {
  const apiRef = useGridApiContext();
  const visibleColumns = useGridSelector(apiRef, gridVisibleColumnDefinitionsSelector);
  return (
    <GridFooterContainer sx={{ overflowX: "auto", px: 0, width: "fit-content" }}>
      <Box sx={{ display: "flex", minWidth: "max-content" }}>
        {visibleColumns.map((col, index) => (
          <Box key={col.field} sx={{ width: col.computedWidth, px: 1, py: 1, fontWeight: 600, whiteSpace: "nowrap", textAlign: col.type === "number" ? "right" : "left" }}>
            {index === 0 ? label : (summary[col.field] ?? "")}
          </Box>
        ))}
      </Box>
    </GridFooterContainer>
  );
};

export const CalculateGridSummary = <T extends Record<string, any>>(rows: T[], fields: (keyof T)[]): Record<string, number> => {
  return rows.reduce(
    (acc, row) => {
      fields.forEach((field) => {
        acc[field as string] = (acc[field as string] || 0) + Number(row[field] || 0);
      });
      return acc;
    },
    {} as Record<string, number>,
  );
};
