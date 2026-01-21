import { Box } from "@mui/material";
import { useMemo } from "react";
import { useDispatch } from "react-redux";
import { Mutations, Queries } from "../../Api";
import { AdvancedSearch, CommonActionColumn, CommonBreadcrumbs, CommonCard, CommonDataGrid, CommonDeleteModal } from "../../Components/Common";
import { PAGE_TITLE } from "../../Constants";
import { BREADCRUMBS, LOCATION_TYPE } from "../../Data";
import { setLocationModal } from "../../Store/Slices/ModalSlice";
import type { AppGridColDef, LocationBase } from "../../Types";
import { useDataGrid } from "../../Utils/Hooks";
import LocationForm from "./LocationForm";
import { CreateFilter, GenerateOptions, WithAllOption } from "../../Utils";

const Location = () => {
  const { paginationModel, setPaginationModel, sortModel, setSortModel, filterModel, setFilterModel, rowToDelete, setRowToDelete, isActive, setActive, advancedFilter, updateAdvancedFilter, params } = useDataGrid();
  const dispatch = useDispatch();

  const { data: locationData, isLoading: locationDataLoading, isFetching: locationDataFetching } = Queries.useGetLocation(params);
  const { data: parentData, isLoading: parentDataLoading} = Queries.useGetLocation({ typeFilter: advancedFilter?.typeFilter?.[0] });

  const { mutate: deleteLocationMutate } = Mutations.useDeleteLocation();
  const { mutate: editLocation, isPending: isEditLoading } = Mutations.useEditLocation();

  const allLocation = useMemo(() => locationData?.data?.location_data.map((location) => ({ ...location, id: location?._id })) || [], [locationData]);
  const totalRows = locationData?.data?.totalData || 0;

  const handleDeleteBtn = () => {
    if (!rowToDelete) return;
    deleteLocationMutate(rowToDelete?._id as string, { onSuccess: () => setRowToDelete(null) });
  };

  const handleAdd = () => dispatch(setLocationModal({ open: true, data: null }));

  const handleEdit = (row: LocationBase) => dispatch(setLocationModal({ open: true, data: row }));

  const columns: AppGridColDef<LocationBase>[] = [
    { field: "name", headerName: "Name", width: 300 },
    { field: "code", headerName: "Code", width: 300 },
    { field: "type", headerName: "Type", width: 300 },
    {
      field: "parentId",
      headerName: "Parent",
      flex: 1,
      minWidth: 300,
      renderCell: ({ value }) => (typeof value === "object" ? value?.name || "-" : value),
      exportFormatter: (value) => (typeof value === "object" && value !== null ? (value as { name?: string })?.name || "-" : "-"),
    },
    CommonActionColumn({
      active: (row) => editLocation({ locationId: row?._id, isActive: !row.isActive }),
      onEdit: (row) => handleEdit(row),
      onDelete: (row) => setRowToDelete({ _id: row?._id, title: row?.name }),
    }),
  ];

  const CommonDataGridOption = {
    columns,
    rows: allLocation,
    rowCount: totalRows,
    loading: locationDataLoading || locationDataFetching || isEditLoading,
    isActive,
    setActive,
    handleAdd,
    paginationModel,
    onPaginationModelChange: setPaginationModel,
    sortModel,
    onSortModelChange: setSortModel,
    filterModel,
    onFilterModelChange: setFilterModel,
    isExport: false,
  };

  const filter = useMemo(() => {
    const filters = [CreateFilter("Select Location Type", "typeFilter", advancedFilter, updateAdvancedFilter, WithAllOption(LOCATION_TYPE), false, { xs: 12, sm: 4 })];

    if (advancedFilter?.typeFilter?.[0] === "country") {
      filters.push(CreateFilter("Select Country", "parentFilter", advancedFilter, updateAdvancedFilter, GenerateOptions(parentData?.data?.location_data), parentDataLoading, { xs: 12, sm: 4 }));
    }

    if (advancedFilter?.typeFilter?.[0] === "state") {
      filters.push(CreateFilter("Select State", "parentFilter", advancedFilter, updateAdvancedFilter, GenerateOptions(parentData?.data?.location_data), parentDataLoading, { xs: 12, sm: 4 }));
    }

    return filters;
  }, [advancedFilter, updateAdvancedFilter, parentData?.data?.location_data, parentDataLoading]);

  return (
    <>
      <CommonBreadcrumbs title={PAGE_TITLE.LOCATION.BASE} maxItems={1} breadcrumbs={BREADCRUMBS.LOCATION.BASE} />
      <Box sx={{ p: { xs: 2, md: 3 }, display: "grid", gap: 2 }}>
        <AdvancedSearch filter={filter} />
        <CommonCard hideDivider>
          <CommonDataGrid {...CommonDataGridOption} />
        </CommonCard>
        <CommonDeleteModal open={Boolean(rowToDelete)} itemName={rowToDelete?.title} onClose={() => setRowToDelete(null)} onConfirm={() => handleDeleteBtn()} />
        <LocationForm />
      </Box>
    </>
  );
};

export default Location;
