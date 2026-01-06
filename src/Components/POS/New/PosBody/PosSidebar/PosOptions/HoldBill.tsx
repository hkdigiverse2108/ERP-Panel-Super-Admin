import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import PrintIcon from "@mui/icons-material/Print";
import SearchIcon from '@mui/icons-material/Search';
import { IconButton } from "@mui/material";
import { useState } from "react";
import { CommonTextField } from "../../../../../../Attribute";
import { useAppDispatch, useAppSelector } from "../../../../../../Store/hooks";
import { setHoldBillDrawer } from "../../../../../../Store/Slices/DrawerSlice";
import { CommonDrawer } from "../../../../../Common";

const HoldBill = () => {
  const { isHoldBillDrawer } = useAppSelector((stale) => stale.drawer);
  const [value, setValue] = useState<string>("");

  const dispatch = useAppDispatch();

  const dummyBills = [
    {
      id: "HOLD2",
      date: "2025-12-29 04:42 pm",
      name: "Walk In Customer",
      contact: "-",
      amount: 50,
    },
    {
      id: "HOLD1",
      date: "2025-12-29 04:42 pm",
      name: "kartik",
      contact: "9906360330",
      amount: 39,
    },
  ];
  return (
    <CommonDrawer open={isHoldBillDrawer} onClose={() => dispatch(setHoldBillDrawer())} anchor="right" title="On Hold" paperProps={{ className: "bg-white dark:bg-gray-800!" }}>
      <div className="flex flex-col gap-3">
        {/* 🔍 Search */}
        <CommonTextField label="Search" placeholder="Search" endIcon={<SearchIcon/>} value={value} onChange={(e) => setValue(e)} />

        {/* 📄 List */}
        <div className="flex flex-col gap-3 overflow-y-auto">
          {dummyBills.map((bill) => (
            <div key={bill.id} className="bg-white dark:bg-gray-800 border dark:border-gray-700 rounded-md p-3 text-sm">
              {/* Header */}
              <div className="flex justify-between items-start">
                <div className="font-semibold">
                  Order ID : <span className="font-bold">{bill.id}</span>
                </div>

                <div className="flex gap-1">
                  <IconButton size="small">
                    <PrintIcon fontSize="small" />
                  </IconButton>
                  <IconButton size="small" color="error">
                    <DeleteForeverIcon fontSize="small" />
                  </IconButton>
                </div>
              </div>

              {/* Body */}
              <div className="text-xs text-gray-600 dark:text-gray-400 mt-1">{bill.date}</div>

              <div className="mt-2 space-y-1">
                <div>
                  <span className="font-medium">Contact Name :</span> {bill.name}
                </div>
                <div>
                  <span className="font-medium">Contact No :</span> {bill.contact}
                </div>
                <div className="font-semibold">Amount ₹{bill.amount.toFixed(2)}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </CommonDrawer>
  );
};

export default HoldBill;
