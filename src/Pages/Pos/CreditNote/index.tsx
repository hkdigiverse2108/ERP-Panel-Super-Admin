import { Box } from "@mui/material";
import { useMemo } from "react";
import { Mutations, Queries } from "../../../Api";
import { AdvancedSearch, CommonActionColumn, CommonBreadcrumbs, CommonCard, CommonDataGrid, CommonDeleteModal, CommonObjectNameColumn } from "../../../Components/Common";
import { PAGE_TITLE } from "../../../Constants";
import { BREADCRUMBS, CREDIT_NOTE_STATUS } from "../../../Data";
import { useAppDispatch } from "../../../Store/hooks";
import type { AppGridColDef, PosCreditNoteBase } from "../../../Types";
import { CreateFilter, GenerateOptions } from "../../../Utils";
import { useDataGrid } from "../../../Utils/Hooks";
import { setOrderRefundModal } from "../../../Store/Slices/ModalSlice";
import OrderRefund from "./OrderRefund";
import { CommonObjectPropertyColumn } from "../../../Components/Common/CommonDataGrid/CommonColumns";

const CreditNoteList = () => {
  const dispatch = useAppDispatch();
  const { paginationModel, setPaginationModel, sortModel, setSortModel, filterModel, setFilterModel, rowToDelete, setRowToDelete, params, advancedFilter, updateAdvancedFilter } = useDataGrid({ active: false });
  const { mutate: deletePosCreditNoteMutate, isPending: isDeleteLoading } = Mutations.useDeletePosCreditNote();

  const { data: branchData, isLoading: branchDataLoading, isFetching: branchDataFetching } = Queries.useGetPosCreditNote(params, true);
  const { data: CompanyData, isLoading: CompanyDataLoading } = Queries.useGetCompanyDropdown();
  const allBranches = useMemo(() => branchData?.data?.posCreditNote_data.map((branch) => ({ ...branch, id: branch?._id })) || [], [branchData]);
  const totalRows = branchData?.data?.totalData || 0;

  const handleDeleteBtn = () => {
    if (!rowToDelete) return;
    deletePosCreditNoteMutate(rowToDelete?._id as string, {
      onSuccess: () => setRowToDelete(null),
    });
  };

  const handleRefundBtn = (row: PosCreditNoteBase) => {
    dispatch(setOrderRefundModal({ open: true, data: row }));
  };

  const columns: AppGridColDef<PosCreditNoteBase>[] = [
    CommonObjectNameColumn<PosCreditNoteBase>("companyId", { headerName: "Company", width: 200 }),
    { field: "creditNoteNo", headerName: "Credit Note No.", width: 180 },
    CommonObjectPropertyColumn<PosCreditNoteBase>("customerId", "customerId", ["firstName", "lastName"], { headerName: "Customer Name", width: 150 }),
    CommonObjectPropertyColumn<PosCreditNoteBase>("created", "createdAt", [], { headerName: "Date", width: 120, type: "date" }),
    { field: "totalAmount", headerName: "Total Amount", width: 150 },
    { field: "creditsUsed", headerName: "Credits Used", width: 150 },
    { field: "creditsRemaining", headerName: "Credits Remaining", width: 150 },
    CommonObjectPropertyColumn<PosCreditNoteBase>("status", "status", [], { headerName: "Status", flex: 1, minWidth: 150, type: "status" }),
    CommonActionColumn<PosCreditNoteBase>({
      onRefund: (row) => (row.creditsRemaining > 0 ? handleRefundBtn(row) : undefined),
      onDelete: (row) => setRowToDelete({ _id: row?._id, title: row?.creditNoteNo }),
    }),
  ];

  const CommonDataGridOption = {
    columns,
    rows: allBranches,
    rowCount: totalRows,
    loading: branchDataLoading || branchDataFetching,
    paginationModel,
    onPaginationModelChange: setPaginationModel,
    sortModel,
    onSortModelChange: setSortModel,
    filterModel,
    onFilterModelChange: setFilterModel,
    fileName: PAGE_TITLE.POS.CREDIT_NOTE,
  };
  const filter = [
    CreateFilter("Select Company", "companyFilter", advancedFilter, updateAdvancedFilter, GenerateOptions(CompanyData?.data), CompanyDataLoading, { xs: 12, sm: 6, md: 3 }), //
    CreateFilter("Select Status", "statusFilter", advancedFilter, updateAdvancedFilter, CREDIT_NOTE_STATUS, false, { xs: 12, sm: 6, md: 3 }),
  ];

  return (
    <>
      <CommonBreadcrumbs title={PAGE_TITLE.POS.CREDIT_NOTE} breadcrumbs={BREADCRUMBS.POS_CREDIT_NOTE.BASE} />
      <Box sx={{ p: { xs: 2, md: 3 }, display: "grid", gap: 2 }}>
        <AdvancedSearch filter={filter} />
        <CommonCard hideDivider>
          <CommonDataGrid {...CommonDataGridOption} />
        </CommonCard>
        <CommonDeleteModal open={Boolean(rowToDelete)} itemName={rowToDelete?.title} loading={isDeleteLoading} onClose={() => setRowToDelete(null)} onConfirm={handleDeleteBtn} />
      </Box>
      <OrderRefund />
    </>
  );
};

export default CreditNoteList;
