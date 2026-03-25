import ClearIcon from "@mui/icons-material/Clear";
import { Box, Grid } from "@mui/material";
import { Form, Formik, useFormikContext } from "formik";
import type { FormikProps } from "formik";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Mutations, Queries } from "../../../Api";
import { CommonButton, CommonTextField, CommonValidationDatePicker, CommonValidationTextField, CommonDatePicker, CommonValidationSelect, CommonValidationSwitch } from "../../../Attribute";
import { CommonBottomActionBar, CommonBreadcrumbs, CommonCard, CommonTable } from "../../../Components/Common";
import { PAGE_TITLE, ROUTES } from "../../../Constants";
import { BREADCRUMBS } from "../../../Data";
import type { BillOfLiveProductBase, BillOfLiveProductFormValues, ProductBase, RecipeBase, CommonTableColumn, BillOfLiveProductDetail } from "../../../Types";
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
    baseAvailableQty: number;
    productId: ProductBase;
    availableQty: number;
    baseUseQty: number;
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
  const location = useLocation();
  const { data, no } = location.state as {
    data?: BillOfLiveProductBase;
    no?: number;
  };

  const { data: recipeData, isLoading: recipeLoading, isFetching: recipeFetching } = Queries.useGetRecipe({ activeFilter: true });
  const { data: CompanyData, isLoading: CompanyDataLoading } = Queries.useGetCompanyDropdown();

  const navigate = useNavigate();
  const permission = usePagePermission(PAGE_TITLE.INVENTORY.BILL_OF_LIVE_PRODUCT.BASE);

  const isEditing = Boolean(data?._id);

  const [rows, setRows] = useState<BomRow[]>([]);

  const pageMode = isEditing ? "EDIT" : "ADD";

  const bomNumber = isEditing ? data?.number : String((Number(no) || 0) + 1);

  const { mutate: addBOM, isPending: isAddLoading } = Mutations.useAddBillOfLiveProduct();

  const { mutate: editBOM, isPending: isEditLoading } = Mutations.useEditBillOfLiveProduct();

  const formikRef = useRef<FormikProps<BillOfLiveProductFormValues> | null>(null);

  /* ---------------- CREATE ROW FROM RECIPE ---------------- */

  const createRowFromRecipe = (recipe: RecipeBase): BomRow | null => {
    const product = recipe.finalProducts?.productId as ProductBase;
    if (!product) return null;

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
      rawProducts: recipe.rawProducts?.filter((r) => r.productId).map((r) => ({ productId: r.productId as ProductBase, baseAvailableQty: (r.productId as ProductBase)?.qty ?? 0, availableQty: (r.productId as ProductBase)?.qty ?? 0, useQty: r.useQty ?? 0, baseUseQty: r.useQty ?? 0 })) || [],
    };
  };

  /* ---------------- MERGE HELPERS ---------------- */

  const mergeRow = (recipe: RecipeBase, saved?: BillOfLiveProductDetail, existing?: BomRow): BomRow | null => {
    const base = createRowFromRecipe(recipe);
    if (!base) return null;
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
          const matchedSaved = saved?.ingredients?.find((ing) => {
            const id = typeof ing.productId === "string" ? ing.productId : ing.productId?._id;
            return id === raw.productId?._id;
          });
          return { ...raw, useQty: matchedSaved?.useQty ?? raw.useQty, availableQty: matchedSaved?.availableQty ?? raw.availableQty };
        }) ?? [],
    };
    if (!existing) return withSaved;
    return {
      ...withSaved,
      ...existing,
      rawProducts:
        withSaved.rawProducts?.map((raw) => {
          const matchedExisting = existing.rawProducts?.find((r) => r.productId?._id === raw.productId?._id);
          return matchedExisting ? { ...raw, ...matchedExisting } : raw;
        }) ?? [],
    };
  };

  const buildRowsFromSelection = (ids: string[], prevRows: BomRow[], productDetails?: BillOfLiveProductDetail[]) => {
    const allRecipes = recipeData?.data?.recipe_data || [];

    return ids
      .map((id) => {
        const recipe = allRecipes.find((r) => r._id === id);
        if (!recipe) return null;
        const finalProductId = (recipe.finalProducts?.productId as ProductBase)?._id;
        const savedDetail = productDetails?.find((pd) => {
          const id = typeof pd.productId === "string" ? pd.productId : pd.productId?._id;
          return id === finalProductId;
        });
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
  const handleQtyChange = (rowId: string, qty: number) => {
    setRows((prev) =>
      prev.map((row) => {
        if (row.id !== rowId) return row;

        const updatedRaw = row.rawProducts?.map((raw) => ({
          ...raw,
          availableQty: raw.baseAvailableQty * qty,
          useQty: raw.baseUseQty * qty,
        }));

        return {
          ...row,
          qty,
          rawProducts: updatedRaw,
        };
      }),
    );
  };

  const updateRawQty = (rowId: string, index: number, value: number) => {
    setRows((prev) =>
      prev.map((row) =>
        row.id === rowId
          ? {
            ...row,
            rawProducts: row.rawProducts?.map((raw, i) =>
              i === index
                ? {
                  ...raw,
                  useQty: value,
                  baseUseQty: value / row.qty,
                }
                : raw,
            ),
          }
          : row,
      ),
    );
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
    const productDetails: BillOfLiveProductDetail[] = rows.map((r) => ({
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
        productId: raw.productId?._id,
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
              <Formik enableReinitialize={isEditing} innerRef={formikRef} initialValues={initialValues} onSubmit={handleSubmit}>
                {() => (
                  <Form noValidate>
                    <RecipeWatcher onChange={syncRowsFromRecipeIds} />
                    <Grid container spacing={2}>
                      <CommonValidationSelect name="companyId" label="Company" options={GenerateOptions(CompanyData?.data)} isLoading={CompanyDataLoading} grid={{ xs: 12, md: 4 }} required />
                      <CommonValidationDatePicker name="date" label="Date" grid={{ xs: 12, md: 4 }} />
                      <CommonValidationTextField name="text" label="BOLP" disabled grid={{ xs: 12, md: 4 }} />
                      <CommonValidationTextField name="number" label="No" disabled grid={{ xs: 12, md: 4 }} />
                      <CommonValidationSelect name="recipeId" label="Recipe" multiple limitTags={1} grid={{ xs: 12, md: 4 }} options={GenerateOptions(recipeData?.data?.recipe_data || [])} isLoading={recipeLoading || recipeFetching} />
                      <CommonValidationSwitch name="allowReverseCalculation" label="Allow Reverse Calculation" />
                    </Grid>
                  </Form>
                )}
              </Formik>
            </Grid>

            {/* ================= TABLE ================= */}
            <Grid size={12}>
              <CommonCard title="Product Details">
                <Box sx={{ display: "grid", gap: 3, p: 2 }}>
                  {rows.map((row) => {
                    const recipe = recipeData?.data?.recipe_data.find((r) => r._id === row.recipeId);

                    const productColumns: CommonTableColumn<BomRow>[] = [
                      { key: "sr", header: "Sr No", render: (_, idx) => idx + 1, bodyClass: "w-10" },
                      { key: "name", header: "Product", bodyClass: "text-start min-w-40", render: (r) => r.name },
                      { key: "qty", header: "Qty", bodyClass: "min-w-30", render: (r) => <CommonTextField type="number" value={r.qty} onChange={(v) => handleQtyChange(r.id, Number(v))} /> },
                      { key: "purchasePrice", header: "Purchase Price", bodyClass: "min-w-30", render: (r) => <CommonTextField type="number" value={r.purchasePrice} onChange={(v) => updateRow(r.id, { purchasePrice: Number(v) })} /> },
                      { key: "landingCost", header: "Landing Cost", bodyClass: "min-w-30", render: (r) => <CommonTextField type="number" value={r.landingCost} onChange={(v) => updateRow(r.id, { landingCost: Number(v) })} /> },
                      { key: "mrp", header: "MRP", bodyClass: "min-w-30", render: (r) => <CommonTextField type="number" value={r.mrp} onChange={(v) => updateRow(r.id, { mrp: Number(v) })} /> },
                      { key: "sellingPrice", header: "Selling Price", bodyClass: "min-w-30", render: (r) => <CommonTextField type="number" value={r.sellingPrice} onChange={(v) => updateRow(r.id, { sellingPrice: Number(v) })} /> },
                      { key: "mfgDate", header: "MFG Date", bodyClass: "min-w-30", render: (r) => <CommonDatePicker name="mfgDate" value={r.mfgDate} onChange={(v) => updateRow(r.id, { mfgDate: v })} /> },
                      { key: "expiryDays", header: "Expiry Days", render: (r) => r.expiryDays },
                      { key: "expDate", header: "EXP Date", bodyClass: "min-w-30", render: (r) => <CommonDatePicker name="expDate" value={r.expDate ?? ""} onChange={(v) => updateRow(r.id, { expDate: v })} /> },
                      {
                        key: "actions",
                        header: "Action",
                        render: (r) => (
                          <CommonButton size="small" color="error" variant="outlined" onClick={() => handleCut(r.recipeId)}>
                            <ClearIcon />
                          </CommonButton>
                        ),
                      },
                    ];

                    const rawColumns: CommonTableColumn<{ productId: ProductBase; availableQty: number; useQty: number }>[] = [
                      { key: "sr", header: "Sr No", render: (_, idx) => idx + 1, bodyClass: "w-10" },
                      { key: "name", header: "Raw Product", bodyClass: "text-start min-w-60", render: (raw) => raw.productId?.name },
                      { key: "availableQty", header: "Available Qty", render: (raw) => raw.availableQty },
                      { key: "useQty", header: "Use Qty", bodyClass: "min-w-30", render: (raw, index) => <CommonTextField type="number" value={raw.useQty ?? 0} onChange={(v) => updateRawQty(row.id, index, Number(v))} /> },
                    ];

                    return (
                      <Box key={row.id} sx={{ border: "1px solid", borderColor: "divider", borderRadius: 1, overflow: "hidden" }}>
                        {/* Recipe Header */}
                        <Box sx={{ p: 1.5, bgcolor: "action.hover", borderBottom: "1px solid", borderColor: "divider", fontWeight: "bold", color: "text.primary" }}>{recipe?.name}</Box>

                        {/* Final Product Table */}
                        <Box sx={{ overflowX: "auto" }} className="custom-scrollbar">
                          <CommonTable data={[row]} columns={productColumns} rowKey={(r) => r.id} />
                        </Box>

                        {/* Raw Materials Section */}
                        {row.rawProducts?.length ? (
                          <Box sx={{ p: 2, bgcolor: "action.hover" }}>
                            <Box sx={{ mb: 1, fontWeight: "500", fontSize: "0.875rem" }}>Raw Materials</Box>
                            <Box sx={{ bgcolor: "background.paper", borderRadius: 1, border: "1px solid", borderColor: "divider", overflow: "hidden" }}>
                              <Box sx={{ overflowX: "auto" }} className="custom-scrollbar">
                                <CommonTable data={row.rawProducts} columns={rawColumns} rowKey={(_, idx) => idx.toString()} />
                              </Box>
                            </Box>
                          </Box>
                        ) : null}
                      </Box>
                    );
                  })}
                </Box>
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
