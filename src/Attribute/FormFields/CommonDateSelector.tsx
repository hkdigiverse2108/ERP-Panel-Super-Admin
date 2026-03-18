import { Grid, FormControl, FormHelperText } from "@mui/material";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { useField } from "formik";
import type { FC } from "react";
import type { CommonValidationDatePickerProps, CommonDatePickerProps } from "../../Types";
import { DateConfig } from "../../Utils";
import { DateTimePicker } from "@mui/x-date-pickers-pro";

const todayUtc = () => DateConfig.utc().startOf("day");

export const CommonValidationDatePicker: FC<CommonValidationDatePickerProps> = ({ name, label, required, disabled, grid, minDate, maxDate, pickerType, ...props }) => {
  const [field, meta, helpers] = useField(name);
  const value = field.value ? DateConfig.utc(field.value) : null;
  const PickerComponent = pickerType === "datetime" ? DateTimePicker : DatePicker;

  const Input = (
    <FormControl fullWidth error={meta.touched && Boolean(meta.error)}>
      <PickerComponent
        {...props}
        className="capitalize"
        label={label}
        value={value}
        format={pickerType === "datetime" ? "DD/MM/YYYY HH:MM A" : "DD/MM/YYYY"}
        onChange={(value) => helpers.setValue(value ? DateConfig.utc(value).toISOString() : null)}
        onClose={() => helpers.setTouched(true)}
        disabled={disabled}
        minDate={minDate ? DateConfig.utc(minDate) : undefined}
        maxDate={maxDate ? DateConfig.utc(maxDate) : undefined}
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

export const CommonDatePicker: FC<CommonDatePickerProps> = ({ label, value, onChange, disabled, grid, minDate, maxDate, pickerType, ...props }) => {
  const dateValue = value ? DateConfig.utc(value) : todayUtc();

  const PickerComponent = pickerType === "datetime" ? DateTimePicker : DatePicker;
  const Input = (
    <FormControl fullWidth>
      <PickerComponent
        {...props}
        className="capitalize"
        label={label}
        value={dateValue}
        format={pickerType === "datetime" ? "DD/MM/YYYY HH:MM A" : "DD/MM/YYYY"}
        onChange={(value) => onChange?.(value ? DateConfig.utc(value).toISOString() : null)}
        disabled={disabled}
        minDate={minDate ? DateConfig.utc(minDate) : undefined}
        maxDate={maxDate ? DateConfig.utc(maxDate) : undefined}
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
