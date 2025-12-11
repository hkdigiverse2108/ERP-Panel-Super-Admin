import { Autocomplete, Grid, TextField } from "@mui/material";
import { useField } from "formik";
import { type FC } from "react";
import type { CommonSelectProps, CommonValidationSelectProps, SelectOptionType } from "../../Types";

export const CommonValidationSelect: FC<CommonValidationSelectProps> = ({ name, label, options, multiple = false, limitTags, size = "small", grid }) => {
  const [field, meta, helpers] = useField<string[]>({ name });
  const valueObjects = field.value?.map((v) => options.find((o) => o.value === v)).filter(Boolean) as SelectOptionType[];
  const singleValue = !multiple ? valueObjects[0] ?? null : null;
  const Input = (
    <Autocomplete
      multiple={multiple}
      options={options}
      limitTags={limitTags}
      value={multiple ? valueObjects : singleValue}
      size={size}
      getOptionLabel={(opt) => opt.label}
      isOptionEqualToValue={(option, val) => option.value === val.value}
      onChange={(_, newValues) => {
        if (multiple) {
          helpers.setValue((newValues as SelectOptionType[]).map((o) => o.value));
        } else {
          const single = newValues as SelectOptionType | null;
          helpers.setValue(single ? [single.value] : []);
        }
      }}
      onBlur={() => helpers.setTouched(true)}
      filterSelectedOptions
      clearOnEscape
      disableCloseOnSelect={multiple}
      renderInput={(params) => <TextField {...params} label={label} size={size} error={meta.touched && Boolean(meta.error)} helperText={meta.touched && meta.error ? meta.error : ""} />}
    />
  );

  return grid ? <Grid size={grid}>{Input}</Grid> : Input;
};

export const CommonSelect: FC<CommonSelectProps> = ({ label, options, value, onChange, multiple = false, limitTags, size, grid }) => {
  const valueObjects = value.map((v) => options.find((o) => o.value === v)).filter(Boolean) as SelectOptionType[];
  const singleValue = !multiple ? valueObjects[0] ?? null : null;

  const Input = (
    <Autocomplete
      multiple={multiple}
      options={options}
      limitTags={limitTags}
      value={multiple ? valueObjects : singleValue}
      size={size}
      getOptionLabel={(opt) => opt.label}
      isOptionEqualToValue={(option, val) => option.value === val.value}
      onChange={(_, newValues) => {
        if (multiple) {
          onChange((newValues as SelectOptionType[]).map((o) => o.value));
        } else {
          const single = newValues as SelectOptionType | null;
          onChange(single ? [single.value] : []);
        }
      }}
      filterSelectedOptions
      clearOnEscape
      disableCloseOnSelect={multiple}
      renderInput={(params) => <TextField {...params} label={label} size="small" />}
    />
  );

  return grid ? <Grid size={grid}>{Input}</Grid> : Input;
};
