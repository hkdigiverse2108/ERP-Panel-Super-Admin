import { FormLabel, Grid } from "@mui/material";
import { MuiTelInput, type MuiTelInputInfo } from "mui-tel-input";
import { useField } from "formik";
import { useState, type FC } from "react";
import type { CommonPhoneNumberProps } from "../../Types";

export const CommonPhoneNumber: FC<CommonPhoneNumberProps> = ({ countryCodeName, numberName, label, required, isFormLabel = false, grid, defaultCountry = "IN", size = "small", ...props }) => {
  const [codeField, , codeHelpers] = useField(countryCodeName);
  const [numberField, meta, numberHelpers] = useField(numberName);
  const [country, setCountry] = useState(defaultCountry);

  const [isFocused, setFocused] = useState(false);

  const handleChange = (_: string, info: MuiTelInputInfo) => {
    codeHelpers.setValue(info.countryCallingCode);
    numberHelpers.setValue(info.nationalNumber);
    if (info.countryCode) setCountry(info.countryCode);
  };

  const Input = (
    <>
      {isFormLabel && label && (
        <FormLabel required={required} focused={isFocused} error={meta.touched && Boolean(meta.error)} sx={{ mb: 0.5 }}>
          {label}
        </FormLabel>
      )}

      <MuiTelInput
        {...props}
        size={size}
        required={required}
        defaultCountry={country}
        forceCallingCode={false}
        value={codeField.value && numberField.value ? `+${codeField.value}${numberField.value}` : ""}
        label={isFormLabel ? undefined : label}
        onChange={handleChange}
        onFocus={() => setFocused(true)}
        onBlur={(e) => {
          setFocused(false);
          numberField.onBlur(e);
        }}
        error={meta.touched && Boolean(meta.error)}
        helperText={meta.touched && meta.error}
        fullWidth
      />
    </>
  );

  return grid ? (
    <Grid size={grid} className="flex flex-col justify-start">
      {Input}
    </Grid>
  ) : (
    Input
  );
};
