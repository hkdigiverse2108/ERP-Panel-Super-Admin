import { Box } from "@mui/material";
import type { GridColDef } from "@mui/x-data-grid";
import { useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { Mutations, Queries } from "../../../Api";
import { CommonActionColumn, CommonBreadcrumbs, CommonCard, CommonDataGrid, CommonDeleteModal, CommonObjectNameColumn } from "../../../Components/Common";
import { PAGE_TITLE, ROUTES } from "../../../Constants";
import { BREADCRUMBS } from "../../../Data";
import type { DebitNoteBase } from "../../../Types";
import { useDataGrid, usePagePermission } from "../../../Utils/Hooks";
import { FormatDate } from "../../../Utils";

const DebitNote = () => {
  const { paginationModel, setPaginationModel, sortModel, setSortModel, filterModel, setFilterModel, rowToDelete, setRowToDelete, isActive, setActive, params } = useDataGrid();
  const navigate = useNavigate();
  const permission = usePagePermission(PAGE_TITLE.DEBIT_NOTE.BASE);

  const { data: debitNoteData, isLoading: debitNoteDataLoading, isFetching: debitNoteDataFetching } = Queries.useGetDebitNote(params);
  const { mutate: deleteDebitNoteMutate } = Mutations.useDeleteDebitNote();
  const { mutate: editDebitNote, isPending: isEditLoading } = Mutations.useEditDebitNote();

  const allDebitNotes = useMemo(() => debitNoteData?.data?.debitNote_data.map((debitNote) => ({ ...debitNote, id: debitNote?._id })) || [], [debitNoteData]);
  const totalRows = debitNoteData?.data?.totalData || 0;

  const handleDeleteBtn = () => {
    if (!rowToDelete) return;
    deleteDebitNoteMutate(rowToDelete?._id as string, { onSuccess: () => setRowToDelete(null) });
  };

  const handleAdd = () => navigate(ROUTES.DEBIT_NOTE.ADD_EDIT);

  const columns: GridColDef<DebitNoteBase>[] = [
    CommonObjectNameColumn<DebitNoteBase>("companyId", { headerName: "Company", width: 200 }),
    { field: "voucherNumber", headerName: "Voucher Number", width: 150 },
    { field: "amount", headerName: "Amount", width: 100 },
    CommonObjectNameColumn<DebitNoteBase>("fromAccountId", { headerName: "From Account", width: 200 }),
    CommonObjectNameColumn<DebitNoteBase>("toAccountId", { headerName: "To Account", width: 200 }),
    { field: "date", headerName: "DN Date", width: 100, renderCell: (params) => FormatDate(params.row.date) },
    { field: "description", headerName: "Description", flex: 1, minWidth: 200 },
    ...(permission?.edit || permission?.delete
      ? [
          CommonActionColumn<DebitNoteBase>({
            ...(permission?.edit && {
              active: (row) => editDebitNote({ debitNoteId: row?._id, isActive: !row.isActive }),
              editRoute: ROUTES.DEBIT_NOTE.ADD_EDIT,
            }),
            ...(permission?.delete && { onDelete: (row) => setRowToDelete({ _id: row?._id, title: row?.voucherNumber }) }),
          }),
        ]
      : []),
  ];

  const CommonDataGridOption = {
    columns,
    rows: allDebitNotes,
    rowCount: totalRows,
    loading: debitNoteDataLoading || debitNoteDataFetching || isEditLoading,
    isActive,
    setActive,
    ...(permission?.add && { handleAdd }),
    paginationModel,
    onPaginationModelChange: setPaginationModel,
    sortModel,
    onSortModelChange: setSortModel,
    filterModel,
    onFilterModelChange: setFilterModel,
  };

  return (
    <>
      <CommonBreadcrumbs title={PAGE_TITLE.DEBIT_NOTE.BASE} maxItems={1} breadcrumbs={BREADCRUMBS.DEBIT_NOTE.BASE} />
      <Box sx={{ p: { xs: 2, md: 3 }, display: "grid" }}>
        <CommonCard hideDivider>
          <CommonDataGrid {...CommonDataGridOption} />
        </CommonCard>
        <CommonDeleteModal open={Boolean(rowToDelete)} itemName={rowToDelete?.title} onClose={() => setRowToDelete(null)} onConfirm={() => handleDeleteBtn()} />
      </Box>
    </>
  );
};

export default DebitNote;
