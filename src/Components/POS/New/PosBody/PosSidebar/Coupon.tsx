import { Divider, Grid } from "@mui/material";
import { useState } from "react";
import { CommonButton, CommonSelect } from "../../../../../Attribute";
import { useAppDispatch, useAppSelector } from "../../../../../Store/hooks";
import { setCouponModal } from "../../../../../Store/Slices/ModalSlice";
import { CommonModal } from "../../../../Common";
import { PAYMENT_MODE } from "../../../../../Data";

const Coupon = () => {
  const { isCouponModal } = useAppSelector((state) => state.modal);
  const dispatch = useAppDispatch();
  const [value, setValue] = useState<string[]>([]);

  return (
    <CommonModal title="Coupon" isOpen={isCouponModal} onClose={() => dispatch(setCouponModal())} className="max-w-[600px]">
      <div className="space-y-3">
        {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 111, 11, 11, 1, 1, 1].map((_, i) => (
          <>
            <Grid container spacing={2} key={i} className="flex! items-center! gap-3 p-3 m-0">
              <Grid size={{ xs: 12, sm: 5 }}>
                <span className="flex-1 text-sm font-medium text-gray-700 dark:text-gray-400 truncate">Winter Special</span>
              </Grid>
              <CommonSelect label="Coupon No." options={PAYMENT_MODE} value={value} onChange={(v) => setValue(v)} limitTags={1} grid={{ xs: 12, sm: 5 }} multiple />
              <Grid size={{ xs: 12, sm: 2 }} className="flex justify-center sm:justify-end">
                <CommonButton title="Assign" variant="outlined" color="primary" size="small" className="shrink-0" />
              </Grid>
            </Grid>
            <Divider variant="middle" className="border-gray-300! dark:border-gray-800!" />
          </>
        ))}
      </div>
    </CommonModal>
  );
};

export default Coupon;
