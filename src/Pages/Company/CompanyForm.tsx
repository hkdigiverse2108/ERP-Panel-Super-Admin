import { Box, Grid } from "@mui/material";
import { Form, Formik, useFormikContext, type FormikHelpers, type FormikValues } from "formik";
import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Mutations, Queries } from "../../Api";
import { CommonPhoneNumber, CommonValidationSelect, CommonValidationSwitch, CommonValidationTextField } from "../../Attribute";
import { CommonBottomActionBar, CommonBreadcrumbs, CommonCard, DependentSelect } from "../../Components/Common";
import { CommonFormImageBox } from "../../Components/Common/CommonUploadImage/CommonImageBox";
import { PAGE_TITLE } from "../../Constants";
import { ACCOUNTING_TYPE, BREADCRUMBS, DATE_FORMATS } from "../../Data";
import { useAppDispatch, useAppSelector } from "../../Store/hooks";
import { setSelectedFiles, setUploadModal } from "../../Store/Slices/ModalSlice";
import type { CompanyFormValues, Params } from "../../Types";
import type { BankBase } from "../../Types/Bank";
import { GenerateOptions, GetChangedFields, RemoveEmptyFields } from "../../Utils";
import { CompanyFormSchemas } from "../../Utils/ValidationSchemas";

type CompanyImageKey = "logo" | "waterMark" | "reportFormatLogo" | "authorizedSignature";

const COMPANY_IMAGES = [
  { key: "logo", label: "Logo" },
  { key: "waterMark", label: "Watermark" },
  { key: "reportFormatLogo", label: "Report Format Logo" },
  { key: "authorizedSignature", label: "Authorized Signature" },
] as const;

