import { Box } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import { ClearIcon } from "@mui/x-date-pickers-pro";
import { CommonButton, CommonSelect, CommonTextField } from "../../../Attribute";
import CommonCard from "../../Common/CommonCard";
import { useState } from "react";
import { CommonTable } from "../../Common";
import type { AdditionalChargeRow, AdditionalChargesSectionProps, CommonTableColumn } from "../../../Types";

const AdditionalChargesSection = ({ show, onToggle, rows, onAdd, onRemove, onChange, taxOptions, isTaxLoading, flatDiscount, onFlatDiscountChange, summary, isAdditionalChargeLoading, additionalChargeOptions, roundOffAmount, onRoundOffAmountChange }: AdditionalChargesSectionProps) => {
  const [showTaxBreakdown, setShowTaxBreakdown] = useState(false);

  const AdditionalChargeColumns: CommonTableColumn<AdditionalChargeRow>[] = [
    {
      key: "actions",
      header: "",
      bodyClass: "p-2 flex justify-center gap-1",
      render: (_, index) => (
        <>
          {index === rows.length - 1 && (
            <CommonButton size="small" variant="outlined" onClick={onAdd}>
              <AddIcon />
            </CommonButton>
          )}
          {rows.length > 1 && (
            <CommonButton size="small" color="error" variant="outlined" onClick={() => onRemove(index)}>
              <ClearIcon />
            </CommonButton>
          )}
        </>
      ),
      footer: () => <span className="p-2 text-right block">Total</span>,
      footerClass: "text-right",
    },
    { key: "sr", header: "#", render: (_, i) => i + 1, bodyClass: "w-10", footer: "" },
    { key: "chargeId", header: "Additional Charge", headerClass: "text-start", bodyClass: "min-w-60 text-start", render: (row, index) => <CommonSelect label="Search Additional" value={row.chargeId ? [row.chargeId] : []} options={additionalChargeOptions} isLoading={isAdditionalChargeLoading} onChange={(v) => onChange(index, "chargeId", v)} />, footer: "" },
    { key: "amount", header: "Amount", bodyClass: "min-w-32", render: (row, index) => <CommonTextField type="number" value={row.amount} onChange={(v) => onChange(index, "amount", v)} />, footer: "" },
    { key: "taxId", header: "Tax", bodyClass: "min-w-52", render: (row, index) => <CommonSelect value={row.taxId ? [row.taxId] : []} options={taxOptions} isLoading={isTaxLoading} onChange={(v) => onChange(index, "taxId", v)} />, footer: "" },
    { key: "totalAmount", header: "Total", headerClass: "text-right", bodyClass: "min-w-28 p-2 text-right", render: (row) => row.totalAmount || 0, footer: (data) => data.reduce((a, b) => a + (parseFloat(b.totalAmount) || 0), 0).toFixed(2), footerClass: "text-right" },
  ];

  const taxBreakdownColumns: CommonTableColumn<{
    name: string;
    rate: number;
    amount: number;
  }>[] = [
    { key: "name", header: "Tax", headerClass: "text-left px-4 w-52", bodyClass: "text-left px-4 w-52" },
    { key: "rate", header: "Tax Rate", headerClass: "text-center px-4 w-32", bodyClass: "text-center px-4 w-32 whitespace-nowrap", render: (row) => `${row.rate}%` },
    { key: "amount", header: "Tax Amount", headerClass: "text-right px-4 w-36", bodyClass: "text-right px-4 w-36 whitespace-nowrap font-medium", render: (row) => row.amount.toFixed(2) },
  ];

  return (
    <Box p={2}>
      {!show && (
        <CommonButton size="small" startIcon={<AddIcon fontSize="small" />} onClick={() => onToggle(true)}>
          Add Additional Charges
        </CommonButton>
      )}

      {show && (
        <CommonCard
          hideDivider
          title="Additional Charge"
          topContent={
            <CommonButton size="small" color="error" variant="outlined" onClick={() => onToggle(false)}>
              <ClearIcon fontSize="small" />
            </CommonButton>
          }
        >
          <Box className="custom-scrollbar" sx={{ flex: 1, overflowX: "auto" }}>
            <Box sx={{ minWidth: 800 }}>
              <CommonTable data={rows} columns={AdditionalChargeColumns} rowKey={(_: any, i: number) => String(i)} showFooter />
            </Box>
          </Box>
        </CommonCard>
      )}

      {/* ===== SUMMARY ===== */}
      <Box sx={{ mt: 3, display: "grid", gridTemplateColumns: { xs: "1fr", md: "1fr 300px" }, gap: 2 }}>
        <Box sx={{ display: "flex", justifyContent: "center", alignItems: "flex-start" }}>
          {showTaxBreakdown && (
            <Box sx={{ width: "100%", maxWidth: 600, border: "1px solid", borderColor: "divider", borderRadius: 1, backgroundColor: "background.paper" }}>
              <CommonTable data={summary.taxSummary || []} columns={taxBreakdownColumns} rowKey={(r) => r.name} />
            </Box>
          )}
        </Box>
        <CommonCard hideDivider paperProps={{ sx: { border: "1px solid", borderColor: "divider", borderRadius: 2, overflow: "hidden" } }}>
          <Box className="bg-slate-50 dark:bg-slate-900/50 text-slate-700 dark:text-slate-200">
            <Box className="flex justify-between items-center p-3 border-b border-slate-200 dark:border-slate-800">
              <span className="font-medium text-sm">Flat Discount</span>
              <Box width={100}>
                <CommonTextField type="number" value={flatDiscount} onChange={onFlatDiscountChange} isCurrency currencyDisabled />
              </Box>
            </Box>
            <Box className="flex justify-between p-3 border-b border-slate-200 dark:border-slate-800 text-sm">
              <span className="text-slate-500">Item Discount</span>
              <span className="font-medium">{((summary.discountAmount || 0) + (summary.flatDiscount || 0)).toFixed(2)}</span>
            </Box>
            <Box className="flex justify-between p-3 border-b border-slate-200 dark:border-slate-800 text-sm">
              <span className="text-slate-500">Gross Amount</span>
              <span className="font-medium">{(summary.grossAmount || 0).toFixed(2)}</span>
            </Box>
            <Box className="flex justify-between p-3 border-b border-slate-200 dark:border-slate-800 text-sm">
              <span className="text-slate-500">Taxable Amount</span>
              <span className="font-medium">{(summary.taxableAmount || 0).toFixed(2)}</span>
            </Box>
            <Box className="flex justify-between p-3 border-b border-slate-200 dark:border-slate-800 text-sm group cursor-pointer hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors" onClick={() => setShowTaxBreakdown(!showTaxBreakdown)}>
              <span className="text-blue-600 dark:text-blue-400 flex items-center gap-1 font-medium">
                Tax{" "}
                <Box component="span" sx={{ fontSize: "10px", opacity: 0.7 }}>
                  {showTaxBreakdown ? "▲" : "▼"}
                </Box>
              </span>
              <span className="text-blue-600 dark:text-blue-400 font-bold">{(summary.taxAmount || 0).toFixed(2)}</span>
            </Box>
            <Box className="flex justify-between items-center p-3 border-b border-slate-200 dark:border-slate-800">
              <span className="text-slate-500 text-sm">Roundoff</span>
              <Box width={100}>
                <CommonTextField type="number" value={roundOffAmount} onChange={onRoundOffAmountChange} />
              </Box>
            </Box>
            <Box className="flex justify-between p-4 bg-primary-50 dark:bg-primary-900/20 text-primary-700 dark:text-primary-300">
              <span className="text-lg font-bold">Net Amount</span>
              <span className="text-xl font-black">₹{(summary.netAmount || 0).toFixed(2)}</span>
            </Box>
          </Box>
        </CommonCard>
      </Box>
    </Box>
  );
};

export default AdditionalChargesSection;
