import { Box, Grid } from "@mui/material";
import { ClearIcon } from "@mui/x-date-pickers-pro";
import { Form, Formik, type FormikHelpers } from "formik";
import { useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Mutations, Queries } from "../../../Api";
import { CommonButton, CommonSelect, CommonTextField, CommonValidationDatePicker, CommonValidationSelect, CommonValidationSwitch, CommonValidationTextField } from "../../../Attribute";
import { CommonBottomActionBar, CommonBreadcrumbs, CommonCard, DependentSelect } from "../../../Components/Common";
import { PAGE_TITLE } from "../../../Constants";
import { BREADCRUMBS, CONSUMPTION_TYPE } from "../../../Data";
import type { MaterialConsumptionBase, MaterialConsumptionFormValues, MaterialConsumptionItem, MaterialConsumptionRow, ProductBase } from "../../../Types";
import { DateConfig, GenerateOptions, GetChangedFields, RemoveEmptyFields } from "../../../Utils";
import { usePagePermission } from "../../../Utils/Hooks";
import { MaterialConsumptionFormSchema } from "../../../Utils/ValidationSchemas";

const MaterialConsumptionForm = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const data = location.state?.data as MaterialConsumptionBase | undefined;
  const permission = usePagePermission(PAGE_TITLE.INVENTORY.MATERIAL_CONSUMPTION.BASE);
  const [productId, setProductId] = useState<string[]>([]);
  const [rows, setRows] = useState<MaterialConsumptionItem[]>([]);

  const { data: companyData, isLoading: companyLoading } = Queries.useGetCompanyDropdown();

  const { mutate: addMaterialConsumption, isPending: isAddLoading } = Mutations.useAddMaterialConsumption();
  const { mutate: editMaterialConsumption, isPending: isEditLoading } = Mutations.useEditMaterialConsumption();
