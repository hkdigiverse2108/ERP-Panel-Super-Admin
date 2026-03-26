import { Box } from "@mui/material";
import { useMemo } from "react";
import { useDispatch } from "react-redux";
import ConsumptionTypeForm from "./ConsumptionTypeForm";
import { PAGE_TITLE } from "../../../Constants";
import { useDataGrid, usePagePermission } from "../../../Utils/Hooks";
import { Mutations, Queries } from "../../../Api";
import type { AppGridColDef, ConsumptionTypeBase } from "../../../Types";
import { CommonActionColumn, CommonCard, CommonDataGrid, CommonDeleteModal } from "../../../Components/Common";
import { CommonObjectPropertyColumn } from "../../../Components/Common/CommonDataGrid/CommonColumns";
import { setConsumptionTypeModal } from "../../../Store/Slices/ModalSlice";

const ConsumptionType = () => {
  const { paginationModel, setPaginationModel, sortModel, setSortModel, filterModel, setFilterModel, rowToDelete, setRowToDelete, isActive, setActive, params } = useDataGrid();

  const dispatch = useDispatch();
  const permission = usePagePermission(PAGE_TITLE.SETTINGS.CONSUMPTION_TYPE.BASE);

  const { data: consumptionTypeData, isLoading: consumptionTypeDataLoading, isFetching: consumptionTypeDataFetching } = Queries.useGetConsumptionType(params);
  const { mutate: deleteConsumptionTypeMutate, isPending: isDeleteLoading } = Mutations.useDeleteConsumptionType();
  const { mutate: editConsumptionType, isPending: isEditLoading } = Mutations.useEditConsumptionType();

  const allRows = useMemo(() => consumptionTypeData?.data?.consumptionType_data.map((item) => ({ ...item, id: item?._id })) || [], [consumptionTypeData]);
  const totalRows = consumptionTypeData?.data?.totalData || 0;

  const handleDeleteBtn = () => {
    if (!rowToDelete) return;
    deleteConsumptionTypeMutate(rowToDelete?._id as string, { onSuccess: () => setRowToDelete(null) });
  };

  const handleAdd = () => dispatch(setConsumptionTypeModal({ open: true, data: null }));

  const handleEdit = (row: ConsumptionTypeBase) => dispatch(setConsumptionTypeModal({ open: true, data: row }));

  const columns: AppGridColDef<ConsumptionTypeBase>[] = [
    { field: "name", headerName: "Consumption Type", flex: 1, minWidth: 200 },
    CommonObjectPropertyColumn<ConsumptionTypeBase>("createdBy", "createdBy", ["fullName"], { headerName: "Created By", flex: 1, minWidth: 150 }),

    ...(permission?.edit || permission?.delete
      ? [
          CommonActionColumn<ConsumptionTypeBase>({
            ...(permission?.edit && { active: (row) => editConsumptionType({ consumptionTypeId: row?._id, isActive: !row.isActive }), onEdit: { handleEdit: (row) => handleEdit(row) } }),
            ...(permission?.delete && { onDelete: (row) => setRowToDelete({ _id: row?._id, title: row?.name }) }),
          }),
        ]
      : []),
  ];

  const CommonDataGridOption = {
    columns,
    rows: allRows,
    rowCount: totalRows,
    loading: consumptionTypeDataLoading || consumptionTypeDataFetching || isEditLoading,
    isActive,
    setActive,
    ...(permission?.add && { handleAdd }),
    paginationModel,
    isExport: false,
    onPaginationModelChange: setPaginationModel,
    sortModel,
    onSortModelChange: setSortModel,
    filterModel,
    onFilterModelChange: setFilterModel,
    fileName: PAGE_TITLE.SETTINGS.CONSUMPTION_TYPE.BASE,
  };

  return (
    <Box sx={{ display: "grid" }}>
      <CommonCard title={PAGE_TITLE.SETTINGS.CONSUMPTION_TYPE.BASE}>
        <CommonDataGrid {...CommonDataGridOption} />
      </CommonCard>
      <CommonDeleteModal open={Boolean(rowToDelete)} itemName={rowToDelete?.title} loading={isDeleteLoading} onClose={() => setRowToDelete(null)} onConfirm={() => handleDeleteBtn()} />
      <ConsumptionTypeForm />
    </Box>
  );
};

export default ConsumptionType;
