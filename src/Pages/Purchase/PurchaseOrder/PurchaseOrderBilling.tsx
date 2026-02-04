import { Add } from "@mui/icons-material";
import { Box } from "@mui/material";
import { useFormikContext } from "formik";
import { useEffect, useState } from "react";
import { Mutations, Queries } from "../../../Api";
import { CommonButton, CommonValidationTextField } from "../../../Attribute";
import { CommonCard } from "../../../Components/Common"; // Assuming CommonCard is exported from here
import type { PurchaseOrderFormValues } from "../../../Types";
import TermsConditionModal from "./TermsConditionModal";

const PurchaseOrderBilling = () => {
    const { values, setFieldValue } = useFormikContext<PurchaseOrderFormValues>();
    const [openTermsModal, setOpenTermsModal] = useState(false);
    const { data: termsData, refetch: refetchTerms } = Queries.useGetTermsConditionDropdown();
    const { mutate: addTerm } = Mutations.useAddTermsCondition();

    const handleSaveTerm = (term: any) => {
        addTerm(
            { termsCondition: term.termsCondition } as any,
            {
                onSuccess: () => {
                    refetchTerms();
                },
            }
        );
    };

    // Logic Sync
    useEffect(() => {
        const itemsTotal =
            values.items?.reduce((sum, item, index) => {
                // Line Total = Qty * LandingCost
                const total = (Number(item.qty) || 0) * (Number(item.landingCost) || 0);

                if (values.items?.[index]?.total !== total) {
                    setFieldValue(`items.${index}.total`, total);
                }
                return sum + total;
            }, 0) ?? 0;

        const discount = Number(values.flatDiscount) || 0;
        const taxableAmount = Math.max(itemsTotal - discount, 0);
        const taxPercent = Number(values.tax) || 0;
        const taxAmount = taxableAmount * (taxPercent / 100);
        const roundOff = Number(values.roundOff) || 0;
        const netAmount = taxableAmount + taxAmount + roundOff;

        if (values.grossAmount !== itemsTotal) setFieldValue("grossAmount", itemsTotal);
        if (values.taxableAmount !== taxableAmount) setFieldValue("taxableAmount", taxableAmount);
        if (values.netAmount !== netAmount) setFieldValue("netAmount", netAmount);

        // Calculated Display Values
        // discountAmount typically is the difference or just the flat discount if that's the only one. 
        // In current logic: discountAmount = discount.
        if (values.discountAmount !== discount) setFieldValue("discountAmount", discount);

    }, [values.items, values.flatDiscount, values.tax, values.roundOff, setFieldValue]);

    const summary = {
        grossAmount: Number(values.grossAmount) || 0,
        discountAmount: Number(values.discountAmount) || 0,
        taxableAmount: Number(values.taxableAmount) || 0,
        taxAmount: (Number(values.taxableAmount) || 0) * ((Number(values.tax) || 0) / 100),
        netAmount: Number(values.netAmount) || 0,
    };

    return (
        <>
            <CommonCard title="Terms & Conditions" grid={{ xs: 12 }}>
                <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr"}, gap: 3, p: 2 }}>
                    {/* Terms Section */}
                    <Box>
                        <Box display="flex" justifyContent="space-between" mb={2}>
                            <Box fontWeight={600}>Terms & Conditions</Box>
                            <CommonButton startIcon={<Add />} onClick={() => setOpenTermsModal(true)}>
                                New Term
                            </CommonButton>
                        </Box>

                        <Box sx={{ overflowX: "auto" }}>
                            <table className="w-full text-sm border border-gray-200 dark:border-gray-700">
                                <thead className="bg-gray-100 dark:bg-gray-900 text-gray-700 dark:text-gray-200">
                                    <tr>
                                        <th className="p-2 w-10">#</th>
                                        <th className="p-2 text-left">Condition</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {termsData?.data?.map((term, index) => (
                                        <tr
                                            key={term._id}
                                            className="text-gray-600 dark:text-gray-300 bg-white dark:bg-gray-800 even:bg-gray-50 dark:even:bg-gray-dark border-b border-gray-100 dark:border-gray-700"
                                        >
                                            <td className="p-2">{index + 1}</td>
                                            <td className="p-2">{term.termsCondition}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </Box>
                    </Box>

                    {/* Note Section */}
                    <Box>
                        <Box fontWeight={600} mb={1}>
                            Note
                        </Box>
                        <CommonValidationTextField name="notes" multiline rows={4} placeholder="Enter a note (max 200 characters)" />
                        <Box mt={1} fontSize={12} textAlign="right">
                            {values.notes?.length || 0}/200 characters
                        </Box>
                    </Box>
                </Box>
            </CommonCard>

            <CommonCard title="Billing Summary" grid={{ xs: 12 }}>
                <Box sx={{ p: 2, display: "flex", justifyContent: "flex-end" }}>
                    <Box className="border border-gray-200 text-sm w-full md:w-1/3">
                        {/* Row 1: Flat Discount */}
                        <Box className="grid grid-cols-[140px_1fr] border-b border-gray-200 dark:border-gray-700">
                            <Box className="bg-gray-50 dark:bg-gray-800 p-2 flex items-center justify-end font-medium">Flat Discount</Box>
                            <Box className="p-1 px-2">
                                <CommonValidationTextField name="flatDiscount" label="" type="number" isCurrency sx={{ "& input": { textAlign: "right" } }} />
                            </Box>
                        </Box>

                        {/* Gross Amount */}
                        <Box className="grid grid-cols-[140px_1fr] border-b">
                            <Box className="bg-gray-50 dark:bg-gray-800 p-2 flex justify-end font-medium">Gross Amount</Box>
                            <Box className="p-2 text-right font-medium">{summary.grossAmount.toFixed(2)}</Box>
                        </Box>

                        {/* Discount */}
                        <Box className="grid grid-cols-[140px_1fr] border-b">
                            <Box className="bg-gray-50 dark:bg-gray-800 p-2 flex justify-end font-medium">Discount</Box>
                            <Box className="p-2 text-right">{summary.discountAmount.toFixed(2)}</Box>
                        </Box>

                        {/* Taxable Amount */}
                        <Box className="grid grid-cols-[140px_1fr] border-b">
                            <Box className="bg-gray-50 dark:bg-gray-800 p-2 flex justify-end font-medium">Taxable Amount</Box>
                            <Box className="p-2 text-right">{summary.taxableAmount.toFixed(2)}</Box>
                        </Box>

                        {/* Tax */}
                        <Box className="grid grid-cols-[140px_1fr] border-b">
                            <Box className="bg-gray-50 dark:bg-gray-800 p-2 flex justify-end font-medium text-blue-500">Tax (%)</Box>
                            <Box className="p-1 px-2 flex justify-end gap-2 items-center">
                                <Box width="80px">
                                    <CommonValidationTextField name="tax" label="" type="number" sx={{ "& input": { textAlign: "right" } }} />
                                </Box>
                                <span className="font-medium">{summary.taxAmount.toFixed(2)}</span>
                            </Box>
                        </Box>

                        {/* Roundoff */}
                        <Box className="grid grid-cols-[140px_1fr] border-b">
                            <Box className="bg-gray-50 dark:bg-gray-800 p-2 flex justify-end font-medium text-blue-500">Roundoff</Box>
                            <Box className="p-1 px-2">
                                <CommonValidationTextField name="roundOff" label="" type="number" sx={{ "& input": { textAlign: "right" } }} />
                            </Box>
                        </Box>

                        {/* Net Amount */}
                        <Box className="grid grid-cols-[140px_1fr]">
                            <Box className="bg-gray-50 dark:bg-gray-800 p-3 flex justify-end font-bold text-lg">Net Amount</Box>
                            <Box className="p-3 text-right font-bold text-lg">{summary.netAmount.toFixed(2)}</Box>
                        </Box>
                    </Box>
                </Box>
            </CommonCard>


            <TermsConditionModal openModal={openTermsModal} setOpenModal={setOpenTermsModal} onSave={handleSaveTerm} />
        </>
    );
};

export default PurchaseOrderBilling;
