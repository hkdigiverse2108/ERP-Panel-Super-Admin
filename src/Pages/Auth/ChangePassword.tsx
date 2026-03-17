import { Box, Grid } from "@mui/material";
import type { FormikHelpers } from "formik";
import { Form, Formik } from "formik";
import { useNavigate } from "react-router-dom";
import { Mutations } from "../../Api";
import { CommonButton, CommonValidationTextField } from "../../Attribute";
import { CommonBottomActionBar, CommonBreadcrumbs, CommonCard } from "../../Components/Common";
import { LoginSource } from "../../Constants";
import { BREADCRUMBS } from "../../Data/Breadcrumbs";
import { useAppSelector } from "../../Store/hooks";
import type { ChangePasswordPayload } from "../../Types";
import { ChangePasswordSchema } from "../../Utils/ValidationSchemas";

const ChangePassword = () => {
    const navigate = useNavigate();
    const { user } = useAppSelector((state) => state.auth);

    const { mutate: changePassword, isPending: isLoading } = Mutations.useChangePassword();

    const initialValues: ChangePasswordPayload = {
        email: user?.email || "",
        oldPassword: "",
        newPassword: "",
        loginSource: LoginSource,
    };

    const handleSubmit = async (values: ChangePasswordPayload, { resetForm }: FormikHelpers<ChangePasswordPayload>) => {
        await changePassword(values, {
            onSuccess: () => {
                resetForm();
                navigate(-1);
            },
        });
    };
    return (
        <>
            <CommonBreadcrumbs title="Change Password" maxItems={3} breadcrumbs={BREADCRUMBS.CHANGE_PASSWORD.BASE} />
            <Box sx={{ p: { xs: 2, md: 3 }, mb: 8 }}>
                <Formik<ChangePasswordPayload> enableReinitialize initialValues={initialValues} validationSchema={ChangePasswordSchema} onSubmit={handleSubmit}>
                    {({ dirty }) => (
                        <Form noValidate>
                            <Grid container spacing={2}>
                                <CommonCard title="Change Password" grid={{ xs: 12, md: 8, lg: 6 }}>
                                    <Grid container spacing={2} sx={{ p: 2 }}>
                                        <CommonValidationTextField name="oldPassword" label="Old Password" type="password" showPasswordToggle required grid={{ xs: 12 }} />
                                        <CommonValidationTextField name="newPassword" label="New Password" type="password" showPasswordToggle required grid={{ xs: 12 }} />
                                        <CommonValidationTextField name="confirmPassword" label="Confirm Password" type="password" showPasswordToggle required grid={{ xs: 12 }} />

                                    </Grid>
                                </CommonCard>

                                <CommonBottomActionBar>
                                    <Grid sx={{ display: "flex", gap: 2, ml: "auto" }}>
                                        <CommonButton variant="outlined" onClick={() => navigate(-1)} title="Cancel" />
                                        <CommonButton type="submit" variant="contained" title="Save" onClick={() => { }} loading={isLoading} disabled={!dirty} />
                                    </Grid>
                                </CommonBottomActionBar>
                            </Grid>
                        </Form>
                    )}
                </Formik>
            </Box>
        </>
    );
};

export default ChangePassword;
