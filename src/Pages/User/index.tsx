import { Box, Grid } from "@mui/material";
import { useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { Mutations, Queries } from "../../Api";
import { AdvancedSearch, CommonActionColumn, CommonBreadcrumbs, CommonCard, CommonDataGrid, CommonDeleteModal, CommonObjectNameColumn } from "../../Components/Common";
import { PAGE_TITLE, ROUTES } from "../../Constants";
import { BREADCRUMBS } from "../../Data";
import type { AppGridColDef, UserBase } from "../../Types";
import { useDataGrid, usePagePermission } from "../../Utils/Hooks";
import { CreateFilter, GenerateOptions } from "../../Utils";
import { CommonObjectPropertyColumn } from "../../Components/Common/CommonDataGrid/CommonColumns";

const User = () => {
  const { paginationModel, setPaginationModel, sortModel, setSortModel, filterModel, setFilterModel, rowToDelete, setRowToDelete, isActive, setActive, params, advancedFilter, updateAdvancedFilter } = useDataGrid();
  const navigate = useNavigate();
  const permission = usePagePermission(PAGE_TITLE.USER.BASE);

  const { data: userData, isLoading: userDataLoading, isFetching: userDataFetching } = Queries.useGetUser(params);
  const { data: CompanyData, isLoading: CompanyDataLoading } = Queries.useGetCompanyDropdown();
  const { mutate: deleteUserMutate } = Mutations.useDeleteUser();
  const { mutate: editUser, isPending: isEditLoading } = Mutations.useEditUser();

  const allUser = useMemo(() => userData?.data?.user_data.map((user: UserBase) => ({ ...user, id: user?._id })) || [], [userData]);
  const totalRows = userData?.data?.totalData || 0;

  const handleDeleteBtn = () => {
    if (!rowToDelete) return;
    deleteUserMutate(rowToDelete?._id as string, { onSuccess: () => setRowToDelete(null) });
  };

  const handleAdd = () => navigate(ROUTES.USER.ADD_EDIT);
  const columns: AppGridColDef<UserBase>[] = [
    CommonObjectNameColumn<UserBase>("companyId", { headerName: "Company", width: 200 }),
    { field: "username", headerName: "User Name", type: "string", width: 170 },
    { field: "fullName", headerName: "Full Name", width: 170 },
    { field: "designation", headerName: "Designation", width: 170 },
    { field: "email", headerName: "Email", width: 240 },
    CommonObjectPropertyColumn<UserBase>("phoneNo", "phoneNo", ["countryCode", "phoneNo"], { headerName: "Phone No", width: 150, type: "phone" }),
    { field: "panNumber", headerName: "PAN Number",flex:1, minWidth: 150 },
    // { field: "wages", headerName: "Wages", type: "number", width: 150 },
    // { field: "extraWages", headerName: "Extra Wages", type: "number", width: 150 },
    // { field: "commission", headerName: "Commission", type: "number", flex: 1, minWidth: 150 },
    ...(permission?.edit || permission?.delete
      ? [
          CommonActionColumn<UserBase>({
            ...(permission?.edit && {
              permissionRoute: ROUTES.USER.PERMISSION_ADD_EDIT,
              active: (row) => editUser({ userId: row?._id, companyId: row?.companyId?._id, isActive: !row.isActive }),
              editRoute: ROUTES.USER.ADD_EDIT,
            }),
            ...(permission?.delete && { onDelete: (row) => setRowToDelete({ _id: row?._id, title: row?.username }) }),
          }),
        ]
      : []),
  ];

  const CommonDataGridOption = {
    columns,
    rows: allUser,
    rowCount: totalRows,
    loading: userDataLoading || userDataFetching || isEditLoading,
    isActive,
    setActive,
    ...(permission?.add && { handleAdd }),
    paginationModel,
    onPaginationModelChange: setPaginationModel,
    sortModel,
    onSortModelChange: setSortModel,
    filterModel,
    onFilterModelChange: setFilterModel,
    fileName:PAGE_TITLE.USER.BASE,
  };
  const filter = [CreateFilter("Select Company", "companyFilter", advancedFilter, updateAdvancedFilter, GenerateOptions(CompanyData?.data), CompanyDataLoading, { xs: 12, sm: 6, md: 3 })];
  return (
    <>
      <CommonBreadcrumbs title={PAGE_TITLE.USER.BASE} maxItems={1} breadcrumbs={BREADCRUMBS.USER.BASE} />
      <Box sx={{ p: { xs: 2, md: 3 }, display: "grid", gap: 2 }}>
        <AdvancedSearch filter={filter} />
        <Grid size={{ xs: 12, xsm: 6, sm: 3, xxl: 2 }}></Grid>
        <CommonCard hideDivider>
          <CommonDataGrid {...CommonDataGridOption} />
        </CommonCard>
        <CommonDeleteModal open={Boolean(rowToDelete)} itemName={rowToDelete?.title} onClose={() => setRowToDelete(null)} onConfirm={() => handleDeleteBtn()} />
      </Box>
    </>
  );
};

export default User;
