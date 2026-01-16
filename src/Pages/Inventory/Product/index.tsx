import { Box } from "@mui/material";
import { useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { Mutations, Queries } from "../../../Api";
import { AdvancedSearch, CommonActionColumn, CommonBreadcrumbs, CommonCard, CommonDataGrid, CommonDeleteModal, CommonObjectNameColumn } from "../../../Components/Common";
import { PAGE_TITLE, ROUTES } from "../../../Constants";
import { BREADCRUMBS, PRODUCT_TYPE_OPTIONS } from "../../../Data";
import type { AppGridColDef, ProductBase } from "../../../Types";
import { useDataGrid } from "../../../Utils/Hooks";
import { CreateFilter, GenerateOptions } from "../../../Utils";

const Product = () => {
  const { paginationModel, setPaginationModel, sortModel, setSortModel, filterModel, setFilterModel, rowToDelete, setRowToDelete, isActive, setActive, advancedFilter, updateAdvancedFilter, params } = useDataGrid();
  const navigate = useNavigate();

  const { data: productData, isLoading: productDataLoading, isFetching: productDataFetching } = Queries.useGetProduct(params);
  const { data: BrandsData, isLoading: BrandsDataLoading } = Queries.useGetBrandDropdown();
  const brandId = advancedFilter?.brandFilter?.[0] || "";
  const { data: subBrandData, isLoading: subBrandDataLoading } = Queries.useGetBrandDropdown({ parentBrandFilter: brandId }, Boolean(brandId));
  const { data: TaxData, isLoading: TaxDataLoading } = Queries.useGetTaxDropdown();
  const { data: CategoryData, isLoading: CategoryDataLoading } = Queries.useGetCategoryDropdown();
  const subCategoryId = advancedFilter?.categoryFilter?.[0] || "";
  const { data: subCategoryData, isLoading: subCategoryDataLoading } = Queries.useGetCategoryDropdown({ parentCategoryFilter: subCategoryId }, Boolean(subCategoryId));

  const { mutate: editProduct, isPending: isEditLoading } = Mutations.useEditProduct();
  const { mutate: deleteProductMutate } = Mutations.useDeleteProduct();

  const allProduct = useMemo(() => productData?.data?.product_data.map((emp) => ({ ...emp, id: emp?._id })) || [], [productData]);
  const totalRows = productData?.data?.totalData || 0;

  const handleAdd = () => navigate(ROUTES.PRODUCT.ADD_EDIT);

  const handleDeleteBtn = () => {
    if (!rowToDelete) return;
    deleteProductMutate(rowToDelete?._id as string, { onSuccess: () => setRowToDelete(null) });
  };

  const columns: AppGridColDef<ProductBase>[] = [
    { field: "name", headerName: "Name", width: 150 },
    CommonObjectNameColumn<ProductBase>("categoryId", { headerName: "Category", width: 200 }),
    CommonObjectNameColumn<ProductBase>("brandId", { headerName: "Brand", width: 240 }),
    { field: "mrp", headerName: "MRP", width: 150 },
    { field: "sellingPrice", headerName: "Selling Price", width: 150 },
    { field: "hsnCode", headerName: "HSN", width: 150 },
    { field: "additionalInfo", headerName: "additionalInfo", width: 150 },
    { field: "shortDescription", headerName: "shortDescription", width: 150 },
    { field: "openingQty", headerName: "Opening Qty", flex: 1, minWidth: 150 },
    CommonActionColumn({
      active: (row) => editProduct({ productId: row?._id, isActive: !row.isActive }),
      editRoute: ROUTES.PRODUCT.ADD_EDIT,
      onDelete: (row) => setRowToDelete({ _id: row?._id, title: row?.name }),
    }),
  ];

  const CommonDataGridOption = {
    columns,
    rows: allProduct,
    rowCount: totalRows,
    loading: productDataLoading || productDataFetching || isEditLoading,
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

  const filter = [
    CreateFilter("Select Category", "categoryFilter", advancedFilter, updateAdvancedFilter, GenerateOptions(CategoryData?.data), CategoryDataLoading, { xs: 12, sm: 6, md: 3 }), // categoryFilter
    CreateFilter("Select Sub Category", "subCategoryFilter", advancedFilter, updateAdvancedFilter, GenerateOptions(subCategoryData?.data), subCategoryDataLoading, { xs: 12, sm: 6, md: 3 }), // subCategoryFilter
    CreateFilter("Select Brand", "brandFilter", advancedFilter, updateAdvancedFilter, GenerateOptions(BrandsData?.data), BrandsDataLoading, { xs: 12, sm: 6, md: 3 }), // brandFilter
    CreateFilter("Select Sub Brand", "subBrandFilter", advancedFilter, updateAdvancedFilter, GenerateOptions(subBrandData?.data), subBrandDataLoading, { xs: 12, sm: 6, md: 3 }), // subBrandFilter
    CreateFilter("Select Purchase Tax", "purchaseTaxFilter", advancedFilter, updateAdvancedFilter, GenerateOptions(TaxData?.data), TaxDataLoading, { xs: 12, sm: 6, md: 3 }), // purchaseTaxFilter
    CreateFilter("Select Sales Tax", "salesTaxFilter", advancedFilter, updateAdvancedFilter, GenerateOptions(TaxData?.data), TaxDataLoading, { xs: 12, sm: 6, md: 3 }), // salesTaxFilter
    CreateFilter("Select Product Type", "productTypeFilter", advancedFilter, updateAdvancedFilter, PRODUCT_TYPE_OPTIONS, false, { xs: 12, sm: 6, md: 3 }), // productTypeFilter
  ];
  return (
    <>
      <CommonBreadcrumbs title={PAGE_TITLE.INVENTORY.PRODUCT.BASE} maxItems={1} breadcrumbs={BREADCRUMBS.PRODUCT.BASE} />
      <Box sx={{ p: { xs: 2, md: 3 }, display: "grid", gap: 2 }}>
        <AdvancedSearch filter={filter} />

        <CommonCard hideDivider>
          <CommonDataGrid {...CommonDataGridOption} />
        </CommonCard>
        <CommonDeleteModal open={Boolean(rowToDelete)} itemName={rowToDelete?.title} onClose={() => setRowToDelete(null)} onConfirm={() => handleDeleteBtn()} />
      </Box>
    </>
  );
};

export default Product;
   