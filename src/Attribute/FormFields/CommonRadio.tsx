import { FormControl, FormControlLabel, FormHelperText, FormLabel, Grid, Radio, RadioGroup } from "@mui/material";
import { useField } from "formik";
import type { FC } from "react";
import type { CommonRadioProps, CommonValidationRadioProps } from "../../Types";

export const CommonValidationRadio: FC<CommonValidationRadioProps> = ({ name, label, options, row = true, required, disabled, grid }) => {
  const [field, meta, helpers] = useField<string>(name);

  const Input = (
    <FormControl error={meta.touched && Boolean(meta.error)} disabled={disabled}>
      {label && <FormLabel required={required}>{label}</FormLabel>}

      <RadioGroup row={row} value={field.value ?? ""} onChange={(e) => helpers.setValue(e.target.value)} onBlur={() => helpers.setTouched(true)}>
        {options.map((opt) => (
          <FormControlLabel key={opt.value} value={opt.value} control={<Radio />} label={opt.label} />
        ))}
      </RadioGroup>

      {meta.touched && meta.error && <FormHelperText>{meta.error}</FormHelperText>}
    </FormControl>
  );

  return grid ? <Grid size={grid}>{Input}</Grid> : Input;
};


export const CommonRadio: FC<CommonRadioProps> = ({ label, value, options, onChange, row = true, disabled, grid }) => {
  const Input = (
    <FormControl disabled={disabled}>
      {label && <FormLabel>{label}</FormLabel>}

      <RadioGroup row={row} value={value} onChange={(e) => onChange(e.target.value)}>
        {options.map((opt) => (
          <FormControlLabel key={opt.value} value={opt.value} control={<Radio />} label={opt.label} />
        ))}
      </RadioGroup>
    </FormControl>
  );

  return grid ? <Grid size={grid}>{Input}</Grid> : Input;
};
