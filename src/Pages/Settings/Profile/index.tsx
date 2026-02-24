import { Box, Grid } from "@mui/material";
import { Form, Formik, type FormikHelpers } from "formik";
import { Mutations } from "../../../Api";
import { CommonPhoneNumber, CommonValidationTextField } from "../../../Attribute";
import { CommonBottomActionBar, CommonBreadcrumbs, CommonCard } from "../../../Components/Common";
import { PAGE_TITLE } from "../../../Constants";
import { BREADCRUMBS } from "../../../Data";
import { useAppDispatch, useAppSelector } from "../../../Store/hooks";
import { setUser } from "../../../Store/Slices/AuthSlice";
import type { EmployeeFormValues } from "../../../Types";
import { GetChangedFields } from "../../../Utils";
import { ProfileSchema } from "../../../Utils/ValidationSchemas";

const Profile = () => {
  const dispatch = useAppDispatch();
  const { user: UserData } = useAppSelector((state) => state.auth);
  const { mutate: editEmployee, isPending: isEditLoading } = Mutations.useEditUser();

  const initialValues: EmployeeFormValues = {
    fullName: UserData?.fullName || "",
    username: UserData?.username || "",
    phoneNo: {
      countryCode: UserData?.phoneNo?.countryCode || "",
      phoneNo: UserData?.phoneNo?.phoneNo || "",
    },
    email: UserData?.email || "",
  };

  const handleSubmit = async (values: EmployeeFormValues, { resetForm }: FormikHelpers<EmployeeFormValues>) => {
    const { ...rest } = values;
    const payload = { ...rest, companyId: UserData?.companyId?._id };

    const changedFields = GetChangedFields(payload, UserData);
    await editEmployee(
      { ...changedFields, userId: UserData?._id },
      {
        onSuccess: (response) => {
          dispatch(setUser(response?.data));
          resetForm();
        },
      },
    );
  };

  return (
    <>
      <CommonBreadcrumbs title={PAGE_TITLE.SETTINGS.PROFILE.BASE} maxItems={3} breadcrumbs={BREADCRUMBS.SETTINGS.PROFILE} />
      <Box sx={{ p: { xs: 2, md: 3 }, mb: 8 }}>
        <Formik<EmployeeFormValues> enableReinitialize initialValues={initialValues} validationSchema={ProfileSchema} onSubmit={handleSubmit}>
          {({ dirty }) => (
            <Form noValidate>
              <Grid container spacing={2}>
                {/* BASIC DETAILS */}
                <CommonCard title="Profile Details" grid={{ xs: 12 }}>
                  <Grid container spacing={2} sx={{ p: 2 }}>
                    <CommonValidationTextField name="fullName" label="Full Name" required grid={{ xs: 12, md: 6 }} />
                    <CommonValidationTextField name="username" label="User Name" required grid={{ xs: 12, md: 6 }} />
                    <CommonPhoneNumber label="Phone No." countryCodeName="phoneNo.countryCode" numberName="phoneNo.phoneNo" grid={{ xs: 12, md: 6 }} required />
                    <CommonValidationTextField name="email" label="Email" grid={{ xs: 12, md: 6 }} />
                  </Grid>
                </CommonCard>
                <CommonBottomActionBar save disabled={!dirty} isLoading={isEditLoading} />
              </Grid>
            </Form>
          )}
        </Formik>
      </Box>
    </>
  );
};

export default Profile;
