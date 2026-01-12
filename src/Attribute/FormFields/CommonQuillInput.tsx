import { FormControl, FormHelperText, FormLabel, Grid } from "@mui/material";
import { useField, useFormikContext } from "formik";
import type { FC } from "react";
import ReactQuill from "react-quill-new";
import { TOOLBAR_OPTIONS } from "../../Data";
import type { CommonValidationQuillInputProps } from "../../Types";

export const CommonValidationQuillInput: FC<CommonValidationQuillInputProps> = ({ label, name, required, placeholder, disabled, grid, modules = { toolbar: TOOLBAR_OPTIONS } }) => {
  const [field, meta] = useField<string>(name);
  const { setFieldValue } = useFormikContext<any>();

  const Quill = (
    <FormControl fullWidth error={meta.touched && Boolean(meta.error)} className="quill-form-control relative!">
      {label && (
        <FormLabel htmlFor={name} required={required} error={meta.touched && Boolean(meta.error)} sx={{ mb: 0.5 }} className="capitalize absolute! -top-2.5! left-3! bg-white dark:bg-gray-dark px-1! text-sm!">
          {label}
        </FormLabel>
      )}

      <ReactQuill
        id={name}
        theme="snow"
        value={field.value || ""}
        modules={modules}
        placeholder={placeholder}
        readOnly={disabled}
        onChange={(content) => {
          const isEmpty = content === "<p></p>" || content === "<p><br></p>" || content.replace(/<(.|\n)*?>/g, "").trim() === "";

          setFieldValue(name, isEmpty ? "" : content);
        }}
        className={`description-quill ${meta.touched && meta.error ? "is-invalid" : ""}`}
      />

      {meta.touched && meta.error && <FormHelperText>{meta.error}</FormHelperText>}
    </FormControl>
  );

  return grid ? (
    <Grid size={grid} className="flex flex-col justify-start">
      {Quill}
    </Grid>
  ) : (
    Quill
  );
};
