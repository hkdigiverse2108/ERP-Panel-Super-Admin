import ClearIcon from "@mui/icons-material/Clear";
import { Box, Grid } from "@mui/material";
import { Form, Formik, useFormikContext } from "formik";
import type { FormikProps } from "formik";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Mutations, Queries } from "../../../Api";
import { CommonButton, CommonTextField, CommonValidationDatePicker, CommonValidationTextField, CommonDatePicker, CommonValidationSelect, CommonValidationSwitch } from "../../../Attribute";
import { CommonBottomActionBar, CommonBreadcrumbs, CommonCard } from "../../../Components/Common";
import { PAGE_TITLE, ROUTES } from "../../../Constants";
import { BREADCRUMBS } from "../../../Data";
import type { BillOfLiveProductBase, BillOfLiveProductDetailUI, BillOfLiveProductFormValues, ProductBase, RecipeBase } from "../../../Types";
import { GenerateOptions, DateConfig } from "../../../Utils";
import { useLocation, useNavigate } from "react-router-dom";
import { usePagePermission } from "../../../Utils/Hooks";

interface BomRow {
  id: string;
  recipeId: string;
  name: string;
  qty: number;
  purchasePrice: number;
  landingCost: number;
  mrp: number;
  sellingPrice: number;
  expiryDays: number;
  mfgDate: string | null;
  expDate: string | null;
  rawProducts?: {
    productId: ProductBase;
    availableQty: number;
    useQty: number;
  }[];
}
const RecipeWatcher = ({ onChange }: { onChange: (ids: string[]) => void }) => {
  const { values } = useFormikContext<BillOfLiveProductFormValues>();
  const prevKey = useRef<string>("");
  const ids = values.recipeId || [];
  const onChangeRef = useRef(onChange);
  const idsKey = ids.join(",");

  useEffect(() => {
    onChangeRef.current = onChange;
  }, [onChange]);

  useEffect(() => {
    if (idsKey !== prevKey.current) {
      prevKey.current = idsKey;
      onChangeRef.current(ids);
    }
  }, [idsKey]);
  return null;
};
const BOLP_PREFIX = "BOLP";
const parseBimNumber = (value?: string) => {
  if (!value) return "";
  const match = value.match(/\d+/);
  return match ? match[0] : "";
};
const formatBimNumber = (num?: string | number) => {
  if (!num) return "";
  return `${BOLP_PREFIX} ${num}`;
};
const BillOfLiveProductForm = () => {
  const { data: recipeData } = Queries.useGetRecipe({ activeFilter: true });

  const navigate = useNavigate();
  const location = useLocation();
  const permission = usePagePermission(PAGE_TITLE.INVENTORY.BILL_OF_LIVE_PRODUCT.BASE);
  const { data, no } = location.state as {
    data?: BillOfLiveProductBase;
    no?: number;
  };

  const isEditing = Boolean(data?._id);

  const [rows, setRows] = useState<BomRow[]>([]);

  const pageMode = isEditing ? "EDIT" : "ADD";

  const bomNumber = isEditing ? data?.number : String((Number(no) || 0) + 1);

  const { mutate: addBOM, isPending: isAddLoading } = Mutations.useAddBillOfLiveProduct();

  const { mutate: editBOM, isPending: isEditLoading } = Mutations.useEditBillOfLiveProduct();

  const formikRef = useRef<FormikProps<BillOfLiveProductFormValues> | null>(null);

  /* ---------------- CREATE ROW FROM RECIPE ---------------- */

  const createRowFromRecipe = (recipe: RecipeBase): BomRow => {
    const product = recipe.finalProducts?.productId as ProductBase;

    return {
      id: product._id,
      recipeId: recipe._id,
      name: product.name ?? "",
      qty: recipe.finalProducts?.qtyGenerate ?? 1,
      purchasePrice: product.purchasePrice ?? 0,
      landingCost: product.landingCost ?? 0,
      mrp: recipe.finalProducts?.mrp ?? 0,
      sellingPrice: product.sellingPrice ?? 0,
      expiryDays: recipe.finalProducts?.expiryDays ?? 0,
      mfgDate: DateConfig.utc().toISOString(),
      expDate: null,
      rawProducts: recipe.rawProducts?.map((r) => ({ productId: r.productId as ProductBase, availableQty: (r.productId as ProductBase)?.qty ?? 0, useQty: r.useQty ?? 0 })) || [],
    };
  };

  /* ---------------- MERGE HELPERS ---------------- */

  const mergeRow = (recipe: RecipeBase, saved?: BillOfLiveProductDetailUI, existing?: BomRow): BomRow => {
    const base = createRowFromRecipe(recipe);
    const withSaved: BomRow = {
      ...base,
      qty: saved?.qty ?? base.qty,
      purchasePrice: saved?.purchasePrice ?? base.purchasePrice,
      landingCost: saved?.landingCost ?? base.landingCost,
      mrp: saved?.mrp ?? base.mrp,
      sellingPrice: saved?.sellingPrice ?? base.sellingPrice,
      mfgDate: saved?.mfgDate ?? base.mfgDate,
      expiryDays: saved?.expiryDays ?? base.expiryDays,
      expDate: saved?.expiryDate ?? base.expDate,
      rawProducts:
        base.rawProducts?.map((raw) => {
          const matchedSaved = saved?.ingredients?.find((ing) => ing.productId._id === raw.productId._id);
          return { ...raw, useQty: matchedSaved?.useQty ?? raw.useQty, availableQty: matchedSaved?.availableQty ?? raw.availableQty };
        }) ?? [],
    };
    if (!existing) return withSaved;
    return {
      ...withSaved,
      ...existing,
      rawProducts:
        withSaved.rawProducts?.map((raw) => {
          const matchedExisting = existing.rawProducts?.find((r) => r.productId._id === raw.productId._id);
          return matchedExisting ? { ...raw, ...matchedExisting } : raw;
        }) ?? [],
    };
  };

  const buildRowsFromSelection = (ids: string[], prevRows: BomRow[], productDetails?: BillOfLiveProductDetailUI[]) => {
    const allRecipes = recipeData?.data?.recipe_data || [];

    return ids
      .map((id) => {
        const recipe = allRecipes.find((r) => r._id === id);
        if (!recipe) return null;
        const finalProductId = (recipe.finalProducts?.productId as ProductBase)?._id;
        const savedDetail = productDetails?.find((pd) => pd.productId?._id === finalProductId);
        const existing = prevRows.find((r) => r.recipeId === id);
        return mergeRow(recipe, savedDetail, existing);
      })
      .filter(Boolean) as BomRow[];
  };

  const updateRow = (id: string, data: Partial<BomRow>) => {
    setRows((prev) => prev.map((row) => (row.id === id ? { ...row, ...data } : row)));
  };
  const handleCut = (recipeId: string) => {
    const current: string[] = formikRef.current?.values?.recipeId ?? [];
    const updated = current.filter((id) => id !== recipeId);
    formikRef.current?.setFieldValue("recipeId", updated);
    setRows((prev) => prev.filter((row) => row.recipeId !== recipeId));
  };

  const updateRawQty = (rowId: string, index: number, value: number) => {
    setRows((prev) => prev.map((row) => (row.id === rowId ? { ...row, rawProducts: row.rawProducts?.map((raw, i) => (i === index ? { ...raw, useQty: value } : raw)) } : row)));
  };

  const initialSyncKeyRef = useRef<string>("");

  useEffect(() => {
    const ids = formikRef.current?.values?.recipeId ?? [];
    if (!ids.length || !recipeData?.data?.recipe_data?.length) return;

    const key = ids.join(",");
    if (key === initialSyncKeyRef.current) return;
    initialSyncKeyRef.current = key;

    setRows((prev) => buildRowsFromSelection(ids, prev, data?.productDetails));
  }, [recipeData, data?.productDetails, isEditing]);

  /* ---------------- FORM ---------------- */

  const initialValues: BillOfLiveProductFormValues = useMemo(
    () => ({
      number: isEditing ? parseBimNumber(data?.number) : bomNumber,
      date: isEditing ? data?.date : DateConfig.utc().toISOString(),
      allowReverseCalculation: data?.allowReverseCalculation ?? false,
      recipeId: data?.recipeId?.map((b: RecipeBase) => b._id) ?? [],
    }),
    [isEditing, bomNumber, data?.number, data?.date, data?.allowReverseCalculation, data?.recipeId],
  );

  const syncRowsFromRecipeIds = useCallback(
    (ids: string[]) => {
      setRows((prev) => buildRowsFromSelection(ids, prev, data?.productDetails));
    },
    [buildRowsFromSelection, data?.productDetails],
  );

  /* ---------------- SUBMIT ---------------- */

  const handleSubmit = (values: BillOfLiveProductFormValues) => {
    const productDetails = rows.map((r) => ({
      productId: r.id,
      qty: r.qty,
      purchasePrice: r.purchasePrice,
      landingCost: r.landingCost,
      mrp: r.mrp,
      sellingPrice: r.sellingPrice,

      mfgDate: r.mfgDate || undefined,
      expiryDays: r.expiryDays,
      expiryDate: r.expDate || undefined,

      ingredients: r.rawProducts?.map((raw) => ({
        productId: raw.productId._id,
        availableQty: raw.availableQty,
        useQty: raw.useQty,
      })),
    }));

    if (isEditing) {
      editBOM({ billOfLiveProductId: data!._id, recipeId: values.recipeId, productDetails, number: formatBimNumber(values.number) }, { onSuccess: () => navigate(ROUTES.BILL_OF_LIVE_PRODUCT.BASE) });
    } else {
      addBOM({ number: formatBimNumber(values.number), date: values.date, allowReverseCalculation: values.allowReverseCalculation, recipeId: values.recipeId, productDetails }, { onSuccess: () => navigate(ROUTES.BILL_OF_LIVE_PRODUCT.BASE) });
    }
  };
  useEffect(() => {
    const hasAccess = isEditing ? permission.edit : permission.add;
    if (!hasAccess) navigate(-1);
  }, [isEditing, permission, navigate]);
  return (
    <>
      <CommonBreadcrumbs title={PAGE_TITLE.INVENTORY.BILL_OF_LIVE_PRODUCT[pageMode]} breadcrumbs={BREADCRUMBS.BILL_OF_LIVE_PRODUCT[pageMode]} />
      <Box sx={{ p: { xs: 2, md: 3 }, display: "grid", gap: 2, mb: 10 }}>
        <CommonCard hideDivider>
          <Grid container spacing={2} sx={{ p: 2 }}>
            <Grid size={12}>
              {(recipeData?.data?.recipe_data?.length ?? 0) > 0 && (
                <Formik enableReinitialize innerRef={formikRef} initialValues={initialValues} onSubmit={handleSubmit}>
                  {() => (
                    <Form noValidate>
                      <RecipeWatcher onChange={syncRowsFromRecipeIds} />
                      <Grid container spacing={2}>
                        <CommonValidationDatePicker name="date" label="Date" grid={{ xs: 12, md: 3 }} />
                        <CommonValidationTextField name="text" label="BOLP" disabled grid={{ xs: 12, md: 2 }} />
                        <CommonValidationTextField name="number" label="No" disabled grid={{ xs: 12, md: 2 }} />
                        <CommonValidationSelect name="recipeId" label="Recipe" multiple limitTags={1} grid={{ xs: 12, md: 5 }} options={GenerateOptions(recipeData?.data?.recipe_data)} />
                        <CommonValidationSwitch name="allowReverseCalculation" label="Allow Reverse Calculation" />
                      </Grid>
                    </Form>
                  )}
                </Formik>
              )}
            </Grid>

            {/* ================= TABLE ================= */}
            <Grid size={12}>
              <CommonCard title="Product Details">
                <div className="w-full bg-white dark:bg-gray-dark">
                  <div className="lg:max-h-[500px] min-h-auto! overflow-x-auto custom-scrollbar">
                    <table className="w-full text-sm ">
                      <thead className="sticky top-0 z-10 bg-gray-100 dark:text-gray-100 text-gray-700 dark:bg-gray-900">
                        <tr>
                          <th className="p-2">Sr No</th>
                          <th className="p-2 text-start">Product</th>
                          <th className="p-2">Qty</th>
                          <th className="p-2">Purchase Price</th>
                          <th className="p-2">Landing Cost</th>
                          <th className="p-2">MRP</th>
                          <th className="p-2">Selling Price</th>
                          <th className="p-2">MFG Date</th>
                          <th className="p-2">Expiry Days</th>
                          <th className="p-2">EXP Date</th>
                          <th className="p-2">Action</th>
                        </tr>
                      </thead>

                      <tbody>
                        {rows.map((row, i) => {
                          const recipe = recipeData?.data?.recipe_data.find((r) => r._id === row.recipeId);

                          return (
                            <>
                              <tr className="bg-blue-50 dark:bg-blue-900/20">
                                <td colSpan={11} className="px-3 py-2 font-semibold text-blue-600 dark:text-blue-400">
                                  {recipe?.name}
                                </td>
                              </tr>
                              {/* ===== FINAL PRODUCT ===== */}
                              <tr className="text-center bg-white dark:bg-gray-800 even:bg-gray-50 dark:even:bg-gray-dark text-gray-600 dark:text-gray-300">
                                <td className="p-2 text-center">{i + 1}</td>

                                <td className="p-2 min-w-35 w-35 text-start">{row.name}</td>

                                <td className="p-2 min-w-30 w-30">
                                  <CommonTextField type="number" value={row.qty} onChange={(v) => updateRow(row.id, { qty: Number(v) })} />
                                </td>

                                <td className="p-2 min-w-30 w-30">
                                  <CommonTextField type="number" value={row.purchasePrice} onChange={(v) => updateRow(row.id, { purchasePrice: Number(v) })} />
                                </td>
                                <td className="p-2 min-w-30 w-30">
                                  <CommonTextField type="number" value={row.landingCost} onChange={(v) => updateRow(row.id, { landingCost: Number(v) })} />
                                </td>

                                <td className="p-2 min-w-30 w-30">
                                  <CommonTextField type="number" value={row.mrp} onChange={(v) => updateRow(row.id, { mrp: Number(v) })} />
                                </td>

                                <td className="p-2 min-w-30 w-30">
                                  <CommonTextField type="number" value={row.sellingPrice} onChange={(v) => updateRow(row.id, { sellingPrice: Number(v) })} />
                                </td>

                                <td className="p-2 min-w-30 w-30">
                                  <CommonDatePicker name="mfgDate" value={row.mfgDate} onChange={(v) => updateRow(row.id, { mfgDate: v })} />
                                </td>

                                <td>{row.expiryDays}</td>

                                <td className="p-2 min-w-30 w-30">
                                  <CommonDatePicker name="expDate" value={row.expDate ?? ""} onChange={(v) => updateRow(row.id, { expDate: v })} />
                                </td>

                                <td className="p-2">
                                  <CommonButton size="small" color="error" variant="outlined" onClick={() => handleCut(row.recipeId)}>
                                    <ClearIcon />
                                  </CommonButton>
                                </td>
                              </tr>
                              {/* ===== RAW MATERIAL TABLE ===== */}
                              {row.rawProducts?.length ? (
                                <tr className="bg-white dark:bg-gray-800">
                                  <td colSpan={11} className="p-4">
                                    <div className="border border-gray-200 dark:border-gray-600 rounded-md overflow-hidden">
                                      <table className="w-full text-sm">
                                        <thead className="bg-gray-100 dark:bg-gray-900">
                                          <tr>
                                            <th className="p-2">Sr No</th>
                                            <th className="p-2 text-start">Raw Product</th>
                                            <th className="p-2">Available Qty</th>
                                            <th className="p-2">Use Qty</th>
                                          </tr>
                                        </thead>
                                        <tbody>
                                          {row.rawProducts.map((raw, index) => (
                                            <tr key={index} className="even:bg-gray-50 dark:even:bg-gray-dark">
                                              <td className="text-center p-2">{index + 1}</td>
                                              <td className="text-start p-2">{raw.productId?.name}</td>
                                              <td className="text-center p-2">{raw.availableQty}</td>
                                              <td className="text-center p-2">
                                                <CommonTextField type="number" value={raw.useQty ?? 0} onChange={(v) => updateRawQty(row.id, index, Number(v))} />
                                              </td>
                                            </tr>
                                          ))}
                                        </tbody>
                                      </table>
                                    </div>
                                  </td>
                                </tr>
                              ) : null}
                            </>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                </div>
              </CommonCard>
            </Grid>
            <CommonBottomActionBar save isLoading={isAddLoading || isEditLoading} onSave={() => formikRef.current?.submitForm()} />
          </Grid>
        </CommonCard>
      </Box>
    </>
  );
};
export default BillOfLiveProductForm;
