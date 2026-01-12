import Clear from "@mui/icons-material/Clear";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import { FormControl, FormLabel, Grid, IconButton, InputAdornment, TextField, CircularProgress, Box } from "@mui/material";
import { useField, type FieldHookConfig } from "formik";
import { useCallback, useMemo, useState, type FC, type ReactNode } from "react";
import type { CommonTextFieldProps, CommonValidationTextFieldProps } from "../../Types";

export const CommonValidationTextField: FC<CommonValidationTextFieldProps> = ({ currencyDisabled, label, name, type = "text", placeholder, required, autoComplete = "off", validating = false, clearable = false, startIcon, endIcon, showPasswordToggle = false, isFormLabel, disabled, grid, isCurrency, onCurrencyLog, ...props }) => {
  const fieldConfig: FieldHookConfig<string> = { name };
  const [field, meta, helpers] = useField(fieldConfig);
  const [isFocused, setFocused] = useState(false);
  const currency = "₹";
  const [currencyType, setCurrencyType] = useState<"₹" | "%">(currency);

  const isPassword = type === "password";
  const [show, setShow] = useState(false);

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
          <IconButton size="small" onClick={() => setShow((prev) => !prev)}>
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
    <TextField
      {...field}
      {...props}
      className="capitalize"
      fullWidth
      label={isFormLabel ? undefined : label}
      id={name}
      type={inputType}
      disabled={disabled}
      placeholder={placeholder}
      autoComplete={autoComplete}
      required={required}
      size="small"
      onFocus={(e) => {
        setFocused(true);
        props.onFocus?.(e);
      }}
      onBlur={(e) => {
        setFocused(false);
        field.onBlur(e);
        props.onBlur?.(e);
      }}
      onKeyDown={(e) => {
        if (inputType === "number") {
          if (["e", "E", "+", "-"].includes(e.key)) e.preventDefault();
        }
      }}
      error={meta.touched && Boolean(meta.error)}
      helperText={meta.touched && meta.error ? meta.error : props.helperText}
      slotProps={{
        input: {
          startAdornment,
          endAdornment,
          inputMode: isCurrency ? "decimal" : undefined,
        },
      }}
      sx={{
        "& .MuiOutlinedInput-root": { borderRadius: isCurrency ? "0 4px 4px 0" : "4px" },
      }}
    />
  );

  const InputBox = (
    <FormControl fullWidth error={meta.touched && Boolean(meta.error)}>
      {isFormLabel && (
        <FormLabel className="capitalize" required={required} htmlFor={name} error={meta.touched && Boolean(meta.error)} focused={isFocused} sx={{ mb: 0.5 }}>
          {label}
        </FormLabel>
      )}
      {isCurrency ? (
        <Box display="flex" alignItems="start">
          <IconButton
            disabled={disabled || currencyDisabled}
            className="currency-btn"
            size="small"
            onClick={() => {
              const next = currencyType === currency ? "%" : currency;
              setCurrencyType(next);
              onCurrencyLog?.(next);
            }}
          >
            {currencyType}
          </IconButton>

          {Input}
        </Box>
      ) : (
        Input
      )}
    </FormControl>
  );

  return grid ? (
    <Grid size={grid} className="flex flex-col justify-start">
      {InputBox}
    </Grid>
  ) : (
    InputBox
  );
};

export const CommonTextField: FC<CommonTextFieldProps> = ({ label, value, onChange, type = "text", placeholder, required, autoComplete = "off", validating = false, clearable = false, startIcon, endIcon, showPasswordToggle = false, isFormLabel, disabled, grid, isCurrency, onCurrencyLog, ...props }) => {
  const [focused, setFocused] = useState(false);
  const isPassword = type === "password";
  const [show, setShow] = useState(false);
  const currency = "₹";
  const [currencyType, setCurrencyType] = useState<"₹" | "%">(currency);

  const inputType = isPassword && showPasswordToggle ? (show ? "text" : "password") : type;

  const endAdornment = useMemo(() => {
    const items: ReactNode[] = [];

    if (validating) {
      items.push(
        <InputAdornment position="end" key="loading">
          <CircularProgress size={18} />
        </InputAdornment>
      );
    }

    if (clearable && value) {
      items.push(
        <InputAdornment position="end" key="clear">
          <IconButton size="small" onClick={() => onChange?.("")}>
            <Clear fontSize="small" />
          </IconButton>
        </InputAdornment>
      );
    }

    if (showPasswordToggle && isPassword) {
      items.push(
        <InputAdornment position="end" key="toggle">
          <IconButton size="small" onClick={() => setShow((p) => !p)}>
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

    return items.length ? <>{items}</> : undefined;
  }, [validating, clearable, value, showPasswordToggle, isPassword, endIcon, show, onChange]);

  const startAdornment = startIcon ? <InputAdornment position="start">{startIcon}</InputAdornment> : undefined;

  const Input = (
    <TextField
      {...props}
      className="capitalize"
      value={value}
      onChange={(e) => onChange?.(e.target.value)}
      disabled={disabled}
      label={isFormLabel ? undefined : label}
      type={inputType}
      placeholder={placeholder}
      required={required}
      autoComplete={autoComplete}
      size="small"
      onFocus={() => setFocused(true)}
      onBlur={() => setFocused(false)}
      slotProps={{
        input: {
          startAdornment,
          endAdornment,
          inputMode: isCurrency ? "decimal" : undefined,
        },
      }}
      onKeyDown={(e) => {
        if (inputType === "number") {
          if (["e", "E", "+", "-"].includes(e.key)) e.preventDefault();
        }
      }}
      sx={{
        "& .MuiOutlinedInput-root": { borderRadius: isCurrency ? "0 4px 4px 0" : "4px" },
      }}
    />
  );

  const InputBox = (
    <FormControl fullWidth>
      {isFormLabel && (
        <FormLabel className="capitalize" required={required} focused={focused} sx={{ mb: 0.5 }}>
          {label}
        </FormLabel>
      )}
      {isCurrency ? (
        <Box display="flex" alignItems="start">
          <IconButton
            disabled={disabled}
            className="currency-btn"
            size="small"
            onClick={() => {
              const next = currencyType === currency ? "%" : currency;
              setCurrencyType(next);
              onCurrencyLog?.(next);
            }}
          >
            {currencyType}
          </IconButton>

          {Input}
        </Box>
      ) : (
        Input
      )}
    </FormControl>
  );

  return grid ? (
    <Grid size={grid} className="flex flex-col justify-start">
      {InputBox}
    </Grid>
  ) : (
    InputBox
  );
};
