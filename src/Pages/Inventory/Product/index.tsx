import { Box, Grid } from "@mui/material";
import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Mutations, Queries } from "../../../Api";
import { AdvancedSearch, CommonActionColumn, CommonBreadcrumbs, CommonCard, CommonDataGrid, CommonDeleteModal, CommonModal, CommonObjectNameColumn } from "../../../Components/Common";
import { PAGE_TITLE, ROUTES } from "../../../Constants";
import { BREADCRUMBS, CONSUMPTION_TYPE, PRODUCT_TYPE_OPTIONS } from "../../../Data";
import type { AppGridColDef, ProductBase, ProductWithRemoveQty } from "../../../Types";
import { useDataGrid } from "../../../Utils/Hooks";
import { CreateFilter, GenerateOptions } from "../../../Utils";
import { CommonButton, CommonTextField, CommonValidationSelect } from "../../../Attribute";
import { Form, Formik } from "formik";
import { ProductItemRemoveFormSchema } from "../../../Utils/ValidationSchemas";
import type { GridRenderCellParams } from "@mui/x-data-grid";

const Product = () => {
  const { paginationModel, setPaginationModel, sortModel, setSortModel, filterModel, setFilterModel, rowToDelete, setRowToDelete, isActive, setActive, advancedFilter, updateAdvancedFilter, params } = useDataGrid();
  const navigate = useNavigate();
  const [openModal, setOpenModal] = useState(false);
  const [isRemoveItem, setRemoveItem] = useState(false);
  const [gridRows, setGridRows] = useState<ProductWithRemoveQty[]>([]);

  const { data: productData, isLoading: productDataLoading, isFetching: productDataFetching } = Queries.useGetProduct(params);
  const { data: CompanyData, isLoading: CompanyDataLoading } = Queries.useGetCompanyDropdown();
  const { data: BrandsData, isLoading: BrandsDataLoading } = Queries.useGetBrandDropdown();
  const brandId = advancedFilter?.brandFilter?.[0] || "";
  const { data: subBrandData, isLoading: subBrandDataLoading } = Queries.useGetBrandDropdown({ parentBrandFilter: brandId }, Boolean(brandId));
  const { data: TaxData, isLoading: TaxDataLoading } = Queries.useGetTaxDropdown();
  const { data: CategoryData, isLoading: CategoryDataLoading } = Queries.useGetCategoryDropdown();
  const subCategoryId = advancedFilter?.categoryFilter?.[0] || "";
  const { data: subCategoryData, isLoading: subCategoryDataLoading } = Queries.useGetCategoryDropdown({ parentCategoryFilter: subCategoryId }, Boolean(subCategoryId));

  const { mutate: editProduct, isPending: isEditLoading } = Mutations.useEditProduct();
  const { mutate: deleteProductMutate } = Mutations.useDeleteProduct();
  const { mutate: addStockBulkAdjustment, isPending: isAddLoading } = Mutations.useAddStockBulkAdjustment();

  const allProduct = useMemo<ProductWithRemoveQty[]>(() => productData?.data?.product_data.map((emp) => ({ ...emp, id: emp?._id, removeQty: null })) || [], [productData]);
  const totalRows = productData?.data?.totalData || 0;

  const data = gridRows.filter((r) => r.removeQty != null).map(({ removeQty, _id }) => ({ qty: removeQty, productId: _id }));

  useEffect(() => setGridRows(allProduct), [allProduct]);

  const handleAdd = () => navigate(ROUTES.PRODUCT.ADD_EDIT);
  const handleAddItem = () => navigate(ROUTES.PRODUCT.ITEM_ADD_EDIT);

  const handleDeleteBtn = () => {
    if (!rowToDelete) return;
    deleteProductMutate(rowToDelete?._id as string, { onSuccess: () => setRowToDelete(null) });
  };

  const handleRemoveItem = async (values: { remark: string }) => {
    const obj = {
      items: data,
      remark: values.remark,
      companyId: advancedFilter?.companyFilter?.[0] || "",
    };
    await addStockBulkAdjustment(obj, {
      onSuccess: () => {
        setRemoveItem(!isRemoveItem);
        setOpenModal(!openModal);
      },
    });
  };

  const columns: AppGridColDef<ProductBase>[] = [
    { field: "name", headerName: "Name", width: 200 },
    CommonObjectNameColumn<ProductBase>("categoryId", { headerName: "Category", width: 200 }),
    CommonObjectNameColumn<ProductBase>("brandId", { headerName: "Brand", width: 200 }),
    { field: "mrp", headerName: "MRP", width: 150 },
    { field: "sellingPrice", headerName: "Selling Price", width: 150 },
    { field: "hsnCode", headerName: "HSN", width: 200 },
    { field: "openingQty", headerName: "Opening Qty", flex: 1, minWidth: 150 },
    ...(isRemoveItem
      ? [
          {
            field: "removeQty",
            headerName: "Remove Qty",
            flex: 1,
            minWidth: 150,
            renderCell: (params: GridRenderCellParams) => (
              <CommonTextField
                type="number"
                value={params.value ?? 0}
                onChange={(event) => {
                  const newValue = Number(event || 0);
                  setGridRows((prev) => prev.map((r) => (r.id === params.id ? { ...r, removeQty: newValue } : r)));
                }}
              />
            ),
          },
        ]
      : []),
    CommonActionColumn({
      active: (row) => editProduct({ productId: row?._id, isActive: !row.isActive }),
      editRoute: ROUTES.PRODUCT.ADD_EDIT,
      onDelete: (row) => setRowToDelete({ _id: row?._id, title: row?.name }),
    }),
  ];

  const CommonDataGridOption = {
    columns,
    rows: gridRows,
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
    CreateFilter("Select Company", "companyFilter", advancedFilter, updateAdvancedFilter, GenerateOptions(CompanyData?.data), CompanyDataLoading, { xs: 12, sm: 6, md: 3 }), // categoryFilter
    CreateFilter("Select Category", "categoryFilter", advancedFilter, updateAdvancedFilter, GenerateOptions(CategoryData?.data), CategoryDataLoading, { xs: 12, sm: 6, md: 3 }), // categoryFilter
    CreateFilter("Select Sub Category", "subCategoryFilter", advancedFilter, updateAdvancedFilter, GenerateOptions(subCategoryData?.data), subCategoryDataLoading, { xs: 12, sm: 6, md: 3 }), // subCategoryFilter
    CreateFilter("Select Brand", "brandFilter", advancedFilter, updateAdvancedFilter, GenerateOptions(BrandsData?.data), BrandsDataLoading, { xs: 12, sm: 6, md: 3 }), // brandFilter
    CreateFilter("Select Sub Brand", "subBrandFilter", advancedFilter, updateAdvancedFilter, GenerateOptions(subBrandData?.data), subBrandDataLoading, { xs: 12, sm: 6, md: 3 }), // subBrandFilter
    CreateFilter("Select Purchase Tax", "purchaseTaxFilter", advancedFilter, updateAdvancedFilter, GenerateOptions(TaxData?.data), TaxDataLoading, { xs: 12, sm: 6, md: 3 }), // purchaseTaxFilter
    CreateFilter("Select Sales Tax", "salesTaxFilter", advancedFilter, updateAdvancedFilter, GenerateOptions(TaxData?.data), TaxDataLoading, { xs: 12, sm: 6, md: 3 }), // salesTaxFilter
    CreateFilter("Select Product Type", "productTypeFilter", advancedFilter, updateAdvancedFilter, PRODUCT_TYPE_OPTIONS, false, { xs: 12, sm: 6, md: 3 }), // productTypeFilter
  ];

  const topContent = (
    <Grid size={"auto"}>
      <Grid container spacing={1}>
        <Grid size={"auto"}>
          <CommonButton variant="contained" title="Add Item" size="medium" onClick={handleAddItem} disabled={!advancedFilter?.companyFilter?.length} />
        </Grid>
        <Grid size={"auto"}>
          <CommonButton variant="contained" title="Remove Item" size="medium" disabled={!advancedFilter?.companyFilter?.length} onClick={() => setRemoveItem(!isRemoveItem)} />
        </Grid>
      </Grid>
    </Grid>
  );
  return (
    <>
      <CommonBreadcrumbs title={PAGE_TITLE.INVENTORY.PRODUCT.BASE} maxItems={1} breadcrumbs={BREADCRUMBS.PRODUCT.BASE} />
      <Box sx={{ p: { xs: 2, md: 3 }, display: "grid", gap: 2 }}>
        <AdvancedSearch filter={filter} />
        <CommonCard title={PAGE_TITLE.INVENTORY.PRODUCT.ITEM.BASE} topContent={topContent}>
          <CommonDataGrid {...CommonDataGridOption} />
          {isRemoveItem && (
            <Grid container sx={{ p: 2 }}>
              <Grid sx={{ display: "flex", gap: 2, ml: "auto" }}>
                <CommonButton variant="outlined" onClick={() => setRemoveItem(!isRemoveItem)} title="Cancel" />
                <CommonButton type="submit" variant="contained" title="Save" disabled={data.length === 0} loading={isAddLoading} onClick={() => setOpenModal(!openModal)} />
              </Grid>
            </Grid>
          )}
        </CommonCard>
        <CommonDeleteModal open={Boolean(rowToDelete)} itemName={rowToDelete?.title} onClose={() => setRowToDelete(null)} onConfirm={() => handleDeleteBtn()} />
        <CommonModal title="Remove Item" isOpen={openModal} onClose={() => setOpenModal(!openModal)} className="max-w-125 m-2 sm:m-5">
          <Formik initialValues={{ remark: "" }} enableReinitialize validationSchema={ProductItemRemoveFormSchema} onSubmit={handleRemoveItem}>
            <Form noValidate>
              <Grid sx={{ p: 1 }} container spacing={2}>
                <CommonValidationSelect name="remark" label="Consumption Type" options={CONSUMPTION_TYPE} grid={{ xs: 12 }} required />
                <CommonButton type="submit" variant="contained" title="Save" size="medium" loading={isAddLoading} fullWidth grid={{ xs: 12 }} />
              </Grid>
            </Form>
          </Formik>
        </CommonModal>
      </Box>
    </>
  );
};

export default Product;
