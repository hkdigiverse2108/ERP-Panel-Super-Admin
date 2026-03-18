import { useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { Mutations, Queries } from "../../../Api";
import { AdvancedSearch, CalculateGridSummary, CommonActionColumn, CommonBreadcrumbs, CommonCard, CommonDataGrid, CommonDataGridSummaryFooter, CommonDeleteModal, CommonStatsCard } from "../../../Components/Common";
import { PAGE_TITLE, ROUTES } from "../../../Constants";
import type { AppGridColDef, SalesCreditNoteBase } from "../../../Types";
import { CreateFilter, FormatDate, GenerateOptions } from "../../../Utils";
import { BREADCRUMBS, SALES_CREDIT_NOTE_STATUS_OPTIONS } from "../../../Data";
import { Box } from "@mui/material";
import { useDataGrid } from "../../../Utils/Hooks";

const SalesCreditNote = () => {
    const { paginationModel, setPaginationModel, sortModel, setSortModel, filterModel, setFilterModel, rowToDelete, setRowToDelete, isActive, setActive, params, advancedFilter, updateAdvancedFilter } = useDataGrid();
    const navigate = useNavigate();

    const { data: salesCreditNote, isLoading: salesCreditNoteLoading, isFetching: salesCreditNoteFetching } = Queries.useGetSalesCreditNote(params);
    const { mutate: deleteSalesCreditNoteMutate } = Mutations.useDeleteSalesCreditNote();
    const { mutate: editSalesCreditNote, isPending: isEditLoading } = Mutations.useEditSalesCreditNote();

    // Filter Data Queries
    const { data: companyData, isLoading: companyDataLoading } = Queries.useGetCompanyDropdown();
    const companyId = advancedFilter?.companyFilter?.[0];
    const { data: customerData, isLoading: customerDataLoading } = Queries.useGetContactDropdown({ typeFilter: "customer", companyFilter: companyId });

    const allSalesCreditNote = useMemo(() => salesCreditNote?.data?.salesCreditNote_data?.map((item) => ({ 
        ...item, 
        id: item._id, 
        netAmount: item.summary?.netAmount || 0, 
        taxAmount: item.summary?.taxAmount || 0 
    })) || [], [salesCreditNote]);
    
    const totalRows = salesCreditNote?.data?.totalData || 0;

    const summary = useMemo(() => {
        return CalculateGridSummary(allSalesCreditNote, ["netAmount", "taxAmount", "creditUsed", "creditRemaining"]);
    }, [allSalesCreditNote]);

    const handleDeleteBtn = () => {
        if (!rowToDelete) return;
        deleteSalesCreditNoteMutate(rowToDelete?._id as string, { onSuccess: () => setRowToDelete(null) });
    };

    const handleAdd = () => navigate(ROUTES.SALES_CREDIT_NOTE.ADD_EDIT);

    const columns: AppGridColDef<SalesCreditNoteBase>[] = [
        { field: "creditNoteNo", headerName: "Credit Note No.", width: 150 },
        { field: "creditNoteDate", headerName: "Credit Note Date", width: 150, renderCell: (params) => FormatDate(params.row.creditNoteDate) },
        { field: "dueDate", headerName: "Due Date", width: 150, renderCell: (params) => FormatDate(params.row.dueDate) },
        { field: "customerId", headerName: "Customer Name", width: 200, valueGetter: (_, row: SalesCreditNoteBase) => (row?.customerId ? `${row.customerId.firstName || ""} ${row.customerId.lastName || ""}`.trim() || row.customerId.companyName || "" : "") },
        { field: "netAmount", headerName: "Net Amount", width: 120, type: "number" },
        { field: "creditUsed", headerName: "Credit Used", width: 120, type: "number" },
        { field: "creditRemaining", headerName: "Credit Remaining", width: 150, type: "number" },
        { field: "status", headerName: "Status", headerAlign: "center", width: 120, renderCell: (params) => <span className={`status-${params.row.status} overflow-hidden`}>{params.row.status}</span> },
        { field: "taxAmount", headerName: "Tax Amount", flex: 1, minWidth: 120, type: "number" },
        CommonActionColumn({
            active: (row) => editSalesCreditNote({ salesCreditNoteId: row?._id, isActive: !row.isActive }),
            editRoute: ROUTES.SALES_CREDIT_NOTE.ADD_EDIT,
            onDelete: (row) => setRowToDelete({ _id: row?._id }),
        }),
    ];

    const CommonDataGridOption = {
        columns,
        rows: allSalesCreditNote,
        rowCount: totalRows,
        loading: salesCreditNoteLoading || salesCreditNoteFetching || isEditLoading,
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
        CreateFilter("Select Status", "statusFilter", advancedFilter, updateAdvancedFilter, SALES_CREDIT_NOTE_STATUS_OPTIONS, false, { xs: 12, sm: 6, md: 3 })
    ];

    const STATUS_COLOR: Record<string, string> = {
        all: "primary",
        open: "info",
        paid: "success",
        due: "warning",
    };

    const stats = SALES_CREDIT_NOTE_STATUS_OPTIONS.map((status) => ({
        label: status.label,
        value:
            status.value === "all"
                ? totalRows || 0
                : allSalesCreditNote.filter((item) => item.status === status.value).length,
        color: STATUS_COLOR[status.value] || "primary",
    }));

    return (
        <>
            <CommonBreadcrumbs title={PAGE_TITLE.SALES_CREDIT_NOTE.BASE} maxItems={1} breadcrumbs={BREADCRUMBS.SALES_CREDIT_NOTE.BASE} />
            <Box sx={{ p: { xs: 2, md: 3 }, display: "grid", gap: 2 }}>
                <CommonStatsCard stats={stats} grid={{ xs: 6, md:3 }} />
                <AdvancedSearch filter={filter} />
                <CommonCard hideDivider>
                    <CommonDataGrid {...CommonDataGridOption} />
                </CommonCard>
                <CommonDeleteModal open={Boolean(rowToDelete)} itemName={rowToDelete?.title} onClose={() => setRowToDelete(null)} onConfirm={() => handleDeleteBtn()} />
            </Box>
        </>
    );
};

export default SalesCreditNote;
