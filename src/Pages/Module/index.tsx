import { Box } from "@mui/material";
import { useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { Mutations, Queries } from "../../Api";
import { AdvancedSearch, CommonActionColumn, CommonBreadcrumbs, CommonCard, CommonDataGrid, CommonDeleteModal } from "../../Components/Common";
import { PAGE_TITLE, ROUTES } from "../../Constants";
import { BREADCRUMBS } from "../../Data";
import type { AppGridColDef, ModuleBase } from "../../Types";
import { useDataGrid, usePagePermission } from "../../Utils/Hooks";
import { CommonObjectPropertyColumn } from "../../Components/Common/CommonDataGrid/CommonColumns";
import { CreateFilter, GenerateOptions } from "../../Utils";

const Module = () => {
  const { paginationModel, setPaginationModel, sortModel, setSortModel, filterModel, setFilterModel, rowToDelete, setRowToDelete, isActive, setActive,advancedFilter, updateAdvancedFilter, params } = useDataGrid();
  const navigate = useNavigate();
  const permission = usePagePermission(PAGE_TITLE.MODULE.BASE);

  const { data: ModuleData, isLoading: ModuleDataLoading, isFetching: ModuleDataFetching } = Queries.useGetModule(params);
  const { data: ModuleListData, isLoading: ModuleLoading} = Queries.useGetModule();

  const { mutate: deleteModuleMutate } = Mutations.useDeleteModule();
  const { mutate: editModule, isPending: isEditLoading } = Mutations.useEditModule();

  const allModule = useMemo(() => ModuleData?.data?.module_data.map((module) => ({ ...module, id: module?._id })) || [], [ModuleData]);
  const totalRows = ModuleData?.data?.totalData || 0;

  const handleDeleteBtn = () => {
    if (!rowToDelete) return;
    deleteModuleMutate(rowToDelete?._id as string, { onSuccess: () => setRowToDelete(null) });
  };

  const handleAdd = () => navigate(ROUTES.MODULE.ADD_EDIT);

  const columns: AppGridColDef<ModuleBase>[] = [
    { field: "tabName", headerName: "Tab Name", width: 200 },
    { field: "displayName", headerName: "Display Name", width: 200 },
    { field: "tabUrl", headerName: "Tab URL", width: 200 },
    CommonObjectPropertyColumn<ModuleBase>("Parent", "parentId", "tabName", { headerName: "Parent Name", width: 150 }),
    { field: "number", headerName: "Number", width: 80 },
    { field: "hasAdd", headerName: "Add", width: 85, headerAlign: "center", align: "center", renderCell: (params) => (params.value ? "✅ Add" : "❌ Add") },
    { field: "hasEdit", headerName: "Edit", width: 85, headerAlign: "center", align: "center", renderCell: (params) => (params.value ? "✅ Edit" : "❌ Edit") },
    { field: "hasDelete", headerName: "Delete", width: 90, headerAlign: "center", align: "center", renderCell: (params) => (params.value ? "✅ Delete" : "❌ Delete") },
    { field: "hasView", headerName: "View", width: 85, headerAlign: "center", align: "center", renderCell: (params) => (params.value ? "✅ View" : "❌ View") },
    { field: "default", headerName: "Default", flex: 1, minWidth: 90, headerAlign: "center", align: "center", renderCell: (params) => (params.value ? "✅ Default" : "❌ Default") },
    ...(permission?.edit || permission?.delete
      ? [
          CommonActionColumn<ModuleBase>({
            ...(permission?.edit && {
              active: (row) => editModule({ moduleId: row?._id, isActive: !row.isActive }),
              editRoute: ROUTES.MODULE.ADD_EDIT,
            }),
            ...(permission?.delete && { onDelete: (row) => setRowToDelete({ _id: row?._id, title: row?.tabName }) }),
          }),
        ]
      : []),
  ];

  const CommonDataGridOption = {
    columns,
    rows: allModule,
    rowCount: totalRows,
    loading: ModuleDataLoading || ModuleDataFetching || isEditLoading,
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

    const filter = [
      CreateFilter("Select Module", "parentFilter", advancedFilter, updateAdvancedFilter, GenerateOptions(ModuleListData?.data?.module_data), ModuleLoading, { xs: 12, sm: 7, md: 5 }), // categoryFilter
    ];

  return (
    <>
      <CommonBreadcrumbs title={PAGE_TITLE.MODULE.BASE} maxItems={1} breadcrumbs={BREADCRUMBS.MODULE.BASE} />
      <Box sx={{ p: { xs: 2, md: 3 }, display: "grid" , gap:2}}>
         <AdvancedSearch filter={filter} defaultExpanded/>
        <CommonCard hideDivider>
          <CommonDataGrid {...CommonDataGridOption} />
        </CommonCard>
        <CommonDeleteModal open={Boolean(rowToDelete)} itemName={rowToDelete?.title} onClose={() => setRowToDelete(null)} onConfirm={() => handleDeleteBtn()} />
      </Box>
    </>
  );
};

export default Module;
