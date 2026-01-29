import { Box } from "@mui/material";
import type { GridColDef } from "@mui/x-data-grid";
import { useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { Mutations, Queries } from "../../../Api";
import { CommonActionColumn, CommonBreadcrumbs, CommonCard, CommonDataGrid, CommonDeleteModal, CommonObjectNameColumn } from "../../../Components/Common";
import { PAGE_TITLE, ROUTES } from "../../../Constants";
import { BREADCRUMBS } from "../../../Data";
import type { MaterialConsumptionBase } from "../../../Types";
import { FormatDate } from "../../../Utils";
import { useDataGrid, usePagePermission } from "../../../Utils/Hooks";

const MaterialConsumption = () => {
  const { paginationModel, setPaginationModel, sortModel, setSortModel, filterModel, setFilterModel, rowToDelete, setRowToDelete, isActive, setActive, params } = useDataGrid();
  const navigate = useNavigate();
  const permission = usePagePermission(PAGE_TITLE.INVENTORY.MATERIAL_CONSUMPTION.BASE);

  const { data: materialConsumptionData, isLoading: materialConsumptionDataLoading, isFetching: materialConsumptionDataFetching } = Queries.useGetMaterialConsumption(params);
  const { mutate: deleteMaterialConsumptionMutate } = Mutations.useDeleteMaterialConsumption();
  const { mutate: editMaterialConsumption, isPending: isEditLoading } = Mutations.useEditMaterialConsumption();

  const allMaterialConsumptions = useMemo(() => materialConsumptionData?.data?.material_consumption_data.map((item) => ({ ...item, id: item?._id })) || [], [materialConsumptionData]);
  const totalRows = materialConsumptionData?.data?.totalData || 0;

  const handleDeleteBtn = () => {
    if (!rowToDelete) return;
    deleteMaterialConsumptionMutate(rowToDelete?._id as string, { onSuccess: () => setRowToDelete(null) });
  };

  const handleAdd = () => navigate(ROUTES.MATERIAL_CONSUMPTION.ADD_EDIT);

  const columns: GridColDef<MaterialConsumptionBase>[] = [
    CommonObjectNameColumn<MaterialConsumptionBase>("companyId", { headerName: "Company", width: 200 }),
    { field: "consumptionNo", headerName: "Consumption No", width: 150 },
    { field: "totalAmount", headerName: "Total Amount", width: 100 },
    CommonObjectNameColumn<MaterialConsumptionBase>("fromAccountId", { headerName: "From Account", width: 200 }),
    CommonObjectNameColumn<MaterialConsumptionBase>("toAccountId", { headerName: "To Account", width: 200 }),
    { field: "date", headerName: "Date", width: 100, renderCell: (params) => FormatDate(params.row.date) },
    { field: "description", headerName: "Description", flex: 1, minWidth: 200 },
    ...(permission?.edit || permission?.delete
      ? [
          CommonActionColumn<MaterialConsumptionBase>({
            ...(permission?.edit && {
              active: (row) => editMaterialConsumption({ materialConsumptionId: row?._id, isActive: !row.isActive }),
              editRoute: ROUTES.MATERIAL_CONSUMPTION.ADD_EDIT,
            }),
            ...(permission?.delete && { onDelete: (row) => setRowToDelete({ _id: row?._id, title: row?.consumptionNo }) }),
          }),
        ]
      : []),
  ];

  const CommonDataGridOption = {
    columns,
    rows: allMaterialConsumptions,
    rowCount: totalRows,
    loading: materialConsumptionDataLoading || materialConsumptionDataFetching || isEditLoading,
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
      <CommonBreadcrumbs title={PAGE_TITLE.INVENTORY.MATERIAL_CONSUMPTION.BASE} maxItems={1} breadcrumbs={BREADCRUMBS.MATERIAL_CONSUMPTION.BASE} />
      <Box sx={{ p: { xs: 2, md: 3 }, display: "grid" }}>
        <CommonCard hideDivider>
          <CommonDataGrid {...CommonDataGridOption} />
        </CommonCard>
        <CommonDeleteModal open={Boolean(rowToDelete)} itemName={rowToDelete?.title} onClose={() => setRowToDelete(null)} onConfirm={() => handleDeleteBtn()} />
      </Box>
    </>
  );
};

export default MaterialConsumption;
