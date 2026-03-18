import { useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { Mutations, Queries } from "../../../Api";
import { AdvancedSearch, CalculateGridSummary, CommonActionColumn, CommonBreadcrumbs, CommonCard, CommonDataGrid, CommonDataGridSummaryFooter, CommonDeleteModal, CommonStatsCard } from "../../../Components/Common";
import { PAGE_TITLE, ROUTES } from "../../../Constants";
import type { AppGridColDef, DeliveryChallanBase } from "../../../Types";
import { CreateFilter, FormatDate, GenerateOptions } from "../../../Utils";
import { BREADCRUMBS, DELIVERY_CHALLAN_STATUS_OPTIONS } from "../../../Data";
import { Box } from "@mui/material";
import { useDataGrid } from "../../../Utils/Hooks";

const DeliveryChallan = () => {
    const { paginationModel, setPaginationModel, sortModel, setSortModel, filterModel, setFilterModel, rowToDelete, setRowToDelete, isActive, setActive, params, advancedFilter, updateAdvancedFilter } = useDataGrid();
    const navigate = useNavigate();

    const { data: deliveryChallan, isLoading: challanLoading, isFetching: challanFetching } = Queries.useGetDeliveryChallan(params);
    const { mutate: deleteChallanMutate } = Mutations.useDeleteDeliveryChallan();
    const { mutate: editChallan, isPending: isEditLoading } = Mutations.useEditDeliveryChallan();

    // Filter Data Queries
    const { data: companyData, isLoading: companyDataLoading } = Queries.useGetCompanyDropdown();
    const companyId = advancedFilter?.companyFilter?.[0];
    const { data: customerData, isLoading: customerDataLoading } = Queries.useGetContactDropdown({ typeFilter: "customer", companyFilter: companyId });

    const allChallan = useMemo(() => deliveryChallan?.data?.deliveryChallan_data?.map((challan) => ({
        ...challan,
        id: challan._id,
        netAmount: Number((challan.transactionSummary?.netAmount || 0).toFixed(2)),
        taxAmount: Number((challan.transactionSummary?.taxAmount || 0).toFixed(2)),
    })) || [], [deliveryChallan]);

    const totalRows = deliveryChallan?.data?.totalData || 0;

    const summary = useMemo(() => {
        return CalculateGridSummary(allChallan, ["netAmount", "taxAmount"]);
    }, [allChallan]);

    const handleDeleteBtn = () => {
        if (!rowToDelete) return;
        deleteChallanMutate(rowToDelete?._id as string, { onSuccess: () => setRowToDelete(null) });
    };

    const handleAdd = () => navigate(ROUTES.DELIVERY_CHALLAN.ADD_EDIT);

    const columns: AppGridColDef<DeliveryChallanBase>[] = [
        { field: "deliveryChallanNo", headerName: "Delivery Challan No.", width: 200 },
        { field: "date", headerName: "Delivery Challan Date", width: 200, renderCell: (params) => FormatDate(params.row.date) },
        { field: "dueDate", headerName: "Due Date", width: 200, renderCell: (params) => FormatDate(params.row.dueDate) },
        { field: "customerId", headerName: "Customer Name", width: 200, valueGetter: (_, row: DeliveryChallanBase) => (row?.customerId ? (typeof row.customerId === 'object' ? `${row.customerId.firstName || ""} ${row.customerId.lastName || ""}`.trim() || row.customerId.companyName || "" : "") : "") },
        { field: "netAmount", headerName: "Net Amount", width: 200, type: "number" },
        { field: "status", headerName: "Status", headerAlign: "center", width: 200, renderCell: (params) => <span className={`status-${params.row.status}`}>{params.row.status}</span> },
        { field: "taxAmount", headerName: "Tax Amount", flex: 1, minWidth: 110, type: "number" },

        CommonActionColumn({
            active: (row) => editChallan({ deliveryChallanId: row?._id as string, isActive: !row.isActive }),
            editRoute: ROUTES.DELIVERY_CHALLAN.ADD_EDIT,
            onDelete: (row) => setRowToDelete({ _id: row?._id }),
        }),
    ];

    const CommonDataGridOption = {
        columns,
        rows: allChallan,
        rowCount: totalRows,
        loading: challanLoading || challanFetching || isEditLoading,
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

    const filter = [
        CreateFilter("Select Company", "companyFilter", advancedFilter, updateAdvancedFilter, GenerateOptions(companyData?.data), companyDataLoading, { xs: 12, sm: 6, md: 3 }),
        CreateFilter("Select Customer", "customerFilter", advancedFilter, updateAdvancedFilter, GenerateOptions(customerData?.data), customerDataLoading, { xs: 12, sm: 6, md: 3 }),
        CreateFilter("Select Status", "statusFilter", advancedFilter, updateAdvancedFilter, DELIVERY_CHALLAN_STATUS_OPTIONS, false, { xs: 12, sm: 6, md: 3 })
    ];

    const stats = [
        { label: "All Challans", value: totalRows || 0, color: "primary" },
        { label: "Delivered", value: allChallan.filter((item) => item.status === "delivered").length, color: "success" },
        { label: "Invoice Created", value: allChallan.filter((item) => item.status === "invoice_created").length, color: "info" },
        { label: "Cancelled", value: allChallan.filter((item) => item.status === "cancelled").length, color: "error" },
    ];

    return (
        <>
            <CommonBreadcrumbs title={PAGE_TITLE.DELIVERY_CHALLAN.BASE} maxItems={1} breadcrumbs={BREADCRUMBS.DELIVERY_CHALLAN.BASE} />
            <Box sx={{ p: { xs: 2, md: 3 }, display: "grid", gap: 2 }}>
                <CommonStatsCard stats={stats} grid={{ xs: 6, sm: 3, md: 3, xl: 3 }} />
                <AdvancedSearch filter={filter} />
                <CommonCard hideDivider>
                    <CommonDataGrid {...CommonDataGridOption} />
                </CommonCard>
                <CommonDeleteModal open={Boolean(rowToDelete)} itemName={rowToDelete?.title} onClose={() => setRowToDelete(null)} onConfirm={() => handleDeleteBtn()} />
            </Box>
        </>
    );
};

export default DeliveryChallan;