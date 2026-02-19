import { Box, Grid } from "@mui/material";
import { Form, Formik, type FormikHelpers } from "formik";
import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Mutations, Queries } from "../../../Api";
import { CommonValidationDatePicker, CommonValidationSelect, CommonValidationSwitch, CommonValidationTextField } from "../../../Attribute";
import { CommonBottomActionBar, CommonBreadcrumbs, CommonCard } from "../../../Components/Common";
import { PAGE_TITLE } from "../../../Constants";
import { BREADCRUMBS, COUPON_DISCOUNT_TYPE, COUPON_STATUS } from "../../../Data";
// import { useAppSelector } from "../../../Store/hooks";
import type { CouponFormValues } from "../../../Types";
import { DateConfig, GenerateOptions, GetChangedFields, RemoveEmptyFields } from "../../../Utils";
import { usePagePermission } from "../../../Utils/Hooks";
import { CouponFormSchema } from "../../../Utils/ValidationSchemas";

const CouponForm = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { data } = location.state || {};
  // const { company } = useAppSelector((state) => state.company);
  const permission = usePagePermission(PAGE_TITLE.CRM.COUPON.BASE);

  const { data: companyData, isLoading: companyDataLoading } = Queries.useGetCompanyDropdown();
  const { mutate: addCoupon, isPending: isAddLoading } = Mutations.useAddCoupon();
  const { mutate: editCoupon, isPending: isEditLoading } = Mutations.useEditCoupon();

  const isEditing = Boolean(data?._id);
  const pageMode = isEditing ? "EDIT" : "ADD";

  const initialValues: CouponFormValues = {
    companyId: data?.companyId?._id || data?.companyId || "",
    name: data?.name || "",
    couponPrice: data?.couponPrice || null,
    redeemValue: data?.redeemValue || null,
    usageLimit: data?.usageLimit || null,
    expiryDays: data?.expiryDays || null,
    startDate: data?.startDate || DateConfig.utc().toISOString(),
    endDate: data?.endDate || null,
    redemptionType: data?.redemptionType || "",
    singleTimeUse: data?.singleTimeUse || false,
    status: data?.status || "",
    isActive: data?.isActive || true,
  };

  const handleSubmit = async (values: CouponFormValues, { resetForm }: FormikHelpers<CouponFormValues>) => {
    const { _submitAction, ...rest } = values;
    const payload = { ...rest };

    const handleSuccess = () => {
      if (_submitAction === "saveAndNew") resetForm();
      else navigate(-1);
    };
    if (isEditing) {
      const changedFields = GetChangedFields(payload, data);
      await editCoupon({ ...changedFields, couponId: data._id }, { onSuccess: handleSuccess });
    } else {
      await addCoupon(RemoveEmptyFields(payload), { onSuccess: handleSuccess });
    }
  };

  useEffect(() => {
    const hasAccess = isEditing ? permission.edit : permission.add;
    if (!hasAccess) navigate(-1);
  }, [isEditing, permission, navigate]);
  return (
    <>
      <CommonBreadcrumbs title={PAGE_TITLE.CRM.COUPON[pageMode]} maxItems={3} breadcrumbs={BREADCRUMBS.COUPON[pageMode]} />
      <Box sx={{ p: { xs: 2, md: 3 }, mb: { xs: 17, md: 8 } }}>
        <Formik<CouponFormValues> enableReinitialize initialValues={initialValues} validationSchema={CouponFormSchema} onSubmit={handleSubmit}>
          {({ resetForm, setFieldValue, dirty }) => (
            <Form noValidate>
              <Grid container spacing={2}>
                {/* BASIC DETAILS */}
                <CommonCard hideDivider grid={{ xs: 12 }}>
                  <Grid container spacing={2} sx={{ p: 2 }}>
                    <CommonValidationSelect name="companyId" label="Company Name" required isLoading={companyDataLoading} options={GenerateOptions(companyData?.data)} grid={{ xs: 12, md: 4 }} />
                    <CommonValidationTextField name="name" label="Coupon Name" grid={{ xs: 12, md: 4 }} required />
                    <CommonValidationTextField name="couponPrice" label="Coupon Price" type="number" grid={{ xs: 12, md: 4 }} required />
                    <CommonValidationSelect name="redemptionType" label="Redemption Type" options={COUPON_DISCOUNT_TYPE.map((item) => ({ label: item, value: item }))} grid={{ xs: 12, md: 4 }} required />
                    <CommonValidationTextField name="redeemValue" label="Redeem Value" type="number" grid={{ xs: 12, md: 4 }} required />
                    <CommonValidationTextField name="usageLimit" label="Usage Limit" type="number" grid={{ xs: 12, md: 4 }} required />
                    <CommonValidationTextField name="expiryDays" label="Expiry Days" type="number" grid={{ xs: 12, md: 4 }} required />
                    <CommonValidationDatePicker name="startDate" label="Start Date" grid={{ xs: 12, md: 4 }} required />
                    <CommonValidationDatePicker name="endDate" label="End Date" grid={{ xs: 12, md: 4 }} required />
                    <CommonValidationSelect name="status" label="Status" options={COUPON_STATUS.map((item) => ({ label: item, value: item }))} grid={{ xs: 12, md: 4 }} required />
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

export default CouponForm;
