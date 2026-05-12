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
import type { CommonTableColumn, ProductBase, StockVerificationBase, StockVerificationFormValues, StockVerificationRow } from "../../../Types";
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

const BranchWatcher = ({ currentBranchId, onChange }: { currentBranchId: string; onChange: (id: string) => void }) => {
  const { values } = useFormikContext<{ branchId: string }>();
  useEffect(() => {
    if (values.branchId !== currentBranchId) {
      onChange(values.branchId);
    }
  }, [values.branchId, currentBranchId, onChange]);
  return null;
};

const StockVerificationForm = () => {
  const [searchValue, setSearchValue] = useState<string[]>([""]);
  const location = useLocation();
  const updateData = location.state?.data as StockVerificationBase | undefined;
  const [filter, setFilter] = useState({});
  const permission = usePagePermission(PAGE_TITLE.INVENTORY.STOCK_VERIFICATION.BASE);
  const navigate = useNavigate();
  const [enterRemark, setEnterRemark] = useState(updateData?.remark || "");
  const [status, setStatus] = useState([updateData?.status || "pending"]);

  const isEditing = Boolean(updateData?._id);
  const pageMode = isEditing ? "EDIT" : "ADD";
  const [selectedCompany, setSelectedCompany] = useState(updateData?.companyId?._id || (typeof updateData?.companyId === "string" ? updateData?.companyId : ""));
  const [selectedBranch, setSelectedBranch] = useState(updateData?.branchId?._id || (typeof updateData?.branchId === "string" ? updateData?.branchId : ""));

  const { data: CompanyData, isLoading: CompanyDataLoading } = Queries.useGetCompanyDropdown();
  const { data: BranchData, isLoading: BranchDataLoading } = Queries.useGetBranchDropdown({ companyFilter: selectedCompany }, Boolean(selectedCompany));
  const { data: BrandsData, isLoading: BrandsDataLoading } = Queries.useGetBrandDropdown({ onlyBrandFilter: true });
  const { data: CategoryData, isLoading: CategoryDataLoading } = Queries.useGetCategoryDropdown({ onlyCategoryFilter: true });
  const { data: productData, isLoading: productDataLoading } = Queries.useGetProductDropdown({ companyFilter: selectedCompany }, Boolean(selectedCompany));
  const { data: productListData, isLoading: productListDataLoading, isFetching: productListDataFetching } = Queries.useGetProductDropdown(filter, Object.keys(filter).length > 0);

  const { mutate: addStock, isPending: isAddLoading } = Mutations.useAddStockVerification();
  const { mutate: editStock, isPending: isEditLoading } = Mutations.useEditStockVerification();

  const [rows, setRows] = useState<StockVerificationRow[]>([]);

  const productListLoading = productListDataLoading || productListDataFetching;

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
    systemQty: product.qty ?? 0,
    physicalQty: 0,
    differenceQty: 0 - (product.qty ?? 0),
    differenceAmount: (product.landingCost ?? 0) * (0 - (product.qty ?? 0)),
  });
  useEffect(() => {
    if (productListData?.data?.length) {
      setRows((prev) => [
        ...prev,
        ...productListData.data
          .filter((item) => !prev.some((r) => r.productId === item._id)) // 👈 skip duplicates
          .map((item) => createRowFromProduct(item)),
      ]);
    }
  }, [productListData]);

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

  const removeRow = (id: string) => setRows((prev) => prev.filter((r) => r.productId !== id));
  const totalDifferenceQty = rows.reduce((sum, r) => sum + r?.physicalQty, 0);

  const totalDifferenceAmount = rows.reduce((sum, r) => sum + r?.differenceAmount, 0);

  const handleSubmit = (values: { companyId: string; branchId: string; categoryId: string; brandId: string }) => setFilter({ companyFilter: values.companyId, branchFilter: values.branchId, categoryFilter: values.categoryId, brandFilter: values.brandId });

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
      companyId: selectedCompany,
      branchId: selectedBranch,
      items,
      totalProducts: rows.length,
      totalPhysicalQty: totalDifferenceQty,
      totalDifferenceAmount: totalDifferenceAmount,
      status: status[0],
      ...(enterRemark && { remark: enterRemark }),
    };
    const handleSuccess = () => navigate(-1);

    if (isEditing) {
      await editStock({ ...payload, stockVerificationId: updateData?._id }, { onSuccess: handleSuccess });
    } else {
      await addStock(RemoveEmptyFields(payload), { onSuccess: handleSuccess });
    }
  };

  const columns: CommonTableColumn<StockVerificationRow>[] = [
    { key: "sr", header: "Sr No.", render: (_, i) => i + 1, bodyClass: "min-w-15 w-20" },
    { key: "name", header: "Product", headerClass: "text-start", bodyClass: "min-w-50 w-60 text-start" },
    { key: "landingCost", header: "Landing Cost", bodyClass: "min-w-25 w-30" },
    { key: "price", header: "Purchase Price", bodyClass: "min-w-25 w-30" },
    { key: "mrp", header: "MRP", bodyClass: "min-w-25 w-30" },
    { key: "sellingPrice", header: "Selling Price", bodyClass: "min-w-25 w-30" },
    { key: "systemQty", header: "System Qty", bodyClass: "min-w-25 w-30" },
    {
      key: "physicalQty",
      header: "Physical Qty",
      bodyClass: "min-w-32 w-35",
      render: (row) => <CommonTextField type="number" value={row.physicalQty || 0} onChange={(e) => updateRow(row.productId, { physicalQty: Number(e) })} maxDigits={5} />,
      footer: () => totalDifferenceQty,
    },
    { key: "differenceQty", header: "Difference Qty", bodyClass: "min-w-32 w-35" },
    { key: "differenceAmount", header: "Difference Amount", bodyClass: "min-w-32 w-35", render: (row) => row.differenceAmount?.toFixed(2), footer: () => totalDifferenceAmount.toFixed(2) },
    {
      key: "action",
      header: "Action",
      render: (row) => (
        <CommonButton variant="outlined" size="small" color="error" sx={{ minWidth: 40 }} onClick={() => removeRow(row.productId)}>
          <ClearIcon />
        </CommonButton>
      ),
    },
  ];

  const CommonTableOption = {
    isLoading: productListLoading,
    data: rows,
    rowKey: (row: StockVerificationRow) => row.productId,
    columns: columns,
    getRowClass: () => "bg-white dark:bg-gray-800 even:bg-gray-50 dark:even:bg-gray-dark",
    showFooter: true,
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
                <Formik enableReinitialize initialValues={{ companyId: "", branchId: "", categoryId: "", brandId: "" }} onSubmit={handleSubmit}>
                  {({ values }) => (
                    <Form noValidate>
                      <CompanyWatcher currentCompanyId={selectedCompany} onChange={setSelectedCompany} />
                      <BranchWatcher currentBranchId={selectedBranch} onChange={setSelectedBranch} />
                      <Grid container spacing={2}>
                        <CommonValidationSelect name="companyId" label="Company" options={GenerateOptions(CompanyData?.data)} isLoading={CompanyDataLoading} grid={{ xs: 12, md: 2 }} />
                        <CommonValidationSelect name="branchId" label="Branch" options={GenerateOptions(BranchData?.data)} isLoading={BranchDataLoading} disabled={!values.companyId} grid={{ xs: 12, md: 2 }} />
                        <CommonValidationSelect name="categoryId" label="Category" placeholder="Category Selection" options={GenerateOptions(CategoryData?.data)} isLoading={CategoryDataLoading} grid={{ xs: 12, md: 3 }} />
                        <CommonValidationSelect name="brandId" label="Brand" placeholder="Brand Selection" options={GenerateOptions(BrandsData?.data)} isLoading={BrandsDataLoading} grid={{ xs: 12, md: 3 }} />

                        <CommonButton type="submit" variant="contained" title="Apply" />
                      </Grid>
                    </Form>
                  )}
                </Formik>
              </Grid>
            )}
            <Grid size={12}>
              <Grid container spacing={2}>
                {isEditing && <CommonSelect label="Company" options={GenerateOptions(CompanyData?.data)} value={selectedCompany ? [selectedCompany] : []} onChange={(e) => setSelectedCompany(e[0])} grid={{ xs: 12, sm: 3 }} isLoading={CompanyDataLoading} required />}
                {isEditing && <CommonSelect label="Branch" options={GenerateOptions(BranchData?.data)} value={selectedBranch ? [selectedBranch] : []} onChange={(e) => setSelectedBranch(e[0])} grid={{ xs: 12, sm: 3 }} isLoading={BranchDataLoading} required />}
                {isEditing && <CommonSelect label="Status" options={DATA_STATUS} value={status} onChange={(e) => setStatus(e)} grid={{ xs: 12, sm: 3 }} />}
                <CommonSelect
                  value={searchValue}
                  label="Search Product"
                  placeholder="Search Product"
                  options={GenerateOptions(productData?.data)}
                  grid={{ xs: 12, sm: isEditing ? 3 : 6 }}
                  isLoading={productDataLoading}
                  disabled={!selectedCompany || !selectedBranch}
                  onChange={(selected: string[]) => {
                    setSearchValue(selected);
                    if (!selected.length) return;

                    const product = productData?.data.find((p) => p._id === selected[0]);
                    if (!product) return;

                    setRows((prev) => {
                      const existing = prev.find((r) => r.productId === product._id);

                      if (existing) {
                        return prev.map((r) => {
                          return r.productId === product._id ? { ...r } : r;
                        });
                      }

                      return [createRowFromProduct(product), ...prev];
                    });
                  }}
                />
                <CommonTextField label="Enter Remark" placeholder="Enter Remark" grid={{ xs: 12, sm: isEditing ? 12 : 6 }} value={enterRemark} onChange={(e) => setEnterRemark(e)} multiline />
              </Grid>
            </Grid>

            <Grid size={12}>
              <div className="w-full bg-white dark:bg-gray-dark">
                <div className="lg:h-[420px] max-h-[420px] overflow-x-auto custom-scrollbar border border-gray-200 dark:border-gray-600 rounded-md">
                  <CommonTable {...CommonTableOption} />
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
