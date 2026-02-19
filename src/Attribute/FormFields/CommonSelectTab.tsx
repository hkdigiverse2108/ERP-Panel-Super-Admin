import { Autocomplete, Grid, TextField } from "@mui/material";
import { useField, useFormikContext } from "formik";
import { type FC, useState } from "react";
import type { CommonValidationCreatableSelectProps } from "../../Types";

export const CommonValidationCreatableSelect: FC<CommonValidationCreatableSelectProps> = ({ name, label, options = [], required, disabled, grid }) => {
  const { setFieldValue } = useFormikContext<any>();
  const [field, meta] = useField<string[]>({ name });

  // Local options state (so new items can be added)
  const [localOptions, setLocalOptions] = useState<string[]>(options);

  const Input = (
    <Autocomplete
      multiple
      freeSolo
      size="small"
      options={localOptions}
      value={field.value || []}
      disabled={disabled}
      onChange={(_, newValue) => {
        // Find newly added values
        const newItems = newValue.filter((val) => !localOptions.includes(val));

        if (newItems.length) {
          setLocalOptions((prev) => [...prev, ...newItems]);
        }

        setFieldValue(name, newValue);
      }}
      renderInput={(params) => <TextField {...params} label={label} required={required} error={meta.touched && Boolean(meta.error)} helperText={meta.touched && meta.error} />}
    />
  );

  return grid ? <Grid size={grid}>{Input}</Grid> : Input;
};
