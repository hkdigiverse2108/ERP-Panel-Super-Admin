import { Box, Grid, IconButton } from "@mui/material";
import { FieldArray, Form, Formik } from "formik";
import { useLocation } from "react-router-dom";
import { CommonButton, CommonValidationDatePicker, CommonValidationQuillInput, CommonValidationSelect, CommonValidationSwitch, CommonValidationTextField } from "../../../Attribute";
import { CommonBottomActionBar, CommonBreadcrumbs, CommonCard } from "../../../Components/Common";
import { PAGE_TITLE } from "../../../Constants";
import { BREADCRUMBS, PRODUCT_EXPIRY_TYPE, PRODUCT_TYPE_OPTIONS, TAX_OPTIONS } from "../../../Data";
import { ProductFormSchema } from "../../../Utils/ValidationSchemas";
// import { IconButton} from "@mui/material";
import ClearIcon from "@mui/icons-material/Clear";
import { Queries } from "../../../Api";
import type { ProductFormValues } from "../../../Types";
import { GenerateOptions } from "../../../Utils";

const ProductForm = () => {
  const location = useLocation();
  // const navigate = useNavigate();

  const { data } = location.state || {};
  const { data: CategoryData } = Queries.useGetCategory({ activeFilter: true });
  const { data: BrandsData } = Queries.useGetBrand({ activeFilter: true });

  // const { mutate: addProduct, isPending: isAddLoading } = Mutations.useAddProduct();
  // const { mutate: editProduct, isPending: isEditLoading } = Mutations.useEditProduct();

  const isEditing = Boolean(data?._id);
  const pageMode = isEditing ? "EDIT" : "ADD";

  const initialValues: ProductFormValues = {
    nutrition: [
      {
        name: "",
        value: "",
      },
    ],

    // companyId: data?.companyId || "",

    name: data?.name || "",
    printName: data?.printName || "",
    // slug: data?.slug || "",

    productType: data?.productType || "",
    categoryId: data?.categoryId || "",
    subCategoryId: data?.subCategoryId || "",
    brandId: data?.brandId || "",
    subBrandId: data?.subBrandId || "",
    // departmentId: data?.departmentId || "",
    uomId: data?.uomId || "",

    purchaseTaxId: data?.purchaseTaxId || "",
    salesTaxId: data?.salesTaxId || "",

    mrp: data?.mrp || 0,
    sellingPrice: data?.sellingPrice || 0,
    purchasePrice: data?.purchasePrice || 0,
    landingCost: data?.landingCost || 0,

    hsnCode: data?.hsnCode || "",
    expiryDays: data?.expiryDays || "",
    // expiryType: data?.expiryType || "",

    shortDescription: data?.shortDescription || "",
    description: data?.description || "",

    netWeight: data?.netWeight || "",
    // nutritionInfo: data?.nutritionInfo || "",
    ingredients: data?.ingredients || "",
    // image: data?.image || "",

    // isPurchaseTaxInclusive: data?.isPurchaseTaxInclusive || false,
    // isSalesTaxInclusive: data?.isSalesTaxInclusive || false,
    cessPercentage: data?.cessPercentage || 0,

    // manageBatch: data?.manageBatch || false,
    hasExpiry: data?.hasExpiry || false,

    // status: data?.status || "active",
  };

  const handleSubmit = () => {
    // const { _submitAction, ...rest } = values;
    // const payload = {
    //   ...rest,
    //   // variants: values.variants.filter((v:any) => v.name.trim() !== ""),
    //   // companyId: company?._id,
    // };
    // const handleSuccess = () => {
    //   if (_submitAction === "saveAndNew") resetForm();
    //   else navigate(-1);
    // };
    // if (isEditing) {
    //   const changedFields = GetChangedFields(payload, data);
    //   await editProduct({ ...changedFields, variants: payload.variants, productId: data._id }, { onSuccess: handleSuccess });
    // } else {
    //   await addProduct({ ...RemoveEmptyFields(payload) }, { onSuccess: handleSuccess });
    // }
  };
  return (
    <>
      <CommonBreadcrumbs title={PAGE_TITLE.INVENTORY.PRODUCT[pageMode]} maxItems={1} breadcrumbs={BREADCRUMBS.PRODUCT[pageMode]} />

      <Box sx={{ p: { xs: 2, md: 3 }, mb: 8 }}>
        <Formik<ProductFormValues> enableReinitialize initialValues={initialValues} validationSchema={ProductFormSchema} onSubmit={handleSubmit}>
          {({ values, setFieldValue, resetForm, dirty }) => (
            <Form noValidate>
              <Grid container spacing={2}>
                {/* ---------- GENERAL DETAILS ---------- */}
                <CommonCard title="General Details" grid={{ xs: 12 }}>
                  <Grid container spacing={2} sx={{ p: 2 }}>
                    <CommonValidationSelect name="productType" label="Product Type" options={PRODUCT_TYPE_OPTIONS} grid={{ xs: 12, md: 3 }} required />
                    <CommonValidationTextField name="name" label="Product Name" grid={{ xs: 12, md: 3 }} required />
                    <CommonValidationTextField name="printName" label="Print Name" grid={{ xs: 12, md: 3 }} required />
                    <CommonValidationTextField name="hsnCode" label="HSN Code" grid={{ xs: 12, md: 3 }} />
                    <CommonValidationSelect name="category" label="Category" options={GenerateOptions(CategoryData?.data?.category_data)} grid={{ xs: 12, md: 3 }} required />
                    <CommonValidationSelect name="subCategory" label="Sub Category" options={GenerateOptions(CategoryData?.data?.category_data)} grid={{ xs: 12, md: 3 }} />
                    <CommonValidationSelect name="purchaseTaxId" label="Purchase Tax" options={TAX_OPTIONS} grid={{ xs: 12, md: 3 }} required />
                    <CommonValidationSwitch name="isPurchaseTaxIncluding" label="Purchase Tax Including" grid={{ xs: 12, md: 3 }} />
                    <CommonValidationSelect name="brand" label="Brand" options={GenerateOptions(BrandsData?.data?.brand_data)} grid={{ xs: 12, md: 3 }} required />
                    <CommonValidationSelect name="subBrandId" label="Sub Brand" options={GenerateOptions(BrandsData?.data?.brand_data)} grid={{ xs: 12, md: 3 }} />

                    <CommonValidationSelect name="salesTaxId" label="Sales Tax" options={TAX_OPTIONS} grid={{ xs: 12, md: 3 }} required />
                    <CommonValidationSwitch name="isSalesTaxIncluding" label="Sales Tax Including" grid={{ xs: 12, md: 3 }} />
                    <CommonValidationTextField name="cessPercentage" label="cess Percentage" grid={{ xs: 12, md: 3 }} />

                    <CommonValidationSelect name="uomId" label="Select UOM" options={TAX_OPTIONS} grid={{ xs: 12, md: 3 }} required />

                    <CommonValidationSwitch name="manageMultipleBatch" label="Manage Multiple Batch" grid={{ xs: 12, md: 3 }} />
                    {values.manageMultipleBatch && <CommonValidationSwitch name="hasExpiry" label="hasExpiry" grid={{ xs: 12, md: 3 }} />}
                    {values.manageMultipleBatch && values.hasExpiry && (
                      <>
                        <CommonValidationTextField name="expiryDays" label="expiryDays" grid={{ xs: 12, md: 3 }} required />
                        <CommonValidationSelect name="calculateExpiryOn" label="calculateExpiryOn" options={PRODUCT_EXPIRY_TYPE} grid={{ xs: 12, md: 3 }} required />
                        <CommonValidationDatePicker name="expiryReferenceDate" label="expiry Reference Date" grid={{ xs: 12, md: 3 }} required />
                        <CommonValidationSwitch name="isExpiryProductSaleable" label="isExpiryProductSaleable" grid={{ xs: 12, md: 3 }} />
                      </>
                    )}
                    <CommonValidationTextField name="ingredients" label="ingredients" grid={{ xs: 12 }} />
                    <CommonValidationTextField name="shortDescription" label="short Description" multiline grid={{ xs: 12 }} />
                    <CommonValidationQuillInput name="description" label="Description" grid={{ xs: 12 }} />
                    <Grid size={12}>
                      <FieldArray name="nutrition">
                        {({ push, remove }) => (
                          <>
                            <Box p={2} className="border border-gray-300 dark:border-gray-600 rounded-sm">
                              {values?.nutrition?.map((_, vIndex) => (
                                <Grid container spacing={2} sx={{ xs: 12 }} py={1}>
                                  <CommonValidationTextField name={`nutrition.${vIndex}.name`} label="Nutrition Name" grid={{ xs: 12, md: 6 }} />
                                  <CommonValidationTextField name={`nutrition.${vIndex}.value`} label="Nutrition Value" grid={{ xs: 12, md: 5.5 }} />
                                  {(values?.nutrition?.length || 0) > 1 && (
                                    <IconButton color="error" size="small" onClick={() => remove(vIndex)}>
                                      <ClearIcon />
                                    </IconButton>
                                  )}
                                  {vIndex === (values.nutrition?.length || 1) - 1 && (
                                    <CommonButton variant="outlined" onClick={() => push({ name: "", value: "" })}>
                                      + Add Nutrition
                                    </CommonButton>
                                  )}
                                </Grid>
                              ))}
                            </Box>
                          </>
                        )}
                      </FieldArray>
                    </Grid>
                    <CommonValidationTextField name="netWeight" label="Net Weight" grid={{ xs: 12, md: 6 }} />
                    <CommonValidationTextField name="masterQty" label="masterQty" type="number" required grid={{ xs: 12, md: 6 }} />
                  </Grid>
                </CommonCard>

                <CommonCard title="Pricing Details" grid={{ xs: 12 }}>
                  <Grid container spacing={2} sx={{ p: 2 }}>
                    <CommonValidationTextField name="purchasePrice" label="Purchase Price" type="number" required grid={{ xs: 12, md: 3 }} />
                    <CommonValidationTextField name="landingCost" label="Landing Cost" type="number" required grid={{ xs: 12, md: 3 }} />
                    <CommonValidationTextField name="mrp" label="MRP" type="number" required grid={{ xs: 12, md: 3 }} />
                    <CommonValidationTextField name="sellingDiscount" label="selling Discount" type="number" required grid={{ xs: 12, md: 3 }} isCurrency currencyDisabled />
                    <CommonValidationTextField name="sellingPrice" label="Selling Price" type="number" required grid={{ xs: 12, md: 3 }} />
                    <CommonValidationTextField name="sellingMargin" label="selling Margin" type="number" required grid={{ xs: 12, md: 3 }} isCurrency currencyDisabled />
                    <CommonValidationTextField name="retailerDiscount" label="retailer Discount" type="number" required grid={{ xs: 12, md: 3 }} isCurrency currencyDisabled />
                    <CommonValidationTextField name="retailerPrice" label="retailer Price" type="number" required grid={{ xs: 12, md: 3 }} />
                    <CommonValidationTextField name="retailerMargin" label="retailer Margin" type="number" required grid={{ xs: 12, md: 3 }} isCurrency currencyDisabled />
                    <CommonValidationTextField name="wholesalerDiscount" label="wholesaler Discount" type="number" required grid={{ xs: 12, md: 3 }} isCurrency currencyDisabled />
                    <CommonValidationTextField name="wholesalerPrice" label="wholesaler Price" type="number" required grid={{ xs: 12, md: 3 }} />
                    <CommonValidationTextField name="wholesalerMargin" label="wholesaler Margin" type="number" required grid={{ xs: 12, md: 3 }} isCurrency currencyDisabled />
                    <CommonValidationTextField name="minimumQty" label="minimum Qty" type="number" required grid={{ xs: 12, md: 3 }} />
                    <CommonValidationTextField name="openingQty" label="opening Qty" type="number" grid={{ xs: 12, md: 3 }} />
                    {!isEditing && <CommonValidationSwitch name="isActive" label="Is Active" grid={{ xs: 12 }} />}
                  </Grid>
                </CommonCard>
                {/* ---------- ACTION BAR ---------- */}
                <CommonBottomActionBar save={isEditing} clear={!isEditing} disabled={!dirty} isLoading={false} onClear={() => resetForm({ values: initialValues })} onSave={() => setFieldValue("_submitAction", "save")} onSaveAndNew={() => setFieldValue("_submitAction", "saveAndNew")} />
              </Grid>
            </Form>
          )}
        </Formik>
      </Box>
    </>
  );
};

export default ProductForm;
