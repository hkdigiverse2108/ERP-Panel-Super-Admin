import { Box, Grid } from "@mui/material";
import { Form, Formik, type FormikHelpers } from "formik";
import { useNavigate } from "react-router-dom";
import { Mutations, Queries } from "../../Api";
import { CommonPhoneNumber, CommonValidationSelect, CommonValidationTextField } from "../../Attribute";
import { PAGE_TITLE } from "../../Constants";
import { BREADCRUMBS } from "../../Data";
import { useAppDispatch, useAppSelector } from "../../Store/hooks";
import { setUser } from "../../Store/Slices/AuthSlice";
import type { EmployeeFormValues } from "../../Types";
import { GenerateOptions, GetChangedFields } from "../../Utils";
import { EmployeeFormSchema } from "../../Utils/ValidationSchemas";
import { CommonBottomActionBar, CommonBreadcrumbs, CommonCard, DependentSelect } from "../../Components/Common";
import { useDependentReset } from "../../Utils/Hooks";

const UserForm = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  // const { company } = useAppSelector((state) => state.company);
  const { user: UserData } = useAppSelector((state) => state.auth);
  const { data: branchData, isLoading: branchDataLoading } = Queries.useGetBranchDropdown();
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
    branchId: UserData?.branchId?._id || "",
    password: UserData?.showPassword || "",

    address: {
      address: UserData?.address?.address || "",
      country: UserData?.address?.country?._id || "",
      state: UserData?.address?.state?._id || "",
      city: UserData?.address?.city?._id || "",
      pinCode: UserData?.address?.pinCode || "",
    },

    bankDetails: {
      name: UserData?.bankDetails?.name || "",
      branchName: UserData?.bankDetails?.branchName || "",
      accountNumber: UserData?.bankDetails?.accountNumber || "",
      bankHolderName: UserData?.bankDetails?.bankHolderName || "",
      swiftCode: UserData?.bankDetails?.swiftCode || "",
      IFSCCode: UserData?.bankDetails?.IFSCCode || "",
    },

    wages: UserData?.wages || "",
    commission: UserData?.commission || "",
    extraWages: UserData?.extraWages || "",
    target: UserData?.target || "",
    isActive: UserData?.isActive ?? true,
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
          navigate(-1);
        },
      },
    );
  };

  const AddressDependencyHandler = () => {
    useDependentReset([
      { when: "address.country", reset: ["address.state", "address.city"] },
      { when: "address.state", reset: ["address.city"] },
    ]);
    return null;
  };

  return (
    <>
      <CommonBreadcrumbs title={PAGE_TITLE.SETTINGS.PROFILE.EDIT} maxItems={3} breadcrumbs={BREADCRUMBS.SETTINGS.PROFILE} />
      <Box sx={{ p: { xs: 2, md: 3 }, mb: 8 }}>
        <Formik<EmployeeFormValues> enableReinitialize initialValues={initialValues} validationSchema={EmployeeFormSchema} onSubmit={handleSubmit}>
          {({ dirty, values }) => (
            <Form noValidate>
              <AddressDependencyHandler />
              <Grid container spacing={2}>
                {/* BASIC DETAILS */}
                <CommonCard title="Basic Details" grid={{ xs: 12 }}>
                  <Grid container spacing={2} sx={{ p: 2 }}>
                    <CommonValidationTextField name="fullName" label="Full Name" required grid={{ xs: 12, md: 4 }} />
                    <CommonValidationTextField name="username" label="User Name" required grid={{ xs: 12, md: 4 }} />
                    <CommonValidationTextField name="designation" label="User designation" grid={{ xs: 12, md: 4 }} />
                    <CommonPhoneNumber label="Phone No." countryCodeName="phoneNo.countryCode" numberName="phoneNo.phoneNo" grid={{ xs: 12, md: 4 }} required />
                    <CommonValidationTextField name="email" label="Email" grid={{ xs: 12, md: 4 }} />
                    <CommonValidationTextField name="panNumber" label="PAN No." grid={{ xs: 12, md: 4 }} />
                    <CommonValidationSelect name="branchId" label="branch" options={GenerateOptions(branchData?.data)} isLoading={branchDataLoading} grid={{ xs: 12, md: 4 }} />
                    <CommonValidationTextField name="password" label="Password" type="password" showPasswordToggle required grid={{ xs: 10, md: 4 }} />
                  </Grid>
                </CommonCard>

                {/* ADDRESS DETAILS */}
                <CommonCard title="Address Details" grid={{ xs: 12 }}>
                  <Grid container spacing={2} sx={{ p: 2 }}>
                    <CommonValidationTextField name="address.address" label="Address" required grid={{ xs: 12, md: 4 }} />
                    <DependentSelect name="address.country" label="Country" grid={{ xs: 12, md: 4 }} query={Queries.useGetCountryLocation} required />
                    <DependentSelect params={values?.address?.country} name="address.state" label="State" grid={{ xs: 12, md: 4 }} query={Queries.useGetStateLocation} disabled={!values?.address?.country} required />
                    <DependentSelect params={values?.address?.state} name="address.city" label="City" grid={{ xs: 12, md: 4 }} query={Queries.useGetCityLocation} disabled={!values?.address?.state} required />
                    <CommonValidationTextField name="address.pinCode" label="Pin Code" required type="number" grid={{ xs: 12, md: 4 }} />
                  </Grid>
                </CommonCard>

                {/* BANK DETAILS */}
                <CommonCard title="Bank Details" grid={{ xs: 12 }}>
                  <Grid container spacing={2} sx={{ p: 2 }}>
                    <CommonValidationTextField name="bankDetails.name" label="Bank Name" grid={{ xs: 12, md: 4 }} />
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
