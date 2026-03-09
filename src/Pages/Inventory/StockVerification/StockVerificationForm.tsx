import ClearIcon from "@mui/icons-material/Clear";
import { Box, Grid } from "@mui/material";
import { Form, Formik, useFormikContext } from "formik";
import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Mutations, Queries } from "../../../Api";
import { CommonButton, CommonSelect, CommonTextField, CommonValidationSelect } from "../../../Attribute";
import { CommonBottomActionBar, CommonBreadcrumbs, CommonCard, CommonTable } from "../../../Components/Common";
import { PAGE_TITLE } from "../../../Constants";
import { BREADCRUMBS, DATA_STATUS } from "../../../Data";
import type { CommonTableColumn, ProductBase, StockVerificationBase, StockVerificationFilter, StockVerificationFormValues, StockVerificationRow } from "../../../Types";
import { GenerateOptions, RemoveEmptyFields } from "../../../Utils";
import { usePagePermission } from "../../../Utils/Hooks";

const CompanyWatcher = ({ currentCompanyId, onChange }: { currentCompanyId: string; onChange: (id: string) => void }) => {
  const { values } = useFormikContext<{ companyId: string }>();
  useEffect(() => {
    if (values.companyId !== currentCompanyId) {
      onChange(values.companyId);
    }
  }, [values.companyId, currentCompanyId, onChange]);
  return null;
};

