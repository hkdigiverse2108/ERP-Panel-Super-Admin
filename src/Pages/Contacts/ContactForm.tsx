import { Box, Grid } from "@mui/material";
import { FieldArray, Form, Formik, type FormikHelpers } from "formik";
import { useLocation, useNavigate } from "react-router-dom";
import { Mutations, Queries } from "../../Api";
import { CommonValidationTextField as CommonTextField, CommonSwitch, CommonPhoneNumber, CommonValidationSelect, CommonValidationRadio, CommonValidationDatePicker, CommonButton } from "../../Attribute";
import { CommonBottomActionBar, CommonBreadcrumbs, CommonCard, DependentSelect } from "../../Components/Common";
import { PAGE_TITLE } from "../../Constants";
import { BREADCRUMBS, CONTACT_CATEGORY_CUSTOMER, CONTACT_CATEGORY_SUPPLIER, CONTACT_TYPE, CUSTOMER_CATEGORY, GST_TYPE, PAYMENT_MODE, PAYMENT_TERMS } from "../../Data";
import type { ContactAddressApi, ContactFormValues, Address } from "../../Types";
import { GenerateOptions, GetChangedFields, RemoveEmptyFields } from "../../Utils";
import { getContactFormSchema } from "../../Utils/ValidationSchemas";
import { useDependentReset, usePagePermission } from "../../Utils/Hooks";
import { useEffect } from "react";

const AddressDependencyHandler = ({ count }: { count: number }) => {
  const dependencies = [];

  for (let i = 0; i < count; i++) {
    dependencies.push({ when: `address.${i}.country`, reset: [`address.${i}.state`, `address.${i}.city`] }, { when: `address.${i}.state`, reset: [`address.${i}.city`] });
  }

  useDependentReset(dependencies);

  return null;
};

