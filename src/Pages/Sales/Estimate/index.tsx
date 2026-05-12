import { useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { Mutations, Queries } from "../../../Api";
import { AdvancedSearch, CalculateGridSummary, CommonActionColumn, CommonBreadcrumbs, CommonCard, CommonDataGrid, CommonDataGridSummaryFooter, CommonDeleteModal, CommonStatsCard } from "../../../Components/Common";
import { PAGE_TITLE, ROUTES } from "../../../Constants";
import type { AppGridColDef, EstimateBase } from "../../../Types";
import { CreateFilter, GenerateOptions } from "../../../Utils";
import { BREADCRUMBS, ESTIMATE_STATUS } from "../../../Data";
import { Box } from "@mui/material";
import { useDataGrid } from "../../../Utils/Hooks";
import { CommonObjectPropertyColumn } from "../../../Components/Common/CommonDataGrid/CommonColumns";

const Estimate = () => {
  const { paginationModel, setPaginationModel, sortModel, setSortModel, filterModel, setFilterModel, rowToDelete, setRowToDelete, isActive, setActive, params, advancedFilter, updateAdvancedFilter } = useDataGrid();
  const navigate = useNavigate();
  const { refetch: fetchAll, isFetching: AllFetching, isLoading: AllLoading } = Queries.useGetEstimate({}, false);
  const { data: estimate, isLoading: estimateLoading, isFetching: estimateFetching } = Queries.useGetEstimate(params);
  const { mutate: deleteEstimateMutate } = Mutations.useDeleteEstimate();
  const { mutate: editEstimate, isPending: isEditLoading } = Mutations.useEditEstimate();

  // Filter Data Queries
  const { data: companyData, isLoading: companyDataLoading } = Queries.useGetCompanyDropdown();
  const companyId = advancedFilter?.companyFilter?.[0];
  const { data: BranchData, isLoading: BranchDataLoading } = Queries.useGetBranchDropdown({ companyFilter: companyId }, Boolean(companyId));
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
    CommonObjectPropertyColumn<EstimateBase>("companyId", "companyId", ["name"], { headerName: "Company", flex: 1, minWidth: 150 }),
    CommonObjectPropertyColumn<EstimateBase>("branchId", "branchId", ["name"], { headerName: "Branch", flex: 1, minWidth: 150 }),
    { field: "estimateNo", headerName: "Estimate No", flex: 1, minWidth: 120 },
    CommonObjectPropertyColumn<EstimateBase>("customerId", "customerId", ["firstName", "lastName"], { headerName: "Customer Name", flex: 1, minWidth: 150 }),
    CommonObjectPropertyColumn<EstimateBase>("date", "date", [], { headerName: "Estimate Date", flex: 1, minWidth: 120, type: "date" }),
    CommonObjectPropertyColumn<EstimateBase>("dueDate", "dueDate", [], { headerName: "Due Date", flex: 1, minWidth: 120, type: "date" }),
    CommonObjectPropertyColumn<EstimateBase>("transactionSummary.netAmount", "transactionSummary.netAmount", ["netAmount"], { headerName: "Amount", flex: 1, minWidth: 110, isSummary: true }),
    CommonObjectPropertyColumn<EstimateBase>("status", "status", [], { headerName: "Status", width: 150, type: "status" }),
    CommonObjectPropertyColumn<EstimateBase>("transactionSummary.taxAmount", "transactionSummary.taxAmount", ["taxAmount"], { headerName: "Tax Amount", flex: 1, minWidth: 110, isSummary: true }),
    CommonObjectPropertyColumn<EstimateBase>("createdBy", "createdBy", ["fullName"], { headerName: "Created By", flex: 1, minWidth: 150 }),

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
    fileName: PAGE_TITLE.ESTIMATE.BASE,
    onExportAll: { onExportAll: fetchAll, isFetching: AllLoading || AllFetching },
  };

  const filter = [
    CreateFilter("Select Company", "companyFilter", advancedFilter, updateAdvancedFilter, GenerateOptions(companyData?.data), companyDataLoading, { xs: 12, sm: 6, md: 3 }), //
    CreateFilter("Select Branch", "branchFilter", advancedFilter, updateAdvancedFilter, GenerateOptions(BranchData?.data), BranchDataLoading, { xs: 12, sm: 6, md: 3 }),
    CreateFilter("Select Customer", "customerFilter", advancedFilter, updateAdvancedFilter, GenerateOptions(customerData?.data), customerDataLoading, { xs: 12, sm: 6, md: 3 }),
    CreateFilter("Select Status", "statusFilter", advancedFilter, updateAdvancedFilter, ESTIMATE_STATUS, false, { xs: 12, sm: 6, md: 3 }),
  ];

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
