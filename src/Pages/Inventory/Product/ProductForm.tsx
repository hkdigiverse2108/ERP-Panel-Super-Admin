import ClearIcon from "@mui/icons-material/Clear";
import { Box, Grid, IconButton, Typography } from "@mui/material";
import { FieldArray, Form, Formik, useFormikContext, type FormikHelpers, type FormikValues } from "formik";
import { useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Mutations, Queries } from "../../../Api";
import { CommonButton, CommonValidationCreatableSelect, CommonValidationDatePicker, CommonValidationQuillInput, CommonValidationSelect, CommonValidationSwitch, CommonValidationTextField } from "../../../Attribute";
import { CommonBottomActionBar, CommonBreadcrumbs, CommonCard } from "../../../Components/Common";
import { CommonFormImageBox } from "../../../Components/Common/CommonUploadImage/CommonImageBox";
import { PAGE_TITLE } from "../../../Constants";
import { BREADCRUMBS, PRODUCT_EXPIRY_TYPE, PRODUCT_TYPE_OPTIONS } from "../../../Data";
import { useAppDispatch, useAppSelector } from "../../../Store/hooks";
import { setSelectedFiles, setUploadModal } from "../../../Store/Slices/ModalSlice";
import type { ImageSyncProps, NutritionInfo, ProductFormValues, VariantInfo } from "../../../Types";
import { DateConfig, GenerateOptions, GetChangedFields, RemoveEmptyFields } from "../../../Utils";
import { ProductFormSchema } from "../../../Utils/ValidationSchemas";
import { usePagePermission } from "../../../Utils/Hooks";
import AddIcon from "@mui/icons-material/Add";

