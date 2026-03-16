import { Box, Grid } from "@mui/material";
import { useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { Mutations, Queries } from "../../../Api";
import { AdvancedSearch, CommonActionColumn, CommonBreadcrumbs, CommonCard, CommonDataGrid, CommonDeleteModal, CommonObjectNameColumn } from "../../../Components/Common";
import { PAGE_TITLE, ROUTES } from "../../../Constants";
import { BREADCRUMBS } from "../../../Data";
import type { AppGridColDef, ExpenseBase } from "../../../Types";
import type { GridRenderCellParams } from "@mui/x-data-grid";
import { useDataGrid, usePagePermission } from "../../../Utils/Hooks";
import { CreateFilter, FormatDate, GenerateOptions } from "../../../Utils";
import { CommonButton } from "../../../Attribute";

const Expense = () => {
  const { paginationModel, setPaginationModel, sortModel, setSortModel, filterModel, setFilterModel, rowToDelete, setRowToDelete, isActive, setActive, params, advancedFilter, updateAdvancedFilter } = useDataGrid();

  const navigate = useNavigate();
  const permission = usePagePermission(PAGE_TITLE.EXPENSE.BASE);
  const permissionSalary = usePagePermission(PAGE_TITLE.SALARY.BASE);

  const { data, isLoading, isFetching } = Queries.useGetExpense({ ...params, avoidSalary: false });
  const { data: CompanyData, isLoading: CompanyDataLoading } = Queries.useGetCompanyDropdown();
  const { mutate: deletePayment, isPending: isDeleteLoading } = Mutations.useDeletePosPayment();
  const { mutate: editPayment, isPending: isEditLoading } = Mutations.useEditPosPayment();

  const { mutate: deleteSalary, isPending: isDeleteSalaryLoading } = Mutations.useDeleteSalary();
  const { mutate: editSalary, isPending: isEditSalaryLoading } = Mutations.useEditSalary();
  const rows = useMemo(() => {
    return data?.data?.expense_data.map((r) => ({ ...r, id: r?._id })) || [];
  }, [data]);

  const totalRows = data?.data?.totalData || 0;

  const handleAdd = () => navigate(ROUTES.EXPENSE.ADD_EDIT);

  const handleSalary = () => navigate(ROUTES.SALARY.ADD_EDIT, { state: { companyId: advancedFilter?.companyFilter?.[0] } });

  const handleDelete = () => {
    if (!rowToDelete) return;
    const isSalary = (rowToDelete as ExpenseBase).isSalary || (rowToDelete as any).isSalary;
    const mutate = isSalary ? deleteSalary : deletePayment;
    mutate(rowToDelete?._id as string, {
      onSuccess: () => setRowToDelete(null),
    });
  };

  const columns: AppGridColDef<ExpenseBase>[] = [
    CommonObjectNameColumn<ExpenseBase>("companyId", { headerName: "Company", width: 200 }),
    { field: "salary", headerName: "Salary", width: 200, valueGetter: (_v, row: ExpenseBase) => (row?.isSalary ? row?.total : "-") },
    {
      field: "partyId",
      headerName: "Party Name",
      width: 230,
      valueGetter: (_v, row: ExpenseBase) => {
        const party = row?.partyId;
        if (!party) return "-";
        if ("fullName" in party) {
          return party.fullName;
        }
        if ("firstName" in party) {
          return `${party.firstName ?? ""} ${party.lastName ?? ""}`;
        }
        return "-";
      },
    },
    { field: "fromDate", headerName: "Expense Date", width: 190, valueGetter: (v) => FormatDate(v) },
    { field: "amount", headerName: "Amount", width: 200 },
    { field: "description", headerName: "Description", width: 200 },
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
                active: (row) => editPayment({ posPaymentId: row?._id, isActive: !row.isActive }),
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
  };

  const filter = [CreateFilter("Select Company", "companyFilter", advancedFilter, updateAdvancedFilter, GenerateOptions(CompanyData?.data), CompanyDataLoading, { xs: 12, sm: 6, md: 3 })];

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
