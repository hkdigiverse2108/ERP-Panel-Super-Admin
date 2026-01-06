import DeleteIcon from "@mui/icons-material/Delete";
import FolderOffRoundedIcon from "@mui/icons-material/FolderOffRounded";
import PictureAsPdfRoundedIcon from "@mui/icons-material/PictureAsPdfRounded";
import { Box, Grid, IconButton } from "@mui/material";
import { useField } from "formik";
import type { FC } from "react";
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
}



export const CommonImageBox: FC<commonImageBoxProps> = ({ url, label, type, grid }) => {
  const displayFile =
    type === "image" ? (
      <img src={url} alt={"Image"} className="object-cover w-full h-full rounded-md" />
    ) : (
      <Link to={url} target="_blank">
        <PictureAsPdfRoundedIcon className="text-7xl!" />
      </Link>
    );
  return (
    
    <Grid size={grid} className="flex! flex-col! justify-center! items-center! gap-2">
      {label && <p>{label}</p>}
      <Box className="flex items-center justify-center rounded-lg bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 overflow-hidden" sx={{ width: 150, height: 150 }}>
        {url ? displayFile : <FolderOffRoundedIcon className="text-7xl!" />}
      </Box>
    </Grid>
  );
};

export const CommonFormImageBox: FC<CommonFormImageBoxProps> = ({ name, label, type, grid,required, onUpload, onDelete }) => {
  const [field, meta, helpers] = useField<string | null>(name);
  const url = field.value;

  const displayFile =
    type === "image" && url ? (
      <img src={url} alt="Image" className="object-cover w-full h-full rounded-md" />
    ) : (
      <Link to={url || "#"} target="_blank">
        <PictureAsPdfRoundedIcon className="text-7xl!" />
      </Link>
    );

  return (
    <Grid size={grid} className="flex flex-col items-center gap-2">
      <p className="mb-1 text-sm font-medium">
        {label}
        {((meta.touched && meta.error) || required) && <span className="text-red-600 ml-1">*</span>}
      </p>

      <Box onClick={onUpload} className={`relative group flex items-center justify-center rounded-lg border cursor-pointer overflow-hidden ${meta.touched && meta.error ? "border-red-500" : "border-gray-200"}`} sx={{ width: 150, height: 150 }}>
        {url ? displayFile : <FolderOffRoundedIcon className="text-7xl!" />}

        {url && (
          <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 bg-black/30 transition">
            <IconButton
              color="error"
              size="small"
              onClick={(e) => {
                e.stopPropagation();
                helpers.setValue(null); // 🔥 Clear Formik value
                onDelete?.();
              }}
            >
              <DeleteIcon />
            </IconButton>
          </div>
        )}
      </Box>

      {meta.touched && meta.error && <p className="text-red-600 text-xs">{meta.error}</p>}
    </Grid>
  );
};
