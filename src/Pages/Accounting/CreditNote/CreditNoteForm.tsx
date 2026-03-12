import { Box, Grid } from "@mui/material";
import { Form, Formik, useFormikContext, type FormikHelpers, type FormikValues } from "formik";
import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Mutations, Queries } from "../../../Api";
import { CommonPhoneNumber, CommonValidationDatePicker, CommonValidationSelect, CommonValidationSwitch, CommonValidationTextField } from "../../../Attribute";
import { CommonBottomActionBar, CommonBreadcrumbs, CommonCard, DependentSelect } from "../../../Components/Common";
import { PAGE_TITLE } from "../../../Constants";
import { BREADCRUMBS } from "../../../Data";
import type { CreditNoteFormValues, ImageSyncProps } from "../../../Types";
import { CreditNoteFormSchema, DateConfig, GenerateOptions, GetChangedFields, RemoveEmptyFields } from "../../../Utils";
import { usePagePermission } from "../../../Utils/Hooks";
import { useAppDispatch, useAppSelector } from "../../../Store/hooks";
import { CommonFormImageBox } from "../../../Components/Common/CommonUploadImage/CommonImageBox";
import { setSelectedFiles, setUploadModal } from "../../../Store/Slices/ModalSlice";

const CreditNoteForm = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { data } = location.state || {};
  const permission = usePagePermission(PAGE_TITLE.CREDIT_NOTE.BASE);

  const [activeImageKey, setActiveImageKey] = useState<"image" | null>(null);
  const dispatch = useAppDispatch();
  const { data: companyData, isLoading: companyLoading } = Queries.useGetCompanyDropdown();
  const { mutate: addCreditNote, isPending: isAddLoading } = Mutations.useAddCreditNote();
  const { mutate: editCreditNote, isPending: isEditLoading } = Mutations.useEditCreditNote();

  const isEditing = Boolean(data?._id);
  const pageMode = isEditing ? "EDIT" : "ADD";

  const initialValues: CreditNoteFormValues = {
    companyId: data?.companyId?._id || "",
    type: data?.type || "payin",
    date: data?.date || DateConfig.utc().toISOString(),
    bankAccountId: data?.bankAccountId?._id || "",
    amount: data?.amount || "",
    description: data?.description || "",
    phoneNo: {
      countryCode: data?.phoneNo?.countryCode || "",
      phoneNo: data?.phoneNo?.phoneNo || "",
    },
    isActive: data?.isActive ?? true,
  };

  const FormikImageSync = <T extends FormikValues>({ activeKey, clearActiveKey }: ImageSyncProps) => {
    const { selectedFiles } = useAppSelector((state) => state.modal);
    const dispatch = useAppDispatch();
    const { setFieldValue } = useFormikContext<T>();

    useEffect(() => {
      if (!selectedFiles[0] || !activeKey) return;

      setFieldValue(activeKey, selectedFiles[0]);

      dispatch(setSelectedFiles([]));
      clearActiveKey();
    }, [selectedFiles, activeKey, setFieldValue, dispatch, clearActiveKey]);

    return null;
  };
  const handleUpload = () => {
    setActiveImageKey("image");
    dispatch(setUploadModal({ open: true, type: "image" }));
  };

  const handleSubmit = async (values: CreditNoteFormValues, { resetForm }: FormikHelpers<CreditNoteFormValues>) => {
    const { _submitAction, ...rest } = values;
    const payload = { ...rest };

    const handleSuccess = () => {
      if (_submitAction === "saveAndNew") resetForm();
      else navigate(-1);
    };

    if (isEditing) {
      const changedFields = GetChangedFields(payload, data);
      await editCreditNote({ ...changedFields, creditNoteId: data._id }, { onSuccess: handleSuccess });
    } else {
      await addCreditNote(RemoveEmptyFields(payload), { onSuccess: handleSuccess });
    }
  };

  useEffect(() => {
    const hasAccess = isEditing ? permission.edit : permission.add;
    if (!hasAccess) navigate(-1);
  }, [isEditing, permission, navigate]);

  return (
    <>
      <CommonBreadcrumbs title={PAGE_TITLE.CREDIT_NOTE[pageMode]} maxItems={3} breadcrumbs={BREADCRUMBS.CREDIT_NOTE[pageMode]} />

      <Box sx={{ p: { xs: 2, md: 3 }, mb: 8 }}>
        <Formik<CreditNoteFormValues> enableReinitialize initialValues={initialValues} validationSchema={CreditNoteFormSchema} onSubmit={handleSubmit}>
          {({ resetForm, setFieldValue, dirty, values }) => (
            <Form noValidate>
              <FormikImageSync activeKey={activeImageKey} clearActiveKey={() => setActiveImageKey(null)} />
              <Grid container spacing={2}>
                <CommonCard hideDivider grid={{ xs: 12 }}>
                  <Grid container spacing={2} sx={{ p: 2 }}>
                    <CommonValidationSelect name="companyId" label="Company" options={GenerateOptions(companyData?.data)} isLoading={companyLoading} grid={{ xs: 12, md: 4 }} required />
                    <DependentSelect name="bankAccountId" label="Bank Account" query={Queries.useGetBankDropdown} params={{ companyFilter: values.companyId }} enabled={Boolean(values.companyId)} disabled={!values.companyId} required grid={{ xs: 12, md: 4 }} />
                    <CommonValidationDatePicker name="date" label="Date" grid={{ xs: 12, md: 4 }} required />
                    <CommonValidationTextField name="amount" label="Amount" type="number" grid={{ xs: 12, md: 4 }} required />
                    <CommonPhoneNumber label="Phone No." countryCodeName="phoneNo.countryCode" numberName="phoneNo.phoneNo" grid={{ xs: 12, md: 4 }} required />
                    <CommonValidationTextField name="description" label="Description" grid={{ xs: 12, md: 8 }} multiline />
                    <CommonFormImageBox name="image" label="Image" type="image" grid={{ xs: 12 }} onUpload={handleUpload} onDelete={() => setFieldValue("image", null)} />
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

export default CreditNoteForm;
