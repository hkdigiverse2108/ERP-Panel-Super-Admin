import { useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { Mutations, Queries } from "../../../Api";
import { AdvancedSearch, CalculateGridSummary, CommonActionColumn, CommonBreadcrumbs, CommonCard, CommonDataGrid, CommonDataGridSummaryFooter, CommonDeleteModal, CommonStatsCard } from "../../../Components/Common";
import { PAGE_TITLE, ROUTES } from "../../../Constants";
import type { AppGridColDef, SalesOrderBase } from "../../../Types";
import { CreateFilter, GenerateOptions } from "../../../Utils";
import { BREADCRUMBS, SALES_ORDER_STATUS_OPTIONS } from "../../../Data";
import { Box } from "@mui/material";
import { useDataGrid } from "../../../Utils/Hooks";
import { CommonObjectPropertyColumn } from "../../../Components/Common/CommonDataGrid/CommonColumns";

const SalesOrder = () => {
  const { paginationModel, setPaginationModel, sortModel, setSortModel, filterModel, setFilterModel, rowToDelete, setRowToDelete, isActive, setActive, params, advancedFilter, updateAdvancedFilter } = useDataGrid();
  const navigate = useNavigate();
  const { refetch: fetchAll, isFetching: AllFetching, isLoading: AllLoading } = Queries.useGetSalesOrder({}, false);
  const { data: salesOrder, isLoading: salesOrderLoading, isFetching: salesOrderFetching } = Queries.useGetSalesOrder(params);
  const { mutate: deleteSalesOrderMutate } = Mutations.useDeleteSalesOrder();
  const { mutate: editSalesOrder, isPending: isEditLoading } = Mutations.useEditSalesOrder();

  // Filter Data Queries
  const { data: companyData, isLoading: companyDataLoading } = Queries.useGetCompanyDropdown();
  const companyId = advancedFilter?.companyFilter?.[0];
  const { data: customerData, isLoading: customerDataLoading } = Queries.useGetContactDropdown({ typeFilter: "customer", companyFilter: companyId });

  const allSalesOrder = useMemo(() => salesOrder?.data?.salesOrder_data?.map((salesOrder) => ({ ...salesOrder, id: salesOrder._id, netAmount: salesOrder.transactionSummary?.netAmount || 0, taxAmount: salesOrder.transactionSummary?.taxAmount || 0 })) || [], [salesOrder]);
  const totalRows = salesOrder?.data?.totalData || 0;

  const summary = useMemo(() => {
    return CalculateGridSummary(allSalesOrder, ["netAmount", "taxAmount"]);
  }, [allSalesOrder]);

  const handleDeleteBtn = () => {
    if (!rowToDelete) return;
    deleteSalesOrderMutate(rowToDelete?._id as string, { onSuccess: () => setRowToDelete(null) });
  };

  const handleAdd = () => navigate(ROUTES.SALES_ORDER.ADD_EDIT);

  const columns: AppGridColDef<SalesOrderBase>[] = [
    { field: "salesOrderNo", headerName: "Sales Order No", flex: 1, minWidth: 150 },
    CommonObjectPropertyColumn<SalesOrderBase>("date", "date", [], { headerName: "Sales Order Date", flex: 1, minWidth: 120, type: "date" }),
    CommonObjectPropertyColumn<SalesOrderBase>("dueDate", "dueDate", [], { headerName: "Due Date", flex: 1, minWidth: 120, type: "date" }),
    CommonObjectPropertyColumn<SalesOrderBase>("customerId", "customerId", ["firstName", "lastName"], { headerName: "Customer Name", flex: 1, minWidth: 150 }),
    CommonObjectPropertyColumn<SalesOrderBase>("transactionSummary.netAmount", "transactionSummary.netAmount", ["netAmount"], { headerName: "Amount", flex: 1, minWidth: 110, isSummary: true }),
    CommonObjectPropertyColumn<SalesOrderBase>("transactionSummary.taxAmount", "transactionSummary.taxAmount", ["taxAmount"], { headerName: "Tax Amount", flex: 1, minWidth: 110, isSummary: true }),
    CommonObjectPropertyColumn<SalesOrderBase>("status", "status", [], { headerName: "Status", flex: 1, minWidth: 200, type: "status" }),
    CommonObjectPropertyColumn<SalesOrderBase>("createdBy", "createdBy", ["fullName"], { headerName: "Created By", flex: 1, minWidth: 150 }),

    CommonActionColumn({
      active: (row) => editSalesOrder({ salesOrderId: row?._id, isActive: !row.isActive }),
      editRoute: ROUTES.SALES_ORDER.ADD_EDIT,
      onDelete: (row) => setRowToDelete({ _id: row?._id }),
    }),
  ];

  const CommonDataGridOption = {
    columns,
    rows: allSalesOrder,
    rowCount: totalRows,
    loading: salesOrderLoading || salesOrderFetching || isEditLoading,
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
    fileName: PAGE_TITLE.SALES_ORDER.BASE,
    onExportAll: { onExportAll: fetchAll, isFetching: AllLoading || AllFetching },
  };

  const filter = [CreateFilter("Select Company", "companyFilter", advancedFilter, updateAdvancedFilter, GenerateOptions(companyData?.data), companyDataLoading, { xs: 12, sm: 6, md: 3 }), CreateFilter("Select Customer", "customerFilter", advancedFilter, updateAdvancedFilter, GenerateOptions(customerData?.data), customerDataLoading, { xs: 12, sm: 6, md: 3 }), CreateFilter("Select Status", "statusFilter", advancedFilter, updateAdvancedFilter, SALES_ORDER_STATUS_OPTIONS, false, { xs: 12, sm: 6, md: 3 })];

  // const stats = [
  //     { label: "All Orders", value: totalRows || 0, color: "primary" },
  //     { label: "Pending", value: allEstimate.filter((item) => item.status === "pending").length, color: "success" },
  //     { label: "Order Created", value: allEstimate.filter((item) => item.status === "order-created").length, color: "error" },
  //     { label: "Invoice Created", value: allEstimate.filter((item) => item.status === "invoice-created").length, color: "info" },
  // ];
  const STATUS_COLOR: Record<string, string> = {
    all: "primary",
    pending: "warning",
    invoice_created: "info",
    partial_invoice_created: "info",
    delivery_challan_created: "success",
    partial_delivery_challan_created: "success",
    partially_cancelled: "error",
    cancelled: "error",
  };

  const stats = SALES_ORDER_STATUS_OPTIONS.map((status) => ({
    label: status.label,
    value: status.value === "all" ? totalRows || 0 : allSalesOrder.filter((item) => item.status === status.value).length,
    color: STATUS_COLOR[status.value] || "primary",
  }));

  return (
    <>
      <CommonBreadcrumbs title={PAGE_TITLE.SALES_ORDER.BASE} maxItems={1} breadcrumbs={BREADCRUMBS.SALES_ORDER.BASE} />
      <Box sx={{ p: { xs: 2, md: 3 }, display: "grid", gap: 2 }}>
        <CommonStatsCard stats={stats} grid={{ xs: 6, sm: 2, xl: 1.5 }} />
        <AdvancedSearch filter={filter} />
        <CommonCard hideDivider>
          <CommonDataGrid {...CommonDataGridOption} />
        </CommonCard>
        <CommonDeleteModal open={Boolean(rowToDelete)} itemName={rowToDelete?.title} onClose={() => setRowToDelete(null)} onConfirm={() => handleDeleteBtn()} />
      </Box>
    </>
  );
};

export default SalesOrder;
