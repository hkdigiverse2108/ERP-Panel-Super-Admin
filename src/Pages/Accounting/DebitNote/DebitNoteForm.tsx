import { Box, Grid } from "@mui/material";
import { Form, Formik, type FormikHelpers } from "formik";
import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Mutations, Queries } from "../../../Api";
import { CommonValidationDatePicker, CommonValidationSelect, CommonValidationSwitch, CommonValidationTextField } from "../../../Attribute";
import { CommonBottomActionBar, CommonBreadcrumbs, CommonCard } from "../../../Components/Common";
import { PAGE_TITLE } from "../../../Constants";
import { BREADCRUMBS } from "../../../Data";
import type { DebitNoteFormValues } from "../../../Types";
import { DateConfig, GenerateOptions, GetChangedFields, RemoveEmptyFields } from "../../../Utils";
import { usePagePermission } from "../../../Utils/Hooks";
import { DebitNoteFormSchema } from "../../../Utils/ValidationSchemas";

const DebitNoteForm = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { data } = location.state || {};
  const permission = usePagePermission(PAGE_TITLE.DEBIT_NOTE.BASE);

  const { data: accountData, isLoading: accountLoading } = Queries.useGetAccountDropdown();
  const { data: companyData, isLoading: companyLoading } = Queries.useGetCompanyDropdown();

  const { mutate: addDebitNote, isPending: isAddLoading } = Mutations.useAddDebitNote();
  const { mutate: editDebitNote, isPending: isEditLoading } = Mutations.useEditDebitNote();

  const isEditing = Boolean(data?._id);
  const pageMode = isEditing ? "EDIT" : "ADD";

  const initialValues: DebitNoteFormValues = {
    companyId: data?.companyId?._id || "",
    voucherNumber: data?.voucherNumber || "",
    date: data?.date || DateConfig.utc().toISOString(),
    fromAccountId: data?.fromAccountId?._id || "",
    toAccountId: data?.toAccountId?._id || "",
    amount: data?.amount || "",
    description: data?.description || "",
    isActive: data?.isActive ?? true,
  };

  const handleSubmit = async (values: DebitNoteFormValues, { resetForm }: FormikHelpers<DebitNoteFormValues>) => {
    const { _submitAction, ...rest } = values;
    const payload = { ...rest };

    const handleSuccess = () => {
      if (_submitAction === "saveAndNew") resetForm();
      else navigate(-1);
    };

    if (isEditing) {
      const changedFields = GetChangedFields(payload, data);
      await editDebitNote({ ...changedFields, debitNoteId: data._id }, { onSuccess: handleSuccess });
    } else {
      await addDebitNote(RemoveEmptyFields(payload), { onSuccess: handleSuccess });
    }
  };

  useEffect(() => {
    const hasAccess = isEditing ? permission.edit : permission.add;
    if (!hasAccess) navigate(-1);
  }, [isEditing, permission, navigate]);

  return (
    <>
      <CommonBreadcrumbs title={PAGE_TITLE.DEBIT_NOTE[pageMode]} maxItems={3} breadcrumbs={BREADCRUMBS.DEBIT_NOTE[pageMode]} />

      <Box sx={{ p: { xs: 2, md: 3 }, mb: 8 }}>
        <Formik<DebitNoteFormValues> enableReinitialize initialValues={initialValues} validationSchema={DebitNoteFormSchema} onSubmit={handleSubmit}>
          {({ resetForm, setFieldValue, dirty }) => (
            <Form noValidate>
              <Grid container spacing={2}>
                <CommonCard hideDivider grid={{ xs: 12 }}>
                  <Grid container spacing={2} sx={{ p: 2 }}>
                    {isEditing && <CommonValidationTextField name="voucherNumber" label="Voucher Number" grid={{ xs: 12, md: 4 }} disabled />}
                    <CommonValidationSelect name="companyId" label="Company" options={GenerateOptions(companyData?.data)} isLoading={companyLoading} grid={{ xs: 12, md: 4 }} required />
                    <CommonValidationDatePicker name="date" label="Date" grid={{ xs: 12, md: 4 }} required />
                    <CommonValidationTextField name="amount" label="Amount" type="number" grid={{ xs: 12, md: 4 }} required />
                    <CommonValidationSelect name="fromAccountId" label="From Account" options={GenerateOptions(accountData?.data)} isLoading={accountLoading} grid={{ xs: 12, md: 4 }} required />
                    <CommonValidationSelect name="toAccountId" label="To Account" options={GenerateOptions(accountData?.data)} isLoading={accountLoading} grid={{ xs: 12, md: 4 }} required />
                    <CommonValidationTextField name="description" label="Description" grid={{ xs: 12 }} multiline rows={4} />
                    {!isEditing && <CommonValidationSwitch name="isActive" label="Is Active" grid={{ xs: 12 }} />}
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

export default DebitNoteForm;
