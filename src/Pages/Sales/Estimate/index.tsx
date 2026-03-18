import { useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { Mutations, Queries } from "../../../Api";
import { AdvancedSearch, CalculateGridSummary, CommonActionColumn, CommonBreadcrumbs, CommonCard, CommonDataGrid, CommonDataGridSummaryFooter, CommonDeleteModal, CommonStatsCard } from "../../../Components/Common";
import { PAGE_TITLE, ROUTES } from "../../../Constants";
import type { AppGridColDef, EstimateBase } from "../../../Types";
import { CreateFilter, FormatDate, GenerateOptions } from "../../../Utils";
import { BREADCRUMBS, ESTIMATE_STATUS } from "../../../Data";
import { Box } from "@mui/material";
import { useDataGrid } from "../../../Utils/Hooks";

const Estimate = () => {
  const { paginationModel, setPaginationModel, sortModel, setSortModel, filterModel, setFilterModel, rowToDelete, setRowToDelete, isActive, setActive, params, advancedFilter, updateAdvancedFilter } = useDataGrid();
  const navigate = useNavigate();

  const { data: estimate, isLoading: estimateLoading, isFetching: estimateFetching } = Queries.useGetEstimate(params);
  const { mutate: deleteEstimateMutate } = Mutations.useDeleteEstimate();
  const { mutate: editEstimate, isPending: isEditLoading } = Mutations.useEditEstimate();

  // Filter Data Queries
  const { data: companyData, isLoading: companyDataLoading } = Queries.useGetCompanyDropdown();
  const companyId = advancedFilter?.companyFilter?.[0];
  const { data: customerData, isLoading: customerDataLoading } = Queries.useGetContactDropdown({ typeFilter: "customer", companyFilter: companyId });

  const allEstimate = useMemo(() => estimate?.data?.estimate_data?.map((estimate) => ({ ...estimate, id: estimate._id, netAmount: estimate.transactionSummary?.netAmount || 0, taxAmount: estimate.transactionSummary?.taxAmount || 0 })) || [], [estimate]);
  const totalRows = estimate?.data?.totalData || 0;

  const summary = useMemo(() => {
    return CalculateGridSummary(allEstimate, ["netAmount", "taxAmount"]);
  }, [allEstimate]);

  const handleDeleteBtn = () => {
    if (!rowToDelete) return;
    deleteEstimateMutate(rowToDelete?._id as string, { onSuccess: () => setRowToDelete(null) });
  };

  const handleAdd = () => navigate(ROUTES.ESTIMATE.ADD_EDIT);

  const columns: AppGridColDef<EstimateBase>[] = [
    { field: "estimateNo", headerName: "Estimate No", flex: 1, minWidth: 120 },
    { field: "customerId", headerName: "Customer Name", flex: 1, minWidth: 150, valueGetter: (_, row: EstimateBase) => (row?.customerId ? `${row.customerId.firstName || ""} ${row.customerId.lastName || ""}`.trim() || row.customerId.companyName || "" : "") },
    { field: "date", headerName: "Estimate Date", flex: 1, minWidth: 150, renderCell: (params) => FormatDate(params.row.date) },
    { field: "dueDate", headerName: "Due Date", flex: 1, minWidth: 150, renderCell: (params) => FormatDate(params.row.dueDate) },
    { field: "netAmount", headerName: "Amount", flex: 1, minWidth: 110, type: "number" },
    { field: "status", headerName: "Status", headerAlign: "center", flex: 1, minWidth: 150, renderCell: (params) => <span className={`status-${params.row.status} overflow-hidden`}>{params.row.status}</span> },
    { field: "taxAmount", headerName: "Tax Amount", flex: 1, minWidth: 110 },
    CommonActionColumn({
      active: (row) => editEstimate({ estimateId: row?._id, isActive: !row.isActive }),
      editRoute: ROUTES.ESTIMATE.ADD_EDIT,
      onDelete: (row) => setRowToDelete({ _id: row?._id }),
    }),
  ];
  const CommonDataGridOption = {
    columns,
    rows: allEstimate,
    rowCount: totalRows,
    loading: estimateLoading || estimateFetching || isEditLoading,
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
  };

  const filter = [CreateFilter("Select Company", "companyFilter", advancedFilter, updateAdvancedFilter, GenerateOptions(companyData?.data), companyDataLoading, { xs: 12, sm: 6, md: 3 }), CreateFilter("Select Customer", "customerFilter", advancedFilter, updateAdvancedFilter, GenerateOptions(customerData?.data), customerDataLoading, { xs: 12, sm: 6, md: 3 }), CreateFilter("Select Status", "statusFilter", advancedFilter, updateAdvancedFilter, ESTIMATE_STATUS, false, { xs: 12, sm: 6, md: 3 })];

  const stats = [
    { label: "All Orders", value: totalRows || 0, color: "primary" },
    { label: "Pending", value: allEstimate.filter((item) => item.status === "pending").length, color: "success" },
    { label: "Order Created", value: allEstimate.filter((item) => item.status === "order-created").length, color: "error" },
    { label: "Invoice Created", value: allEstimate.filter((item) => item.status === "invoice-created").length, color: "info" },
  ];

  return (
    <>
      <CommonBreadcrumbs title={PAGE_TITLE.ESTIMATE.BASE} maxItems={1} breadcrumbs={BREADCRUMBS.ESTIMATE.BASE} />
      <Box sx={{ p: { xs: 2, md: 3 }, display: "grid", gap: 2 }}>
        <CommonStatsCard stats={stats} grid={{ xs: 6, md: 3 }} />
        <AdvancedSearch filter={filter} />
        <CommonCard hideDivider>
          <CommonDataGrid {...CommonDataGridOption} />
        </CommonCard>
        <CommonDeleteModal open={Boolean(rowToDelete)} itemName={rowToDelete?.title} onClose={() => setRowToDelete(null)} onConfirm={() => handleDeleteBtn()} />
      </Box>
    </>
  );
};

export default Estimate;
