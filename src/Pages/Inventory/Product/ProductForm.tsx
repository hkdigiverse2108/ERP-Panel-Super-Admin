import { Box, Grid, IconButton } from "@mui/material";
import { FieldArray, Form, Formik, type FormikHelpers } from "formik";
import { useLocation, useNavigate } from "react-router-dom";
import { Mutations } from "../../../Api";
import { CommonSelect, CommonValidationSelect, CommonValidationSwitch, CommonValidationTextField } from "../../../Attribute";
import { CommonBottomActionBar, CommonBreadcrumbs, CommonCard } from "../../../Components/Common";
import { PAGE_TITLE } from "../../../Constants";
import { BRAND_OPTIONS, BREADCRUMBS, CATEGORY_OPTIONS, DEPARTMENT_OPTIONS, PRODUCT_TYPE_OPTIONS, SUB_BRAND_OPTIONS, SUB_CATEGORY_OPTIONS, TAX_OPTIONS } from "../../../Data";
import { useAppSelector } from "../../../Store/hooks";
import { GetChangedFields, RemoveEmptyFields } from "../../../Utils";
import { ProductFormSchema } from "../../../Utils/ValidationSchemas";
// import { IconButton} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import { CommonButton } from "../../../Attribute";
import type { ProductFormValues } from "../../../Types";

