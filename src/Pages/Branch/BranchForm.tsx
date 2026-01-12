import { Box, Grid } from "@mui/material";
import { Form, Formik, type FormikHelpers } from "formik";
import { useLocation, useNavigate } from "react-router-dom";
import { Mutations } from "../../Api";
import { CommonValidationTextField, CommonValidationSwitch } from "../../Attribute";
import { CommonBottomActionBar, CommonBreadcrumbs, CommonCard } from "../../Components/Common";
import { PAGE_TITLE } from "../../Constants";
import { BREADCRUMBS } from "../../Data";
import type { BranchFormValues } from "../../Types";
import { GetChangedFields, RemoveEmptyFields } from "../../Utils";
import { BranchFormSchema } from "../../Utils/ValidationSchemas";

const BranchForm = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { data } = location.state || {};

  const { mutate: addBranch, isPending: isAddLoading } = Mutations.useAddBranch();
  const { mutate: editBranch, isPending: isEditLoading } = Mutations.useEditBranch();

  const isEditing = Boolean(data?._id);
  const pageMode = isEditing ? "EDIT" : "ADD";

  const initialValues: BranchFormValues = {
    name: data?.name || "",
    address: data?.address || "",
    phoneNo: data?.phoneNo || "",
    isActive: data?.isActive ?? true,
    _submitAction: "save",
  };

  const handleSubmit = async (values: BranchFormValues, { resetForm }: FormikHelpers<BranchFormValues>) => {
    const { _submitAction, ...rest } = values;
    const payload = RemoveEmptyFields(rest);


    const onSuccess = () => {
      if (_submitAction === "saveAndNew") {
        resetForm({ values: initialValues });
      } else {
        navigate(-1);
      }
    };

    if (isEditing) {
      const changedFields = GetChangedFields(payload, data);
      editBranch({ ...changedFields, branchId: data._id }, { onSuccess });
    } else {
      addBranch(payload, { onSuccess });
    }
  };

  return (
    <>
      <CommonBreadcrumbs title={PAGE_TITLE.BRANCH[pageMode]} maxItems={3} breadcrumbs={BREADCRUMBS.BRANCH[pageMode]} />

      <Box sx={{ p: { xs: 2, md: 3 }, mb: 8 }}>
        <Formik enableReinitialize initialValues={initialValues} validationSchema={BranchFormSchema} onSubmit={handleSubmit}>
          {({ resetForm, setFieldValue, dirty, submitForm }) => (
            <Form noValidate>
              <Grid container spacing={2}>
                <CommonCard hideDivider grid={{ xs: 12 }}>
                  <Grid container spacing={2} sx={{ p: 2 }}>
                    <CommonValidationTextField name="name" label="Branch Name" required grid={{ xs: 12 }} />
                    <CommonValidationTextField name="address" label="Branch Address" required grid={{ xs: 12 }} />
                    <CommonValidationTextField name="phoneNo" label="Branch Phone No." required grid={{ xs: 12 }} />
                    {!isEditing && <CommonValidationSwitch name="isActive" label="Is Active" grid={{ xs: 12 }} />}
                  </Grid>

                  <CommonBottomActionBar
                    save={isEditing}
                    clear={!isEditing}
                    disabled={!dirty}
                    isLoading={isEditLoading || isAddLoading}
                    onClear={() => resetForm({ values: initialValues })}
                    onSave={() => {
                      setFieldValue("_submitAction", "save");
                      submitForm();
                    }}
                    onSaveAndNew={() => {
                      setFieldValue("_submitAction", "saveAndNew");
                      submitForm();
                    }}
                  />
                </CommonCard>
              </Grid>
            </Form>
          )}
        </Formik>
      </Box>
    </>
  );
};

export default BranchForm;
