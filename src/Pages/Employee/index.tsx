import { Box, Grid } from "@mui/material";
import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Mutations, Queries } from "../../Api";
import { AdvancedSearch, CommonActionColumn, CommonBreadcrumbs, CommonCard, CommonDataGrid, CommonDeleteModal, CommonPhoneColumns } from "../../Components/Common";
import { PAGE_TITLE, ROUTES } from "../../Constants";
import { BREADCRUMBS, PRODUCT_TYPE_OPTIONS } from "../../Data";
import type { AppGridColDef, EmployeeBase } from "../../Types";
import { useDataGrid } from "../../Utils/Hooks";
import { CommonSelect } from "../../Attribute";

const Employee = () => {
  const { paginationModel, setPaginationModel, sortModel, setSortModel, filterModel, setFilterModel, rowToDelete, setRowToDelete, isActive, setActive, params } = useDataGrid();
  const navigate = useNavigate();
  const [value, setValue] = useState<string[]>([]);

  const { data: employeeData, isLoading: employeeDataLoading, isFetching: employeeDataFetching } = Queries.useGetEmployee(params);
  const { mutate: deleteEmployeeMutate } = Mutations.useDeleteEmployee();
  const { mutate: editEmployee, isPending: isEditLoading } = Mutations.useEditEmployee();

  const allEmployee = useMemo(() => employeeData?.data?.user_data.map((emp) => ({ ...emp, id: emp?._id })) || [], [employeeData]);
  const totalRows = employeeData?.data?.totalData || 0;

  const handleDeleteBtn = () => {
    if (!rowToDelete) return;
    deleteEmployeeMutate(rowToDelete?._id as string, { onSuccess: () => setRowToDelete(null) });
  };

  const handleAdd = () => navigate(ROUTES.EMPLOYEE.ADD_EDIT);

  const columns: AppGridColDef<EmployeeBase>[] = [
    { field: "username", headerName: "User Name", type: "string", width: 170 },
    { field: "fullName", headerName: "Full Name", width: 170 },
    { field: "designation", headerName: "designation", width: 170 },
    { field: "email", headerName: "Email", width: 240 },
    CommonPhoneColumns<EmployeeBase>(),
    { field: "panNumber", headerName: "PAN Number", width: 150 },
    { field: "wages", headerName: "Wages", type: "number", width: 150 },
    { field: "extraWages", headerName: "Extra Wages", type: "number", width: 150 },
    { field: "commission", headerName: "Commission", type: "number", flex: 1, minWidth: 150 },
    CommonActionColumn({
      active: (row) => editEmployee({ userId: row?._id, companyId: row?.companyId?._id, isActive: !row.isActive }),
      editRoute: ROUTES.EMPLOYEE.ADD_EDIT,
      onDelete: (row) => setRowToDelete({ _id: row?._id, title: row?.username }),
    }),
  ];

  const CommonDataGridOption = {
    columns,
    rows: allEmployee,
    rowCount: totalRows,
    loading: employeeDataLoading || employeeDataFetching || isEditLoading,
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
      <CommonBreadcrumbs title={PAGE_TITLE.EMPLOYEE.BASE} maxItems={1} breadcrumbs={BREADCRUMBS.EMPLOYEE.BASE} />
      <Box sx={{ p: { xs: 2, md: 3 }, display: "grid", gap: 2 }}>
        <AdvancedSearch>
          <Grid size={{ xs: 12, xsm: 6, sm: 3, xxl: 2 }}>
            <CommonSelect label="Select Location" options={PRODUCT_TYPE_OPTIONS} value={value} onChange={(v) => setValue(v)} limitTags={1} multiple />
          </Grid>
        </AdvancedSearch>
        <CommonCard hideDivider>
          <CommonDataGrid {...CommonDataGridOption} />
        </CommonCard>
        <CommonDeleteModal open={Boolean(rowToDelete)} itemName={rowToDelete?.title} onClose={() => setRowToDelete(null)} onConfirm={() => handleDeleteBtn()} />
      </Box>
    </>
  );
};

export default Employee;
