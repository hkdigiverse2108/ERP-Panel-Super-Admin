import { Box, Grid } from "@mui/material";
import { Form, Formik, type FormikHelpers } from "formik";
import { useLocation, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { Mutations, Queries } from "../../../Api";
import { PAGE_TITLE } from "../../../Constants";
import { usePagePermission } from "../../../Utils/Hooks";
import type { PosPaymentFormValues } from "../../../Types";
import { GetChangedFields, RemoveEmptyFields, GenerateOptions } from "../../../Utils";
import { CommonValidationRadio, CommonValidationSelect, CommonValidationTextField, CommonValidationDatePicker, CommonValidationSwitch } from "../../../Attribute";
import { CommonBreadcrumbs, CommonCard, CommonBottomActionBar, DependentSelect, CommonStatsCard } from "../../../Components/Common";
import { BREADCRUMBS, POS_PAYMENT_MODE } from "../../../Data";

const PaymentForm = () => {
  const { data: companyData, isLoading: companyDataLoading } = Queries.useGetCompanyDropdown();
  const location = useLocation();
  const navigate = useNavigate();
  const { data } = location.state || {}; // data passed via navigation
  const permission = usePagePermission(PAGE_TITLE.PAYMENT.BASE);

  const { mutate: addPayment, isPending: isAddLoading } = Mutations.useAddPosPayment();
  const { mutate: editPayment, isPending: isEditLoading } = Mutations.useEditPosPayment();

  const isEditing = Boolean(data?._id);
  const pageMode = isEditing ? "EDIT" : "ADD";

  const initialValues: PosPaymentFormValues = {
    companyId: data?.companyId?._id || "",
    paymentNo: data?.paymentNo || "",
    voucherType: data?.voucherType || "receipt", // Default voucher type
    paymentType: data?.paymentType || "on_account",
    partyId: data?.partyId?._id || "",
    bankId: data?.bankId?._id || "",
    posOrderId: data?.posOrderId?._id || "",
    paymentMode: data?.paymentMode || "cash", // Initial topContent value
    paymentDate: data?.paymentDate || null,
    amount: data?.amount || 0,
    isNonGST: data?.isNonGST || false,
    isActive: data?.isActive ?? true,
    accountId: data?.accountId?._id || "",
    remark: data?.remark || "",
  };

  const handleSubmit = async (values: PosPaymentFormValues, { resetForm }: FormikHelpers<PosPaymentFormValues>) => {
    const { _submitAction, ...rest } = values;

    const handleSuccess = () => {
      if (_submitAction === "SAVE_AND_NEW") {
        resetForm();
      } else {
        navigate(-1);
      }
    };

    if (isEditing) {
      const changedFields = GetChangedFields(rest, data);
      await editPayment({ ...changedFields, paymentId: data._id }, { onSuccess: handleSuccess });
    } else {
      await addPayment(RemoveEmptyFields(rest), { onSuccess: handleSuccess });
    }
  };

  const topContent = (
    <CommonValidationRadio
      name="paymentMode"
      options={POS_PAYMENT_MODE.map((opt) => ({
        label: opt,
        value: opt,
        disabled: isEditing && opt !== data?.paymentMode,
      }))}
      grid={{ xs: "auto" }}
    />
  );

  useEffect(() => {
    const hasAccess = isEditing ? permission.edit : permission.add;
    if (!hasAccess) navigate(-1);
  }, [isEditing, permission, navigate]);

  return (
    <>
      <CommonBreadcrumbs title={PAGE_TITLE.CONTACT[pageMode]} maxItems={3} breadcrumbs={BREADCRUMBS.CONTACT[pageMode]} />
      <Box sx={{ p: { xs: 2, md: 3 }, mb: 8 }}>
        <Formik initialValues={initialValues} onSubmit={handleSubmit}>
          {({ resetForm, setFieldValue, dirty, values }) => (
            <Form noValidate>
              <Grid container spacing={2}>
                {/* PAYMENT TYPE CARDS */}
                <Grid size={{ xs: 12 }}>
                  <CommonStatsCard
                    variant="radio"
                    grid={{ xs: 12, md: 4 }}
                    stats={[
                      { value: "On Account", label: "", desc: "Upfront Payment", selected: values.paymentType === "on_account", onClick: () => setFieldValue("paymentType", "on_account") },
                      { value: "Advance Payment", label: "", desc: "Will be offset by upcoming bills", selected: values.paymentType === "advance_payment", onClick: () => setFieldValue("paymentType", "advance_payment") },
                      { value: "Against Voucher", label: "", desc: "Make Payment Against Voucher", selected: values.paymentType === "against_voucher", onClick: () => setFieldValue("paymentType", "against_voucher") },
                    ]}
                  />
                </Grid>

                {/* GENERAL DETAILS */}
                <CommonCard topContent={topContent} title="Payment Details" grid={{ xs: 12 }}>
                  <Grid container spacing={2} sx={{ p: 2 }}>
                    <CommonValidationSelect name="companyId" label="Company Name" required isLoading={companyDataLoading} options={GenerateOptions(companyData?.data)} grid={{ xs: 12, md: 4 }} />
                    <DependentSelect params={{ companyId: values?.companyId }} name="accountId" label="Cash / Account" grid={{ xs: 12, md: 4 }} query={Queries.useGetAccountDropdown} disabled={!values?.companyId} required />
                    <DependentSelect params={{ companyId: values?.companyId }} name="partyId" label="Party" grid={{ xs: 12, md: 4 }} query={Queries.useGetContactDropdown} disabled={!values?.companyId} required />
                    <CommonValidationDatePicker name="paymentDate" label="Payment Date" required grid={{ xs: 12, md: 4 }} />
                    <CommonValidationTextField name="amount" label="Amount" type="number" required isCurrency currencyDisabled grid={{ xs: 12, md: 4 }} />
                    <CommonValidationTextField name="remark" label="Description" multiline grid={{ xs: 12, md: 8 }} />
                  </Grid>
                </CommonCard>

                {!isEditing && <CommonValidationSwitch name="isActive" label="Is Active" grid={{ xs: 12 }} />}

                <CommonBottomActionBar
                  save={isEditing}
                  clear={!isEditing}
                  disabled={!dirty}
                  isLoading={isAddLoading || isEditLoading}
                  onClear={() => resetForm({ values: initialValues })}
                  onSave={() => {
                    setFieldValue("_submitAction", "save");
                  }}
                  onSaveAndNew={() => {
                    setFieldValue("_submitAction", "saveAndNew");
                  }}
                />
              </Grid>
            </Form>
          )}
        </Formik>
      </Box>
    </>
  );
};

export default PaymentForm;
