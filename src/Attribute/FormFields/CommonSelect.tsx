import { Autocomplete, Grid, TextField } from "@mui/material";
import { useField, useFormikContext } from "formik";
import { type FC } from "react";
import type { CommonSelectProps, CommonValidationSelectProps, SelectOptionType } from "../../Types";

export const CommonValidationSelect: FC<CommonValidationSelectProps> = ({ name, label, required, options, multiple = false, limitTags, size = "small", grid, disabled, syncFieldName, isLoading, ...props }) => {
  const [field, meta, helpers] = useField<any>({ name });
  const { setFieldValue } = useFormikContext<any>();
  // Normalize value
  const safeValue = multiple ? (Array.isArray(field.value) ? field.value : []) : field.value ?? "";

  const valueObjects = multiple ? safeValue?.map((v: string) => options.find((o) => o.value === v)).filter(Boolean) : options.find((o) => o.value === safeValue) ?? null;

  const Input = (
    <Autocomplete
      {...props}
      multiple={multiple}
      options={options}
      limitTags={limitTags}
      value={valueObjects}
      size={size}
      disabled={disabled}
      getOptionLabel={(opt) => opt.label}
      isOptionEqualToValue={(option, val) => option.value === val.value}
      onChange={(_, newValues) => {
        if (multiple) {
          const values = (newValues as SelectOptionType[]).map((o) => o.value);
          helpers.setValue(values);
          if (syncFieldName) setFieldValue(syncFieldName, values);
        } else {
          const value = (newValues as SelectOptionType | null)?.value ?? "";
          helpers.setValue(value);
          if (syncFieldName) setFieldValue(syncFieldName, value);
        }
      }}
      onBlur={() => helpers.setTouched(true)}
      clearOnEscape
      disableCloseOnSelect={multiple}
      renderOption={(props, option) => (
        <li {...props} key={option.value}>
          {option.label}
        </li>
      )}
      loading={isLoading}
      renderInput={(params) => <TextField {...params} className="capitalize" disabled={disabled} required={required} label={label} size={size} error={meta.touched && Boolean(meta.error)} helperText={meta.touched && meta.error ? meta.error : ""} />}
    />
  );

  return grid ? <Grid size={grid}>{Input}</Grid> : Input;
};

export const CommonSelect: FC<CommonSelectProps> = ({ label, options = [], value, onChange, multiple = false, limitTags, size, grid, disabled, isLoading, ...props }) => {
  const selectedValue = multiple ? (value || []).map((v) => options.find((o) => o.value === v)).filter((v): v is SelectOptionType => Boolean(v)) : options.find((o) => o.value === value?.[0]) ?? null;

  const Input = (
    <Autocomplete
      {...props}
      multiple={multiple}
      options={options}
      limitTags={limitTags}
      value={selectedValue}
      size={size}
      disabled={disabled}
      getOptionLabel={(opt) => opt.label}
      isOptionEqualToValue={(option, val) => option.value === val.value}
      onChange={(_, newValue) => {
        if (multiple) {
          onChange((newValue as SelectOptionType[]).map((o) => o.value));
        } else {
          const item = newValue as SelectOptionType | null;
          onChange(item ? [item.value] : []);
        }
      }}
      clearOnEscape
      disableCloseOnSelect={multiple}
      renderOption={(props, option) => (
        <li {...props} key={option.value}>
          {option.label}
        </li>
      )}
      loading={isLoading}
      renderInput={(params) => <TextField {...params} label={label} size="small" className="capitalize" disabled={disabled} />}
    />
  );

  return grid ? <Grid size={grid}>{Input}</Grid> : Input;
};
