import { useMemo, useState } from "react";
import { useAppDispatch, useAppSelector } from "../../../../../Store/hooks";
import { setAdditionalChargeModal } from "../../../../../Store/Slices/ModalSlice";
import { CommonModal } from "../../../../Common";
import DeleteIcon from "@mui/icons-material/Delete";
import { IconButton } from "@mui/material";
import { CommonSelect, CommonTextField } from "../../../../../Attribute";
import { GROUP_OPTIONS, TAX_OPTIONS } from "../../../../../Data";

type RowType = {
  charge: string[];
  value: number;
  tax: string[];
  group: string[];
  total: number;
};

const TAX_MAP: Record<string, number> = {
  NON_GST_0: 0,
  EXEMPT_0: 0,
  GST_0: 0,
  GST_5: 5,
  GST_12: 12,
  GST_18: 18,
  GST_28: 28,
};

const AdditionalCharge = () => {
  const { isAdditionalChargeModal } = useAppSelector((s) => s.modal);
  const dispatch = useAppDispatch();

  const [rows, setRows] = useState<RowType[]>([]);

  const calculateTotal = (value: number, taxArr: string[]) => {
    const taxKey = taxArr?.[0];
    const rate = TAX_MAP[taxKey] ?? 0;
    return value + (value * rate) / 100;
  };

  const updateRow = (index: number, key: keyof RowType, val: any) => {
    setRows((prev) =>
      prev.map((row, i) => {
        if (i !== index) return row;

        const updatedRow: RowType = {
          ...row,
          [key]: key === "value" ? Number(val) || 0 : val,
        } as RowType;

        updatedRow.total = calculateTotal(updatedRow.value, updatedRow.tax);

        return updatedRow;
      })
    );
  };

  const addRow = () => setRows((p) => [...p, { charge: [""], value: 0, tax: [""], group: [""], total: 0 }]);

  const removeRow = (i: number) => setRows((p) => p.filter((_, idx) => idx !== i));

  const grandTotal = useMemo(() => rows.reduce((sum, r) => sum + r.total, 0), [rows]);

  return (
    <CommonModal title="Add Additional Charge" isOpen={isAdditionalChargeModal} onClose={() => dispatch(setAdditionalChargeModal())} className="max-w-[1000px]">
      <div className="border border-gray-200 dark:border-gray-600 rounded-md overflow-y-auto custom-scrollbar text-sm">
        <table className="w-full ">
          <thead className="bg-gray-100 dark:bg-gray-900 text-gray-700 dark:text-gray-100">
            <tr>
              <th className="px-3 py-2 text-left">Additional Charge</th>
              <th className="px-3 py-2">Value</th>
              <th className="px-3 py-2">Tax</th>
              <th className="px-3 py-2">Account Group</th>
              <th className="px-3 py-2">Total</th>
              <th className="px-3 py-2">Actions</th>
            </tr>
          </thead>

          <tbody>
            {rows.map((row, i) => (
              <tr key={i} className="bg-white dark:bg-gray-800 even:bg-gray-50 dark:even:bg-gray-dark text-gray-600 dark:text-gray-300">
                <td className="px-2 py-2 min-w-60 w-60">
                  <CommonSelect label="Select Additional Charge" value={row.tax} options={TAX_OPTIONS} onChange={(val) => updateRow(i, "charge", val)} />
                </td>
                <td className="px-2 py-2 min-w-40 w-40">
                  <CommonTextField value={row.value} isCurrency onChange={(e) => updateRow(i, "value", e)} />
                </td>
                <td className="px-2 py-2 min-w-40 w-44">
                  <CommonSelect label="Select Text" value={row.tax} options={TAX_OPTIONS} onChange={(val) => updateRow(i, "tax", val)} />
                </td>
                <td className="px-2 py-2 min-w-56 w-56">
                  <CommonSelect label="Select Group" value={row.group} options={GROUP_OPTIONS} onChange={(val) => updateRow(i, "group", val)} />
                </td>
                <td className="px-3 py-2 text-right font-medium">{row.total.toFixed(2)}</td>
                <td className="px-2 py-2 text-center">
                  <IconButton size="small" onClick={() => removeRow(i)}>
                    <DeleteIcon fontSize="small" />
                  </IconButton>
                </td>
              </tr>
            ))}
          </tbody>

          <tfoot>
            <tr className="bg-gray-100 dark:bg-gray-900 text-gray-700 dark:text-gray-100">
              <td className="px-2 py-3">
                <button onClick={addRow} className="text-primary font-medium">
                  + Add More Additional Charge
                </button>
              </td>
              <td colSpan={3} />
              <td className="px-3 text-right font-semibold">{grandTotal.toFixed(2)}</td>
              <td />
            </tr>
          </tfoot>
        </table>
      </div>
    </CommonModal>
  );
};

export default AdditionalCharge;
