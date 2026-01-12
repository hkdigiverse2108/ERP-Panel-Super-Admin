import { Box } from "@mui/material";
import { useMemo } from "react";
import { useDispatch } from "react-redux";
import { Mutations, Queries } from "../../../Api";
import { CommonActionColumn, CommonBreadcrumbs, CommonCard, CommonDataGrid, CommonDeleteModal } from "../../../Components/Common";
import { PAGE_TITLE } from "../../../Constants";
import { BREADCRUMBS } from "../../../Data";
import { setUomModal } from "../../../Store/Slices/ModalSlice";
import type { AppGridColDef, UomBase } from "../../../Types";
import { useDataGrid } from "../../../Utils/Hooks";
import UomForm from "./UomForm";

const Uom = () => {
  const { paginationModel, setPaginationModel, sortModel, setSortModel, filterModel, setFilterModel, rowToDelete, setRowToDelete, isActive, setActive, params } = useDataGrid();
  const dispatch = useDispatch();

  const { data: UomData, isLoading: UomDataLoading, isFetching: UomDataFetching } = Queries.useGetUom(params);
  const { mutate: deleteUomMutate } = Mutations.useDeleteUom();
  const { mutate: editUom, isPending: isEditLoading } = Mutations.useEditUom();

  const allUom = useMemo(() => UomData?.data?.uom_data.map((uom) => ({ ...uom, id: uom?._id })) || [], [UomData]);
  const totalRows = UomData?.data?.totalData || 0;

  const handleDeleteBtn = () => {
    if (!rowToDelete) return;
    deleteUomMutate(rowToDelete?._id as string, { onSuccess: () => setRowToDelete(null) });
  };

  const handleAdd = () => dispatch(setUomModal({ open: true, data: null }));

  const handleEdit = (row: UomBase) => dispatch(setUomModal({ open: true, data: row }));

  const columns: AppGridColDef<UomBase>[] = [
    { field: "name", headerName: "Name", flex: 1, minWidth: 200 },
    { field: "code", headerName: "Code", flex: 1, minWidth: 200 },
    CommonActionColumn({
      active: (row) => editUom({ uomId: row?._id, isActive: !row.isActive }),
      onEdit: (row) => handleEdit(row),
      onDelete: (row) => setRowToDelete({ _id: row?._id, title: row?.name }),
    }),
  ];

  const CommonDataGridOption = {
    columns,
    rows: allUom,
    rowCount: totalRows,
    loading: UomDataLoading || UomDataFetching || isEditLoading,
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

  return (
    <>
      <CommonBreadcrumbs title={PAGE_TITLE.INVENTORY.UOM.BASE} maxItems={1} breadcrumbs={BREADCRUMBS.UOM.BASE} />
      <Box sx={{ p: { xs: 2, md: 3 }, display: "grid" }}>
        <CommonCard hideDivider>
          <CommonDataGrid {...CommonDataGridOption} />
        </CommonCard>
        <CommonDeleteModal open={Boolean(rowToDelete)} itemName={rowToDelete?.title} onClose={() => setRowToDelete(null)} onConfirm={() => handleDeleteBtn()} />
        <UomForm />
      </Box>
    </>
  );
};

export default Uom;