const StockVerificationForm = () => {
  const [searchValue, setSearchValue] = useState<string[]>([""]);
  const location = useLocation();
  const updateData = location.state?.data as StockVerificationBase | undefined;
  const [filter, setFilter] = useState<StockVerificationFilter>({ companyFilter: updateData?.companyId?._id });
  const permission = usePagePermission(PAGE_TITLE.INVENTORY.STOCK_VERIFICATION.BASE);
  const navigate = useNavigate();
  const [enterRemark, setEnterRemark] = useState(updateData?.remark || "");
  const [status, setStatus] = useState([updateData?.status || "pending"]);

  const isEditing = Boolean(updateData?._id);
  const pageMode = isEditing ? "EDIT" : "ADD";

  const { data: BrandsData, isLoading: BrandsDataLoading } = Queries.useGetBrandDropdown({ onlyBrandFilter: true });
  const { data: CategoryData, isLoading: CategoryDataLoading } = Queries.useGetCategoryDropdown({ onlyCategoryFilter: true });
  const { data: productData, isLoading: productDataLoading, isFetching: productDataFetching } = Queries.useGetProductDropdown({ companyFilter: filter.companyFilter }, Boolean(filter.companyFilter));

  const { mutate: addStock, isPending: isAddLoading } = Mutations.useAddStockVerification();
  const { mutate: editStock, isPending: isEditLoading } = Mutations.useEditStockVerification();
  const { data: CompanyData, isLoading: CompanyDataLoading } = Queries.useGetCompanyDropdown();

  const [rows, setRows] = useState<StockVerificationRow[]>([]);

  useEffect(() => {
    if (isEditing && updateData?.items?.length && productData?.data?.length) {
      setRows(
        updateData.items.map((item) => ({
          productId: item.productId._id ?? item.productId,
          name: item.productId.name ?? "",
          landingCost: item.landingCost,
          price: item.price,
          mrp: item.mrp,
          sellingPrice: item.sellingPrice,
          systemQty: item.systemQty,
          physicalQty: item.physicalQty,
          differenceQty: item.differenceQty,
          differenceAmount: item.differenceAmount,
        })),
      );

      setEnterRemark(updateData.remark ?? "");
      setSearchValue(updateData.items.map((item) => item.productId._id ?? item.productId));
    }
  }, [isEditing, updateData, productData]);

  const createRowFromProduct = (product: ProductBase): StockVerificationRow => ({
    productId: product._id,
    name: product.name ?? "",
    landingCost: product.landingCost ?? 0,
    price: product.purchasePrice ?? 0,
    mrp: product.mrp ?? 0,
    sellingPrice: product.sellingPrice ?? 0,
    systemQty: (product as ProductBase).qty ?? 0,
    physicalQty: 0,
    differenceQty: 0 - ((product as ProductBase).qty ?? 0),
    differenceAmount: (product.landingCost ?? 0) * (0 - ((product as any).qty ?? 0)),
  });

  const updateRow = (id: string, data: Partial<StockVerificationRow>) => {
    setRows((prev) =>
      prev.map((r) => {
        if (r.productId !== id) return r;

        const updated = { ...r, ...data };
        const differenceQty = updated?.physicalQty - updated?.systemQty;
        const differenceAmount = updated?.landingCost * differenceQty;

        return { ...updated, differenceQty, differenceAmount };
      }),
    );
  };

  const removeRow = (id: string) => {
    setRows((prev) => prev.filter((r) => r.productId !== id));
    setSearchValue((prev) => prev.filter((v) => v !== id));
  };
  const totalDifferenceQty = rows.reduce((sum, r) => sum + r?.physicalQty, 0);


  const totalDifferenceAmount = rows.reduce((sum, r) => sum + r?.differenceAmount, 0);

  const handleSubmit = (values: { categoryId: string; brandId: string; companyId: string }) => setFilter({ categoryFilter: values.categoryId, brandFilter: values.brandId, companyFilter: values.companyId });

  const handleStockSubmit = async () => {
    const items = rows.map((r) => ({
      productId: r.productId,
      landingCost: r.landingCost,
      price: r.price,
      mrp: r.mrp,
      sellingPrice: r.sellingPrice,
      systemQty: r.systemQty,
      physicalQty: r.physicalQty,
      differenceQty: r.differenceQty,
      differenceAmount: r.differenceAmount,
    }));
    const payload: StockVerificationFormValues = {
      items,
      totalProducts: rows.length,
      totalPhysicalQty: totalDifferenceQty,
      totalDifferenceAmount: totalDifferenceAmount,
      status: status[0],
      ...(enterRemark && { remark: enterRemark }),
      companyId: filter.companyFilter,
    };
    const handleSuccess = () => navigate(-1);

    if (isEditing) {
      await editStock({ ...payload, stockVerificationId: updateData?._id }, { onSuccess: handleSuccess });
    } else {
      await addStock(RemoveEmptyFields(payload), { onSuccess: handleSuccess });
    }
  };

  useEffect(() => {
    const hasAccess = isEditing ? permission.edit : permission.add;
    if (!hasAccess) navigate(-1);
  }, [isEditing, permission, navigate]);

  const columns: CommonTableColumn<StockVerificationRow>[] = [
    { key: "sr", header: "Sr No.", render: (_, i) => i + 1, footer: "" },
    { key: "name", header: "Product", bodyClass: "min-w-60 w-60 text-start", footer: "" },
    { key: "landingCost", header: "Landing Cost", footer: "" },
    { key: "price", header: "Price", footer: "" },
    { key: "mrp", header: "MRP", footer: "" },
    { key: "sellingPrice", header: "Selling Price", footer: "" },
    { key: "systemQty", header: "System Qty", footer: "" },
    {
      key: "physicalQty",
      header: "Physical Qty",
      bodyClass: "min-w-35 w-35",
      render: (row) => <CommonTextField type="number" value={row.physicalQty} onChange={(e) => updateRow(row.productId, { physicalQty: Number(e) })} />,
      footer: (data) => data.reduce((sum, r) => sum + (r.physicalQty || 0), 0),
    },
    { key: "differenceQty", header: "Difference Qty", footer: "" },
    { key: "differenceAmount", header: "Difference Amount", render: (row) => row.differenceAmount.toFixed(2), footer: (data) => data.reduce((sum, r) => sum + (r.differenceAmount || 0), 0).toFixed(2) },
  ];

  columns.push({
    key: "actions",
    header: "Action",
    render: (row) => (
      <CommonButton color="error" variant="outlined" size="small" onClick={() => removeRow(row.productId)}>
        <ClearIcon />
      </CommonButton>
    ),
    footer: "",
  });

  return (
    <>
      <CommonBreadcrumbs title={PAGE_TITLE.INVENTORY.STOCK_VERIFICATION[pageMode]} maxItems={3} breadcrumbs={BREADCRUMBS.STOCK_VERIFICATION[pageMode]} />
      <Box sx={{ p: { xs: 2, md: 3 }, display: "grid", gap: 2 }}>
        <CommonCard hideDivider>
          <Grid container spacing={2} sx={{ p: 2 }}>
            <Grid size={12}>
              <Formik enableReinitialize initialValues={{ categoryId: "", brandId: "", companyId: updateData?.companyId?._id || "" }} onSubmit={handleSubmit}>
                {({ dirty }) => (
                  <Form noValidate>
                    <CompanyWatcher
                      currentCompanyId={filter.companyFilter ?? ""}
                      onChange={(id) => {
                        setFilter((prev) => ({ ...prev, companyFilter: id }));
                        if (isEditing && id === updateData?.companyId?._id) return;
                        setRows([]);
                        setSearchValue([""]);
                      }}
                    />
                    <Grid container spacing={2}>
                      <CommonValidationSelect name="companyId" label="Company" options={GenerateOptions(CompanyData?.data)} isLoading={CompanyDataLoading} grid={{ xs: 12, md: isEditing ? 6 : 3 }} required />

                      {!isEditing && (
                        <>
                          <CommonValidationSelect name="categoryId" label="Category" placeholder="Category Selection" options={GenerateOptions(CategoryData?.data)} isLoading={CategoryDataLoading} grid={{ xs: 12, md: 3 }} />
                          <CommonValidationSelect name="brandId" label="Brand" placeholder="Brand Selection" options={GenerateOptions(BrandsData?.data)} isLoading={BrandsDataLoading} grid={{ xs: 12, md: 3 }} />
                          <CommonButton type="submit" variant="contained" title="Apply" disabled={!dirty} grid={{ xs: 12, md: 3 }} />
                        </>
                      )}

                      {isEditing && <CommonSelect label="Status" options={DATA_STATUS} value={status} onChange={(e) => setStatus(e)} grid={{ xs: 12, md: 6 }} />}

                      <CommonSelect
                        value={searchValue}
                        label="Search Product"
                        placeholder="Search Product"
                        multiple
                        limitTags={2}
                        options={productDataLoading || productDataFetching ? [] : GenerateOptions(productData?.data)}
                        grid={{ xs: 12, md: isEditing ? 6 : 6 }}
                        disabled={!filter?.companyFilter}
                        isLoading={productDataLoading || productDataFetching}
                        onChange={(selected: string[]) => {
                          setSearchValue(selected);

                          setRows((prev) => {
                            const newIds = new Set(selected);
                            const existingRows = prev.filter((r) => newIds.has(r.productId));
                            const existingIds = new Set(existingRows.map((r) => r.productId));

                            const idsToAdd = selected.filter((id) => !existingIds.has(id));

                            const newRows = idsToAdd
                              .map((id) => {
                                const product = productData?.data.find((p) => p._id === id);
                                return product ? createRowFromProduct(product) : null;
                              })
                              .filter((r): r is StockVerificationRow => Boolean(r));

                            return [...existingRows, ...newRows];
                          });
                        }}
                      />
                      <CommonTextField label="Enter Remark" placeholder="Enter Remark" grid={{ xs: 12, md: isEditing ? 6 : 6 }} value={enterRemark} onChange={(e) => setEnterRemark(e)} multiline />
                    </Grid>
                  </Form>
                )}
              </Formik>
            </Grid>

            <Grid size={12}>
              <div className="w-full bg-white dark:bg-gray-dark">
                <div className="lg:h-[500px] max-h-[500px] overflow-x-auto custom-scrollbar border border-gray-200 dark:border-gray-600 rounded-md">
                  <CommonTable data={rows} columns={columns} rowKey={(row) => row.productId} showFooter />
                </div>
              </div>
            </Grid>
            <CommonBottomActionBar save isLoading={isAddLoading || isEditLoading} disabled={rows.length === 0} onSave={() => handleStockSubmit()} />
          </Grid>
        </CommonCard>
      </Box>
    </>
  );
};

export default StockVerificationForm;
