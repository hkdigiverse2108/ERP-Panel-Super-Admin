import { type FC } from "react";
import { CommonButton } from "../../../Attribute";
import { useAppDispatch, useAppSelector } from "../../../Store/hooks";
import { setProductRenameModal } from "../../../Store/Slices/ModalSlice";
import CommonModal from "./CommonModal";
import { Mutations, Queries } from "../../../Api";
import { setIdentifiedItems } from "../../../Store/Slices/BillSnapSlice";

const ProductRenameModal: FC = () => {
  const dispatch = useAppDispatch();
  const { isProductRenameModal } = useAppSelector((state) => state.modal);
  const { open, title, data } = isProductRenameModal;
  const { refetch: refetchProductData } = Queries.useGetProductDropdown();

  const { mutate: editProduct, isPending: isRenaming } = Mutations.useEditProduct();

  const handleClose = () => {
    dispatch(setProductRenameModal({ ...isProductRenameModal, open: false }));
  };

  const handleConfirm = () => {
    if (!data) return;

    editProduct(
      {
        productId: data.productId,
        name: data.newName,
        sku: data.newName,
      },
      {
        onSuccess: () => {
          refetchProductData();
          dispatch(setIdentifiedItems([]));
          handleClose();
        },
      },
    );
  };

  return (
    <CommonModal title={title || "Confirm Action"} isOpen={open} onClose={handleClose} className="max-w-125 m-2 sm:m-5">
      <div className="">
        <span>This action will rename the product from </span>
        <br />
        <span className="font-semibold text-error-dark">"{data?.oldName || ""}"</span>
        <span> to </span>
        <span className="font-semibold text-primary">"{data?.newName || ""}"</span>
        <h2 className="font-semibold mt-2">Do you want to continue?</h2>
      </div>
      <div className="flex justify-end gap-2 mt-5">
        <CommonButton variant="outlined" onClick={handleClose} disabled={isRenaming}>
          Cancel
        </CommonButton>

        <CommonButton variant="contained" onClick={handleConfirm} loading={isRenaming}>
          Rename
        </CommonButton>
      </div>
    </CommonModal>
  );
};

export default ProductRenameModal;
