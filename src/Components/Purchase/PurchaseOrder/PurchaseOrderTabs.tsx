import AddIcon from "@mui/icons-material/Add";
import { Box, Tab, Tabs } from "@mui/material";
import { ClearIcon } from "@mui/x-date-pickers-pro";
import { CommonButton, CommonValidationSelect, CommonValidationTextField } from "../../../Attribute";
import { CommonTable, CommonTabPanel, CommonTermsAndCondition } from "../../Common";
import { useEffect, useState, useRef } from "react";
import { Queries } from "../../../Api";
import { GenerateOptions } from "../../../Utils";
import { FieldArray, useFormikContext } from "formik";
import type { PurchaseOrderItem, PurchaseOrderFormValues } from "../../../Types/PurchaseOrder";
import type { CommonTableColumn, ProductBase, TaxBase } from "../../../Types";

const PurchaseOrderTabs = ({ emptyRow }: { emptyRow: PurchaseOrderItem }) => {
  const [tabValue, setTabValue] = useState(0);
  const { values, setFieldValue } = useFormikContext<PurchaseOrderFormValues>();

  const isSupplierSelected = !!values?.supplierId;
  const { data: productsData, isLoading: isProductLoading } = Queries.useGetProductDropdown({ companyFilter: values?.companyId }, !!values?.companyId);
  const { data: taxData } = Queries.useGetTaxDropdown();

  const calculateRowValues = (index: number) => {
    const row = values?.items?.[index];
    const product = productsData?.data?.find((p: ProductBase) => p._id === row?.productId);
    if (!product) return { taxableAmount: 0, totalAmount: 0, taxAmount: 0, landingCost: 0, margin: 0, sellingPrice: 0 };

    const qty = Number(row?.qty || 0);
    const unitCost = Number(row?.unitCost || 0);
    const discount = Number(row?.discount1 || 0);

    const isOutOfScope = values?.taxType === "out_of_scope";
    const taxRate = isOutOfScope ? 0 : Number(row?.tax || 0);

    let taxIncluded = false;
    if (values?.taxType === "tax_inclusive") {
      taxIncluded = true;
    } else if (values?.taxType === "tax_exclusive") {
      taxIncluded = false;
    } else {
      // Assuming product has isPurchaseTaxIncluding or defaulting to false
      taxIncluded = typeof (product as any)?.isPurchaseTaxIncluding === "boolean" ? (product as any).isPurchaseTaxIncluding : false;
    }

    let landingCost = 0;
    let taxAmount = 0;

    if (taxIncluded && !isOutOfScope) {
      landingCost = unitCost;
      const totalCtx = qty * unitCost;
      taxAmount = totalCtx - totalCtx / (1 + taxRate / 100);
    } else if (!isOutOfScope) {
      landingCost = unitCost + unitCost * (taxRate / 100);
      taxAmount = qty * unitCost * (taxRate / 100);
    } else {
      landingCost = unitCost;
    }

    const mrp = Number(row?.mrp || (product as any)?.mrp || 0);
    const sellingPrice = mrp - discount;
    const margin = sellingPrice > 0 ? sellingPrice - landingCost : 0;
    const totalAmount = qty * landingCost;
    // for PO, taxable amount is typically just quantity * unit cost before tax
    const taxableAmount = qty * unitCost;

    return {
      taxableAmount: Number(taxableAmount.toFixed(2)),
      totalAmount: Number(totalAmount.toFixed(2)),
      taxAmount: Number(taxAmount.toFixed(2)),
      landingCost: Number(landingCost.toFixed(2)),
      margin: Number(margin.toFixed(2)),
      sellingPrice: Number(sellingPrice.toFixed(2)),
    };
  };

  const prevTaxTypeRef = useRef(values?.taxType);

  useEffect(() => {
    const taxTypeChanged = values?.taxType !== prevTaxTypeRef.current;

    values?.items?.forEach((item, index) => {
      if (!item?.productId) return;
      const product = productsData?.data?.find((p: ProductBase) => p._id === item.productId);
      if (!product) return;

      // Handle taxId initialization from product
      let currentTaxRate = Number(item.tax || 0);
      let currentTaxId = item.taxId || "";

      if (!item.taxId && product.purchaseTaxId) {
        const pTaxId = typeof product.purchaseTaxId === "object" ? (product.purchaseTaxId as unknown as { _id: string })?._id : product.purchaseTaxId;
        const tax = taxData?.data?.find((t: TaxBase) => t._id === pTaxId);
        if (tax && tax.percentage !== undefined) {
          currentTaxRate = Number(tax.percentage) || 0;
          currentTaxId = tax._id;

          if (item.tax !== String(currentTaxRate)) setFieldValue(`items.${index}.tax`, String(currentTaxRate));
          if (item.taxId !== currentTaxId) setFieldValue(`items.${index}.taxId`, currentTaxId);
        }
      }

      const { taxableAmount, totalAmount, taxAmount, landingCost, margin } = calculateRowValues(index);
      const uomName = product?.uomId?.name || "";

      // Set default unitCost or adjust on taxType change
      let currentUnitCost = Number(item?.unitCost || 0);
      const isProductChanged = (item as any)._prevProductId !== item.productId;

      if (isProductChanged || taxTypeChanged) {
        let desiredCost = Number((product as any)?.purchasePrice) || Number(product?.landingCost) || Number(product?.mrp) || 0;
        const taxRate = Number(currentTaxRate) || 0;
        const isProductInclusive = typeof (product as any)?.isPurchaseTaxIncluding === "boolean" ? (product as any).isPurchaseTaxIncluding : false;

        if (values?.taxType === "tax_exclusive") {
          desiredCost = isProductInclusive ? desiredCost / (1 + taxRate / 100) : desiredCost;
        } else if (values?.taxType === "tax_inclusive") {
          desiredCost = !isProductInclusive ? desiredCost * (1 + taxRate / 100) : desiredCost;
        } else if (values?.taxType === "out_of_scope") {
          desiredCost = Number((product as any)?.purchasePrice) || Number(product?.landingCost) || Number(product?.mrp) || 0;
        } else {
          desiredCost = Number((product as any)?.purchasePrice) || Number(product?.landingCost) || Number(product?.mrp) || 0;
        }

        desiredCost = Number(desiredCost.toFixed(2));
        if (currentUnitCost !== desiredCost || isProductChanged) {
          setFieldValue(`items.${index}.unitCost`, desiredCost);
          currentUnitCost = desiredCost;
        }

        if (isProductChanged) {
          setFieldValue(`items.${index}._prevProductId`, item.productId);
        }
      }

      // Ensure unit cost doesn't exceed product's landing cost
      const maxAllowedCost = Number((product as any)?.purchasePrice) || Number(product?.landingCost) || Number(product?.mrp) || 0;
      if (maxAllowedCost > 0 && currentUnitCost > maxAllowedCost) {
        setFieldValue(`items.${index}.unitCost`, maxAllowedCost);
        currentUnitCost = maxAllowedCost;
      }

      // Only set values if they actually changed to avoid infinite loops
      if (item.uomId !== product?.uomId?._id) setFieldValue(`items.${index}.uomId`, product?.uomId?._id || "");
      if (item.unit !== uomName) setFieldValue(`items.${index}.unit`, uomName);

      // Update calculated fields
      if (Number(item.taxAmount) !== taxAmount) setFieldValue(`items.${index}.taxAmount`, taxAmount);
      if (Number(item.taxableAmount) !== taxableAmount) setFieldValue(`items.${index}.taxableAmount`, taxableAmount);
      if (Number(item.total) !== totalAmount) setFieldValue(`items.${index}.total`, totalAmount);
      if (Number(item.landingCost) !== landingCost) setFieldValue(`items.${index}.landingCost`, String(landingCost));
      if (Number(item.margin) !== margin) setFieldValue(`items.${index}.margin`, String(margin));

      const discount = Number(item?.discount1 || 0);
      const qty = Number(item?.qty || 0);
      const amount = qty * currentUnitCost;
      if (discount > amount) setFieldValue(`items.${index}.discount1`, 0);
    });

    if (taxTypeChanged) {
      prevTaxTypeRef.current = values?.taxType;
    }
  }, [values?.items, productsData, taxData, values?.taxType]);

  return (
    <>
      <Box sx={{ width: "100%" }}>
        <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
          <Tabs value={tabValue} onChange={(_, v) => setTabValue(v)}>
            <Tab label="Item Details" />
            <Tab label="Terms & Conditions" />
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
                      render: (_, index) => <CommonValidationSelect name={`items.${index}.productId`} label="Select Product" options={GenerateOptions(productsData?.data)} isLoading={isProductLoading} required disabled={!isSupplierSelected} />,
                    },
                    {
                      key: "qty",
                      header: "Qty",
                      bodyClass: "min-w-[100px]",
                      render: (_, index) => <CommonValidationTextField name={`items.${index}.qty`} type="number" size="small" />,
                      footer: (data) => data.reduce((a, b) => a + (+b.qty || 0), 0),
                    },
                    {
                      key: "uomId",
                      header: "UOM",
                      bodyClass: "min-w-28 align-middle",
                      render: (_, index) => {
                        const productId = values?.items?.[index]?.productId;
                        const product = productsData?.data?.find((p: ProductBase) => p._id === productId);
                        return <span>{product?.uomId?.name || ""}</span>;
                      },
                    },
  
                    {
                      key: "unitCost",
                      header: "Unit Cost",
                      bodyClass: "min-w-[120px]",
                      render: (_, index) => {
                        // const isOutOfScope = values?.taxType === "out_of_scope";

                        return (
                          <div className="flex flex-col gap-1">
                            <CommonValidationTextField name={`items.${index}.unitCost`} type="number" size="small" />
                          </div>
                        );
                      },
                    },
                    {
                      key: "taxId",
                      header: "Tax",
                      bodyClass: "min-w-28 align-middle",
                      render: (_, index) => {
                        const item = values?.items?.[index];
                        if (!item?.productId) return null;

                        const isOutOfScope = values?.taxType === "out_of_scope";
                        const tax = taxData?.data?.find((t: TaxBase) => t._id === item.taxId);
                        const taxName = isOutOfScope ? "No Tax" : tax?.name || "";
                        const taxPercentage = isOutOfScope ? 0 : tax?.percentage || 0;
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
                      key: "landingCost",
                      header: "Landing Cost",
                      bodyClass: "min-w-[120px] align-middle",
                      render: (_, index) => {
                        const { landingCost } = calculateRowValues(index);
                        return <span>{landingCost.toFixed(2)}</span>;
                      },
                    },
                    {
                      key: "margin",
                      header: "Margin",
                      bodyClass: "min-w-[120px] align-middle",
                      render: (_, index) => {
                        const { margin } = calculateRowValues(index);
                        return <span>{margin.toFixed(2)}</span>;
                      },
                    },
                    {
                      key: "total",
                      header: "Total",
                      bodyClass: "min-w-[140px] align-middle",
                      render: (_, index) => {
                        const { totalAmount } = calculateRowValues(index);
                        return <span>{totalAmount.toFixed(2)}</span>;
                      },
                      footer: (data) => data.reduce((acc, item) => acc + (+item.total || 0), 0).toFixed(2),
                    },
                  ];

                  return <CommonTable showFooter data={values.items || []} columns={columns} rowKey={(_row, index) => index.toString()} getRowClass={() => "align-top"} />;
                }}
              </FieldArray>
            </Box>
          </Box>
        </CommonTabPanel>

        <CommonTabPanel value={tabValue} index={1}>
          <CommonTermsAndCondition selectedTermIds={values.termsAndConditionIds || []} onChange={(ids: string[]) => setFieldValue("termsAndConditionIds", ids)} companyId={values.companyId} isView={!values.companyId} />
        </CommonTabPanel>
      </Box>
    </>
  );
};

export default PurchaseOrderTabs;
