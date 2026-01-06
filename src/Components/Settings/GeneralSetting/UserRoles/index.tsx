import type { GridColDef } from "@mui/x-data-grid";
import { useMemo, useState } from "react";
import { Mutations, Queries } from "../../../../Api";
import { PAGE_TITLE } from "../../../../Constants";
import type { RolesBase } from "../../../../Types";
import { useDataGrid } from "../../../../Utils/Hooks";
import { CommonActionColumn, CommonCard, CommonDataGrid, CommonDeleteModal } from "../../../Common";
import RolesFormModal from "./RolesFormModal";

const UserRoles = () => {
  const { paginationModel, setPaginationModel, sortModel, setSortModel, filterModel, setFilterModel, rowToDelete, setRowToDelete, isActive, setActive, params } = useDataGrid();
  const [openModal, setOpenModal] = useState(false);
  const [isEdit, setEdit] = useState<RolesBase>({} as RolesBase);

  const { data: rolesData, isLoading: rolesDataLoading, isFetching: rolesDataFetching } = Queries.useGetRoles(params);
  const { mutate: deleteRolesMutate } = Mutations.useDeleteRoles();
  const { mutate: editRoles, isPending: isEditLoading } = Mutations.useEditRoles();

  const allRoles = useMemo(() => rolesData?.data?.role_data.map((roles) => ({ ...roles, id: roles?._id })) || [], [rolesData]);
  const totalRows = rolesData?.data?.totalData || 0;

  const handleDeleteBtn = () => {
    if (!rowToDelete) return;
    deleteRolesMutate(rowToDelete?._id as string, { onSuccess: () => setRowToDelete(null) });
  };

  const handleAdd = () => {
    setEdit({} as RolesBase);
    setOpenModal(!openModal);
  };

  const handleEdit = (row: RolesBase) => {
    setEdit(row);
    setOpenModal(!openModal);
  };

  const columns: GridColDef<RolesBase>[] = [
    { field: "name", headerName: "Roles Name", flex: 1 },
    CommonActionColumn({
      active: (row) => editRoles({ roleId: row?._id, isActive: !row.isActive }),
      onEdit: (row) => handleEdit(row),
      onDelete: (row) => setRowToDelete({ _id: row?._id, title: row?.name }),
    }),
  ];

  const CommonDataGridOption = {
    columns,
    rows: allRoles,
    rowCount: totalRows,
    loading: rolesDataLoading || rolesDataFetching || isEditLoading,
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
      <CommonCard title={PAGE_TITLE.ROLES.BASE}>
        <CommonDataGrid {...CommonDataGridOption} />
      </CommonCard>
      <CommonDeleteModal open={Boolean(rowToDelete)} itemName={rowToDelete?.title} onClose={() => setRowToDelete(null)} onConfirm={() => handleDeleteBtn()} />
      <RolesFormModal openModal={openModal} setOpenModal={setOpenModal} isEdit={isEdit} />
    </>
  );
};

export default UserRoles;
