import { Add, Clear, Delete, Edit } from "@mui/icons-material";
import { Box, Tab, Tabs } from "@mui/material";
import { FieldArray, useFormikContext } from "formik";
import { useEffect, useRef, useState } from "react";
import { Mutations, Queries } from "../../../Api";
import { CommonButton, CommonTextField, CommonValidationSelect, CommonValidationTextField } from "../../../Attribute";
import { CommonCard, CommonTabPanel } from "../../../Components/Common";
import CommonTable from "../../../Components/Common/CommonTable";
import { GenerateOptions } from "../../../Utils";
import type { PurchaseOrderFormValues } from "../../../Types";
import TaxDetailsTable from "./TaxDetailsTable";
import TermsConditionModal from "./TermsConditionModal";

const ProductSelectCell = ({ index, productData, taxData, isLoading }: any) => {
    const { values, setFieldValue } = useFormikContext<PurchaseOrderFormValues>();
    const productId = values.items?.[index]?.productId;
    const prevProductId = useRef(productId);

    useEffect(() => {
        if (productId && productId !== prevProductId.current) {
            // Product Changed
            const productList = productData?.data?.product_data || productData?.data || [];
            const product = productList?.find((p: any) => p._id === productId);
            if (product) {
                const taxId = typeof product.purchaseTaxId === "object" ? (product.purchaseTaxId as any)?._id : product.purchaseTaxId;
                const tax = taxData?.data?.find((t: any) => t._id === taxId);

                if (tax && tax.percentage !== undefined) {
                    setFieldValue(`items.${index}.tax`, tax.percentage);
                    setFieldValue(`items.${index}.taxName`, tax.name || tax.taxName || "");
                }
                setFieldValue(`items.${index}.qty`, 1);
                // Set Unit Cost from product (assuming costPrice or landingCost as base)
                // If product has landingCost saved, we might treat it as UnitCost for now?
                // Or default to 0.
                setFieldValue(`items.${index}.unitCost`, product.landingCost || 0);
                setFieldValue(`items.${index}.mrp`, product.mrp || 0);
            }
            prevProductId.current = productId;
        }
    }, [productId, productData, taxData, setFieldValue, index]);

    return <CommonValidationSelect name={`items.${index}.productId`} label="Search Product" isLoading={isLoading} options={GenerateOptions(productData?.data?.product_data || productData?.data)} required size="small" />;
};

const TotalInputCell = ({ index }: any) => {
    const { values, setFieldValue } = useFormikContext<PurchaseOrderFormValues>();
    const item = values.items?.[index];

    if (!item) return null;

    const handleTotalChange = (value: any) => {
        const newTotal = Number(value) || 0;
        setFieldValue(`items.${index}.total`, newTotal);

        const qty = Number(item.qty) || 0;
        const taxPercent = Number(item.tax) || 0;
        const isTaxInclusive = values.taxType === "tax_inclusive";

        if (qty > 0) {
            const landingCost = newTotal / qty;
            let unitCost = 0;

            if (isTaxInclusive) {
                // Tax Inclusive: Unit Cost is same as Landing Cost (Total / Qty)
                unitCost = landingCost;
            } else {
                // Tax Exclusive: Landing Cost = Unit Cost * (1 + Tax / 100)
                // Therefore: Unit Cost = Landing Cost / (1 + Tax / 100)
                unitCost = landingCost / (1 + taxPercent / 100);
            }
            setFieldValue(`items.${index}.unitCost`, unitCost);
        }
    };

    return <CommonTextField type="number" onChange={handleTotalChange} value={item.total || 0} />;
};

