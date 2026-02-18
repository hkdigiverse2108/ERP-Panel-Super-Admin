import ClearIcon from "@mui/icons-material/Clear";
import { Box, Grid } from "@mui/material";
import { Form, Formik } from "formik";
import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Mutations, Queries } from "../../../Api";
import { CommonButton, CommonSelect, CommonTextField, CommonValidationSelect } from "../../../Attribute";
import { CommonBottomActionBar, CommonBreadcrumbs, CommonCard } from "../../../Components/Common";
import { PAGE_TITLE } from "../../../Constants";
import { BREADCRUMBS, DATA_STATUS } from "../../../Data";
import type { ProductBase, StockVerificationBase, StockVerificationFormValues, StockVerificationRow } from "../../../Types";
import { GenerateOptions, RemoveEmptyFields } from "../../../Utils";
import { usePagePermission } from "../../../Utils/Hooks";

const StockVerificationForm = () => {
  const [searchValue, setSearchValue] = useState<string[]>([""]);
  const location = useLocation();
  const updateData = location.state?.data as StockVerificationBase | undefined;
  const [filter, setFilter] = useState<any>({ companyFilter: updateData?.companyId?._id });
  const permission = usePagePermission(PAGE_TITLE.INVENTORY.STOCK_VERIFICATION.BASE);
  const navigate = useNavigate();
  const [enterRemark, setEnterRemark] = useState(updateData?.remark || "");
  const [status, setStatus] = useState([updateData?.status || "pending"]);

  const isEditing = Boolean(updateData?._id);
  const pageMode = isEditing ? "EDIT" : "ADD";

  const { data: BrandsData, isLoading: BrandsDataLoading } = Queries.useGetBrandDropdown({ onlyBrandFilter: true });
  const { data: CategoryData, isLoading: CategoryDataLoading } = Queries.useGetCategoryDropdown({ onlyCategoryFilter: true });
  const { data: productData, isLoading: productDataLoading } = Queries.useGetProductDropdown(filter);

  const { mutate: addStock, isPending: isAddLoading } = Mutations.useAddStockVerification();
  const { mutate: editStock, isPending: isEditLoading } = Mutations.useEditStockVerification();
  const { data: CompanyData, isLoading: CompanyDataLoading } = Queries.useGetCompanyDropdown();

  const [rows, setRows] = useState<StockVerificationRow[]>([]);

  useEffect(() => {
    if (isEditing && updateData?.items?.length) {
      setRows(
        updateData?.items?.map((item) => ({
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
          approvedQty: item.approvedQty ?? item.physicalQty,
        })),
      );
      setEnterRemark(updateData.remark ?? "");
    }
  }, [isEditing, updateData]);

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
    approvedQty: 0,
  });

  const updateRow = (id: string, data: Partial<StockVerificationRow>) => {
    setRows((prev) =>
      prev.map((r) => {
        if (r.productId !== id) return r;

        const updated = { ...r, ...data };
        const differenceQty = isEditing ? updated?.approvedQty - updated?.systemQty : updated?.physicalQty - updated?.systemQty;
        const differenceAmount = updated?.landingCost * differenceQty;

        return { ...updated, differenceQty, differenceAmount };
      }),
    );
  };

  const removeRow = (id: string) => setRows((prev) => prev.filter((r) => r.productId !== id));
  const totalDifferenceQty = rows.reduce((sum, r) => sum + r?.physicalQty, 0);

  const totalApprovedQty = rows.reduce((sum, r) => sum + r?.approvedQty, 0);

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
      approvedQty: r.approvedQty,
    }));
    const payload: StockVerificationFormValues = {
      items,
      totalProducts: rows.length,
      totalPhysicalQty: totalDifferenceQty,
      totalDifferenceAmount: totalDifferenceAmount,
      totalApprovedQty: totalApprovedQty,
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
  return (
    <>
      <CommonBreadcrumbs title={PAGE_TITLE.INVENTORY.STOCK_VERIFICATION[pageMode]} maxItems={3} breadcrumbs={BREADCRUMBS.STOCK_VERIFICATION[pageMode]} />
      <Box sx={{ p: { xs: 2, md: 3 }, display: "grid", gap: 2 }}>
        <CommonCard hideDivider>
          <Grid container spacing={2} sx={{ p: 2 }}>
            {!isEditing && (
              <Grid size={12}>
                <Formik enableReinitialize initialValues={{ categoryId: "", brandId: "", companyId: "" }} onSubmit={handleSubmit}>
                  {({ dirty }) => (
                    <Form noValidate>
                      <Grid container spacing={2}>
                        <CommonValidationSelect name="companyId" label="Company" options={GenerateOptions(CompanyData?.data)} isLoading={CompanyDataLoading} grid={{ xs: 12, md: 4 }} required />
                        <CommonValidationSelect name="categoryId" label="Category" placeholder="Category Selection" options={GenerateOptions(CategoryData?.data)} isLoading={CategoryDataLoading} grid={{ xs: 12, sm: 6, md: 4 }} />
                        <CommonValidationSelect name="brandId" label="Brand" placeholder="Brand Selection" options={GenerateOptions(BrandsData?.data)} isLoading={BrandsDataLoading} grid={{ xs: 12, md: 4 }} />
                        <CommonButton type="submit" variant="contained" title="Apply" disabled={!dirty} />
                      </Grid>
                    </Form>
                  )}
                </Formik>
              </Grid>
            )}
            <Grid size={12}>
              <Grid container spacing={2}>
                {isEditing && <CommonSelect label="Status" options={DATA_STATUS} value={status} onChange={(e) => setStatus(e)} grid={{ xs: 12, sm: 2 }} />}
                <CommonSelect
                  value={searchValue}
                  label="Search Product"
                  placeholder="Search Product"
                  options={GenerateOptions(productData?.data)}
                  grid={{ xs: 12, sm: isEditing ? 4 : 6 }}
                  disabled={!filter?.companyFilter}
                  isLoading={productDataLoading}
                  onChange={(selected: string[]) => {
                    setSearchValue(selected);
                    if (!selected.length) return;

                    const product = productData?.data.find((p) => p._id === selected[0]);
                    if (!product) return;

                    setRows((prev) => {
                      const existing = prev.find((r) => r.productId === product._id);

                      if (existing) {
                        return prev.map((r) => {
                          const physicalQty = r.physicalQty + 1;
                          const approvedQty = isEditing ? r.approvedQty + 1 : 0;
                          const differenceQty = (isEditing ? approvedQty : physicalQty) - r.systemQty;
                          const differenceAmount = (r.landingCost ?? 0) * (isEditing ? approvedQty : physicalQty);

                          return r.productId === product._id ? { ...r, physicalQty, differenceQty, differenceAmount, approvedQty } : r;
                        });
                      }

                      return [createRowFromProduct(product), ...prev];
                    });
                  }}
                />
                <CommonTextField label="Enter Remark" placeholder="Enter Remark" grid={{ xs: 12, sm: 6 }} value={enterRemark} onChange={(e) => setEnterRemark(e)} multiline />
              </Grid>
            </Grid>

            <Grid size={12}>
              <div className="w-full bg-white dark:bg-gray-dark">
                <div className="lg:h-[500px] max-h-[500px] overflow-x-auto custom-scrollbar border border-gray-200 dark:border-gray-600 rounded-md">
                  <table className="w-full text-sm ">
                    <thead className="sticky top-0 z-10 bg-gray-100 dark:text-gray-100 text-gray-700 dark:bg-gray-900">
                      <tr>
                        <th className="p-2">Sr No.</th>
                        <th className="p-2 text-start">Product</th>
                        <th className="p-2">Landing Cost</th>
                        <th className="p-2">Price</th>
                        <th className="p-2">MRP</th>
                        <th className="p-2">Selling Price</th>
                        <th className="p-2">System Qty</th>
                        <th className="p-2">Physical Qty</th>
                        <th className="p-2">Difference Qty</th>
                        <th className="p-2">Difference Amount</th>
                        {isEditing && <th className="p-2">Approve Qty</th>}
                        <th className="p-2">Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {rows.map((row, i) => {
                        return (
                          <tr key={row.productId} className="text-center bg-white dark:bg-gray-800 even:bg-gray-50 dark:even:bg-gray-dark text-gray-600 dark:text-gray-300">
                            <td className="p-2 text-center">{i + 1}</td>
                            <td className="p-2 min-w-60 w-60 text-start">{row.name}</td>
                            <td className="p-2">{row.landingCost}</td>
                            <td className="p-2">{row.price}</td>
                            <td className="p-2">{row.mrp}</td>
                            <td className="p-2">{row.sellingPrice}</td>
                            <td className="p-2">{row.systemQty}</td>
                            <td className="p-2 min-w-35 w-35">
                              <CommonTextField type="number" value={row.physicalQty} onChange={(e) => updateRow(row.productId, { physicalQty: Number(e) })} />
                            </td>
                            <td className="p-2 ">{row.differenceQty}</td>
                            <td className="p-2">{row.differenceAmount.toFixed(2)}</td>
                            {isEditing && (
                              <td className="p-2 min-w-35 w-35">
                                <CommonTextField type="number" value={row.approvedQty} onChange={(e) => updateRow(row.productId, { approvedQty: Number(e) })} />
                              </td>
                            )}
                            <td className="p-2">
                              <CommonButton color="error" variant="outlined" size="small" onClick={() => removeRow(row.productId)}>
                                <ClearIcon />
                              </CommonButton>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                    <tfoot>
                      <tr className="sticky bottom-0 bg-gray-100 dark:bg-gray-900 text-gray-700 dark:text-gray-100">
                        <td colSpan={7} />
                        <td className="p-3 text-center font-semibold">{totalDifferenceQty}</td>
                        <td />
                        <td className="p-3 text-center font-semibold">{totalDifferenceAmount.toFixed(2)}</td>

                        {isEditing && <td className="p-3 text-center font-semibold">{totalApprovedQty}</td>}
                        <td />
                      </tr>
                    </tfoot>
                  </table>
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
