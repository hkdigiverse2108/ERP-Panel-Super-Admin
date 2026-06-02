import AddIcon from "@mui/icons-material/Add";
import { Box, Tab, Tabs } from "@mui/material";
import { ClearIcon } from "@mui/x-date-pickers-pro";
import { CommonButton, CommonValidationSelect, CommonValidationTextField } from "../../../Attribute";
import { CommonTable, CommonTabPanel, CommonShippingDetails, CommonTermsAndCondition } from "../../Common";
import { useEffect, useState, useRef } from "react";
import { Queries } from "../../../Api";
import { GenerateOptions } from "../../../Utils";
import { FieldArray, useFormikContext } from "formik";
import type { DeliveryChallanItem, DeliveryChallanFormValues } from "../../../Types";
import type { CommonTableColumn, ProductBase } from "../../../Types";

const DeliveryChallanTabs = ({ emptyRow, isEditing }: { emptyRow: DeliveryChallanItem; isEditing: boolean }) => {
  const [tabValue, setTabValue] = useState(0);
  const { values, setFieldValue } = useFormikContext<DeliveryChallanFormValues>();

  const isCustomerSelected = !!values?.customerId && !!values?.branchId;
  const { data: productsData, isLoading: isProductLoading } = Queries.useGetProductDropdown({ companyFilter: values?.companyId, branchFilter: values?.branchId }, !!values?.companyId && !!values?.branchId);

  const salesOrderId = values?.selectedSalesOrderId?.[values?.selectedSalesOrderId?.length - 1] || "";
  const invoiceId = values?.selectedInvoiceId?.[values?.selectedInvoiceId?.length - 1] || "";

  const { data: singleSalesOrder, isLoading: isSingleSalesOrderLoading, isFetching: isSingleSalesOrderFetching } = Queries.useGetSingleSalesOrder(salesOrderId, Boolean(salesOrderId) && !isEditing);
  const { data: singleInvoice, isLoading: isSingleInvoiceLoading, isFetching: isSingleInvoiceFetching } = Queries.useGetSingleInvoice(invoiceId, Boolean(invoiceId) && !isEditing);

  const mapItems = (items: any[] = []) =>
    items.map((item) => ({
      productId: item?.productId?._id || item?.productId || "",
      qty: item?.qty || 1,
      freeQty: item?.freeQty || 0,
      price: item?.price || 0,
      discount1: item?.discount1 || 0,
      tax: item?.tax || 0,
      taxId: item?.taxId?._id || item?.taxId || "",
      taxableAmount: item?.taxableAmount || 0,
      totalAmount: item?.totalAmount || 0,
      uomId: item?.uomId?._id || item?.uomId || "",
      unit: item?.uomId?.name || item?.unit || "",
    }));

  useEffect(() => {
    if ((!salesOrderId && !invoiceId) || isEditing) return;

    if (salesOrderId && singleSalesOrder?.data) {
      const existingItems = (values?.items || []).filter((item) => item?.productId);
      const finalItems = [...existingItems, ...mapItems(singleSalesOrder?.data?.items)];
      setFieldValue("items", finalItems);
    }

    if (invoiceId && singleInvoice?.data) {
      const existingItems = (values?.items || []).filter((item) => item?.productId);
      const finalItems = [...existingItems, ...mapItems(singleInvoice?.data?.items)];
      setFieldValue("items", finalItems);
    }
  }, [singleSalesOrder, singleInvoice]);

  const calculateRowValues = (index: number) => {
    const row = values?.items?.[index];
    const product = productsData?.data?.find((p: ProductBase) => (row?.variantId ? p.variantId === row?.variantId : p._id === row?.productId));
    if (!product) return { taxableAmount: 0, totalAmount: 0, taxAmount: 0, discountAmount: 0 };

    const qty = Number(row?.qty || 0);
    const price = Number(row?.price || 0);
    const discount = Number(row?.discount1 || 0);

    const isOutOfScope = values?.taxType === "out_of_scope";
    const taxRate = isOutOfScope ? 0 : Number(product?.salesTaxId?.percentage || 0);

    let taxIncluded = false;
    if (values?.taxType === "tax_inclusive") {
      taxIncluded = true;
    } else if (values?.taxType === "tax_exclusive") {
      taxIncluded = false;
    } else {
      taxIncluded = typeof product?.isSalesTaxIncluding === "boolean" ? product.isSalesTaxIncluding : false;
    }

    const amount = qty * price;
    const discountAmount = discount;

    let taxableAmount = amount - discountAmount;
    let taxAmount = 0;

    if (taxIncluded) {
      taxAmount = taxableAmount * (taxRate / (100 + taxRate));
      taxableAmount = taxableAmount - taxAmount;
    } else {
      taxAmount = taxableAmount * (taxRate / 100);
    }

    return {
      taxableAmount: Number(taxableAmount.toFixed(2)),
      taxAmount: Number(taxAmount.toFixed(2)),
      totalAmount: Number((taxableAmount + taxAmount).toFixed(2)),
      discountAmount: Number(discountAmount.toFixed(2)),
    };
  };

  const prevTaxTypeRef = useRef(values?.taxType);

  useEffect(() => {
    const taxTypeChanged = values?.taxType !== prevTaxTypeRef.current;

    values?.items?.forEach((item, index) => {
      if (!item?.productId) return;
      const product = productsData?.data?.find((p: ProductBase) => (item?.variantId ? p.variantId === item?.variantId : p._id === item.productId));
      if (!product) return;

      const { taxableAmount, totalAmount, taxAmount, discountAmount } = calculateRowValues(index);

      if (item.mrp !== product?.mrp) setFieldValue(`items.${index}.mrp`, product?.mrp || 0);

      let currentPrice = Number(item?.price || 0);
      if (!item?.price || taxTypeChanged) {
        let desiredPrice = Number(product?.mrp || 0);
        const taxRate = Number(product?.salesTaxId?.percentage || 0);
        const isProductInclusive = typeof product?.isSalesTaxIncluding === "boolean" ? product.isSalesTaxIncluding : false;

        if (values?.taxType === "tax_exclusive") {
          desiredPrice = isProductInclusive ? desiredPrice / (1 + taxRate / 100) : desiredPrice;
        } else if (values?.taxType === "tax_inclusive") {
          desiredPrice = !isProductInclusive ? desiredPrice * (1 + taxRate / 100) : desiredPrice;
        } else if (values?.taxType === "out_of_scope") {
          desiredPrice = Number(product?.mrp || 0);
        } else {
          desiredPrice = Number(product?.mrp || 0);
        }

        desiredPrice = Number(desiredPrice.toFixed(2));
        if (currentPrice !== desiredPrice) {
          setFieldValue(`items.${index}.price`, desiredPrice);
          currentPrice = desiredPrice;
        }
      }

      if (item.uomId !== product?.uomId?._id) setFieldValue(`items.${index}.uomId`, product?.uomId?._id || "");
      if (item.unit !== product?.uomId?.name) setFieldValue(`items.${index}.unit`, product?.uomId?.name || "");
      if (item.taxId !== (product?.salesTaxId as any)?._id) setFieldValue(`items.${index}.taxId`, (product?.salesTaxId as any)?._id || "");
      if (Math.abs((Number(item.taxAmount) || 0) - taxAmount) > 0.01) setFieldValue(`items.${index}.taxAmount`, taxAmount);
      if (Math.abs((Number(item.taxableAmount) || 0) - taxableAmount) > 0.01) setFieldValue(`items.${index}.taxableAmount`, taxableAmount);
      if (Math.abs((Number(item.totalAmount) || 0) - totalAmount) > 0.01) setFieldValue(`items.${index}.totalAmount`, totalAmount);
      // if (Math.abs((Number(item.discountAmount) || 0) - discountAmount) > 0.01) setFieldValue(`items.${index}.discountAmount`, discountAmount);

      const amount = Number(item?.qty || 0) * currentPrice;
      if (discountAmount > amount) {
        setFieldValue(`items.${index}.discount1`, 0);
      }
    });

    if (taxTypeChanged) {
      prevTaxTypeRef.current = values?.taxType;
    }
  }, [values?.items, productsData, values?.taxType]);

  return (
    <>
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
              <FieldArray name="items">
                {({ push, remove }) => {
                  const columns: CommonTableColumn<any>[] = [
                    {
                      key: "actions",
                      header: "",
                      bodyClass: "p-2 text-center flex gap-2 justify-center ",
                      render: (_, index) => (
                        <>
                          {index === ((values?.items || []).length || 0) - 1 && (
                            <CommonButton size="small" variant="outlined" onClick={() => push(emptyRow)}>
                              <AddIcon fontSize="small" />
                            </CommonButton>
                          )}
                          {((values?.items || []).length || 0) > 1 && (
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
                      render: (_, index) => <CommonValidationSelect name={`items.${index}.productId`} syncName={`items.${index}.variantId`} label="Select Product" options={GenerateOptions(productsData?.data)} isLoading={isProductLoading} required disabled={!isCustomerSelected} />,
                    },
                    {
                      key: "qty",
                      header: "Qty",
                      bodyClass: "min-w-[120px]",
                      render: (_, index) => <CommonValidationTextField name={`items.${index}.qty`} type="number" size="small" />,
                      footer: (data) => data.reduce((a, b) => a + (+b.qty || 0), 0),
                    },
                    {
                      key: "freeQty",
                      header: "Free Qty",
                      bodyClass: "min-w-28",
                      render: (_, index) => <CommonValidationTextField name={`items.${index}.freeQty`} type="number" size="small" />,
                      footer: (data) => data.reduce((a, b) => a + (+b.freeQty || 0), 0),
                    },
                    {
                      key: "uomId",
                      header: "UOM",
                      bodyClass: "min-w-28 align-middle",
                      render: (_, index) => {
                        const productId = values?.items?.[index]?.productId;
                        const variantId = values?.items?.[index]?.variantId;
                        const product = productsData?.data?.find((p: ProductBase) => (variantId ? p.variantId === variantId : p._id === productId));
                        return <span>{product?.uomId?.name || ""}</span>;
                      },
                    },
                    {
                      key: "price",
                      header: "Price",
                      bodyClass: "min-w-28",
                      render: (_, index) => <CommonValidationTextField name={`items.${index}.price`} type="number" size="small" />,
                    },
                    {
                      key: "discount1",
                      header: "Discount",
                      bodyClass: "min-w-28",
                      render: (_, index) => <CommonValidationTextField name={`items.${index}.discount1`} type="number" size="small" />,
                    },
                    {
                      key: "taxAmount",
                      header: "Tax",
                      bodyClass: "min-w-28 align-middle",
                      render: (_, index) => {
                        const productId = values?.items?.[index]?.productId;
                        const variantId = values?.items?.[index]?.variantId;
                        const product = productsData?.data?.find((p: ProductBase) => (variantId ? p.variantId === variantId : p._id === productId));
                        if (!product) return null;

                        const isOutOfScope = values?.taxType === "out_of_scope";
                        const taxName = isOutOfScope ? "No Tax" : (product?.salesTaxId as any)?.name || "";
                        const taxPercentage = isOutOfScope ? 0 : (product?.salesTaxId as any)?.percentage || 0;
                        const { taxAmount } = calculateRowValues(index);

                        return (
                          <div className="text-md flex flex-col">
                            <span className="text-xs text-blue-500">
                              {taxName} ({taxPercentage}%)
                            </span>
                            <span>Rs. {taxAmount.toFixed(2)}</span>
                          </div>
                        );
                      },
                    },
                    {
                      key: "totalAmount",
                      header: "Total",
                      bodyClass: "min-w-28 align-middle",
                      render: (_, index) => {
                        const { totalAmount } = calculateRowValues(index);
                        return <span>{totalAmount.toFixed(2)}</span>;
                      },
                      footer: (data) => data.reduce((acc, item) => acc + (+item.totalAmount || 0), 0).toFixed(2),
                    },
                  ];

                  return <CommonTable isLoading={isSingleSalesOrderLoading || isSingleSalesOrderFetching || isSingleInvoiceLoading || isSingleInvoiceFetching} showFooter data={values.items || []} columns={columns} rowKey={(_row, index) => index.toString()} getRowClass={() => "align-top"} />;
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
    </>
  );
};

export default DeliveryChallanTabs;
