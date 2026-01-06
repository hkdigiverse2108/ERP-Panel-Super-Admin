import { type FC } from "react";
import { CommonButton } from "../../../Attribute";
import type { CommonDeleteModalProps } from "../../../Types";
import CommonModal from "./CommonModal";

const CommonDeleteModal: FC<CommonDeleteModalProps> = ({ open, title, description, itemName, loading = false, onClose, onConfirm }) => {
  return (
    <CommonModal title={title || "Confirm Delete"} isOpen={open} onClose={onClose} className="max-w-125 m-2 sm:m-5">
      <p className="my-3">
        {description || "Are you sure you want to delete"}
        {itemName && <span className="font-medium"> "{itemName}"</span>}?
      </p>

      <div className="flex justify-end gap-2">
        <CommonButton variant="outlined" onClick={onClose} disabled={loading}>
          Cancel
        </CommonButton>

        <CommonButton variant="outlined" color="error" onClick={onConfirm} loading={loading}>
          Yes, Delete It!
        </CommonButton>
      </div>
    </CommonModal>
  );
};

export default CommonDeleteModal;
