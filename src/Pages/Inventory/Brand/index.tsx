import { Box } from "@mui/material";
import { useMemo } from "react";
import { useDispatch } from "react-redux";
import { Mutations, Queries } from "../../../Api";
import { CommonActionColumn, CommonBreadcrumbs, CommonCard, CommonDataGrid, CommonDeleteModal } from "../../../Components/Common";
import { PAGE_TITLE } from "../../../Constants";
import { BREADCRUMBS } from "../../../Data";
import { setBrandModal } from "../../../Store/Slices/ModalSlice";
import type { AppGridColDef, BrandBase } from "../../../Types";
import { useDataGrid, usePagePermission } from "../../../Utils/Hooks";
import BrandForm from "./BrandForm";

const Brand = () => {
  const { paginationModel, setPaginationModel, sortModel, setSortModel, filterModel, setFilterModel, rowToDelete, setRowToDelete, isActive, setActive, params } = useDataGrid();
  const dispatch = useDispatch();
  const permission = usePagePermission(PAGE_TITLE.INVENTORY.BRAND.BASE);

  const { data: BrandsData, isLoading: brandsDataLoading, isFetching: brandsDataFetching } = Queries.useGetBrand(params);
  const { mutate: deleteBrandsMutate } = Mutations.useDeleteBrand();
  const { mutate: editBrand, isPending: isEditLoading } = Mutations.useEditBrand();

  const allBrands = useMemo(() => BrandsData?.data?.brand_data.map((brand) => ({ ...brand, id: brand?._id })) || [], [BrandsData]);
  const totalRows = BrandsData?.data?.totalData || 0;

  const handleDeleteBtn = () => {
    if (!rowToDelete) return;
    deleteBrandsMutate(rowToDelete?._id as string, { onSuccess: () => setRowToDelete(null) });
  };

  const handleAdd = () => dispatch(setBrandModal({ open: true, data: null }));

  const handleEdit = (row: BrandBase) => dispatch(setBrandModal({ open: true, data: row }));

  const columns: AppGridColDef<BrandBase>[] = [
    {
      field: "image",
      headerName: "Image",
      width: 80,
      renderCell: ({ value }) => (value ? <img src={value} style={{ width: 40 }} /> : "-"),
    },
    { field: "name", headerName: "Name", width: 200 },
    { field: "code", headerName: "Code", width: 200 },
    { field: "description", headerName: "Description", width: 300 },
    {
      field: "parentBrandId",
      headerName: "Parent Brand",
      flex: 1,
      minWidth: 200,
      renderCell: ({ value }) => (typeof value === "object" ? value?.name || "-" : value),
      exportFormatter: (value) => (typeof value === "object" && value !== null ? (value as { name?: string })?.name || "-" : "-"),
    },
    ...(permission?.edit || permission?.delete
      ? [
          CommonActionColumn<BrandBase>({
            ...(permission?.edit && {
              active: (row) => editBrand({ brandId: row?._id, isActive: !row.isActive }),
              onEdit: { handleEdit: (row) => handleEdit(row) },
            }),
            ...(permission?.delete && { onDelete: (row) => setRowToDelete({ _id: row?._id, title: row?.name }) }),
          }),
        ]
      : []),
  ];

  const CommonDataGridOption = {
    columns,
    rows: allBrands,
    rowCount: totalRows,
    loading: brandsDataLoading || brandsDataFetching || isEditLoading,
    isActive,
    setActive,
    ...(permission?.add && { handleAdd }),
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
      <CommonBreadcrumbs title={PAGE_TITLE.INVENTORY.BRAND.BASE} maxItems={1} breadcrumbs={BREADCRUMBS.BRAND.BASE} />
      <Box sx={{ p: { xs: 2, md: 3 }, display: "grid" }}>
        <CommonCard hideDivider>
          <CommonDataGrid {...CommonDataGridOption} />
        </CommonCard>
        <CommonDeleteModal open={Boolean(rowToDelete)} itemName={rowToDelete?.title} onClose={() => setRowToDelete(null)} onConfirm={() => handleDeleteBtn()} />
        <BrandForm />
      </Box>
    </>
  );
};

export default Brand;
