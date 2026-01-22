import { Box } from "@mui/material";
import { useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { Mutations, Queries } from "../../Api";
import { CommonActionColumn, CommonBreadcrumbs, CommonCard, CommonDataGrid, CommonDeleteModal } from "../../Components/Common";
import { PAGE_TITLE, ROUTES } from "../../Constants";
import { BREADCRUMBS } from "../../Data";
import type { AppGridColDef, RoleBase } from "../../Types";
import { useDataGrid } from "../../Utils/Hooks";
import ModuleForm from "./ModuleForm";

const Module = () => {
  const { paginationModel, setPaginationModel, sortModel, setSortModel, filterModel, setFilterModel, rowToDelete, setRowToDelete, isActive, setActive, params } = useDataGrid();
    const navigate = useNavigate();

  const { data: ModuleData, isLoading: ModuleDataLoading, isFetching: ModuleDataFetching } = Queries.useGetRole(params);

  const { mutate: deleteModuleMutate } = Mutations.useDeleteRole();
  const { mutate: editModule, isPending: isEditLoading } = Mutations.useEditRole();

  const allModule = useMemo(() => ModuleData?.data?.role_data.map((module) => ({ ...module, id: module?._id })) || [], [ModuleData]);
  const totalRows = ModuleData?.data?.totalData || 0;

  const handleDeleteBtn = () => {
    if (!rowToDelete) return;
    deleteModuleMutate(rowToDelete?._id as string, { onSuccess: () => setRowToDelete(null) });
  };

  const handleAdd = () => navigate(ROUTES.MODULE.ADD_EDIT);

  const columns: AppGridColDef<RoleBase>[] = [
    { field: "name", headerName: "Name",flex:1, minWidth: 300 },
    CommonActionColumn({
      active: (row) => editModule({ RoleId: row?._id, isActive: !row.isActive }),
      editRoute: ROUTES.MODULE.ADD_EDIT,
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
