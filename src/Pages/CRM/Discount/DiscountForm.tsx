import { Box, Grid, Typography } from "@mui/material";
import { ClearIcon } from "@mui/x-date-pickers-pro";
import { FieldArray, Form, Formik, type FormikHelpers } from "formik";
import { useLocation, useNavigate } from "react-router-dom";
import { Mutations, Queries } from "../../../Api";
import { CommonButton, CommonValidationCheckbox, CommonValidationDatePicker, CommonValidationRadio, CommonValidationSelect, CommonValidationSwitch, CommonValidationTextField } from "../../../Attribute";
import { CommonBottomActionBar, CommonBreadcrumbs, CommonCard, DependentSelect } from "../../../Components/Common";
import { PAGE_TITLE } from "../../../Constants";
import { BOOLEAN_OPTIONS, BREADCRUMBS, DISCOUNT_APPLICABLE, DISCOUNT_APPLICABLE_ENUM, DISCOUNT_APPLY_TO, DISCOUNT_APPLY_TO_ENUM, DISCOUNT_MODE, DISCOUNT_MODE_ENUM, DISCOUNT_VALUE_TYPE, MINIMUM_REQUIREMENT, MINIMUM_REQUIREMENT_ENUM } from "../../../Data";
import type { BrandBase, CategoryBase, DiscountFormValues, ProductBase } from "../../../Types";
import { DiscountFormSchema, GenerateOptions, GetChangedFields, RemoveEmptyFields } from "../../../Utils";

