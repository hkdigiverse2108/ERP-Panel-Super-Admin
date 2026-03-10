import DeleteIcon from "@mui/icons-material/Delete";
import FolderOffRoundedIcon from "@mui/icons-material/FolderOffRounded";
import PictureAsPdfRoundedIcon from "@mui/icons-material/PictureAsPdfRounded";
import { Box, Grid, IconButton } from "@mui/material";
import { useField } from "formik";
import { useEffect, useMemo, type FC } from "react";
import { Link } from "react-router-dom";

export interface commonImageBoxProps {
  url: string;
  label: string;
  type: "image" | "pdf";
  grid?: object | number;
}

export interface CommonFormImageBoxProps {
  name: string;
  label: string;
  type: "image" | "pdf";
  grid?: object | number;
  required?: boolean;
  onUpload: () => void;
  onDelete?: () => void;
  multiple?: boolean;
}

export const CommonImageBox: FC<commonImageBoxProps> = ({ url, label, type, grid }) => {
  const displayFile =
    type === "image" ? (
      <img src={url} alt={"Image"} className="object-cover w-full h-full rounded-md" />
    ) : (
      <Link to={url} target="_blank">
        <PictureAsPdfRoundedIcon className="text-5xl! text-gray-700" />
      </Link>
    );
  return (
    <Grid size={grid} className="flex! flex-col! justify-center! items-center! gap-2">
      {label && <p>{label}</p>}
      <Box className="flex items-center justify-center rounded-lg bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 overflow-hidden" sx={{ width: 150, height: 150 }}>
        {url ? displayFile : <FolderOffRoundedIcon className="text-5xl! text-gray-700" />}
      </Box>
    </Grid>
  );
};

  export const CommonFormImageBox: FC<CommonFormImageBoxProps> = ({ name, label, type, grid, required, onUpload, multiple }) => {
    const [field, meta, helpers] = useField<(File | string)[] | null>(name);
    /* -------------------- Normalize Value -------------------- */
    const values = useMemo<(File | string)[]>(() => {
      const raw = field.value;
      if (Array.isArray(raw)) {
        return raw.filter(Boolean) as (File | string)[];
      }
      if (raw) {
        return [raw];
      }
      return [];
    }, [field.value]);

    /* -------------------- Preview URLs -------------------- */
    const previews = useMemo<string[]>(() => values.map((item) => (item instanceof File ? URL.createObjectURL(item) : item)), [values]);

    /* -------------------- Cleanup Blob URLs -------------------- */
    useEffect(() => {
      return () => {
        previews.forEach((url) => {
          if (url.startsWith("blob:")) {
            URL.revokeObjectURL(url);
          }
        });
      };
    }, [previews]);

    const hasError = Boolean(meta.touched && meta.error);

    /* -------------------- Remove Item -------------------- */
    const removeItem = (index: number) => {
      const updated = values.filter((_, i) => i !== index);
      helpers.setValue(multiple ? updated : null);
    };

    /* -------------------- Render -------------------- */
    return (
      <Grid size={grid} className="flex flex-col gap-2">
        {/* Label */}
        <p className="text-sm font-medium">
          {label}
          {(hasError || required) && <span className="text-red-600 ml-1">*</span>}
        </p>

        {/* Preview Grid */}
        <div className="flex flex-wrap gap-3">
          {previews.map((url, index) => (
            <Box key={index} className="relative group flex items-center justify-center rounded-lg border overflow-hidden" sx={{ width: 150, height: 150 }}>
              {type === "image" ? (
                <img src={url} alt="preview" className="w-full h-full object-cover" />
              ) : (
                <Link to={url} target="_blank">
                  <PictureAsPdfRoundedIcon className="text-5xl! text-gray-700" />
                </Link>
              )}

              {/* Delete */}
              <div className="absolute inset-0 flex items-center justify-center bg-black/30 opacity-0 group-hover:opacity-100 transition">
                <IconButton
                  color="error"
                  size="small"
                  onClick={(e) => {
                    e.stopPropagation();
                    removeItem(index);
                  }}
                >
                  <DeleteIcon />
                </IconButton>
              </div>
            </Box>
          ))}

          {/* Upload Box */}
          {(previews.length < 1 || multiple) && (
            <Box
              onClick={onUpload}
              role="button"
              className={`
                  flex items-center justify-center rounded-lg border cursor-pointer
                  ${hasError ? "border-red-500" : "border-gray-200 dark:border-gray-600"}
                `}
              sx={{ width: 150, height: 150 }}
            >
              <FolderOffRoundedIcon className="text-5xl! text-gray-400" />
            </Box>
          )}
        </div>

        {/* Error */}
        {hasError && <p className="text-xs text-red-600">{meta.error}</p>}
      </Grid>
    );
  };