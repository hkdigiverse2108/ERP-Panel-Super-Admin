import { Box } from "@mui/material";
import { useFormikContext } from "formik";
import { useEffect, useState } from "react";
import { CommonValidationTextField } from "../../../Attribute";
import { CommonCard } from "../../../Components/Common";
import type { BillingSummaryProps, PurchaseOrderFormValues, PurchaseOrderItem } from "../../../Types";
import TaxDetailsTable from "./TaxDetailsTable";

const BillingSummary = ({ productData }: BillingSummaryProps) => {
  const { values, setFieldValue } = useFormikContext<PurchaseOrderFormValues>();
  const [showTaxDetails, setShowTaxDetails] = useState(false);

  useEffect(() => {
    const newItems = values.items || [];
    const totalUnitCost = newItems.reduce((sum: number, item: PurchaseOrderItem) => sum + (Number(item.qty) * Number(item.unitCost) || 0), 0) || 0;

    // Calculate Tax Manually from Items
    const totalCalculatedTax =
      newItems.reduce((acc: number, item: PurchaseOrderItem) => {
        const qty = Number(item.qty) || 0;
        const unitCost = Number(item.unitCost) || 0;
        const isOutOfScope = values.taxType === "out_of_scope";
        const rate = isOutOfScope ? 0 : Number(item.tax) || 0;

        if (values.taxType === "tax_inclusive" && !isOutOfScope) {
          const totalCtx = qty * unitCost;
          return acc + (totalCtx - totalCtx / (1 + rate / 100));
        } else {
          return acc + qty * unitCost * (rate / 100);
        }
      }, 0) || 0;

    const grossAmount = totalUnitCost;
    const discountInput = Number(values.flatDiscount) || 0;
    const taxableAmount = grossAmount;

    if (values.grossAmount !== grossAmount) setFieldValue("grossAmount", grossAmount);
    if (values.taxableAmount !== taxableAmount) setFieldValue("taxableAmount", taxableAmount);
    if (values.discountAmount !== discountInput) setFieldValue("discountAmount", discountInput);

    const roundOff = Number(values.roundOff) || 0;

    // Net Amount Calculation
    let net = 0;
    if (values.taxType === "tax_inclusive") {
      net = grossAmount - discountInput + roundOff;
    } else {
      // Exclusive, Out of Scope (behaves like exclusive 0 tax)
      net = grossAmount + totalCalculatedTax - discountInput + roundOff;
    }

    if (values.netAmount !== net) setFieldValue("netAmount", net);
  }, [values.items, values.taxType, values.flatDiscount, values.tax, values.roundOff, setFieldValue]);

  // Render Scope Calculation for Display
  const calculatedTaxAmount = (values.items || []).reduce((acc: number, item: PurchaseOrderItem) => {
    const qty = Number(item.qty) || 0;
    const unitCost = Number(item.unitCost) || 0;
    const isOutOfScope = values.taxType === "out_of_scope";
    const rate = isOutOfScope ? 0 : Number(item.tax) || 0;

    if (values.taxType === "tax_inclusive" && !isOutOfScope) {
      const totalCtx = qty * unitCost;
      return acc + (totalCtx - totalCtx / (1 + rate / 100));
    } else {
      return acc + qty * unitCost * (rate / 100);
    }
  }, 0);

  const summary = {
    grossAmount: Number(values.grossAmount) || 0,
    discountAmount: Number(values.discountAmount) || 0,
    taxableAmount: Number(values.taxableAmount) || 0,
    taxAmount: calculatedTaxAmount,
    netAmount: Number(values.netAmount) || 0,
  };

  return (
    <CommonCard hideDivider grid={{ xs: 12 }}>
      <Box sx={{ p: 2, display: "flex", gap: 2, flexDirection: { xs: "column", md: "row" }, justifyContent: "space-between", alignItems: "flex-start" }}>
        <Box sx={{ width: { xs: "100%", md: "60%" } }}>{showTaxDetails && <TaxDetailsTable items={values.items || []} productData={productData?.data || []} taxType={values.taxType} />}</Box>

        <Box className="border text-sm w-full md:w-fit" sx={{ borderRadius: "8px", overflow: "hidden" }}>
          {/* Row 1: Flat Discount */}
          <Box className="grid grid-cols-[130px_1fr] border-b border-gray-200 dark:border-gray-700">
            <Box className="bg-gray-50 dark:bg-gray-800 p-2 flex items-center justify-end font-medium">Flat Discount</Box>
            <Box className="p-1 px-2 flex justify-end">
              <span className="text-gray-900 dark:text-gray-100 font-bold ml-1 w-50">
                <CommonValidationTextField name="flatDiscount" label="" type="number" size="small" sx={{ width: "70px", "& input": { textAlign: "right" } }} isCurrency currencyDisabled />
              </span>
            </Box>
          </Box>

          {/* Gross Amount */}
          <Box className="grid grid-cols-[130px_1fr] border-b">
            <Box className="bg-gray-50 dark:bg-gray-800 p-2 flex justify-end font-medium">Gross Amount</Box>
            <Box className="p-2 text-right font-medium">{summary.grossAmount.toFixed(2)}</Box>
          </Box>

          {/* Discount */}
          <Box className="grid grid-cols-[130px_1fr] border-b">
            <Box className="bg-gray-50 dark:bg-gray-800 p-2 flex justify-end font-medium">Discount</Box>
            <Box className="p-2 text-right">{summary.discountAmount.toFixed(2)}</Box>
          </Box>

          {/* Taxable Amount */}
          <Box className="grid grid-cols-[130px_1fr] border-b">
            <Box className="bg-gray-50 dark:bg-gray-800 p-2 flex justify-end font-medium">Taxable Amount</Box>
            <Box className="p-2 text-right">{summary.taxableAmount.toFixed(2)}</Box>
          </Box>

          {/* Tax */}
          <Box className="grid grid-cols-[130px_1fr] border-b cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800" onClick={() => setShowTaxDetails(!showTaxDetails)}>
            <Box className="bg-gray-50 dark:bg-gray-800 p-2 flex justify-end font-medium text-blue-500 gap-1 items-center">
              Tax (%)
              <span className="text-gray-900 dark:text-gray-100 font-bold ml-1">{values.tax || ""}</span>
            </Box>
            <Box className="p-2 flex justify-end items-center">
              <span className="font-medium align-middle">{summary.taxAmount.toFixed(2)}</span>
            </Box>
          </Box>
          {/* Roundoff */}
          <Box className="grid grid-cols-[130px_1fr] border-b">
            <Box className="bg-gray-50 dark:bg-gray-800 p-2 flex justify-end font-medium text-blue-500">Roundoff</Box>
            <Box className="p-1 px-2 flex justify-end">
              <span className="text-gray-900 dark:text-gray-100 font-bold ml-1 w-50">
                <CommonValidationTextField name="roundOff" label="" type="number" size="small" sx={{ width: "100px", "& input": { textAlign: "right" } }} />
              </span>

            </Box>
          </Box>

          {/* Net Amount */}
          <Box className="grid grid-cols-[130px_1fr]">
            <Box className="bg-gray-50 dark:bg-gray-800 p-3 flex justify-end font-bold text-lg">Net Amount</Box>
            <Box className="p-3 text-right font-bold text-lg">{summary.netAmount.toFixed(2)}</Box>
          </Box>
        </Box>
      </Box>
    </CommonCard>
  );
};

export default BillingSummary;
