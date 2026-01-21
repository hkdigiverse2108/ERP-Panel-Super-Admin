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
import { setAccountGroupModal } from "../../../Store/Slices/ModalSlice";
import type { AccountGroupBase, AppGridColDef } from "../../../Types";
import { useDataGrid } from "../../../Utils/Hooks";
import AccountGroupForm from "./AccountGroupForm";

const AccountGroup = () => {
  const { paginationModel, setPaginationModel, sortModel, setSortModel, filterModel, setFilterModel, rowToDelete, setRowToDelete, isActive, setActive, params } = useDataGrid();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { data: accountGroupData, isLoading: accountGroupDataLoading, isFetching: accountGroupDataFetching } = Queries.useGetAccountGroup(params);
  const { mutate: deleteAccountGroupMutate } = Mutations.useDeleteAccountGroup();
  const { mutate: editAccountGroup, isPending: isEditLoading } = Mutations.useEditAccountGroup();

  const allAccountGroup = useMemo(() => accountGroupData?.data?.accountGroup_data.map((AccountGroup) => ({ ...AccountGroup, id: AccountGroup?._id })) || [], [accountGroupData]);
  const totalRows = accountGroupData?.data?.totalData || 0;

  const handleDeleteBtn = () => {
    if (!rowToDelete) return;
    deleteAccountGroupMutate(rowToDelete?._id as string, { onSuccess: () => setRowToDelete(null) });
  };

  const handleAdd = () => dispatch(setAccountGroupModal({ open: true, data: null }));

  const handleEdit = (row: AccountGroupBase) => dispatch(setAccountGroupModal({ open: true, data: row }));

  const columns: AppGridColDef<AccountGroupBase>[] = [
    { field: "name", headerName: "Group Name", width: 350 },
    { field: "nature", headerName: "Group nature", width: 350 },
    CommonObjectPropertyColumn<AccountGroupBase>("parentGroupName", "parentGroupId", "name", { headerName: "Parent Group", width: 300 }),
    CommonObjectPropertyColumn<AccountGroupBase>("parentGroupNature", "parentGroupId", "nature", { headerName: "Parent Nature",flex: 1, minWidth: 300 }),
    CommonActionColumn({
      active: (row) => editAccountGroup({ accountGroupId: row?._id, isActive: !row.isActive }),
      onEdit: (row) => handleEdit(row),
      onDelete: (row) => setRowToDelete({ _id: row?._id, title: row?.name }),
    }),
  ];


  const CommonDataGridOption = {
    columns,
    rows: allAccountGroup,
    rowCount: totalRows,
    loading: accountGroupDataLoading || accountGroupDataFetching || isEditLoading,
    fileName: "Account Group",
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
      <CommonBreadcrumbs title={PAGE_TITLE.ACCOUNT_GROUP.BASE} maxItems={1} breadcrumbs={BREADCRUMBS.ACCOUNT_GROUP.BASE} />
      <Box sx={{ p: { xs: 2, md: 3 }, display: "grid" }}>
        <CommonCard topContent={topContent} gridClass="justify-end!">
          <CommonDataGrid {...CommonDataGridOption} />
        </CommonCard>
        <CommonDeleteModal open={Boolean(rowToDelete)} itemName={rowToDelete?.title} onClose={() => setRowToDelete(null)} onConfirm={() => handleDeleteBtn()} />
        <AccountGroupForm />
      </Box>
    </>
  );
};

export default AccountGroup;