const ContactForm = () => {
  const { data: companyData, isLoading: companyDataLoading } = Queries.useGetCompanyDropdown();
  const location = useLocation();
  const navigate = useNavigate();
  const { data } = location.state || {};
  const permission = usePagePermission(PAGE_TITLE.CONTACT.BASE);

  const { mutate: addContact, isPending: isAddLoading } = Mutations.useAddContacts();
  const { mutate: editContact, isPending: isEditLoading } = Mutations.useEditContacts();

  const isEditing = Boolean(data?._id);
  const pageMode = isEditing ? "EDIT" : "ADD";

  const bank = data?.bankDetails;

  const emptyAddress: Address = {
    gstType: "UnRegistered",
    gstIn: "",
    contactFirstName: "",
    contactLastName: "",
    contactEmail: "",
    addressLine1: "",
    addressLine2: "",
    country: "",
    state: "",
    city: "",
    pinCode: "",
    contactCompanyName: "",
    contactNo: {
      countryCode: "",
      phoneNo: "",
    },
  };

  const mapAddress = (addr?: ContactAddressApi) => ({
    gstType: addr?.gstType || "UnRegistered",
    gstIn: addr?.gstIn || "",
    contactFirstName: addr?.contactFirstName || "",
    contactLastName: addr?.contactLastName || "",
    contactEmail: addr?.contactEmail || "",
    addressLine1: addr?.addressLine1 || "",
    addressLine2: addr?.addressLine2 || "",
    country: addr?.country?._id || "",
    state: addr?.state?._id || "",
    city: addr?.city?._id || "",
    pinCode: addr?.pinCode || "",
    contactCompanyName: addr?.contactCompanyName || "",

    contactNo: {
      countryCode: addr?.contactNo?.countryCode || "",
      phoneNo: addr?.contactNo?.phoneNo != null ? String(addr.contactNo.phoneNo) : "",
    },
  });

  const initialValues: ContactFormValues = {
    companyId: data?.companyId?._id || "",
    contactType: data?.contactType || "customer",
    firstName: data?.firstName || "",
    lastName: data?.lastName || "",
    email: data?.email || "",
    phoneNo: {
      countryCode: data?.phoneNo?.countryCode || "",
      phoneNo: data?.phoneNo?.phoneNo || "",
    },

    whatsappNo: {
      countryCode: data?.whatsappNo?.countryCode || "",
      phoneNo: data?.whatsappNo?.phoneNo || "",
    },

    panNo: data?.panNo || "",
    customerCategory: data?.customerCategory || "",
    paymentMode: data?.paymentMode || "",
    paymentTerms: data?.paymentTerms || "",
    openingBalance: {
      debitBalance: data?.openingBalance?.debitBalance || "",
      creditBalance: data?.openingBalance?.creditBalance || "",
    },
    customerType: data?.customerType || "",
    vendorType: data?.vendorType || "",
    isActive: data?.isActive ?? true,
    dob: data?.dob ? data.dob : "",
    anniversaryDate: data?.anniversaryDate ? data.anniversaryDate : "",
    telephoneNo: data?.telephoneNo || "",
    remarks: data?.remarks || "",
    supplierType: data?.supplierType || "",
    transporterId: data?.transporterId || "",
    companyName: data?.companyName || "",
    tanNo: data?.tanNo || "",

    // ADDRESS DETAILS
    address: data?.address?.length ? data.address.map(mapAddress) : [mapAddress()],

    //BANK DETAILS
    bankDetails: {
      ifscCode: bank?.ifscCode || "",
      name: bank?.name || "",
      branch: bank?.branch || "",
      accountNumber: bank?.accountNumber || "",
    },
  };

  const handleSubmit = async (values: ContactFormValues, { resetForm }: FormikHelpers<ContactFormValues>) => {
    const { _submitAction, ...rest } = values;

    const handleSuccess = () => {
      if (_submitAction === "saveAndNew") {
        resetForm();
      } else {
        navigate(-1);
      }
    };

    if (isEditing) {
      const changedFields = GetChangedFields(rest, data);
      await editContact({ ...changedFields, contactId: data._id }, { onSuccess: handleSuccess });
    } else {
      await addContact(RemoveEmptyFields(rest), { onSuccess: handleSuccess });
    }
  };

  const topContent = (
    <CommonValidationRadio
      name="contactType"
      options={CONTACT_TYPE.map((opt) => ({
        label: opt,
        value: opt,
        disabled: isEditing && opt !== data?.contactType,
      }))}
      grid={{ xs: "auto" }}
    />
  );

  useEffect(() => {
    const hasAccess = isEditing ? permission.edit : permission.add;
    if (!hasAccess) navigate(-1);
  }, [isEditing, permission, navigate]);

  return (
    <>
      <CommonBreadcrumbs title={PAGE_TITLE.CONTACT[pageMode]} maxItems={3} breadcrumbs={BREADCRUMBS.CONTACT[pageMode]} />
      <Box sx={{ p: { xs: 2, md: 3 }, mb: 8 }}>
        <Formik initialValues={initialValues} validationSchema={getContactFormSchema} onSubmit={handleSubmit}>
          {({ resetForm, setFieldValue, dirty, values }) => (
            <Form noValidate>
              <AddressDependencyHandler count={values?.address?.length || 0} />
              <Grid container spacing={2}>
                {/* GENERAL DETAILS */}
                <CommonCard topContent={topContent} title="General Details" grid={{ xs: 12 }}>
                  <Grid container spacing={2} sx={{ p: 2 }}>
                    <CommonValidationSelect name="companyId" label="Company Name" required isLoading={companyDataLoading} options={GenerateOptions(companyData?.data)} grid={{ xs: 12, md: 4 }} />
                    <CommonTextField name="firstName" label="First Name" required grid={{ xs: 12, md: 4 }} />
                    <CommonTextField name="lastName" label="Last Name" required grid={{ xs: 12, md: 4 }} />
                    <CommonTextField name="email" label="Email" grid={{ xs: 12, md: 4 }} />
                    <CommonPhoneNumber label="Phone No." countryCodeName="phoneNo.countryCode" numberName="phoneNo.phoneNo" grid={{ xs: 12, md: 4 }} required />
                    {["supplier", "customer"].includes(values?.contactType || "") && <CommonPhoneNumber label="Whatsapp No." countryCodeName="whatsappNo.countryCode" numberName="whatsappNo.phoneNo" grid={{ xs: 12, md: 4 }} />}
                    <CommonTextField name="telephoneNo" label="Telephone No" required grid={{ xs: 12, md: 4 }} />
                    <CommonTextField name="remarks" label="Remarks" grid={{ xs: 12, md: 4 }} />
                    <CommonTextField name="panNo" label="PAN No" required grid={{ xs: 12, md: 4 }} />
                    <CommonValidationSelect name="paymentMode" label="Payment Mode" options={PAYMENT_MODE} required grid={{ xs: 12, md: 4 }} />
                    <CommonValidationSelect name="paymentTerms" label="Payment Terms" options={PAYMENT_TERMS} grid={{ xs: 12, md: 4 }} />
                    <CommonTextField name="openingBalance.debitBalance" label="Debit Balance" grid={{ xs: 12, md: 4 }} />
                    <CommonTextField name="openingBalance.creditBalance" label="Credit Balance" grid={{ xs: 12, md: 4 }} />
                    <CommonValidationDatePicker name="dob" label="Date Of Birth" grid={{ xs: 12, md: 4 }} />
                    <CommonValidationDatePicker name="anniversaryDate" label="Anniversary Date" grid={{ xs: 12, md: 4 }} />
                    {values?.contactType === "customer" && (
                      <>
                        <CommonValidationSelect name="customerCategory" label="Customer Category" options={CUSTOMER_CATEGORY} grid={{ xs: 12, md: 4 }} />
                        <CommonValidationRadio name="customerType" required label="Customer Type" options={CONTACT_CATEGORY_CUSTOMER} row grid={{ xs: 12 }} />
                      </>
                    )}

                    {values?.contactType === "supplier" && (
                      <>
                        <CommonTextField name="tanNo" label="Tan No" required grid={{ xs: 12, md: 4 }} />
                        <CommonValidationRadio name="supplierType" label="Supplier Type" required options={CONTACT_CATEGORY_SUPPLIER} row grid={{ xs: 12 }} />
                        <CommonTextField name="bankDetails.ifscCode" label="Bank IfscCode" grid={{ xs: 12, md: 4 }} />
                        <CommonTextField name="bankDetails.name" label="Bank Name" grid={{ xs: 12, md: 4 }} />
                        <CommonTextField name="bankDetails.branch" label="Bank Branch" grid={{ xs: 12, md: 4 }} />
                        <CommonTextField name="bankDetails.accountNumber" label="Account Number" grid={{ xs: 12, md: 4 }} />
                      </>
                    )}
                    {values?.contactType === "transporter" && <CommonTextField name="transporterId" label="Transporter Id" required grid={{ xs: 12, md: 4 }} />}
                  </Grid>
                </CommonCard>

                {/*  ADDRESS DETAILS */}
                <CommonCard title="Address Details" grid={{ xs: 12 }}>
                  <FieldArray name="address">
                    {({ push, remove }) => (
                      <Box p={2}>
                        {values?.address?.map((_, index) => {
                          return (
                            <Box key={index} mb={2} border="1px solid #ddd" p={2} borderRadius={1}>
                              <Grid container spacing={2}>
                                <CommonValidationSelect name={`address.${index}.gstType`} label="GST Type" options={GST_TYPE} grid={{ xs: 12, md: 4 }} />
                                <CommonTextField name={`address.${index}.gstIn`} label="GSTIN" required disabled={values.address?.[index]?.gstType === "UnRegistered"} grid={{ xs: 12, md: 4 }} />
                                <CommonTextField name={`address.${index}.contactFirstName`} label="Contact First Name" required grid={{ xs: 12, md: 4 }} />
                                <CommonTextField name={`address.${index}.contactLastName`} label="Contact Last Name" grid={{ xs: 12, md: 4 }} />
                                <CommonTextField name={`address.${index}.contactCompanyName`} label="Company Name" grid={{ xs: 12, md: 4 }} />
                                <CommonPhoneNumber label="Phone No." countryCodeName={`address.${index}.contactNo.countryCode`} numberName={`address.${index}.contactNo.phoneNo`} grid={{ xs: 12, md: 4 }} />

                                <CommonTextField name={`address.${index}.contactEmail`} label="Email" grid={{ xs: 12, md: 4 }} />

                                <CommonTextField name={`address.${index}.addressLine1`} label="Address Line 1" multiline grid={{ xs: 12, md: 4 }} />
                                <CommonTextField name={`address.${index}.addressLine2`} label="Address Line 2" multiline grid={{ xs: 12, md: 4 }} />

                                <DependentSelect name={`address.${index}.country`} label="Country" grid={{ xs: 12, md: 4 }} query={Queries.useGetCountryLocation} required />

                                <DependentSelect params={values?.address?.[index]?.country} name={`address.${index}.state`} label="State" grid={{ xs: 12, md: 4 }} query={Queries.useGetStateLocation} disabled={!values?.address?.[index]?.country} required />

                                <DependentSelect params={values?.address?.[index]?.state} name={`address.${index}.city`} label="City" grid={{ xs: 12, md: 4 }} query={Queries.useGetCityLocation} disabled={!values?.address?.[index]?.state} required />

                                <CommonTextField name={`address.${index}.pinCode`} label="Pin Code" grid={{ xs: 12, md: 4 }} />

                                {(values?.address?.length || 0) > 1 && (
                                  <Grid size={12}>
                                    <CommonButton onClick={() => remove(index)} variant="outlined" color="error">
                                      Remove Address
                                    </CommonButton>
                                  </Grid>
                                )}
                              </Grid>
                            </Box>
                          );
                        })}

                        <CommonButton variant="outlined" onClick={() => push(emptyAddress)}>
                          + Add New Address
                        </CommonButton>
                      </Box>
                    )}
                  </FieldArray>
                </CommonCard>

                {!isEditing && <CommonSwitch name="isActive" label="Is Active" grid={{ xs: 12 }} />}

                <CommonBottomActionBar
                  save={isEditing}
                  clear={!isEditing}
                  disabled={!dirty}
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

export default ContactForm;
