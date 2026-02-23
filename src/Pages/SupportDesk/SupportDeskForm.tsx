import { Box } from "@mui/material";
import { Form, Formik, type FormikHelpers } from "formik";
import { useLocation, useNavigate } from "react-router-dom";
import { Mutations, Queries } from "../../Api";
import { CommonPhoneNumber, CommonValidationSelect, CommonValidationSwitch, CommonValidationTextField } from "../../Attribute";
import { CommonBottomActionBar, CommonBreadcrumbs, CommonCard } from "../../Components/Common";
import { PAGE_TITLE } from "../../Constants";
import { BREADCRUMBS } from "../../Data";
import type { AddCallRequestPayload, CallRequestFormValues, EditCallRequestPayload } from "../../Types";
import { GenerateOptions, GetChangedFields, RemoveEmptyFields } from "../../Utils";

const SupportDeskForm = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { data } = location.state || {};

  const isEditing = Boolean(data?._id);
  const pageMode = isEditing ? "EDIT" : "ADD";

  const { mutate: addCallRequest, isPending: isAddLoading } = Mutations.useAddCallRequest();
  const { mutate: editCallRequest, isPending: isEditLoading } = Mutations.useEditCallRequest();
  const { data: CompanyData, isLoading: CompanyDataLoading } = Queries.useGetCompanyDropdown();

  // ✅ INITIAL VALUES
  const initialValues: CallRequestFormValues = {
    companyId: data?.companyId?._id || "",
    businessName: data?.businessName || "",
    contactName: data?.contactName || "",
    contactNo: {
      countryCode: data?.contactNo?.countryCode || "+91",
      phoneNo: data?.contactNo?.phoneNo || "",
    },
    note: data?.note || "",
    isActive: data?.isActive ?? true,
  };

  const handleSubmit = async (values: CallRequestFormValues, { resetForm }: FormikHelpers<CallRequestFormValues>) => {
    const { _submitAction, ...rest } = values;

    const handleSuccess = () => {
      if (_submitAction === "saveAndNew") resetForm();
      else navigate(-1);
    };

    if (isEditing) {
      const changedFields = GetChangedFields(rest, data);
      editCallRequest({ ...changedFields, callRequestId: data._id } as EditCallRequestPayload, { onSuccess: handleSuccess });
    } else {
      addCallRequest(RemoveEmptyFields(rest) as AddCallRequestPayload, { onSuccess: handleSuccess });
    }
  };

  return (
    <>
      <CommonBreadcrumbs title={PAGE_TITLE.CALL_REQUEST[pageMode]} maxItems={3} breadcrumbs={BREADCRUMBS.CALL_REQUEST[pageMode]} />

      <Box sx={{ p: { xs: 2, md: 3 }, mb: 8 }}>
        <Formik<CallRequestFormValues> initialValues={initialValues} onSubmit={handleSubmit} enableReinitialize>
          {({ setFieldValue, resetForm, dirty }) => (
            <Form noValidate>
              <Box sx={{ display: "grid", gap: 2 }}>
                {/* CALL REQUEST DETAILS */}
                <CommonCard title="Support Desk Details">
                  <Box sx={{ p: 2, display: "grid", gridTemplateColumns: { xs: "1fr", md: "repeat(3, 1fr)" }, gap: 2 }}>
                    <CommonValidationSelect name="companyId" label="Company" options={GenerateOptions(CompanyData?.data)} isLoading={CompanyDataLoading} grid={{ xs: 12, md: 4 }} required />
                    <CommonValidationTextField name="businessName" label="Business Name" required grid={{ xs: 12, md: 4 }} />
                    <CommonValidationTextField name="contactName" label="Contact Name" required grid={{ xs: 12, md: 4 }} />
                    <CommonPhoneNumber label="Contact No." countryCodeName="contactNo.countryCode" numberName="contactNo.phoneNo" grid={{ xs: 12, md: 4 }} required />
                    <CommonValidationTextField name="note" label="Note" multiline grid={{ xs: 12, md: 4 }} />
                  </Box>
                </CommonCard>
                {!isEditing && <CommonValidationSwitch name="is_active" label="Is Active" grid={{ xs: 12 }} />}

                <CommonBottomActionBar
                  save={isEditing}
                  clear={!isEditing}
                  disabled={!dirty}
                  isLoading={isAddLoading || isEditLoading}
                  onClear={() => resetForm({ values: initialValues })}
                  onSave={() => setFieldValue("_submitAction", "save")}
                  onSaveAndNew={() => setFieldValue("_submitAction", "saveAndNew")}
                />
              </Box>
            </Form>
          )}
        </Formik>
      </Box>
    </>
  );
};

export default SupportDeskForm;
