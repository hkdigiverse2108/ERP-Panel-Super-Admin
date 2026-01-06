import { Grid, FormControl, FormHelperText } from "@mui/material";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { useField } from "formik";
import type { FC } from "react";
import type { CommonValidationDatePickerProps, CommonDatePickerProps } from "../../Types";

export const CommonValidationDatePicker: FC<CommonValidationDatePickerProps> = ({ name, label, required, disabled, grid, minDate, maxDate, ...props }) => {
  const [field, meta, helpers] = useField(name);

  const Input = (
    <FormControl fullWidth error={meta.touched && Boolean(meta.error)}>
      <DatePicker
        {...props}
        label={label}
        value={field.value || null}
        onChange={(value) => helpers.setValue(value)}
        onClose={() => helpers.setTouched(true)}
        disabled={disabled}
        minDate={minDate}
        maxDate={maxDate}
        slotProps={{
          textField: {
            required,
            size: "small",
            error: meta.touched && Boolean(meta.error),
          },
        }}
      />

      {meta.touched && meta.error && <FormHelperText>{meta.error}</FormHelperText>}
    </FormControl>
  );

  return grid ? <Grid size={grid}>{Input}</Grid> : Input;
};

export const CommonDatePicker: FC<CommonDatePickerProps> = ({ label, value, onChange, disabled, grid, minDate, maxDate, ...props }) => {
  const Input = (
    <FormControl fullWidth>
      <DatePicker
        {...props}
        label={label}
        value={value || null}
        onChange={onChange}
        disabled={disabled}
        minDate={minDate}
        maxDate={maxDate}
        slotProps={{
          textField: {
            size: "small",
          },
        }}
      />
    </FormControl>
  );

  return grid ? <Grid size={grid}>{Input}</Grid> : Input;
};
