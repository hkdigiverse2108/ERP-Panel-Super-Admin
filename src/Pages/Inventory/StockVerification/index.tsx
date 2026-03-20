import { Box } from "@mui/material";
import { type GridRenderCellParams } from "@mui/x-data-grid";
import { useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { Mutations, Queries } from "../../../Api";
import { AdvancedSearch, CalculateGridSummary, CommonActionColumn, CommonBreadcrumbs, CommonCard, CommonDataGrid, CommonDataGridSummaryFooter, CommonDeleteModal, CommonObjectNameColumn } from "../../../Components/Common";
import { PAGE_TITLE, ROUTES } from "../../../Constants";
import { BREADCRUMBS, STOCK_VARIFICATION_STATUS } from "../../../Data";
import type { AppGridColDef, StockVerificationBase } from "../../../Types";
import { CreateFilter, FormatDate, GenerateOptions } from "../../../Utils";
import { useDataGrid, usePagePermission } from "../../../Utils/Hooks";

const StockVerification = () => {
  const { paginationModel, setPaginationModel, sortModel, setSortModel, filterModel, setFilterModel, rowToDelete, setRowToDelete, params, advancedFilter, updateAdvancedFilter } = useDataGrid({ active: false });

  const navigate = useNavigate();
  const permission = usePagePermission(PAGE_TITLE.INVENTORY.STOCK_VERIFICATION.BASE);

  const { data: stockVerificationData, isLoading: stockVerificationDataLoading, isFetching: stockVerificationDataFetching } = Queries.useGetStockVerification(params);
  const { data: CompanyData, isLoading: CompanyDataLoading } = Queries.useGetCompanyDropdown();
  const { mutate: deleteStockVerificationMutate, isPending: isDeleteLoading } = Mutations.useDeleteStockVerification();

  const allStock = useMemo(() => stockVerificationData?.data?.stockVerification_data.map((emp) => ({ ...emp, id: emp?._id })) || [], [stockVerificationData]);
  const totalRows = stockVerificationData?.data?.totalData || 0;

  const handleAdd = () => navigate(ROUTES.STOCK_VERIFICATION.ADD_EDIT);

  const handleDeleteBtn = () => {
    if (!rowToDelete) return;
    deleteStockVerificationMutate(rowToDelete?._id as string, { onSuccess: () => setRowToDelete(null) });
  };

  const columns: AppGridColDef<StockVerificationBase>[] = [
    CommonObjectNameColumn("companyId", { headerName: "Company Name", width: 200 }),
    { field: "stockVerificationNo", headerName: "Stock Verification No.", flex: 1, minWidth: 200 },
    { field: "createdAt", headerName: "Stock Verification Date", flex: 1, minWidth: 200, renderCell: (params) => FormatDate(params.row.createdAt) },
    { field: "totalProducts", headerName: "Total Products", width: 200 },
    { field: "totalPhysicalQty", headerName: "Total Physical Qty", width: 200 },
    { field: "totalDifferenceAmount", headerName: "Difference Amount", width: 200 },
    { field: "status", headerName: "Status", headerAlign: "center", width: 110, renderCell: (params) => <span className={`status-${params.row.status}`}>{params.row.status}</span> },
    ...(permission?.edit || permission?.delete
      ? [
          {
            ...CommonActionColumn<StockVerificationBase>({
              ...(permission?.edit && { editRoute: ROUTES.STOCK_VERIFICATION.ADD_EDIT }),
              ...(permission?.delete && { onDelete: (row) => setRowToDelete({ _id: row._id, title: row.stockVerificationNo }) }),
            }),
            renderCell: (params: GridRenderCellParams<StockVerificationBase>) =>
              params.row.status === "pending"
                ? CommonActionColumn<StockVerificationBase>({
                    ...(permission?.edit && { editRoute: ROUTES.STOCK_VERIFICATION.ADD_EDIT }),
                    ...(permission?.delete && { onDelete: (row) => setRowToDelete({ _id: row._id, title: row.stockVerificationNo }) }),
                  }).renderCell?.(params)
                : "-",
          },
        ]
      : []),
  ];

  const summary = useMemo(() => {
    return CalculateGridSummary(allStock, ["totalProducts", "totalPhysicalQty", "totalDifferenceAmount"]);
  }, [allStock]);

  const CommonDataGridOption = {
    columns,
    rows: allStock,
    rowCount: totalRows,
    loading: stockVerificationDataLoading || stockVerificationDataFetching,
    ...(permission?.add && { handleAdd }),
    paginationModel,
    onPaginationModelChange: setPaginationModel,
    sortModel,
    onSortModelChange: setSortModel,
    filterModel,
    onFilterModelChange: setFilterModel,
    slots: {
      bottomContainer: () => <CommonDataGridSummaryFooter summary={summary} />,
    },
  };

  const filter = [
    CreateFilter("Select Company", "companyFilter", advancedFilter, updateAdvancedFilter, GenerateOptions(CompanyData?.data), CompanyDataLoading, { xs: 12, sm: 6, md: 3 }), //
    CreateFilter("Select Status", "statusFilter", advancedFilter, updateAdvancedFilter, STOCK_VARIFICATION_STATUS, false, { xs: 12, sm: 6, md: 3 }),
  ];

  return (
    <>
      <CommonBreadcrumbs title={PAGE_TITLE.INVENTORY.STOCK_VERIFICATION.BASE} maxItems={1} breadcrumbs={BREADCRUMBS.STOCK_VERIFICATION.BASE} />
      <Box sx={{ p: { xs: 2, md: 3 }, display: "grid", gap: 2 }}>
        <AdvancedSearch filter={filter} />
        <CommonCard hideDivider>
          <CommonDataGrid {...CommonDataGridOption} />
        </CommonCard>
        <CommonDeleteModal open={Boolean(rowToDelete)} itemName={rowToDelete?.title} loading={isDeleteLoading} onClose={() => setRowToDelete(null)} onConfirm={() => handleDeleteBtn()} />
      </Box>
    </>
  );
};

export default StockVerification;
