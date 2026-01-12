import ClearIcon from "@mui/icons-material/Clear";
import { Box, Grid, IconButton } from "@mui/material";
import { FieldArray, Form, Formik, useFormikContext, type FormikHelpers, type FormikValues } from "formik";
import { useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Mutations, Queries } from "../../../Api";
import { CommonButton, CommonValidationDatePicker, CommonValidationQuillInput, CommonValidationSelect, CommonValidationSwitch, CommonValidationTextField } from "../../../Attribute";
import { CommonBottomActionBar, CommonBreadcrumbs, CommonCard } from "../../../Components/Common";
import { CommonFormImageBox } from "../../../Components/Common/CommonUploadImage/CommonImageBox";
import { PAGE_TITLE } from "../../../Constants";
import { BREADCRUMBS, PRODUCT_EXPIRY_TYPE, PRODUCT_TYPE_OPTIONS } from "../../../Data";
import { useAppDispatch, useAppSelector } from "../../../Store/hooks";
import { setSelectedFiles, setUploadModal } from "../../../Store/Slices/ModalSlice";
import type { ImageSyncProps, ProductFormValues } from "../../../Types";
import { DateConfig, GenerateOptions, GetChangedFields, RemoveEmptyFields } from "../../../Utils";
import { ProductFormSchema } from "../../../Utils/ValidationSchemas";

