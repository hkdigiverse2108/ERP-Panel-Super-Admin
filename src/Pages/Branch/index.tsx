import { Box } from "@mui/material";
import type { GridColDef } from "@mui/x-data-grid";
import { useMemo } from "react";
import { Mutations, Queries } from "../../Api";
import { AdvancedSearch, CommonActionColumn, CommonBreadcrumbs, CommonCard, CommonDataGrid, CommonDeleteModal, CommonObjectNameColumn } from "../../Components/Common";
import { PAGE_TITLE, ROUTES } from "../../Constants";
import { BREADCRUMBS } from "../../Data";
import type { BranchBase } from "../../Types";
import { useDataGrid, usePagePermission } from "../../Utils/Hooks";
import { useNavigate } from "react-router-dom";
import { CreateFilter, GenerateOptions } from "../../Utils";
import { CommonObjectPropertyColumn } from "../../Components/Common/CommonDataGrid/CommonColumns";

const Branch = () => {
  const { paginationModel, setPaginationModel, sortModel, setSortModel, filterModel, setFilterModel, rowToDelete, setRowToDelete, isActive, setActive, params, advancedFilter, updateAdvancedFilter } = useDataGrid();
  const navigate = useNavigate();
  const permission = usePagePermission(PAGE_TITLE.BRANCH.BASE);

  const { refetch: fetchAll, isFetching: AllFetching, isLoading: AllLoading } = Queries.useGetBranch({}, false);
  const { data: branchData, isLoading: branchDataLoading, isFetching: branchDataFetching } = Queries.useGetBranch(params);
  const { mutate: deleteBranchMutate } = Mutations.useDeleteBranch();
  const { data: CompanyData, isLoading: CompanyDataLoading } = Queries.useGetCompanyDropdown();
  const { mutate: editBranch, isPending: isEditLoading } = Mutations.useEditBranch();

  const allBranches = useMemo(() => branchData?.data?.branch_data.map((branch) => ({ ...branch, id: branch?._id })) || [], [branchData]);
  const totalRows = branchData?.data?.totalData || 0;

  const handleDeleteBtn = () => {
    if (!rowToDelete) return;
    deleteBranchMutate(rowToDelete?._id as string, { onSuccess: () => setRowToDelete(null) });
  };

  const handleAdd = () => navigate(ROUTES.BRANCH.ADD_EDIT);

  const columns: GridColDef<BranchBase>[] = [
    CommonObjectNameColumn<BranchBase>("companyId", { headerName: "Company", width: 200 }),
    { field: "name", headerName: "Branch Name", width: 200 },
    { field: "displayName", headerName: "Display Name", width: 200 },
    { field: "userName", headerName: "User Name", width: 200 },
    { field: "contactName", headerName: "Contact Name", width: 250 },
    { field: "email", headerName: "Email", flex: 1, minWidth: 200 },
    CommonObjectPropertyColumn<BranchBase>("createdBy", "createdBy", ["fullName"], { headerName: "Created By", flex: 1, minWidth: 150 }),

    ...(permission?.edit || permission?.delete
      ? [
          CommonActionColumn<BranchBase>({
            ...(permission?.edit && {
              active: (row) => editBranch({ branchId: row?._id, isActive: !row.isActive }),
              editRoute: ROUTES.BRANCH.ADD_EDIT,
            }),
            ...(permission?.delete && { onDelete: (row) => setRowToDelete({ _id: row?._id, title: row?.name }) }),
          }),
        ]
      : []),
  ];

  const CommonDataGridOption = {
    columns,
    rows: allBranches,
    rowCount: totalRows,
    loading: branchDataLoading || branchDataFetching || isEditLoading,
    isActive,
    setActive,
    ...(permission?.add && { handleAdd }),
    paginationModel,
    onPaginationModelChange: setPaginationModel,
    sortModel,
    onSortModelChange: setSortModel,
    filterModel,
    onFilterModelChange: setFilterModel,
    fileName: PAGE_TITLE.BRANCH.BASE,
    onExportAll: { onExportAll: fetchAll, isFetching: AllLoading || AllFetching },
  };
  const filter = [CreateFilter("Select Company", "companyFilter", advancedFilter, updateAdvancedFilter, GenerateOptions(CompanyData?.data), CompanyDataLoading, { xs: 12, sm: 6, md: 3 })];

  return (
    <>
      <CommonBreadcrumbs title={PAGE_TITLE.BRANCH.BASE} maxItems={1} breadcrumbs={BREADCRUMBS.BRANCH.BASE} />
      <Box sx={{ p: { xs: 2, md: 3 }, display: "grid" }}>
        <AdvancedSearch filter={filter} />

        <CommonCard hideDivider>
          <CommonDataGrid {...CommonDataGridOption} />
        </CommonCard>
        <CommonDeleteModal open={Boolean(rowToDelete)} itemName={rowToDelete?.title} onClose={() => setRowToDelete(null)} onConfirm={() => handleDeleteBtn()} />
      </Box>
    </>
  );
};

export default Branch;
