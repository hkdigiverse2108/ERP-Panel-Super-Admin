import { Box } from "@mui/material";
import { useMemo } from "react";
import { useDispatch } from "react-redux";
import { Mutations, Queries } from "../../../Api";
import { CommonActionColumn, CommonBreadcrumbs, CommonCard, CommonDataGrid, CommonDeleteModal } from "../../../Components/Common";
import { CommonObjectPropertyColumn } from "../../../Components/Common/CommonDataGrid/CommonColumns";
import { PAGE_TITLE } from "../../../Constants";
import { BREADCRUMBS } from "../../../Data";
import { useDataGrid } from "../../../Utils/Hooks";
import type { AccountBase, AppGridColDef } from "../../../Types";
import { setAccountModal } from "../../../Store/Slices/ModalSlice";
import AccountForm from "./AccountForm";

const Account = () => {
  const { paginationModel, setPaginationModel, sortModel, setSortModel, filterModel, setFilterModel, rowToDelete, setRowToDelete, isActive, setActive, params } = useDataGrid();
  const dispatch = useDispatch();
  const { data: accountData, isLoading: accountLoading, isFetching: accountFetching } = Queries.useGetAccount(params);
  const { mutate: deleteAccountMutate } = Mutations.useDeleteAccount();
  const { mutate: editAccountMutate, isPending: isEditLoading } = Mutations.useEditAccount();

  const allAccount = useMemo(() =>
      accountData?.data?.account_data?.map((account) => ({
        ...account,
        id: account?._id,
      })) ?? [],
    [accountData],
  );

  const totalRows = accountData?.data?.totalData || 0;

  const handleDeleteBtn = () => {
    if (!rowToDelete) return;
    deleteAccountMutate(rowToDelete?._id as string, { onSuccess: () => setRowToDelete(null) });
  }

  const handleAdd = () => dispatch(setAccountModal({ open: true, data: null }));
  const handleEdit = (row: AccountBase) => dispatch(setAccountModal({ open: true, data: row }));

  const columns: AppGridColDef<AccountBase>[] = [
    { field: "name", headerName: "Account Name", width: 350 ,flex: 1},
    CommonObjectPropertyColumn<AccountBase>("GroupName", "groupId", "name", { headerName: "Group Name", width: 300 }),
    { field: "type", headerName: "Account Type", width: 200 ,flex: 1},
    { field: "updatedAt", headerName: "UpdatedAt", width: 200 ,flex: 1},

    CommonActionColumn({
      active: (row) => editAccountMutate({ accountId: row?._id, isActive: !row.isActive }),
      onEdit: (row) => handleEdit(row),
      onDelete: (row) => setRowToDelete({ _id: row?._id, title: row?.name }),
    }),
  ];

  const CommonDataGridOption = {
    columns,
    rows: allAccount,
    rowCount: totalRows,
    loading: accountLoading || accountFetching || isEditLoading,
    fileName: "Accounts",
    isActive,
    setActive,
    handleAdd,
    paginationModel,
    onPaginationModelChange: setPaginationModel,
    sortModel,
    onSortModelChange: setSortModel,
    filterModel,
    onFilterModelChange: setFilterModel,
  };

  return (
    <>
      <CommonBreadcrumbs title={PAGE_TITLE.ACCOUNT.BASE} maxItems={1} breadcrumbs={BREADCRUMBS.ACCOUNT.BASE} />
      <Box sx={{ p: { xs: 2, md: 3 }, display: "grid" }}>
        <CommonCard gridClass="justify-end!">
          <CommonDataGrid {...CommonDataGridOption} />
        </CommonCard>
        <CommonDeleteModal open={Boolean(rowToDelete)} itemName={rowToDelete?.title} onClose={() => setRowToDelete(null)} onConfirm={() => handleDeleteBtn()} />
        <AccountForm />
      </Box>
    </>
  );
};

export default Account;
