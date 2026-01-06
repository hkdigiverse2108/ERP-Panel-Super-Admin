import { Box } from "@mui/material";
import type { GridColDef } from "@mui/x-data-grid";
import { useMemo } from "react";
import { Mutations, Queries } from "../../Api";
import { CommonActionColumn, CommonBreadcrumbs, CommonCard, CommonDataGrid, CommonDeleteModal } from "../../Components/Common";
import { PAGE_TITLE, ROUTES } from "../../Constants";
import { BREADCRUMBS } from "../../Data";
import type { BranchBase } from "../../Types";
import { useDataGrid } from "../../Utils/Hooks";
import { useNavigate } from "react-router-dom";

const Branch = () => {
  const { paginationModel, setPaginationModel, sortModel, setSortModel, filterModel, setFilterModel, rowToDelete, setRowToDelete, isActive, setActive, params } = useDataGrid();
  const navigate = useNavigate();

  const { data: branchData, isLoading: branchDataLoading, isFetching: branchDataFetching } = Queries.useGetBranch(params);
  const { mutate: deleteBranchMutate } = Mutations.useDeleteBranch();
  const { mutate: editBranch, isPending: isEditLoading } = Mutations.useEditBranch();

  const allBranches = useMemo(() => branchData?.data?.branch_data.map((branch) => ({ ...branch, id: branch?._id })) || [], [branchData]);
  const totalRows = branchData?.data?.totalData || 0;

  const handleDeleteBtn = () => {
    if (!rowToDelete) return;
    deleteBranchMutate(rowToDelete?._id as string, { onSuccess: () => setRowToDelete(null) });
  };

  const handleAdd = () => navigate(ROUTES.BRANCH.ADD_EDIT);

  const columns: GridColDef<BranchBase>[] = [
    { field: "name", headerName: "Branch Name", flex: 1 },
    { field: "address", headerName: "Address", flex: 2 },
    CommonActionColumn({
      active: (row) => editBranch({ branchId: row?._id, isActive: !row.isActive }),
      editRoute: ROUTES.BRANCH.ADD_EDIT,
      onDelete: (row) => setRowToDelete({ _id: row?._id, title: row?.name }),
    }),
  ];

  const CommonDataGridOption = {
    columns,
    rows: allBranches,
    rowCount: totalRows,
    loading: branchDataLoading || branchDataFetching || isEditLoading,
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
      <CommonBreadcrumbs title={PAGE_TITLE.BRANCH.BASE} maxItems={1} breadcrumbs={BREADCRUMBS.BRANCH.BASE} />
      <Box sx={{ p: { xs: 2, md: 3 } }}>
        <CommonCard hideDivider>
          <CommonDataGrid {...CommonDataGridOption} />
        </CommonCard>
        <CommonDeleteModal open={Boolean(rowToDelete)} itemName={rowToDelete?.title} onClose={() => setRowToDelete(null)} onConfirm={() => handleDeleteBtn()} />
      </Box>
    </>
  );
};

export default Branch;
