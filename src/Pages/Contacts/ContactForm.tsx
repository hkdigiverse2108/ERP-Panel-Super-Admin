import { Box, Grid, RadioGroup, FormControlLabel, Radio } from "@mui/material";
import { Formik, Form } from "formik";
import { useLocation, useNavigate } from "react-router-dom";
import { CommonCard } from "../../Components/Common";
import { CommonValidationTextField, CommonButton } from "../../Attribute";

const ContactForm = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const { data, type } = location.state || {};
  // type = customer | vendor | transport

  return (
    <Box sx={{ p: { xs: 2, md: 3 } }}>
      <Box sx={{ mb: 3 }}>
        <h2>{data ? "Edit" : "Add"} Contact</h2>
      </Box>

      <Formik
        initialValues={{
          //  GENERAL DETAILS
          name: data?.name || "",
          email: data?.email || "",
          companyName: data?.companyName || "",
          mobileNo: data?.mobileNo || "",
          whatsappNo: data?.whatsappNo || "",
          panNo: data?.panNo || "",
          customerCategory: data?.customerCategory || "",
          paymentMode: data?.paymentMode || "",
          paymentTerms: data?.paymentTerms || "",
          openingBalance: data?.openingBalance || "",

          customerType: data?.customerType || "retailer",
          vendorType: data?.vendorType || "manufacturer",

          //  ADDRESS DETAILS
          gstType: data?.gstType || "",
          gstin: data?.gstin || "",
          addressName: data?.addressName || "",
          addressCompany: data?.addressCompany || "",
          addressContact: data?.addressContact || "",
          addressEmail: data?.addressEmail || "",
          address: data?.address || "",
          country: data?.country || "",
          state: data?.state || "",
          city: data?.city || "",
          pinCode: data?.pinCode || "",
        }}
        onSubmit={(values) => {
          console.log("Contact Form Data:", values);
        }}
      >
        {({ values, setFieldValue }) => (
          <Form>
            <Grid container spacing={2}>
              {/*  GENERAL DETAILS  */}
              <CommonCard title="General Details" grid={{ xs: 12 }}>
                <Grid container spacing={2} sx={{ p: 2 }}>
                  <CommonValidationTextField name="name" label="Name" required grid={{ xs: 12, md: 6 }} />
                  <CommonValidationTextField name="email" label="Email" grid={{ xs: 12, md: 6 }} />
                  <CommonValidationTextField name="companyName" label="Company Name" required grid={{ xs: 12, md: 6 }} />
                  <CommonValidationTextField name="mobileNo" label="Mobile No" type="number" required grid={{ xs: 12, md: 6 }} />
                  <CommonValidationTextField name="whatsappNo" label="WhatsApp No" type="number" required grid={{ xs: 12, md: 6 }} />
                  <CommonValidationTextField name="panNo" label="PAN No" required grid={{ xs: 12, md: 6 }} />

                  <CommonValidationTextField name="paymentMode" label="Payment Mode" required grid={{ xs: 12, md: 6 }} />
                  <CommonValidationTextField name="paymentTerms" label="Payment Terms" grid={{ xs: 12, md: 6 }} />
                  <CommonValidationTextField name="openingBalance" label="Opening Balance" type="number" grid={{ xs: 12, md: 6 }} />
                  <CommonValidationTextField name="customerCategory" label="Customer Category" grid={{ xs: 12, md: 6 }} />

                  {/*  CUSTOMER TYPE */}
                  {type === "customer" && (
                    <Grid size="auto">
                      <label className="font-semibold">Customer Type</label>
                      <RadioGroup row value={values.customerType} onChange={(e) => setFieldValue("customerType", e.target.value)}>
                        <FormControlLabel value="retailer" control={<Radio />} label="Retailer" />
                        <FormControlLabel value="wholesaler" control={<Radio />} label="Wholesaler" />
                        <FormControlLabel value="other" control={<Radio />} label="Other" />
                      </RadioGroup>
                    </Grid>
                  )}

                  {/*VENDOR TYPE */}
                  {type === "vendor" && (
                    <Grid size="auto">
                      <label className="font-semibold">Vendor Type</label>
                      <RadioGroup row value={values.vendorType} onChange={(e) => setFieldValue("vendorType", e.target.value)}>
                        <FormControlLabel value="manufacturer" control={<Radio />} label="Manufacturer" />
                        <FormControlLabel value="stockist" control={<Radio />} label="Stockist" />
                        <FormControlLabel value="trader" control={<Radio />} label="Trader" />
                      </RadioGroup>
                    </Grid>
                  )}
                </Grid>
              </CommonCard>

              {/*  ADDRESS DETAILS */}
              <CommonCard title="Address Details" grid={{ xs: 12 }}>
                <Grid container spacing={2} sx={{ p: 2 }}>
                  <CommonValidationTextField name="gstType" label="GST Type" required grid={{ xs: 12, md: 6 }} />
                  <CommonValidationTextField name="gstin" label="GSTIN" required grid={{ xs: 12, md: 6 }} />
                  <CommonValidationTextField name="addressName" label="Name" required grid={{ xs: 12, md: 6 }} />
                  <CommonValidationTextField name="addressCompany" label="Company Name" required grid={{ xs: 12, md: 6 }} />
                  <CommonValidationTextField name="addressContact" label="Contact No" required grid={{ xs: 12, md: 6 }} />
                  <CommonValidationTextField name="addressEmail" label="Email" required grid={{ xs: 12, md: 6 }} />
                  <CommonValidationTextField name="address" label="Address" required grid={{ xs: 12 }} />

                  <CommonValidationTextField name="country" label="Country" required grid={{ xs: 12, md: 4 }} />
                  <CommonValidationTextField name="state" label="State" required grid={{ xs: 12, md: 4 }} />
                  <CommonValidationTextField name="city" label="City" required grid={{ xs: 12, md: 4 }} />
                  <CommonValidationTextField name="pinCode" label="Pin Code" required grid={{ xs: 12, md: 4 }} />
                </Grid>
              </CommonCard>

              {/*  ACTION BUTTONS*/}
              <Grid className="w-full! flex justify-end ">
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "flex-end",
                    gap: 2,
                    mt: 2,
                  }}
                >
                  <CommonButton variant="outlined" onClick={() => navigate(-1)} title="Back" />

                  <CommonButton type="submit" variant="contained" title="Save" />
                </Box>
              </Grid>
            </Grid>
          </Form>
        )}
      </Formik>
    </Box>
  );
};

export default ContactForm;
  