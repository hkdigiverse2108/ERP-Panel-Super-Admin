import { Box, Grid } from "@mui/material";
import { Form, Formik, type FormikHelpers } from "formik";
import { useLocation, useNavigate } from "react-router-dom";
import { Mutations, Queries } from "../../../Api";
import { CommonValidationSelect, CommonValidationSwitch, CommonValidationTextField } from "../../../Attribute";
import { CommonBottomActionBar, CommonBreadcrumbs, CommonCard } from "../../../Components/Common";
import { PAGE_TITLE } from "../../../Constants";
import { BREADCRUMBS } from "../../../Data";
import type { StockFormValues } from "../../../Types";
import { GenerateOptions, RemoveEmptyFields } from "../../../Utils";
import { ProductItemFormSchema } from "../../../Utils/ValidationSchemas";
import { usePagePermission } from "../../../Utils/Hooks";
import { useEffect } from "react";

const ItemForm = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const permission = usePagePermission(PAGE_TITLE.INVENTORY.STOCK);

  const { data } = location.state || {};
  const { data: CompanyData, isLoading: CompanyDataLoading } = Queries.useGetCompanyDropdown();
  const { data: ProductData, isLoading: ProductDataLoading } = Queries.useGetProductDropdown();
  const { data: UOMData, isLoading: UOMDataLoading } = Queries.useGetUomDropdown();

  const { mutate: addStock, isPending: isAddLoading } = Mutations.useAddStock();

  const isEditing = Boolean(data?._id);
  const pageMode = isEditing ? "EDIT" : "ADD";

  const initialValues: StockFormValues = {
    productId: data?.productId?._id || "",
    uomId: data?.uomId?._id || "",
    purchasePrice: data?.purchasePrice || null,
    landingCost: data?.landingCost || null,
    mrp: data?.mrp || null,
    sellingDiscount: data?.sellingDiscount || null,
    sellingPrice: data?.sellingPrice || null,
    sellingMargin: data?.sellingMargin || null,
    qty: data?.qty || null,
    isActive: data?.isActive || true,
  };

  const handleSubmit = async (values: StockFormValues, { resetForm }: FormikHelpers<StockFormValues>) => {
    const { _submitAction, ...rest } = values;

    const handleSuccess = () => {
      if (_submitAction === "saveAndNew") resetForm();
      else navigate(-1);
    };
    await addStock(RemoveEmptyFields(rest), { onSuccess: handleSuccess });
  };

  useEffect(() => {
    const hasAccess = isEditing ? permission.edit : permission.add;
    if (!hasAccess) navigate(-1);
  }, [isEditing, permission, navigate]);
  return (
    <>
      <CommonBreadcrumbs title={PAGE_TITLE.INVENTORY.PRODUCT.ITEM[pageMode]} breadcrumbs={BREADCRUMBS.PRODUCT.ITEM[pageMode]} />

      <Box sx={{ p: { xs: 2, md: 3 }, mb: 8 }}>
        <Formik<StockFormValues> enableReinitialize initialValues={initialValues} validationSchema={ProductItemFormSchema} onSubmit={handleSubmit}>
          {({ setFieldValue, resetForm, dirty }) => {
            return (
              <Form noValidate>
                <Grid container spacing={2}>
                  {/* ---------- GENERAL DETAILS ---------- */}
                  <CommonCard hideDivider>
                    <Grid container spacing={2} sx={{ p: 2 }}>
                      <CommonValidationSelect name="companyId" label="Select company" options={GenerateOptions(CompanyData?.data)} isLoading={CompanyDataLoading} grid={{ xs: 12, sm: 6, xl: 4 }} required />
                      <CommonValidationSelect name="productId" label="Select Product" options={GenerateOptions(ProductData?.data)} isLoading={ProductDataLoading} grid={{ xs: 12, sm: 6, xl: 4 }} required />
                      <CommonValidationSelect name="uomId" label="Select UOM" options={GenerateOptions(UOMData?.data)} isLoading={UOMDataLoading} grid={{ xs: 12, sm: 6, xl: 4 }} required />
                      <CommonValidationTextField name="landingCost" label="Landing Cost" type="number" required grid={{ xs: 12, sm: 6, xl: 4 }} />
                      <CommonValidationTextField name="purchasePrice" label="Purchase Price" type="number" required grid={{ xs: 12, sm: 6, xl: 4 }} />
                      <CommonValidationTextField name="mrp" label="MRP" type="number" required grid={{ xs: 12, sm: 6, xl: 4 }} />
                      <CommonValidationTextField name="sellingDiscount" label="selling Discount" type="number" required grid={{ xs: 12, sm: 6, xl: 4 }} isCurrency currencyDisabled />
                      <CommonValidationTextField name="sellingPrice" label="Selling Price" type="number" required grid={{ xs: 12, sm: 6, xl: 4 }} />
                      <CommonValidationTextField name="sellingMargin" label="selling Margin" type="number" required grid={{ xs: 12, sm: 6, xl: 4 }} isCurrency currencyDisabled />
                      <CommonValidationTextField name="qty" label="Qty" type="number" grid={{ xs: 12, sm: 6, xl: 4 }} required />
                      {!isEditing && <CommonValidationSwitch name="isActive" label="Is Active" grid={{ xs: 12 }} />}
                    </Grid>
                  </CommonCard>

                  {/* ---------- ACTION BAR ---------- */}
                  <CommonBottomActionBar save={isEditing} clear={!isEditing} disabled={!dirty} isLoading={isAddLoading} onClear={() => resetForm({ values: initialValues })} onSave={() => setFieldValue("_submitAction", "save")} onSaveAndNew={() => setFieldValue("_submitAction", "saveAndNew")} />
                </Grid>
              </Form>
            );
          }}
        </Formik>
      </Box>
    </>
  );
};

export default ItemForm;
