import { Box } from "@mui/material";
import { useMemo } from "react";
import { useDispatch } from "react-redux";
import ConsumptionTypeForm from "./ConsumptionTypeForm";
import { PAGE_TITLE } from "../../../Constants";
import { useDataGrid, usePagePermission } from "../../../Utils/Hooks";
import { Mutations, Queries } from "../../../Api";
import type { AppGridColDef, ConsumptionTypeBase } from "../../../Types";
import { AdvancedSearch, CommonActionColumn, CommonBreadcrumbs, CommonCard, CommonDataGrid, CommonDeleteModal } from "../../../Components/Common";
import { CommonObjectNameColumn, CommonObjectPropertyColumn } from "../../../Components/Common/CommonDataGrid/CommonColumns";
import { setConsumptionTypeModal } from "../../../Store/Slices/ModalSlice";
import { BREADCRUMBS } from "../../../Data";
import { CreateFilter, GenerateOptions } from "../../../Utils";

const ConsumptionType = () => {
  const { paginationModel, setPaginationModel, sortModel, setSortModel, filterModel, setFilterModel, rowToDelete, setRowToDelete, isActive, setActive, params, advancedFilter, updateAdvancedFilter } = useDataGrid();

  const dispatch = useDispatch();
  const permission = usePagePermission(PAGE_TITLE.SETTINGS.CONSUMPTION_TYPE.BASE);

  const { data: CompanyData, isLoading: CompanyDataLoading } = Queries.useGetCompanyDropdown();
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
    CommonObjectNameColumn<ConsumptionTypeBase>("companyId", { headerName: "Company", width: 250 }),
    { field: "name", headerName: "Consumption Type", width: 250 },
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
  const filter = [CreateFilter("Select Company", "companyFilter", advancedFilter, updateAdvancedFilter, GenerateOptions(CompanyData?.data), CompanyDataLoading, { xs: 12, sm: 6, md: 3 })];

  return (
    <>
      <CommonBreadcrumbs title={PAGE_TITLE.SETTINGS.CONSUMPTION_TYPE.BASE} maxItems={1} breadcrumbs={BREADCRUMBS.CONSUMPTION_TYPE.BASE} />
      <Box sx={{ p: { xs: 2, md: 3 }, display: "grid", gap: 2 }}>
        <AdvancedSearch filter={filter} />
        <CommonCard hideDivider>
          <CommonDataGrid {...CommonDataGridOption} />
        </CommonCard>
        <CommonDeleteModal open={Boolean(rowToDelete)} itemName={rowToDelete?.title} loading={isDeleteLoading} onClose={() => setRowToDelete(null)} onConfirm={() => handleDeleteBtn()} />
        <ConsumptionTypeForm />
      </Box>
    </>
  );
};

export default ConsumptionType;
