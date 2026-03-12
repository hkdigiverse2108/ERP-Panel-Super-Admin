import { Box } from "@mui/material";
import { useFormikContext } from "formik";
import { useState, useEffect } from "react";
import { CommonValidationTextField } from "../../Attribute";
import type { CommonTableColumn } from "../../Types";
import CommonTable from "./CommonTable";
import { Queries } from "../../Api";

interface CommonSummarySectionProps {
  name?: string;
}

const CommonSummarySection = ({ name = "transactionSummary" }: CommonSummarySectionProps) => {
  const { values } = useFormikContext<any>();
  const [showTaxBreakdown, setShowTaxBreakdown] = useState(false);
  const summary = values[name] || {};

  const taxBreakdownColumns: CommonTableColumn<{
    name: string;
    rate: number;
    amount: number;
  }>[] = [
    { key: "name", header: "Tax", headerClass: "text-left px-4 w-52", bodyClass: "text-left px-4 w-52", render: (row) => row.name },
    { key: "rate", header: "Tax Rate", headerClass: "text-center px-4 w-32", bodyClass: "text-center px-4 w-32 whitespace-nowrap", render: (row) => `${row.rate}%` },
    { key: "amount", header: "Tax Amount", headerClass: "text-right px-4 w-36", bodyClass: "text-right px-4 w-36 whitespace-nowrap font-medium", render: (row) => (row.amount || 0).toFixed(2) },
  ];

  const taxBreakdownData = summary?.taxSummary || [];

  return (
    <>
      <Box sx={{ p: 2, display: "flex", gap: 2, flexDirection: { xs: "column", md: "row" }, justifyContent: "space-between", alignItems: "flex-start" }}>
        <Box sx={{ width: { xs: "100%", md: "60%" } }}>
          {showTaxBreakdown && (
            <Box className="border border-gray-200 dark:border-gray-700 rounded-md overflow-hidden">
              <CommonTable data={taxBreakdownData} columns={taxBreakdownColumns} rowKey={(row: { name: string; rate: number; amount: number }) => row.name + row.rate} />
            </Box>
          )}
        </Box>

        <Box className="border dark:border-gray-700 text-sm w-full md:w-fit" sx={{ borderRadius: "8px", overflow: "hidden" }}>
          {/* Row 1: Flat Discount */}
          <Box className="grid grid-cols-[130px_1fr] border-b border-gray-200 dark:border-gray-700">
            <Box className="bg-gray-50 dark:bg-gray-800 p-2 flex items-center justify-end font-medium">Flat Discount</Box>
            <Box className="p-1 px-2 flex justify-end">
              <span className="text-gray-900 dark:text-gray-100 font-bold ml-1 w-50">
                <CommonValidationTextField name={`${name}.flatDiscount`} label="" type="number" size="small" sx={{ width: "70px", "& input": { textAlign: "right" } }} isCurrency currencyDisabled />
              </span>
            </Box>
          </Box>

          {/* Gross Amount */}
          <Box className="grid grid-cols-[130px_1fr] border-b border-gray-200 dark:border-gray-700">
            <Box className="bg-gray-50 dark:bg-gray-800 p-2 flex justify-end font-medium">Gross Amount</Box>
            <Box className="p-2 text-right font-medium">{Number(summary?.grossAmount)?.toFixed(2)}</Box>
          </Box>

          {/* Discount */}
          <Box className="grid grid-cols-[130px_1fr] border-b border-gray-200 dark:border-gray-700">
            <Box className="bg-gray-50 dark:bg-gray-800 p-2 flex justify-end font-medium">Discount</Box>
            <Box className="p-2 text-right">{Number(summary?.discountAmount)?.toFixed(2)}</Box>
          </Box>

          {/* Taxable Amount */}
          <Box className="grid grid-cols-[130px_1fr] border-b border-gray-200 dark:border-gray-700">
            <Box className="bg-gray-50 dark:bg-gray-800 p-2 flex justify-end font-medium">Taxable Amount</Box>
            <Box className="p-2 text-right">{Number(summary?.taxableAmount)?.toFixed(2)}</Box>
          </Box>

          {/* Tax */}
          <Box
            className="grid grid-cols-[130px_1fr] border-b cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800 border-gray-200 dark:border-gray-700"
            onClick={() => setShowTaxBreakdown(!showTaxBreakdown)}
          >
            <Box className="bg-gray-50 dark:bg-gray-800 p-2 flex justify-end font-medium text-blue-500 gap-1 items-center">Tax</Box>
            <Box className="p-2 flex justify-end items-center">
              <span className="font-medium align-middle">{Number(summary?.taxAmount)?.toFixed(2)}</span>
            </Box>
          </Box>
          {/* Roundoff */}
          <Box className="grid grid-cols-[130px_1fr] border-b border-gray-200 dark:border-gray-700">
            <Box className="bg-gray-50 dark:bg-gray-800 p-2 flex justify-end font-medium text-blue-500">Roundoff</Box>
            <Box className="p-1 px-2 flex justify-end">
              <span className="text-gray-900 dark:text-gray-100 font-bold ml-1 w-50">
                <CommonValidationTextField name={`${name}.roundOff`} label="" type="number" size="small" sx={{ width: "100px", "& input": { textAlign: "right" } }} />
              </span>
            </Box>
          </Box>

          {/* Net Amount */}
          <Box className="grid grid-cols-[130px_1fr]">
            <Box className="bg-gray-50 dark:bg-gray-800 p-3 flex justify-end font-bold text-lg">Net Amount</Box>
            <Box className="p-3 text-right font-bold text-lg">{Number(summary?.netAmount)?.toFixed(2)}</Box>
          </Box>
        </Box>
      </Box>
    </>
  );
};

