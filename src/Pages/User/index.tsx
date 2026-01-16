import { Box, Grid } from "@mui/material";
import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Mutations, Queries } from "../../Api";
import { AdvancedSearch, CommonActionColumn, CommonBreadcrumbs, CommonCard, CommonDataGrid, CommonDeleteModal, CommonPhoneColumns } from "../../Components/Common";
import { PAGE_TITLE, ROUTES } from "../../Constants";
import { BREADCRUMBS, PRODUCT_TYPE_OPTIONS } from "../../Data";
import type { AppGridColDef, UserBase } from "../../Types";
import { useDataGrid } from "../../Utils/Hooks";
import { CommonSelect } from "../../Attribute";

const User = () => {
  const { paginationModel, setPaginationModel, sortModel, setSortModel, filterModel, setFilterModel, rowToDelete, setRowToDelete, isActive, setActive, params } = useDataGrid();
  const navigate = useNavigate();
  const [value, setValue] = useState<string[]>([]);

  const { data: userData, isLoading: userDataLoading, isFetching: userDataFetching } = Queries.useGetUser(params);
  const { mutate: deleteUserMutate } = Mutations.useDeleteUser();
  const { mutate: editUser, isPending: isEditLoading } = Mutations.useEditUser();

  const allUser = useMemo(() => userData?.data?.user_data.map((user) => ({ ...user, id: user?._id })) || [], [userData]);
  const totalRows = userData?.data?.totalData || 0;

  const handleDeleteBtn = () => {
    if (!rowToDelete) return;
    deleteUserMutate(rowToDelete?._id as string, { onSuccess: () => setRowToDelete(null) });
  };

  const handleAdd = () => navigate(ROUTES.USER.ADD_EDIT);

  const columns: AppGridColDef<UserBase>[] = [
    { field: "username", headerName: "User Name", type: "string", width: 170 },
    { field: "fullName", headerName: "Full Name", width: 170 },
    { field: "designation", headerName: "Designation", width: 170 },  
    { field: "email", headerName: "Email", width: 240 },
    CommonPhoneColumns<UserBase>("phoneNo", { headerName: "Phone No", width: 150 }),
    { field: "panNumber", headerName: "PAN Number", width: 150 },
    { field: "wages", headerName: "Wages", type: "number", width: 150 },
    { field: "extraWages", headerName: "Extra Wages", type: "number", width: 150 },
    { field: "commission", headerName: "Commission", type: "number", flex: 1, minWidth: 150 },
    CommonActionColumn({
      active: (row) => editUser({ userId: row?._id, companyId: row?.companyId?._id, isActive: !row.isActive }),
      editRoute: ROUTES.USER.ADD_EDIT,
      onDelete: (row) => setRowToDelete({ _id: row?._id, title: row?.username }),
    }),
  ];

  const CommonDataGridOption = {
    columns,
    rows: allUser,
    rowCount: totalRows,
    loading: userDataLoading || userDataFetching || isEditLoading,
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
      <CommonBreadcrumbs title={PAGE_TITLE.USER.BASE} maxItems={1} breadcrumbs={BREADCRUMBS.USER.BASE} />
      <Box sx={{ p: { xs: 2, md: 3 }, display: "grid", gap: 2 }}>
        <AdvancedSearch>
          <Grid size={{ xs: 12, xsm: 6, sm: 3, xxl: 2 }}>
            <CommonSelect label="Select Location" options={PRODUCT_TYPE_OPTIONS} value={value} onChange={(v) => setValue(v)} limitTags={1} multiple />
          </Grid>
        </AdvancedSearch >
        <CommonCard hideDivider>
          <CommonDataGrid {...CommonDataGridOption} />
        </CommonCard>
        <CommonDeleteModal open={Boolean(rowToDelete)} itemName={rowToDelete?.title} onClose={() => setRowToDelete(null)} onConfirm={() => handleDeleteBtn()} />
      </Box>
    </>
  );
};

export default User;