const CompanyForm = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { data } = location.state || {};
  const [activeKey, setActiveKey] = useState<CompanyImageKey | null>(null);

  const { data: bankData, isLoading: bankDataLoading } = Queries.useGetBankDropdown({ companyFilter: data?._id }, Boolean(data?._id));

  const { mutate: addCompany, isPending: isAddLoading } = Mutations.useAddCompany();
  const { mutate: editCompany, isPending: isEditLoading } = Mutations.useEditCompany();

  const isEditing = Boolean(data?._id);
  const pageMode = isEditing ? "EDIT" : "ADD";

  const BANK_UI_FIELDS: (keyof CompanyFormValues)[] = ["bankName", "bankIFSC", "branchName", "accountHolderName", "bankAccountNumber", "upiId"];

  const initialValues: CompanyFormValues = {
    accountingType: data?.accountingType || "",
    name: data?.name || "",
    displayName: data?.displayName || "",
    contactName: data?.contactName || "",
    email: data?.email || "",
    supportEmail: data?.supportEmail || "",
    phoneNo: {
      countryCode: data?.phoneNo?.countryCode || "",
      phoneNo: data?.phoneNo?.phoneNo || "",
    },
    ownerNo: {
      countryCode: data?.ownerNo?.countryCode || "",
      phoneNo: data?.ownerNo?.phoneNo || "",
    },
    customerCareNumber: data?.customerCareNumber || "",

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

    userName: data?.userName || "",
    GSTRegistrationType: data?.GSTRegistrationType || "",
    GSTIdentificationNumber: data?.GSTIdentificationNumber || "",
    PanNo: data?.PanNo || "",
    webSite: data?.webSite || "",
    financialYear: data?.financialYear || "",
    corporateIdentificationNumber: data?.corporateIdentificationNumber || "",
    letterOfUndertaking: data?.letterOfUndertaking || "",
    importerExporterCode: data?.importerExporterCode || "",
    outletSize: data?.outletSize || "",
    fssaiNo: data?.fssaiNo || null,
    taxDeductionAndCollectionAccountNumber: data?.taxDeductionAndCollectionAccountNumber || "",
    printDateFormat: data?.printDateFormat || "",
    decimalPoint: data?.decimalPoint || "",

    enableFeedbackModule: data?.enableFeedbackModule === true || data?.enableFeedbackModule === "true",
    allowRoundOff: data?.allowRoundOff === true || data?.allowRoundOff === "true",
    logo: data?.logo || null,
    waterMark: data?.waterMark || null,
    reportFormatLogo: data?.reportFormatLogo || null,
    authorizedSignature: data?.authorizedSignature || null,
  };

  const FormikImageSync = <T extends FormikValues>({ activeKey, clearActiveKey }: Params) => {
    const { selectedFiles } = useAppSelector((state) => state.modal);
    const { setFieldValue } = useFormikContext<T>();

    useEffect(() => {
      if (!selectedFiles[0] || !activeKey) return;

      setFieldValue(activeKey, selectedFiles[0]);

      dispatch(setSelectedFiles([]));
      clearActiveKey();
    }, [selectedFiles, activeKey, setFieldValue, clearActiveKey]);

    return null;
  };

  const FormikBankSync = ({ bankData }: { bankData?: BankBase[] }) => {
    const { values, setFieldValue } = useFormikContext<CompanyFormValues>();

    const setBankFields = (bank?: BankBase) => {
      setFieldValue("bankName", bank?.name ?? "");
      setFieldValue("bankIFSC", bank?.ifscCode ?? "");
      setFieldValue("branchName", bank?.branchName ?? "");
      setFieldValue("accountHolderName", bank?.accountHolderName ?? "");
      setFieldValue("bankAccountNumber", bank?.bankAccountNumber ?? "");
      setFieldValue("upiId", bank?.upiId ?? "");
    };

    useEffect(() => {
      if (!values.bankId) return setBankFields();

      const bank = bankData?.find((b) => b._id === values.bankId);
      setBankFields(bank);
    }, [values.bankId, bankData]);

    return null;
  };

  const handleUpload = (key: CompanyImageKey) => {
    setActiveKey(key);
    dispatch(setUploadModal({ open: true, type: "image" }));
  };

  const handleSubmit = async (values: CompanyFormValues, { resetForm }: FormikHelpers<CompanyFormValues>) => {
    const { _submitAction, ...rest } = values;
    BANK_UI_FIELDS.forEach((field) => delete (rest as CompanyFormValues)[field]);

    const payload = { ...rest };

    const handleSuccess = () => {
      if (_submitAction === "saveAndNew") resetForm();
      else navigate(-1);
    };
    if (isEditing) {
      const changedFields = GetChangedFields(payload, data);
      await editCompany({ ...changedFields, companyId: data._id }, { onSuccess: handleSuccess });
    } else {
      await addCompany(RemoveEmptyFields(payload), { onSuccess: handleSuccess });
    }
  };

  return (
    <>
      <CommonBreadcrumbs title={PAGE_TITLE.COMPANY[pageMode]} maxItems={4} breadcrumbs={BREADCRUMBS.COMPANY[pageMode]} />
      <Box sx={{ p: { xs: 2, md: 4 }, mb: 8 }}>
        <Formik<CompanyFormValues> enableReinitialize initialValues={initialValues} validationSchema={CompanyFormSchemas} onSubmit={handleSubmit}>
          {({ dirty, values }) => (
            <Form noValidate>
              <FormikImageSync activeKey={activeKey} clearActiveKey={() => setActiveKey(null)} />
              <FormikBankSync bankData={bankData?.data} />
              <Grid container spacing={2}>
                {/* BASIC DETAILS */}
                <CommonCard title="Basic Details" grid={{ xs: 12 }}>
                  <Grid container spacing={2} sx={{ p: 2 }}>
                    <CommonValidationSelect name="accountingType" label="accountingType" options={ACCOUNTING_TYPE} required grid={{ xs: 12, md: 4 }} />
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
                    <CommonValidationTextField name="address.address" label="Address" grid={{ xs: 12, md: 4 }} multiline required />
                    <DependentSelect name="address.country" label="Country" grid={{ xs: 12, md: 4 }} query={Queries.useGetCountryLocation} required />
                    <DependentSelect params={values?.address?.country} name="address.state" label="State" grid={{ xs: 12, md: 4 }} query={Queries.useGetStateLocation} disabled={!values?.address?.country} required />
                    <DependentSelect params={values?.address?.state} name="address.city" label="City" grid={{ xs: 12, md: 4 }} query={Queries.useGetCityLocation} disabled={!values?.address?.state} required />
                    <CommonValidationTextField name="address.pinCode" label="Pin Code" type="number" grid={{ xs: 12, md: 4 }} required />
                  </Grid>
                </CommonCard>

                {/* BANK */}
                <CommonCard title="Bank Details" grid={{ xs: 12 }}>
                  <Grid container spacing={2} sx={{ p: 2 }}>
                    <CommonValidationSelect name="bankId" label="Select Bank" options={GenerateOptions(bankData?.data)} isLoading={bankDataLoading} grid={{ xs: 12, md: 4 }} />
                    <CommonValidationTextField name="bankIFSC" label="IFSC Code" grid={{ xs: 12, md: 4 }} disabled />
                    <CommonValidationTextField name="bankName" label="Bank Name" grid={{ xs: 12, md: 4 }} disabled />
                    <CommonValidationTextField name="branchName" label="branch Name" grid={{ xs: 12, md: 4 }} disabled />
                    <CommonValidationTextField name="accountHolderName" label="Account Holder Name" grid={{ xs: 12, md: 4 }} disabled />
                    <CommonValidationTextField name="upiId" label="UPI ID" grid={{ xs: 12, md: 4 }} disabled />
                    <CommonValidationTextField name="bankAccountNumber" label="Account No." grid={{ xs: 12, md: 4 }} disabled />
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
                    <CommonValidationSelect name="printDateFormat" label="Print Date Format" options={DATE_FORMATS} grid={{ xs: 12, md: 4 }} />
                    <CommonValidationTextField name="decimalPoint" label="Decimal Point" grid={{ xs: 12, md: 4 }} />

                    <CommonValidationSwitch name="allowRoundOff" label="Allow Round Off" grid={{ xs: 12 }} />
                    <CommonValidationSwitch name="enableFeedbackModule" label="Enable Feedback Module" grid={{ xs: 12 }} />
                  </Grid>
                </CommonCard>

                <CommonCard title="Company Images" grid={{ xs: 12 }}>
                  <Grid container spacing={3} sx={{ p: 2 }}>
                    {COMPANY_IMAGES.map(({ key, label }) => (
                      <CommonFormImageBox key={key} name={key} label={label} type="image" grid={{ xs: 12, xsm: 6, xl: 3 }} onUpload={() => handleUpload(key)} />
                    ))}
                  </Grid>
                </CommonCard>

                {/* ACTIONS */}
                <CommonBottomActionBar save disabled={!dirty} isLoading={isEditLoading || isAddLoading} />
              </Grid>
            </Form>
          )}
        </Formik>
      </Box>
    </>
  );
};

export default CompanyForm;