const DiscountForm = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { data } = location.state || {};

  const isEditing = Boolean(data?._id);
  const pageMode = isEditing ? "EDIT" : "ADD";

  const { mutate: addDiscount, isPending: isAddLoading } = Mutations.useAddDiscount();
  const { mutate: editDiscount, isPending: isEditLoading } = Mutations.useEditDiscount();

  const { data: companyData, isLoading: companyDataLoading } = Queries.useGetCompanyDropdown();
  const { data: CategoryData, isLoading: CategoryLoading } = Queries.useGetCategoryDropdown();
  const { data: BrandData, isLoading: BrandLoading } = Queries.useGetBrandDropdown();

  // const branchIds = data?.branchIds?.map((branch: BranchBase) => branch?._id) || [];
  const categoryIds = data?.categoryIds?.map((category: CategoryBase) => category?._id) || [];
  const brandIds = data?.brandIds?.map((brand: BrandBase) => brand?._id) || [];
  const productIds = data?.productIds?.map((product: { productId: ProductBase }) => product?.productId?._id) || [];
  const variantIds = data?.productIds?.map((product: { variantId: string }) => product?.variantId) || [];
  const excludedProductIds = data?.excludedProductIds?.map((product: { productId: ProductBase }) => product?.productId?._id) || [];
  const excludedVariantIds = data?.excludedProductIds?.map((product: { variantId: string }) => product?.variantId) || [];
  const getProductIds = data?.buyXGetY?.getProductIds?.map((product: { productId: ProductBase }) => product?.productId?._id) || [];
  const getVariantIds = data?.buyXGetY?.getVariantIds?.map((product: { variantId: string }) => product?.variantId) || [];
  const freeProductIds = data?.productAtFixAmount?.freeProductIds?.map((product: { productId: ProductBase }) => product?.productId?._id) || [];
  const freeVariantIds = data?.productAtFixAmount?.freeVariantIds?.map((product: { variantId: string }) => product?.variantId) || [];

  const appliesTo = data?.discountApplicable === DISCOUNT_APPLICABLE_ENUM.PRODUCT_WISE ? DISCOUNT_APPLY_TO_ENUM.SPECIFIC_CATEGORY : null;

  // ✅ INITIAL VALUES
  const initialValues: DiscountFormValues = {
    companyId: data?.companyId?._id || "",
    // branchIds: data?.branchIds?.length ? branchIds : [],
    title: data?.title || "",
    discountCode: data?.discountCode || "",
    autoApply: data?.autoApply ?? false,
    discountApplicable: data?.discountApplicable || DISCOUNT_APPLICABLE_ENUM.PRODUCT_WISE,
    excludeAlreadyDiscounted: data?.excludeAlreadyDiscounted ?? false,

    discountMode: data?.discountMode || DISCOUNT_MODE_ENUM.NORMAL,
    discountType: data?.discountType || "",
    discountValue: data?.discountValue || "",

    appliesTo: data?.appliesTo || appliesTo,
    categoryIds: data?.categoryIds?.length ? categoryIds : [],
    brandIds: data?.brandIds?.length ? brandIds : [],
    productIds: data?.productIds?.length ? productIds : [],
    variantIds: data?.variantIds?.length ? variantIds : [],
    excludedProductIds: data?.excludedProductIds?.length ? excludedProductIds : [],
    excludedVariantIds: data?.excludedProductIds?.length ? excludedVariantIds : [],
    rangeWiseRules: data?.rangeWiseRules?.length ? data.rangeWiseRules : [{ minQty: "", maxQty: "", discountValue: "", discountType: "" }],

    buyXGetY: {
      buyQty: data?.buyXGetY?.buyQty || "",
      getProductIds: data?.buyXGetY?.getProductIds?.length ? getProductIds : [],
      getVariantIds: data?.buyXGetY?.getProductIds?.length ? getVariantIds : [],
      getQty: data?.buyXGetY?.getQty || "",
    },

    productAtFixAmount: {
      minimumAmount: data?.productAtFixAmount?.minimumAmount || "",
      freeProductIds: data?.productAtFixAmount?.freeProductIds?.length ? freeProductIds : [],
      freeVariantIds: data?.productAtFixAmount?.freeProductIds?.length ? freeVariantIds : [],
      freeQty: data?.productAtFixAmount?.freeQty || "",
    },

    minimumRequirement: data?.minimumRequirement || "",
    minimumPurchaseAmount: data?.minimumPurchaseAmount || "",
    minimumQuantity: data?.minimumQuantity || "",

    usageLimitTotal: data?.usageLimitTotal || "",
    usageLimitPerCustomer: data?.usageLimitPerCustomer ?? false,

    startDateTime: data?.startDateTime || "",
    hasEndDate: data?.hasEndDate ?? false,
    endDateTime: data?.endDateTime || "",
    isActive: data?.isActive ?? true,
  };

  const handleSubmit = async (values: DiscountFormValues, { resetForm }: FormikHelpers<DiscountFormValues>) => {
    const { _submitAction, ...rest } = values;

    const handleSuccess = () => {
      if (_submitAction === "saveAndNew") resetForm();
      else navigate(-1);
    };

    const payload = {
      companyId: rest?.companyId,
      // branchIds: rest.branchIds,
      title: rest?.title,
      discountCode: rest?.discountCode,
      autoApply: rest?.autoApply,
      discountApplicable: rest?.discountApplicable,

      discountMode: rest?.discountMode,

      ...(rest?.discountMode === DISCOUNT_MODE_ENUM.NORMAL
        ? {
            discountType: rest?.discountType,
            discountValue: rest?.discountValue,
            minimumRequirement: rest?.minimumRequirement || MINIMUM_REQUIREMENT_ENUM.NONE,
            minimumPurchaseAmount: rest?.minimumPurchaseAmount,
            minimumQuantity: rest?.minimumQuantity,
          }
        : {
            discountType: null,
            discountValue: null,
            minimumRequirement: MINIMUM_REQUIREMENT_ENUM.NONE,
            minimumPurchaseAmount: null,
            minimumQuantity: null,
          }),

      ...(rest?.discountApplicable === DISCOUNT_APPLICABLE_ENUM.PRODUCT_WISE
        ? {
            excludeAlreadyDiscounted: rest?.excludeAlreadyDiscounted,
            ...([DISCOUNT_MODE_ENUM.NORMAL, DISCOUNT_MODE_ENUM.RANGE_WISE, DISCOUNT_MODE_ENUM.BUY_X_GET_Y].includes(rest?.discountMode || "")
              ? {
                  appliesTo: rest?.appliesTo,
                  categoryIds: rest?.appliesTo === DISCOUNT_APPLY_TO_ENUM.SPECIFIC_CATEGORY ? rest?.categoryIds : [],
                  brandIds: rest?.appliesTo === DISCOUNT_APPLY_TO_ENUM.SPECIFIC_BRAND ? rest?.brandIds : [],
                  productIds: rest?.appliesTo === DISCOUNT_APPLY_TO_ENUM.SPECIFIC_PRODUCTS ? (rest?.productIds || []).map((productId, index) => ({ productId, variantId: rest?.variantIds?.[index] || null })) : [],
                  excludedProductIds: (rest?.excludedProductIds || []).map((productId, index) => ({ productId, variantId: rest?.excludedVariantIds?.[index] || null })),
                }
              : {
                  appliesTo: null,
                  categoryIds: [],
                  brandIds: [],
                  productIds: [],
                  excludedProductIds: [],
                }),
            ...(rest?.discountMode === DISCOUNT_MODE_ENUM.RANGE_WISE ? { rangeWiseRules: rest?.rangeWiseRules } : { rangeWiseRules: [] }),
            ...(rest?.discountMode === DISCOUNT_MODE_ENUM.BUY_X_GET_Y
              ? {
                  buyXGetY: {
                    buyQty: rest?.buyXGetY?.buyQty,
                    getProductIds: (rest?.buyXGetY?.getProductIds || []).map((productId, index) => ({ productId, variantId: rest?.buyXGetY?.getVariantIds?.[index] || null })),
                    getQty: rest?.buyXGetY?.getQty,
                  },
                }
              : { buyXGetY: null }),
            ...(rest?.discountMode === DISCOUNT_MODE_ENUM.PRODUCT_AT_FIX_AMOUNT
              ? {
                  productAtFixAmount: {
                    minimumAmount: rest?.productAtFixAmount?.minimumAmount,
                    freeProductIds: (rest?.productAtFixAmount?.freeProductIds || []).map((productId, index) => ({ productId: productId, variantId: rest?.productAtFixAmount?.freeVariantIds?.[index] || null })),
                    freeQty: rest?.productAtFixAmount?.freeQty,
                  },
                }
              : { productAtFixAmount: null }),
          }
        : {
            excludeAlreadyDiscounted: false,
            appliesTo: null,
            categoryIds: [],
            brandIds: [],
            productIds: [],
            excludedProductIds: [],
            rangeWiseRules: [],
            buyXGetY: null,
            productAtFixAmount: null,
          }),

      usageLimitTotal: rest?.usageLimitTotal,
      usageLimitPerCustomer: rest?.usageLimitPerCustomer,

      startDateTime: rest?.startDateTime,
      hasEndDate: rest?.hasEndDate,
      endDateTime: rest?.endDateTime,
      isActive: rest?.isActive,
    };

    if (isEditing) {
      const changedFields = GetChangedFields(payload, data);
      editDiscount({ ...changedFields, discountId: data._id }, { onSuccess: handleSuccess });
    } else {
      addDiscount(RemoveEmptyFields(payload as DiscountFormValues), { onSuccess: handleSuccess });
    }
  };

  return (
    <>
      <CommonBreadcrumbs title={PAGE_TITLE.CRM.DISCOUNT[pageMode]} maxItems={3} breadcrumbs={BREADCRUMBS.DISCOUNT[pageMode]} />

      <Box sx={{ p: { xs: 2, md: 3 }, mb: 8 }}>
        <Formik<DiscountFormValues> initialValues={initialValues} validationSchema={DiscountFormSchema} onSubmit={handleSubmit}>
          {({ setFieldValue, resetForm, dirty, values }) => {
            const discountModeOptions = DISCOUNT_MODE.map((opt) => ({
              label: opt.label,
              value: opt.value,
              disabled: values.discountApplicable === DISCOUNT_APPLICABLE_ENUM.ENTIRE_BILL && [DISCOUNT_MODE_ENUM.PRODUCT_AT_FIX_AMOUNT, DISCOUNT_MODE_ENUM.BUY_X_GET_Y, DISCOUNT_MODE_ENUM.RANGE_WISE].includes(opt.value),
            }));

            const resetDiscountModeFields = () => {
              setFieldValue("appliesTo", "");
            };

            const handleDiscountApplicableChange = (selectedValue: string) => {
              setFieldValue("discountMode", DISCOUNT_MODE_ENUM.NORMAL);
              if (selectedValue === DISCOUNT_APPLICABLE_ENUM.ENTIRE_BILL) resetDiscountModeFields();
              else setFieldValue("appliesTo", DISCOUNT_APPLY_TO_ENUM.SPECIFIC_CATEGORY);
            };

            const handleDiscountModeChange = (selectedValue: string) => {
              setFieldValue("minimumRequirement", "");
              if (DISCOUNT_MODE_ENUM.PRODUCT_AT_FIX_AMOUNT === selectedValue) resetDiscountModeFields();
              else setFieldValue("appliesTo", DISCOUNT_APPLY_TO_ENUM.SPECIFIC_CATEGORY);
            };

            return (
              <Form noValidate>
                <Box sx={{ display: "grid", gap: 2 }}>
                  <CommonCard hideDivider>
                    <Grid container spacing={2} sx={{ p: 2 }}>
                      <CommonValidationSelect name="companyId" label="Company Name" required isLoading={companyDataLoading} options={GenerateOptions(companyData?.data)} grid={{ xs: 12, md: 4 }} />
                      {/* <DependentSelect params={{ companyFilter: values?.companyId }} name="branchIds" label="Branch" multiple required query={Queries.useGetBranchDropdown} grid={{ xs: 12, md: 3 }} disabled={!values?.companyId} /> */}
                      <CommonValidationTextField name="title" label="Title" grid={{ xs: 12, md: 4 }} required />
                      <CommonValidationTextField name="discountCode" label="Discount Code" grid={{ xs: 12, md: 4 }} required />
                      <CommonValidationRadio name="autoApply" label="Discount Auto Apply" options={BOOLEAN_OPTIONS} row grid={{ xs: 12, md: 3 }} required />
                      <CommonValidationRadio name="discountApplicable" label="Discount Applicable" required options={DISCOUNT_APPLICABLE} row onChange={handleDiscountApplicableChange} grid={{ xs: 12, md: 3 }} />
                      {values.discountApplicable === DISCOUNT_APPLICABLE_ENUM.PRODUCT_WISE && <CommonValidationRadio name="excludeAlreadyDiscounted" label="Exclude Products Which Already have Discount Applied" options={BOOLEAN_OPTIONS} row grid={{ xs: 12, md: 4 }} required />}

                      <CommonValidationRadio name="discountMode" label="Discount" options={discountModeOptions} row grid={{ xs: 12 }} onChange={handleDiscountModeChange} required />
                      {[DISCOUNT_MODE_ENUM.NORMAL].includes(values.discountMode || "") && (
                        <>
                          <CommonValidationSelect name="discountType" label="Discount Type" required options={DISCOUNT_VALUE_TYPE} grid={{ xs: 12, md: 3 }} />
                          <CommonValidationTextField name="discountValue" label="Discount Value" type="number" grid={{ xs: 12, md: 3 }} maxDigits={5} required />
                        </>
                      )}
                      {[DISCOUNT_MODE_ENUM.RANGE_WISE].includes(values.discountMode || "") && (
                        <Grid size={12}>
                          <FieldArray name="rangeWiseRules">
                            {({ push, remove }) => (
                              <>
                                <Box p={2} className="border border-gray-300 dark:border-gray-600 rounded-sm">
                                  {values?.rangeWiseRules?.map((_, vIndex) => (
                                    <Grid key={vIndex} container spacing={1} sx={{ xs: 12 }} py={1}>
                                      <CommonValidationTextField name={`rangeWiseRules.${vIndex}.minQty`} label="Minimum Qty" type="number" maxDigits={5} grid={{ xs: 12, md: 3 }} required />
                                      <CommonValidationTextField name={`rangeWiseRules.${vIndex}.maxQty`} label="Maximum Qty" type="number" maxDigits={5} grid={{ xs: 12, md: 3 }} required />
                                      <CommonValidationSelect name={`rangeWiseRules.${vIndex}.discountType`} label="Discount Type" options={DISCOUNT_VALUE_TYPE} grid={{ xs: 12, md: 3 }} required />
                                      <CommonValidationTextField name={`rangeWiseRules.${vIndex}.discountValue`} label="Discount Value" type="number" maxDigits={5} grid={"grow"} required />
                                      {(values?.rangeWiseRules?.length || 0) > 1 && (
                                        <CommonButton variant="outlined" color="error" sx={{ minWidth: 40 }} size="small" onClick={() => remove(vIndex)}>
                                          <ClearIcon />
                                        </CommonButton>
                                      )}
                                    </Grid>
                                  ))}
                                  <CommonButton title="+ Add" variant="outlined" onClick={() => push({ minQty: "", maxQty: "", discountValue: "", discountType: "" })} />
                                </Box>
                              </>
                            )}
                          </FieldArray>
                        </Grid>
                      )}

                      {values.discountApplicable === DISCOUNT_APPLICABLE_ENUM.PRODUCT_WISE && values.discountMode !== DISCOUNT_MODE_ENUM.PRODUCT_AT_FIX_AMOUNT && (
                        <>
                          <CommonValidationRadio name="appliesTo" label="Applies To" required options={DISCOUNT_APPLY_TO} row grid={{ xs: 12 }} />
                          {values.appliesTo === DISCOUNT_APPLY_TO_ENUM.SPECIFIC_CATEGORY && <CommonValidationSelect name="categoryIds" label="Select Category and Subcategory" multiple options={GenerateOptions(CategoryData?.data)} isLoading={CategoryLoading} grid={{ xs: 12, md: 4 }} required />}
                          {values.appliesTo === DISCOUNT_APPLY_TO_ENUM.SPECIFIC_BRAND && <CommonValidationSelect name="brandIds" label="Select Brand and Subbrand" multiple options={GenerateOptions(BrandData?.data)} isLoading={BrandLoading} grid={{ xs: 12, md: 4 }} required />}
                          {values.appliesTo === DISCOUNT_APPLY_TO_ENUM.SPECIFIC_PRODUCTS && <DependentSelect params={{ companyFilter: values?.companyId }} name="productIds" syncName="variantIds" label="Select Products" multiple required query={Queries.useGetProductDropdown} grid={{ xs: 12, md: 4 }} disabled={!values?.companyId} />}
                          {values.discountMode === DISCOUNT_MODE_ENUM.BUY_X_GET_Y && <CommonValidationTextField name="buyXGetY.buyQty" label="Select Qty" type="number" grid={{ xs: 12, md: 4 }} maxDigits={5} required />}
                          <DependentSelect params={{ companyFilter: values?.companyId }} name="excludedProductIds" syncName="excludedVariantIds" label="Excluding Products" multiple required query={Queries.useGetProductDropdown} grid={{ xs: 12, md: 4 }} disabled={!values?.companyId} />
                        </>
                      )}
                      {DISCOUNT_MODE_ENUM.PRODUCT_AT_FIX_AMOUNT === values.discountMode && (
                        <>
                          <Grid size={12}>
                            <Typography component="div">Minimum Requirement</Typography>
                          </Grid>
                          <CommonValidationTextField name="productAtFixAmount.minimumAmount" label="Minimum Purchase Amount" type="number" grid={{ xs: 12, md: 4 }} maxDigits={5} required />
                        </>
                      )}
                      {[DISCOUNT_MODE_ENUM.BUY_X_GET_Y, DISCOUNT_MODE_ENUM.PRODUCT_AT_FIX_AMOUNT].includes(values.discountMode || "") && (
                        <>
                          <Grid size={12}>
                            <Typography component="div">Given To Specific Products</Typography>
                          </Grid>
                          {DISCOUNT_MODE_ENUM.BUY_X_GET_Y === values.discountMode && (
                            <>
                              <DependentSelect params={{ companyFilter: values?.companyId }} name="buyXGetY.getProductIds" syncName="buyXGetY.getVariantIds" label="Select Products" multiple required query={Queries.useGetProductDropdown} grid={{ xs: 12, md: 4 }} disabled={!values?.companyId} />
                              <CommonValidationTextField name="buyXGetY.getQty" label="Select Qty" type="number" grid={{ xs: 12, md: 4 }} maxDigits={5} required />
                            </>
                          )}
                          {DISCOUNT_MODE_ENUM.PRODUCT_AT_FIX_AMOUNT === values.discountMode && (
                            <>
                              <DependentSelect params={{ companyFilter: values?.companyId }} name="productAtFixAmount.freeProductIds" syncName="productAtFixAmount.freeVariantIds" label="Select Products" multiple required query={Queries.useGetProductDropdown} grid={{ xs: 12, md: 4 }} disabled={!values?.companyId} />
                              <CommonValidationTextField name="productAtFixAmount.freeQty" label="Select Qty" type="number" grid={{ xs: 12, md: 4 }} maxDigits={5} required />
                            </>
                          )}
                        </>
                      )}

                      {[DISCOUNT_MODE_ENUM.NORMAL].includes(values?.discountMode || "") && <CommonValidationRadio name="minimumRequirement" label="Minimum Requirement" required options={MINIMUM_REQUIREMENT} row grid={{ xs: 12 }} />}
                      {values.minimumRequirement === MINIMUM_REQUIREMENT_ENUM.MIN_PURCHASE_AMOUNT && <CommonValidationTextField name="minimumPurchaseAmount" label="Minimum Purchase Amount" type="number" grid={{ xs: 12, md: 3 }} maxDigits={5} required />}
                      {values.minimumRequirement === MINIMUM_REQUIREMENT_ENUM.MIN_QUANTITY && <CommonValidationTextField name="minimumQuantity" label="Minimum Quantity" type="number" grid={{ xs: 12, md: 3 }} maxDigits={5} required />}

                      <Grid size={12}>
                        <Typography component="div">Usage Limits</Typography>
                      </Grid>
                      <CommonValidationTextField name="usageLimitTotal" label="Limit Number of Times This Discount can be Used in Total" type="number" grid={{ xs: 12, md: 4 }} />
                      <CommonValidationCheckbox name="usageLimitPerCustomer" label="Limit to One Use Per Customer" grid={"auto"} />

                      <Grid size={12}>
                        <Typography component="div">Active Dates</Typography>
                      </Grid>
                      <CommonValidationDatePicker name="startDateTime" label="Start Date" pickerType="datetime" grid={{ xs: 12, md: 3 }} required />
                      <CommonValidationCheckbox name="hasEndDate" label="Set End Date" grid={"auto"} />
                      {values.hasEndDate && <CommonValidationDatePicker name="endDateTime" label="End Date" pickerType="datetime" grid={{ xs: 12, md: 3 }} required />}

                      {!isEditing && <CommonValidationSwitch name="isActive" label="Is Active" grid={{ xs: 12 }} />}
                    </Grid>
                  </CommonCard>

                  <CommonBottomActionBar save={isEditing} clear={!isEditing} disabled={!dirty} isLoading={isAddLoading || isEditLoading} onClear={() => resetForm({ values: initialValues })} onSave={() => setFieldValue("_submitAction", "save")} onSaveAndNew={() => setFieldValue("_submitAction", "saveAndNew")} />
                </Box>
              </Form>
            );
          }}
        </Formik>
      </Box>
    </>
  );
};

export default DiscountForm;
