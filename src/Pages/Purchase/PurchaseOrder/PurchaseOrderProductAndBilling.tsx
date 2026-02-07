import { Add, Clear, Delete } from "@mui/icons-material";
import { Box, Tab, Tabs } from "@mui/material";
import { FieldArray, useFormikContext } from "formik";
import { useEffect, useRef, useState } from "react";
import { Mutations, Queries } from "../../../Api";
import { CommonButton, CommonValidationTextField, CommonValidationSelect } from "../../../Attribute";
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

    return <CommonValidationSelect name={`items.${index}.productId`} label="Search Product" isLoading={isLoading} options={GenerateOptions(productData?.data?.product_data || productData?.data)} required />;
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
    const { mutate: deleteTerm } = Mutations.useDeleteTermsCondition();

    const handleDeleteTerm = (id: string) => {
        deleteTerm(id, {
            onSuccess: () => {
                refetchTerms();
            },
        });
    };

    const handleSaveTerm = (term: any) => {
        addTerm({ termsCondition: term.termsCondition } as any, {
            onSuccess: () => {
                refetchTerms();
            },
        });
    };

    useEffect(() => {
        let hasChanges = false;
        const newItems = values.items?.map((item: any) => {
            // 1. Calculate Landing Cost
            const unitCost = Number(item.unitCost) || 0;
            const taxPercent = Number(item.tax) || 0;
            const isTaxInclusive = values.taxType === "tax_inclusive";

            let landingCost = 0;
            if (isTaxInclusive) {
                landingCost = unitCost;
            } else {
                landingCost = unitCost + (unitCost * taxPercent) / 100;
            }

            // 2. Calculate Selling Price & Margin
            const mrp = Number(item.mrp) || 0;
            const discount = Number(item.discount1) || 0;
            const sellingPrice = mrp - discount;
            const margin = sellingPrice - landingCost;

            // 3. Calculate Line Total
            const quantity = Number(item.qty) || 0;
            const total = quantity * landingCost;

            // Check if updates are needed to avoid infinite loop
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

            if (itemChanged) hasChanges = true;
            return newItem;
        });

        if (hasChanges) {
            setFieldValue("items", newItems);
        }

        // --- Billing Summary Logic ---
        const itemsTotal = newItems?.reduce((sum: number, item: any) => sum + (Number(item.total) || 0), 0) || 0;
        const totalUnitCost = newItems?.reduce((sum: number, item: any) => sum + (Number(item.qty) * Number(item.unitCost) || 0), 0) || 0;

        // Gross Amount = Sum(Qty * Unit Cost)
        const grossAmount = totalUnitCost;
        const discount = Number(values.flatDiscount) || 0;

        // Taxable is Gross
        const taxableAmount = grossAmount;

        if (values.grossAmount !== grossAmount) setFieldValue("grossAmount", grossAmount);
        if (values.taxableAmount !== taxableAmount) setFieldValue("taxableAmount", taxableAmount);

        // Recalculate Global Tax and Net
        const globalTaxPercent = Number(values.tax) || 0;
        const globalTaxAmount = taxableAmount * (globalTaxPercent / 100);
        const roundOff = Number(values.roundOff) || 0;
        const net = taxableAmount + globalTaxAmount - discount + roundOff;

        if (values.netAmount !== net) setFieldValue("netAmount", net);

    }, [values.items, values.taxType, values.flatDiscount, values.tax, values.roundOff, setFieldValue]);

    const summary = {
        grossAmount: Number(values.grossAmount) || 0,
        discountAmount: Number(values.discountAmount) || 0,
        taxableAmount: Number(values.taxableAmount) || 0,
        taxAmount: (Number(values.taxableAmount) || 0) * ((Number(values.tax) || 0) / 100),
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
                            <Box sx={{ minWidth: 800 }}>
                                <FieldArray name="items">
                                    {({ push, remove }) => {
                                        const columns = [
                                            {
                                                key: "action",
                                                header: "",
                                                headerClass: "text-center",
                                                bodyClass: "text-center",
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
                                                bodyClass: "align-middle text-center",
                                                render: (_row: any, index: number) => index + 1,
                                            },
                                            {
                                                key: "productId",
                                                header: "Product*",
                                                bodyClass: "min-w-[240px]",
                                                render: (_row: any, index: number) => <ProductSelectCell index={index} productData={productData} taxData={taxData} isLoading={productDataLoading} />,
                                            },
                                            {
                                                key: "unitCost",
                                                header: "Unit Cost",
                                                render: (_row: any, index: number) => <CommonValidationTextField name={`items.${index}.unitCost`} type="number" />,
                                            },
                                            {
                                                key: "qty",
                                                header: "Qty",
                                                render: (_row: any, index: number) => <CommonValidationTextField name={`items.${index}.qty`} type="number" />,
                                            },
                                            {
                                                key: "tax",
                                                header: "Tax",
                                                render: (_row: any, index: number) => <CommonValidationTextField name={`items.${index}.tax`} type="number" />,
                                                // Don't sum Tax % in footer
                                            },
                                            {
                                                key: "landingCost",
                                                header: "Landing Cost",
                                                render: (_row: any, index: number) => <CommonValidationTextField name={`items.${index}.landingCost`} type="number" disabled />,
                                            },
                                            {
                                                key: "mrp",
                                                header: "MRP",
                                                render: (_row: any, index: number) => <CommonValidationTextField name={`items.${index}.mrp`} type="number" />,
                                            },
                                            {
                                                key: "discount",
                                                header: "Discount",
                                                render: (_row: any, index: number) => <CommonValidationTextField name={`items.${index}.discount1`} type="number" />,
                                            },
                                            {
                                                key: "sellingPrice",
                                                header: "Selling Price",
                                                render: (_row: any, index: number) => <CommonValidationTextField name={`items.${index}.sellingPrice`} type="number" disabled />,
                                            },
                                            {
                                                key: "margin",
                                                header: "Margin",
                                                render: (_row: any, index: number) => <CommonValidationTextField name={`items.${index}.margin`} type="number" disabled />,
                                            },
                                            {
                                                key: "total",
                                                header: "Total",
                                                render: (_row: any, index: number) => <CommonValidationTextField name={`items.${index}.total`} type="number" disabled />,
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
                                    <CommonButton startIcon={<Add />} onClick={() => setOpenTermsModal(true)} variant="outlined" title="new term"></CommonButton>
                                </Box>

                                <Box sx={{ overflowX: "auto" }}>
                                    <Box sx={{ minWidth: 800 }}>
                                        <table className="w-full text-sm border border-gray-200 dark:border-gray-700">
                                            <thead className="bg-gray-100 dark:bg-gray-900 text-gray-700 dark:text-gray-200">
                                                <tr>
                                                    <th className="p-2 w-10">#</th>
                                                    <th className="p-2 text-left">Condition</th>
                                                    <th className="p-2 w-10 text-center">Action</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {termsData?.data?.map((term, index) => (
                                                    <tr key={term._id} className="text-gray-600 dark:text-gray-300 bg-white dark:bg-gray-800 even:bg-gray-50 dark:even:bg-gray-dark border-b border-gray-100 dark:border-gray-700">
                                                        <td className="p-2">{index + 1}</td>
                                                        <td className="p-2">{term.termsCondition}</td>
                                                        <td className="p-2 text-center">
                                                            <CommonButton size="small" color="error" variant="text" onClick={() => handleDeleteTerm(term._id)}>
                                                                <Delete fontSize="small" />
                                                            </CommonButton>
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </Box>
                                </Box>
                            </Box> {/* Closing Terms Box */}

                            {/* Note Section */}
                            <Box>
                                <Box fontWeight={600} mb={1}>
                                    Note
                                </Box>
                                <CommonValidationTextField name="notes" multiline rows={4} placeholder="Enter a note (max 200 characters)" />
                            </Box>
                        </Box> {/* Closing Grid Box */}
                    </CommonTabPanel>
                </Box>
            </CommonCard>

            {/* BILLING SUMMARY - Separated outside TabPanel */}
            <CommonCard hideDivider grid={{ xs: 12 }}>
                <Box sx={{ p: 2, display: "flex", gap: 2, flexDirection: { xs: "column", md: "row" }, justifyContent: "space-between", alignItems: "flex-start" }}>
                    <Box sx={{ width: { xs: "100%", md: "60%" } }}>{showTaxDetails && <TaxDetailsTable items={values.items || []} />}</Box>

                    <Box className="border text-sm w-full md:w-1/3">
                        {/* Row 1: Flat Discount */}
                        <Box className="grid grid-cols-[150px_1fr] border-b border-gray-200 dark:border-gray-700">
                            <Box className="bg-gray-50 dark:bg-gray-800 p-2 flex items-center justify-end font-medium">Flat Discount</Box>
                            <Box className="p-1 px-2">
                                <CommonValidationTextField name="flatDiscount" label="" type="number" size="small" sx={{ "& input": { textAlign: "left" } }} isCurrency currencyDisabled />
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
                                <span className="text-gray-900 dark:text-gray-100 font-bold ml-1">{values.tax || 0}</span>
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
            <TermsConditionModal openModal={openTermsModal} setOpenModal={setOpenTermsModal} onSave={handleSaveTerm} />
        </>
    );
};

export default PurchaseOrderProductAndBilling;
