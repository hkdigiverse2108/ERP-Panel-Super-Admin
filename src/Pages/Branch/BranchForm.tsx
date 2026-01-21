import { Box, Grid } from "@mui/material";
import { Form, Formik, useFormikContext, type FormikHelpers } from "formik";
import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Mutations, Queries } from "../../Api";
import { CommonPhoneNumber, CommonValidationSelect, CommonValidationTextField } from "../../Attribute";
import { CommonBottomActionBar, CommonBreadcrumbs, CommonCard, DependentSelect } from "../../Components/Common";
import { PAGE_TITLE } from "../../Constants";
import { BREADCRUMBS } from "../../Data";
import type { BranchFormValues } from "../../Types";
import type { BankBase } from "../../Types/Bank";
import { GenerateOptions, GetChangedFields, RemoveEmptyFields } from "../../Utils";
import { BranchFormSchema } from "../../Utils/ValidationSchemas";

const BranchForm = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { data } = location.state || {};
  const { data: bankData } = Queries.useGetBankDropdown();
  const { data: CompanyData, isLoading: CompanyDataLoading } = Queries.useGetCompanyDropdown();

  const { mutate: addBranch, isPending: isAddLoading } = Mutations.useAddBranch();
  const { mutate: editBranch, isPending: isEditLoading } = Mutations.useEditBranch();

  const isEditing = Boolean(data?._id);
  const pageMode = isEditing ? "EDIT" : "ADD";

  const BANK_UI_FIELDS: (keyof BranchFormValues)[] = ["bankName", "bankIFSC", "branchName", "accountHolderName", "bankAccountNumber"];

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
    password: data?.showPassword || "",
    yearInterval: data?.yearInterval || "",

    gstRegistrationType: data?.gstRegistrationType || "",
    gstIdentificationNumber: data?.gstIdentificationNumber || "",
    panNo: data?.panNo || "",

    webSite: data?.webSite || "",
    fssaiNo: data?.fssaiNo || "",

   address: {
      address: data?.address?.address || "",
      country: data?.address?.country?._id || "",
      state: data?.address?.state?._id || "",
      city: data?.address?.city?._id || "",
      pinCode: data?.address?.pinCode || null,
    },

    bankId: data?.bankId?._id || "",
    upiId: "",
    bankName: "",
    bankIFSC: "",
    branchName: "",
    accountHolderName: "",
    bankAccountNumber: "",

    isActive: data?.isActive ?? true,
  };
  const FormikBankSync = ({ bankData }: { bankData?: BankBase[] }) => {
    const { values, setFieldValue } = useFormikContext<BranchFormValues>();

    useEffect(() => {
      if (!values.bankId || !bankData?.length) return;
      const selectedBank = bankData.find((b) => b._id === values.bankId);
      if (!selectedBank) return;

      setFieldValue("bankName", selectedBank.name || "");
      setFieldValue("bankIFSC", selectedBank.ifscCode || "");
      setFieldValue("branchName", selectedBank.branchName || "");
      setFieldValue("accountHolderName", selectedBank.accountHolderName || "");
      setFieldValue("bankAccountNumber", selectedBank.bankAccountNumber || "");
      setFieldValue("upiId", selectedBank.upiId || "");
    }, [values.bankId, bankData, setFieldValue]);

    return null;
  };

  const handleSubmit = async (values: BranchFormValues, { resetForm }: FormikHelpers<BranchFormValues>) => {
    const { _submitAction, ...rest } = values;
    BANK_UI_FIELDS.forEach((field) => delete (rest as BranchFormValues)[field]);
    const payload = { ...rest };

    const handleSuccess = () => {
      if (_submitAction === "saveAndNew") resetForm();
      else navigate(-1);
    };

    if (isEditing) {
      const changedFields = GetChangedFields(payload, data);
      await editBranch({ ...changedFields, branchId: data._id }, { onSuccess: handleSuccess });
    } else {
      await addBranch(RemoveEmptyFields(payload), { onSuccess: handleSuccess });
    }
  };

  return (
    <>
      <CommonBreadcrumbs title={PAGE_TITLE.BRANCH[pageMode]} maxItems={3} breadcrumbs={BREADCRUMBS.BRANCH[pageMode]} />

      <Box sx={{ p: { xs: 2, md: 3 }, mb: 8 }}>
        <Formik<BranchFormValues> enableReinitialize initialValues={initialValues} validationSchema={BranchFormSchema} onSubmit={handleSubmit}>
          {({ resetForm, setFieldValue, dirty, values }) => (
            <Form noValidate>
              <FormikBankSync bankData={bankData?.data} />
              <Grid container spacing={2}>
                <CommonCard title="Basic Details" grid={{ xs: 12 }}>
                  <Grid container spacing={2} sx={{ p: 2 }}>
                    <CommonValidationSelect name="companyId" label="Company" options={GenerateOptions(CompanyData?.data)} isLoading={CompanyDataLoading} grid={{ xs: 12, md: 4 }} required />
                    <CommonValidationTextField name="name" label="Branch Name" required grid={{ xs: 12, md: 4 }} />
                    <CommonValidationTextField name="displayName" label="Display Name" required grid={{ xs: 12, md: 4 }} />
                    <CommonValidationTextField name="contactName" label="Contact Person" grid={{ xs: 12, md: 4 }} />
                    <CommonValidationTextField name="panNo" label="PAN No." grid={{ xs: 12, md: 4 }} />
                    <CommonValidationTextField name="gstIdentificationNumber" label="GST Identification Number" grid={{ xs: 12, md: 4 }} />
                    <CommonValidationTextField name="gstRegistrationType" label="GST Registration Type" grid={{ xs: 12, md: 4 }} />
                    <CommonValidationTextField name="userName" label="Username" required grid={{ xs: 12, md: 4 }} />
                    <CommonValidationTextField name="password" label="Password" showPasswordToggle type="password" required grid={{ xs: 12, md: 4 }} />
                    <CommonValidationTextField name="yearInterval" label="Year Interval" required grid={{ xs: 12, md: 4 }} />
                  </Grid>
                </CommonCard>
                <CommonCard title="Contact Details" grid={{ xs: 12 }}>
                  <Grid container spacing={2} sx={{ p: 2 }}>
                    <CommonPhoneNumber label="Phone Number" countryCodeName="phoneNo.countryCode" numberName="phoneNo.phoneNo" required grid={{ xs: 12, md: 4 }} />
                    <CommonValidationTextField name="telephoneNumber" label="Telephone No" grid={{ xs: 12, md: 4 }} />
                    <CommonValidationTextField name="email" label="Email" grid={{ xs: 12, md: 4 }} />
                    <CommonValidationTextField name="webSite" label="Website" grid={{ xs: 12, md: 4 }} />
                    <CommonValidationTextField name="fssaiNo" label="FSSAI No."  grid={{ xs: 12, md: 4 }} />
                  </Grid>
                </CommonCard>

                <CommonCard title="Bank Details" grid={{ xs: 12 }}>
                  <Grid container spacing={2} sx={{ p: 2 }}>
                    <DependentSelect name="bankId" label="Bank Name" grid={{ xs: 12, md: 4 }} query={Queries.useGetBankDropdown} params={{ companyFilter: values.companyId }} enabled={Boolean(values.companyId)} disabled={!values.companyId} required />
                    <CommonValidationTextField name="branchName" label="Branch Name" grid={{ xs: 12, md: 4 }} disabled />
                    <CommonValidationTextField name="bankIFSC" label="Bank IFSC" grid={{ xs: 12, md: 4 }} disabled />
                    <CommonValidationTextField name="accountHolderName" label="Account Holder Name" grid={{ xs: 12, md: 4 }} disabled />
                    <CommonValidationTextField name="bankAccountNumber" label="Bank Account Number" grid={{ xs: 12, md: 4 }} disabled />
                    <CommonValidationTextField name="upiId" label="UPI ID" grid={{ xs: 12, md: 4 }} disabled />
                  </Grid>
                </CommonCard>

                <CommonCard title="Communication Details" grid={{ xs: 12 }}>
                  <Grid container spacing={2} sx={{ p: 2 }}>
                  <CommonValidationTextField name="address.address" label="Address" grid={{ xs: 12, md: 4 }} multiline required />
                    <DependentSelect name="address.country" label="Country" grid={{ xs: 12, md: 4 }} query={Queries.useGetCountryLocation} required />
                    <DependentSelect params={values.address?.country} name="address.state" label="State" grid={{ xs: 12, md: 4 }} query={Queries.useGetStateLocation} disabled={!values.address?.country} required />
                    <DependentSelect params={values.address?.state} name="address.city" label="City" grid={{ xs: 12, md: 4 }} query={Queries.useGetCityLocation} disabled={!values.address?.state} required />
                    <CommonValidationTextField name="address.pinCode" label="Pin Code" type="number" grid={{ xs: 12, md: 4 }} required />
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
