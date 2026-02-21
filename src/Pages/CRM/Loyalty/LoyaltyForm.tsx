import { Box, Grid } from "@mui/material";
import { Form, Formik, type FormikHelpers } from "formik";
import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Mutations, Queries } from "../../../Api";
import { CommonValidationDatePicker, CommonValidationSelect, CommonValidationSwitch, CommonValidationTextField } from "../../../Attribute";
import { CommonBottomActionBar, CommonBreadcrumbs, CommonCard } from "../../../Components/Common";
import { PAGE_TITLE } from "../../../Constants";
import { BREADCRUMBS, LOYALTY_TYPE } from "../../../Data";
import type { LoyaltyFormValues } from "../../../Types";
import { GenerateOptions, GetChangedFields, RemoveEmptyFields } from "../../../Utils";
import { usePagePermission } from "../../../Utils/Hooks";
import { LoyaltyFormSchema } from "../../../Utils/ValidationSchemas";

const LoyaltyForm = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { data } = location.state || {};
  const permission = usePagePermission(PAGE_TITLE.CRM.LOYALTY.BASE);

  const { data: companyData, isLoading: companyDataLoading } = Queries.useGetCompanyDropdown();

  const { mutate: addLoyalty, isPending: isAddLoading } = Mutations.useAddLoyalty();
  const { mutate: editLoyalty, isPending: isEditLoading } = Mutations.useEditLoyalty();

  const isEditing = Boolean(data?._id);
  const pageMode = isEditing ? "EDIT" : "ADD";

  const initialValues: LoyaltyFormValues = {
    companyId: data?.companyId?._id || data?.companyId || "",
    name: data?.name || "",
    discountValue: data?.discountValue || null,
    type: data?.type || "",
    minimumPurchaseAmount: data?.minimumPurchaseAmount || null,
    singleTimeUse: data?.singleTimeUse || false,
    redemptionPoints: data?.redemptionPoints || null,
    usageLimit: data?.usageLimit || null,
    campaignExpiryDate: data?.campaignExpiryDate || null,
    campaignLaunchDate: data?.campaignLaunchDate || null,
    description: data?.description || "",
    isActive: data?.isActive || true,
  };

  const handleSubmit = async (values: LoyaltyFormValues, { resetForm }: FormikHelpers<LoyaltyFormValues>) => {
    const { _submitAction, ...rest } = values;
    const payload = { ...rest };

    const handleSuccess = () => {
      if (_submitAction === "saveAndNew") resetForm();
      else navigate(-1);
    };
    if (isEditing) {
      const changedFields = GetChangedFields(payload, data);
      await editLoyalty({ ...changedFields, loyaltyId: data._id }, { onSuccess: handleSuccess });
    } else {
      await addLoyalty(RemoveEmptyFields(payload), { onSuccess: handleSuccess });
    }
  };

  useEffect(() => {
    const hasAccess = isEditing ? permission.edit : permission.add;
    if (!hasAccess) navigate(-1);
  }, [isEditing, permission, navigate]);
  return (
    <>
      <CommonBreadcrumbs title={PAGE_TITLE.CRM.LOYALTY[pageMode]} maxItems={3} breadcrumbs={BREADCRUMBS.LOYALTY[pageMode]} />
      <Box sx={{ p: { xs: 2, md: 3 }, mb: { xs: 17, md: 8 } }}>
        <Formik<LoyaltyFormValues> enableReinitialize initialValues={initialValues} validationSchema={LoyaltyFormSchema} onSubmit={handleSubmit}>
          {({ resetForm, setFieldValue, dirty }) => (
            <Form noValidate>
              <Grid container spacing={2}>
                <CommonCard hideDivider grid={{ xs: 12 }}>
                  <Grid container spacing={2} sx={{ p: 2 }}>
                    <CommonValidationSelect name="companyId" label="Company Name" required isLoading={companyDataLoading} options={GenerateOptions(companyData?.data)} grid={{ xs: 12, md: 4 }} />
                    <CommonValidationTextField name="name" label="Campaign Name" grid={{ xs: 12, md: 4 }} required />
                    <CommonValidationTextField name="discountValue" label="Discount Value" type="number" grid={{ xs: 12, md: 4 }} required />
                    <CommonValidationSelect name="type" label="Type" options={LOYALTY_TYPE} grid={{ xs: 12, md: 4 }} required />
                    <CommonValidationTextField name="minimumPurchaseAmount" label="Minimum Purchase Amount" type="number" grid={{ xs: 12, md: 4 }} required />
                    <CommonValidationTextField name="redemptionPoints" label="Redemption Points" type="number" grid={{ xs: 12, md: 4 }} required />
                    <CommonValidationTextField name="usageLimit" label="Usage Limit" type="number" grid={{ xs: 12, md: 4 }} required />
                    <CommonValidationDatePicker name="campaignExpiryDate" label="Campaign Expiry Date" grid={{ xs: 12, md: 4 }} required />
                    <CommonValidationDatePicker name="campaignLaunchDate" label="Campaign Launch Date" grid={{ xs: 12, md: 4 }} required />
                    <CommonValidationTextField name="description" label="Description" multiline grid={{ xs: 12 }} rows={3} />
                    <CommonValidationSwitch name="singleTimeUse" label="Single Time Use" grid={"auto"} />
                    {!isEditing && <CommonValidationSwitch name="isActive" label="Is Active" grid={"auto"} />}
                  </Grid>
                </CommonCard>

                <CommonBottomActionBar save={isEditing} clear={!isEditing} disabled={!dirty} isLoading={isEditLoading || isAddLoading} onClear={() => resetForm({ values: initialValues })} onSave={() => setFieldValue("_submitAction", "save")} onSaveAndNew={() => setFieldValue("_submitAction", "saveAndNew")} />
              </Grid>
            </Form>
          )}
        </Formik>
      </Box>
    </>
  );
};

export default LoyaltyForm;
