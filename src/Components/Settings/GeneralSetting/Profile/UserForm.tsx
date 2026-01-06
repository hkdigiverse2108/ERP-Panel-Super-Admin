import { Box, Grid } from "@mui/material";
import { Form, Formik, type FormikHelpers } from "formik";
import { useNavigate } from "react-router-dom";
import { Mutations, Queries } from "../../../../Api";
import { CommonPhoneNumber, CommonValidationTextField, CommonValidationSelect } from "../../../../Attribute";
import { PAGE_TITLE } from "../../../../Constants";
import { BREADCRUMBS, CityOptionsByState, CountryOptions, StateOptions } from "../../../../Data";
import { useAppDispatch, useAppSelector } from "../../../../Store/hooks";
import type { EmployeeFormValues } from "../../../../Types";
import { GenerateOptions, GetChangedFields } from "../../../../Utils";
import { EmployeeFormSchema } from "../../../../Utils/ValidationSchemas";
import { CommonBottomActionBar, CommonBreadcrumbs, CommonCard } from "../../../Common";
import { setUser } from "../../../../Store/Slices/AuthSlice";

const UserForm = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { company } = useAppSelector((state) => state.company);
  const { user: UserData } = useAppSelector((state) => state.auth);
  // const { data: rolesData } = Queries.useGetRoles({ activeFilter: true });
  const { data: branchData } = Queries.useGetBranch({ activeFilter: true });
  const { mutate: editEmployee, isPending: isEditLoading } = Mutations.useEditUser();

  const initialValues: EmployeeFormValues = {
    fullName: UserData?.fullName || "",
    username: UserData?.username || "",
    designation: UserData?.designation || "",
    phoneNo: {
      countryCode: UserData?.phoneNo?.countryCode || "",
      phoneNo: UserData?.phoneNo?.phoneNo || "",
    },
    email: UserData?.email || "",
    panNumber: UserData?.panNumber || "",
    // role: UserData?.role?._id || "",
    branchId: UserData?.branchId?._id || "",

    address: {
      address: UserData?.address?.address || "",
      country: "India",
      state: UserData?.address?.state || "",
      city: UserData?.address?.city || "",
      postalCode: UserData?.address?.postalCode || null,
    },

    bankDetails: {
      bankName: UserData?.bankDetails?.bankName || "",
      branchName: UserData?.bankDetails?.branchName || "",
      accountNumber: UserData?.bankDetails?.accountNumber || null,
      bankHolderName: UserData?.bankDetails?.bankHolderName || "",
      swiftCode: UserData?.bankDetails?.swiftCode || "",
      IFSCCode: UserData?.bankDetails?.IFSCCode || "",
    },

    wages: UserData?.wages || null,
    commission: UserData?.commission || null,
    extraWages: UserData?.extraWages || null,
    target: UserData?.target || null,
    isActive: UserData?.isActive ?? true,
  };

  const handleSubmit = async (values: EmployeeFormValues, { resetForm }: FormikHelpers<EmployeeFormValues>) => {
    const { ...rest } = values;
    const payload = { ...rest, companyId: company?._id };

    const changedFields = GetChangedFields(payload, UserData);
    await editEmployee(
      { ...changedFields, userId: UserData?._id },
      {
        onSuccess: (response) => {
          dispatch(setUser(response?.data));
          resetForm();
          navigate(-1);
        },
      }
    );
  };

  return (
    <>
      <CommonBreadcrumbs title={PAGE_TITLE.SETTINGS.USER.EDIT} maxItems={3} breadcrumbs={BREADCRUMBS.GENERAL_SETTING.USER} />
      <Box sx={{ p: { xs: 2, md: 3 }, mb: 8 }}>
        <Formik<EmployeeFormValues> enableReinitialize initialValues={initialValues} validationSchema={EmployeeFormSchema} onSubmit={handleSubmit}>
          {({ dirty, values }) => (
            <Form noValidate>
              <Grid container spacing={2}>
                {/* BASIC DETAILS */}
                <CommonCard title="Basic Details" grid={{ xs: 12 }}>
                  <Grid container spacing={2} sx={{ p: 2 }}>
                    <CommonValidationTextField name="fullName" label="Full Name" required grid={{ xs: 12, md: 4 }} />
                    <CommonValidationTextField name="username" label="User Name" required grid={{ xs: 12, md: 4 }} />
                    <CommonValidationTextField name="designation" label="User designation" grid={{ xs: 12, md: 4 }} />
                    {/* <CommonValidationSelect name="role" label="role" options={GenerateOptions(rolesData?.data?.role_data)} grid={{ xs: 12, md: 4 }} disabled/> */}
                    <CommonPhoneNumber label="Phone No." countryCodeName="phoneNo.countryCode" numberName="phoneNo.phoneNo" grid={{ xs: 12, md: 4 }} required />
                    <CommonValidationTextField name="email" label="Email" grid={{ xs: 12, md: 4 }} />
                    <CommonValidationTextField name="panNumber" label="PAN No." grid={{ xs: 12, md: 4 }} />
                    <CommonValidationSelect name="branchId" label="branch" options={GenerateOptions(branchData?.data?.branch_data)} grid={{ xs: 12, md: 4 }} />
                  </Grid>
                </CommonCard>

                {/* ADDRESS DETAILS */}
                <CommonCard title="Address Details" grid={{ xs: 12 }}>
                  <Grid container spacing={2} sx={{ p: 2 }}>
                    <CommonValidationTextField name="address.address" label="Address" required grid={{ xs: 12, md: 4 }} />
                    <CommonValidationSelect name="address.state" label="State" disabled={!values.address?.country} options={StateOptions} grid={{ xs: 12, md: 4 }} required />
                    <CommonValidationSelect name="address.city" label="City" disabled={!values.address?.state} options={CityOptionsByState[values?.address?.state || ""] || []} grid={{ xs: 12, md: 4 }} required />
                    <CommonValidationSelect name="address.country" label="Country" disabled options={CountryOptions} required grid={{ xs: 12, md: 4 }} />
                    <CommonValidationTextField name="address.postalCode" label="ZIP Code" required type="number" grid={{ xs: 12, md: 4 }} />
                  </Grid>
                </CommonCard>

                {/* BANK DETAILS */}
                <CommonCard title="Bank Details" grid={{ xs: 12 }}>
                  <Grid container spacing={2} sx={{ p: 2 }}>
                    <CommonValidationTextField name="bankDetails.bankName" label="Bank Name" grid={{ xs: 12, md: 4 }} />
                    <CommonValidationTextField name="bankDetails.branchName" label="Branch Name" grid={{ xs: 12, md: 4 }} />
                    <CommonValidationTextField name="bankDetails.accountNumber" label="Account No." type="number" grid={{ xs: 12, md: 4 }} />
                    <CommonValidationTextField name="bankDetails.bankHolderName" label="Account Holder Name" grid={{ xs: 12, md: 4 }} />
                    <CommonValidationTextField name="bankDetails.swiftCode" label="Swift Code" grid={{ xs: 12, md: 4 }} />
                    <CommonValidationTextField name="bankDetails.IFSCCode" label="IFSC Code" grid={{ xs: 12, md: 4 }} />
                  </Grid>
                </CommonCard>

                {/* SALARY DETAILS */}
                <CommonCard title="Salary Details" grid={{ xs: 12 }}>
                  <Grid container spacing={2} sx={{ p: 2 }}>
                    <CommonValidationTextField name="wages" label="Wages" type="number" grid={{ xs: 12, md: 4 }} />
                    <CommonValidationTextField name="commission" type="number" label="Commission" grid={{ xs: 12, md: 4 }} />
                    <CommonValidationTextField name="extraWages" type="number" label="Extra Wages" grid={{ xs: 12, md: 4 }} />
                    <CommonValidationTextField name="target" type="number" label="Target" grid={{ xs: 12, md: 4 }} />
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

export default UserForm;
