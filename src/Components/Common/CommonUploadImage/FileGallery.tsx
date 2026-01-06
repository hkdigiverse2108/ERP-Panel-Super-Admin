import DeleteIcon from "@mui/icons-material/Delete";
import PictureAsPdfIcon from "@mui/icons-material/PictureAsPdf";
import { IconButton, Skeleton } from "@mui/material";
import { useState, type FC } from "react";
import { Mutations, Queries } from "../../../Api";
import { CommonButton } from "../../../Attribute";
import { useAppDispatch, useAppSelector } from "../../../Store/hooks";
import { setSelectedFiles, setUploadModal } from "../../../Store/Slices/ModalSlice";

const FileGallery: FC<{ multiple?: boolean }> = ({ multiple = false }) => {
  const { isUploadModal } = useAppSelector((state) => state.modal);
  const dispatch = useAppDispatch();

  const shouldFetchImages = isUploadModal.type === "image";
  const shouldFetchPdf = isUploadModal.type === "pdf";

  const [selected, setSelected] = useState<string[]>([]);

  const { mutate: mutateDelete } = Mutations.useDeleteUpload();

  const { data: images, isLoading: isLoadingImages } = Queries.useGetUploadImage({ enabled: shouldFetchImages });
  const { data: pdf, isLoading: isLoadingPdf } = Queries.useGetUploadPdf({ enabled: shouldFetchPdf });

  const ListData = isUploadModal.type === "image" ? images?.data : pdf?.data;

  /* ---------------------------------- */
  /* Selection Logic */
  /* ---------------------------------- */
  const toggleSelect = (file: string) => {
    setSelected((prev) => {
      if (!multiple) {
        return prev[0] === file ? [] : [file];
      }
      return prev.includes(file) ? prev.filter((i) => i !== file) : [...prev, file];
    });
  };
  /* ---------------------------------- */
  /* Delete uploaded file */
  /* ---------------------------------- */
  const handleDelete = (file: string) => {
    if (!file) return;
    mutateDelete({ fileUrl: file });
  };

  /* ---------------------------------- */
  /* Save selection to Redux */
  /* ---------------------------------- */
  const handleSaveBtn = () => {
    dispatch(setSelectedFiles(selected));
    dispatch(
      setUploadModal({
        open: false,
        type: isUploadModal.type,
      })
    );
  };

  /* ---------------------------------- */
  /* Close modal */
  /* ---------------------------------- */
  const handleClose = () => {
    setSelected([]);
    dispatch(
      setUploadModal({
        open: false,
        type: isUploadModal.type,
      })
    );
  };

  return (
    <>
      <div className="flex flex-col gap-4 custom-scrollbar h-[327px] overflow-y-auto">
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
          {isLoadingImages || isLoadingPdf
            ? [...Array(10)].map((_, i) => <Skeleton key={i} variant="rectangular" width="100%" height={140} sx={{ borderRadius: "10px" }} />)
            : ListData?.map((file: string, idx: number) => (
                <div
                  key={idx}
                  onClick={() => toggleSelect(file)}
                  className={`relative group border rounded-xl p-2 cursor-pointer
                    ${selected.includes(file) ? "border-brand-400" : "border-gray-200"}`}
                >
                  {/* Selected badge */}
                  {selected.includes(file) && <span className="absolute top-2 left-2 bg-brand-500 text-white rounded-sm px-1 text-xs">✔</span>}

                  {/* Preview */}
                  {isUploadModal.type === "image" ? (
                    <img src={file} alt="file" className="w-full h-[140px] object-cover rounded-md" />
                  ) : (
                    <div className="flex flex-col items-center justify-center h-[140px]">
                      <PictureAsPdfIcon sx={{ fontSize: 40 }} />
                    </div>
                  )}

                  {/* Menu */}
                  <div className="absolute top-1 right-1 w-full h-full flex items-start justify-end">
                    <div className="transform transition-all bg-gray-50 rounded-full opacity-0 group-hover:opacity-100">
                      <IconButton
                        color="error"
                        size="small"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDelete(file);
                        }}
                      >
                        <DeleteIcon />
                      </IconButton>
                    </div>
                  </div>
                </div>
              ))}
        </div>
      </div>

      {/* Footer */}
      <div className="flex justify-between gap-3 mt-5 pt-4 border-t border-gray-200 dark:border-gray-800">
        <p className="text-gray-500">{selected.length} selected</p>
        <div className="flex gap-2">
          <CommonButton title="Close" onClick={handleClose} />
          <CommonButton variant="contained" title="Save" onClick={handleSaveBtn} />
        </div>
      </div>
    </>
  );
};

export default FileGallery;