const ProductForm = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const [activeImageKey, setActiveImageKey] = useState<"images" | null>(null);
  const permission = usePagePermission(PAGE_TITLE.INVENTORY.PRODUCT.BASE);

  const { data } = location.state || {};
  const { data: BrandsData, isLoading: BrandsDataLoading } = Queries.useGetBrandDropdown({ onlyBrandFilter: true });
  const { data: CategoryData, isLoading: CategoryDataLoading } = Queries.useGetCategoryDropdown({ onlyCategoryFilter: true });
  const { data: ProductTypeData, isLoading: ProductTypeDataLoading } = Queries.useGetProductTypeDropdown();

  const { mutate: addProduct, isPending: isAddLoading } = Mutations.useAddProduct();
  const { mutate: editProduct, isPending: isEditLoading } = Mutations.useEditProduct();

  const isEditing = Boolean(data?._id);
  const [isVariants, setVariants] = useState(data?.variants?.length > 0);
  const pageMode = isEditing ? "EDIT" : "ADD";

  const defaultVariants = { name: "", sku: "", attributes: [{ key: "", value: "" }], mrp: 0, sellingPrice: 0, purchasePrice: 0, isActive: true };

  const initialValues = useMemo<ProductFormValues>(
    () => ({
      sku: data?.sku || "",
      productType: data?.productType || "",
      name: data?.name || "",
      printName: data?.printName || "",
      hsnCode: data?.hsnCode || "",
      categoryId: data?.categoryId?._id || "",
      subCategoryId: data?.subCategoryId?._id || "",
      brandId: data?.brandId?._id || "",
      subBrandId: data?.subBrandId?._id || "",
      cessPercentage: data?.cessPercentage || null,
      // uomId: data?.uomId || "",
      manageMultipleBatch: data?.manageMultipleBatch ?? true,
      hasExpiry: data?.hasExpiry ?? true,
      expiryDays: data?.expiryDays || null,
      calculateExpiryOn: data?.calculateExpiryOn || "",
      expiryReferenceDate: data?.expiryReferenceDate || DateConfig.utc().toISOString(),
      isExpiryProductSaleable: data?.isExpiryProductSaleable ?? true,
      ingredients: data?.ingredients || [],
      shortDescription: data?.shortDescription || "",
      description: data?.description || "",
      nutrition: [...(data?.nutrition?.map((nutrition: NutritionInfo) => ({ name: nutrition.name, value: nutrition.value })) || [{ name: "", value: "" }])],
      netWeight: data?.netWeight || null,
      masterQty: data?.masterQty || null,
      images: data?.images || [],
      isActive: data?.isActive ?? true,
      productTypeId: data?.productTypeId?._id || "",
      variants: [
        ...(data?.variants?.map((variants: VariantInfo) => ({
          name: variants.name,
          sku: variants.sku,
          attributes: variants.attributes?.map((attr: { key: string; value: string }) => ({ key: attr.key, value: attr.value })) || [{ key: "", value: "" }],
          mrp: variants.mrp,
          sellingPrice: variants.sellingPrice,
          purchasePrice: variants.purchasePrice,
          isActive: variants.isActive,
        })) || [defaultVariants]),
      ],
    }),
    [data],
  );

  const FormikImageSync = <T extends FormikValues>({ activeKey, clearActiveKey }: ImageSyncProps) => {
    const { selectedFiles } = useAppSelector((state) => state.modal);
    const { setFieldValue, values } = useFormikContext<T>();

    useEffect(() => {
      if (!selectedFiles.length || !activeKey) return;
      const merged = [...(values[activeKey] || []), ...selectedFiles].filter((v, i, arr) => arr.indexOf(v) === i);
      setFieldValue(activeKey, merged);

      dispatch(setSelectedFiles([]));
      clearActiveKey();
    }, [selectedFiles, activeKey, setFieldValue, clearActiveKey, values]);

    return null;
  };

  const SubCategorySelect = ({ id }: { id: string }) => {
    const { data: subCategoryData, isLoading: subCategoryDataLoading } = Queries.useGetCategoryDropdown({ parentCategoryFilter: id }, Boolean(id));
    return <CommonValidationSelect name="subCategoryId" label="Sub Category" isLoading={subCategoryDataLoading} options={GenerateOptions(subCategoryData?.data)} grid={{ xs: 12, sm: 6, xl: 3 }} />;
  };
  const SubBrandSelect = ({ id }: { id: string }) => {
    const { data: subBrandData, isLoading: subBrandDataLoading } = Queries.useGetBrandDropdown({ parentBrandFilter: id }, Boolean(id));
    return <CommonValidationSelect name="subBrandId" label="Sub Brand" isLoading={subBrandDataLoading} options={GenerateOptions(subBrandData?.data)} grid={{ xs: 12, sm: 6, xl: 3 }} />;
  };

  const handleUpload = () => {
    setActiveImageKey("images");
    dispatch(setUploadModal({ open: true, type: "image", multiple: true }));
  };

  const handleSubmit = async (values: ProductFormValues, { resetForm }: FormikHelpers<ProductFormValues>) => {
    const { _submitAction, nutrition, ...rest } = values;

    const cleanedNutrition = nutrition?.filter((n) => n.name !== "" && n.value !== "");

    const payload = {
      ...rest,
      ...(cleanedNutrition?.length ? { nutrition: cleanedNutrition } : null),
    };

    const handleSuccess = () => {
      if (_submitAction === "saveAndNew") resetForm();
      else navigate(-1);
    };
    if (isEditing) {
      const changedFields = GetChangedFields(payload, data);
      await editProduct({ ...changedFields, productId: data._id }, { onSuccess: handleSuccess });
    } else {
      await addProduct(RemoveEmptyFields(payload), { onSuccess: handleSuccess });
    }
  };

  useEffect(() => {
    const hasAccess = isEditing ? permission.edit : permission.add;
    if (!hasAccess) navigate(-1);
  }, [isEditing, permission, navigate]);
  return (
    <>
      <CommonBreadcrumbs title={PAGE_TITLE.INVENTORY.PRODUCT[pageMode]} maxItems={1} breadcrumbs={BREADCRUMBS.PRODUCT[pageMode]} />

      <Box sx={{ p: { xs: 2, md: 3 }, mb: 8 }}>
        <Formik<ProductFormValues> enableReinitialize initialValues={initialValues} validationSchema={ProductFormSchema} onSubmit={handleSubmit}>
          {({ values, setFieldValue, resetForm, dirty }) => {
            return (
              <Form noValidate>
                <FormikImageSync activeKey={activeImageKey} clearActiveKey={() => setActiveImageKey(null)} />
                <Grid container spacing={2}>
                  {/* ---------- GENERAL DETAILS ---------- */}
                  <CommonCard title="General Details" grid={{ xs: 12 }}>
                    <Grid container spacing={2} sx={{ p: 2 }}>
                      <CommonValidationSelect name="productType" label="Product Type" options={PRODUCT_TYPE_OPTIONS} grid={{ xs: 12, sm: 6, xl: 3 }} required />
                      <CommonValidationTextField name="name" label="Product Name" grid={{ xs: 12, sm: 6, xl: 3 }} required />
                      <CommonValidationTextField name="printName" label="Print Name" grid={{ xs: 12, sm: 6, xl: 3 }} required />
                      <CommonValidationTextField name="hsnCode" label="HSN Code" grid={{ xs: 12, sm: 6, xl: 3 }} />
                      <CommonValidationSelect name="categoryId" label="Category" isLoading={CategoryDataLoading} options={GenerateOptions(CategoryData?.data)} grid={{ xs: 12, sm: 6, xl: 3 }} required />
                      <SubCategorySelect id={values.categoryId || ""} />
                      <CommonValidationSelect name="brandId" label="Brand" isLoading={BrandsDataLoading} options={GenerateOptions(BrandsData?.data)} grid={{ xs: 12, sm: 6, xl: 3 }} required />
                      <SubBrandSelect id={values.brandId || ""} />
                      <CommonValidationTextField name="cessPercentage" label="cess Percentage" type="number" grid={{ xs: 12, sm: 6, xl: 3 }} />
                      <CommonValidationTextField name="sku" label="sku" grid={{ xs: 12, sm: 3 }} />
                      <CommonValidationSwitch name="manageMultipleBatch" label="Manage Multiple Batch" syncFieldName="hasExpiry" grid={{ xs: 12, sm: 6, xl: 3 }} />
                      {values.manageMultipleBatch && <CommonValidationSwitch name="hasExpiry" label="hasExpiry" grid={{ xs: 12, sm: 6, xl: 3 }} />}
                      {values.manageMultipleBatch && values.hasExpiry && (
                        <>
                          <CommonValidationTextField name="expiryDays" label="expiryDays" grid={{ xs: 12, sm: 6, xl: 3 }} required />
                          <CommonValidationSelect name="calculateExpiryOn" label="calculate ExpiryOn" options={PRODUCT_EXPIRY_TYPE} grid={{ xs: 12, sm: 6, xl: 3 }} required />
                          <CommonValidationDatePicker name="expiryReferenceDate" label="expiry Reference Date" grid={{ xs: 12, sm: 6, xl: 3 }} required />
                          <CommonValidationSwitch name="isExpiryProductSaleable" label="Expiry Product Saleable" grid={{ xs: 12, sm: 6, xl: 3 }} />
                        </>
                      )}
                      <CommonValidationSelect name="productTypeId" label="Type" options={GenerateOptions(ProductTypeData?.data)} isLoading={ProductTypeDataLoading} grid={{ xs: 12, sm: 3 }} required />
                      <CommonValidationCreatableSelect name="ingredients" label="Ingredients" options={[]} grid={{ xs: 12, sm: 9 }} />
                      <CommonValidationTextField name="shortDescription" label="short Description" multiline grid={{ xs: 12 }} />
                      <CommonValidationQuillInput name="description" label="Description" grid={{ xs: 12 }} />
                      <CommonFormImageBox name="images" label="Product Images" type="image" grid={{ xs: 12 }} multiple onUpload={handleUpload} />
                      <Grid size={12}>
                        <FieldArray name="nutrition">
                          {({ push, remove }) => (
                            <>
                              <Box p={2} className="border border-gray-300 dark:border-gray-600 rounded-sm">
                                {values?.nutrition?.map((_, vIndex) => (
                                  <Grid key={vIndex} container spacing={2} sx={{ xs: 12 }} py={1}>
                                    <CommonValidationTextField name={`nutrition.${vIndex}.name`} label="Nutrition Name" grid={{ xs: 12, md: 6 }} />
                                    <CommonValidationTextField name={`nutrition.${vIndex}.value`} label="Nutrition Value" grid={{ xs: 12, md: 5.5 }} />
                                    {(values?.nutrition?.length || 0) > 1 && (
                                      <IconButton color="error" size="small" onClick={() => remove(vIndex)}>
                                        <ClearIcon />
                                      </IconButton>
                                    )}
                                  </Grid>
                                ))}
                                {
                                  <CommonButton variant="outlined" onClick={() => push({ name: "", value: "" })}>
                                    + Add Nutrition
                                  </CommonButton>
                                }
                              </Box>
                            </>
                          )}
                        </FieldArray>
                      </Grid>
                      <CommonValidationTextField name="netWeight" label="Net Weight" type="number" grid={{ xs: 12, md: 6 }} />
                      <CommonValidationTextField name="masterQty" label="master Qty" type="number" grid={{ xs: 12, md: 6 }} />
                      {!isEditing && <CommonValidationSwitch name="isActive" label="Is Active" grid={{ xs: 12 }} />}
                    </Grid>
                  </CommonCard>
                  {/* ---------- Variants ---------- */}
                  <CommonCard
                    title="Variants"
                    grid={{ xs: 12 }}
                    topContent={
                      isVariants ? (
                        <CommonButton
                          title="Clear"
                          size="small"
                          color="error"
                          variant="outlined"
                          onClick={() => {
                            setVariants(false);
                            setFieldValue("variants", []);
                          }}
                        />
                      ) : (
                        ""
                      )
                    }
                  >
                    {isVariants ? (
                      <FieldArray name="variants">
                        {({ push, remove }) => (
                          <Box p={2}>
                            {values?.variants?.map((_, vIndex) => (
                              <Grid key={vIndex} container spacing={2} sx={{ xs: 12 }} p={1.5} mb={1} className="border border-gray-300 dark:border-gray-600 rounded-sm">
                                <CommonValidationTextField name={`variants.${vIndex}.name`} label="Name" grid={{ xs: 12, sm: 6, xl: 4 }} required />
                                <CommonValidationTextField name={`variants.${vIndex}.sku`} label="sku" grid={{ xs: 12, sm: 6, xl: 4 }} required />
                                <CommonValidationTextField name={`variants.${vIndex}.mrp`} label="mrp" type="number" grid={{ xs: 12, sm: 6, xl: 4 }} />
                                <CommonValidationTextField name={`variants.${vIndex}.sellingPrice`} label="sellingPrice" type="number" grid={{ xs: 12, sm: 6, xl: 4 }} />
                                <CommonValidationTextField name={`variants.${vIndex}.purchasePrice`} label="purchasePrice" type="number" grid={{ xs: 12, sm: 6, xl: 4 }} />
                                <Grid size={12}>
                                  <FieldArray name={`variants.${vIndex}.attributes`}>
                                    {({ push, remove }) => (
                                      <Box className="border border-gray-300 dark:border-gray-600 rounded-sm">
                                        {values?.variants?.[vIndex]?.attributes?.map((_, attrIndex) => (
                                          <Grid key={attrIndex} container spacing={2} sx={{ xs: 12 }} p={1.5}>
                                            <CommonValidationTextField name={`variants.${vIndex}.attributes.${attrIndex}.key`} label="Attributes key" grid={{ xs: 12, sm: 6, xl: 4 }} />
                                            <CommonValidationTextField name={`variants.${vIndex}.attributes.${attrIndex}.value`} label="Attributes Value" grid={{ xs: 12, sm: 6, xl: 4 }} />
                                            {(values?.variants?.[vIndex]?.attributes?.length || 0) > 1 && (
                                              <CommonButton variant="outlined" color="error" size="small" onClick={() => remove(attrIndex)}>
                                                <ClearIcon />
                                              </CommonButton>
                                            )}
                                            <CommonButton variant="outlined" size="small" onClick={() => push({ key: "", value: "" })}>
                                              <AddIcon />
                                            </CommonButton>
                                          </Grid>
                                        ))}
                                      </Box>
                                    )}
                                  </FieldArray>
                                </Grid>
                                <CommonValidationSwitch name={`variants.${vIndex}.isActive`} label="Is Active" grid={"auto"} />
                                {(values?.variants?.length || 0) > 1 && (
                                  <CommonButton variant="outlined" color="error" size="small" onClick={() => remove(vIndex)}>
                                    <ClearIcon />
                                  </CommonButton>
                                )}
                              </Grid>
                            ))}
                            <CommonButton variant="outlined" onClick={() => push(defaultVariants)}>
                              + Add Variant
                            </CommonButton>
                          </Box>
                        )}
                      </FieldArray>
                    ) : (
                      <Box display={"flex"} flexDirection={"column"} alignItems={"center"} justifyContent={"center"} gap={1} py={2}>
                        <CommonButton
                          variant="outlined"
                          onClick={() => {
                            setVariants(true);
                            setFieldValue("variants", [defaultVariants]);
                          }}
                        >
                          Add Variant
                        </CommonButton>
                        <Typography variant="subtitle2" color="text.secondary">
                          Add Variants If This Product Comes In Multiple Versions, Like Different Sizes or Colors.
                        </Typography>
                      </Box>
                    )}
                  </CommonCard>
                  {/* ---------- ACTION BAR ---------- */}
                  <CommonBottomActionBar save={isEditing} clear={!isEditing} disabled={!dirty} isLoading={isAddLoading || isEditLoading} onClear={() => resetForm({ values: initialValues })} onSave={() => setFieldValue("_submitAction", "save")} onSaveAndNew={() => setFieldValue("_submitAction", "saveAndNew")} />
                </Grid>
              </Form>
            );
          }}
        </Formik>
      </Box>
    </>
  );
};

export default ProductForm;
