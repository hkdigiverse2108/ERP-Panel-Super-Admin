import { Box, Grid } from "@mui/material";
import { Form, Formik, type FormikHelpers } from "formik";
import { useLocation, useNavigate } from "react-router-dom";
import { Mutations } from "../../../Api";
import { CommonValidationSelect, CommonValidationSwitch, CommonValidationTextField } from "../../../Attribute";
import { CommonBottomActionBar, CommonBreadcrumbs, CommonCard } from "../../../Components/Common";
import { PAGE_TITLE } from "../../../Constants";
import { BankFormBreadCrumbs, CityOptionsByState, CountryOptions, StateOptions } from "../../../Data";
import { useAppSelector } from "../../../Store/hooks";
import type { BankFormValues } from "../../../Types";
import { GetChangedFields, RemoveEmptyFields } from "../../../Utils";
import { BankFormSchema } from "../../../Utils/ValidationSchemas";

const BankForm = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { data } = location.state || {};
  const { company } = useAppSelector((state) => state.company);

  const { mutate: addBank, isPending: isAddLoading } = Mutations.useAddBank();
  const { mutate: editBank, isPending: isEditLoading } = Mutations.useEditBank();


  const isEditing = Boolean(data?._id);
  
  const initialValues: BankFormValues = {
    name: data?.name || "",
    branchName: data?.branchName || "",
    ifscCode: data?.ifscCode || "",
    swiftCode: data?.swiftCode || "",
    accountHolderName: data?.accountHolderName || "",
    bankAccountNumber: data?.bankAccountNumber || "",
    openingBalance: data?.openingBalance || { creditBalance: 0, debitBalance: 0 },
    addressLine1: data?.addressLine1 || "",
    country: data?.country || "India",
    state: data?.state || "",
    city: data?.city || "",
    zipCode: data?.zipCode || undefined,
    isActive: data?.isActive ?? true,
    bankId: data?.bankId || "",
    
  };

  const handleSubmit = async (values: BankFormValues, { resetForm }: FormikHelpers<BankFormValues>) => {
    
    if (isAddLoading || isEditLoading) return;

    const { _submitAction, ...rest } = values;
    const payload = { ...rest, companyId: company?._id };

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

  return (
    <>
      <CommonBreadcrumbs title={isEditing ? PAGE_TITLE.BANK.EDIT : PAGE_TITLE.BANK.ADD} maxItems={2} breadcrumbs={BankFormBreadCrumbs} />

      <Box sx={{ p: { xs: 2, md: 3 }, mb: 8 }}>
        <Formik<BankFormValues> enableReinitialize initialValues={initialValues} validationSchema={BankFormSchema} onSubmit={handleSubmit}>
          {({ setFieldValue, resetForm, dirty,  values }) => (
            <Form noValidate>
              <Grid container spacing={2}>
                <CommonCard title="Bank Details" grid={{ xs: 12 }}>
                  <Grid container spacing={2} sx={{ p: 2 }}>
                    <CommonValidationTextField name="name" label="Name" required grid={{ xs: 12, md: 4 }} />
                    <CommonValidationTextField name="branchName" label="Branch Name" required grid={{ xs: 12, md: 4 }} />
                    <CommonValidationTextField name="ifscCode" label="IFSC Code" required grid={{ xs: 12, md: 4 }} />
                    <CommonValidationTextField name="swiftCode" label="Swift Code" grid={{ xs: 12, md: 4 }} />
                    <CommonValidationTextField name="accountHolderName" label="Account Holder Name" required grid={{ xs: 12, md: 4 }} />
                    <CommonValidationTextField name="bankAccountNumber" label="Account Number" required grid={{ xs: 12, md: 4 }} />
                    <CommonValidationTextField name="openingBalance.creditBalance" label="Opening Balance" type="number" grid={{ xs: 12, md: 4 }} />
                    <CommonValidationTextField name="zipCode" label="Zip Code" type="number" grid={{ xs: 12, md: 4 }} />
                    <CommonValidationSelect name="state" label="State" options={StateOptions} grid={{ xs: 12, md: 4 }} required />
                    <CommonValidationSelect name="city" label="City" disabled={!values.state} options={CityOptionsByState[values?.state || ""] || []} grid={{ xs: 12, md: 4 }} required />
                    <CommonValidationSelect name="country" label="Country" options={CountryOptions} disabled grid={{ xs: 12, md: 4 }} required />

                    <CommonValidationTextField name="addressLine1" label="Address" multiline rows={3} grid={{ xs: 12 }} />

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
