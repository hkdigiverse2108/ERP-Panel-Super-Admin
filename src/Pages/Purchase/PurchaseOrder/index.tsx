import { Box, Grid } from "@mui/material";
import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Mutations, Queries } from "../../../Api";
import { AdvancedSearch, CalculateGridSummary, CommonActionColumn, CommonBreadcrumbs, CommonCard, CommonDataGrid, CommonDataGridSummaryFooter, CommonDeleteModal, CommonStatsCard } from "../../../Components/Common";
import { PAGE_TITLE, ROUTES } from "../../../Constants";
import { BREADCRUMBS, ORDER_STATUS } from "../../../Data";
import type { AppGridColDef, PurchaseOrderBase } from "../../../Types";
import { useDataGrid } from "../../../Utils/Hooks";
import { CreateFilter, DateConfig, GenerateOptions } from "../../../Utils";
import { CommonObjectPropertyColumn } from "../../../Components/Common/CommonDataGrid/CommonColumns";
import type { GridRenderCellParams } from "@mui/x-data-grid";
import { CommonDateRangeSelector } from "../../../Attribute";

const PurchaseOrder = () => {
  const { paginationModel, setPaginationModel, sortModel, setSortModel, filterModel, setFilterModel, rowToDelete, setRowToDelete, isActive, setActive, params, advancedFilter, updateAdvancedFilter } = useDataGrid();
  const navigate = useNavigate();

  const [range, setRange] = useState({ start: DateConfig.utc().startOf("day"), end: DateConfig.utc().endOf("day") });

  const { data: purchaseOrderData, isLoading: purchaseOrderDataLoading, isFetching: purchaseOrderDataFetching } = Queries.useGetPurchaseOrder({ ...params, startDate: range.start.toISOString(), endDate: range.end.toISOString() });
  const { refetch: fetchAll, isFetching: AllFetching, isLoading: AllLoading } = Queries.useGetPurchaseOrder({ startDate: range.start.toISOString(), endDate: range.end.toISOString() }, false);
  const { mutate: deletePurchaseOrderMutate, isPending: deletePurchaseOrderLoading } = Mutations.useDeletePurchaseOrder();
  const { mutate: editPurchaseOrder, isPending: isEditLoading } = Mutations.useEditPurchaseOrder();

  // Filter Data Queries
  const { data: companyData, isLoading: companyDataLoading } = Queries.useGetCompanyDropdown();
  const companyId = advancedFilter?.companyFilter?.[0] || "";
  const { data: BranchData, isLoading: BranchDataLoading } = Queries.useGetBranchDropdown({ companyFilter: companyId }, Boolean(companyId));
  const { data: supplierData, isLoading: supplierDataLoading } = Queries.useGetContactDropdown({ typeFilter: "supplier" });

  const allPurchaseOrder = useMemo(() => purchaseOrderData?.data?.purchaseOrder_data?.map((purchaseOrder) => ({ ...purchaseOrder, id: purchaseOrder._id, netAmount: purchaseOrder.summary?.netAmount || 0 })) || [], [purchaseOrderData]);
  const totalRows = purchaseOrderData?.data?.totalData || 0;
  const summaryData = purchaseOrderData?.data?.summary;

  const summary = useMemo(() => {
    return CalculateGridSummary(allPurchaseOrder, ["netAmount"]);
  }, [allPurchaseOrder]);

  const handleDeleteBtn = () => {
    if (!rowToDelete) return;
    deletePurchaseOrderMutate(rowToDelete?._id as string, { onSuccess: () => setRowToDelete(null) });
  };

  const handleAdd = () => navigate(ROUTES.PURCHASE_ORDER.ADD_EDIT);

  const columns: AppGridColDef<PurchaseOrderBase>[] = [
    CommonObjectPropertyColumn<PurchaseOrderBase>("companyId", "companyId", ["name"], { headerName: "Company", width: 150 }),
    CommonObjectPropertyColumn<PurchaseOrderBase>("branchId", "branchId", ["name"], { headerName: "Branch", width: 150 }),
    { field: "orderNo", headerName: "Order No", flex: 1, minWidth: 150 },
    CommonObjectPropertyColumn<PurchaseOrderBase>("supplierId", "supplierId", ["firstName", "lastName"], { headerName: "Supplier", width: 150 }),
    CommonObjectPropertyColumn<PurchaseOrderBase>("orderDate", "orderDate", [], { headerName: "Order Date", flex: 1, minWidth: 150, type: "date" }),
    { field: "netAmount", headerName: "Amount", flex: 1, minWidth: 110, type: "number", isSummary: true },
    CommonObjectPropertyColumn<PurchaseOrderBase>("status", "status", [], { headerName: "Status", flex: 1, minWidth: 110, type: "status" }),
    { field: "notes", headerName: "Notes", flex: 1, minWidth: 150 },
    CommonObjectPropertyColumn<PurchaseOrderBase>("createdBy", "createdBy", ["fullName"], { headerName: "Created By", flex: 1, minWidth: 150 }),

    CommonActionColumn({
      active: (row) => editPurchaseOrder({ purchaseOrderId: row?._id, isActive: !row.isActive }),
      editRoute: ROUTES.PURCHASE_ORDER.ADD_EDIT,
      onDelete: (row) => setRowToDelete({ _id: row?._id }),
    }),
  ];

  const accountingColumns: AppGridColDef<PurchaseOrderBase>[] = [
    { field: "orderNo", headerName: "Order No", flex: 1, minWidth: 150 },
    {
      field: "items",
      headerName: "Product Name",
      flex: 1,
      minWidth: 150,
      renderCell: (params: GridRenderCellParams<PurchaseOrderBase>) => {
        return <div>{params.row.items?.map((item) => item?.productId?.name).join(", ")}</div>;
      },
      exportFormatter: (_, row: PurchaseOrderBase) => {
        return row?.items?.map((item) => item?.productId?.name)?.join(", ") || "";
      },
    },
    CommonObjectPropertyColumn<PurchaseOrderBase>("supplierId", "supplierId", ["firstName", "lastName"], { headerName: "Supplier Name", width: 150 }),
    { field: "netAmount", headerName: "Amount", flex: 1, minWidth: 110, type: "number", isSummary: true },

    {
      field: "state",
      headerName: "State",
      flex: 1,
      minWidth: 150,
      renderCell: (params: GridRenderCellParams<PurchaseOrderBase>) => {
        return <div>{params.row.supplierId?.address?.[0].state?.name}</div>;
      },
      exportFormatter: (_, row: PurchaseOrderBase) => {
        return row?.supplierId?.address?.[0].state?.name || "";
      },
    },
    // CommonObjectPropertyColumn<PurchaseOrderBase>("paymentMethod", "paymentMethod", [], { headerName: "Payment Mode", width: 120, type: "format" }),
    CommonObjectPropertyColumn<PurchaseOrderBase>("orderDate", "orderDate", [], { headerName: "Date", width: 120, type: "date" }), //
  ];

  const CommonDataGridOption = {
    columns,
    rows: allPurchaseOrder,
    rowCount: totalRows,
    loading: purchaseOrderDataLoading || purchaseOrderDataFetching || isEditLoading,
    isActive,
    setActive,
    handleAdd,
    paginationModel,
    onPaginationModelChange: setPaginationModel,
    sortModel,
    onSortModelChange: setSortModel,
    filterModel,
    onFilterModelChange: setFilterModel,
    slots: {
      bottomContainer: () => <CommonDataGridSummaryFooter summary={summary} />,
    },
    fileName: PAGE_TITLE.PURCHASE_ORDER.BASE,
    onExportAll: { onExportAll: fetchAll, isFetching: AllLoading || AllFetching },
    onAccountingExportAll: { accountingColumns: accountingColumns, onAccountingExportAll: fetchAll, isFetching: AllLoading || AllFetching },
  };

  const filter = [
    CreateFilter("Select Company", "companyFilter", advancedFilter, updateAdvancedFilter, GenerateOptions(companyData?.data), companyDataLoading, { xs: 12, sm: 6, md: 3 }), //
    CreateFilter("Select Branch", "branchFilter", advancedFilter, updateAdvancedFilter, GenerateOptions(BranchData?.data), BranchDataLoading, { xs: 12, sm: 6, md: 3 }),
    CreateFilter("Select Supplier", "supplier", advancedFilter, updateAdvancedFilter, GenerateOptions(supplierData?.data), supplierDataLoading, { xs: 12, sm: 6, md: 3 }),
    CreateFilter("Select Status", "statusFilter", advancedFilter, updateAdvancedFilter, ORDER_STATUS, false, { xs: 12, sm: 6, md: 3 }),
  ];

  const stats = [
    { label: "All Orders", value: summaryData?.allOrders || 0, color: "primary" },
    { label: "In Progress", value: summaryData?.inProgress || 0, color: "secondary" },
    { label: "Delivered", value: summaryData?.delivered || 0, color: "success" },
    { label: "Exceed", value: summaryData?.exceed || 0, color: "error" },
    { label: "Completed", value: summaryData?.completed || 0, color: "info" },
    { label: "Cancelled", value: summaryData?.cancelled || 0, color: "warning" },
  ];
  const topContent = (
    <>
      <Grid size={{ xs: 12, sm: 4, xxl: 3 }}>
        <CommonDateRangeSelector value={range} onChange={setRange} active="This Financial Year" />
      </Grid>
    </>
  );

  return (
    <>
      <CommonBreadcrumbs title={PAGE_TITLE.PURCHASE_ORDER.BASE} maxItems={1} breadcrumbs={BREADCRUMBS.PURCHASE_ORDER.BASE} />
      <Box sx={{ p: { xs: 2, md: 3 }, display: "grid", gap: 2 }}>
        <CommonStatsCard stats={stats} grid={{ xs: 6, sm: 4, md: 2 }} />
        <AdvancedSearch filter={filter} defaultExpanded children={topContent} />
        <CommonCard hideDivider>
          <CommonDataGrid {...CommonDataGridOption} />
        </CommonCard>
        <CommonDeleteModal open={Boolean(rowToDelete)} itemName={rowToDelete?.title} onClose={() => setRowToDelete(null)} onConfirm={() => handleDeleteBtn()} loading={deletePurchaseOrderLoading} />
      </Box>
    </>
  );
};

export default PurchaseOrder;
