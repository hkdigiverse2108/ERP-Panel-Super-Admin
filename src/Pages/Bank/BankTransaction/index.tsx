import { Box } from "@mui/material";
import { useMemo } from "react";
import { useDispatch } from "react-redux";
import { Mutations, Queries } from "../../../Api";
import { AdvancedSearch, CommonActionColumn, CommonBreadcrumbs, CommonCard, CommonDataGrid, CommonDeleteModal, CommonObjectNameColumn } from "../../../Components/Common";
import { PAGE_TITLE } from "../../../Constants";
import { BREADCRUMBS } from "../../../Data";
import { setBankTransactionModal } from "../../../Store/Slices/ModalSlice";
import type { AppGridColDef, BankTransactionBase } from "../../../Types";
import { useDataGrid, usePagePermission } from "../../../Utils/Hooks";
import BankTransactionForm from "./BankTransactionForm";
import { CreateFilter, GenerateOptions } from "../../../Utils";
import { CommonObjectPropertyColumn } from "../../../Components/Common/CommonDataGrid/CommonColumns";

const BankTransaction = () => {
  const { paginationModel, setPaginationModel, sortModel, setSortModel, filterModel, setFilterModel, rowToDelete, setRowToDelete, isActive, setActive, params, advancedFilter, updateAdvancedFilter } = useDataGrid();
  const dispatch = useDispatch();
  const permission = usePagePermission(PAGE_TITLE.BANK_TRANSACTION.BASE);

  const { data: bankTransaction_data, isLoading: bankTransactionDataLoading, isFetching: bankTransactionDataFetching } = Queries.useGetBankTransaction(params);
  const { refetch: fetchAll, isFetching: AllFetching, isLoading: AllLoading } = Queries.useGetBankTransaction({}, false);

  const { mutate: deleteBankTransactionMutate } = Mutations.useDeleteBankTransaction();
  const { mutate: editBankTransaction, isPending: isEditLoading } = Mutations.useEditBankTransaction();
  const { data: CompanyData, isLoading: CompanyDataLoading } = Queries.useGetCompanyDropdown();
  const companyId = advancedFilter?.companyFilter?.[0] || "";
  const { data: BranchData, isLoading: BranchDataLoading } = Queries.useGetBranchDropdown({ companyFilter: companyId }, Boolean(companyId));

  const allBankTransactions = useMemo(() => bankTransaction_data?.data?.bankTransaction_data?.map((transaction: BankTransactionBase) => ({ ...transaction, id: transaction?._id })) || [], [bankTransaction_data]);
  const totalRows = bankTransaction_data?.data?.totalData || 0;

  const handleDeleteBtn = () => {
    if (!rowToDelete) return;
    deleteBankTransactionMutate(rowToDelete?._id as string, { onSuccess: () => setRowToDelete(null) });
  };

  const handleAdd = () => dispatch(setBankTransactionModal({ open: true, data: null }));

  const handleEdit = (row: BankTransactionBase) => dispatch(setBankTransactionModal({ open: true, data: row }));

  const columns: AppGridColDef<BankTransactionBase>[] = [
    CommonObjectNameColumn<BankTransactionBase>("companyId", { headerName: "Company", width: 200 }),
    CommonObjectNameColumn<BankTransactionBase>("branchId", { headerName: "Branch", width: 200 }),
    { field: "voucherNo", headerName: "Voucher No", width: 150 },
    CommonObjectPropertyColumn<BankTransactionBase>("transactionDate", "transactionDate", [], { headerName: "Transaction Date", flex: 1, minWidth: 150, type: "date" }),
    CommonObjectPropertyColumn<BankTransactionBase>("transactionType", "transactionType", [], { headerName: "Transaction Type", flex: 1, minWidth: 150, type: "format" }),
    CommonObjectPropertyColumn<BankTransactionBase>("fromAccount", "fromAccount", ["name"], { headerName: "From Account", flex: 1, minWidth: 150 }),
    CommonObjectPropertyColumn<BankTransactionBase>("toAccount", "toAccount", ["name"], { headerName: "To Account", flex: 1, minWidth: 150 }),
    { field: "amount", headerName: "Amount", flex: 1, minWidth: 150 },
    CommonObjectPropertyColumn<BankTransactionBase>("createdBy", "createdBy", ["fullName"], { headerName: "Created By", flex: 1, minWidth: 150 }),

    ...(permission?.edit || permission?.delete
      ? [
          CommonActionColumn<BankTransactionBase>({
            ...(permission?.edit && {
              active: (row) => editBankTransaction({ bankTransactionId: row?._id, isActive: !row.isActive }),
              onEdit: { handleEdit: (row) => handleEdit(row) },
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
    fileName: PAGE_TITLE.BANK_TRANSACTION.BASE,
    onExportAll: { onExportAll: fetchAll, isFetching: AllLoading || AllFetching },
  };
  const filter = [
    CreateFilter("Select Company", "companyFilter", advancedFilter, updateAdvancedFilter, GenerateOptions(CompanyData?.data), CompanyDataLoading, { xs: 12, sm: 6, md: 3 }),//
    CreateFilter("Select Branch", "branchFilter", advancedFilter, updateAdvancedFilter, GenerateOptions(BranchData?.data), BranchDataLoading, { xs: 12, sm: 6, md: 3 }),
  ];

  return (
    <>
      <CommonBreadcrumbs title={PAGE_TITLE.BANK_TRANSACTION.BASE} maxItems={1} breadcrumbs={BREADCRUMBS.BANK_TRANSACTION.BASE} />
      <Box sx={{ p: { xs: 2, md: 3 }, display: "grid", gap: 2 }}>
        <AdvancedSearch filter={filter} />
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
