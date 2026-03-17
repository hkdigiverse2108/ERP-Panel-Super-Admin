import { Box, Grid } from "@mui/material";
import { Form, Formik, useFormikContext, type FormikHelpers } from "formik";
import { useLocation, useNavigate } from "react-router-dom";
import { Mutations, Queries } from "../../../Api";
import { CommonValidationSelect, CommonValidationSwitch, CommonValidationTextField } from "../../../Attribute";
import { CommonBottomActionBar, CommonBreadcrumbs, CommonCard } from "../../../Components/Common";
import { PAGE_TITLE } from "../../../Constants";
import { BREADCRUMBS } from "../../../Data";
import type { StockFormValues, TaxBase } from "../../../Types";
import { GenerateOptions, RemoveEmptyFields } from "../../../Utils";
import { ProductItemFormSchema } from "../../../Utils/ValidationSchemas";
import { usePagePermission } from "../../../Utils/Hooks";
import { useEffect } from "react";

const normalizeTax = (value?: number | string): number => {
  if (!value) return 0;
  const num = typeof value === "string" ? Number(value.replace("%", "")) : value;
  return num > 0 && num < 1 ? num * 100 : num;
};

const PriceCalculator = ({ taxData }: { taxData?: TaxBase[] }) => {
  const { values, setFieldValue } = useFormikContext<StockFormValues>();

  const { purchasePrice, purchaseTaxId, isPurchaseTaxIncluding, landingCost, mrp, sellingDiscount } = values;

  const purchaseTax = taxData?.find((t) => t._id === purchaseTaxId);

  useEffect(() => {
    const tax = normalizeTax(purchaseTax?.percentage);
    const basePrice = Number(purchasePrice ?? 0);

    const calculatedLandingCost = isPurchaseTaxIncluding ? basePrice : basePrice + (basePrice * tax) / 100;

    setFieldValue("landingCost", calculatedLandingCost.toFixed(2), false);
    setFieldValue("mrp", calculatedLandingCost.toFixed(2), false);
  }, [purchasePrice, purchaseTaxId, isPurchaseTaxIncluding, setFieldValue, purchaseTax?.percentage]);

  useEffect(() => {
    const finalLandingCost = Number(landingCost ?? 0);
    const finalMrp = Number(mrp ?? finalLandingCost);
    const discount = Number(sellingDiscount ?? 0);

    const sellingPrice = finalMrp - discount;
    const sellingMargin = sellingPrice - finalLandingCost;

    setFieldValue("sellingPrice", sellingPrice.toFixed(2), false);
    setFieldValue("sellingMargin", sellingMargin.toFixed(2), false);
  }, [landingCost, mrp, sellingDiscount, setFieldValue]);

  return null;
};

const ItemForm = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const permission = usePagePermission(PAGE_TITLE.INVENTORY.STOCK.BASE);

  const { data, companyId } = location.state || {};
  const { data: CompanyData, isLoading: CompanyDataLoading } = Queries.useGetCompanyDropdown();
  const { data: ProductData, isLoading: ProductDataLoading } = Queries.useGetProductDropdown();
  const { data: UOMData, isLoading: UOMDataLoading } = Queries.useGetUomDropdown();
  const { data: TaxData, isLoading: TaxDataLoading } = Queries.useGetTaxDropdown();

  const { mutate: addStock, isPending: isAddLoading } = Mutations.useAddStock();

  const isEditing = Boolean(data?._id);
  const pageMode = isEditing ? "EDIT" : "ADD";

  const initialValues: StockFormValues = {
    companyId: companyId,
    productId: "",
    uomId: "",
    purchaseTaxId: "",
    salesTaxId: "",
    isPurchaseTaxIncluding: false,
    isSalesTaxIncluding: false,
    purchasePrice: null,
    landingCost: null,
    mrp: null,
    sellingDiscount: null,
    sellingPrice: null,
    sellingMargin: null,
    qty: null,
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
          {({ setFieldValue, resetForm, dirty, values }) => {
            return (
              <Form noValidate>
                <PriceCalculator taxData={TaxData?.data} />
                <Grid container spacing={2}>
                  {/* ---------- GENERAL DETAILS ---------- */}
                  <CommonCard hideDivider>
                    <Grid container spacing={2} sx={{ p: 2 }}>
                      <CommonValidationSelect name="companyId" label="Select company" options={GenerateOptions(CompanyData?.data)} isLoading={CompanyDataLoading} grid={{ xs: 12, sm: 6, xl: 4 }} required />
                      <CommonValidationSelect name="productId" label="Select Product" options={GenerateOptions(ProductData?.data)} isLoading={ProductDataLoading} grid={{ xs: 12, sm: 6, xl: 4 }} required />
                      <CommonValidationSelect name="uomId" label="Select UOM" options={GenerateOptions(UOMData?.data)} isLoading={UOMDataLoading} grid={{ xs: 12, sm: 6, xl: 4 }} required />
                      <CommonValidationSelect name="purchaseTaxId" label="Purchase Tax" isLoading={TaxDataLoading} syncFieldName="salesTaxId" options={GenerateOptions(TaxData?.data)} grid={{ xs: 12, sm: 6, xl: 4 }} required />
                      <CommonValidationSwitch name="isPurchaseTaxIncluding" label="Purchase Tax Including" grid={{ xs: 12, sm: 6, xl: 2 }} />
                      <CommonValidationSwitch name="isSalesTaxIncluding" label="Sales Tax Including" grid={{ xs: 12, sm: 6, xl: 2 }} />
                      <CommonValidationSelect name="salesTaxId" label="Sales Tax" isLoading={TaxDataLoading} options={GenerateOptions(TaxData?.data)} grid={{ xs: 12, sm: 6, xl: 4 }} required />
                      <CommonValidationTextField name="qty" label="Qty" type="number" grid={{ xs: 12, sm: 6, xl: 4 }} required />
                      <CommonValidationTextField name="purchasePrice" label="Purchase Price" type="number" grid={{ xs: 12, sm: 6, xl: 4 }} required disabled={!values.purchaseTaxId} />
                      <CommonValidationTextField name="landingCost" label="Landing Cost" type="number" grid={{ xs: 12, sm: 6, xl: 4 }} required disabled />
                      <CommonValidationTextField name="mrp" label="MRP" type="number" grid={{ xs: 12, sm: 6, xl: 4 }} required disabled={!values.salesTaxId} />
                      <CommonValidationTextField name="sellingDiscount" label="selling Discount" type="number" grid={{ xs: 12, sm: 6, xl: 4 }} disabled={!values.salesTaxId} />
                      <CommonValidationTextField name="sellingPrice" label="Selling Price" type="number" grid={{ xs: 12, sm: 6, xl: 4 }} disabled />
                      <CommonValidationTextField name="sellingMargin" label="selling Margin" type="number" grid={{ xs: 12, sm: 6, xl: 4 }} disabled />
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
