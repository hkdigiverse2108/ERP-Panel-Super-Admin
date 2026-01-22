import { Box } from "@mui/material";
import { useMemo } from "react";
import { useDispatch } from "react-redux";
import { Mutations, Queries } from "../../Api";
import { CommonActionColumn, CommonBreadcrumbs, CommonCard, CommonDataGrid, CommonDeleteModal } from "../../Components/Common";
import { PAGE_TITLE } from "../../Constants";
import { BREADCRUMBS } from "../../Data";
import { setModuleModal } from "../../Store/Slices/ModalSlice";
import type { AppGridColDef, RoleBase } from "../../Types";
import { useDataGrid } from "../../Utils/Hooks";
import ModuleForm from "./ModuleForm";

const Module = () => {
  const { paginationModel, setPaginationModel, sortModel, setSortModel, filterModel, setFilterModel, rowToDelete, setRowToDelete, isActive, setActive, params } = useDataGrid();
  const dispatch = useDispatch();

  const { data: ModuleData, isLoading: ModuleDataLoading, isFetching: ModuleDataFetching } = Queries.useGetRole(params);

  const { mutate: deleteModuleMutate } = Mutations.useDeleteRole();
  const { mutate: editModule, isPending: isEditLoading } = Mutations.useEditRole();

  const allModule = useMemo(() => ModuleData?.data?.role_data.map((module) => ({ ...module, id: module?._id })) || [], [ModuleData]);
  const totalRows = ModuleData?.data?.totalData || 0;

  const handleDeleteBtn = () => {
    if (!rowToDelete) return;
    deleteModuleMutate(rowToDelete?._id as string, { onSuccess: () => setRowToDelete(null) });
  };

  const handleAdd = () => dispatch(setModuleModal({ open: true, data: null }));

  const handleEdit = (row: RoleBase) => dispatch(setModuleModal({ open: true, data: row }));

  const columns: AppGridColDef<RoleBase>[] = [
    { field: "name", headerName: "Name",flex:1, minWidth: 300 },
    CommonActionColumn({
      active: (row) => editModule({ RoleId: row?._id, isActive: !row.isActive }),
      onEdit: (row) => handleEdit(row),
      onDelete: (row) => setRowToDelete({ _id: row?._id, title: row?.name }),
    }),
  ];

  const CommonDataGridOption = {
    columns,
    rows: allModule,
    rowCount: totalRows,
    loading: ModuleDataLoading || ModuleDataFetching || isEditLoading,
    isActive,
    setActive,
    handleAdd,
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
      <CommonBreadcrumbs title={PAGE_TITLE.MODULE.BASE} maxItems={1} breadcrumbs={BREADCRUMBS.MODULE.BASE} />
      <Box sx={{ p: { xs: 2, md: 3 }, display: "grid"}}>
        <CommonCard hideDivider>
          <CommonDataGrid {...CommonDataGridOption} />
        </CommonCard>
        <CommonDeleteModal open={Boolean(rowToDelete)} itemName={rowToDelete?.title} onClose={() => setRowToDelete(null)} onConfirm={() => handleDeleteBtn()} />
        <ModuleForm />
      </Box>
    </>
  );
};

export default Module;
