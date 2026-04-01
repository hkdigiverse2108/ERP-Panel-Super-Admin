import { Box } from "@mui/material";
import { useMemo } from "react";
import { useDispatch } from "react-redux";
import { Mutations, Queries } from "../../../Api";
import { CommonActionColumn, CommonBreadcrumbs, CommonCard, CommonDataGrid, CommonDeleteModal } from "../../../Components/Common";
import { PAGE_TITLE } from "../../../Constants";
import { BREADCRUMBS } from "../../../Data";
import { setSpecialsModal } from "../../../Store/Slices/ModalSlice";
import type { AppGridColDef, SpecialsBase } from "../../../Types";
import { useDataGrid, usePagePermission } from "../../../Utils/Hooks";
import SpecialsForm from "./SpecialsForm";

const Specials = () => {
  const { paginationModel, setPaginationModel, sortModel, setSortModel, filterModel, setFilterModel, rowToDelete, setRowToDelete, isActive, setActive, params } = useDataGrid();
  const dispatch = useDispatch();
  const permission = usePagePermission(PAGE_TITLE.INVENTORY.SPECIALS.BASE);

  const { data: specialsData, isLoading: specialsLoading, isFetching: specialsFetching } = Queries.useGetSpecials(params);
  const { mutate: deleteSpecial } = Mutations.useDeleteSpecial();
  const { mutate: editSpecial, isPending: isEditLoading } = Mutations.useEditSpecial();

  const allSpecials = useMemo(() => specialsData?.data?.specials_data.map((special) => ({ ...special, id: special?._id })) || [], [specialsData]);
  const totalRows = specialsData?.data?.totalData || 0;

  const handleDeleteBtn = () => {
    if (!rowToDelete) return;
    deleteSpecial(rowToDelete?._id as string, { onSuccess: () => setRowToDelete(null) });
  };

  const handleAdd = () => dispatch(setSpecialsModal({ open: true, data: null }));

  const handleEdit = (row: SpecialsBase) => dispatch(setSpecialsModal({ open: true, data: row }));

  const columns: AppGridColDef<SpecialsBase>[] = [
    {
      field: "image",
      headerName: "Image",
      width: 100,
      renderCell: ({ value }) => (value ? <img src={value} style={{ width: 40, height: 40, objectFit: "cover", borderRadius: "4px" }} /> : "-"),
    },
    { field: "name", headerName: "Item Name", flex: 1, minWidth: 200 },
    { 
      field: "price", 
      headerName: "Price", 
      width: 120,
      renderCell: ({ value }) => `₹${value}`,
    },
    { field: "description", headerName: "Description", flex: 1, minWidth: 250 },

    ...(permission?.edit || permission?.delete
      ? [
          CommonActionColumn<SpecialsBase>({
            ...(permission?.edit && {
                active: (row) => editSpecial({ specialId: row?._id, isActive: !row.isActive }),
                onEdit: { handleEdit: (row) => handleEdit(row) },
            }),
            ...(permission?.delete && { onDelete: (row) => setRowToDelete({ _id: row?._id, title: row?.name }) }),
          }),
        ]
      : []),
  ];

  const gridOptions = {
    columns,
    rows: allSpecials,
    rowCount: totalRows,
    loading: specialsLoading || specialsFetching || isEditLoading,
    isActive,
    setActive,
    ...(permission?.add && { handleAdd }),
    paginationModel,
    onPaginationModelChange: setPaginationModel,
    sortModel,
    onSortModelChange: setSortModel,
    filterModel,
    onFilterModelChange: setFilterModel,
    fileName: PAGE_TITLE.INVENTORY.SPECIALS.BASE,
  };

  return (
    <>
      <CommonBreadcrumbs title={PAGE_TITLE.INVENTORY.SPECIALS.BASE} maxItems={1} breadcrumbs={(BREADCRUMBS as any).SPECIALS.BASE} />
      <Box sx={{ p: { xs: 2, md: 3 }, display: "grid" }}>
        <CommonCard hideDivider>
          <CommonDataGrid {...gridOptions} />
        </CommonCard>
        <CommonDeleteModal open={Boolean(rowToDelete)} itemName={rowToDelete?.title} onClose={() => setRowToDelete(null)} onConfirm={() => handleDeleteBtn()} />
        <SpecialsForm />
      </Box>
    </>
  );
};

export default Specials;