const ProductForm = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const [activeImageKey, setActiveImageKey] = useState<"images" | null>(null);

  const { data } = location.state || {};
  const { data: CategoryData, isLoading: CategoryDataLoading } = Queries.useGetCategory({ activeFilter: true });
  const { data: BrandsData , isLoading: BrandsDataLoading} = Queries.useGetBrand({ activeFilter: true });
  const { data: TaxData, isLoading: TaxDataLoading } = Queries.useGetTax({ activeFilter: true });

  const { mutate: addProduct, isPending: isAddLoading } = Mutations.useAddProduct();
  const { mutate: editProduct, isPending: isEditLoading } = Mutations.useEditProduct();

  const isEditing = Boolean(data?._id);
  const pageMode = isEditing ? "EDIT" : "ADD";

  const initialValues = useMemo<ProductFormValues>(
    () => ({
      productType: data?.productType || "",
      name: data?.name || "",
      printName: data?.printName || "",
      hsnCode: data?.hsnCode || "",
      categoryId: data?.categoryId || "",
      subCategoryId: data?.subCategoryId || "",
      purchaseTaxId: data?.purchaseTaxId || "",
      isPurchaseTaxIncluding: data?.isPurchaseTaxIncluding || false,
      brandId: data?.brandId || "",
      subBrandId: data?.subBrandId || "",
      salesTaxId: data?.salesTaxId || "",
      isSalesTaxIncluding: data?.isSalesTaxIncluding || false,
      cessPercentage: data?.cessPercentage || null,
      // uomId: data?.uomId || "",
      manageMultipleBatch: data?.manageMultipleBatch || true,
      hasExpiry: data?.hasExpiry || true,
      expiryDays: data?.expiryDays || null,
      calculateExpiryOn: data?.calculateExpiryOn || "",
      expiryReferenceDate: data?.expiryReferenceDate || DateConfig.utc().toISOString(),
      isExpiryProductSaleable: data?.isExpiryProductSaleable || true,
      ingredients: data?.ingredients || "",
      shortDescription: data?.shortDescription || "",
      description: data?.description || "",
      nutrition: [{ name: "", value: "" }],
      netWeight: data?.netWeight || null,
      masterQty: data?.masterQty || null,
      purchasePrice: data?.purchasePrice || null,
      landingCost: data?.landingCost || null,
      mrp: data?.mrp || null,
      sellingDiscount: data?.sellingDiscount || null,
      sellingPrice: data?.sellingPrice || null,
      sellingMargin: data?.sellingMargin || null,
      retailerDiscount: data?.retailerDiscount || null,
      retailerPrice: data?.retailerPrice || null,
      retailerMargin: data?.retailerMargin || null,
      wholesalerDiscount: data?.wholesalerDiscount || null,
      wholesalerMargin: data?.wholesalerMargin || null,
      wholesalerPrice: data?.wholesalerPrice || null,
      minimumQty: data?.minimumQty || null,
      openingQty: data?.openingQty || null,
      images: data?.images || [],
      isActive: data?.isActive || true,
    }),
    [data]
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

  const handleUpload = () => {
    setActiveImageKey("images");
    dispatch(setUploadModal({ open: true, type: "image", multiple: true }));
  };

  const handleSubmit = async (values: ProductFormValues, { resetForm }: FormikHelpers<ProductFormValues>) => {
    const { _submitAction, ...rest } = values;

    const handleSuccess = () => {
      if (_submitAction === "saveAndNew") resetForm();
      else navigate(-1);
    };
    if (isEditing) {
      const changedFields = GetChangedFields(rest, data);
      await editProduct({ ...changedFields, productId: data._id }, { onSuccess: handleSuccess });
    } else {
      await addProduct(RemoveEmptyFields(rest), { onSuccess: handleSuccess });
    }
  };
  return (
    <>
      <CommonBreadcrumbs title={PAGE_TITLE.INVENTORY.PRODUCT[pageMode]} maxItems={1} breadcrumbs={BREADCRUMBS.PRODUCT[pageMode]} />

      <Box sx={{ p: { xs: 2, md: 3 }, mb: 8 }}>
        <Formik<ProductFormValues> enableReinitialize initialValues={initialValues} validationSchema={ProductFormSchema} onSubmit={handleSubmit}>
          {({ values, setFieldValue, resetForm, dirty }) => (
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
                    <CommonValidationSelect name="categoryId" label="Category" isLoading={CategoryDataLoading} options={GenerateOptions(CategoryData?.data?.category_data)} grid={{ xs: 12, sm: 6, xl: 3 }} required />
                    <CommonValidationSelect name="subCategoryId" label="Sub Category" isLoading={CategoryDataLoading} options={GenerateOptions(CategoryData?.data?.category_data)} grid={{ xs: 12, sm: 6, xl: 3 }} />
                    <CommonValidationSelect name="purchaseTaxId" label="Purchase Tax" isLoading={TaxDataLoading} syncFieldName="salesTaxId" options={GenerateOptions(TaxData?.data?.tax_data)} grid={{ xs: 12, sm: 6, xl: 3 }} required />
                    <CommonValidationSwitch name="isPurchaseTaxIncluding" label="Purchase Tax Including" grid={{ xs: 12, sm: 6, xl: 3 }} />
                    <CommonValidationSelect name="brandId" label="Brand" isLoading={BrandsDataLoading} options={GenerateOptions(BrandsData?.data?.brand_data)} grid={{ xs: 12, sm: 6, xl: 3 }} required />
                    <CommonValidationSelect name="subBrandId" label="Sub Brand" isLoading={BrandsDataLoading} options={GenerateOptions(BrandsData?.data?.brand_data)} grid={{ xs: 12, sm: 6, xl: 3 }} />
                    <CommonValidationSelect name="salesTaxId" label="Sales Tax" isLoading={TaxDataLoading} options={GenerateOptions(TaxData?.data?.tax_data)} grid={{ xs: 12, sm: 6, xl: 3 }} required />
                    <CommonValidationSwitch name="isSalesTaxIncluding" label="Sales Tax Including" grid={{ xs: 12, sm: 6, xl: 3 }} />
                    <CommonValidationTextField name="cessPercentage" label="cess Percentage" type="number" grid={{ xs: 12, sm: 6, xl: 3 }} />

                    {/* <CommonValidationSelect name="uomId" label="Select UOM" options={TAX_OPTIONS} grid={{ xs: 12, sm: 6, xl: 3 }} required /> */}
                    <CommonValidationTextField name="ingredients" label="ingredients" grid={{ xs: 12, sm: 6, xl: 3 }} />
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
                    <CommonValidationTextField name="shortDescription" label="short Description" multiline grid={{ xs: 12 }} />
                    <CommonValidationQuillInput name="description" label="Description" grid={{ xs: 12 }} />
                    <CommonFormImageBox name="images" label="Product Images" type="image" grid={{ xs: 12 }} required multiple onUpload={handleUpload} />
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
                  </Grid>
                </CommonCard>

                <CommonCard title="Pricing Details" grid={{ xs: 12 }}>
                  <Grid container spacing={2} sx={{ p: 2 }}>
                    <CommonValidationTextField name="purchasePrice" label="Purchase Price" type="number" required grid={{ xs: 12, sm: 6, xl: 3 }} />
                    <CommonValidationTextField name="landingCost" label="Landing Cost" type="number" required grid={{ xs: 12, sm: 6, xl: 3 }} />
                    <CommonValidationTextField name="mrp" label="MRP" type="number" required grid={{ xs: 12, sm: 6, xl: 3 }} />
                    <CommonValidationTextField name="sellingDiscount" label="selling Discount" type="number" required grid={{ xs: 12, sm: 6, xl: 3 }} isCurrency currencyDisabled />
                    <CommonValidationTextField name="sellingPrice" label="Selling Price" type="number" required grid={{ xs: 12, sm: 6, xl: 3 }} />
                    <CommonValidationTextField name="sellingMargin" label="selling Margin" type="number" required grid={{ xs: 12, sm: 6, xl: 3 }} isCurrency currencyDisabled />
                    <CommonValidationTextField name="retailerDiscount" label="retailer Discount" type="number" required grid={{ xs: 12, sm: 6, xl: 3 }} isCurrency currencyDisabled />
                    <CommonValidationTextField name="retailerPrice" label="retailer Price" type="number" required grid={{ xs: 12, sm: 6, xl: 3 }} />
                    <CommonValidationTextField name="retailerMargin" label="retailer Margin" type="number" required grid={{ xs: 12, sm: 6, xl: 3 }} isCurrency currencyDisabled />
                    <CommonValidationTextField name="wholesalerDiscount" label="wholesaler Discount" type="number" required grid={{ xs: 12, sm: 6, xl: 3 }} isCurrency currencyDisabled />
                    <CommonValidationTextField name="wholesalerPrice" label="wholesaler Price" type="number" required grid={{ xs: 12, sm: 6, xl: 3 }} />
                    <CommonValidationTextField name="wholesalerMargin" label="wholesaler Margin" type="number" required grid={{ xs: 12, sm: 6, xl: 3 }} isCurrency currencyDisabled />
                    <CommonValidationTextField name="minimumQty" label="minimum Qty" type="number" required grid={{ xs: 12, sm: 6, xl: 3 }} />
                    <CommonValidationTextField name="openingQty" label="opening Qty" type="number" grid={{ xs: 12, sm: 6, xl: 3 }} />
                    {!isEditing && <CommonValidationSwitch name="isActive" label="Is Active" grid={{ xs: 12 }} />}
                  </Grid>
                </CommonCard>
                {/* ---------- ACTION BAR ---------- */}
                <CommonBottomActionBar save={isEditing} clear={!isEditing} disabled={!dirty} isLoading={isAddLoading || isEditLoading} onClear={() => resetForm({ values: initialValues })} onSave={() => setFieldValue("_submitAction", "save")} onSaveAndNew={() => setFieldValue("_submitAction", "saveAndNew")} />
              </Grid>
            </Form>
          )}
        </Formik>
      </Box>
    </>
  );
};

export default ProductForm;
