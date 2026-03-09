import { Box } from "@mui/material";
import { useMemo } from "react";
import { useDispatch } from "react-redux";
import { Mutations, Queries } from "../../../Api";
import { CommonActionColumn, CommonBreadcrumbs, CommonCard, CommonDataGrid, CommonDeleteModal } from "../../../Components/Common";
import { PAGE_TITLE } from "../../../Constants";
import { BREADCRUMBS } from "../../../Data";
import { setProductTypeModal } from "../../../Store/Slices/ModalSlice";
import type { AppGridColDef, ProductTypeBase } from "../../../Types";
import { useDataGrid, usePagePermission } from "../../../Utils/Hooks";
import ProductTypeForm from "./ProductTypeForm";

const ProductType = () => {
  const { paginationModel, setPaginationModel, sortModel, setSortModel, filterModel, setFilterModel, rowToDelete, setRowToDelete, isActive, setActive, params } = useDataGrid();
  const dispatch = useDispatch();
  const permission = usePagePermission(PAGE_TITLE.INVENTORY.PRODUCT_TYPE.BASE);

  const { data: ProductTypeData, isLoading: ProductTypeDataLoading, isFetching: ProductTypeDataFetching } = Queries.useGetProductType(params);
  const { mutate: deleteProductTypeMutate } = Mutations.useDeleteProductType();
  const { mutate: editProductType, isPending: isEditLoading } = Mutations.useEditProductType();

  const allProductType = useMemo(() => ProductTypeData?.data?.product_type_data.map((ProductType) => ({ ...ProductType, id: ProductType?._id })) || [], [ProductTypeData]);
  const totalRows = ProductTypeData?.data?.totalData || 0;

  const handleDeleteBtn = () => {
    if (!rowToDelete) return;
    deleteProductTypeMutate(rowToDelete?._id as string, { onSuccess: () => setRowToDelete(null) });
  };

  const handleAdd = () => dispatch(setProductTypeModal({ open: true, data: null }));

  const handleEdit = (row: ProductTypeBase) => dispatch(setProductTypeModal({ open: true, data: row }));

  const columns: AppGridColDef<ProductTypeBase>[] = [
    { field: "name", headerName: "Name", flex: 1, minWidth: 200 },
    ...(permission?.edit || permission?.delete
      ? [
          CommonActionColumn<ProductTypeBase>({
            ...(permission?.edit && {
              active: (row) => editProductType({ productTypeId: row?._id, isActive: !row.isActive }),
              onEdit: (row) => handleEdit(row),
            }),
            ...(permission?.delete && { onDelete: (row) => setRowToDelete({ _id: row?._id, title: row?.name }) }),
          }),
        ]
      : []),
  ];

  const CommonDataGridOption = {
    columns,
    rows: allProductType,
    rowCount: totalRows,
    loading: ProductTypeDataLoading || ProductTypeDataFetching || isEditLoading,
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
      <CommonBreadcrumbs title={PAGE_TITLE.INVENTORY.PRODUCT_TYPE.BASE} maxItems={1} breadcrumbs={BREADCRUMBS.PRODUCT_TYPE.BASE} />
      <Box sx={{ p: { xs: 2, md: 3 }, display: "grid" }}>
        <CommonCard hideDivider>
          <CommonDataGrid {...CommonDataGridOption} />
        </CommonCard>
        <CommonDeleteModal open={Boolean(rowToDelete)} itemName={rowToDelete?.title} onClose={() => setRowToDelete(null)} onConfirm={() => handleDeleteBtn()} />
        <ProductTypeForm />
      </Box>
    </>
  );
};

export default ProductType;
