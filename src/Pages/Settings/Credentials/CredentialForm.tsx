import { Grid } from "@mui/material";
import { Form, Formik, type FormikHelpers } from "formik";
import { useDispatch } from "react-redux";
import { Mutations } from "../../../Api";
import { CommonButton, CommonValidationSwitch, CommonValidationTextField } from "../../../Attribute";
import { CommonModal } from "../../../Components/Common";
import { PAGE_TITLE } from "../../../Constants";
import { useAppSelector } from "../../../Store/hooks";
import { setCredentialsModal } from "../../../Store/Slices/ModalSlice";
import type { CredentialsFormValues } from "../../../Types";
import { GetChangedFields, RemoveEmptyFields } from "../../../Utils";
import { CredentialsFormSchema } from "../../../Utils/ValidationSchemas";

const CredentialForm = () => {
  const { mutate: addCredential, isPending: isAddLoading } = Mutations.useAddCredential();
  const { mutate: editCredential, isPending: isEditLoading } = Mutations.useEditCredential();

  const { isCredentialsModal } = useAppSelector((state) => state.modal);
  const dispatch = useDispatch();

  const isEdit = isCredentialsModal.data;
  const openModal = isCredentialsModal.open;
  const isEditing = Boolean(isEdit?._id);
  const pageMode = isEditing ? "EDIT" : "ADD";

  const initialValues: CredentialsFormValues = {
    projectId: isEdit?.projectId || "",
    publishableKey: isEdit?.publishableKey || "",
    supabaseUrl: isEdit?.supabaseUrl || "",
    isActive: isEdit?.isActive ?? true,
  };

  const closeModal = () => dispatch(setCredentialsModal({ open: false, data: null }));

  const handleSubmit = (values: CredentialsFormValues, { resetForm }: FormikHelpers<CredentialsFormValues>) => {
    const onSuccessHandler = () => {
      resetForm();
      closeModal();
    };

    if (isEditing) {
      const changedFields = GetChangedFields(values, isEdit as Partial<CredentialsFormValues>);
      editCredential({ ...changedFields, credentialId: isEdit?._id as string }, { onSuccess: onSuccessHandler });
    } else {
      addCredential(RemoveEmptyFields(values) as any, { onSuccess: onSuccessHandler });
    }
  };

  return (
    <CommonModal title={PAGE_TITLE.CREDENTIALS[pageMode]} isOpen={openModal} onClose={closeModal} className="max-w-125">
      <Formik<CredentialsFormValues> enableReinitialize initialValues={initialValues} validationSchema={CredentialsFormSchema} onSubmit={handleSubmit}>
        {({ dirty }) => (
          <Form noValidate>
            <Grid container spacing={2} sx={{ p: 1 }}>
              <CommonValidationTextField name="projectId" label="Project ID" required grid={{ xs: 12 }} />
              <CommonValidationTextField name="publishableKey" label="Publishable Key" required grid={{ xs: 12 }} />
              <CommonValidationTextField name="supabaseUrl" label="Supabase URL" required grid={{ xs: 12 }} />

              <CommonValidationSwitch name="isActive" label="Is Active" grid={{ xs: 12 }} />

              <Grid sx={{ display: "flex", gap: 2, ml: "auto", mt: 2 }}>
                <CommonButton variant="outlined" onClick={closeModal} title="Cancel" />
                <CommonButton type="submit" variant="contained" title="Save" loading={isEditLoading || isAddLoading} disabled={!dirty} />
              </Grid>
            </Grid>
          </Form>
        )}
      </Formik>
    </CommonModal>
  );
};

export default CredentialForm;
