import { FormControlLabel, FormLabel, Grid, Switch } from "@mui/material";
import { useField, type FieldHookConfig } from "formik";
import type { FC } from "react";
import type { CommonSwitchProps, CommonValidationSwitchProps } from "../../Types";
const classStart = "justify-end flex-row-reverse m-0!";
const classBetween = "justify-between flex-row-reverse m-0!";

export const CommonValidationSwitch: FC<CommonValidationSwitchProps> = ({ switchPlacement, name, label, required, disabled, isFormLabel = false, grid }) => {
  const fieldConfig: FieldHookConfig<boolean> = { name, type: "checkbox" };
  const [field, meta, helpers] = useField(fieldConfig);
  const placementClass = switchPlacement === "start" ? classStart : switchPlacement === "between" ? classBetween : "";

  const Input = (
    <div className="flex flex-col gap-1">
      {isFormLabel && label && (
        <FormLabel htmlFor={name} required={required} error={meta.touched && Boolean(meta.error)}>
          {label}
        </FormLabel>
      )}

      <FormControlLabel className={placementClass} required={isFormLabel ? false : required} label={isFormLabel ? "" : label} control={<Switch id={name} checked={field.value} onChange={(e) => helpers.setValue(e.target.checked)} disabled={disabled} />} />

      {meta.touched && meta.error && <p className="text-red-600 text-xs -mt-1">{meta.error}</p>}
    </div>
  );

  return grid ? <Grid size={grid}>{Input}</Grid> : Input;
};

export const CommonSwitch: FC<CommonSwitchProps> = ({ switchPlacement, name, label, required, disabled, isFormLabel = false, grid, value, onChange }) => {
  const placementClass = switchPlacement === "start" ? classStart : switchPlacement === "between" ? classBetween : "";

  const Input = (
    <div className="flex flex-col gap-1">
      {isFormLabel && label && (
        <FormLabel htmlFor={name} required={required}>
          {label}
        </FormLabel>
      )}

      <FormControlLabel className={placementClass} required={isFormLabel ? false : required} label={isFormLabel ? "" : label} control={<Switch id={name} name={name} checked={!!value} onChange={(e) => onChange?.(e.target.checked)} disabled={disabled} />} />
    </div>
  );

  return grid ? <Grid size={grid}>{Input}</Grid> : Input;
};
