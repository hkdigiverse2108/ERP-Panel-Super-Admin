import { Divider } from "@mui/material";
import { CommonButton } from "../../../../../../Attribute";
import { useAppDispatch, useAppSelector } from "../../../../../../Store/hooks";
import { setRedeemLoyaltyModal } from "../../../../../../Store/Slices/ModalSlice";
import { CommonModal } from "../../../../../Common";

const RedeemLoyalty = () => {
  const { isRedeemLoyaltyModal } = useAppSelector((state) => state.modal);
  const dispatch = useAppDispatch();
  return (
    <CommonModal title="Redeem Loyalty" isOpen={isRedeemLoyaltyModal} onClose={() => dispatch(setRedeemLoyaltyModal())} className="max-w-[400px]">
      <div className="space-y-3">
        {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 111, 11, 11, 1, 1, 1].map((_, i) => (
          <>
            <div key={i} className="flex items-center gap-3 p-3 m-0">
              {/* Coupon Text */}
              <span className="flex-1 text-sm font-medium text-gray-700 dark:text-gray-400 truncate">LYT-01 - 1000 points</span>

              {/* Action */}
              <CommonButton title="Apply" variant="outlined" color="primary" size="small" className="shrink-0" />
            </div>
            <Divider variant="middle" className="border-gray-300! dark:border-gray-800!" />
          </>
        ))}
      </div>
    </CommonModal>
  );
};

export default RedeemLoyalty;
