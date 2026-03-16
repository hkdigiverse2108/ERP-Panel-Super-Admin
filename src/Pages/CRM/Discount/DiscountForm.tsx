import { Box, Grid } from "@mui/material";
import { Form, Formik, type FormikHelpers } from "formik";
import { useLocation, useNavigate } from "react-router-dom";
import { Mutations, Queries } from "../../../Api";
import type { AddDiscountPayload, DiscountFormValues, EditDiscountPayload } from "../../../Types";
import { GenerateOptions, GetChangedFields, RemoveEmptyFields } from "../../../Utils";
import { PAGE_TITLE } from "../../../Constants";
import { CommonBottomActionBar, CommonBreadcrumbs, CommonCard, DependentSelect } from "../../../Components/Common";
import { BREADCRUMBS, DISCOUNT_APPLICABLE, DISCOUNT_APPLY_TO, DISCOUNT_MODE, DISCOUNT_VALUE_TYPE, MINIMUM_REQUIRMENT } from "../../../Data";
import { CommonValidationCheckbox, CommonValidationDatePicker, CommonValidationRadio, CommonValidationSelect, CommonValidationSwitch, CommonValidationTextField } from "../../../Attribute";

const DiscountForm = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { data } = location.state || {};

  const isEditing = Boolean(data?._id);
  const pageMode = isEditing ? "EDIT" : "ADD";

  const { mutate: addDiscount, isPending: isAddLoading } = Mutations.useAddDiscount();
  const { mutate: editDiscount, isPending: isEditLoading } = Mutations.useEditDiscount();
  const { data: CompanyData, isLoading: CompanyDataLoading } = Queries.useGetCompanyDropdown();

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
                    <CommonValidationSelect name="companyId" label="Company" options={GenerateOptions(CompanyData?.data)} isLoading={CompanyDataLoading} grid={{ xs: 12, md: 4 }} required />
                    <CommonValidationSwitch name="autoApply" label="Discount Auto Apply" grid={{ xs: 12, md: 4 }} />
                    <CommonValidationTextField name="discountCode" label="Discount Code" grid={{ xs: 12, md: 4 }} />
                    <CommonValidationRadio name="discountApplicable" label="Discount Applicable" required options={DISCOUNT_APPLICABLE} row grid={{ xs: 12 }} />
                    <CommonValidationRadio name="discountMode" label="Discount Mode" required options={DISCOUNT_MODE} row grid={{ xs: 12 }} />
                    <CommonValidationSelect name="discountType" label="Discount Type" required options={DISCOUNT_VALUE_TYPE} grid={{ xs: 12, md: 4 }} />
                    <CommonValidationTextField name="discountValue" label="Discount Value" type="number" isCurrency currencyDisabled grid={{ xs: 12, md: 4 }} />
                    <CommonValidationRadio name="appliesTo" label="Applies To" required options={DISCOUNT_APPLY_TO} row grid={{ xs: 12 }} />
                    <CommonValidationCheckbox name="applyToEntireSelection" label="Applies To Entire Selection" disabled grid={{ xs: 12 }} />
                    <DependentSelect name="categoryIds" label="Category" query={Queries.useGetCategoryDropdown} params={{ companyFilter: values.companyId }} enabled={Boolean(values.companyId)} disabled={!values.companyId} required grid={{ xs: 12, md: 4 }} />
                    <CommonValidationRadio name="minimumRequirement" label="Minimum Requirement" required options={MINIMUM_REQUIRMENT} row grid={{ xs: 12 }} />
                    <CommonValidationDatePicker name="startDateTime" label="Start Date & Time" grid={{ xs: 12, md: 4 }} />

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
