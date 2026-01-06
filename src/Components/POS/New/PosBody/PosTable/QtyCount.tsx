import { useState } from "react";
import { CommonButton, CommonTextField } from "../../../../../Attribute";
import { useAppDispatch, useAppSelector } from "../../../../../Store/hooks";
import { setQtyCountModal } from "../../../../../Store/Slices/ModalSlice";
import { CommonModal } from "../../../../Common";

const keypad = ["1", "2", "3", "+10", "4", "5", "6", "+20", "7", "8", "9", "+50", "C", "0", ".", "⌫"];

const QtyCount = () => {
  const { isQtyCountModal } = useAppSelector((state) => state.modal);
  const dispatch = useAppDispatch();

  const [tendered, setTendered] = useState<string>("0.00");

  const handleKeyPress = (key: string) => {
    // CLEAR
    if (key === "C") {
      setTendered("0.00");
      return;
    }

    // BACKSPACE
    if (key === "⌫") {
      setTendered((prev) => {
        const next = prev.slice(0, -1);
        return next.length ? next : "0.00";
      });
      return;
    }

    // ADD AMOUNT (+5, +10...)
    if (key.startsWith("+")) {
      const add = Number(key.replace("+", ""));
      const current = parseFloat(tendered || "0");
      setTendered((current + add).toFixed(2));
      return;
    }

    // DECIMAL
    if (key === ".") {
      setTendered((prev) => {
        if (prev.includes(".")) return prev;
        return prev === "0.00" || prev === "0" ? "0." : prev + ".";
      });
      return;
    }

    // NUMBERS
    setTendered((prev) => {
      if (prev === "0.00" || prev === "0") return key;
      return prev + key;
    });
  };

  return (
    <CommonModal isOpen={isQtyCountModal.open} onClose={() => dispatch(setQtyCountModal({ open: false, data: null }))} className="max-w-[400px]" showCloseButton={false}>
      <div className="space-y-4 p-1">
        <div className="flex flex-col gap-4">
          <CommonTextField
            label="Qty"
            value={tendered}
            type="text"
            onChange={(e) => {
              const value = e;
              if (!/^\d*\.?\d*$/.test(value)) return;
              setTendered(value);
            }}
            color="primary"
            focused
          />
          <div className="grid grid-cols-4 gap-2">
            {keypad.map((key) => (
              <button key={key} onClick={() => handleKeyPress(key)} className="border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-gray-100 rounded py-3 text-xs sm:text-base font-semibold hover:bg-gray-100 active:scale-95">
                {key}
              </button>
            ))}
          </div>
          <div className="flex  justify-end gap-2">
            <CommonButton title="Cancel" variant="outlined" color="error" className="py-4" onClick={() => dispatch(setQtyCountModal({ open: false, data: null }))} />
            <CommonButton title="Submit" variant="contained" className="py-4" />
          </div>
        </div>
      </div>

      {/* RIGHT SIDE */}
    </CommonModal>
  );
};

export default QtyCount;
