import { Box, Grid } from "@mui/material";
import { Form, Formik, type FormikHelpers } from "formik";
import { useLocation, useNavigate } from "react-router-dom";
import { Mutations, Queries } from "../../Api";
import { CommonValidationTextField, CommonValidationSelect, CommonPhoneNumber } from "../../Attribute";
import { CommonBottomActionBar, CommonBreadcrumbs, CommonCard } from "../../Components/Common";
import { PAGE_TITLE } from "../../Constants";
import { BREADCRUMBS } from "../../Data";
import type { BranchFormValues } from "../../Types";
import { GenerateOptions, GetChangedFields, RemoveEmptyFields } from "../../Utils";
import { BranchFormSchema } from "../../Utils/ValidationSchemas";

const BranchForm = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { data } = location.state || {};
  const { data: bankData } = Queries.useGetBank({ activeFilter: true });
  const { data: companydata } = Queries.useGetCompany({ activeFilter: true });
  const { mutate: addBranch, isPending: isAddLoading } = Mutations.useAddBranch();
  const { mutate: editBranch, isPending: isEditLoading } = Mutations.useEditBranch();

  const isEditing = Boolean(data?._id);
  const pageMode = isEditing ? "EDIT" : "ADD";

  const initialValues: BranchFormValues = {
    companyId: data?.companyId?._id || "",

    name: data?.name || "",
    displayName: data?.displayName || "",
    contactName: data?.contactName || "",

    phoneNo: {
      countryCode: data?.phoneNo?.countryCode || "",
      phoneNo: data?.phoneNo?.phoneNo || "",
    },

    telephoneNumber: data?.telephoneNumber || "",
    email: data?.email || "",

    userName: data?.userName || "",
    password: "",
    yearInterval: data?.yearInterval || "",

    gstRegistrationType: data?.gstRegistrationType || "",
    gstIdentificationNumber: data?.gstIdentificationNumber || "",
    panNo: data?.panNo || "",

    webSite: data?.webSite || "",
    fssaiNo: data?.fssaiNo || "",

    address: data?.address || "",
    country: data?.country || "",
    state: data?.state || "",
    city: data?.city || "",
    pinCode: data?.pinCode || "",
    timeZone: data?.timeZone || "",

    bankId: data?.bankId?._id || "",
    upiId: data?.upiId || "",

    outletSize: data?.outletSize || "",
    userIds: data?.userIds || [],

    isActive: data?.isActive ?? true,
  };
   console.log(initialValues);

  const handleSubmit = async (values: BranchFormValues, { resetForm }: FormikHelpers<BranchFormValues>) => {
    const { _submitAction, ...rest } = values;
    const payload = { ...rest };
console.log(values);

    const handleSuccess = () => {
      if (_submitAction === "saveAndNew") resetForm();
      else navigate(-1);
    };

    if (isEditing) {
      const changedFields = GetChangedFields(payload, data);
      await editBranch({ ...changedFields, branchId: data._id }, { onSuccess : handleSuccess });
    } else {
      await addBranch(RemoveEmptyFields(payload), { onSuccess: handleSuccess });
    }
  };

  return (
    <>
      <CommonBreadcrumbs title={PAGE_TITLE.BRANCH[pageMode]} maxItems={3} breadcrumbs={BREADCRUMBS.BRANCH[pageMode]} />

      <Box sx={{ p: { xs: 2, md: 3 }, mb: 8 }}>
        <Formik<BranchFormValues> enableReinitialize initialValues={initialValues} validationSchema={BranchFormSchema} onSubmit={handleSubmit}>
          {({ resetForm, setFieldValue, dirty }) => (
            <Form noValidate>
              <Grid container spacing={2}>  
                <CommonCard title="Basic Details" grid={{ xs: 12 }}>
                  <Grid container spacing={2} sx={{ p: 2 }}>
                    <CommonValidationSelect name="companyId" label="Company" options={GenerateOptions(companydata?.data?.company_data)} grid={{ xs: 12, md: 4 }} required />
                    
                    <CommonValidationTextField name="name" label="Branch Name" required grid={{ xs: 12, md: 4 }} />
                    <CommonValidationTextField name="displayName" label="Display Name" required grid={{ xs: 12, md: 4 }} />
                    <CommonValidationTextField name="contactName" label="Contact Person" grid={{ xs: 12, md: 4 }} />
                    <CommonValidationTextField name="panNo" label="PAN No." grid={{ xs: 12, md: 4 }} />
                    <CommonValidationTextField name="gstIdentificationNumber" label="GST Identification Number" grid={{ xs: 12, md: 4 }} />
                    <CommonValidationTextField name="gstRegistrationType" label="GST Registration Type"  grid={{ xs: 12, md: 4 }} />
                    <CommonValidationTextField name="timeZone" label="Time Zone" grid={{ xs: 12, md: 4 }} />
                    <CommonValidationTextField name="userName" label="Username" required grid={{ xs: 12, md: 4 }} />
                    <CommonValidationTextField name="password" label="Password" type="password" required grid={{ xs: 12, md: 4 }} />
                    <CommonValidationTextField name="yearInterval" label="Year Interval" required  grid={{ xs: 12, md: 4 }} />
                  </Grid>
                </CommonCard>
                <CommonCard title="Contact Details" grid={{ xs: 12 }}>
                  <Grid container spacing={2} sx={{ p: 2 }}>
                    <CommonPhoneNumber label="Phone Number" countryCodeName="phoneNo.countryCode" numberName="phoneNo.phoneNo" required grid={{ xs: 12, md: 4 }} />
                    <CommonValidationTextField name="telephoneNumber" label="Telephone No" grid={{ xs: 12, md: 4 }} />
                    <CommonValidationTextField name="email" label="Email" grid={{ xs: 12, md: 4 }} />
                    <CommonValidationTextField name="webSite" label="Website" grid={{ xs: 12, md: 4 }} />
                    <CommonValidationTextField name="fssaiNo" label="FSSAI No." type="number" grid={{ xs: 12, md: 4 }} />
                  </Grid>
                </CommonCard>

                <CommonCard title="Bank Details" grid={{ xs: 12 }}>
                  <Grid container spacing={2} sx={{ p: 2 }}>
                    <CommonValidationSelect name="Name" label="Bank Name" options={GenerateOptions(bankData?.data?.bank_data)} required grid={{ xs: 12, md: 4 }} />
                    <CommonValidationTextField name="branchName" label="Branch Name" required grid={{ xs: 12, md: 4 }} />
                    <CommonValidationTextField name="accountNumber" label="Account Number" required grid={{ xs: 12, md: 4 }} />
                    <CommonValidationTextField name="ifscCode" label="IFSC Code" required grid={{ xs: 12, md: 4 }} />
                  </Grid>
                </CommonCard>

                <CommonCard title="Address Details" grid={{ xs: 12 }}>
                  <Grid container spacing={2} sx={{ p: 2 }}>
                    <CommonValidationTextField name="address" label="Address" required grid={{ xs: 12, md: 4 }} />
                    <CommonValidationTextField name="country" label="Country" required grid={{ xs: 12, md: 4 }} />
                    <CommonValidationTextField name="state" label="State" required grid={{ xs: 12, md: 4 }} />
                    <CommonValidationTextField name="city" label="City" required grid={{ xs: 12, md: 4 }} />
                    <CommonValidationTextField name="pinCode" label="Pin Code" required grid={{ xs: 12, md: 4 }} />
                  </Grid>
                </CommonCard>

                <CommonBottomActionBar
                  save={isEditing}
                  clear={!isEditing}
                  disabled={!dirty}
                  isLoading={isEditLoading || isAddLoading}
                  onClear={() => resetForm({ values: initialValues })}
                  onSave={() => {
                    setFieldValue("_submitAction", "save");
                  }}
                  onSaveAndNew={() => {
                    setFieldValue("_submitAction", "saveAndNew");
                  }}
                />
              </Grid>
            </Form>
          )}
        </Formik>
      </Box>
    </>
  );
};

export default BranchForm;
