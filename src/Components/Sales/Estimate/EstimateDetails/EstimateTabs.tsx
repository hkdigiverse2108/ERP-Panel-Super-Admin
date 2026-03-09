import AddIcon from "@mui/icons-material/Add";
import { Box, Tab, Tabs } from "@mui/material";
import { ClearIcon } from "@mui/x-date-pickers-pro";
import { CommonButton, CommonValidationSelect, CommonValidationTextField } from "../../../../Attribute";
import { CommonTable, CommonTabPanel, CommonShippingDetails } from "../../../Common";
import type { CommonTableColumn, ProductBase } from "../../../../Types";
import type { EstimateFormValues } from "../../../../Types/Estimate";
import { useEffect, useState } from "react";
import { Queries } from "../../../../Api";
import { GenerateOptions } from "../../../../Utils";
import { FieldArray, useFormikContext } from "formik";
import type { EstimateItem } from "../../../../Types/Estimate";

const EstimateTabs = ({ emptyRow }: { emptyRow: EstimateItem }) => {
  const [tabValue, setTabValue] = useState(0);
  const { values, setFieldValue } = useFormikContext<EstimateFormValues>();

  const isCustomerSelected = !!values?.customerId;
  const { data: productsData, isLoading: isProductLoading } = Queries.useGetProductDropdown({ companyFilter: values?.companyId }, !!values?.companyId);

  const calculateTotalAmount = (index: number) => {
    const row = values?.items?.[index];

    const product = productsData?.data?.find((p: ProductBase) => p._id === row?.productId);

    if (!product) return 0;

    const qty = Number(row?.qty || 0);
    const price = Number(row?.price || 0);
    const discount = Number(row?.discount1 || 0);

    const taxRate = Number(product?.salesTaxId?.percentage || 0);
    const taxIncluded = product?.isSalesTaxIncluding;

    const amount = qty * price;

    let taxableAmount = amount - discount;
    let taxAmount = 0;

    if (taxIncluded) {
      taxAmount = taxableAmount * (taxRate / (100 + taxRate));
      taxableAmount = taxableAmount - taxAmount;
    } else {
      taxAmount = taxableAmount * (taxRate / 100);
    }

    const totalAmount = taxableAmount + taxAmount;

    return totalAmount;
  };

  useEffect(() => {
    values?.items?.forEach((item, index) => {
      if (!item?.productId) return;

      const product = productsData?.data?.find((p: ProductBase) => p._id === item.productId);

      if (!product) return;

      setFieldValue(`items.${index}.uomId`, product?.uomId?._id || "");
      setFieldValue(`items.${index}.taxId`, product?.salesTaxId?._id || "");
      setFieldValue(`items.${index}.totalAmount`, calculateTotalAmount(index));
      if (!item?.price) {
        setFieldValue(`items.${index}.price`, product?.mrp || 0);
      }

      if (item?.discount1) {
        const discount = item?.discount1;
        const qty = Number(item?.qty || 0);
        const price = Number(item?.price || 0);
        const amount = qty * price;

        if (discount > amount) setFieldValue(`items.${index}.discount1`, 0);
      }
    });
  }, [values?.items, productsData]);

  return (
    <>
      <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
        <Tabs value={tabValue} onChange={(_, v) => setTabValue(v)}>
          <Tab label="Item Details" />
          <Tab label="Terms & Conditions" />
          <Tab label="Shipping Details" />
        </Tabs>
      </Box>

      <CommonTabPanel value={tabValue} index={0}>
        <Box className="custom-scrollbar" sx={{ overflowX: "auto" }}>
          <Box sx={{ minWidth: 1400 }}>
            <FieldArray name="items">
              {({ push, remove }) => {
                const columns: CommonTableColumn<any>[] = [
                  {
                    key: "actions",
                    header: "",
                    bodyClass: "p-2 flex justify-center gap-1",
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

                  { key: "sr", header: "#", render: (_, i) => i + 1 },

                  {
                    key: "productId",
                    header: "Product",
                    bodyClass: "min-w-60",
                    render: (_, index) => <CommonValidationSelect name={`items.${index}.productId`} label="Select Product" options={GenerateOptions(productsData?.data)} isLoading={isProductLoading} required disabled={!isCustomerSelected} />,
                  },

                  {
                    key: "qty",
                    header: "Qty",
                    bodyClass: "min-w-28",
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
                    bodyClass: "min-w-28",
                    render: (_, index) => {
                      const productId = values?.items?.[index]?.productId;

                      const product = productsData?.data?.find((p: ProductBase) => {
                        return p._id === productId;
                      });

                      const uom = product?.uomId?.name || "";

                      return <span>{uom}</span>;
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
                    header: "Discount 1",
                    bodyClass: "min-w-28",
                    render: (_, index) => <CommonValidationTextField name={`items.${index}.discount1`} type="number" size="small" />,
                  },
                  {
                    key: "taxId",
                    header: "Tax",
                    bodyClass: "min-w-28",
                    render: (_, index) => {
                      const productId = values?.items?.[index]?.productId;

                      const product = productsData?.data?.find((p: ProductBase) => {
                        return p._id === productId;
                      });

                      const taxName = product?.salesTaxId?.name || "";
                      const taxPercentage = product?.salesTaxId?.percentage || 0;
                      const qty = values?.items?.[index]?.qty || 0;
                      const price = values?.items?.[index]?.price || 0;
                      const discount1 = values?.items?.[index]?.discount1 || 0;

                      const finalPrice = price - discount1;

                      const finalTotal = finalPrice * qty;

                      const tax = finalTotal * (taxPercentage / 100);

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
                    key: "totalAmount",
                    header: "Total",
                    bodyClass: "min-w-28",
                    render: (_, index) => {
                      const totalAmount = calculateTotalAmount(index);
                      return <span>{totalAmount}</span>;
                    },
                    footer: (data) => data.reduce((acc, item) => acc + (+item.totalAmount || 0), 0).toFixed(2),
                  },
                ];

                return <CommonTable showFooter data={values.items || []} columns={columns} rowKey={(_row, index) => index.toString()} getRowClass={() => "align-top"} />;
              }}
            </FieldArray>
          </Box>
        </Box>
      </CommonTabPanel>

      <CommonTabPanel value={tabValue} index={1}>
        <Box sx={{ display: "flex", flexDirection: "column" }}>{/* <CommonTermsAndCondition selectedTermIds={selectedTermIds} onChange={onTermsChange} companyId={values?.companyId} isView={!isCustomerSelected} /> */}</Box>
      </CommonTabPanel>

      <CommonTabPanel value={tabValue} index={2}>
        <Box sx={{ p: 2 }}>
          <CommonShippingDetails />
        </Box>
      </CommonTabPanel>
    </>
  );
};

export default EstimateTabs;
