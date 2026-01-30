import type { GridColDef, GridValueGetter } from "@mui/x-data-grid";
import { DataGrid, useGridApiRef } from "@mui/x-data-grid";
import { useMemo, type FC } from "react";
import type { CommonDataGridProps } from "../../../Types";
import CustomToolbar from "./CustomToolbar";
import NoRowsOverlay from "./NoRowsOverlay";

const CommonDataGrid: FC<CommonDataGridProps> = ({ slots, slotProps, isExport, pagination, fileName, columns, rows, rowCount, loading = false, paginationModel, onPaginationModelChange, sortModel, onSortModelChange, filterModel, onFilterModelChange, defaultHidden = [], BoxClass, handleAdd, isActive, setActive }) => {
  const apiRef = useGridApiRef();

  const visibilityModel = useMemo(() => {
    const model: Record<string, boolean> = {};
    defaultHidden.forEach((col) => (model[col] = false));
    return model;
  }, [defaultHidden]);

  const withFallbackValueGetter = (col: GridColDef): GridColDef => {
    if (col.valueGetter) return col;
    const fallbackGetter: GridValueGetter = (value) => {
      if (value === null || value === undefined || value === "") return "-";
      return value;
    };
    return { ...col, valueGetter: fallbackGetter };
  };

  const columnsWithFallback = useMemo<GridColDef[]>(() => columns.map(withFallbackValueGetter), [columns]);

  const fixedColumns = useMemo<GridColDef[]>(() => {
    return [
      {
        field: "srNo",
        headerName: "Sr No",
        width: 90,
        sortable: false,
        filterable: false,
        valueGetter: (_value, row) => (paginationModel ? paginationModel?.page * paginationModel?.pageSize + rows.findIndex((r) => r.id === row.id) + 1 : rows.findIndex((r) => r.id === row.id) + 1),
      },
      ...columnsWithFallback,
    ];
  }, [columnsWithFallback, paginationModel, rows]);

  return (
    <div className={`${BoxClass} min-w-full overflow-auto`}>
      <DataGrid
        apiRef={apiRef}
        rows={rows}
        columns={fixedColumns}
        rowCount={rowCount}
        loading={loading}
        slots={{
          toolbar: () => <CustomToolbar filterModel={filterModel} onFilterModelChange={onFilterModelChange} isExport={isExport} fileName={fileName} apiRef={apiRef} columns={fixedColumns} rows={rows} rowCount={rowCount} handleAdd={handleAdd} isActive={isActive} setActive={setActive} />,
          noRowsOverlay: () => <NoRowsOverlay />,
          bottomContainer: (props) => <>{slots?.bottomContainer?.(props)}</>,
        }}
        slotProps={slotProps}
        showToolbar
        initialState={{
          columns: { columnVisibilityModel: visibilityModel },
        }}
        hideFooter={pagination === false}
        hideFooterPagination={pagination === false}
        paginationMode="server"
        paginationModel={paginationModel}
        onPaginationModelChange={onPaginationModelChange}
        pageSizeOptions={[5, 10, 50, 100]}
        sortingMode="client"
        sortModel={sortModel}
        onSortModelChange={onSortModelChange}
        filterMode="client"
        filterModel={filterModel}
        onFilterModelChange={onFilterModelChange}
        disableRowSelectionOnClick
        sx={{ "--DataGrid-overlayHeight": "300px" }}
      />
    </div>
  );
};

export default CommonDataGrid;
