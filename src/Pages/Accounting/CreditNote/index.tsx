import { Box } from "@mui/material";
import type { GridColDef } from "@mui/x-data-grid";
import { useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { Mutations, Queries } from "../../../Api";
import { CommonActionColumn, CommonBreadcrumbs, CommonCard, CommonDataGrid, CommonDeleteModal, CommonObjectNameColumn } from "../../../Components/Common";
import { PAGE_TITLE, ROUTES } from "../../../Constants";
import { BREADCRUMBS } from "../../../Data";
import type { CreditNoteBase } from "../../../Types";
import { useDataGrid, usePagePermission } from "../../../Utils/Hooks";
import { FormatDate } from "../../../Utils";

const CreditNote = () => {
  const { paginationModel, setPaginationModel, sortModel, setSortModel, filterModel, setFilterModel, rowToDelete, setRowToDelete, isActive, setActive, params } = useDataGrid();
  const navigate = useNavigate();
  const permission = usePagePermission(PAGE_TITLE.CREDIT_NOTE.BASE);

  const { data: creditNoteData, isLoading: creditNoteDataLoading, isFetching: creditNoteDataFetching } = Queries.useGetCreditNote(params);
  const { mutate: deleteCreditNoteMutate } = Mutations.useDeleteCreditNote();
  const { mutate: editCreditNote, isPending: isEditLoading } = Mutations.useEditCreditNote();

  const allCreditNotes = useMemo(() => creditNoteData?.data?.creditNote_data.map((creditNote) => ({ ...creditNote, id: creditNote?._id })) || [], [creditNoteData]);
  const totalRows = creditNoteData?.data?.totalData || 0;

  const handleDeleteBtn = () => {
    if (!rowToDelete) return;
    deleteCreditNoteMutate(rowToDelete?._id as string, { onSuccess: () => setRowToDelete(null) });
  };

  const handleAdd = () => navigate(ROUTES.CREDIT_NOTE.ADD_EDIT);

  const columns: GridColDef<CreditNoteBase>[] = [
    CommonObjectNameColumn<CreditNoteBase>("companyId", { headerName: "Company", width: 200 }),
    { field: "voucherNumber", headerName: "Voucher Number", width: 150 },
    { field: "amount", headerName: "Amount", width: 100 },
    CommonObjectNameColumn<CreditNoteBase>("fromAccountId", { headerName: "From Account", width: 200 }),
    CommonObjectNameColumn<CreditNoteBase>("toAccountId", { headerName: "To Account", width: 200 }),
    { field: "date", headerName: "DN Date", width: 100, renderCell: (params) => FormatDate(params.row.date) },
    { field: "description", headerName: "Description", flex: 1, minWidth: 200 },
    ...(permission?.edit || permission?.delete
      ? [
          CommonActionColumn<CreditNoteBase>({
            ...(permission?.edit && {
              active: (row) => editCreditNote({ creditNoteId: row?._id, isActive: !row.isActive }),
              editRoute: ROUTES.CREDIT_NOTE.ADD_EDIT,
            }),
            ...(permission?.delete && { onDelete: (row) => setRowToDelete({ _id: row?._id, title: row?.voucherNumber }) }),
          }),
        ]
      : []),
  ];

  const CommonDataGridOption = {
    columns,
    rows: allCreditNotes,
    rowCount: totalRows,
    loading: creditNoteDataLoading || creditNoteDataFetching || isEditLoading,
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
      <CommonBreadcrumbs title={PAGE_TITLE.CREDIT_NOTE.BASE} maxItems={1} breadcrumbs={BREADCRUMBS.CREDIT_NOTE.BASE} />
      <Box sx={{ p: { xs: 2, md: 3 }, display: "grid" }}>
        <CommonCard hideDivider>
          <CommonDataGrid {...CommonDataGridOption} />
        </CommonCard>
        <CommonDeleteModal open={Boolean(rowToDelete)} itemName={rowToDelete?.title} onClose={() => setRowToDelete(null)} onConfirm={() => handleDeleteBtn()} />
      </Box>
    </>
  );
};

export default CreditNote;
