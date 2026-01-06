import { Box, Grid } from "@mui/material";
import { Form, Formik, useFormikContext, type FormikValues } from "formik";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Mutations } from "../../../../Api";
import { CommonButton, CommonPhoneNumber, CommonSwitch, CommonValidationSelect, CommonValidationTextField } from "../../../../Attribute";
import { PAGE_TITLE, ROUTES } from "../../../../Constants";
import { BREADCRUMBS, CityOptionsByState, CountryOptions, StateOptions, TimeZoneOptions } from "../../../../Data";
import { setCompany } from "../../../../Store/Slices/CompanySlice";
import { setSelectedFiles, setUploadModal } from "../../../../Store/Slices/ModalSlice";
import { useAppDispatch, useAppSelector } from "../../../../Store/hooks";
import type { CompanyFormValues, Params } from "../../../../Types";
import { GetChangedFields } from "../../../../Utils";
import { CompanyFormSchemas } from "../../../../Utils/ValidationSchemas";
import { CommonBottomActionBar, CommonBreadcrumbs, CommonCard } from "../../../Common";
import { CommonFormImageBox } from "../../../Common/CommonUploadImage/CommonImageBox";
type CompanyImageKey = "logo" | "waterMark" | "reportFormatLogo" | "authorizedSignature";

const COMPANY_IMAGES = [
  { key: "logo", label: "Logo" },
  { key: "waterMark", label: "Watermark" },
  { key: "reportFormatLogo", label: "Report Format Logo" },
  { key: "authorizedSignature", label: "Authorized Signature" },
] as const;

