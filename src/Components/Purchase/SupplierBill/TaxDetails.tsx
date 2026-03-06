import { useMemo } from "react";
import { Queries } from "../../../Api";
import type { ProductRow, AdditionalChargeRow, TaxDetailsProps } from "../../../Types";
export const TaxDetails = ({ rows, additionalChargeRows, flatDiscount, roundOffAmount }: TaxDetailsProps) => {
  const { data: TaxData, isLoading: TaxDataLoading } = Queries.useGetTaxDropdown();

  const summary = useMemo(() => {
    const itemDiscount = rows.reduce((s: number, r: ProductRow) => s + (Number(r.disc1) || 0) + (Number(r.disc2) || 0), 0);
    const itemTaxable = rows.reduce((s: number, r: ProductRow) => s + (Number(r.taxableAmount) || 0), 0);
    const itemTax = rows.reduce((s: number, r: ProductRow) => s + (Number(r.itemTax) || 0), 0);
    const itemGross = rows.reduce((s: number, r: ProductRow) => s + (Number(r.qty) || 0) * (Number(r.sellingPrice) || 0), 0);
    const additionalTaxable = additionalChargeRows.reduce((s: number, r: AdditionalChargeRow) => s + (Number(r.taxAmount) || 0), 0);
    const additionalTax = additionalChargeRows.reduce((s: number, r: AdditionalChargeRow) => s + (Number(r.taxAmount) || 0), 0);
    const grossAmount = itemGross + additionalTaxable;
    const totalTaxableBeforeDiscount = itemTaxable + additionalTaxable;
    const flatDisc = Number(flatDiscount) || 0;
    const taxableAfterDiscount = Math.max(0, totalTaxableBeforeDiscount - flatDisc);
    const totalTax = itemTax + additionalTax;
    const effectiveTaxRate = totalTaxableBeforeDiscount > 0 ? totalTax / totalTaxableBeforeDiscount : 0;
    const finalTaxAmount = taxableAfterDiscount * effectiveTaxRate;
    const roundOff = Number(roundOffAmount) || 0;
    const netAmount = taxableAfterDiscount + finalTaxAmount + roundOff;
    const taxBreakdown: Record<string, { rate: number; amount: number }> = {};

    rows.forEach((r: ProductRow) => {
      const amount = Number(r.itemTax) || 0;
      if (r.taxName && amount > 0) {
        if (!taxBreakdown[r.taxName]) {
          taxBreakdown[r.taxName] = { rate: Number(r.taxRate) || 0, amount: 0 };
        }
        taxBreakdown[r.taxName].amount += amount;
      }
    });

    additionalChargeRows.forEach((r: AdditionalChargeRow) => {
      const amount = Number(r.taxAmount) || 0;
      if (r.taxId) {
        const taxObj = TaxData?.data?.find((t) => String(t._id) === String(r.taxId));
        const name = taxObj?.name || "Tax";
        const rate = taxObj?.percentage || 0;

        if (!taxBreakdown[name]) {
          taxBreakdown[name] = { rate, amount: 0 };
        }
        taxBreakdown[name].amount += amount;
      }
    });

    const taxSummary = Object.entries(taxBreakdown).map(([name, data]) => ({
      name,
      rate: data.rate,
      amount: Number(data.amount.toFixed(2)),
    }));

    const summaryItemDiscount = itemDiscount + flatDisc;
    const summaryGrossAmount = grossAmount - flatDisc;

    return { itemDiscount: summaryItemDiscount, grossAmount: summaryGrossAmount, taxableAmount: taxableAfterDiscount, itemTax: Number(finalTaxAmount.toFixed(2)), roundOff, netAmount: Number(netAmount.toFixed(2)), taxSummary };
  }, [rows, additionalChargeRows, flatDiscount, roundOffAmount, TaxData]);

  return { summary, TaxData, TaxDataLoading };
};