const ProductForm = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const { data } = location.state || {};
  const { company } = useAppSelector((state) => state.company);

  const { mutate: addProduct, isPending: isAddLoading } = Mutations.useAddProduct();
  const { mutate: editProduct, isPending: isEditLoading } = Mutations.useEditProduct();

  const isEditing = Boolean(data?._id);
  const pageMode = isEditing ? "EDIT" : "ADD";

  const initialValues: ProductFormValues = {
    variants: [
      {
        name: "",
        nutrition: [
          {
            label: "",
            value: "",
          },
        ],
      },
    ],

    companyId: data?.companyId || "",

    itemCode: data?.itemCode || "",
    name: data?.name || "",
    printName: data?.printName || "",
    slug: data?.slug || "",

    productType: data?.productType || "",
    categoryId: data?.categoryId || "",
    subCategoryId: data?.subCategoryId || "",
    brandId: data?.brandId || "",
    subBrandId: data?.subBrandId || "",
    departmentId: data?.departmentId || "",
    uomId: data?.uomId || "",

    purchaseTaxId: data?.purchaseTaxId || "",
    salesTaxId: data?.salesTaxId || "",

    mrp: data?.mrp || 0,
    sellingPrice: data?.sellingPrice || 0,
    purchasePrice: data?.purchasePrice || 0,
    landingCost: data?.landingCost || 0,

    hsnCode: data?.hsnCode || "",
    expiryDays: data?.expiryDays || "",
    expiryType: data?.expiryType || "",

    shortDescription: data?.shortDescription || "",
    description: data?.description || "",

    netWeight: data?.netWeight || "",
    nutritionInfo: data?.nutritionInfo || "",
    ingredients: data?.ingredients || "",
    image: data?.image || "",

    isPurchaseTaxInclusive: data?.isPurchaseTaxInclusive || false,
    isSalesTaxInclusive: data?.isSalesTaxInclusive || false,
    cessPercentage: data?.cessPercentage || 0,

    manageBatch: data?.manageBatch || false,
    hasExpiry: data?.hasExpiry || false,

    status: data?.status || "active",
  };

  const handleSubmit = async (values: ProductFormValues, { resetForm }: FormikHelpers<ProductFormValues>) => {
    const { _submitAction, ...rest } = values;

    const payload = {
      ...rest,
      variants: values.variants.filter((v:any) => v.name.trim() !== ""),
      companyId: company?._id,
    };
    const handleSuccess = () => {
      if (_submitAction === "saveAndNew") resetForm();
      else navigate(-1);
    };

    if (isEditing) {
      const changedFields = GetChangedFields(payload, data);
      await editProduct({ ...changedFields, variants: payload.variants, productId: data._id }, { onSuccess: handleSuccess });
    } else {
      await addProduct({ ...RemoveEmptyFields(payload) }, { onSuccess: handleSuccess });
    }
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
                    <CommonValidationTextField name="itemCode" label="Item Code" required grid={{ xs: 12, md: 3 }} />
                    <CommonValidationSelect name="productType" label="Product Type" options={PRODUCT_TYPE_OPTIONS} grid={{ xs: 12, md: 3 }} />
                    <CommonValidationTextField name="name" label="Product Name" required grid={{ xs: 12, md: 3 }} />
                    <CommonValidationTextField name="printName" label="Print Name" grid={{ xs: 12, md: 3 }} />
                    <CommonValidationSelect name="category" label="Category" options={CATEGORY_OPTIONS} grid={{ xs: 12, md: 3 }} />
                    <CommonValidationSelect name="subCategory" label="Sub Category" options={SUB_CATEGORY_OPTIONS} grid={{ xs: 12, md: 3 }} />
                    <CommonValidationSelect name="brand" label="Brand" options={BRAND_OPTIONS}  grid={{ xs: 12, md: 3 }} />
                    <CommonValidationSelect name="subBrandId" label="Sub Brand" options={SUB_BRAND_OPTIONS}  grid={{ xs: 12, md: 3 }} />
                    <CommonValidationTextField name="hsnCode" label="HSN Code" grid={{ xs: 12, md: 3 }} />

                    <CommonValidationSelect name="departmentId" label="Department" options={DEPARTMENT_OPTIONS} grid={{ xs: 12, md: 3 }} />
                    <CommonValidationTextField name="tags" label="Tags" grid={{ xs: 12, md: 6 }} />
                    <CommonValidationTextField name="net weight" label="Net Weight" grid={{ xs: 12, md: 6 }} />
                    <CommonValidationTextField name="description" label="Description" multiline rows={4} grid={{ xs: 12 }} />
                    <CommonValidationTextField name="shortNote" label="Short Note" multiline rows={4} grid={{ xs: 12 }} />
                    <CommonCard title="Nutrition" grid={{ xs: 12 }}>
                      <Grid spacing={2} sx={{ p: 2 }}>
                        <FieldArray name="variants">
                          {({ push, remove }) => (
                            <>
                              {values.variants.map((variant: { nutrition: any[] }, vIndex: number) => (
                                <Grid spacing={2} key={vIndex}>
                                  <Box p={2} border="1px solid #ccc " borderRadius={1} mb={2}>
                                    <FieldArray name={`variants.${vIndex}.nutrition`}>
                                      {() => (
                                        <>
                                          {variant.nutrition.map((_, nIndex) => (
                                            <Grid key={nIndex}>
                                              {/* Nutrition Name */}
                                              <Grid container spacing={2} sx={{ xs: 12, md: 5 }}>
                                                <CommonValidationTextField name={`variants.${vIndex}.nutrition.${nIndex}.label`} label="Nutrition Name" grid={{ xs: 12, md: 6 }} />
                                                <CommonValidationTextField name={`variants.${vIndex}.nutrition.${nIndex}.value`} label="Nutrition Value" grid={{ xs: 12, md: 5.5 }} />
                                                {values.variants.length > 1 && (
                                                  <IconButton color="error" size="small" onClick={() => remove(vIndex)}>
                                                    <DeleteIcon />
                                                  </IconButton>
                                                )}
                                              </Grid>
                                            </Grid>
                                          ))}
                                        </>
                                      )}
                                    </FieldArray>
                                  </Box>
                                </Grid>
                              ))}

                              {/* ADD  BUTTON  */}
                              <Grid className="flex flex-start!">
                                <CommonButton
                                  variant="contained"
                                  onClick={() =>
                                    push({
                                      name: "",
                                      nutrition: [{ label: "", value: "" }],
                                    })
                                  }
                                >
                                  + Add Nutrition
                                </CommonButton>
                              </Grid>
                            </>
                          )}
                        </FieldArray>
                      </Grid>
                    </CommonCard>
                  </Grid>
                </CommonCard>

                {/* ---------- PRICING & TAX ---------- */}
                <CommonCard title="Pricing & Tax" grid={{ xs: 12 }}>
                  <Grid container spacing={2} sx={{ p: 2 }}>
                    <CommonValidationTextField name="mrp" label="MRP" type="number" required grid={{ xs: 12, md: 6 }} />
                    <CommonValidationTextField name="sellingPrice" label="Selling Price" type="number" required grid={{ xs: 12, md: 6 }} />
                    <CommonValidationTextField name="Purchase Price" label="Purchase Price" type="number" required grid={{ xs: 12, md: 6 }} />
                    <CommonValidationTextField name="landingCost" label="Landing Cost" type="number" required grid={{ xs: 12, md: 6 }} />
                    {/* <CommonValidationTextField name="purchaseTaxId" label="Purchase Tax" type="number" required grid={{ xs: 12, md: 6 }} /> */}
                    <CommonSelect label="Purchase Tax" options={TAX_OPTIONS} value={values.purchaseTaxId ? [values.purchaseTaxId] : []} onChange={(v) => setFieldValue("purchaseTaxId", v[0] || "")} grid={{ xs: 12, md: 6 }} />
                    <CommonSelect label="Sales Tax" options={TAX_OPTIONS} value={values.salesTaxId ? [values.salesTaxId] : []} onChange={(v) => setFieldValue("salesTaxId", v[0] || "")} grid={{ xs: 12, md: 6 }} />
                  </Grid>
                </CommonCard>
                {!isEditing && <CommonValidationSwitch name="isActive" label="Is Active" grid={{ xs: 12 }} />}
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