const PurchaseOrderProductAndBilling = () => {
    const { values, setFieldValue } = useFormikContext<PurchaseOrderFormValues>();
    const [tabValue, setTabValue] = useState(0);
    const [openTermsModal, setOpenTermsModal] = useState(false);
    const [showTaxDetails, setShowTaxDetails] = useState(false);
    // const { data: productData, isLoading: productDataLoading } = Queries.useGetProduct({ companyFilter: values.companyId || undefined });
    const { data: productData, isLoading: productDataLoading } = Queries.useGetProductDropdown({ companyFilter: values.companyId || undefined });

    const { data: termsData, refetch: refetchTerms } = Queries.useGetTermsConditionDropdown();
    const { data: taxData } = Queries.useGetTaxDropdown();
    const { mutate: addTerm } = Mutations.useAddTermsCondition();
    const { mutate: editTerm } = Mutations.useEditTermsCondition();
    const { mutate: deleteTerm } = Mutations.useDeleteTermsCondition();
    const [selectedTerm, setSelectedTerm] = useState<any>(null);

    const handleDeleteTerm = (id: string) => {
        deleteTerm(id, {
            onSuccess: () => {
                refetchTerms();
            },
        });
    };

    const handleEditTerm = (term: any) => {
        setSelectedTerm(term);
        setOpenTermsModal(true);
    };

    const handleOpenAddTerm = () => {
        setSelectedTerm(null);
        setOpenTermsModal(true);
    };

    const handleSaveTerm = (term: any) => {
        if (selectedTerm) {
            editTerm({ termsConditionId: term._id, termsCondition: term.termsCondition, isDefault: term.isDefault } as any, {
                onSuccess: () => {
                    refetchTerms();
                    setOpenTermsModal(false);
                    setSelectedTerm(null);
                }
            })
        } else {
            addTerm({ termsCondition: term.termsCondition, isDefault: term.isDefault } as any, {
                onSuccess: () => {
                    refetchTerms();
                    setOpenTermsModal(false);
                },
            });
        }
    };

    useEffect(() => {
        let hasChanges = false;
        const newItems = values.items?.map((item: any) => {
            // 1. Calculate Landing Cost
            const unitCost = Number(item.unitCost) || 0;
            const isOutOfScope = values.taxType === "out_of_scope";
            const taxPercent = isOutOfScope ? 0 : (Number(item.tax) || 0);
            const isTaxInclusive = values.taxType === "tax_inclusive";

            let landingCost = 0;
            let taxAmount = 0;

            if (isTaxInclusive && !isOutOfScope) {
                landingCost = unitCost;
                const qty = Number(item.qty) || 0;
                const totalCtx = qty * unitCost;
                taxAmount = totalCtx - (totalCtx / (1 + taxPercent / 100))
            } else {
                landingCost = unitCost + (unitCost * taxPercent) / 100;
                // Exclusive
                const qty = Number(item.qty) || 0;
                taxAmount = (qty * unitCost) * (taxPercent / 100);
            }
            const mrp = Number(item.mrp) || 0;
            const discount = Number(item.discount1) || 0;
            const sellingPrice = mrp - discount;
            const margin = sellingPrice > 0 ? sellingPrice - unitCost : 0;

            // 3. Calculate Line Total
            const quantity = Number(item.qty) || 0;
            const total = quantity * landingCost;

            const newItem = { ...item };
            let itemChanged = false;

            if (Number(newItem.landingCost) !== Number(landingCost.toFixed(2))) {
                newItem.landingCost = landingCost.toFixed(2);
                itemChanged = true;
            }
            if (Number(newItem.sellingPrice) !== Number(sellingPrice.toFixed(2))) {
                newItem.sellingPrice = sellingPrice.toFixed(2);
                itemChanged = true;
            }
            if (Number(newItem.margin) !== Number(margin.toFixed(2))) {
                newItem.margin = margin.toFixed(2);
                itemChanged = true;
            }
            if (Number(newItem.total) !== Number(total.toFixed(2))) {
                newItem.total = total.toFixed(2);
                itemChanged = true;
            }
            if (Number(newItem.taxAmount) !== Number(taxAmount.toFixed(2))) {
                newItem.taxAmount = taxAmount.toFixed(2);
                itemChanged = true;
            }

            if (itemChanged) hasChanges = true;
            return newItem;
        });

        if (hasChanges) {
            setFieldValue("items", newItems);
        }

        // --- Billing Summary Logic ---
        const itemsTotal = newItems?.reduce((sum: number, item: any) => sum + (Number(item.total) || 0), 0) || 0;
        const totalUnitCost = newItems?.reduce((sum: number, item: any) => sum + (Number(item.qty) * Number(item.unitCost) || 0), 0) || 0;

        // Calculate Tax Manually from Items
        const totalCalculatedTax = newItems?.reduce((acc: number, item: any) => {
            const qty = Number(item.qty) || 0;
            const unitCost = Number(item.unitCost) || 0;
            const isOutOfScope = values.taxType === "out_of_scope";
            const rate = isOutOfScope ? 0 : (Number(item.tax) || 0);

            if (values.taxType === "tax_inclusive" && !isOutOfScope) {
                const totalCtx = qty * unitCost;
                return acc + (totalCtx - (totalCtx / (1 + rate / 100)));
            } else {
                return acc + ((qty * unitCost) * (rate / 100));
            }
        }, 0) || 0;

        // Gross Amount = Sum(Qty * Unit Cost)
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
            // Gross includes Tax. ItemTotal includes Tax.
            // If Out of Scope, tax is 0. But in Inclusive mode, Gross implies Tax is inside.
            // If we calculate tax=0, then Net = Gross.
            // Wait, if out_of_scope, is it still "tax_inclusive"?
            // usually out_of_scope acts like exclusive with 0 tax.
            // But if user switched from inclusive -> out_of_scope?
            // The item total (qty*unitCost) is just cost.

            // If values.taxType is "out_of_scope", then it's NOT "tax_inclusive".
            // So we fall to else block usually?
            // "if (values.taxType === 'tax_inclusive')" will be false.

            net = grossAmount - discountInput + roundOff;
        } else {
            // Exclusive, Out of Scope (behaves like exclusive 0 tax)
            net = grossAmount + totalCalculatedTax - discountInput + roundOff;
        }

        if (values.netAmount !== net) setFieldValue("netAmount", net);
    }, [values.items, values.taxType, values.flatDiscount, values.tax, values.roundOff, setFieldValue]);

    // Render Scope Calculation for Display
    const calculatedTaxAmount = (values.items || []).reduce((acc: number, item: any) => {
        const qty = Number(item.qty) || 0;
        const unitCost = Number(item.unitCost) || 0;
        const isOutOfScope = values.taxType === "out_of_scope";
        const rate = isOutOfScope ? 0 : (Number(item.tax) || 0);

        if (values.taxType === "tax_inclusive" && !isOutOfScope) {
            const totalCtx = qty * unitCost;
            return acc + (totalCtx - (totalCtx / (1 + rate / 100)));
        } else {
            return acc + ((qty * unitCost) * (rate / 100));
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
        <>
            <CommonCard hideDivider grid={{ xs: 12 }}>
                <Box sx={{ width: "100%" }}>
                    <Box sx={{ borderBottom: 1, borderColor: "divider", px: 2 }}>
                        <Tabs value={tabValue} onChange={(_, newValue) => setTabValue(newValue)}>
                            <Tab label="Product Details" />
                            <Tab label="Terms & Conditions" />
                        </Tabs>
                    </Box>

                    {/* TAB 0: PRODUCT DETAILS */}
                    <CommonTabPanel value={tabValue} index={0}>
                        <Box sx={{ overflowX: "auto" }}>
                            <Box sx={{ minWidth: 1400 }}>
                                <FieldArray name="items">
                                    {({ push, remove }) => {
                                        const columns = [
                                            {
                                                key: "action",
                                                header: "",
                                                headerClass: "text-center",
                                                bodyClass: "text-center w-[100px]",
                                                render: (_row: any, index: number) => (
                                                    <Box display="flex" justifyContent="center" gap={1}>
                                                        {index === (values.items?.length || 0) - 1 && (
                                                            <CommonButton
                                                                size="small"
                                                                variant="outlined"
                                                                onClick={() =>
                                                                    push({
                                                                        productId: "",
                                                                        qty: 1,
                                                                        freeQty: 0,
                                                                        mrp: 0,
                                                                        sellingPrice: 0,
                                                                        discount1: 0,
                                                                        discount2: 0,
                                                                        taxableAmount: 0,
                                                                        unitCost: 0,
                                                                        tax: "0",
                                                                        landingCost: "0",
                                                                        margin: "0",
                                                                        total: 0,
                                                                    })
                                                                }
                                                            >
                                                                <Add fontSize="small" />
                                                            </CommonButton>
                                                        )}

                                                        {(values.items?.length || 0) > 1 && (
                                                            <CommonButton size="small" color="error" variant="outlined" onClick={() => remove(index)}>
                                                                <Clear fontSize="small" />
                                                            </CommonButton>
                                                        )}
                                                    </Box>
                                                ),
                                                footer: "Total",
                                            },
                                            {
                                                key: "sr",
                                                header: "#",
                                                bodyClass: "align-middle text-center w-[50px]",
                                                render: (_row: any, index: number) => index + 1,
                                            },
                                            {
                                                key: "productId",
                                                header: "Product*",
                                                bodyClass: "min-w-[250px]",
                                                render: (_row: any, index: number) => <ProductSelectCell index={index} productData={productData} taxData={taxData} isLoading={productDataLoading} />,
                                            },
                                            {
                                                key: "mrp",
                                                header: "MRP",
                                                bodyClass: "min-w-[120px]",
                                                render: (_row: any, index: number) => <CommonValidationTextField name={`items.${index}.mrp`} type="number" size="small" />,
                                            },
                                            {
                                                key: "qty",
                                                header: "Qty",
                                                bodyClass: "min-w-[100px]",
                                                render: (_row: any, index: number) => <CommonValidationTextField name={`items.${index}.qty`} type="number" size="small" />,
                                            },
                                            {
                                                key: "unitCost",
                                                header: "Unit Cost",
                                                bodyClass: "min-w-[120px]",
                                                render: (_row: any, index: number) => <CommonValidationTextField name={`items.${index}.unitCost`} type="number" size="small" />,
                                            },
                                            {
                                                key: "tax",
                                                header: "Tax",
                                                bodyClass: "min-w-[140px] text-center",
                                                render: (row: any) => (
                                                    <Box className="flex flex-col items-center">
                                                        <span className="text-sm font-medium">{row.tax}% (₹{row.taxAmount})</span>
                                                        <span className="text-xs text-gray-500">{row.taxName}</span>
                                                    </Box>
                                                ),
                                            },
                                            {
                                                key: "landingCost",
                                                header: "Landing Cost",
                                                bodyClass: "min-w-[120px]",
                                                render: (_row: any, index: number) => <CommonValidationTextField name={`items.${index}.landingCost`} type="number" disabled size="small" />,
                                            },
                                            {
                                                key: "margin",
                                                header: "Margin",
                                                bodyClass: "min-w-[120px]",
                                                render: (_row: any, index: number) => <CommonValidationTextField name={`items.${index}.margin`} type="number" disabled size="small" />,
                                            },
                                            {
                                                key: "total",
                                                header: "Total",
                                                bodyClass: "min-w-[140px]",
                                                render: (_row: any, index: number) => <TotalInputCell index={index} />,
                                                footer: (data: any[]) => data.reduce((sum, item) => sum + (Number(item.total) || 0), 0).toFixed(2),
                                            },
                                        ];

                                        return <CommonTable showFooter data={values.items || []} columns={columns} rowKey={(_row: any, index: number) => index.toString()} getRowClass={() => "align-top"} />;
                                    }}
                                </FieldArray>
                            </Box>
                        </Box>
                    </CommonTabPanel>

                    {/* TAB 1: TERMS & CONDITIONS */}
                    <CommonTabPanel value={tabValue} index={1}>
                        <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr" }, gap: 3, p: 3 }}>
                            {/* Terms Section */}
                            <Box>
                                <Box display="flex" justifyContent="space-between" mb={2}>
                                    <Box fontWeight={600}>Terms & Conditions</Box>
                                    <CommonButton startIcon={<Add />} onClick={handleOpenAddTerm} variant="outlined" title="new term"></CommonButton>
                                </Box>

                                <Box sx={{ overflowX: "auto" }}>
                                    <Box sx={{ minWidth: 800 }}>
                                        <table className="w-full text-sm border border-gray-200 dark:border-gray-700">
                                            <thead className="bg-gray-100 dark:bg-gray-900 text-gray-700 dark:text-gray-200">
                                                <tr>
                                                    <th className="p-2 w-10">#</th>
                                                    <th className="p-2 text-left">Condition</th>
                                                    <th className="p-2 w-20 text-center">Action</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {termsData?.data?.map((term, index) => (
                                                    <tr key={term._id} className="text-gray-600 dark:text-gray-300 bg-white dark:bg-gray-800 even:bg-gray-50 dark:even:bg-gray-dark border-b border-gray-100 dark:border-gray-700">
                                                        <td className="p-2">{index + 1}</td>
                                                        <td className="p-2">{term.termsCondition}</td>
                                                        <td className="p-2 text-center">
                                                            <Box display="flex" justifyContent="center" gap={1}>
                                                                <CommonButton size="small" color="primary" variant="text" onClick={() => handleEditTerm(term)}>
                                                                    <Edit fontSize="small" />
                                                                </CommonButton>
                                                                <CommonButton size="small" color="error" variant="text" onClick={() => handleDeleteTerm(term._id)}>
                                                                    <Delete fontSize="small" />
                                                                </CommonButton>
                                                            </Box>
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </Box>
                                </Box>
                            </Box>{" "}
                            {/* Closing Terms Box */}
                            {/* Note Section */}
                            <Box>
                                <Box fontWeight={600} mb={1}>
                                    Note
                                </Box>
                                <CommonValidationTextField name="notes" multiline rows={4} placeholder="Enter a note (max 200 characters)" />
                            </Box>
                        </Box>{" "}
                        {/* Closing Grid Box */}
                    </CommonTabPanel>
                </Box>
            </CommonCard>

            {/* BILLING SUMMARY - Separated outside TabPanel */}
            <CommonCard hideDivider grid={{ xs: 12 }}>
                <Box sx={{ p: 2, display: "flex", gap: 2, flexDirection: { xs: "column", md: "row" }, justifyContent: "space-between", alignItems: "flex-start" }}>
                    <Box sx={{ width: { xs: "100%", md: "60%" } }}>{showTaxDetails && <TaxDetailsTable items={values.items || []} productData={(productData?.data as any)?.product_data || productData?.data || []} taxType={values.taxType} />}</Box>

                    <Box className="border text-sm w-full md:w-1/3">
                        {/* Row 1: Flat Discount */}
                        <Box className="grid grid-cols-[150px_1fr] border-b border-gray-200 dark:border-gray-700">
                            <Box className="bg-gray-50 dark:bg-gray-800 p-2 flex items-center justify-end font-medium">Flat Discount</Box>
                            <Box className="p-1 px-2">
                                <CommonValidationTextField name="flatDiscount" label="" type="number" size="small" sx={{ "& input": { textAlign: "right" } }} isCurrency currencyDisabled />
                            </Box>
                        </Box>

                        {/* Gross Amount */}
                        <Box className="grid grid-cols-[150px_1fr] border-b">
                            <Box className="bg-gray-50 dark:bg-gray-800 p-2 flex justify-end font-medium">Gross Amount</Box>
                            <Box className="p-2 text-right font-medium">{summary.grossAmount.toFixed(2)}</Box>
                        </Box>

                        {/* Discount */}
                        <Box className="grid grid-cols-[150px_1fr] border-b">
                            <Box className="bg-gray-50 dark:bg-gray-800 p-2 flex justify-end font-medium">Discount</Box>
                            <Box className="p-2 text-right">{summary.discountAmount.toFixed(2)}</Box>
                        </Box>

                        {/* Taxable Amount */}
                        <Box className="grid grid-cols-[150px_1fr] border-b">
                            <Box className="bg-gray-50 dark:bg-gray-800 p-2 flex justify-end font-medium">Taxable Amount</Box>
                            <Box className="p-2 text-right">{summary.taxableAmount.toFixed(2)}</Box>
                        </Box>

                        {/* Tax */}
                        <Box className="grid grid-cols-[150px_1fr] border-b cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800" onClick={() => setShowTaxDetails(!showTaxDetails)}>
                            <Box className="bg-gray-50 dark:bg-gray-800 p-2 flex justify-end font-medium text-blue-500 gap-1 items-center">
                                Tax (%)
                                <span className="text-gray-900 dark:text-gray-100 font-bold ml-1">{values.tax || ""}</span>
                            </Box>
                            <Box className="p-2 flex justify-end items-center">
                                <span className="font-medium align-middle">{summary.taxAmount.toFixed(2)}</span>
                            </Box>
                        </Box>
                        {/* Roundoff */}
                        <Box className="grid grid-cols-[150px_1fr] border-b">
                            <Box className="bg-gray-50 dark:bg-gray-800 p-2 flex justify-end font-medium text-blue-500">Roundoff</Box>
                            <Box className="p-1 px-2">
                                <CommonValidationTextField name="roundOff" label="" type="number" size="small" sx={{ "& input": { textAlign: "right" } }} />
                            </Box>
                        </Box>

                        {/* Net Amount */}
                        <Box className="grid grid-cols-[150px_1fr]">
                            <Box className="bg-gray-50 dark:bg-gray-800 p-3 flex justify-end font-bold text-lg">Net Amount</Box>
                            <Box className="p-3 text-right font-bold text-lg">{summary.netAmount.toFixed(2)}</Box>
                        </Box>
                    </Box>
                </Box>
            </CommonCard>
            <TermsConditionModal openModal={openTermsModal} setOpenModal={setOpenTermsModal} onSave={handleSaveTerm} initialValues={selectedTerm} />
        </>
    );
};
export default PurchaseOrderProductAndBilling;
