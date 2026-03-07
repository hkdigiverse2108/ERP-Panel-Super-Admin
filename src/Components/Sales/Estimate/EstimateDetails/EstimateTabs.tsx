import AddIcon from "@mui/icons-material/Add";
import { Box, Tab, Tabs } from "@mui/material";
import { ClearIcon } from "@mui/x-date-pickers-pro";
import { CommonButton, CommonValidationSelect, CommonValidationTextField } from "../../../../Attribute";
import { CommonTable, CommonTabPanel, CommonShippingDetails } from "../../../Common";
import type { CommonTableColumn, ProductBase } from "../../../../Types";
import type { EstimateFormValues } from "../../../../Types/Estimate";
import { useState } from "react";
import { Queries } from "../../../../Api";
import { GenerateOptions } from "../../../../Utils";
import { FieldArray, useFormikContext } from "formik";
import type { EstimateItem } from "../../../../Types/Estimate";

const EstimateTabs = ({ emptyRow }: { emptyRow: EstimateItem }) => {
  const [tabValue, setTabValue] = useState(0);
  const { values, setFieldValue } = useFormikContext<EstimateFormValues>();

  const isCustomerSelected = !!values?.customerId;
  const { data: productsData, isLoading: isProductLoading } = Queries.useGetProductDropdown({ companyFilter: values?.companyId }, !!values?.companyId);

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
                    render: (_, index) => (
                      <CommonValidationSelect
                        name={`items.${index}.productId`}
                        label="Select Product"
                        options={GenerateOptions(productsData?.data)}
                        isLoading={isProductLoading}
                        required
                        disabled={!isCustomerSelected}
                        // onChange={(value: string) => {
                        //   const product = productsData?.data?.find((p: ProductBase) => String(p._id) === String(value));

                        //   setFieldValue(`items.${index}.productId`, value);
                        //   setFieldValue(`items.${index}.uom`, product?.uomId?.name || "");
                        //   setFieldValue(`items.${index}.uomId`, product?.uomId?._id || "");
                        //   setFieldValue(`items.${index}.tax`, product?.salesTaxId?.name || "");
                        //   setFieldValue(`items.${index}.taxId`, product?.salesTaxId?._id || "");
                        //   setFieldValue(`items.${index}.price`, product?.price || 0);
                        // }}
                      />
                    ),
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
                      // const uomId = product?.uomId?._id || "";
                      // setFieldValue(`items.${index}.uom`, uom);
                      // setFieldValue(`items.${index}.uomId`, uomId);

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
                    key: "discount2",
                    header: "Discount 2",
                    bodyClass: "min-w-28",
                    render: (_, index) => <CommonValidationTextField name={`items.${index}.discount2`} type="number" size="small" />,
                  },

                  {
                    key: "taxId",
                    header: "Tax",
                    bodyClass: "min-w-28",
                    // render: (_, index) => <CommonValidationTextField name={`items.${index}.taxId`} size="small" />,
                    render: (_, index) => {
                      const productId = values?.items?.[index]?.productId;

                      const product = productsData?.data?.find((p: ProductBase) => {
                        return p._id === productId;
                      });

                      const tax = product?.salesTaxId?.name || "";
                      // const taxId = product?.salesTaxId?._id || "";
                      // setFieldValue(`items.${index}.tax`, tax);
                      // setFieldValue(`items.${index}.taxId`, taxId);

                      return <span className="text-md">{tax}</span>;
                    },
                  },

                  {
                    key: "totalAmount",
                    header: "Total",
                    bodyClass: "min-w-28",
                    // render: (_, index) => <CommonValidationTextField name={`items.${index}.totalAmount`} type="number" size="small" />,
                    // render: (_, index) => {
                    //   const total = 0;
                    //   // const tax = product?.salesTaxId?.name || "";
                    //   // const taxId = product?.salesTaxId?._id || "";
                    //   // setFieldValue(`items.${index}.tax`, tax);
                    //   // setFieldValue(`items.${index}.taxId`, taxId);

                    //   return <span className="text-md">{total}</span>;
                    // },
                    render: (_, index) => {
                      const row = values?.items?.[index];

                      const product = productsData?.data?.find((p: ProductBase) => p._id === row?.productId);

                      if (!product) return <span>0.00</span>;

                      const qty = Number(row?.qty || 0);
                      const price = Number(product?.sellingPrice || 0);
                      const dis1 = Number(row?.discount1 || 0);
                      const dis2 = Number(row?.discount2 || 0);

                      const taxRate = Number(product?.salesTaxId?.percentage || 0);
                      const taxIncluded = product?.isSalesTaxIncluding;

                      let amount = qty * price;

                      const discount1Amount = (amount * dis1) / 100;
                      const discount2Amount = ((amount - discount1Amount) * dis2) / 100;

                      let taxableAmount = amount - discount1Amount - discount2Amount;
                      let taxAmount = 0;
                      let total = 0;

                      if (taxIncluded) {
                        taxableAmount = taxableAmount / (1 + taxRate / 100);
                        taxAmount = taxableAmount * (taxRate / 100);
                        total = taxableAmount + taxAmount;
                      } else {
                        taxAmount = taxableAmount * (taxRate / 100);
                        total = taxableAmount + taxAmount;
                      }

                      return <span>{total.toFixed(2)}</span>;
                    },
                    footer: (data) => data.reduce((a, b) => a + (+b.totalAmount || 0), 0).toFixed(2),
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
