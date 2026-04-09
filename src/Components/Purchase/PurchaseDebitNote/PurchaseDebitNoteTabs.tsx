import AddIcon from "@mui/icons-material/Add";
import { Box, Tab, Tabs } from "@mui/material";
import { ClearIcon } from "@mui/x-date-pickers-pro";
import { CommonButton, CommonValidationSelect, CommonValidationTextField } from "../../../Attribute";
import { CommonTable, CommonTabPanel, CommonShippingDetails, CommonTermsAndCondition } from "../../Common";
import { useEffect, useState, useMemo } from "react";
import { Queries } from "../../../Api";
import { GenerateOptions } from "../../../Utils";
import { FieldArray, useFormikContext } from "formik";
import type { PurchaseDebitNoteProductItem, PurchaseDebitNoteFormValues, ProductBase, CommonTableColumn } from "../../../Types";

const PurchaseDebitNoteTabs = ({ emptyRow }: { emptyRow: PurchaseDebitNoteProductItem }) => {
  const [tabValue, setTabValue] = useState(0);
  const { values, setFieldValue } = useFormikContext<PurchaseDebitNoteFormValues>();

  const isSupplierSelected = !!values?.supplierId && !!values?.branchId;

  const productParams = useMemo(() => ({ companyFilter: values?.companyId, branchFilter: values?.branchId }), [values?.companyId, values?.branchId]);
  const { data: productsData, isLoading: isProductLoading } = Queries.useGetProductDropdown(productParams, !!values?.companyId && !!values?.branchId);

  const calculateRowValues = (index: number) => {
    const row = values?.productDetails?.[index];
    const product = productsData?.data?.find((p: ProductBase) => p._id === row?.productId);
    if (!product) return { tax: 0, taxableAmount: 0, total: 0, landingCost: 0, margin: 0 };

    const qty = Number(row?.qty || 0);
    const unitCost = Number(row?.unitCost || 0);
    const discount1 = Number(row?.discount1 || 0);
    const sellingPrice = Number(row?.sellingPrice || 0);

    const taxRate = Number(product?.purchaseTaxId?.percentage || 0);
    let taxIncluded = typeof product?.isPurchaseTaxIncluding === "boolean" ? product.isPurchaseTaxIncluding : false;

    const amount = qty * unitCost;
    let taxableAmount = amount - discount1;
    let taxAmount = 0;

    if (taxIncluded) {
      taxAmount = taxableAmount * (taxRate / (100 + taxRate));
      taxableAmount = taxableAmount - taxAmount;
    } else {
      taxAmount = taxableAmount * (taxRate / 100);
    }

    const total = taxableAmount + taxAmount;
    const landingCost = qty > 0 ? total / qty : total;
    const margin = sellingPrice - landingCost;

    return {
      tax: Number(taxAmount.toFixed(2)),
      taxableAmount: Number(taxableAmount.toFixed(2)),
      total: Number(total.toFixed(2)),
      landingCost: Number(landingCost.toFixed(2)),
      margin: Number(margin.toFixed(2)),
    };
  };

  useEffect(() => {
    if (isProductLoading || !productsData) return;

    values?.productDetails?.forEach((item, index) => {
      if (!item?.productId) return;
      const product = productsData?.data?.find((p: ProductBase) => p._id === item.productId);
      if (!product) return;

      const { tax, taxableAmount, total, landingCost, margin } = calculateRowValues(index);
      const uomName = product?.uomId?.name || "";

      if (!item.unitCost && product.purchasePrice) {
        setFieldValue(`productDetails.${index}.unitCost`, product.purchasePrice);
      }

      if (!item.mrp && product.mrp) {
        setFieldValue(`productDetails.${index}.mrp`, product.mrp);
      }

      if (!item.sellingPrice && product.sellingPrice) {
        setFieldValue(`productDetails.${index}.sellingPrice`, product.sellingPrice);
      }

      if (item.uomId !== product?.uomId?._id) setFieldValue(`productDetails.${index}.uomId`, product?.uomId?._id || "");
      if (item.unit !== uomName) setFieldValue(`productDetails.${index}.unit`, uomName);
      if (item.taxId !== product?.purchaseTaxId?._id) setFieldValue(`productDetails.${index}.taxId`, product?.purchaseTaxId?._id || "");

      if (Math.abs((Number(item.tax) || 0) - tax) > 0.01) setFieldValue(`productDetails.${index}.tax`, tax);
      // @ts-ignore
      if (Math.abs((Number(item.taxableAmount) || 0) - taxableAmount) > 0.01) setFieldValue(`productDetails.${index}.taxableAmount`, taxableAmount);
      if (Math.abs((Number(item.total) || 0) - total) > 0.01) setFieldValue(`productDetails.${index}.total`, total);
      if (Math.abs((Number(item.landingCost) || 0) - landingCost) > 0.01) setFieldValue(`productDetails.${index}.landingCost`, landingCost);
      if (Math.abs((Number(item.margin) || 0) - margin) > 0.01) setFieldValue(`productDetails.${index}.margin`, margin);
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
                    footer: () => <span className="p-2 text-right block font-bold">Total</span>,
                    footerClass: "text-right",
                  },
                  { key: "sr", header: "#", bodyClass: "w-[50px] text-center align-middle", render: (_, i) => i + 1 },
                  {
                    key: "productId",
                    header: "Product",
                    bodyClass: " min-w-[250px]",
                    render: (_, index) => <CommonValidationSelect name={`productDetails.${index}.productId`} label="Select Product" options={GenerateOptions(productsData?.data)} isLoading={isProductLoading} required disabled={!isSupplierSelected} />,
                  },
                  {
                    key: "qty",
                    header: "Qty",
                    bodyClass: "min-w-[120px]",
                    render: (_, index) => <CommonValidationTextField name={`productDetails.${index}.qty`} type="number" size="small" />,
                    footer: (data) => data.reduce((a, b) => a + (Number(b.qty) || 0), 0),
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
                    key: "unitCost",
                    header: "Unit Cost",
                    bodyClass: "min-w-28",
                    render: (_, index) => <CommonValidationTextField name={`productDetails.${index}.unitCost`} type="number" size="small" />,
                  },
                  {
                    key: "mrp",
                    header: "MRP",
                    bodyClass: "min-w-28",
                    render: (_, index) => <CommonValidationTextField name={`productDetails.${index}.mrp`} type="number" size="small" />,
                  },
                  {
                    key: "sellingPrice",
                    header: "Selling Price",
                    bodyClass: "min-w-28",
                    render: (_, index) => <CommonValidationTextField name={`productDetails.${index}.sellingPrice`} type="number" size="small" />,
                  },
                  {
                    key: "landingCost",
                    header: "Landing Cost",
                    bodyClass: "min-w-28",
                    render: (_, index) => <CommonValidationTextField name={`productDetails.${index}.landingCost`} type="number" size="small" disabled />,
                    footer: (data) => data.reduce((a, b) => a + (Number(b.landingCost) || 0), 0).toFixed(2),
                  },
                  {
                    key: "margin",
                    header: "Margin",
                    bodyClass: "min-w-28",
                    render: (_, index) => <CommonValidationTextField name={`productDetails.${index}.margin`} type="number" size="small" disabled />,
                    footer: (data) => data.reduce((a, b) => a + (Number(b.margin) || 0), 0).toFixed(2),
                  },
                  {
                    key: "discount1",
                    header: "Disc",
                    bodyClass: "min-w-24",
                    render: (_, index) => <CommonValidationTextField name={`productDetails.${index}.discount1`} type="number" size="small" />,
                    footer: (data) => data.reduce((a, b) => a + (Number(b.discount1) || 0), 0).toFixed(2),
                  },
                  {
                    key: "taxId",
                    header: "Tax",
                    bodyClass: "min-w-28 align-middle",
                    render: (_, index) => {
                      const productId = values?.productDetails?.[index]?.productId;
                      const product = productsData?.data?.find((p: ProductBase) => p._id === productId);
                      if (!product) return null;

                      const taxName = product?.purchaseTaxId?.name || "";
                      const taxPercentage = product?.purchaseTaxId?.percentage || 0;
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
                    bodyClass: "min-w-28 align-middle p-2",
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

export default PurchaseDebitNoteTabs;
