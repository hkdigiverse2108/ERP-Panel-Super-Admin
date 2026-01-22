import { Box, Grid } from "@mui/material";
import { useMemo } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { Mutations, Queries } from "../../../Api";
import { CommonButton } from "../../../Attribute";
import { CommonActionColumn, CommonBreadcrumbs, CommonCard, CommonDataGrid, CommonDeleteModal } from "../../../Components/Common";
import { CommonObjectPropertyColumn } from "../../../Components/Common/CommonDataGrid/CommonColumns";
import { PAGE_TITLE, ROUTES } from "../../../Constants";
import { BREADCRUMBS } from "../../../Data";
import { useDataGrid } from "../../../Utils/Hooks";
import type { AccountBase } from "../../../Types/Account";
import type { AppGridColDef } from "../../../Types";
import { setAccountModal } from "../../../Store/Slices/ModalSlice";


const Account = () => {
  const { paginationModel, setPaginationModel, sortModel, setSortModel, filterModel, setFilterModel, rowToDelete, setRowToDelete, isActive, setActive, params } = useDataGrid();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { data: accountData, isLoading: accountLoading, isFetching: accountFetching } = Queries.useGetAccount(params);
  const { mutate: deleteAccountMutate } = Mutations.useDeleteAccount();
  const { mutate: editAccountMutate, isPending: isEditLoading } = Mutations.useEditAccount();

  type AccountRow = AccountBase & { accountGroup?: { name?: string } };

  const allAccount = useMemo<AccountRow[]>(
    () => accountData?.data?.account_data.map((account) => ({ ...account, id: account?._id })) || [],
    [accountData],
  );
  const totalRows = accountData?.data?.totalData || 0;

  const handleDeleteBtn = () => {
    if (!rowToDelete) return;
    deleteAccountMutate(rowToDelete?._id as string, { onSuccess: () => setRowToDelete(null) });
  };

  const handleAdd = () => dispatch(setAccountModal({ open: true, data: null }));
  const handleEdit = (row: AccountRow) => dispatch(setAccountModal({ open: true, data: row }));
  const handleDelete = (row: AccountRow) => setRowToDelete({ _id: row?._id, title: row?.name });

  const columns: AppGridColDef<AccountRow>[] = [
    { field: "name", headerName: "Account Name", width: 300 },
    CommonObjectPropertyColumn<AccountRow>("groupName", "groupId", "name", { headerName: "Account Group", width: 250 }),
    { field: "type", headerName: "Type", width: 180 },
   { field: "groupId" as keyof AccountRow, headerName: "Group Id", width: 180 },
    CommonActionColumn<AccountRow>({
      active: (row) => editAccountMutate({ account: { ...row, isActive: !row.isActive } }),
      onDelete: handleDelete,
      onEdit: handleEdit,
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

  const topContent = (
    <Grid size={"auto"}>
      <CommonButton variant="contained" title="View Tree" size="small" onClick={() => navigate(ROUTES.ACCOUNT_GROUP.TREE)} />
    </Grid>
  );

  return (
    <>
      <CommonBreadcrumbs title={PAGE_TITLE.ACCOUNT.BASE} maxItems={1} breadcrumbs={BREADCRUMBS.ACCOUNT.BASE} />
      <Box sx={{ p: { xs: 2, md: 3 }, display: "grid" }}>
        <CommonCard topContent={topContent} gridClass="justify-end!">
          <CommonDataGrid {...CommonDataGridOption} />
        </CommonCard>
        <CommonDeleteModal open={Boolean(rowToDelete)} itemName={rowToDelete?.title} onClose={() => setRowToDelete(null)} onConfirm={() => handleDeleteBtn()} />
        
      </Box>
    </>
  );
};

export default Account;
