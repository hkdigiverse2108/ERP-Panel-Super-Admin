import { useAppDispatch, useAppSelector } from "../../../../../Store/hooks";
import { setProductDetailsModal } from "../../../../../Store/Slices/ModalSlice";
import { CommonModal } from "../../../../Common";

const ProductDetails = () => {
  const { isProductDetailsModal } = useAppSelector((state) => state.modal);
  const dispatch = useAppDispatch();
  // const ProductDetails = isProductDetailsModal.data || null;
  // console.log("ProductDetails",ProductDetails);
  
  const ProductData = [
    { title: "Display Name", value: "Butter Cookies 400g/800g" },
    { title: "Available Stock", value: "1.00" },
    { title: "Department", value: "Bakery" },
    { title: "Category", value: "Cookies" },
    { title: "Brand", value: "Unibic - Premium" },
    { title: "Unit", value: "GM" },
    { title: "Tax Rate", value: "18" },
    { title: "HSN Code", value: "19053100" },
  ];

  return (
    <CommonModal title="Product Details" isOpen={isProductDetailsModal.open} onClose={() => dispatch(setProductDetailsModal({ open: false, data: null }))} className="max-w-[600px]">
      <div className="border border-gray-200 dark:border-gray-600 rounded-md overflow-hidden">
        <div className="max-h-120 overflow-y-auto custom-scrollbar">
          <table className="w-full text-sm">
            <thead className="sticky top-0 z-10 bg-gray-100 text-gray-700 dark:bg-gray-900 dark:text-gray-100">
              <tr>
                <th className="px-3 py-2 text-left">Sr No.</th>
                <th className="px-3 py-2 text-left">Product</th>
              </tr>
            </thead>
            <tbody>
              {ProductData.map((item, index) => (
                <tr key={index} className="bg-white dark:bg-gray-800 even:bg-gray-50 dark:even:bg-gray-dark">
                  <td className="px-3 py-2 font-medium text-gray-600 dark:text-gray-300">{item.title}</td>
                  <td className="px-3 py-2 font-medium text-gray-600 dark:text-gray-300">{item.value}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </CommonModal>
  );
};

export default ProductDetails;
