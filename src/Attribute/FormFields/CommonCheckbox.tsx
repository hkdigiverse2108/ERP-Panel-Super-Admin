import { Checkbox, FormControlLabel, FormLabel, Grid } from "@mui/material";
import { useField, useFormikContext, type FieldHookConfig } from "formik";
import type { FC } from "react";
import type { CommonCheckboxProps, CommonValidationCheckboxProps } from "../../Types";

const classStart = "justify-end flex-row-reverse m-0!";
const classBetween = "justify-between flex-row-reverse m-0!";

export const CommonValidationCheckbox: FC<CommonValidationCheckboxProps> = ({ checkboxPlacement, name, label, required, disabled, isFormLabel = false, grid, syncFieldName }) => {
  const fieldConfig: FieldHookConfig<boolean> = {
    name,
    type: "checkbox",
  };

  const [field, meta, helpers] = useField(fieldConfig);
  const { setFieldValue } = useFormikContext<any>();

  const placementClass = checkboxPlacement === "start" ? classStart : checkboxPlacement === "between" ? classBetween : "";

  const Input = (
    <div className="flex flex-col gap-1">
      {isFormLabel && label && (
        <FormLabel htmlFor={name} required={required} error={meta.touched && Boolean(meta.error)}>
          {label}
        </FormLabel>
      )}

      <FormControlLabel
        className={`capitalize ${placementClass}`}
        required={isFormLabel ? false : required}
        label={isFormLabel ? "" : label}
        control={
          <Checkbox
            id={name}
            checked={!!field.value}
            onChange={(e) => {
              const value = e.target.checked;
              helpers.setValue(value);
              if (syncFieldName) setFieldValue(syncFieldName, value);
            }}
            disabled={disabled}
          />
        }
      />

      {meta.touched && meta.error && <p className="text-red-600 text-xs -mt-1">{meta.error}</p>}
    </div>
  );

  return grid ? <Grid size={grid}>{Input}</Grid> : Input;
};

export const CommonCheckbox: FC<CommonCheckboxProps> = ({ checkboxPlacement, name, label, required, disabled, isFormLabel = false, grid, value, onChange }) => {
  const placementClass = checkboxPlacement === "start" ? classStart : checkboxPlacement === "between" ? classBetween : "";

  const Input = <FormControlLabel className={`capitalize m-0! ${placementClass}`} required={isFormLabel ? false : required} label={isFormLabel ? "" : label} control={<Checkbox id={name} name={name} checked={!!value} onChange={(e) => onChange?.(e.target.checked)} disabled={disabled} />} />;

  const Label =
    isFormLabel && label ? (
      <div className="flex flex-col gap-1">
        <FormLabel htmlFor={name} required={required}>
          {label}
        </FormLabel>

        {Input}
      </div>
    ) : (
      Input
    );
  return grid ? <Grid size={grid}>{Label}</Grid> : Label;
};
