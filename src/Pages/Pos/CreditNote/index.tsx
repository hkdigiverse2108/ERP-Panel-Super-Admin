import { Box } from "@mui/material";
import { useMemo } from "react";
import { Mutations, Queries } from "../../../Api";
import { CommonActionColumn, CommonBreadcrumbs, CommonCard, CommonDataGrid, CommonDeleteModal } from "../../../Components/Common";
import { PAGE_TITLE } from "../../../Constants";
import { BREADCRUMBS } from "../../../Data";
import { useAppDispatch } from "../../../Store/hooks";
import type { AppGridColDef, PosCreditNoteBase } from "../../../Types";
import { FormatDate } from "../../../Utils";
import { useDataGrid } from "../../../Utils/Hooks";
import { setOrderRefundModal } from "../../../Store/Slices/ModalSlice";
import OrderRefund from "./OrderRefund";


const CreditNoteList = () => {
  const dispatch = useAppDispatch();
  const { paginationModel, setPaginationModel, sortModel, setSortModel, filterModel, setFilterModel, rowToDelete, setRowToDelete, params } = useDataGrid({ active: false });
  const { mutate: deletePosCreditNoteMutate, isPending: isDeleteLoading } = Mutations.useDeletePosCreditNote();

  const { data: branchData, isLoading: branchDataLoading, isFetching: branchDataFetching } = Queries.useGetPosCreditNote(params, true);
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
    { field: "creditNoteNo", headerName: "Credit Note No.", flex: 1, minWidth: 150 },
    { field: "customerId", headerName: "Customer Name", flex: 1, minWidth: 150, renderCell: (params) => (params.row.customerId ? `${params.row.customerId.firstName || ""} ${params.row.customerId.lastName || ""}`.trim() : "-") },
    { field: "createdAt", headerName: "Date", flex: 1, minWidth: 120, renderCell: (params) => FormatDate(params.row.createdAt) },
    { field: "totalAmount", headerName: "Total Amount", flex: 1, minWidth: 120 },
    { field: "creditsUsed", headerName: "Credits Used", flex: 1, minWidth: 120 },
    { field: "creditsRemaining", headerName: "Credits Remaining", flex: 1, minWidth: 150 },
    { field: "status", headerName: "Status", headerAlign: "center", width: 110, renderCell: (params) => <span className={`status-${params.row.status}`}>{params.row.status}</span> },

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
  };

  return (
    <>
      <CommonBreadcrumbs title={PAGE_TITLE.POS.CREDIT_NOTE} breadcrumbs={BREADCRUMBS.POS_CREDIT_NOTE.BASE} />
      <Box sx={{ p: { xs: 2, md: 3 }, display: "grid", gap: 2 }}>
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
