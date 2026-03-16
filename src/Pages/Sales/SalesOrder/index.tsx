import { useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { Mutations, Queries } from "../../../Api";
import { AdvancedSearch, CalculateGridSummary, CommonActionColumn, CommonBreadcrumbs, CommonCard, CommonDataGrid, CommonDataGridSummaryFooter, CommonDeleteModal, CommonStatsCard } from "../../../Components/Common";
import { PAGE_TITLE, ROUTES } from "../../../Constants";
import type { AppGridColDef, EstimateBase } from "../../../Types";
import { CreateFilter, FormatDate, GenerateOptions } from "../../../Utils";
import { BREADCRUMBS, SALES_ORDER_STATUS_OPTIONS } from "../../../Data";
import { Box } from "@mui/material";
import { useDataGrid } from "../../../Utils/Hooks";

const SalesOrder = () => {
    const { paginationModel, setPaginationModel, sortModel, setSortModel, filterModel, setFilterModel, rowToDelete, setRowToDelete, isActive, setActive, params, advancedFilter, updateAdvancedFilter } = useDataGrid();
    const navigate = useNavigate();

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

    const columns: AppGridColDef<EstimateBase>[] = [
        { field: "salesOrderNo", headerName: "Sales Order No", width: 150 },
        { field: "date", headerName: "Sales Order Date", width: 150, renderCell: (params) => FormatDate(params.row.date) },
        { field: "dueDate", headerName: "Due Date", width: 150, renderCell: (params) => FormatDate(params.row.dueDate) },
        { field: "customerId", headerName: "Customer Name", width: 150, valueGetter: (_, row: EstimateBase) => (row?.customerId ? `${row.customerId.firstName || ""} ${row.customerId.lastName || ""}`.trim() || row.customerId.companyName || "" : "") },
        { field: "netAmount", headerName: "Amount", width: 110, type: "number" },
        { field: "status", headerName: "Status", headerAlign: "center", width: 110, renderCell: (params) => <span className={`status-${params.row.status}`}>{params.row.status}</span> },
        { field: "taxAmount", headerName: "Tax Amount", flex: 1, minWidth: 110 },
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
    };

    const filter = [CreateFilter("Select Company", "companyFilter", advancedFilter, updateAdvancedFilter, GenerateOptions(companyData?.data), companyDataLoading, { xs: 12, sm: 6, md: 3 }), CreateFilter("Select Customer", "customerFilter", advancedFilter, updateAdvancedFilter, GenerateOptions(customerData?.data), customerDataLoading, { xs: 12, sm: 6, md: 3 }), CreateFilter("Select Status", "statusFilter", advancedFilter, updateAdvancedFilter, SALES_ORDER_STATUS_OPTIONS, false, { xs: 12, sm: 6, md: 3 })];

    // const stats = [
    //     { label: "All Orders", value: totalRows || 0, color: "primary" },
    //     { label: "Pending", value: allEstimate.filter((item) => item.status === "pending").length, color: "success" },
    //     { label: "Order Created", value: allEstimate.filter((item) => item.status === "order-created").length, color: "error" },
    //     { label: "Invoice Created", value: allEstimate.filter((item) => item.status === "invoice-created").length, color: "info" },
    // ];
    const STATUS_COLOR: any = {
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
        value:
            status.value === "all"
                ? totalRows || 0
                : allSalesOrder.filter((item) => item.status === status.value).length,
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
