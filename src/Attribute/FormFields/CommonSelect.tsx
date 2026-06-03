import { Autocomplete, Grid, TextField } from "@mui/material";
import { useField, useFormikContext } from "formik";
import { type FC } from "react";
import type { CommonSelectProps, CommonValidationSelectProps, SelectOptionType } from "../../Types";

export const CommonValidationSelect: FC<CommonValidationSelectProps> = ({ name, syncName, label, required, options, multiple = false, limitTags, size = "small", grid, disabled, readOnly, syncFieldName, isLoading, placeholder, onChange, ...props }) => {
  const [field, meta, helpers] = useField<any>({ name });
  const [variantField] = useField<any>({ name: syncName || "variantId" });

  const { setFieldValue } = useFormikContext<any>();
  // Normalize value
  const safeValue = multiple ? (Array.isArray(field.value) ? field.value : []) : (field.value ?? "");
  const safeVariantValue = Array.isArray(variantField.value) ? variantField.value : variantField.value ? [variantField.value] : [];

  // const valueObjects = multiple //
  //   ? syncName
  //     ? [...safeValue, ...safeVariantValue].map((v: string) => options.find((o) => o.value === v && (o.variantId ?? "") === (v ?? ""))).filter(Boolean)
  //     : safeValue?.map((v: string) => options.find((o) => o.value === v)).filter(Boolean)
  //   : syncName
  //     ? (options.find((o) => o.value === safeValue && (o.variantId ?? "") === (variantField.value ?? "")) ?? null)
  //     : (options.find((o) => o.value === safeValue) ?? null);

  const valueObjects = multiple //
    ? syncName
      ? safeValue.map((value: string, index: number) => options.find((o) => o.value === value && (o.variantId ?? "") === (safeVariantValue[index] ?? ""))).filter(Boolean)
      : safeValue.map((v: string) => options.find((o) => o.value === v)).filter(Boolean)
    : syncName
      ? (options.find((o) => o.value === safeValue && (o.variantId ?? "") === (variantField.value ?? "")) ?? null)
      : (options.find((o) => o.value === safeValue) ?? null);

  const Input = (
    <Autocomplete
      {...props}
      multiple={multiple}
      options={options}
      limitTags={limitTags}
      value={valueObjects}
      size={size}
      disabled={disabled}
      readOnly={readOnly}
      getOptionLabel={(opt) => opt.label}
      isOptionEqualToValue={(option, val) => option.value === val.value && (option.variantId ?? "") === (val.variantId ?? "")}
      onChange={(_, newValues) => {
        if (multiple) {
          const values = (newValues as SelectOptionType[]).map((o) => o.value);
          const variantIds = (newValues as SelectOptionType[]).map((o) => o.variantId);
          helpers.setValue(values);
          if (syncFieldName) setFieldValue(syncFieldName, values);
          if (onChange) onChange(values, newValues as SelectOptionType[]);
          if (syncName) setFieldValue(syncName, variantIds);
        } else {
          const value = (newValues as SelectOptionType | null)?.value ?? "";
          helpers.setValue(value);
          if (syncFieldName) setFieldValue(syncFieldName, value);
          if (onChange) onChange(value ? [value] : [], newValues as SelectOptionType);
          if (syncName) setFieldValue(syncName, newValues?.variantId ?? "");
        }
      }}
      onBlur={() => helpers.setTouched(true)}
      clearOnEscape
      disableCloseOnSelect={multiple}
      renderOption={(props, option) => (
        <li {...props} key={`${option.value}-${option.variantId}`}>
          {option.label}
        </li>
      )}
      loading={isLoading}
      renderInput={(params) => <TextField {...params} className="capitalize" placeholder={placeholder} disabled={disabled} required={required} label={label} size={size} error={meta.touched && Boolean(meta.error)} helperText={meta.touched && meta.error ? meta.error : ""} />}
    />
  );

  return grid ? <Grid size={grid}>{Input}</Grid> : Input;
};

export const CommonSelect: FC<CommonSelectProps> = ({ label, options = [], value, onChange, multiple = false, limitTags, size, grid, disabled, readOnly, isLoading, placeholder, ...props }) => {
  const selectedValue = multiple ? (value || []).map((v) => options.find((o) => o.value === v)).filter((v): v is SelectOptionType => Boolean(v)) : (options.find((o) => o.value === value?.[0]) ?? null);

  const Input = (
    <Autocomplete
      {...props}
      multiple={multiple}
      options={options}
      limitTags={limitTags}
      value={selectedValue}
      size={size}
      disabled={disabled}
      readOnly={readOnly}
      getOptionLabel={(opt) => opt.label}
      isOptionEqualToValue={(option, val) => option.value === val.value}
      onChange={(_, newValue) => {
        if (multiple) {
          onChange(
            (newValue as SelectOptionType[]).map((o) => o.value),
            newValue as SelectOptionType[],
          );
        } else {
          const item = newValue as SelectOptionType | null;
          onChange(item ? [item.value] : [], item as SelectOptionType);
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
      renderInput={(params) => <TextField {...params} placeholder={placeholder} label={label} size="small" className="capitalize" disabled={disabled} />}
    />
  );

  return grid ? <Grid size={grid}>{Input}</Grid> : Input;
};
