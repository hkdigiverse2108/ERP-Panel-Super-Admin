import { Add } from "@mui/icons-material";
import CloseIcon from "@mui/icons-material/Close";
import { Box, Grid } from "@mui/material";
import { FieldArray, Form, Formik, type FormikHelpers } from "formik";
import { Mutations, Queries } from "../../../Api";
import { CommonButton, CommonValidationTextField } from "../../../Attribute";
import { CommonBottomActionBar, CommonBreadcrumbs, CommonCard } from "../../../Components/Common";
import { PAGE_TITLE } from "../../../Constants";
import { BREADCRUMBS } from "../../../Data";
import type { AdminSettingFormValues, AdminSettingLink } from "../../../Types/AdminSetting";
import { EmployeeFormSchema } from "../../../Utils/ValidationSchemas";

const AdminSetting = () => {
  // const navigate = useNavigate();
  // const dispatch = useAppDispatch();

  const { data: adminSettingData, isLoading: adminSettingDataLoading } = Queries.useGetAdminSetting();
  const { mutate: editEmployee, isPending: isEditLoading } = Mutations.useEditUser();

  //   const adminSettingData = adminSettingData?.data?.settingsSchema;

  const initialValues: AdminSettingFormValues = {
    links: [...(adminSettingData?.data?.links?.map((link: AdminSettingLink) => ({ title: link.title, link: link.link, icon: link.icon })) || [{ title: "", link: "", icon: "" }])],
  };

  const handleSubmit = async (values: AdminSettingFormValues, { resetForm }: FormikHelpers<AdminSettingFormValues>) => {
    // const { ...rest } = values;
    // const payload = { ...rest, companyId: UserData?.companyId?._id };
    // const changedFields = GetChangedFields(payload, UserData);
    // await editEmployee(
    //   { ...changedFields, userId: UserData?._id },
    //   {
    //     onSuccess: (response) => {
    //       dispatch(setUser(response?.data));
    //       resetForm();
    //       navigate(-1);
    //     },
    //   },
    // );
  };

  return (
    <>
      <CommonBreadcrumbs title={PAGE_TITLE.SETTINGS.PROFILE.EDIT} maxItems={3} breadcrumbs={BREADCRUMBS.SETTINGS.PROFILE} />
      <Box sx={{ p: { xs: 2, md: 3 }, mb: 8 }}>
        <Formik<AdminSettingFormValues> enableReinitialize initialValues={initialValues} validationSchema={EmployeeFormSchema} onSubmit={handleSubmit}>
          {({ dirty, values }) => (
            <Form noValidate>
              <Grid container spacing={2}>
                {/* BASIC DETAILS */}
                <CommonCard title="Social Links" grid={{ xs: 12 }}>
                  <Box sx={{ p: 2 }}>
                    <FieldArray name="links">
                      {({ push, remove }) => {
                        return (
                          <>
                            {values?.links?.map((link, index) => (
                              <Grid container spacing={2} key={index} sx={{ mb: 2 }}>
                                <CommonValidationTextField name={`links.${index}.title`} label="title" required grid={{ xs: 12, md: 3 }} />
                                <CommonValidationTextField name={`links.${index}.link`} label="link" required grid={{ xs: 12, md: 3 }} />
                                <CommonValidationTextField name={`links.${index}.icon`} label="icon" grid={{ xs: 12, md: 3 }} />
                                {(values?.links?.length || 0) > 1 && (
                                  <Grid size={"auto"}>
                                    <CommonButton variant="outlined" size="small" color="error" sx={{ minWidth: 20 }} onClick={() => remove(index)}>
                                      <CloseIcon />
                                    </CommonButton>
                                  </Grid>
                                )}
                                <Grid size={"auto"}>
                                  <CommonButton variant="outlined" size="small" color="primary" sx={{ minWidth: 20 }} onClick={() => push({ title: "", link: "", icon: "" })}>
                                    <Add />
                                  </CommonButton>
                                </Grid>
                              </Grid>
                            ))}
                          </>
                        );
                      }}
                    </FieldArray>
                  </Box>
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

export default AdminSetting;
