import Clear from "@mui/icons-material/Clear";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import { FormLabel, Grid } from "@mui/material";
import CircularProgress from "@mui/material/CircularProgress";
import IconButton from "@mui/material/IconButton";
import InputAdornment from "@mui/material/InputAdornment";
import TextField from "@mui/material/TextField";
import { useField, type FieldHookConfig } from "formik";
import { useCallback, useMemo, useState, type FC, type ReactNode } from "react";
import type { CommonTextFieldProps } from "../../Types";

export const CommonTextField: FC<CommonTextFieldProps> = ({ label, name, type = "text", placeholder, required, autoComplete = "off", validating = false, clearable = false, startIcon, endIcon, showPasswordToggle = false, isFormLabel, grid, ...props }) => {
  const fieldConfig: FieldHookConfig<string> = { name };
  const [field, meta, helpers] = useField(fieldConfig);
  const [isFocused, setFocused] = useState(false);

  const isPassword = type === "password";
  const [show, setShow] = useState(false);
  const toggleShowPassword = () => setShow((prev) => !prev);

  const inputType = isPassword && showPasswordToggle ? (show ? "text" : "password") : type;

  const handleClear = useCallback(() => helpers.setValue(""), [helpers]);

  const endAdornment = useMemo(() => {
    const items: ReactNode[] = [];

    if (validating) {
      items.push(
        <InputAdornment position="end" key="loading">
          <CircularProgress size={18} />
        </InputAdornment>
      );
    }

    if (clearable && field.value) {
      items.push(
        <InputAdornment position="end" key="clear">
          <IconButton size="small" onClick={handleClear}>
            <Clear fontSize="small" />
          </IconButton>
        </InputAdornment>
      );
    }

    if (showPasswordToggle && isPassword) {
      items.push(
        <InputAdornment position="end" key="toggle-password">
          <IconButton size="small" onClick={toggleShowPassword}>
            {show ? <VisibilityOff /> : <Visibility />}
          </IconButton>
        </InputAdornment>
      );
    }

    if (endIcon) {
      items.push(
        <InputAdornment position="end" key="end-icon">
          {endIcon}
        </InputAdornment>
      );
    }

    if (items.length === 0) return undefined;

    return <>{items}</>;
  }, [validating, clearable, field.value, showPasswordToggle, isPassword, endIcon, show, handleClear]);

  const startAdornment = startIcon ? <InputAdornment position="start">{startIcon}</InputAdornment> : undefined;

  const Input = (
    <>
      {isFormLabel && (
        <FormLabel className="capitalize" required={required} htmlFor={name} error={meta.touched && Boolean(meta.error)} focused={isFocused} sx={{ mb: 0.5 }}>
          {label}
        </FormLabel>
      )}

      <TextField
        className="capitalize"
        fullWidth
        label={isFormLabel ? undefined : label}
        id={name}
        type={inputType}
        placeholder={placeholder}
        autoComplete={autoComplete}
        required={required}
        size="small"
        {...field}
        {...props}
        onFocus={(e) => {
          setFocused(true);
          props.onFocus?.(e);
        }}
        onBlur={(e) => {
          setFocused(false);
          field.onBlur(e);
          props.onBlur?.(e);
        }}
        error={meta.touched && Boolean(meta.error)}
        helperText={meta.touched && meta.error ? meta.error : props.helperText}
        slotProps={{
          input: {
            startAdornment,
            endAdornment,
          },
        }}
      />
    </>
  );

  return grid ? (
    <Grid size={grid} className="flex flex-col justify-end">
      {Input}
    </Grid>
  ) : (
    Input
  );
};