import { Box, Grid } from "@mui/material";
import { Form, Formik, type FormikHelpers } from "formik";
import { useLocation, useNavigate } from "react-router-dom";
import { Mutations } from "../../Api";
import { CommonValidationSwitch, CommonValidationTextField } from "../../Attribute";
import { CommonBottomActionBar, CommonBreadcrumbs, CommonCard } from "../../Components/Common";
import { PAGE_TITLE } from "../../Constants";
import { BREADCRUMBS } from "../../Data";
import type { ModuleFormValues } from "../../Types";
import { GetChangedFields, RemoveEmptyFields } from "../../Utils";
import { ModuleFormSchema } from "../../Utils/ValidationSchemas";
import { CommonValidationCheckbox } from "../../Attribute/FormFields/CommonCheckbox";

const ModuleForm = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { data } = location.state || {};

  const { mutate: addUser, isPending: isAddLoading } = Mutations.useAddUser();
  const { mutate: editUser, isPending: isEditLoading } = Mutations.useEditUser();

  const isEditing = Boolean(data?._id);
  const pageMode = isEditing ? "EDIT" : "ADD";

  const initialValues: ModuleFormValues = {
    tabName: data?.tabName || "",
    displayName: data?.displayName || "",
    tabUrl: data?.tabUrl || "",
    number: data?.number || "",
    hasDefault: data?.hasDefault ?? true,
    hasAdd: data?.hasAdd ?? true,
    hasEdit: data?.hasEdit ?? true,
    hasView: data?.hasView ?? true,
    hasDelete: data?.hasDelete ?? true,
    isActive: data?.isActive ?? true,
  };

  const handleSubmit = async (values: ModuleFormValues, { resetForm }: FormikHelpers<ModuleFormValues>) => {
    const { _submitAction, ...rest } = values;
    const payload = { ...rest };

    const handleSuccess = () => {
      if (_submitAction === "saveAndNew") resetForm();
      else navigate(-1);
    };
    if (isEditing) {
      const changedFields = GetChangedFields(payload, data);
      await editUser({ ...changedFields, userId: data._id }, { onSuccess: handleSuccess });
    } else {
      await addUser(RemoveEmptyFields(payload), { onSuccess: handleSuccess });
    }
  };

  return (
    <>
      <CommonBreadcrumbs title={PAGE_TITLE.MODULE[pageMode]} maxItems={4} breadcrumbs={BREADCRUMBS.MODULE[pageMode]} />
      <Box sx={{ p: { xs: 2, md: 4 }, mb: 8 }}>
        <Formik<ModuleFormValues> enableReinitialize initialValues={initialValues} validationSchema={ModuleFormSchema} onSubmit={handleSubmit}>
          {({ resetForm, setFieldValue, dirty }) => (
            <Form noValidate>
              <Grid container spacing={2}>
                <CommonCard hideDivider>
                  <Grid container spacing={2} sx={{ p: 2 }}>
                    <CommonValidationTextField name="tabName" label="Tab Name" grid={{ xs: 12, md: 3 }} required />
                    <CommonValidationTextField name="displayName" label="Display Name" grid={{ xs: 12, md: 3 }} required />
                    <CommonValidationTextField name="tabUrl" label="Tab URL" grid={{ xs: 12, md: 3 }} required />
                    <CommonValidationTextField name="number" label="Number" grid={{ xs: 12, md: 3 }} required />
                    <CommonValidationSwitch name="hasDefault" label="Default" grid={{ xs: 12, md: 2 }} />
                    <CommonValidationSwitch name="hasAdd" label="Add" grid={{ xs: 12, md: 2 }} />
                    <CommonValidationSwitch name="hasEdit" label="Edit" grid={{ xs: 12, md: 2 }} />
                    <CommonValidationSwitch name="hasView" label="View" grid={{ xs: 12, md: 2 }} />
                    <CommonValidationSwitch name="hasDelete" label="Delete" grid={{ xs: 12, md: 2 }} />
                    <CommonValidationCheckbox name="termsAccepted" />

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

export default ModuleForm;