const CompanyForm = () => {
  const { company: companyData = {} } = useAppSelector((state) => state.company);
  const { mutate: editCompanyMutate, isPending: isEditLoading } = Mutations.useEditCompany();

  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const [activeKey, setActiveKey] = useState<CompanyImageKey | null>(null);

  const initialValues: CompanyFormValues = {
    name: companyData.name || "",
    displayName: companyData.displayName || "",
    contactName: companyData.contactName || "",
    email: companyData.email || "",
    supportEmail: companyData.supportEmail || "",
    phoneNo: {
      countryCode: companyData?.phoneNo?.countryCode || "",
      phoneNo: companyData?.phoneNo?.phoneNo || "",
    },
    ownerNo: {
      countryCode: companyData?.ownerNo?.countryCode || "",
      phoneNo: companyData?.ownerNo?.phoneNo || "",
    },
    customerCareNumber: companyData.customerCareNumber || "",

    address: companyData.address || "",
    city: companyData.city || "",
    state: companyData.state || "",
    country: "India",
    pinCode: companyData.pinCode || null,
    timeZone: companyData.timeZone || "",

    // bankName: companyData.bankName || "",
    // bankIFSC: companyData.bankIFSC || "",
    upiId: companyData.upiId || "",
    // branchName: companyData.branchName || "",
    // accountHolderName: companyData.accountHolderName || "",
    // bankAccountNumber: companyData.bankAccountNumber || "",

    userName: companyData.userName || "",
    GSTRegistrationType: companyData.GSTRegistrationType || "",
    GSTIdentificationNumber: companyData.GSTIdentificationNumber || "",
    PanNo: companyData.PanNo || "",
    webSite: companyData.webSite || "",
    financialYear: companyData.financialYear || "",
    corporateIdentificationNumber: companyData.corporateIdentificationNumber || "",
    letterOfUndertaking: companyData.letterOfUndertaking || "",
    importerExporterCode: companyData.importerExporterCode || "",
    outletSize: companyData.outletSize || "",
    fssaiNo: companyData.fssaiNo || null,
    taxDeductionAndCollectionAccountNumber: companyData.taxDeductionAndCollectionAccountNumber || "",
    printDateFormat: companyData.printDateFormat || "",
    decimalPoint: companyData.decimalPoint || "",
    // currency: companyData.currency || "",

    enableFeedbackModule: companyData.enableFeedbackModule === true || companyData.enableFeedbackModule === "true",
    allowRoundOff: companyData.allowRoundOff === true || companyData.allowRoundOff === "true",
    logo: companyData.logo || null,
    waterMark: companyData.waterMark || null,
    reportFormatLogo: companyData.reportFormatLogo || null,
    authorizedSignature: companyData.authorizedSignature || null,
  };

  const handleOnSubmit = (values: CompanyFormValues) => {
    const newData = {
      ...values,
    };

    const payload = GetChangedFields(newData, companyData);
    console.log(payload);

    editCompanyMutate(
      { companyId: companyData?._id, ...payload },
      {
        onSuccess: (response) => {
          dispatch(setCompany(response?.data));
          navigate(ROUTES.SETTINGS.GENERAL, { state: 1 });
        },
      }
    );
  };
  const FormikImageSync = <T extends FormikValues>({ activeKey, clearActiveKey }: Params) => {
    const { selectedFiles } = useAppSelector((state) => state.modal);
    const dispatch = useAppDispatch();

    const { setFieldValue } = useFormikContext<T>();

    useEffect(() => {
      if (!selectedFiles[0] || !activeKey) return;

      setFieldValue(activeKey, selectedFiles[0]);

      dispatch(setSelectedFiles([]));
      clearActiveKey();
    }, [selectedFiles, activeKey, setFieldValue, dispatch, clearActiveKey]);

    return null;
  };

  const handleUpload = (key: CompanyImageKey) => {
    setActiveKey(key);
    dispatch(setUploadModal({ open: true, type: "image" }));
  };

  const handleDelete = () => dispatch(setSelectedFiles([]));

  if (!companyData) return false;

  return (
    <>
      <CommonBreadcrumbs title={PAGE_TITLE.SETTINGS.COMPANY.EDIT} maxItems={3} breadcrumbs={BREADCRUMBS.GENERAL_SETTING.COMPANY} />
      <Box sx={{ p: { xs: 2, md: 3 } }}>
        <Formik<CompanyFormValues> enableReinitialize initialValues={initialValues} validationSchema={CompanyFormSchemas} onSubmit={handleOnSubmit}>
          {({ values, setFieldValue, dirty }) => (
            <Form noValidate>
              <FormikImageSync activeKey={activeKey} clearActiveKey={() => setActiveKey(null)} />
              <Grid container spacing={2}>
                {/* BASIC DETAILS */}
                <CommonCard title="Basic Details" grid={{ xs: 12 }}>
                  <Grid container spacing={2} sx={{ p: 2 }}>
                    <CommonValidationTextField name="name" label="Company Name" required grid={{ xs: 12, md: 4 }} />
                    <CommonValidationTextField name="displayName" label="Display Name" required grid={{ xs: 12, md: 4 }} />
                    <CommonValidationTextField name="contactName" label="Contact Name" required grid={{ xs: 12, md: 4 }} />
                    <CommonValidationTextField name="email" label="Email" grid={{ xs: 12, md: 4 }} required />
                    <CommonPhoneNumber label="Phone No." countryCodeName="phoneNo.countryCode" numberName="phoneNo.phoneNo" grid={{ xs: 12, md: 4 }} required />
                    <CommonValidationTextField name="supportEmail" label="support Email" grid={{ xs: 12, md: 4 }} required />
                    <CommonPhoneNumber label="Owner No." countryCodeName="ownerNo.countryCode" numberName="ownerNo.phoneNo" grid={{ xs: 12, md: 4 }} required />
                    <CommonValidationTextField name="customerCareNumber" label="Customer Care Number" type="number" grid={{ xs: 12, md: 4 }} />
                  </Grid>
                </CommonCard>

                {/* COMMUNICATION */}
                <CommonCard title="Communication Details" grid={{ xs: 12 }}>
                  <Grid container spacing={2} sx={{ p: 2 }}>
                    <CommonValidationTextField name="address" label="Address" grid={{ xs: 12, md: 4 }} multiline required />
                    <CommonValidationSelect name="country" label="Country" disabled options={CountryOptions} required grid={{ xs: 12, md: 4 }} />
                    <CommonValidationSelect name="state" label="State" disabled={!values?.country} options={StateOptions} grid={{ xs: 12, md: 4 }} required />
                    <CommonValidationSelect name="city" label="City" disabled={!values?.state} options={CityOptionsByState[values?.state || ""] || []} grid={{ xs: 12, md: 4 }} required />
                    <CommonValidationTextField name="pinCode" label="Pin Code" grid={{ xs: 12, md: 4 }} required />
                    <CommonValidationSelect name="timeZone" label="Time Zone" disabled options={TimeZoneOptions[values?.country || ""] || []} grid={{ xs: 12, md: 4 }} required />
                  </Grid>
                </CommonCard>

                {/* BANK */}
                <CommonCard title="Bank Details" grid={{ xs: 12 }}>
                  <Grid container spacing={2} sx={{ p: 2 }}>
                    {/* <CommonValidationTextField name="bankIFSC" label="IFSC Code" grid={{ xs: 12, md: 4 }} /> */}
                    {/* <CommonValidationTextField name="bankName" label="Bank Name" grid={{ xs: 12, md: 4 }} /> */}
                    {/* <CommonValidationTextField name="branchName" label="branch Name" grid={{ xs: 12, md: 4 }} /> */}
                    {/* <CommonValidationTextField name="accountHolderName" label="Account Holder Name" grid={{ xs: 12, md: 4 }} /> */}
                    <CommonValidationTextField name="upiId" label="UPI ID" grid={{ xs: 12, md: 4 }} />
                    {/* <CommonValidationTextField name="bankAccountNumber" label="Account No." grid={{ xs: 12, md: 4 }} /> */}
                  </Grid>
                </CommonCard>

                {/* OTHER */}
                <CommonCard title="Other Details" grid={{ xs: 12 }}>
                  <Grid container spacing={2} sx={{ p: 2 }}>
                    <CommonValidationTextField name="userName" label="User Name" grid={{ xs: 12, md: 4 }} />
                    <CommonValidationTextField name="GSTRegistrationType" label="GST Registration Type" grid={{ xs: 12, md: 4 }} />
                    <CommonValidationTextField name="GSTIdentificationNumber" label="GSTIN" grid={{ xs: 12, md: 4 }} />
                    <CommonValidationTextField name="PanNo" label="PAN No." grid={{ xs: 12, md: 4 }} />
                    <CommonValidationTextField name="taxDeductionAndCollectionAccountNumber" label="TAN No." grid={{ xs: 12, md: 4 }} />
                    <CommonValidationTextField name="webSite" label="Web Site" grid={{ xs: 12, md: 4 }} />
                    <CommonValidationTextField name="financialYear" label="Default Financial Year" grid={{ xs: 12, md: 4 }} required />
                    <CommonValidationTextField name="corporateIdentificationNumber" label="CIN No." grid={{ xs: 12, md: 4 }} />
                    <CommonValidationTextField name="letterOfUndertaking" label="LUT No." grid={{ xs: 12, md: 4 }} />
                    <CommonValidationTextField name="importerExporterCode" label="IEC No." grid={{ xs: 12, md: 4 }} />
                    <CommonValidationTextField name="outletSize" label="Outlet Size (sq. ft.)" grid={{ xs: 12, md: 4 }} />
                    <CommonValidationTextField name="fssaiNo" label="FSSAI No" grid={{ xs: 12, md: 4 }} />
                    {/* <CommonValidationTextField name="currency" label="currency" grid={{ xs: 12, md: 4 }} /> */}
                    <CommonValidationTextField name="printDateFormat" label="Print Date Format" grid={{ xs: 12, md: 4 }} />
                    <CommonValidationTextField name="decimalPoint" label="Decimal Point" grid={{ xs: 12, md: 4 }} />

                    <CommonSwitch name="allowRoundOff" label="Allow Round Off" value={values.allowRoundOff} onChange={(checked) => setFieldValue("allowRoundOff", checked)} grid={{ xs: 12 }} />
                    <CommonSwitch name="enableFeedbackModule" label="Enable Feedback Module" value={values.enableFeedbackModule} onChange={(checked) => setFieldValue("enableFeedbackModule", checked)} grid={{ xs: 12 }} />
                  </Grid>
                </CommonCard>

                <CommonCard title="Company Images" grid={{ xs: 12 }}>
                  <Grid container spacing={3} sx={{ p: 2 }}>
                    {COMPANY_IMAGES.map(({ key, label }) => (
                      <CommonFormImageBox key={key} name={key} label={label} type="image" grid={{ xs: 12, xsm: 6, xl: 3 }} onUpload={() => handleUpload(key)} onDelete={() => handleDelete()} />
                    ))}
                  </Grid>
                </CommonCard>

                {/* ACTIONS */}
                <CommonBottomActionBar save disabled={!dirty} isLoading={isEditLoading} />

                <Grid className="w-full! flex justify-end ">
                  <Box sx={{ display: "flex", justifyContent: "flex-end", gap: 2, mt: 2 }}>
                    <CommonButton variant="outlined" onClick={() => navigate(ROUTES.SETTINGS.GENERAL, { state: 1 })} title="Back" />
                    <CommonButton type="submit" variant="contained" title="Save" />
                  </Box>
                </Grid>
              </Grid>
            </Form>
          )}
        </Formik>
      </Box>
    </>
  );
};

export default CompanyForm;
