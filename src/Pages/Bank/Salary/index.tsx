import { Box } from "@mui/material";
import { useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { Mutations, Queries } from "../../../Api";
import { AdvancedSearch, CommonActionColumn, CommonBreadcrumbs, CommonCard, CommonDataGrid, CommonDeleteModal, CommonObjectNameColumn } from "../../../Components/Common";
import { PAGE_TITLE, ROUTES } from "../../../Constants";
import { BREADCRUMBS } from "../../../Data";
import type { AppGridColDef, SalaryBase } from "../../../Types";
import { useDataGrid, usePagePermission } from "../../../Utils/Hooks";
import { CreateFilter, FormatDate, GenerateOptions } from "../../../Utils";

const Salary = () => {
  const { paginationModel, setPaginationModel, sortModel, setSortModel, filterModel, setFilterModel, rowToDelete, setRowToDelete, isActive, setActive, params, advancedFilter, updateAdvancedFilter } = useDataGrid();

  const navigate = useNavigate();
  const permission = usePagePermission(PAGE_TITLE.SALARY.BASE);

  const { data, isLoading, isFetching } = Queries.useGetSalary(params);
  const { data: CompanyData, isLoading: CompanyDataLoading } = Queries.useGetCompanyDropdown();
  const { mutate: deleteSalary, isPending: isDeleteLoading } = Mutations.useDeleteSalary();
  const { mutate: editSalary, isPending: isEditLoading } = Mutations.useEditSalary();
  const rows = useMemo(() => {
    return data?.data?.salary_data.map((r) => ({ ...r, id: r?._id })) || [];
  }, [data]);

  const totalRows = data?.data?.totalData || 0;

  const handleAdd = () => navigate(ROUTES.SALARY.ADD_EDIT);

  const handleDelete = () => {
    if (!rowToDelete) return;
    deleteSalary(rowToDelete?._id as string, {
      onSuccess: () => setRowToDelete(null),
    });
  };

  const columns: AppGridColDef<SalaryBase>[] = [
    CommonObjectNameColumn<SalaryBase>("companyId", { headerName: "Company", width: 200 }),
    CommonObjectNameColumn<SalaryBase>("partyId", { headerName: "Party Name", width: 200 }),
    { field: "fromDate", headerName: "From Date", width: 190, valueGetter: (v) => FormatDate(v) },
    { field: "toDate", headerName: "To Date", width: 190, valueGetter: (v) => FormatDate(v) },
    { field: "amount", headerName: "Amount", width: 200 },
    { field: "incentive", headerName: "Incentive", width: 200 },
    { field: "description", headerName: "Description", flex: 1, minWidth: 200 },

    ...(permission?.edit || permission?.delete
      ? [
          CommonActionColumn<SalaryBase>({
            ...(permission?.edit && {
              active: (row) => editSalary({ salaryId: row?._id, isActive: !row.isActive }),
              editRoute: ROUTES.SALARY.ADD_EDIT,
            }),
            ...(permission?.delete && { onDelete: (row) => setRowToDelete({ _id: row?._id, title: row?.description }) }),
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

  const filter = [CreateFilter("Select Company", "companyFilter", advancedFilter, updateAdvancedFilter, GenerateOptions(CompanyData?.data), CompanyDataLoading, { xs: 12, sm: 6, md: 3 })];

  return (
    <>
      <CommonBreadcrumbs title={PAGE_TITLE.SALARY.BASE} maxItems={1} breadcrumbs={BREADCRUMBS.SALARY.BASE} />

      <Box sx={{ p: { xs: 2, md: 3 }, display: "grid", gap: 2 }}>
        <AdvancedSearch filter={filter} />
        <CommonCard hideDivider>
          <CommonDataGrid {...gridOptions} />
        </CommonCard>

        <CommonDeleteModal open={Boolean(rowToDelete)} itemName={rowToDelete?.title} loading={isDeleteLoading} onClose={() => setRowToDelete(null)} onConfirm={handleDelete} />
      </Box>
    </>
  );
};

export default Salary;
