import { Box, Grid } from "@mui/material";
import { Form, Formik, type FormikHelpers } from "formik";
import { useLocation, useNavigate } from "react-router-dom";
import { Mutations, Queries } from "../../Api";
import { CommonPhoneNumber, CommonValidationSelect, CommonValidationSwitch, CommonValidationTextField } from "../../Attribute";
import { CommonBottomActionBar, CommonBreadcrumbs, CommonCard, DependentSelect } from "../../Components/Common";
import { PAGE_TITLE } from "../../Constants";
import { BREADCRUMBS, USER_TYPE } from "../../Data";
import type { UserFormValues } from "../../Types";
import { GenerateOptions, GetChangedFields, RemoveEmptyFields } from "../../Utils";
import { UserFormSchema } from "../../Utils/ValidationSchemas";

const ModuleForm = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { data } = location.state || {};

  const { data: companyData, isLoading: companyDataLoading } = Queries.useGetCompanyDropdown();
  const { mutate: addUser, isPending: isAddLoading } = Mutations.useAddUser();
  const { mutate: editUser, isPending: isEditLoading } = Mutations.useEditUser();

  const isEditing = Boolean(data?._id);
  const pageMode = isEditing ? "EDIT" : "ADD";

  const initialValues: UserFormValues = {
    fullName: data?.fullName || "",
    username: data?.username || "",
    designation: data?.designation || "",
    phoneNo: {
      countryCode: data?.phoneNo?.countryCode || "",
      phoneNo: data?.phoneNo?.phoneNo || "",
    },
    email: data?.email || "",
    panNumber: data?.panNumber || "",
    role: data?.role?._id || "",
    branchId: data?.branchId?._id || "",
    companyId: data?.companyId?._id || "",
    password: data?.showPassword || "",
    userType: data?.userType || "admin",
    address: {
      address: data?.address?.address || "",
      country: data?.address?.country?._id || "",
      state: data?.address?.state?._id || "",
      city: data?.address?.city?._id || "",
      pinCode: data?.address?.pinCode || null,
    },

    bankDetails: {
      name: data?.bankDetails?.name || "",
      branchName: data?.bankDetails?.branchName || "",
      accountNumber: data?.bankDetails?.accountNumber || null,
      bankHolderName: data?.bankDetails?.bankHolderName || "",
      swiftCode: data?.bankDetails?.swiftCode || "",
      IFSCCode: data?.bankDetails?.IFSCCode || "",
    },

    wages: data?.wages || null,
    commission: data?.commission || null,
    extraWages: data?.extraWages || null,
    target: data?.target || null,
    isActive: data?.isActive ?? true,
  };

  const handleSubmit = async (values: UserFormValues, { resetForm }: FormikHelpers<UserFormValues>) => {
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
        <Formik<UserFormValues> enableReinitialize initialValues={initialValues} validationSchema={UserFormSchema} onSubmit={handleSubmit}>
          {({ resetForm, setFieldValue, dirty }) => (
            <Form noValidate>
              <Grid container spacing={2}>
                <CommonCard hideDivider>
                  <Grid container spacing={2} sx={{ p: 2 }}>
                    <CommonValidationTextField name="tabName" label="Tab Name" required grid={{ xs: 12, md: 4 }} />
                    <CommonValidationTextField name="email" label="Email" grid={{ xs: 12, md: 4 }} />
                  </Grid>
                </CommonCard>

                {!isEditing && <CommonValidationSwitch name="isActive" label="Is Active" grid={{ xs: 12 }} />}

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
