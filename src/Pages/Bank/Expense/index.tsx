import { Box, Grid } from "@mui/material";
import { useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { Mutations, Queries } from "../../../Api";
import { AdvancedSearch, CommonActionColumn, CommonBreadcrumbs, CommonCard, CommonDataGrid, CommonDeleteModal, CommonObjectNameColumn } from "../../../Components/Common";
import { PAGE_TITLE, ROUTES } from "../../../Constants";
import { BREADCRUMBS, EXPENSE_TYPE_OPTIONS } from "../../../Data";
import type { AppGridColDef, ExpenseBase } from "../../../Types";
import type { GridRenderCellParams } from "@mui/x-data-grid";
import { useDataGrid, usePagePermission } from "../../../Utils/Hooks";
import { CreateFilter, GenerateOptions } from "../../../Utils";
import { CommonButton } from "../../../Attribute";
import { CommonObjectPropertyColumn } from "../../../Components/Common/CommonDataGrid/CommonColumns";

const Expense = () => {
  const { paginationModel, setPaginationModel, sortModel, setSortModel, filterModel, setFilterModel, rowToDelete, setRowToDelete, isActive, setActive, params, advancedFilter, updateAdvancedFilter } = useDataGrid();

  const navigate = useNavigate();
  const permission = usePagePermission(PAGE_TITLE.EXPENSE.BASE);
  const permissionSalary = usePagePermission(PAGE_TITLE.SALARY.BASE);

  const { refetch: fetchAll, isFetching: AllFetching, isLoading: AllLoading } = Queries.useGetExpense({}, false);
  const { data, isLoading, isFetching } = Queries.useGetExpense({ ...params, avoidSalary: false });
  const { data: CompanyData, isLoading: CompanyDataLoading } = Queries.useGetCompanyDropdown();
  const { mutate: deleteExpense, isPending: isDeleteLoading } = Mutations.useDeleteExpense();
  const { mutate: editExpense, isPending: isEditLoading } = Mutations.useEditExpense();

  const { mutate: deleteSalary, isPending: isDeleteSalaryLoading } = Mutations.useDeleteSalary();
  const { mutate: editSalary, isPending: isEditSalaryLoading } = Mutations.useEditSalary();
  const rows = useMemo(() => data?.data?.expense_data.map((r) => ({ ...r, id: r?._id })) || [], [data]);

  const totalRows = data?.data?.totalData || 0;

  const handleAdd = () => navigate(ROUTES.EXPENSE.ADD_EDIT);

  const handleSalary = () => navigate(ROUTES.SALARY.ADD_EDIT, { state: { companyId: advancedFilter?.companyFilter?.[0] } });

  const handleDelete = () => {
    if (!rowToDelete) return;
    const isSalary = (rowToDelete as ExpenseBase).isSalary || (rowToDelete as ExpenseBase).isSalary;
    const mutate = isSalary ? deleteSalary : deleteExpense;
    mutate(rowToDelete?._id as string, {
      onSuccess: () => setRowToDelete(null),
    });
  };

  const columns: AppGridColDef<ExpenseBase>[] = [
    CommonObjectNameColumn<ExpenseBase>("companyId", { headerName: "Company", width: 200 }),
    CommonObjectPropertyColumn<ExpenseBase>("partyId", "partyId", ["fullName"], { headerName: "Party Name", flex: 1, minWidth: 150 }),
    CommonObjectPropertyColumn<ExpenseBase>("salary", "total", [], { headerName: "Salary", flex: 1, minWidth: 150 }),
    CommonObjectPropertyColumn<ExpenseBase>("fromDate", "fromDate", [], { headerName: "Expense Date", flex: 1, minWidth: 150, type: "date" }),
    { field: "amount", headerName: "Amount", flex: 1, minWidth: 150 },
    CommonObjectPropertyColumn<ExpenseBase>("type", "type", [], { headerName: "Expense Type", flex: 1, minWidth: 150, type: "format" }),
    CommonObjectPropertyColumn<ExpenseBase>("createdBy", "createdBy", ["fullName"], { headerName: "Created By", flex: 1, minWidth: 150 }),

    ...(permission?.edit || permission?.delete
      ? [
          {
            ...CommonActionColumn<ExpenseBase>({}),
            renderCell: (params: GridRenderCellParams<ExpenseBase>) => {
              const row = params.row;
              if (row?.isSalary) {
                return CommonActionColumn<ExpenseBase>({
                  ...(permissionSalary?.edit && {
                    active: (row) => editSalary({ salaryId: row?._id, isActive: !row.isActive }),
                    editRoute: ROUTES.SALARY.ADD_EDIT,
                  }),
                  ...(permissionSalary?.delete && { onDelete: (row) => setRowToDelete({ _id: row?._id, title: row?.description ?? row?.description, isSalary: true } as unknown as ExpenseBase) }),
                }).renderCell?.(params);
              }
              return CommonActionColumn<ExpenseBase>({
                ...(permission?.edit && {
                  active: (row) => editExpense({ expenseId: row?._id, isActive: !row.isActive }),
                  editRoute: ROUTES.EXPENSE.ADD_EDIT,
                }),
                ...(permission?.delete && { onDelete: (row) => setRowToDelete({ _id: row?._id, title: row?.description }) }),
              }).renderCell?.(params);
            },
          },
        ]
      : []),
  ];

  const gridOptions = {
    columns,
    rows,
    rowCount: totalRows,
    loading: isLoading || isFetching || isEditLoading || isEditSalaryLoading,
    isActive,
    setActive,
    ...(permission?.add && { handleAdd }),
    paginationModel,
    onPaginationModelChange: setPaginationModel,
    sortModel,
    onSortModelChange: setSortModel,
    filterModel,
    onFilterModelChange: setFilterModel,
    fileName: PAGE_TITLE.EXPENSE.BASE,
    onExportAll: { onExportAll: fetchAll, isFetching: AllLoading || AllFetching },
  };

  const filter = [
    CreateFilter("Select Company", "companyFilter", advancedFilter, updateAdvancedFilter, GenerateOptions(CompanyData?.data), CompanyDataLoading, { xs: 12, sm: 6, md: 3 }), //
    CreateFilter("Select Expense Type", "typeFilter", advancedFilter, updateAdvancedFilter, EXPENSE_TYPE_OPTIONS, false, { xs: 12, sm: 6, md: 3 }),
  ];

  const topContent = (
    <Grid size={"auto"}>
      <Grid container spacing={1}>
        {permissionSalary?.add && (
          <Grid size={"auto"}>
            <CommonButton variant="contained" title="Add Salary" size="medium" onClick={handleSalary} disabled={!advancedFilter?.companyFilter?.length} />
          </Grid>
        )}
      </Grid>
    </Grid>
  );
  return (
    <>
      <CommonBreadcrumbs title={PAGE_TITLE.EXPENSE.BASE} maxItems={1} breadcrumbs={BREADCRUMBS.EXPENSE.BASE} />

      <Box sx={{ p: { xs: 2, md: 3 }, display: "grid", gap: 2 }}>
        <AdvancedSearch filter={filter} />
        <CommonCard title={PAGE_TITLE.SALARY.BASE} topContent={topContent}>
          <CommonDataGrid {...gridOptions} />
        </CommonCard>

        <CommonDeleteModal open={Boolean(rowToDelete)} itemName={rowToDelete?.title} loading={isDeleteLoading || isDeleteSalaryLoading} onClose={() => setRowToDelete(null)} onConfirm={handleDelete} />
      </Box>
    </>
  );
};

export default Expense;
