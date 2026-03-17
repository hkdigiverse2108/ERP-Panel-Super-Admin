import { Grid, FormControl, FormHelperText } from "@mui/material";
import { TimePicker } from "@mui/x-date-pickers/TimePicker";
import { useField } from "formik";
import type { FC } from "react";
import type { CommonValidationTimePickerProps, CommonTimePickerProps } from "../../Types";
import { DateConfig } from "../../Utils";

export const CommonValidationTimePicker: FC<CommonValidationTimePickerProps> = ({ name, label, required, disabled, grid, minTime, maxTime, ampm = true, ...props }) => {
  const [field, meta, helpers] = useField(name);
  const value = field.value ? DateConfig.utc(field.value) : null;

  const Input = (
    <FormControl fullWidth error={meta.touched && Boolean(meta.error)}>
      <TimePicker
        {...props}
        className="capitalize"
        label={label}
        value={value}
        onChange={(value) => helpers.setValue(value ? DateConfig.utc(value).toISOString() : null)}
        onClose={() => helpers.setTouched(true)}
        disabled={disabled}
        minTime={minTime ? DateConfig.utc(minTime) : undefined}
        maxTime={maxTime ? DateConfig.utc(maxTime) : undefined}
        slotProps={{
          textField: {
            required,
            size: "small",
            error: meta.touched && Boolean(meta.error),
          },
        }}
        ampm={ampm}
      />

      {meta.touched && meta.error && <FormHelperText>{meta.error}</FormHelperText>}
    </FormControl>
  );

  return grid ? <Grid size={grid}>{Input}</Grid> : Input;
};

export const CommonTimePicker: FC<CommonTimePickerProps> = ({ label, value, onChange, disabled, grid, minTime, maxTime, ampm = true, ...props }) => {
  const timeValue = value ? DateConfig.utc(value) : null;
  const Input = (
    <FormControl fullWidth>
      <TimePicker
        {...props}
        className="capitalize"
        label={label}
        value={timeValue}
        onChange={(value) => onChange?.(value ? DateConfig.utc(value).toISOString() : null)}
        disabled={disabled}
        minTime={minTime ? DateConfig.utc(minTime) : undefined}
        maxTime={maxTime ? DateConfig.utc(maxTime) : undefined}
        slotProps={{
          textField: {
            size: "small",
          },
        }}
        ampm={ampm}
      />
    </FormControl>
  );

  return grid ? <Grid size={grid}>{Input}</Grid> : Input;
};
