import { Box, Grid } from "@mui/material";
import { Form, Formik, type FormikHelpers } from "formik";
import { useLocation, useNavigate } from "react-router-dom";
import { Mutations, Queries } from "../../Api";
import { CommonPhoneNumber, CommonValidationTextField, CommonValidationSelect, CommonValidationSwitch } from "../../Attribute";
import { CommonBottomActionBar, CommonBreadcrumbs, CommonCard } from "../../Components/Common";
import { PAGE_TITLE } from "../../Constants";
import { BREADCRUMBS, CityOptionsByState, CountryOptions, StateOptions } from "../../Data";
import { useAppSelector } from "../../Store/hooks";
import type { EmployeeFormValues } from "../../Types";
import { GenerateOptions, GetChangedFields, RemoveEmptyFields } from "../../Utils";
import { EmployeeFormSchema } from "../../Utils/ValidationSchemas";


const EmployeeForm = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { data } = location.state || {};
  const { company } = useAppSelector((state) => state.company);

  const { data: rolesData } = Queries.useGetRoles({ activeFilter: true });
  const { data: branchData } = Queries.useGetBranch({ activeFilter: true });
  const { mutate: addEmployee, isPending: isAddLoading } = Mutations.useAddEmployee();
  const { mutate: editEmployee, isPending: isEditLoading } = Mutations.useEditEmployee();

  const isEditing = Boolean(data?._id);
  const pageMode = isEditing ? "EDIT" : "ADD";

  const initialValues: EmployeeFormValues = {
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

    address: {
      address: data?.address?.address || "",
      country: "India",
      state: data?.address?.state || "",
      city: data?.address?.city || "",
      postalCode: data?.address?.postalCode || null,
    },

    bankDetails: {
      bankName: data?.bankDetails?.bankName || "",
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

  const handleSubmit = async (values: EmployeeFormValues, { resetForm }: FormikHelpers<EmployeeFormValues>) => {
    const { _submitAction, ...rest } = values;
    const payload = { ...rest, companyId: company!._id };

    const handleSuccess = () => {
      if (_submitAction === "saveAndNew") resetForm();
      else navigate(-1);
    };
    if (isEditing) {
      const changedFields = GetChangedFields(payload, data);
      await editEmployee({ ...changedFields, userId: data._id }, { onSuccess: handleSuccess });
    } else {
      await addEmployee(RemoveEmptyFields(payload), { onSuccess: handleSuccess });
    }
  };

  return (
    <>
      <CommonBreadcrumbs title={PAGE_TITLE.EMPLOYEE[pageMode]} maxItems={3} breadcrumbs={BREADCRUMBS.EMPLOYEE[pageMode]} />
      <Box sx={{ p: { xs: 2, md: 3 }, mb: 8 }}>
        <Formik<EmployeeFormValues> enableReinitialize initialValues={initialValues} validationSchema={EmployeeFormSchema} onSubmit={handleSubmit}>
          {({ resetForm, setFieldValue, dirty ,values}) => (
            <Form noValidate>
              <Grid container spacing={2}>
                {/* BASIC DETAILS */}
                <CommonCard title="Basic Details" grid={{ xs: 12 }}>
                  <Grid container spacing={2} sx={{ p: 2 }}>
                    <CommonValidationTextField name="fullName" label="Full Name" required grid={{ xs: 12, md: 4 }} />
                    <CommonValidationTextField name="username" label="User Name" required grid={{ xs: 12, md: 4 }} />
                    <CommonValidationTextField name="designation" label="User designation" grid={{ xs: 12, md: 4 }} />
                    <CommonValidationSelect name="role" label="role" options={GenerateOptions(rolesData?.data?.role_data)} grid={{ xs: 12, md: 4 }} />
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

export default EmployeeForm;
