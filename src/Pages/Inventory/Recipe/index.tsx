import { Box } from "@mui/material";
import { useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { Mutations, Queries } from "../../../Api";
import { CommonActionColumn, CommonBreadcrumbs, CommonCard, CommonDataGrid, CommonDeleteModal } from "../../../Components/Common";
import { PAGE_TITLE, ROUTES } from "../../../Constants";
import { BREADCRUMBS } from "../../../Data";
import type { AppGridColDef } from "../../../Types";
import { useDataGrid, usePagePermission } from "../../../Utils/Hooks";

import { FormatDate } from "../../../Utils";
import type { RecipeBase } from "../../../Types/Recipe";

const Recipe = () => {
  const { paginationModel, setPaginationModel, sortModel, setSortModel, filterModel, setFilterModel, rowToDelete, setRowToDelete, isActive, setActive, params } = useDataGrid();

  const navigate = useNavigate();
  const permission = usePagePermission(PAGE_TITLE.INVENTORY.RECIPE.BASE);

  const { data, isLoading, isFetching } = Queries.useGetRecipe(params);
  const { mutate: deleteRecipe, isPending: isDeleteLoading } = Mutations.useDeleteRecipe();
  const { mutate: editRecipe, isPending: isEditLoading } = Mutations.useEditRecipe();
  const rows = useMemo(() => {
    return (
      data?.data?.recipe_data.map((r) => ({
        ...r,
        id: r?._id,
        rawProducts: r.rawProducts || [],
        finalProducts: r.finalProducts || {},
      })) || []
    );
  }, [data]);

  const totalRows = data?.data?.totalData || 0;

  const handleAdd = () => navigate(ROUTES.RECIPE.ADD_EDIT);

  const handleDelete = () => {
    if (!rowToDelete) return;
    deleteRecipe(rowToDelete?._id as string, {
      onSuccess: () => setRowToDelete(null),
    });
  };

  const columns: AppGridColDef<RecipeBase>[] = [
    { field: "number", headerName: "Recipe No", width: 200 },
    { field: "name", headerName: "Recipe Name", width: 270 },
    { field: "date", headerName: "Recipe Date", width: 220, valueGetter: (v) => FormatDate(v) },
    { field: "type", headerName: "Recipe Type", minWidth: 150, flex: 1 },
    ...(permission?.edit || permission?.delete
      ? [
          CommonActionColumn<RecipeBase>({
            ...(permission?.edit && {
              active: (row) => editRecipe({ recipeId: row._id, isActive: !row.isActive }),
              editRoute: ROUTES.RECIPE.ADD_EDIT,
            }),
            ...(permission?.delete && { onDelete: (row) => setRowToDelete({ _id: row?._id, title: row?.name }) }),
          }),
        ]
      : []),
  ];

  const gridOptions = {
    columns,
    rows,
    rowCount: totalRows,
    loading: isLoading || isFetching || isEditLoading,
    isActive,
    setActive,
    ...(permission?.add && { handleAdd }),
    paginationModel,
    onPaginationModelChange: setPaginationModel,
    sortModel,
    onSortModelChange: setSortModel,
    filterModel,
    onFilterModelChange: setFilterModel,
  };

  return (
    <>
      <CommonBreadcrumbs title={PAGE_TITLE.INVENTORY.RECIPE.BASE} maxItems={1} breadcrumbs={BREADCRUMBS.RECIPE.BASE} />

      <Box sx={{ p: { xs: 2, md: 3 }, display: "grid", gap: 2 }}>

        <CommonCard hideDivider>
          <CommonDataGrid {...gridOptions} />
        </CommonCard>

        <CommonDeleteModal open={Boolean(rowToDelete)} itemName={rowToDelete?.title} loading={isDeleteLoading} onClose={() => setRowToDelete(null)} onConfirm={handleDelete} />
      </Box>
    </>
  );
};

export default Recipe;
