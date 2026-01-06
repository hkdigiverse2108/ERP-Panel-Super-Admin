import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";
import { useState } from "react";
import { CommonButton, CommonSelect, CommonTextField } from "../../../../../Attribute";
import { USER_TYPE } from "../../../../../Data";
import { useAppDispatch } from "../../../../../Store/hooks";
import { setProductDetailsModal, setQtyCountModal } from "../../../../../Store/Slices/ModalSlice";
import ProductDetails from "./ProductDetails";
import QtyCount from "./QtyCount";

type PosRow = {
  id: number;
  salesman: string[];
  itemCode: string;
  product: string;
  qty: number;
  mrp: number;
  unit: string;
  discount: number;
  addDisc: number;
};

const PosTable = () => {
  const [isCurrencyType, setIsCurrencyType] = useState("");

  const [rows, setRows] = useState<PosRow[]>([
    { id: 1, salesman: ["Dhruvi Bakery"], itemCode: "CK-BC-DN-002", product: "Butter Cookies 400g/800g", qty: 1, mrp: 300, unit: "GM", discount: 0, addDisc: 0 },
    { id: 2, salesman: ["Dhruvi Bakery"], itemCode: "CK-BC-UN-001", product: "Butter Cookies 75g/150g/500g", qty: 2, mrp: 50, unit: "GM", discount: 0, addDisc: 0 },
  ]);

  const dispatch = useAppDispatch();

  const updateRow = (id: number, data: Partial<PosRow>) => setRows((prev) => prev.map((r) => (r.id === id ? { ...r, ...data } : r)));

  const removeRow = (id: number) => setRows((prev) => prev.filter((r) => r.id !== id));

  const calcUnitCost = (row: PosRow) => {
    const discountAmount = isCurrencyType === "%" ? (row.mrp * row.discount) / 100 : row.discount;
    const addDiscountAmount = isCurrencyType === "%" ? (row.mrp * row.addDisc) / 100 : row.addDisc;
    return Math.max(0, row.mrp - discountAmount - addDiscountAmount);
  };

  const calcNetAmount = (row: PosRow) => (calcUnitCost(row) * row.qty).toFixed(2);
  const roundQty = (val: number) => Number(val.toFixed(2));

  return (
    <>
      <div className="w-full p-2 bg-white dark:bg-gray-dark">
        <div className="lg:h-[420px] max-h-[420px] overflow-x-auto custom-scrollbar border border-gray-200 dark:border-gray-600 rounded-md">
          <table className="w-full text-sm ">
            <thead className="sticky top-0 z-10 bg-gray-100 dark:text-gray-100 text-gray-700 dark:bg-gray-900">
              <tr>
                <th className="p-2">#</th>
                <th className="p-2">Salesman</th>
                <th className="p-2">Itemcode</th>
                <th className="p-2 text-start">Product</th>
                <th className="p-2">Qty</th>
                <th className="p-2">MRP</th>
                <th className="p-2">Unit</th>
                <th className="p-2">Discount</th>
                <th className="p-2">Add Disc</th>
                <th className="p-2">Unit Cost</th>
                <th className="p-2">Net Amount</th>
                <th className="p-2"></th>
              </tr>
            </thead>

            <tbody>
              {rows.map((row, i) => {
                const unitCost = calcUnitCost(row);

                return (
                  <tr key={row.id} className="text-center bg-white dark:bg-gray-800 even:bg-gray-50 dark:even:bg-gray-dark text-gray-600 dark:text-gray-300">
                    <td className="p-2 text-center">{i + 1}</td>
                    <td className="p-2 min-w-40 w-40">
                      <CommonSelect label="Salesman" options={USER_TYPE} value={row.salesman} onChange={(value) => updateRow(row.id, { salesman: value })} />
                    </td>

                    <td className="p-2 min-w-40 w-40">{row.itemCode}</td>
                    <td className="p-2 min-w-60 w-60 text-start">
                      <a href="#" onClick={() => dispatch(setProductDetailsModal({ open: true, data: row }))} className="text-blue-600 underline">
                        {row.product}
                      </a>
                    </td>

                    {/* QTY */}
                    <td className="p-2 min-w-30 w-30">
                      <div className="flex gap-1 justify-center items-center cursor-pointer">
                        <CommonButton variant="outlined" size="small" sx={{ minWidth: 40 }} onClick={() => updateRow(row.id, { qty: roundQty(Math.max(0.1, row.qty - 0.1)) })}>
                          <RemoveIcon />
                        </CommonButton>

                        <span className="w-10" onClick={() => dispatch(setQtyCountModal({ open: true, date: row }))}>
                          {row.qty}
                        </span>

                        <CommonButton variant="outlined" size="small" sx={{ minWidth: 40 }} onClick={() => updateRow(row.id, { qty: roundQty(row.qty + 0.1) })}>
                          <AddIcon />
                        </CommonButton>
                      </div>
                    </td>

                    {/* MRP */}
                    <td className="p-2">{row.mrp.toFixed(2)}</td>
                    <td className="p-2">{row.unit}</td>

                    {/* DISCOUNT */}
                    <td className="p-2 min-w-32 w-32">
                      <CommonTextField type="number" value={row.discount} onChange={(e) => updateRow(row.id, { discount: Number(e) })} isCurrency onCurrencyLog={(val) => setIsCurrencyType(val)} />
                    </td>

                    {/* ADD DISCOUNT */}
                    <td className="p-2 min-w-32 w-32">
                      <CommonTextField type="number" value={row.addDisc} onChange={(e) => updateRow(row.id, { addDisc: Number(e) })} isCurrency disabled />
                    </td>

                    {/* UNIT COST */}
                    <td className="p-2">{unitCost.toFixed(2)}</td>

                    {/* NET AMOUNT */}
                    <td className="p-2 font-medium">{calcNetAmount(row)}</td>

                    {/* REMOVE */}
                    <td className="p-2">
                      <button className="text-red-500 text-lg" onClick={() => removeRow(row.id)}>
                        ✕
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
      <ProductDetails />
      <QtyCount />
    </>
  );
};

export default PosTable;
