import { Box, Grid, Typography } from "@mui/material";
import { Form, Formik, type FormikHelpers } from "formik";
import { useLocation, useNavigate } from "react-router-dom";
import { Mutations, Queries } from "../../../Api";
import type { AddDiscountPayload, DiscountFormValues, EditDiscountPayload } from "../../../Types";
import { GenerateOptions, GetChangedFields, RemoveEmptyFields } from "../../../Utils";
import { PAGE_TITLE } from "../../../Constants";
import { CommonBottomActionBar, CommonBreadcrumbs, CommonCard } from "../../../Components/Common";
import { BREADCRUMBS, CONDITION_OPTIONS, DISCOUNT_APPLICABLE, DISCOUNT_APPLY_TO, DISCOUNT_MODE, DISCOUNT_VALUE_TYPE, MINIMUM_REQUIRMENT } from "../../../Data";
import { CommonValidationCheckbox, CommonValidationDatePicker, CommonValidationRadio, CommonValidationSelect, CommonValidationSwitch, CommonValidationTextField, CommonValidationTimePicker } from "../../../Attribute";

const DiscountForm = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { data } = location.state || {};

  const isEditing = Boolean(data?._id);
  const pageMode = isEditing ? "EDIT" : "ADD";

  const { mutate: addDiscount, isPending: isAddLoading } = Mutations.useAddDiscount();
  const { mutate: editDiscount, isPending: isEditLoading } = Mutations.useEditDiscount();
  const { data: BranchData, isLoading: BranchLoading } = Queries.useGetBranchDropdown();
  const { data: CategoryData, isLoading: CategoryLoading } = Queries.useGetCategoryDropdown();
  const { data: BrandData, isLoading: BrandLoading } = Queries.useGetBrandDropdown();
  const { data: ProductData, isLoading: ProductLoading } = Queries.useGetProductDropdown();
  // ✅ INITIAL VALUES
  const initialValues: DiscountFormValues = {
    isActive: data?.isActive ?? true,
    discountMode: data?.discountMode || "normal",
    autoApply: data?.autoApply || false,
    title: data?.title || "",
    discountCode: data?.discountCode || "",
    discountApplicable: data?.discountApplicable || "",
    discountType: data?.discountType || "",
    discountValue: data?.discountValue || 0,
    rangeWiseRules: data?.rangeWiseRules?.length ? data.rangeWiseRules : [{ min: 0, max: 0, discountValue: 0 }],
    appliesTo: data?.appliesTo || "",
    applyToEntireSelection: data?.applyToEntireSelection || false,
    categoryIds: data?.categoryIds?.length ? data.categoryIds : [],
    branchIds: data?.branchIds?.length ? data.branchIds : [],
    brandIds: data?.brandIds?.length ? data.brandIds : [],
    productIds: data?.productIds?.length ? data.productIds : [],

    minimumRequirement: data?.minimumRequirement || "",
    minimumPurchaseAmount: data?.minimumPurchaseAmount || 0,
    minimumQuantity: data?.minimumQuantity || 0,
    hasUsageLimitTotal: Boolean(data?.usageLimitTotal),
    usageLimitTotal: data?.usageLimitTotal || 0,
    usageLimitPerCustomer: data?.usageLimitPerCustomer || false,
    hasEndDate: data?.hasEndDate || false,
  };

  const handleSubmit = async (values: DiscountFormValues, { resetForm }: FormikHelpers<DiscountFormValues>) => {
    const { _submitAction, ...rest } = values;

    const handleSuccess = () => {
      if (_submitAction === "saveAndNew") resetForm();
      else navigate(-1);
    };

    const payload = { ...rest };

    if (isEditing) {
      const changedFields = GetChangedFields(payload, data);
      editDiscount({ ...changedFields, discountId: data._id } as EditDiscountPayload, { onSuccess: handleSuccess });
    } else {
      addDiscount(RemoveEmptyFields(payload) as AddDiscountPayload, { onSuccess: handleSuccess });
    }
  };

  return (
    <>
      <CommonBreadcrumbs title={PAGE_TITLE.CRM.DISCOUNT[pageMode]} maxItems={3} breadcrumbs={BREADCRUMBS.DISCOUNT[pageMode]} />

      <Box sx={{ p: { xs: 2, md: 3 }, mb: 8 }}>
        <Formik<DiscountFormValues> initialValues={initialValues} onSubmit={handleSubmit}>
          {({ setFieldValue, resetForm, dirty, values }) => (
            <Form noValidate>
              <Box sx={{ display: "grid", gap: 2 }}>
                <CommonCard hideDivider>
                  <Grid container spacing={2} sx={{ p: 2 }}>
                    <CommonValidationSwitch name="autoApply" label="Discount Auto Apply" grid={{ xs: 12, md: 4 }} />
                    {values.discountApplicable === "product_wise" && <CommonValidationSwitch name="excludeAlreadyDiscounted" label="Exclude Products Which Already have Discount Applied" grid={{ xs: 12, md: 4 }} />}
                    <CommonValidationTextField name="discountCode" label="Discount Code" grid={{ xs: 12, md: 4 }} />
                    <CommonValidationSelect name="branchIds" label="Branch" multiple options={GenerateOptions(BranchData?.data)} isLoading={BranchLoading} grid={{ xs: 12, md: 4 }} required />
                    <CommonValidationRadio name="discountApplicable" label="Discount Applicable" required options={DISCOUNT_APPLICABLE} row grid={{ xs: 12 }} />
                    <CommonValidationRadio
                      name="discountMode"
                      label="Discount Mode"
                      required
                      options={DISCOUNT_MODE}
                      row
                      grid={{ xs: 12 }}
                      onChange={(val) => {
                        if (val === "normal") setFieldValue("minimumRequirement", "");
                        else if (val === "range_wise") setFieldValue("minimumRequirement", "min_purchase_amount");
                        else if (val === "product_at_fix_amount") setFieldValue("minimumRequirement", "min_purchase_amount");
                      }}
                    />
                    {["normal", "range_wise"].includes(values.discountMode || "") && (
                      <>
                        <CommonValidationSelect name="discountType" label="Discount Type" required options={DISCOUNT_VALUE_TYPE} grid={{ xs: 12, md: 4 }} />
                        <CommonValidationTextField name="discountValue" label="Discount Value" type="number" isCurrency currencyDisabled grid={{ xs: 12, md: 4 }} />
                      </>
                    )}
                    {values.discountApplicable === "product_wise" && (
                      <>
                        {values.discountMode !== "product_at_fix_amount" && (
                          <>
                            <CommonValidationRadio name="appliesTo" label="Applies To" required options={DISCOUNT_APPLY_TO} row grid={{ xs: 12 }} />
                            <CommonValidationCheckbox name="applyToEntireSelection" label="Applies To Entire Selection" disabled={values.discountMode !== "range_wise"} grid={{ xs: 12 }} />
                            {values.appliesTo === "specific_category" && <CommonValidationSelect name="categoryIds" label="Category" multiple options={GenerateOptions(CategoryData?.data)} isLoading={CategoryLoading} grid={{ xs: 12, md: 4 }} required />}
                            {values.appliesTo === "specific_brand" && <CommonValidationSelect name="brandIds" label="Brand" multiple options={GenerateOptions(BrandData?.data)} isLoading={BrandLoading} grid={{ xs: 12, md: 4 }} required />}
                            {values.appliesTo === "specific_products" && <CommonValidationSelect name="productIds" label="Product" multiple options={GenerateOptions(ProductData?.data)} isLoading={ProductLoading} grid={{ xs: 12, md: 4 }} required />}
                            <CommonValidationSelect name="getProductIds" label="Excluding Products" multiple options={GenerateOptions(ProductData?.data)} isLoading={ProductLoading} grid={{ xs: 12, md: 4 }} required />
                          </>
                        )}
                      </>
                    )}
                    {values.discountMode === "buy_x_get_y" && (
                      <>
                        <CommonValidationSelect name="minimumRequirement" label="Condition On" options={CONDITION_OPTIONS} grid={{ xs: 12, md: 4 }} required />
                        <CommonValidationTextField name="buyQty" label="Select Qty" type="number" grid={{ xs: 12, md: 4 }} />
                        {values.minimumRequirement === "min_purchase_amount" && <CommonValidationTextField name="minimumPurchaseAmount" label="Purchase Amount" type="number" grid={{ xs: 12, md: 4 }} />}
                        {values.minimumRequirement === "min_quantity" && <CommonValidationTextField name="minimumQuantity" label="Select Quantity" type="number" grid={{ xs: 12, md: 4 }} />}
                      </>
                    )}
                    {values.discountMode === "product_at_fix_amount" && <CommonValidationTextField name="minimumPurchaseAmount" label="Minimum Purchase Amount" type="number" grid={{ xs: 12, md: 4 }} />}
                    {["buy_x_get_y", "product_at_fix_amount"].includes(values.discountMode || "") && (
                      <>
                        <Grid size={12}>
                          <Typography component="div">Given To</Typography>
                        </Grid>
                        <CommonValidationSelect name="productIds" label="Product" multiple options={GenerateOptions(ProductData?.data)} isLoading={ProductLoading} grid={{ xs: 12, md: 4 }} required />
                        <CommonValidationSelect name="getProductIds" label="Excluding Products" multiple options={GenerateOptions(ProductData?.data)} isLoading={ProductLoading} grid={{ xs: 12, md: 4 }} required />
                        <CommonValidationTextField name="getqty" label="Select Qty" type="number" grid={{ xs: 12, md: 4 }} />
                      </>
                    )}
                    <CommonValidationCheckbox name="hasUsageLimitTotal" label="Limit Number of Times This Discount can be Used in Total" grid={{ xs: 12 }} />
                    {values.hasUsageLimitTotal && <CommonValidationTextField name="usageLimitTotal" label="Usage Limit" type="number" grid={{ xs: 12, md: 4 }} />}
                    <CommonValidationCheckbox name="usageLimitPerCustomer" label="Limit to One Use Per Customer" grid={{ xs: 12 }} />

                    {["normal", "range_wise"].includes(values?.discountMode || "") && <CommonValidationRadio name="minimumRequirement" label="Minimum Requirement" required options={MINIMUM_REQUIRMENT} row grid={{ xs: 12 }} />}
                    {values.discountMode === "normal" && values.minimumRequirement === "min_purchase_amount" && <CommonValidationTextField name="minimumPurchaseAmount" label="Minimum Purchase Amount" type="number" grid={{ xs: 12 }} />}
                    {values.discountMode === "normal" && values.minimumRequirement === "min_quantity" && <CommonValidationTextField name="minimumQuantity" label="Minimum Quantity" type="number" grid={{ xs: 12 }} />}

                    <CommonValidationDatePicker name="startDateTime" label="Start Date" grid={{ xs: 12, md: 4 }} />
                    <CommonValidationTimePicker name="startDateTime" label="Start Time" grid={{ xs: 12, md: 4 }} />
                    <CommonValidationCheckbox name="hasEndDate" label="Set End Date" grid={{ xs: 12 }} />
                    {values.hasEndDate && (
                      <>
                        <CommonValidationDatePicker name="endDateTime" label="End Date" grid={{ xs: 12, md: 4 }} />
                        <CommonValidationTimePicker name="endDateTime" label="End Time" grid={{ xs: 12, md: 4 }} />
                      </>
                    )}

                    {!isEditing && <CommonValidationSwitch name="isActive" label="Is Active" grid={{ xs: 12 }} />}
                  </Grid>
                </CommonCard>

                <CommonBottomActionBar save={isEditing} clear={!isEditing} disabled={!dirty} isLoading={isAddLoading || isEditLoading} onClear={() => resetForm({ values: initialValues })} onSave={() => setFieldValue("_submitAction", "save")} onSaveAndNew={() => setFieldValue("_submitAction", "saveAndNew")} />
              </Box>
            </Form>
          )}
        </Formik>
      </Box>
    </>
  );
};

export default DiscountForm;
