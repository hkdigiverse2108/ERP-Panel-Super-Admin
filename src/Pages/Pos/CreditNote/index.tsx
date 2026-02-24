import { Box } from "@mui/material";
import dayjs from "dayjs";
import { useMemo } from "react";
import { Queries, Mutations } from "../../../Api";
import { CommonCard, CommonDataGrid, CommonBreadcrumbs, CommonActionColumn, CommonDeleteModal } from "../../../Components/Common";
import { PAGE_TITLE } from "../../../Constants";
import { BREADCRUMBS } from "../../../Data";
import type { PosCreditNoteBase, AppGridColDef } from "../../../Types";
import { useDataGrid, usePagePermission } from "../../../Utils/Hooks";

const PosCreditNote = () => {
  const { paginationModel, setPaginationModel, sortModel, setSortModel, filterModel, setFilterModel, params, rowToDelete, setRowToDelete, isActive, setActive } = useDataGrid({});
  const permission = usePagePermission(PAGE_TITLE.POS.BASE);

  const { data: posCreditNoteData, isLoading: posCreditNoteDataLoading, isFetching: posCreditNoteDataFetching } = Queries.useGetPosCreditNote(params);
  const { mutate: deletePosCreditNote, isPending: isDeleteLoading } = Mutations.useDeletePosCreditNote();
  const { mutate: editPosCreditNote, isPending: isEditLoading } = Mutations.useEditPosCreditNote();

  const allCreditNotes = useMemo(() => posCreditNoteData?.data?.posCreditNote_data?.map((note) => ({ ...note, id: note?._id })) || [], [posCreditNoteData]);
  const totalRows = posCreditNoteData?.data?.totalData || 0;

  const handleDeleteBtn = () => {
    if (!rowToDelete) return;
    deletePosCreditNote(rowToDelete._id as string, {
      onSuccess: () => setRowToDelete(null),
    });
  };

  const columns: AppGridColDef<PosCreditNoteBase>[] = [
    { field: "creditNoteNo", headerName: "Credit Note No", flex: 1, minWidth: 150 },
    {
      field: "createdAt",
      headerName: "Date",
      flex: 1,
      minWidth: 120,
      renderCell: (params) => (params.row.createdAt ? dayjs(params.row.createdAt).format("DD/MM/YYYY") : "-"),
    },
    {
      field: "customerName",
      headerName: "Customer Name",
      flex: 1,
      minWidth: 150,
      renderCell: (params) => {
        const customer = params.row.customerId;
        return customer ? `${customer.firstName || ""} ${customer.lastName || ""}`.trim() : "-";
      },
    },
    { field: "totalAmount", headerName: "Total Amount", flex: 1, minWidth: 120 },
    { field: "creditsUsed", headerName: "Credits Used", flex: 1, minWidth: 120 },
    { field: "creditsRemaining", headerName: "Credits Remaining", flex: 1, minWidth: 120 },
    { field: "status", headerName: "Status", flex: 1, minWidth: 100 },
    { field: "notes", headerName: "Notes", flex: 1, minWidth: 120 },
    {
      field: "createdBy",
      headerName: "Created By",
      flex: 1,
      minWidth: 150,
      renderCell: (params) => {
        const user = params.row.createdBy;
        return user ? `${user.fullName || ""}`.trim() : "-";
      },
    },
    ...(permission?.edit || permission?.delete
      ? [
          CommonActionColumn<PosCreditNoteBase>({
            ...(permission?.edit && {
              active: (row) => editPosCreditNote({ posCreditNoteId: row?._id as string, isActive: !row.isActive }),
            }),
            ...(permission?.delete && { onDelete: (row) => setRowToDelete({ _id: row?._id as string, title: row?.creditNoteNo || "Credit Note" }) }),
          }),
        ]
      : []),
  ];

  const CommonDataGridOption = {
    columns,
    rows: allCreditNotes,
    rowCount: totalRows,
    loading: posCreditNoteDataLoading || posCreditNoteDataFetching || isEditLoading,
    isActive,
    setActive,
    paginationModel,
    onPaginationModelChange: setPaginationModel,
    sortModel,
    onSortModelChange: setSortModel,
    filterModel,
    onFilterModelChange: setFilterModel,
  };

  return (
    <>
      <CommonBreadcrumbs title={PAGE_TITLE.POS.CREDIT_NOTE.BASE} breadcrumbs={BREADCRUMBS.POS_CREDIT_NOTE.BASE} />
      <Box sx={{ p: { xs: 2, md: 3 }, display: "grid", gap: 2 }}>
        <CommonCard hideDivider>
          <CommonDataGrid {...CommonDataGridOption} />
        </CommonCard>
        <CommonDeleteModal open={Boolean(rowToDelete)} itemName={rowToDelete?.title} loading={isDeleteLoading} onClose={() => setRowToDelete(null)} onConfirm={handleDeleteBtn} />
      </Box>
    </>
  );
};

export default PosCreditNote;