export default CommonSummarySection;

export interface CommonSummaryWatcherProps {
  summaryKey?: string;
  priceKey?: string;
  taxAmountKey?: string;
  hasAdditionalCharges?: boolean;
  itemsKey?: string;
}

export const CommonSummaryWatcher = ({
  summaryKey = "transactionSummary",
  priceKey = "price",
  taxAmountKey,
  hasAdditionalCharges = false,
  itemsKey = "items",
}: CommonSummaryWatcherProps) => {
  const { values, setFieldValue } = useFormikContext<any>();
  const { data: taxData } = Queries.useGetTaxDropdown();

  const items = itemsKey.split('.').reduce((o, i) => o?.[i], values) || [];

  const getTaxAmount = (r: any) => {
    if (taxAmountKey) {
      return Number(r[taxAmountKey] || 0);
    }
    return Number(r.totalAmount || 0) - Number(r.taxableAmount || 0);
  };

  const calculateSummary = () => {
    const itemGross = items?.reduce((s: number, r: any) => s + Number(r.qty || 0) * Number(r[priceKey] || 0), 0) || 0;
    const itemDiscount = items?.reduce((s: number, r: any) => s + Number(r.discount1 || 0), 0) || 0;
    const itemTaxable = items?.reduce((s: number, r: any) => s + Number(r.taxableAmount || 0), 0) || 0;
    const itemTax = items?.reduce((s: number, r: any) => s + getTaxAmount(r), 0) || 0;

    let chargeTaxable = 0;
    let chargeTax = 0;
    const isReverseCharge = hasAdditionalCharges && String(values.reverseCharge) === "true";

    if (hasAdditionalCharges) {
      chargeTaxable = values.additionalCharges?.reduce((s: number, r: any) => s + Number(r.amount || 0), 0) || 0;
      if (!isReverseCharge) {
        chargeTax = values.additionalCharges?.reduce((s: number, r: any) => s + (Number(r.totalAmount || 0) - Number(r.amount || 0)), 0) || 0;
      }
    }

    const totalTaxable = itemTaxable + chargeTaxable;
    const totalTax = itemTax + chargeTax;

    const summaryValue = values[summaryKey] || {};
    const flatDiscount = Number(summaryValue.flatDiscount || 0);
    const roundOffAmount = Number(summaryValue.roundOff || 0);

    const netBeforeRoundOff = totalTaxable + totalTax - flatDiscount;
    const netAmount = netBeforeRoundOff + roundOffAmount;

    // Calculate Tax Summary
    const taxMap: Record<string, { name: string; rate: number; amount: number }> = {};
    const processTax = (taxId: string | undefined, amount: number) => {
      if (!taxId) return;
      const tax = taxData?.data?.find((t: any) => t._id === taxId);
      if (!tax) return;
      if (!taxMap[taxId]) {
        taxMap[taxId] = { name: tax.name || "Tax", rate: tax.percentage || 0, amount: 0 };
      }
      taxMap[taxId].amount += amount;
    };

    items?.forEach((r: any) => processTax(r.taxId, getTaxAmount(r)));
    if (hasAdditionalCharges && !isReverseCharge) {
      values.additionalCharges?.forEach((r: any) => processTax(r.taxId, Number(r.totalAmount || 0) - Number(r.amount || 0)));
    }

    return {
      flatDiscount,
      grossAmount: Number(itemGross.toFixed(2)),
      discountAmount: Number((itemDiscount + flatDiscount).toFixed(2)),
      taxableAmount: Number(totalTaxable.toFixed(2)),
      taxAmount: Number(totalTax.toFixed(2)),
      roundOff: Number(roundOffAmount.toFixed(2)),
      netAmount: Number(netAmount.toFixed(2)),
      taxSummary: Object.values(taxMap).map((t) => ({ ...t, amount: Number(t.amount.toFixed(2)) })),
    };
  };

  useEffect(() => {
    const newSummary = calculateSummary();
    const currentSummary = values[summaryKey] || {};

    if (
      newSummary.grossAmount !== currentSummary.grossAmount ||
      newSummary.discountAmount !== currentSummary.discountAmount ||
      newSummary.taxableAmount !== currentSummary.taxableAmount ||
      newSummary.taxAmount !== currentSummary.taxAmount ||
      newSummary.netAmount !== currentSummary.netAmount ||
      JSON.stringify(newSummary.taxSummary) !== JSON.stringify(currentSummary.taxSummary)
    ) {
      setFieldValue(summaryKey, { ...currentSummary, ...newSummary });
    }

  }, [
    items,
    values.additionalCharges,
    values[summaryKey]?.flatDiscount,
    values[summaryKey]?.roundOff,
    values.reverseCharge,
    taxData,
  ]);

  return null;
};
