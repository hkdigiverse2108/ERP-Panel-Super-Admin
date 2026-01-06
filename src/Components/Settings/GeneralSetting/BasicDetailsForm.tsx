 import { Grid } from "@mui/material";
import { CommonValidationTextField } from "../../../Attribute";

const BasicDetailsForm = () => {
  return (
    <Grid container spacing={2}>
      <CommonValidationTextField name="name" label="Company Name" required grid={{ xs: 12, md: 6 }} />
      <CommonValidationTextField name="displayName" label="Display Name" grid={{ xs: 12, md: 6 }} />
      <CommonValidationTextField name="contactName" label="Contact Name" grid={{ xs: 12, md: 6 }} />
      <CommonValidationTextField name="mobile" label="Mobile No" grid={{ xs: 12, md: 6 }} />
      <CommonValidationTextField name="email" label="Email" grid={{ xs: 12, md: 6 }} />
    </Grid>
  );
};

export default BasicDetailsForm;
