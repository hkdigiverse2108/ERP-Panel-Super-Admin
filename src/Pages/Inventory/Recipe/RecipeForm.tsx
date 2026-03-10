import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";
import { Box, Grid, Stack } from "@mui/material";
import { FieldArray, Form, Formik, type FormikHelpers } from "formik";
import { useLocation, useNavigate } from "react-router-dom";
import { Mutations, Queries } from "../../../Api";
import { CommonButton, CommonValidationDatePicker, CommonValidationSelect, CommonValidationSwitch, CommonValidationTextField } from "../../../Attribute";
import { CommonBottomActionBar, CommonBreadcrumbs, CommonCard, DependentSelect } from "../../../Components/Common";
import { PAGE_TITLE } from "../../../Constants";
import { BREADCRUMBS, RECIPE_TYPE_OPTIONS } from "../../../Data";
import type { RawRecipeProduct, RecipeFormValues } from "../../../Types";
import { DateConfig, GenerateOptions, GetChangedFields, RecipeFormSchema, RemoveEmptyFields } from "../../../Utils";

const RecipeForm = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { data } = location.state || {};

  const isEditing = Boolean(data?._id);
  const pageMode = isEditing ? "EDIT" : "ADD";

  const { mutate: addRecipe, isPending: isAddLoading } = Mutations.useAddRecipe();
  const { mutate: editRecipe, isPending: isEditLoading } = Mutations.useEditRecipe();
  const { data: CompanyData, isLoading: CompanyDataLoading } = Queries.useGetCompanyDropdown();

  // ✅ INITIAL VALUES
  const initialValues: RecipeFormValues = {
    companyId: data?.companyId?._id || "",
    name: data?.name || "",
    number: data?.number || "",
    date: data?.date || DateConfig.utc().toISOString(),
    type: data?.type || "",
    isActive: data?.isActive ?? true,
    rawProducts: data?.rawProducts?.length
      ? data.rawProducts.map((item: RawRecipeProduct) => ({
          productId: typeof item.productId === "string" ? item.productId : item.productId?._id || "",
          mrp: item.mrp ?? "",
          useQty: item.useQty ?? "",
        }))
      : [{ productId: "", mrp: "", useQty: "" }],
    finalProducts: {
      productId: data?.finalProducts?.productId?._id || "",
      mrp: data?.finalProducts?.mrp ?? "",
      qtyGenerate: data?.finalProducts?.qtyGenerate ?? "",
    },
  };
  const handleSubmit = async (values: RecipeFormValues, { resetForm }: FormikHelpers<RecipeFormValues>) => {
    const { _submitAction, ...rest } = values;

    const handleSuccess = () => {
      if (_submitAction === "saveAndNew") resetForm();
      else navigate(-1);
    };
    if (isEditing) {
      const changedFields = GetChangedFields(rest, data);
      await editRecipe({ ...changedFields, recipeId: data._id }, { onSuccess: handleSuccess });
    } else {
      await addRecipe(RemoveEmptyFields(rest), { onSuccess: handleSuccess });
    }
  };

  return (
    <>
      <CommonBreadcrumbs title={PAGE_TITLE.INVENTORY.RECIPE[pageMode]} maxItems={3} breadcrumbs={BREADCRUMBS.RECIPE[pageMode]} />

      <Box sx={{ p: { xs: 2, md: 3 }, mb: 8 }}>
        <Formik<RecipeFormValues> initialValues={initialValues} validationSchema={RecipeFormSchema} onSubmit={handleSubmit}>
          {({ values, setFieldValue, resetForm, dirty }) => (
            <Form noValidate>
              <Grid container spacing={2}>
                {/* BASIC DETAILS */}
                <CommonCard title="Recipe Details">
                  <Box p={2} display="flex" flexWrap="wrap" gap={2}>
                    <CommonValidationSelect name="companyId" label="Company" options={GenerateOptions(CompanyData?.data)} isLoading={CompanyDataLoading} grid={{ xs: 12, md: 4 }} required />
                    <CommonValidationTextField name="name" label="Recipe Name" required grid={{ xs: 12, md: 4 }} />
                    <CommonValidationTextField name="number" label="Recipe No" required grid={{ xs: 12, md: 4 }} />
                    <CommonValidationDatePicker name="date" label="Recipe Date" grid={{ xs: 12, md: 4 }} />
                    <CommonValidationSelect name="type" label="Recipe Type" options={RECIPE_TYPE_OPTIONS} required grid={{ xs: 12, md: 4 }} />
                  </Box>
                </CommonCard>

                {/* RAW PRODUCTS */}
                <CommonCard title="Raw Products">
                  <FieldArray name="rawProducts">
                    {({ push, remove }) => (
                      <Box p={2}>
                        {values.rawProducts?.map((_, index) => {
                          const rawProducts = values.rawProducts || [];
                          return (
                            <Box key={index} display="flex" flexWrap="wrap" gap={2} sx={{ mb: 2 }}>
                              <DependentSelect name={`rawProducts.${index}.productId`} label="Product" query={Queries.useGetProductDropdown} params={{ companyFilter: values.companyId }} enabled={Boolean(values.companyId)} disabled={!values.companyId} required grid={{ xs: 12, md: 4 }} />
                              <CommonValidationTextField name={`rawProducts.${index}.useQty`} label="Use Qty" type="number" required grid={{ xs: 12, md: 3 }} />
                              <CommonValidationTextField name={`rawProducts.${index}.mrp`} label="MRP" type="number" grid={{ xs: 12, md: 3 }} />
                              <Grid size={{ xs: 12, md: 2 }}>
                                <Stack direction="row" spacing={1}>
                                  {rawProducts.length > 1 && (
                                    <CommonButton size="small" variant="outlined" color="error" onClick={() => remove(index)}>
                                      <DeleteIcon />
                                    </CommonButton>
                                  )}
                                  {index === rawProducts.length - 1 && (
                                    <CommonButton size="small" variant="outlined" onClick={() => push({ productId: "", mrp: "", useQty: "" })}>
                                      <AddIcon />
                                    </CommonButton>
                                  )}
                                </Stack>
                              </Grid>
                            </Box>
                          );
                        })}
                      </Box>
                    )}
                  </FieldArray>
                </CommonCard>

                {/* FINAL PRODUCTS */}
                <CommonCard title="Final Products">
                  <Box p={2} display="flex" flexWrap="wrap" gap={2}>
                    <DependentSelect name="finalProducts.productId" label="Product" query={Queries.useGetProductDropdown} params={{ companyFilter: values.companyId ,}} enabled={Boolean(values.companyId)} disabled={!values.companyId} required grid={{ xs: 12, md: 4 }} />
                    <CommonValidationTextField name="finalProducts.qtyGenerate" label="Qty Generate" type="number" required grid={{ xs: 12, md: 4 }} />
                    <CommonValidationTextField name="finalProducts.mrp" label="MRP" type="number" grid={{ xs: 12, md: 4 }} />
                  </Box>
                </CommonCard>

                {!isEditing && <CommonValidationSwitch name="isActive" label="Is Active" />}

                <CommonBottomActionBar save={isEditing} clear={!isEditing} disabled={!dirty} isLoading={isAddLoading || isEditLoading} onClear={() => resetForm({ values: initialValues })} onSave={() => setFieldValue("_submitAction", "save")} onSaveAndNew={() => setFieldValue("_submitAction", "saveAndNew")} />
              </Grid>
            </Form>
          )}
        </Formik>
      </Box>
    </>
  );
};

export default RecipeForm;
