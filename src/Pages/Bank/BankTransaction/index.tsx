import { Box } from "@mui/material";
import { useMemo } from "react";
import { useDispatch } from "react-redux";
import { Mutations, Queries } from "../../../Api";
import { CommonActionColumn, CommonBreadcrumbs, CommonCard, CommonDataGrid, CommonDeleteModal } from "../../../Components/Common";
import { PAGE_TITLE } from "../../../Constants";
import { BREADCRUMBS } from "../../../Data";
import { setBankTransactionModal } from "../../../Store/Slices/ModalSlice";
import type { AppGridColDef, BankTransactionBase } from "../../../Types";
import { useDataGrid, usePagePermission } from "../../../Utils/Hooks";
import BankTransactionForm from "./BankTransactionForm";
import { FormatDate } from "../../../Utils";

const BankTransaction = () => {
  const { paginationModel, setPaginationModel, sortModel, setSortModel, filterModel, setFilterModel, rowToDelete, setRowToDelete, isActive, setActive, params } = useDataGrid();
  const dispatch = useDispatch();
  const permission = usePagePermission(PAGE_TITLE.BANK_TRANSACTION.BASE);

  const { data: bankTransaction_data, isLoading: bankTransactionDataLoading, isFetching: bankTransactionDataFetching } = Queries.useGetBankTransaction(params);
  const { mutate: deleteBankTransactionMutate } = Mutations.useDeleteBankTransaction();
  const { mutate: editBankTransaction, isPending: isEditLoading } = Mutations.useEditBankTransaction();

  const allBankTransactions = useMemo(() => bankTransaction_data?.data?.bankTransaction_data?.map((transaction: BankTransactionBase) => ({ ...transaction, id: transaction?._id })) || [], [bankTransaction_data]);
  const totalRows = bankTransaction_data?.data?.totalData || 0;

  const handleDeleteBtn = () => {
    if (!rowToDelete) return;
    deleteBankTransactionMutate(rowToDelete?._id as string, { onSuccess: () => setRowToDelete(null) });
  };

  const handleAdd = () => dispatch(setBankTransactionModal({ open: true, data: null }));

  const handleEdit = (row: BankTransactionBase) => dispatch(setBankTransactionModal({ open: true, data: row }));

  const columns: AppGridColDef<BankTransactionBase>[] = [
    { field: "voucherNo", headerName: "Voucher No", width: 150 },
    { field: "transactionDate", headerName: "Transaction Date", width: 150, valueGetter: (v) => FormatDate(v) },
    { field: "transactionType", headerName: "Transaction Type", width: 150, renderCell: ({ value }) => <span style={{ textTransform: "capitalize" }}>{value as string}</span> },
    {
      field: "fromAccount",
      headerName: "From Account",
      flex: 1,
      minWidth: 200,
      renderCell: ({ value }) => (typeof value === "object" && value !== null ? (value as { name?: string })?.name || "-" : "-"),
      exportFormatter: (value) => (typeof value === "object" && value !== null ? (value as { name?: string })?.name || "-" : "-"),
    },
    {
      field: "toAccount",
      headerName: "To Account",
      flex: 1,
      minWidth: 200,
      renderCell: ({ value }) => (typeof value === "object" && value !== null ? (value as { name?: string })?.name || "-" : "-"),
      exportFormatter: (value) => (typeof value === "object" && value !== null ? (value as { name?: string })?.name || "-" : "-"),
    },
    { field: "amount", headerName: "Amount", width: 150 },
    { field: "description", headerName: "Description", width: 250 },
    ...(permission?.edit || permission?.delete
      ? [
          CommonActionColumn<BankTransactionBase>({
            ...(permission?.edit && {
              active: (row) => editBankTransaction({ bankTransactionId: row?._id, isActive: !row.isActive }),
              onEdit: (row) => handleEdit(row),
            }),
            ...(permission?.delete && { onDelete: (row) => setRowToDelete({ _id: row?._id, title: row?.voucherNo || row?.transactionType }) }),
          }),
        ]
      : []),
  ];

  const CommonDataGridOption = {
    columns,
    rows: allBankTransactions,
    rowCount: totalRows,
    loading: bankTransactionDataLoading || bankTransactionDataFetching || isEditLoading,
    isActive,
    setActive,
    ...(permission?.add && { handleAdd }),
    paginationModel,
    onPaginationModelChange: setPaginationModel,
    sortModel,
    onSortModelChange: setSortModel,
    filterModel,
    onFilterModelChange: setFilterModel,
    isExport: false,
  };

  return (
    <>
      <CommonBreadcrumbs title={PAGE_TITLE.BANK_TRANSACTION.BASE} maxItems={1} breadcrumbs={BREADCRUMBS.BANK_TRANSACTION.BASE} />
      <Box sx={{ p: { xs: 2, md: 3 }, display: "grid" }}>
        <CommonCard hideDivider>
          <CommonDataGrid {...CommonDataGridOption} />
        </CommonCard>
        <CommonDeleteModal open={Boolean(rowToDelete)} itemName={rowToDelete?.title} onClose={() => setRowToDelete(null)} onConfirm={() => handleDeleteBtn()} />
        <BankTransactionForm />
      </Box>
    </>
  );
};

export default BankTransaction;
