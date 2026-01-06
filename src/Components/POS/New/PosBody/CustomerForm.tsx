import { Grid } from "@mui/material";
import { Formik } from "formik";
import { Form } from "react-router-dom";
import { CommonButton, CommonPhoneNumber, CommonValidationTextField, CommonValidationDatePicker, CommonValidationSelect } from "../../../../Attribute";
import { PAGE_TITLE } from "../../../../Constants";
import { CityOptionsByState, CountryOptions, GST_TYPE, StateOptions } from "../../../../Data";
import { useAppDispatch, useAppSelector } from "../../../../Store/hooks";
import { setCustomerModal } from "../../../../Store/Slices/ModalSlice";
import type { CustomerFormValues } from "../../../../Types";
import { CustomerFormSchema } from "../../../../Utils/ValidationSchemas";
import { CommonModal } from "../../../Common";

const CustomerForm = () => {
  const { isCustomerModal } = useAppSelector((state) => state.modal);
  const dispatch = useAppDispatch();

  const open = isCustomerModal.open;
  const pageMode = isCustomerModal.data ? "EDIT" : "ADD";

  const initialValues: CustomerFormValues = {
    name: isCustomerModal.data?.name || "",
    phoneNo: { countryCode: isCustomerModal.data?.phoneNo?.countryCode || "", phoneNo: isCustomerModal.data?.phoneNo?.phoneNo || "" },
    dateOfBirth: isCustomerModal.data?.dateOfBirth || "",
    anniversaryDate: isCustomerModal.data?.anniversaryDate || "",
    email: isCustomerModal.data?.email || "",
    address: isCustomerModal.data?.address || "",
    country: "India",
    state: isCustomerModal.data?.state || "",
    city: isCustomerModal.data?.city || "",
    gstType: isCustomerModal.data?.gstType || "",
    gstNo: isCustomerModal.data?.gstNo || "",
    gstName: isCustomerModal.data?.gstName || "",
    gstAddress: isCustomerModal.data?.gstAddress || "",
  };

  const handleClose = () => dispatch(setCustomerModal({ open: false, data: null }));

  const handleSubmit = (values: CustomerFormValues) => {
    console.log(values);
  };

  return (
    <>
      <CommonModal isOpen={open} title={PAGE_TITLE.CUSTOMER[pageMode]} onClose={() => handleClose()} className="max-w-[1000px]">
        <Formik<CustomerFormValues> enableReinitialize initialValues={initialValues} validationSchema={CustomerFormSchema} onSubmit={handleSubmit}>
          {({ values, dirty }) => (
            <Form noValidate>
              <Grid container spacing={2} py={1}>
                <CommonValidationTextField name="name" label="Name" required grid={{ xs: 12, md: 4 }} />
                <CommonPhoneNumber label="Phone No." countryCodeName="phoneNo.countryCode" numberName="phoneNo.phoneNo" grid={{ xs: 12, md: 4 }} required />
                <CommonPhoneNumber label="WhatsApp No." countryCodeName="phoneNo.countryCode" numberName="phoneNo.phoneNo" grid={{ xs: 12, md: 4 }} />
                <CommonValidationDatePicker name="dateOfBirth" label="Date Of Birth" grid={{ xs: 12, md: 4 }} />
                <CommonValidationDatePicker name="anniversaryDate" label="Anniversary Date" grid={{ xs: 12, md: 4 }} />
                <CommonValidationTextField name="email" label="Email" grid={{ xs: 12, md: 4 }} />
                <CommonValidationTextField name="address" label="Address Line 1" grid={{ xs: 12, md: 4 }} />
                <CommonValidationSelect name="country" label="Country" options={CountryOptions} grid={{ xs: 12, md: 4 }} />
                <CommonValidationSelect name="state" label="State" disabled={!values?.country} options={StateOptions} grid={{ xs: 12, md: 4 }} />
                <CommonValidationSelect name="city" label="City" disabled={!values?.state} options={CityOptionsByState[values?.state || ""] || []} grid={{ xs: 12, md: 4 }} />
                <CommonValidationTextField name="pinCode" label="Pin Code" grid={{ xs: 12, md: 4 }} />
                <CommonValidationSelect name="gstType" label="GST Type" options={GST_TYPE} grid={{ xs: 12, md: 4 }} />
                <CommonValidationTextField name="gstin" label="GSTIN" grid={{ xs: 12, md: 4 }} />
                <Grid size={12} sx={{ display: "flex", gap: 2, justifyContent: "center" }}>
                  <CommonButton variant="outlined" onClick={() => handleClose()} title="Cancel" />
                  <CommonButton type="submit" variant="contained" title="Save" loading={false} disabled={!dirty} />
                </Grid>
              </Grid>
            </Form>
          )}
        </Formik>
      </CommonModal>
    </>
  );
};

export default CustomerForm;
