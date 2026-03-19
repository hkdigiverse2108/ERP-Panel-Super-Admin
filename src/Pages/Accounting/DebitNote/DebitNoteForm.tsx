import { Box, Grid } from "@mui/material";
import { Form, Formik, useFormikContext, type FormikHelpers, type FormikValues } from "formik";
import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Mutations, Queries } from "../../../Api";
import { CommonPhoneNumber, CommonValidationDatePicker, CommonValidationSelect, CommonValidationSwitch, CommonValidationTextField } from "../../../Attribute";
import { CommonBottomActionBar, CommonBreadcrumbs, CommonCard, DependentSelect } from "../../../Components/Common";
import { PAGE_TITLE } from "../../../Constants";
import { BREADCRUMBS } from "../../../Data";
import type { DebitNoteFormValues, ImageSyncProps } from "../../../Types";
import { DateConfig, GenerateOptions, GetChangedFields, RemoveEmptyFields } from "../../../Utils";
import { usePagePermission } from "../../../Utils/Hooks";
import { DebitNoteFormSchema } from "../../../Utils/ValidationSchemas";
import { CommonFormImageBox } from "../../../Components/Common/CommonUploadImage/CommonImageBox";
import { useAppDispatch, useAppSelector } from "../../../Store/hooks";
import { setSelectedFiles, setUploadModal } from "../../../Store/Slices/ModalSlice";

const DebitNoteForm = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { data } = location.state || {};
  const permission = usePagePermission(PAGE_TITLE.DEBIT_NOTE.BASE);
  const [activeImageKey, setActiveImageKey] = useState<"image" | null>(null);
  const dispatch = useAppDispatch();
  const { data: companyData, isLoading: companyLoading } = Queries.useGetCompanyDropdown();
  const { mutate: addDebitNote, isPending: isAddLoading } = Mutations.useAddDebitNote();
  const { mutate: editDebitNote, isPending: isEditLoading } = Mutations.useEditDebitNote();

  const isEditing = Boolean(data?._id);
  const pageMode = isEditing ? "EDIT" : "ADD";

  const initialValues: DebitNoteFormValues = {
    type: data?.type || "receiver",
    companyId: data?.companyId?._id || "",
    personName: data?.personName || "",
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
          {({ resetForm, setFieldValue, dirty, values }) => (
            <Form noValidate>
              <FormikImageSync activeKey={activeImageKey} clearActiveKey={() => setActiveImageKey(null)} />
              <Grid container spacing={2}>
                <CommonCard hideDivider grid={{ xs: 12 }}>
                  <Grid container spacing={2} sx={{ p: 2 }}>
                    <CommonValidationSelect name="companyId" label="Company" options={GenerateOptions(companyData?.data)} isLoading={companyLoading} grid={{ xs: 12, md: 4 }} required />
                    <CommonValidationTextField name="personName" label="Person Name"  grid={{ xs: 12, md: 4 }} />
                    <DependentSelect name="bankAccountId" label="Bank Account" query={Queries.useGetBankDropdown} params={{ companyFilter: values.companyId }} enabled={Boolean(values.companyId)} disabled={!values.companyId} required grid={{ xs: 12, md: 4 }} />
                    <CommonValidationDatePicker name="date" label="Date" grid={{ xs: 12, md: 4 }} required />
                    <CommonValidationTextField name="amount" label="Amount" type="number" grid={{ xs: 12, md: 4 }} required />
                    <CommonPhoneNumber label="Phone No." countryCodeName="phoneNo.countryCode" numberName="phoneNo.phoneNo" grid={{ xs: 12, md: 4 }} required />
                    <CommonValidationTextField name="description" label="Description" grid={{ xs: 12, md: 4 }} multiline />
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

export default DebitNoteForm;