console.log(data);

  const isEditing = Boolean(data?._id);
  const pageMode = isEditing ? "EDIT" : "ADD";

  const initialValues = useMemo<MaterialConsumptionFormValues>(
    () => ({
      companyId: data?.companyId?._id || "",
      branchId: data?.branchId?._id || "",
      number: data?.number || "",
      date: data?.date || DateConfig.utc().toISOString(),
      type: data?.type || "",
      remark: data?.remark || "",
      isActive: data?.isActive ?? true,
    }),
    [data],
  );

  const createRowFromProduct = (product: ProductBase): MaterialConsumptionItem => ({
    productId: product._id,
    name: product.name ?? "",
    qty: 1,
    price: product.purchasePrice ?? 0,
    totalPrice: (product.purchasePrice ?? 0) * 1,
  });

  const updateRow = (id: string, patch: Partial<MaterialConsumptionItem>) => {
    setRows((prev) => prev.map((r) => (r.productId === id ? { ...r, ...patch, totalPrice: (patch.price ?? r.price) * (patch.qty ?? r.qty) } : r)));
  };

  const removeRow = (id: string) => setRows((prev) => prev.filter((r) => r.productId !== id));

  const calculateTotals = (rows: MaterialConsumptionRow[]) => ({
    totalQty: rows.reduce((s, r) => s + r.qty, 0),
    totalAmount: rows.reduce((s, r) => s + r.totalPrice, 0),
  });

  const ProductSelect = ({ id }: { id?: string }) => {
    const { data: productData, isLoading: productLoading } = Queries.useGetProductDropdown({ companyFilter: id }, Boolean(id));
    return (
      <Grid container spacing={2} sx={{ p: 2 }}>
        <CommonSelect
          label="Select Product"
          options={GenerateOptions(productData?.data)}
          isLoading={productLoading}
          disabled={!id}
          value={productId}
          onChange={(e) => {
            setProductId(e);
            if (!e.length) return;
            const product = productData?.data.find((p) => p._id === e[0]);
            if (!product) return;
            setRows((prev) => {
              const existing = prev.find((r) => r.productId === product._id);
              if (existing) {
                return prev.map((r) => {
                  const qty = r.qty + 1;
                  const totalPrice = (r.price ?? 0) * qty;
                  return r.productId === product._id ? { ...r, qty, totalPrice } : r;
                });
              }
              return [createRowFromProduct(product), ...prev];
            });
          }}
          grid={{ xs: 12, md: 6 }}
        />
      </Grid>
    );
  };

  const handleSubmit = async (values: MaterialConsumptionFormValues, helpers: FormikHelpers<MaterialConsumptionFormValues>) => {
    const { _submitAction, ...rest } = values;
    const items = rows.map((r) => ({
      productId: r.productId,
      price: r.price,
      qty: r.qty,
      totalPrice: r.totalPrice,
    }));
    const payload = { ...rest, items, ...calculateTotals(rows) };

    const onSuccess = () => (_submitAction === "saveAndNew" ? helpers.resetForm() : navigate(-1));

    if (isEditing) {
      const changedFields = GetChangedFields(payload, data);
      await editMaterialConsumption({ ...changedFields, materialConsumptionId: data?._id }, { onSuccess });
    } else {
      await addMaterialConsumption(RemoveEmptyFields(payload), { onSuccess });
    }
  };

  useEffect(() => {
    if (isEditing && data?.items?.length) {
      setRows(
        data?.items?.map((item) => ({
          productId: item.productId._id,
          name: item.productId.name ?? "",
          price: item.price,
          qty: item.qty,
          totalPrice: item.totalPrice,
        })),
      );
    }
  }, [isEditing, data]);

  useEffect(() => {
    const hasAccess = isEditing ? permission.edit : permission.add;
    if (!hasAccess) navigate(-1);
  }, [isEditing, permission, navigate]);

  return (
    <>
      <CommonBreadcrumbs title={PAGE_TITLE.INVENTORY.MATERIAL_CONSUMPTION[pageMode]} maxItems={3} breadcrumbs={BREADCRUMBS.MATERIAL_CONSUMPTION[pageMode]} />
      <Box sx={{ p: { xs: 2, md: 3 }, mb: 8, display: "grid", gap: 2 }}>
        <Formik<MaterialConsumptionFormValues> enableReinitialize initialValues={initialValues} validationSchema={MaterialConsumptionFormSchema} onSubmit={handleSubmit}>
          {({ resetForm, setFieldValue, values }) => (
            <>
              <Form noValidate>
                <Grid container>
                  <CommonCard hideDivider grid={{ xs: 12 }}>
                    <Grid container spacing={2} sx={{ p: 2 }}>
                      {isEditing && <CommonValidationTextField name="number" label="Consumption No" grid={{ xs: 12, sm: 6, md: 3 }} disabled />}
                      <CommonValidationSelect name="companyId" label="Select Company" options={GenerateOptions(companyData?.data)} isLoading={companyLoading} grid={{ xs: 12, sm: 6, md: 3 }} required />
                      <DependentSelect name="branchId" label="Select Branch" query={Queries.useGetBranchDropdown} params={{ companyFilter: values.companyId }} enabled={Boolean(values.companyId)} disabled={!values.companyId} grid={{ xs: 12, sm: 6, md: 3 }}  required/>
                      <CommonValidationSelect name="type" label="Select Type" options={CONSUMPTION_TYPE} grid={{ xs: 12, sm: 6, md: 3 }} />
                      <CommonValidationDatePicker name="date" label="Date" grid={{ xs: 12, sm: isEditing ? 12 : 6, md: 3 }} required />
                      <CommonValidationTextField name="remark" label="Remark" grid={{ xs: 12, md: isEditing ? 9 : 12 }} multiline />
                      {!isEditing && <CommonValidationSwitch name="isActive" label="Is Active" grid={{ xs: 12 }} />}
                    </Grid>
                  </CommonCard>
                  <CommonBottomActionBar save isLoading={isEditLoading || isAddLoading} onClear={() => resetForm({ values: initialValues })} onSave={() => setFieldValue("_submitAction", "save")} onSaveAndNew={() => setFieldValue("_submitAction", "saveAndNew")} />
                </Grid>
              </Form>
              <Grid container>
                <CommonCard title="Product Details" grid={{ xs: 12 }}>
                  <ProductSelect id={values.companyId} />
                  <Grid size={12}>
                    <div className="w-full">
                      <div className="lg:max-h-[500px] min-h-auto! overflow-x-auto custom-scrollbar border-t border-gray-200 dark:border-gray-600 rounded-b-md ">
                        <table className="w-full text-sm ">
                          <thead className="sticky top-0 z-10 bg-gray-100 dark:text-gray-100 text-gray-700 dark:bg-gray-900">
                            <tr>
                              {["Sr No.", "Product", "Qty", "Price", "Total", "Action"].map((header) => (
                                <th key={header} className="p-2">
                                  {header}
                                </th>
                              ))}
                            </tr>
                          </thead>
                          <tbody>
                            {rows.map((row, i) => {
                              return (
                                <tr key={row.productId} className="text-center bg-white dark:bg-gray-800 even:bg-gray-50 dark:even:bg-gray-dark text-gray-600 dark:text-gray-300">
                                  <td className="p-2 text-center">{i + 1}</td>
                                  <td className="p-2 min-w-60 w-100 text-start">{row?.name}</td>
                                  <td className="p-2 min-w-35 w-60">
                                    <CommonTextField type="number" value={row.qty} onChange={(e) => updateRow(row.productId, { qty: Number(e) })} />
                                  </td>
                                  <td className="p-2">{row.price}</td>
                                  <td className="p-2">{row.totalPrice}</td>
                                  <td className="p-2">
                                    <CommonButton color="error" variant="outlined" size="small" onClick={() => removeRow(row.productId)}>
                                      <ClearIcon />
                                    </CommonButton>
                                  </td>
                                </tr>
                              );
                            })}
                            {rows.length === 0 && (
                              <tr>
                                <td colSpan={6} className="p-3 text-center">
                                  No products added yet.
                                </td>
                              </tr>
                            )}
                          </tbody>
                          <tfoot>
                            <tr className="sticky bottom-0 bg-gray-100 dark:bg-gray-900 text-gray-700 dark:text-gray-100">
                              <td colSpan={2} />
                              <td className="p-3 text-center font-semibold">{calculateTotals(rows).totalQty}</td>
                              <td />
                              <td className="p-3 text-center font-semibold">{calculateTotals(rows).totalAmount.toFixed(2)}</td>
                              <td />
                            </tr>
                          </tfoot>
                        </table>
                      </div>
                    </div>
                  </Grid>
                </CommonCard>
              </Grid>
            </>
          )}
        </Formik>
      </Box>
    </>
  );
};

export default MaterialConsumptionForm;
