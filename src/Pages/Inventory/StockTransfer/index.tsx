import { useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { type GridRenderCellParams } from "@mui/x-data-grid";
import { Mutations, Queries } from "../../../Api";
import { AdvancedSearch, CommonActionColumn, CommonBreadcrumbs, CommonCard, CommonDataGrid, CommonDeleteModal } from "../../../Components/Common";
import { PAGE_TITLE, ROUTES } from "../../../Constants";
import type { AppGridColDef, StockTransferBase } from "../../../Types";
import { CreateFilter, GenerateOptions } from "../../../Utils";
import { BREADCRUMBS, STOCK_TRANSFER_STATUS, STOCK_TRANSFER_STATUS_OPTIONS, STOCK_TRANSFER_TYPE_OPTIONS } from "../../../Data";
import { Box } from "@mui/material";
import { useDataGrid, usePagePermission } from "../../../Utils/Hooks";
import { CommonObjectPropertyColumn } from "../../../Components/Common/CommonDataGrid/CommonColumns";

const StockTransfer = () => {
  const { paginationModel, setPaginationModel, sortModel, setSortModel, filterModel, setFilterModel, rowToDelete, setRowToDelete, isActive, setActive, params, advancedFilter, updateAdvancedFilter } = useDataGrid();
  const navigate = useNavigate();
  const permission = usePagePermission(PAGE_TITLE.INVENTORY.STOCK_TRANSFER.BASE);

  const { refetch: fetchAll, isFetching: AllFetching, isLoading: AllLoading } = Queries.useGetStockTransfer({}, false);
  const { data: stockTransferData, isLoading: stockTransferLoading, isFetching: stockTransferFetching } = Queries.useGetStockTransfer(params);
  const { mutate: deleteStockTransferMutate } = Mutations.useDeleteStockTransfer();
  const { mutate: editStockTransfer } = Mutations.useEditStockTransfer();

  // Filter Data Queries
  const { data: companyData, isLoading: companyDataLoading } = Queries.useGetCompanyDropdown();
  const companyId = advancedFilter?.companyFilter?.[0];
  const { data: branchData, isLoading: branchDataLoading } = Queries.useGetBranchDropdown({ companyFilter: companyId }, !!companyId);

  const allStockTransfers = useMemo(
    () =>
      stockTransferData?.data?.stock_transfer?.map((item) => ({
        ...item,
        id: item._id,
      })) || [],
    [stockTransferData],
  );

  const totalRows = stockTransferData?.data?.totalData || 0;

  const handleDeleteBtn = () => {
    if (!rowToDelete) return;
    deleteStockTransferMutate(rowToDelete?._id as string, { onSuccess: () => setRowToDelete(null) });
  };

  const handleAdd = () => navigate(ROUTES.STOCK_TRANSFER.ADD_EDIT);

  const columns: AppGridColDef<StockTransferBase>[] = [
    { field: "transferNo", headerName: "Transfer No.", flex: 1, minWidth: 150 },
    CommonObjectPropertyColumn<StockTransferBase>("companyId", "companyId", ["name"], { headerName: "Company", flex: 1, minWidth: 150 }),
    CommonObjectPropertyColumn<StockTransferBase>("requestedByBranchId", "requestedByBranchId", ["name"], { headerName: "From Branch", flex: 1, minWidth: 150 }),
    CommonObjectPropertyColumn<StockTransferBase>("requestedToBranchId", "requestedToBranchId", ["name"], { headerName: "To Branch", flex: 1, minWidth: 150 }),
    CommonObjectPropertyColumn<StockTransferBase>("status", "status", [], { headerName: "Status", width: 150, type: "status" }),
    CommonObjectPropertyColumn<StockTransferBase>("createdBy", "createdBy", ["fullName"], { headerName: "Requested By", flex: 1, minWidth: 150 }),
    // CommonObjectPropertyColumn<StockTransferBase>("requestNote", "requestNote", [], { headerName: "Request Note", flex: 1, minWidth: 200 }),
    CommonObjectPropertyColumn<StockTransferBase>("createdAt", "createdAt", [], { headerName: "Requested Date", flex: 1, minWidth: 150, type: "datetime" }),
    CommonObjectPropertyColumn<StockTransferBase>("approvedBy", "approvedBy", ["fullName"], { headerName: "Approved By", flex: 1, minWidth: 150 }),
    // CommonObjectPropertyColumn<StockTransferBase>("approvalNote", "approvalNote", [], { headerName: "Approval Note", flex: 1, minWidth: 200 }),
    CommonObjectPropertyColumn<StockTransferBase>("approvedAt", "approvedAt", [], { headerName: "Approved Date", flex: 1, minWidth: 150, type: "datetime" }),
    CommonObjectPropertyColumn<StockTransferBase>("receivedBy", "receivedBy", ["fullName"], { headerName: "Received By", flex: 1, minWidth: 150 }),
    // CommonObjectPropertyColumn<StockTransferBase>("receiptNote", "receiptNote", [], { headerName: "Receive Note", flex: 1, minWidth: 200 }),
    CommonObjectPropertyColumn<StockTransferBase>("receivedAt", "receivedAt", [], { headerName: "Received Date", flex: 1, minWidth: 150, type: "datetime" }),

    ...(permission?.edit || permission?.delete
      ? [
          {
            ...CommonActionColumn<StockTransferBase>({
              ...(permission?.edit && {
                active: (row) => editStockTransfer({ stockTransferId: row?._id, isActive: !row.isActive }),
                editRoute: ROUTES.STOCK_TRANSFER.ADD_EDIT,
                viewRoute: ROUTES.STOCK_TRANSFER.VIEW,
              }),
              ...(permission?.delete && { onDelete: (row) => setRowToDelete({ _id: row?._id, title: row?.transferNo }) }),
            }),
            renderCell: (params: GridRenderCellParams<StockTransferBase>) =>
              params.row.status === STOCK_TRANSFER_STATUS.PENDING
                ? CommonActionColumn<StockTransferBase>({
                    ...(permission?.edit && {
                      active: (row) => editStockTransfer({ stockTransferId: row?._id, isActive: !row.isActive }),
                      editRoute: ROUTES.STOCK_TRANSFER.ADD_EDIT,
                      viewRoute: ROUTES.STOCK_TRANSFER.VIEW,
                    }),
                    ...(permission?.delete && { onDelete: (row) => setRowToDelete({ _id: row?._id, title: row?.transferNo }) }),
                  }).renderCell?.(params)
                : CommonActionColumn<StockTransferBase>({ viewRoute: ROUTES.STOCK_TRANSFER.VIEW }).renderCell?.(params),
          },
        ]
      : []),
  ];

  const CommonDataGridOption = {
    columns,
    rows: allStockTransfers,
    rowCount: totalRows,
    loading: stockTransferLoading || stockTransferFetching,
    isActive,
    setActive,
    ...(permission?.add && { handleAdd: handleAdd }),
    paginationModel,
    onPaginationModelChange: setPaginationModel,
    sortModel,
    onSortModelChange: setSortModel,
    filterModel,
    onFilterModelChange: setFilterModel,
    fileName: PAGE_TITLE.INVENTORY.STOCK_TRANSFER.BASE,
    onExportAll: { onExportAll: fetchAll, isFetching: AllLoading || AllFetching },
  };

  const filter = [CreateFilter("Select Company", "companyFilter", advancedFilter, updateAdvancedFilter, GenerateOptions(companyData?.data), companyDataLoading, { xs: 12, sm: 6, md: 3 }), CreateFilter("Select Branch", "branchFilter", advancedFilter, updateAdvancedFilter, GenerateOptions(branchData?.data), branchDataLoading, { xs: 12, sm: 6, md: 3 }), CreateFilter("Select Type", "typeFilter", advancedFilter, updateAdvancedFilter, STOCK_TRANSFER_TYPE_OPTIONS, false, { xs: 12, sm: 6, md: 3 }), CreateFilter("Select Status", "statusFilter", advancedFilter, updateAdvancedFilter, STOCK_TRANSFER_STATUS_OPTIONS, false, { xs: 12, sm: 6, md: 3 })];

  return (
    <>
      <CommonBreadcrumbs title={PAGE_TITLE.INVENTORY.STOCK_TRANSFER.BASE} maxItems={1} breadcrumbs={BREADCRUMBS.STOCK_TRANSFER.BASE} />
      <Box sx={{ p: { xs: 2, md: 3 }, display: "grid", gap: 2 }}>
        <AdvancedSearch filter={filter} />
        <CommonCard hideDivider>
          <CommonDataGrid {...CommonDataGridOption} />
        </CommonCard>
        <CommonDeleteModal open={Boolean(rowToDelete)} itemName={rowToDelete?.title} onClose={() => setRowToDelete(null)} onConfirm={() => handleDeleteBtn()} />
      </Box>
    </>
  );
};

export default StockTransfer;
