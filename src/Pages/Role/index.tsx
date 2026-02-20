import { Box } from "@mui/material";
import { useMemo } from "react";
import { useDispatch } from "react-redux";
import { Mutations, Queries } from "../../Api";
import { CommonActionColumn, CommonBreadcrumbs, CommonCard, CommonDataGrid, CommonDeleteModal } from "../../Components/Common";
import { PAGE_TITLE } from "../../Constants";
import { BREADCRUMBS } from "../../Data";
import { setRoleModal } from "../../Store/Slices/ModalSlice";
import type { AppGridColDef, RolesBase } from "../../Types";
import { useDataGrid, usePagePermission } from "../../Utils/Hooks";
import RoleForm from "./RoleForm";

const Role = () => {
  const { paginationModel, setPaginationModel, sortModel, setSortModel, filterModel, setFilterModel, rowToDelete, setRowToDelete, isActive, setActive, params } = useDataGrid();
  const dispatch = useDispatch();
  const permission = usePagePermission(PAGE_TITLE.ROLE.BASE);

  const { data: RoleData, isLoading: RoleDataLoading, isFetching: RoleDataFetching } = Queries.useGetRole(params);

  const { mutate: deleteRoleMutate } = Mutations.useDeleteRole();
  const { mutate: editRole, isPending: isEditLoading } = Mutations.useEditRole();

  const allRole = useMemo(() => RoleData?.data?.role_data.map((Role) => ({ ...Role, id: Role?._id })) || [], [RoleData]);
  const totalRows = RoleData?.data?.totalData || 0;

  const handleDeleteBtn = () => {
    if (!rowToDelete) return;
    deleteRoleMutate(rowToDelete?._id as string, { onSuccess: () => setRowToDelete(null) });
  };

  const handleAdd = () => dispatch(setRoleModal({ open: true, data: null }));

  const handleEdit = (row: RolesBase) => dispatch(setRoleModal({ open: true, data: row }));

  const columns: AppGridColDef<RolesBase>[] = [
    { field: "name", headerName: "Name", flex: 1, minWidth: 300 },
    ...(permission?.edit || permission?.delete
      ? [
          CommonActionColumn<RolesBase>({
            ...(permission?.edit && {
              active: (row) => editRole({ roleId: row?._id, isActive: !row.isActive }),
              onEdit: (row) => handleEdit(row),
            }),
            ...(permission?.delete && { onDelete: (row) => setRowToDelete({ _id: row?._id, title: row?.name }) }),
          }),
        ]
      : []),
  ];

  const CommonDataGridOption = {
    columns,
    rows: allRole,
    rowCount: totalRows,
    loading: RoleDataLoading || RoleDataFetching || isEditLoading,
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
      <CommonBreadcrumbs title={PAGE_TITLE.ROLE.BASE} maxItems={1} breadcrumbs={BREADCRUMBS.ROLE.BASE} />
      <Box sx={{ p: { xs: 2, md: 3 }, display: "grid", gap: 2 }}>
        <CommonCard hideDivider>
          <CommonDataGrid {...CommonDataGridOption} />
        </CommonCard>
        <CommonDeleteModal open={Boolean(rowToDelete)} itemName={rowToDelete?.title} onClose={() => setRowToDelete(null)} onConfirm={() => handleDeleteBtn()} />
        <RoleForm />
      </Box>
    </>
  );
};

export default Role;
