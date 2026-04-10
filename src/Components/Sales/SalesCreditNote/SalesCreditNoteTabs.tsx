import AddIcon from "@mui/icons-material/Add";
import { Box, Tab, Tabs } from "@mui/material";
import { ClearIcon } from "@mui/x-date-pickers-pro";
import { CommonButton, CommonValidationSelect, CommonValidationTextField } from "../../../Attribute";
import { CommonTable, CommonTabPanel, CommonShippingDetails, CommonTermsAndCondition } from "../../Common";
import { useEffect, useState, useMemo } from "react";
import { Queries } from "../../../Api";
import { GenerateOptions } from "../../../Utils";
import { FieldArray, useFormikContext } from "formik";
import type { SalesCreditNoteItem, SalesCreditNoteFormValues, ProductBase, CommonTableColumn } from "../../../Types";

const SalesCreditNoteTabs = ({ emptyRow }: { emptyRow: SalesCreditNoteItem }) => {
    const [tabValue, setTabValue] = useState(0);
    const { values, setFieldValue } = useFormikContext<SalesCreditNoteFormValues>();

    const isCustomerSelected = !!values?.customerId && !!values?.branchId;
    
    const productParams = useMemo(() => ({ companyFilter: values?.companyId, branchFilter: values?.branchId }), [values?.companyId, values?.branchId]);
    const { data: productsData, isLoading: isProductLoading } = Queries.useGetProductDropdown(productParams, !!values?.companyId && !!values?.branchId);

    const calculateRowValues = (index: number) => {
        const row = values?.productDetails?.[index];
        const product = productsData?.data?.find((p: ProductBase) => p._id === row?.productId);
        if (!product) return { tax: 0, taxableAmount: 0, total: 0 };

        const qty = Number(row?.qty || 0);
        const price = Number(row?.price || 0);
        const discount1 = Number(row?.discount1 || 0);

        const taxRate = Number(product?.salesTaxId?.percentage || 0);
        let taxIncluded = typeof product?.isSalesTaxIncluding === "boolean" ? product.isSalesTaxIncluding : false;

        const amount = qty * price;
        let taxableAmount = amount - discount1;
        let taxAmount = 0;

        if (taxIncluded) {
            taxAmount = taxableAmount * (taxRate / (100 + taxRate));
            taxableAmount = taxableAmount - taxAmount;
        } else {
            taxAmount = taxableAmount * (taxRate / 100);
        }

        const total = taxableAmount + taxAmount;

        return {
            tax: Number(taxAmount.toFixed(2)),
            taxableAmount: Number(taxableAmount.toFixed(2)),
            total: Number(total.toFixed(2)),
        };
    };

    useEffect(() => {
        if (isProductLoading || !productsData) return;

        values?.productDetails?.forEach((item, index) => {
            if (!item?.productId) return;
            const product = productsData?.data?.find((p: ProductBase) => p._id === item.productId);
            if (!product) return;

            const { tax, taxableAmount, total } = calculateRowValues(index);
            const uomName = product?.uomId?.name || "";

            // Set default price if not set
            if (!item.price && product.mrp) {
                setFieldValue(`productDetails.${index}.price`, product.mrp);
            }

            if (item.uomId !== product?.uomId?._id) setFieldValue(`productDetails.${index}.uomId`, product?.uomId?._id || "");
            if (item.unit !== uomName) setFieldValue(`productDetails.${index}.unit`, uomName);
            if (item.taxId !== product?.salesTaxId?._id) setFieldValue(`productDetails.${index}.taxId`, product?.salesTaxId?._id || "");
            
            if (Math.abs((Number(item.tax) || 0) - tax) > 0.01) setFieldValue(`productDetails.${index}.tax`, tax);
            // We use taxableAmount internally for watchers/summaries if needed
            if (Math.abs((Number((item as any).taxableAmount) || 0) - taxableAmount) > 0.01) setFieldValue(`productDetails.${index}.taxableAmount`, taxableAmount);
            if (Math.abs((Number(item.total) || 0) - total) > 0.01) setFieldValue(`productDetails.${index}.total`, total);
        });
    }, [values?.productDetails, productsData, isProductLoading, setFieldValue]);

    return (
        <Box sx={{ width: "100%" }}>
            <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
                <Tabs value={tabValue} onChange={(_, v) => setTabValue(v)}>
                    <Tab label="Item Details" />
                    <Tab label="Terms & Conditions" />
                    <Tab label="Shipping Details" />
                </Tabs>
            </Box>

            <CommonTabPanel value={tabValue} index={0}>
                <Box className="custom-scrollbar" sx={{ overflowX: "auto" }}>
                    <Box sx={{ minWidth: "100%" }}>
                        <FieldArray name="productDetails">
                            {({ push, remove }) => {
                                const columns: CommonTableColumn<any>[] = [
                                    {
                                        key: "actions",
                                        header: "",
                                        bodyClass: "p-2 text-center flex gap-2 justify-center ",
                                        render: (_, index) => (
                                            <>
                                                {index === ((values?.productDetails || []).length || 0) - 1 && (
                                                    <CommonButton size="small" variant="outlined" onClick={() => push(emptyRow)}>
                                                        <AddIcon fontSize="small" />
                                                    </CommonButton>
                                                )}
                                                {((values?.productDetails || []).length || 0) > 1 && (
                                                    <CommonButton size="small" color="error" variant="outlined" onClick={() => remove(index)}>
                                                        <ClearIcon fontSize="small" />
                                                    </CommonButton>
                                                )}
                                            </>
                                        ),
                                        footer: () => <span className="p-2 text-right block">Total</span>,
                                        footerClass: "text-right",
                                    },
                                    { key: "sr", header: "#", bodyClass: "w-[50px] text-center align-middle", render: (_, i) => i + 1 },
                                    {
                                        key: "productId",
                                        header: "Product",
                                        bodyClass: " min-w-[250px]",
                                        render: (_, index) => <CommonValidationSelect name={`productDetails.${index}.productId`} label="Select Product" options={GenerateOptions(productsData?.data)} isLoading={isProductLoading} required disabled={!isCustomerSelected} />,
                                    },
                                    {
                                        key: "qty",
                                        header: "Qty",
                                        bodyClass: "min-w-[120px]",
                                        render: (_, index) => <CommonValidationTextField name={`productDetails.${index}.qty`} type="number" size="small" />,
                                        footer: (data) => data.reduce((a, b) => a + (Number(b.qty) || 0), 0),
                                    },
                                    {
                                        key: "freeQty",
                                        header: "Free Qty",
                                        bodyClass: "min-w-28",
                                        render: (_, index) => <CommonValidationTextField name={`productDetails.${index}.freeQty`} type="number" size="small" />,
                                        footer: (data) => data.reduce((a, b) => a + (Number(b.freeQty) || 0), 0),
                                    },
                                    {
                                        key: "uomId",
                                        header: "UOM",
                                        bodyClass: "min-w-28 align-middle",
                                        render: (_, index) => {
                                            const productId = values?.productDetails?.[index]?.productId;
                                            const product = productsData?.data?.find((p: ProductBase) => p._id === productId);
                                            return <span>{product?.uomId?.name || ""}</span>;
                                        },
                                    },
                                    {
                                        key: "price",
                                        header: "Price",
                                        bodyClass: "min-w-28",
                                        render: (_, index) => <CommonValidationTextField name={`productDetails.${index}.price`} type="number" size="small" />,
                                    },
                                    {
                                        key: "discount1",
                                        header: "Disc",
                                        bodyClass: "min-w-24",
                                        render: (_, index) => <CommonValidationTextField name={`productDetails.${index}.discount1`} type="number" size="small" />,
                                    },
                                    {
                                        key: "taxId",
                                        header: "Tax",
                                        bodyClass: "min-w-28 align-middle",
                                        render: (_, index) => {
                                            const productId = values?.productDetails?.[index]?.productId;
                                            const product = productsData?.data?.find((p: ProductBase) => p._id === productId);
                                            if (!product) return null;

                                            const taxName = product?.salesTaxId?.name || "";
                                            const taxPercentage = product?.salesTaxId?.percentage || 0;
                                            const { tax } = calculateRowValues(index);

                                            return (
                                                <div className="text-md flex flex-col">
                                                    <span className="text-xs text-blue-500">
                                                        {taxName} ({taxPercentage}%)
                                                    </span>
                                                    <span>Rs. {tax.toFixed(2)}</span>
                                                </div>
                                            );
                                        },
                                    },
                                    {
                                        key: "total",
                                        header: "Total",
                                        bodyClass: "min-w-28 align-middle",
                                        render: (_, index) => {
                                            const { total } = calculateRowValues(index);
                                            return <span>{total.toFixed(2)}</span>;
                                        },
                                        footer: (data) => data.reduce((acc, item) => acc + (Number(item.total) || 0), 0).toFixed(2),
                                    },
                                ];

                                return <CommonTable showFooter data={values.productDetails || []} columns={columns} rowKey={(_row, index) => index.toString()} getRowClass={() => "align-top"} />;
                            }}
                        </FieldArray>
                    </Box>
                </Box>
            </CommonTabPanel>

            <CommonTabPanel value={tabValue} index={1}>
                <CommonTermsAndCondition selectedTermIds={values.termsAndConditionIds || []} onChange={(ids: string[]) => setFieldValue("termsAndConditionIds", ids)} companyId={values.companyId} isView={!values.companyId} />
            </CommonTabPanel>

            <CommonTabPanel value={tabValue} index={2}>
                <Box sx={{ p: 2 }}>
                    <CommonShippingDetails />
                </Box>
            </CommonTabPanel>
        </Box>
    );
};

export default SalesCreditNoteTabs;
