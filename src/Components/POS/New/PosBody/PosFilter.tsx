import EditSquareIcon from "@mui/icons-material/EditSquare";
import { Grid } from "@mui/material";
import { useState } from "react";
import { CommonButton, CommonSelect } from "../../../../Attribute";
import { USER_TYPE } from "../../../../Data";
import CustomerForm from "./CustomerForm";
import AddBoxIcon from "@mui/icons-material/AddBox";
import { useAppDispatch } from "../../../../Store/hooks";
import { setCustomerModal } from "../../../../Store/Slices/ModalSlice";

const PosFilter = () => {
  const [value, setValue] = useState<string[]>([]);
  const dispatch = useAppDispatch();

  return (
    <>
      <Grid container spacing={2} className="flex justify-between items-center w-full bg-white dark:bg-gray-dark p-2">
        <CommonSelect label="Select Product" options={USER_TYPE} value={value} onChange={(v) => setValue(v)} limitTags={1} grid={{ xs: 12, xsm: 6, sm: 4 }} />
        <Grid size={{ xs: 12, xsm: 6, sm: 4 }} className="flex justify-end">
          <Grid container className="flex justify-center items-center w-full">
            <CommonSelect label="Select Customer" options={USER_TYPE} value={value} onChange={(v) => setValue(v)} limitTags={1} grid={{ xs: 10 }} />
            <Grid size={{ xs: 2 }} className="flex justify-center items-center">
              {value.length === 0 ? (
                <CommonButton size="small" onClick={() => dispatch(setCustomerModal({ open: true, data: null }))} sx={{ minWidth: 40, p: 0 }} variant="contained">
                  <AddBoxIcon />
                </CommonButton>
              ) : (
                <CommonButton size="small" onClick={() => dispatch(setCustomerModal({ open: true, data: { name: "krish" } }))} sx={{ minWidth: 40, p: 0 }} variant="contained">
                  <EditSquareIcon />
                </CommonButton>
              )}
            </Grid>
          </Grid>
        </Grid>
        <CommonSelect label="Sales Invoice" options={USER_TYPE} value={value} onChange={(v) => setValue(v)} limitTags={1} grid={{ xs: 12, sm: 4 }} />
      </Grid>
      <CustomerForm />
    </>
  );
};

export default PosFilter;
