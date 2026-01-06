import { Tab, Tabs } from "@mui/material";
import { useState } from "react";
import { useAppDispatch, useAppSelector } from "../../../Store/hooks";
import { setUploadModal } from "../../../Store/Slices/ModalSlice";
import Dropzone from "./Dropzone";
import FileGallery from "./FileGallery";
import CommonModal from "../Modal/CommonModal";

const CommonUpload = () => {
  const [tab, setTab] = useState(0);
  const { isUploadModal } = useAppSelector((state) => state.modal);
  const dispatch = useAppDispatch();

  return (
    <CommonModal isOpen={isUploadModal.open} title={`Upload ${isUploadModal.type === "image" ? "Image" : "PDF"}`} onClose={() => dispatch(setUploadModal({ open: false, type: "image" }))} className="max-w-[900px] m-2 sm:m-5">
      <div className="flex flex-col gap-5">
        <Tabs value={tab} onChange={(_, v) => setTab(v)} className="border-b border-gray-200 dark:border-gray-800">
          <Tab label="Select File" />
          <Tab label="Upload New" />
        </Tabs>

        {tab === 0 && <FileGallery />}
        {tab === 1 && <Dropzone />}
      </div>
    </CommonModal>
  );
};

export default CommonUpload;
