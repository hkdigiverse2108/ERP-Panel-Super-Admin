import { Box } from "@mui/material";
import { CommonValidationDatePicker, CommonValidationSelect, CommonValidationTextField } from "../../Attribute";
import { SHIPPING_TYPE_OPTIONS } from "../../Data";

interface CommonShippingDetailsProps {
  namePrefix?: string;
  gridProps?: any;
}

const CommonShippingDetails = ({ namePrefix = "shippingDetails", gridProps = {} }: CommonShippingDetailsProps) => {
  const getFieldName = (field: string) => (namePrefix ? `${namePrefix}.${field}` : field);

  return (
    <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", md: "repeat(4, 1fr)" }, gap: 2, ...gridProps }}>
      <CommonValidationSelect name={getFieldName("shippingType")} label="Shipping Type" options={SHIPPING_TYPE_OPTIONS} />
      <CommonValidationDatePicker name={getFieldName("shippingDate")} label="Shipping Date" />
      <CommonValidationTextField name={getFieldName("referenceNo")} label="Reference No" />
      <CommonValidationDatePicker name={getFieldName("transportDate")} label="Transport Date" />
      <CommonValidationTextField name={getFieldName("modeOfTransport")} label="Mode Of Transport" />
      <CommonValidationTextField name={getFieldName("vehicleNo")} label="Vehicle No" />
      <CommonValidationTextField name={getFieldName("weight")} label="Weight" type="number" />
      <CommonValidationTextField name={getFieldName("transporterId")} label="Transporter ID" />
    </Box>
  );
};

export default CommonShippingDetails;
