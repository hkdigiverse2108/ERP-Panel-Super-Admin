import { Box } from "@mui/material";
import { useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { Mutations, Queries } from "../../../Api";
import { AdvancedSearch, CalculateGridSummary, CommonActionColumn, CommonBreadcrumbs, CommonCard, CommonDataGrid, CommonDataGridSummaryFooter, CommonDeleteModal, CommonStatsCard } from "../../../Components/Common";
import { PAGE_TITLE, ROUTES } from "../../../Constants";
import { BREADCRUMBS, PURCHASE_DEBIT_NOTE_STATUS_OPTIONS } from "../../../Data";
import { useDataGrid } from "../../../Utils/Hooks";
import type { AppGridColDef, PurchaseDebitNoteBase } from "../../../Types";
import { CreateFilter, GenerateOptions } from "../../../Utils";
import { CommonObjectPropertyColumn } from "../../../Components/Common/CommonDataGrid/CommonColumns";

const PurchaseDebitNote = () => {
  const { paginationModel, setPaginationModel, sortModel, setSortModel, filterModel, setFilterModel, rowToDelete, setRowToDelete, isActive, setActive, params, advancedFilter, updateAdvancedFilter } = useDataGrid();
  const navigate = useNavigate();
  // const permission = usePagePermission(PAGE_TITLE.PURCHASE_DEBIT_NOTE.BASE);

  const { data: purchaseDebitNote, isLoading, isFetching } = Queries.useGetPurchaseDebitNote(params);
  const { mutate: editPurchaseDebitNote, isPending: isEditLoading } = Mutations.useEditPurchaseDebitNote();
  const { mutate: deletePurchaseDebitNote, isPending: deletePurchaseDebitNoteLoading } = Mutations.useDeletePurchaseDebitNote();

  // Filter Data Queries
  const { data: companyData, isLoading: companyDataLoading } = Queries.useGetCompanyDropdown();
  const companyId = advancedFilter?.companyFilter?.[0];
  const { data: supplierData, isLoading: supplierDataLoading } = Queries.useGetContactDropdown({ typeFilter: "supplier", companyFilter: companyId });

  const allRows = useMemo(
    () =>
      purchaseDebitNote?.data?.purchaseDebitNote_data?.map((item) => ({
        ...item,
        id: item._id,
        netAmount: item.summary?.netAmount || 0,
        taxAmount: item.summary?.taxAmount || 0,
      })) || [],
    [purchaseDebitNote],
  );

  const totalRows = purchaseDebitNote?.data?.totalData || 0;

  const summary = useMemo(() => {
    return CalculateGridSummary(allRows, ["netAmount", "taxAmount"]);
  }, [allRows]);

  const handleDeleteBtn = () => {
    if (!rowToDelete) return;
    deletePurchaseDebitNote(rowToDelete?._id as string, { onSuccess: () => setRowToDelete(null) });
  };

  const columns: AppGridColDef<PurchaseDebitNoteBase>[] = [
    { field: "debitNoteNo", headerName: "Debit Note No", flex: 1, minWidth: 150 },
    CommonObjectPropertyColumn<PurchaseDebitNoteBase>("status", "status", [], { headerName: "Status", width: 150, type: "status" }),
    CommonObjectPropertyColumn<PurchaseDebitNoteBase>("supplierId", "supplierId", ["firstName", "lastName"], { headerName: "Supplier", width: 150 }),
    CommonObjectPropertyColumn<PurchaseDebitNoteBase>("debitNoteDate", "debitNoteDate", [], { headerName: "Debit Note Date", flex: 1, minWidth: 150, type: "date" }),
    { field: "netAmount", headerName: "Debit Note Amount", flex: 1, minWidth: 150, type: "number", isSummary: true },
    { field: "taxAmount", headerName: "Tax Amount", flex: 1, minWidth: 120, type: "number", isSummary: true },
    { field: "notes", headerName: "Notes", flex: 1, minWidth: 200 },
    CommonActionColumn({
      active: (row) => editPurchaseDebitNote({ purchaseDebitNoteId: row?._id, isActive: !row.isActive }),
      editRoute: ROUTES.PURCHASE_DEBIT_NOTE.ADD_EDIT,
      onDelete: (row) => setRowToDelete({ _id: row?._id }),
    }),
  ];

  const filter = [CreateFilter("Select Company", "companyFilter", advancedFilter, updateAdvancedFilter, GenerateOptions(companyData?.data), companyDataLoading, { xs: 12, sm: 6, md: 3 }), CreateFilter("Select Supplier", "supplierFilter", advancedFilter, updateAdvancedFilter, GenerateOptions(supplierData?.data), supplierDataLoading, { xs: 12, sm: 6, md: 3 }), CreateFilter("Select Status", "statusFilter", advancedFilter, updateAdvancedFilter, PURCHASE_DEBIT_NOTE_STATUS_OPTIONS, false, { xs: 12, sm: 6, md: 3 })];

  // One state box for total amount specifically as requested
  const stats = [
    {
      label: "Total Amount",
      value: `${purchaseDebitNote?.data?.totalAmount || "0"}`,
      color: "secondary",
    },
  ];

  return (
    <>
      <CommonBreadcrumbs title={PAGE_TITLE.PURCHASE_DEBIT_NOTE.BASE} breadcrumbs={BREADCRUMBS.PURCHASE_DEBIT_NOTE.BASE} />
      <Box sx={{ p: { xs: 2, md: 3 }, display: "grid", gap: 2 }}>
        <CommonStatsCard stats={stats} grid={{ xs: 12 }} />

        <AdvancedSearch filter={filter} />

        <CommonCard hideDivider>
          <Box sx={{ width: "100%", overflow: "hidden" }}>
            <CommonDataGrid
              rows={allRows}
              columns={columns}
              rowCount={totalRows}
              loading={isLoading || isFetching || isEditLoading}
              handleAdd={() => navigate(ROUTES.PURCHASE_DEBIT_NOTE.ADD_EDIT)}
              isActive={isActive}
              setActive={setActive}
              paginationModel={paginationModel}
              onPaginationModelChange={setPaginationModel}
              sortModel={sortModel}
              onSortModelChange={setSortModel}
              filterModel={filterModel}
              onFilterModelChange={setFilterModel}
              slots={{
                bottomContainer: () => <CommonDataGridSummaryFooter summary={summary} />,
              }}
              fileName={PAGE_TITLE.PURCHASE_DEBIT_NOTE.BASE}
            />
          </Box>
        </CommonCard>

        <CommonDeleteModal open={Boolean(rowToDelete)} itemName="Purchase Debit Note" onClose={() => setRowToDelete(null)} onConfirm={handleDeleteBtn} loading={deletePurchaseDebitNoteLoading} />
      </Box>
    </>
  );
};

export default PurchaseDebitNote;
