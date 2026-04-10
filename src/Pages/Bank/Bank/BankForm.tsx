import { Box, Grid } from "@mui/material";
import { Form, Formik, type FormikHelpers } from "formik";
import { useLocation, useNavigate } from "react-router-dom";
import { Mutations, Queries } from "../../../Api";
import { CommonValidationSelect, CommonValidationSwitch, CommonValidationTextField } from "../../../Attribute";
import { CommonBottomActionBar, CommonBreadcrumbs, CommonCard, DependentSelect } from "../../../Components/Common";
import { PAGE_TITLE } from "../../../Constants";
import { BREADCRUMBS } from "../../../Data";
// import { useAppSelector } from "../../../Store/hooks";
import type { BankFormValues, BranchBase } from "../../../Types";
import { GenerateOptions, GetChangedFields, RemoveEmptyFields } from "../../../Utils";
import { BankFormSchema } from "../../../Utils/ValidationSchemas";
import { useDependentReset, usePagePermission } from "../../../Utils/Hooks";
import { useEffect } from "react";

const BankForm = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { data } = location.state || {};
  // const { user } = useAppSelector((state) => state.auth);
  const permission = usePagePermission(PAGE_TITLE.BANK.BASE);

  const { data: companyData, isLoading: companyDataLoading } = Queries.useGetCompanyDropdown();

  const { mutate: addBank, isPending: isAddLoading } = Mutations.useAddBank();
  const { mutate: editBank, isPending: isEditLoading } = Mutations.useEditBank();

  const isEditing = Boolean(data?._id);
  const pageMode = isEditing ? "EDIT" : "ADD";

  const initialValues: BankFormValues = {
    companyId: data?.companyId?._id || data?.companyId || "",
    name: data?.name || "",
    branchName: data?.branchName || "",
    ifscCode: data?.ifscCode || "",
    swiftCode: data?.swiftCode || "",
    accountHolderName: data?.accountHolderName || "",
    bankAccountNumber: data?.bankAccountNumber || "",

    openingBalance: {
      creditBalance: data?.openingBalance?.creditBalance ?? 0,
      debitBalance: data?.openingBalance?.debitBalance ?? 0,
    },

    upiId: data?.upiId || "",
    address: {
      addressLine1: data?.address?.addressLine1 || "",
      addressLine2: data?.address?.addressLine2 || "",
      country: data?.address?.country?._id || "",
      state: data?.address?.state?._id || "",
      city: data?.address?.city?._id || "",
      pinCode: data?.address?.pinCode || "",
    },

    branchIds: Array.isArray(data?.branchIds) ? data.branchIds.map((b: BranchBase) => b._id) : [],

    isActive: data?.isActive ?? true,
  };

  const handleSubmit = async (values: BankFormValues, { resetForm }: FormikHelpers<BankFormValues>) => {
    if (isAddLoading || isEditLoading) return;

    const { _submitAction, ...rest } = values;
    const payload = { ...rest };

    const handleSuccess = () => {
      if (_submitAction === "saveAndNew") {
        resetForm();
      } else {
        navigate(-1);
      }
    };

    if (isEditing) {
      const changedFields = GetChangedFields(payload, data);
      editBank({ ...changedFields, bankId: data._id }, { onSuccess: handleSuccess });
    } else {
      const cleanedPayload = RemoveEmptyFields(payload) as BankFormValues;
      addBank(cleanedPayload, { onSuccess: handleSuccess });
    }
  };

  const AddressDependencyHandler = () => {
    useDependentReset([
      { when: "address.country", reset: ["address.state", "address.city"] },
      { when: "address.state", reset: ["address.city"] },
    ]);
    return null;
  };

  useEffect(() => {
    const hasAccess = isEditing ? permission.edit : permission.add;
    if (!hasAccess) navigate(-1);
  }, [isEditing, permission, navigate]);
  return (
    <>
      <CommonBreadcrumbs title={PAGE_TITLE.BANK[pageMode]} breadcrumbs={BREADCRUMBS.BANK[pageMode]} />

      <Box sx={{ p: { xs: 2, md: 3 }, mb: 8 }}>
        <Formik<BankFormValues> enableReinitialize initialValues={initialValues} validationSchema={BankFormSchema} onSubmit={handleSubmit}>
          {({ setFieldValue, resetForm, dirty, values }) => (
            <Form noValidate>
              <AddressDependencyHandler />
              <Grid container spacing={2}>
                <CommonCard title="Bank Details" grid={{ xs: 12 }}>
                  <Grid container spacing={2} sx={{ p: 2 }}>
                    <CommonValidationSelect name="companyId" label="Company Name" required isLoading={companyDataLoading} options={GenerateOptions(companyData?.data)} grid={{ xs: 12, md: 4 }} />
                    <CommonValidationTextField name="name" label="Name" required grid={{ xs: 12, md: 4 }} />
                    <CommonValidationTextField name="branchName" label="Branch Name" required grid={{ xs: 12, md: 4 }} />
                    <CommonValidationTextField name="ifscCode" label="IFSC Code" required grid={{ xs: 12, md: 4 }} />
                    <CommonValidationTextField name="swiftCode" label="Swift Code" grid={{ xs: 12, md: 4 }} />
                    <CommonValidationTextField name="accountHolderName" label="Account Holder Name" required grid={{ xs: 12, md: 4 }} />
                    <CommonValidationTextField name="bankAccountNumber" label="Account Number" required grid={{ xs: 12, md: 4 }} />
                    <CommonValidationTextField name="upiId" label="UPI ID" grid={{ xs: 12, md: 4 }} />
                    <DependentSelect name="branchIds" label="Select Branches" query={Queries.useGetBranchDropdown} params={{ companyFilter: values.companyId }} enabled={Boolean(values.companyId)} disabled={!values.companyId} grid={{ xs: 12, md: 4 }} multiple />
                    {/* <CommonValidationSelect name="branchIds" label="Branches" grid={{ xs: 12, md: 4 }} options={GenerateOptions(branchData?.data)} isLoading={branchDataLoading} multiple /> */}
                    <CommonValidationTextField name="openingBalance.creditBalance" label="Credit Balance" type="number" grid={{ xs: 12, sm: 2 }} />
                    <CommonValidationTextField name="openingBalance.debitBalance" label="Debit Balance" type="number" grid={{ xs: 12, sm: 2 }} />
                    <CommonValidationTextField name="address.addressLine1" label="Address Line 1" multiline grid={{ xs: 12, md: 8 }} required />
                    <CommonValidationTextField name="address.addressLine2" label="Address Line 2" multiline grid={{ xs: 12, md: 8 }} />
                    <DependentSelect name="address.country" label="Country" grid={{ xs: 12, md: 4 }} query={Queries.useGetCountryLocation} required />
                    <DependentSelect params={values?.address?.country} name="address.state" label="State" grid={{ xs: 12, md: 4 }} query={Queries.useGetStateLocation} disabled={!values?.address?.country} required />
                    <DependentSelect params={values?.address?.state} name="address.city" label="City" grid={{ xs: 12, md: 4 }} query={Queries.useGetCityLocation} disabled={!values?.address?.state} required />
                    <CommonValidationTextField name="address.pinCode" label="Pin Code" type="number" grid={{ xs: 12, md: 4 }} required />

                    {!isEditing && <CommonValidationSwitch name="isActive" label="Is Active" grid={{ xs: 12 }} />}
                  </Grid>
                </CommonCard>
                <CommonBottomActionBar
                  save={isEditing}
                  clear={!isEditing}
                  disabled={!dirty || isAddLoading || isEditLoading}
                  isLoading={isAddLoading || isEditLoading}
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

export default BankForm;
