import CloseIcon from "@mui/icons-material/Close";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import PictureAsPdfIcon from "@mui/icons-material/PictureAsPdf";
import { Grid } from "@mui/material";
import { useRef, useState, type ChangeEvent, type DragEvent } from "react";
import { Mutations } from "../../../Api";
import { CommonButton, ShowNotification } from "../../../Attribute";
import { useAppSelector } from "../../../Store/hooks";

const DropzoneWithPreview = () => {
  const fileRef = useRef<HTMLInputElement>(null);
  const [files, setFiles] = useState<File[]>([]);
  const [previews, setPreviews] = useState<string[]>([]);
  const { isUploadModal } = useAppSelector((state) => state.modal);

  const { mutate: uploadImage, isPending } = Mutations.useUpload();

  const isImageMode = isUploadModal.type === "image";

  // Allowed mime types
  const allowedTypes = isImageMode ? ["image/png", "image/jpg", "image/jpeg", "image/webp"] : ["application/pdf"];

  // Validate file type
  const validate = (file: File) => allowedTypes.includes(file.type);

  // Handle both input & drop upload
  const processFiles = (fileList: FileList) => {
    const validFiles: File[] = [];
    const previewUrls: string[] = [];

    Array.from(fileList).forEach((file) => {
      if (!validate(file)) {
        ShowNotification(isImageMode ? `Only PNG, JPG, WEBP, JPEG allowed` : `Only PDF files allowed`, "error");
        return;
      }
      validFiles.push(file);
      previewUrls.push(URL.createObjectURL(file));
    });

    setFiles((prev) => [...prev, ...validFiles]);
    setPreviews((prev) => [...prev, ...previewUrls]);
  };

  const handleInputUpload = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) processFiles(e.target.files);
  };

  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    if (e.dataTransfer.files) processFiles(e.dataTransfer.files);
  };

  const handleRemove = (i: number) => {
    URL.revokeObjectURL(previews[i]);
    setFiles(files.filter((_, idx) => idx !== i));
    setPreviews(previews.filter((_, idx) => idx !== i));
  };

  const handleClear = () => {
    previews.forEach((p) => URL.revokeObjectURL(p));
    setFiles([]);
    setPreviews([]);
  };

  const handleUpload = () => {
    const formData = new FormData();
    files.forEach((file) => formData.append(isImageMode ? "images" : "pdf", file));

    uploadImage(formData, {
      onSuccess: () => handleClear(),
    });
  };

  return (
    <div>
      {/* DROPZONE */}
      <div
        className="w-full h-[350px] rounded-2xl border-2 border-dashed border-gray-300 dark:border-gray-700 hover:border-brand-500 dark:hover:border-brand-500 flex flex-col items-center justify-center text-center cursor-pointer bg-white dark:bg-gray-900"
        onClick={() => fileRef.current?.click()}
        onDragOver={(e) => e.preventDefault()} // IMPORTANT
        onDrop={handleDrop} // IMPORTANT
      >
        {/* PREVIEW GRID */}
        <Grid container spacing={2} className="flex flex-wrap custom-scrollbar overflow-y-auto p-3">
          {files.map((file, index) => (
            <Grid size={{ xs: 6, sm: 4, md: 3 }} key={index} className="relative border rounded-lg overflow-hidden">
              {isImageMode ? (
                <img src={previews[index]} className="w-full h-full object-cover" />
              ) : (
                /* PDF Preview Box */
                <div className="w-full! flex flex-col items-center justify-center p-2">
                  <PictureAsPdfIcon sx={{ fontSize: 40 }} className="mb-2 opacity-80 text-gray-800 dark:text-gray-300" />
                  <p className="text-xs text-gray-700 dark:text-gray-300 text-center truncate w-full">{file.name}</p>
                </div>
              )}

              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleRemove(index);
                }}
                className="absolute right-1 top-1 z-50 flex h-8 w-8 items-center justify-center rounded-full bg-gray-100 text-gray-800 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-gray-700"
              >
                <CloseIcon sx={{ fontSize: 18 }} />
              </button>
            </Grid>
          ))}
        </Grid>

        {/* EMPTY STATE */}
        {files.length === 0 && (
          <div className="flex flex-col items-center justify-center flex-1 text-center">
            <CloudUploadIcon className="text-gray-500" sx={{ fontSize: 40 }} />
            <h4 className="mb-3 font-semibold text-gray-800 dark:text-white/90">Drop Files Here, Paste</h4>
            <span className="text-center block w-full max-w-[290px] text-sm text-gray-700 dark:text-gray-400">{`Drag and drop your ${isUploadModal.type === "image" ? "PNG, JPG, WEBP, JPEG images" : "PDF"}  here or browse`}</span>
            <p className="mt-2 text-gray-500">Or</p>
            <p className="mt-2 text-brand-500 font-semibold">Browse Files</p>
          </div>
        )}
      </div>

      {/* HIDDEN FILE INPUT */}
      <input type="file" ref={fileRef} className="hidden" multiple accept={isImageMode ? allowedTypes.join(", ") : "application/pdf"} onChange={handleInputUpload} />

      {/* FOOTER */}
      <div className="flex justify-between items-center mt-4 pt-4 border-t border-gray-200 dark:border-gray-800">
        <CommonButton onClick={handleClear} title="Clear" />
        <CommonButton loading={isPending} title="Insert Media" variant="contained" disabled={files.length === 0} onClick={handleUpload} />
      </div>
    </div>
  );
};

export default DropzoneWithPreview;
