import AddIcon from "@mui/icons-material/Add";
import { Box, Tab, Tabs } from "@mui/material";
import { ClearIcon } from "@mui/x-date-pickers-pro";
import { FieldArray, useFormikContext } from "formik";
import { useEffect, useRef, useState, useMemo } from "react";
import { Queries } from "../../../Api";
import { CommonButton, CommonValidationSelect, CommonValidationTextField } from "../../../Attribute";
import { CommonTabPanel, CommonTable, CommonTermsAndCondition } from "../../Common";
import { GenerateOptions } from "../../../Utils";
import type { CommonTableColumn, ProductBase, SupplierBillProductItem, SupplierBillReturnProductItem, TaxBase } from "../../../Types";

interface SupplierBillTabsProps {
  emptyRow: SupplierBillProductItem;
  emptyReturnRow: SupplierBillReturnProductItem;
}

const SupplierBillTabs = ({ emptyRow, emptyReturnRow }: SupplierBillTabsProps) => {
  const [tabValue, setTabValue] = useState(0);
  const { values, setFieldValue } = useFormikContext<any>();

  const isSupplierSelected = !!values?.supplierId && !!values?.companyId && !!values?.branchId;

  const productParams = useMemo(() => ({ companyFilter: values?.companyId, branchFilter: values?.branchId }), [values?.companyId, values?.branchId]);
  const { data: productsData, isLoading: isProductLoading } = Queries.useGetProductDropdown(productParams, !!values?.companyId && !!values?.branchId);
  const { data: taxData } = Queries.useGetTaxDropdown();

  const calculateRowValues = (index: number, isReturn: boolean = false) => {
    const row = isReturn ? values?.returnProductDetails?.item?.[index] : values?.productDetails?.[index];
    const product = productsData?.data?.find((p: ProductBase) => p._id === row?.productId);

    if (!product) return { taxableAmount: 0, totalAmount: 0, taxAmount: 0, landingCost: 0, margin: 0, sellingPrice: 0 };

    const qty = Number(row?.qty || 0);
    const unitCost = Number(row?.unitCost || 0);
    const discount = Number(row?.discount1 || 0);

    const isOutOfScope = values?.taxType === "out_of_scope";
    const taxRate = isOutOfScope ? 0 : Number(row?.tax || 0);

    let taxIncluded = false;
    if (values?.taxType === "tax_inclusive") taxIncluded = true;
    else if (values?.taxType === "tax_exclusive") taxIncluded = false;
    else taxIncluded = typeof (product)?.isPurchaseTaxIncluding === "boolean" ? (product).isPurchaseTaxIncluding : false;

    let landingCost = 0;
    let taxAmount = 0;

    const discountedCost = Math.max(0, unitCost - discount);

    if (taxIncluded && !isOutOfScope) {
      landingCost = discountedCost;
      const totalCtx = qty * discountedCost;
      taxAmount = totalCtx - totalCtx / (1 + taxRate / 100);
    } else if (!isOutOfScope) {
      landingCost = discountedCost + discountedCost * (taxRate / 100);
      taxAmount = qty * discountedCost * (taxRate / 100);
    } else {
      landingCost = discountedCost;
    }

    const mrp = Number(row?.mrp || product?.mrp || 0);
    const sellingPrice = mrp - discount;
    const margin = sellingPrice > 0 ? sellingPrice - landingCost : 0;
    const totalAmount = qty * landingCost;
    const taxableAmount = qty * discountedCost; // Or totalAmount - taxAmount

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
    if (isProductLoading || !productsData || !taxData) return;

    const taxTypeChanged = values?.taxType !== prevTaxTypeRef.current;

    // Regular Items
    const items = values?.productDetails || [];
    items.forEach((item: SupplierBillProductItem, index: number) => {
      if (!item?.productId) return;
      const product = productsData?.data?.find((p: ProductBase) => p._id === item.productId);
      if (!product) return;

      const isProductChanged = (item)._prevProductId !== item.productId;

      let currentTaxRate = Number(item.tax || 0);
      let currentTaxId = item.taxId || "";

      if (isProductChanged || !item.taxId) {
        if (product.purchaseTaxId) {
          const pTaxId = typeof product.purchaseTaxId === "object" ? (product.purchaseTaxId)?._id : product.purchaseTaxId;
          const tax = taxData?.data?.find((t: TaxBase) => t._id === pTaxId);
          if (tax && tax.percentage !== undefined) {
            currentTaxRate = Number(tax.percentage) || 0;
            currentTaxId = tax._id;

            if (item.tax !== String(currentTaxRate)) setFieldValue(`productDetails.${index}.tax`, String(currentTaxRate));
            if (item.taxId !== currentTaxId) setFieldValue(`productDetails.${index}.taxId`, currentTaxId);
          }
        } else {
          currentTaxRate = 0;
          currentTaxId = "";
          if (item.tax !== "0") setFieldValue(`productDetails.${index}.tax`, "0");
          if (item.taxId !== "") setFieldValue(`productDetails.${index}.taxId`, "");
        }
      }

      const { taxableAmount, totalAmount, taxAmount, landingCost, margin, sellingPrice } = calculateRowValues(index, false);
      const uomName = product?.uomId?.name || "";

      let currentUnitCost = Number(item?.unitCost || 0);

      if (isProductChanged || taxTypeChanged) {
        let desiredCost = Number((product)?.purchasePrice) || Number(product?.landingCost) || Number(product?.mrp) || 0;
        const taxRate = Number(currentTaxRate) || 0;
        const isProductInclusive = typeof (product)?.isPurchaseTaxIncluding === "boolean" ? (product).isPurchaseTaxIncluding : false;

        if (values?.taxType === "tax_exclusive") {
          desiredCost = isProductInclusive ? desiredCost / (1 + taxRate / 100) : desiredCost;
        } else if (values?.taxType === "tax_inclusive") {
          desiredCost = !isProductInclusive ? desiredCost * (1 + taxRate / 100) : desiredCost;
        } else if (values?.taxType === "out_of_scope") {
          desiredCost = Number((product)?.purchasePrice) || Number(product?.landingCost) || Number(product?.mrp) || 0;
        } else {
          desiredCost = Number((product)?.purchasePrice) || Number(product?.landingCost) || Number(product?.mrp) || 0;
        }

        desiredCost = Number(desiredCost.toFixed(2));
        if (currentUnitCost !== desiredCost || isProductChanged) {
          setFieldValue(`productDetails.${index}.unitCost`, desiredCost);
          currentUnitCost = desiredCost;
        }

        if (isProductChanged) {
          if (item._prevProductId !== item.productId) setFieldValue(`productDetails.${index}._prevProductId`, item.productId);
          const newMrp = Number((product)?.mrp || 0);
          if (Number(item.mrp) !== newMrp) setFieldValue(`productDetails.${index}.mrp`, newMrp);
        }
      }

      // Ensure unit cost doesn't exceed product's landing cost
      const maxAllowedCost = Number((product)?.purchasePrice) || Number(product?.landingCost) || Number(product?.mrp) || 0;
      if (maxAllowedCost > 0 && currentUnitCost > maxAllowedCost) {
        if (Number(item.unitCost) !== maxAllowedCost) setFieldValue(`productDetails.${index}.unitCost`, maxAllowedCost);
        currentUnitCost = maxAllowedCost;
      }

      if (item.uomId !== product?.uomId?._id) setFieldValue(`productDetails.${index}.uomId`, product?.uomId?._id || "");
      if (item.unit !== uomName) setFieldValue(`productDetails.${index}.unit`, uomName);

      if (Math.abs((Number(item.taxAmount) || 0) - taxAmount) > 0.01) setFieldValue(`productDetails.${index}.taxAmount`, taxAmount);
      if (Math.abs((Number(item.taxableAmount) || 0) - taxableAmount) > 0.01) setFieldValue(`productDetails.${index}.taxableAmount`, taxableAmount);
      if (Math.abs((Number(item.total) || 0) - totalAmount) > 0.01) setFieldValue(`productDetails.${index}.total`, totalAmount);
      if (Math.abs((Number(item.landingCost) || 0) - landingCost) > 0.01) setFieldValue(`productDetails.${index}.landingCost`, String(landingCost));
      if (Math.abs((Number(item.margin) || 0) - margin) > 0.01) setFieldValue(`productDetails.${index}.margin`, String(margin));
      if (Math.abs((Number(item.sellingPrice) || 0) - sellingPrice) > 0.01) setFieldValue(`productDetails.${index}.sellingPrice`, sellingPrice);
    });

    // Return Items
    const returnItems = values?.returnProductDetails?.item || [];
    returnItems.forEach((item: SupplierBillReturnProductItem, index: number) => {
      if (!item?.productId) return;
      const product = productsData?.data?.find((p: ProductBase) => p._id === item.productId);
      if (!product) return;

      const isProductChanged = (item)._prevProductId !== item.productId;

      let currentTaxRate = Number(item.tax || 0);
      let currentTaxId = item.taxId || "";

      if (isProductChanged || !item.taxId) {
        if (product.purchaseTaxId) {
          const pTaxId = typeof product.purchaseTaxId === "object" ? (product.purchaseTaxId)?._id : product.purchaseTaxId;
          const tax = taxData?.data?.find((t: TaxBase) => t._id === pTaxId);
          if (tax && tax.percentage !== undefined) {
            currentTaxRate = Number(tax.percentage) || 0;
            currentTaxId = tax._id;

            if (item.tax !== String(currentTaxRate)) setFieldValue(`returnProductDetails.item.${index}.tax`, String(currentTaxRate));
            if (item.taxId !== currentTaxId) setFieldValue(`returnProductDetails.item.${index}.taxId`, currentTaxId);
          }
        } else {
          currentTaxRate = 0;
          currentTaxId = "";
          if (item.tax !== "0") setFieldValue(`returnProductDetails.item.${index}.tax`, "0");
          if (item.taxId !== "") setFieldValue(`returnProductDetails.item.${index}.taxId`, "");
        }
      }

      const { taxableAmount, totalAmount, taxAmount, landingCost } = calculateRowValues(index, true);

      let currentUnitCost = Number(item?.unitCost || 0);

      if (isProductChanged || taxTypeChanged) {
        let desiredCost = Number((product)?.purchasePrice) || Number(product?.landingCost) || Number(product?.mrp) || 0;
        const taxRate = Number(currentTaxRate) || 0;
        const isProductInclusive = typeof (product)?.isPurchaseTaxIncluding === "boolean" ? (product).isPurchaseTaxIncluding : false;

        if (values?.taxType === "tax_exclusive") desiredCost = isProductInclusive ? desiredCost / (1 + taxRate / 100) : desiredCost;
        else if (values?.taxType === "tax_inclusive") desiredCost = !isProductInclusive ? desiredCost * (1 + taxRate / 100) : desiredCost;
        else desiredCost = Number((product)?.purchasePrice) || Number(product?.landingCost) || Number(product?.mrp) || 0;

        desiredCost = Number(desiredCost.toFixed(2));
        if (currentUnitCost !== desiredCost || isProductChanged) {
          setFieldValue(`returnProductDetails.item.${index}.unitCost`, desiredCost);
          currentUnitCost = desiredCost;
        }

        if (isProductChanged) {
          if (item._prevProductId !== item.productId) setFieldValue(`returnProductDetails.item.${index}._prevProductId`, item.productId);
        }
      }

      const maxAllowedCost = Number((product)?.purchasePrice) || Number(product?.landingCost) || Number(product?.mrp) || 0;
      if (maxAllowedCost > 0 && currentUnitCost > maxAllowedCost) {
        if (Number(item.unitCost) !== maxAllowedCost) setFieldValue(`returnProductDetails.item.${index}.unitCost`, maxAllowedCost);
        currentUnitCost = maxAllowedCost;
      }

      if (Math.abs((Number(item.taxAmount) || 0) - taxAmount) > 0.01) setFieldValue(`returnProductDetails.item.${index}.taxAmount`, taxAmount);
      if (Math.abs((Number(item.taxableAmount) || 0) - taxableAmount) > 0.01) setFieldValue(`returnProductDetails.item.${index}.taxableAmount`, taxableAmount);
      if (Math.abs((Number(item.total) || 0) - totalAmount) > 0.01) setFieldValue(`returnProductDetails.item.${index}.total`, totalAmount);
      if (Math.abs((Number(item.landingCost) || 0) - landingCost) > 0.01) setFieldValue(`returnProductDetails.item.${index}.landingCost`, String(landingCost));

      const uomName = product?.uomId?.name || "";
      if (item.uomId !== product?.uomId?._id) setFieldValue(`returnProductDetails.item.${index}.uomId`, product?.uomId?._id || "");
      if (item.unit !== uomName) setFieldValue(`returnProductDetails.item.${index}.unit`, uomName);
    });

    if (taxTypeChanged) prevTaxTypeRef.current = values?.taxType;
  }, [values?.productDetails, values?.returnProductDetails?.item, productsData, taxData, values?.taxType]);

  return (
    <>
      <Box sx={{ width: "100%" }}>
        <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
          <Tabs value={tabValue} onChange={(_, v) => setTabValue(v)}>
            <Tab label="Product Details" />
            <Tab label="Terms &amp; Conditions" />
            <Tab label="Return Product Details" />
          </Tabs>
        </Box>

        {/* ================= TAB 1 : PRODUCT DETAILS ================= */}
        <CommonTabPanel value={tabValue} index={0}>
          <Box className="custom-scrollbar" sx={{ overflowX: "auto" }}>
            <Box sx={{ minWidth: "100%" }}>
              <FieldArray name="productDetails">
                {({ push, remove }) => {
                  const ProductRowColumns: CommonTableColumn<any>[] = [
                    {
                      key: "actions",
                      header: "",
                      bodyClass: "p-2 flex justify-center gap-1",
                      render: (_, index) => (
                        <>
                          {index === ((values?.productDetails || []).length || 0) - 1 && (
                            <CommonButton size="small" variant="outlined" onClick={() => push(emptyRow)}>
                              <AddIcon fontSize="small" />
                            </CommonButton>
                          )}
                          {((values?.productDetails || []).length || 0) > 1 && (
                            <CommonButton size="small" color="error" variant="outlined" onClick={() => remove && remove(index)}>
                              <ClearIcon fontSize="small" />
                            </CommonButton>
                          )}
                        </>
                      ),
                      footer: () => <span className="p-2 text-right block">Total</span>,
                      footerClass: "text-right",
                    },
                    { key: "sr", header: "#", render: (_, i) => i + 1, footer: "" },
                    {
                      key: "productId",
                      header: "Product",
                      bodyClass: "min-w-[250px]",
                      render: (_, index) => <CommonValidationSelect name={`productDetails.${index}.productId`} label="Select Product" options={GenerateOptions(productsData?.data)} isLoading={isProductLoading} required disabled={!isSupplierSelected} />,
                    },
                    {
                      key: "qty",
                      header: "Qty",
                      bodyClass: "min-w-28",
                      render: (_, index) => <CommonValidationTextField name={`productDetails.${index}.qty`} type="number" size="small" />,
                      footer: (data) => data.reduce((a: number, b: SupplierBillProductItem) => a + (Number(b?.qty) || 0), 0),
                    },
                    {
                      key: "freeQty",
                      header: "Free Qty",
                      bodyClass: "min-w-28",
                      render: (_, index) => <CommonValidationTextField name={`productDetails.${index}.freeQty`} type="number" size="small" />,
                      footer: (data) => data.reduce((a: number, b: SupplierBillProductItem) => a + (Number(b?.freeQty) || 0), 0),
                    },
                    {
                      key: "mrp",
                      header: "MRP",
                      bodyClass: "min-w-28",
                      render: (_, index) => <CommonValidationTextField name={`productDetails.${index}.mrp`} type="number" size="small" />,
                    },
                    {
                      key: "unitCost",
                      header: "Unit Cost",
                      bodyClass: "min-w-[120px]",
                      render: (_, index) => <CommonValidationTextField name={`productDetails.${index}.unitCost`} type="number" size="small" />,
                    },
                    {
                      key: "sellingPrice",
                      header: "Selling Price",
                      bodyClass: "min-w-28",
                      render: (_, index) => <CommonValidationTextField name={`productDetails.${index}.sellingPrice`} type="number" size="small" />,
                    },
                    {
                      key: "discount1",
                      header: "Disc 1",
                      bodyClass: "min-w-28",
                      render: (_, index) => <CommonValidationTextField name={`productDetails.${index}.discount1`} type="number" size="small" />,
                    },
                    {
                      key: "taxableAmount",
                      header: "Taxable",
                      bodyClass: "min-w-28",
                      render: (_, index) => <span>{values?.productDetails?.[index]?.taxableAmount || "0"}</span>,
                      footer: (data) => data.reduce((a: number, b: SupplierBillProductItem) => a + (Number(b?.taxableAmount) || 0), 0).toFixed(2),
                    },
                    {
                      key: "taxId",
                      header: "Tax",
                      bodyClass: "min-w-28 align-middle text-center",
                      render: (_, index) => {
                        const item = values?.productDetails?.[index];
                        if (!item?.productId) return null;
                        const isOutOfScope = values?.taxType === "out_of_scope";
                        const tax = taxData?.data?.find((t: TaxBase) => t._id === item.taxId);
                        const taxName = isOutOfScope ? "No Tax" : tax?.name || "";
                        const taxPercentage = isOutOfScope ? 0 : tax?.percentage || 0;
                        return (
                          <div className="text-md flex flex-col">
                            <span className="text-xs text-blue-500">
                              {taxName} ({taxPercentage}%)
                            </span>
                            <span>Rs. {(Number(item.taxAmount) || 0).toFixed(2)}</span>
                          </div>
                        );
                      },
                      footer: (data) => data.reduce((a: number, b: SupplierBillProductItem) => a + (Number(b?.taxAmount) || 0), 0).toFixed(2),
                    },
                    {
                      key: "landingCost",
                      header: "Landing Price",
                      bodyClass: "min-w-28 align-middle",
                      render: (_, index) => {
                        const { landingCost } = calculateRowValues(index, false);
                        return <span>{landingCost.toFixed(2)}</span>;
                      },
                    },
                    {
                      key: "margin",
                      header: "Margin",
                      bodyClass: "min-w-28 align-middle",
                      render: (_, index) => {
                        const { margin } = calculateRowValues(index, false);
                        return <span>{margin.toFixed(2)}</span>;
                      },
                    },
                    {
                      key: "total",
                      header: "Total",
                      bodyClass: "min-w-28 align-middle",
                      render: (_, index) => {
                        const { totalAmount } = calculateRowValues(index, false);
                        return <span>{totalAmount.toFixed(2)}</span>;
                      },
                      footer: (data) => data.reduce((a: number, b: SupplierBillProductItem) => a + (Number(b?.total) || 0), 0).toFixed(2),
                    },
                  ];
                  return <CommonTable showFooter data={values.productDetails || []} columns={ProductRowColumns} rowKey={(_row, index) => index.toString()} getRowClass={() => "align-top"} />;
                }}
              </FieldArray>
            </Box>
          </Box>
        </CommonTabPanel>

        {/* ================= TAB 2 : TERMS ================= */}
        <CommonTabPanel value={tabValue} index={1}>
          <CommonTermsAndCondition selectedTermIds={values.termsAndConditionIds || []} onChange={(ids: string[]) => setFieldValue("termsAndConditionIds", ids)} companyId={values.companyId} isView={!values.companyId} />
        </CommonTabPanel>

        {/* ================= TAB 3 : RETURN PRODUCT ================= */}
        <CommonTabPanel value={tabValue} index={2}>
          <Box className="custom-scrollbar" sx={{ overflowX: "auto" }}>
            <Box sx={{ minWidth: "100%" }}>
              <FieldArray name="returnProductDetails.item">
                {({ push, remove }) => {
                  const ReturnRowColumns: CommonTableColumn<any>[] = [
                    {
                      key: "actions",
                      header: "",
                      bodyClass: "p-2 flex justify-center gap-1",
                      render: (_, index) => (
                        <>
                          {index === ((values?.returnProductDetails?.item || []).length || 0) - 1 && (
                            <CommonButton size="small" variant="outlined" onClick={() => push(emptyReturnRow)}>
                              <AddIcon />
                            </CommonButton>
                          )}
                          {((values?.returnProductDetails?.item || []).length || 0) > 1 && (
                            <CommonButton size="small" color="error" variant="outlined" onClick={() => remove && remove(index)}>
                              <ClearIcon />
                            </CommonButton>
                          )}
                        </>
                      ),
                      footer: () => <span className="p-2 text-right block">Total</span>,
                      footerClass: "text-right",
                    },
                    { key: "sr", header: "#", render: (_, i) => i + 1, bodyClass: "w-10", footer: "" },
                    {
                      key: "productId",
                      header: "Product Name",
                      headerClass: "text-start",
                      bodyClass: "min-w-[250px] text-start",
                      render: (_, index) => <CommonValidationSelect name={`returnProductDetails.item.${index}.productId`} label="Select Product" options={GenerateOptions(productsData?.data)} isLoading={isProductLoading} required disabled={!isSupplierSelected} />,
                      footer: "",
                    },
                    {
                      key: "qty",
                      header: "Qty",
                      bodyClass: "min-w-28",
                      render: (_, index) => <CommonValidationTextField name={`returnProductDetails.item.${index}.qty`} type="number" size="small" />,
                      footer: (data) => data.reduce((a: number, b: SupplierBillReturnProductItem) => a + (Number(b?.qty) || 0), 0),
                    },
                    {
                      key: "unitCost",
                      header: "Unit Cost",
                      bodyClass: "min-w-28",
                      render: (_, index) => <CommonValidationTextField name={`returnProductDetails.item.${index}.unitCost`} type="number" size="small" />,
                    },
                    {
                      key: "discount1",
                      header: "Disc1",
                      bodyClass: "min-w-28",
                      render: (_, index) => <CommonValidationTextField name={`returnProductDetails.item.${index}.discount1`} type="number" size="small" />,
                    },

                    {
                      key: "taxableAmount",
                      header: "Taxable",
                      bodyClass: "min-w-28",
                      render: (_, index) => <span>{values?.returnProductDetails?.item?.[index]?.taxableAmount || "0"}</span>,
                    },
                    {
                      key: "taxId",
                      header: "Tax",
                      render: (_, index) => {
                        const item = values?.returnProductDetails?.item?.[index];
                        if (!item?.productId) return null;
                        const isOutOfScope = values?.taxType === "out_of_scope";
                        const tax = taxData?.data?.find((t: TaxBase) => t._id === item.taxId);
                        const taxName = isOutOfScope ? "No Tax" : tax?.name || "";
                        const taxPercentage = isOutOfScope ? 0 : tax?.percentage || 0;
                        return (
                          <div className="text-md flex flex-col">
                            <span className="text-xs text-blue-500">
                              {taxName} ({taxPercentage}%)
                            </span>
                            <span>Rs. {(Number(item.taxAmount) || 0).toFixed(2)}</span>
                          </div>
                        );
                      },
                    },
                    {
                      key: "landingCost",
                      header: "Landing Cost",
                      bodyClass: "min-w-28",
                      render: (_, index) => {
                        const { landingCost } = calculateRowValues(index, true);
                        return <span>{landingCost.toFixed(2)}</span>;
                      },
                    },
                    {
                      key: "total",
                      header: "Total",
                      bodyClass: "min-w-28",
                      render: (_, index) => {
                        const { totalAmount } = calculateRowValues(index, true);
                        return <span>{totalAmount.toFixed(2)}</span>;
                      },
                    },
                  ];
                  return <CommonTable showFooter data={values.returnProductDetails?.item || []} columns={ReturnRowColumns} rowKey={(_row, index) => index.toString()} getRowClass={() => "align-top"} />;
                }}
              </FieldArray>
            </Box>
          </Box>

          <Box sx={{ mt: 3, mb: 2, mr: 2, display: "flex", justifyContent: "flex-end", gap: 2 }}>
            <Box className="border dark:border-gray-700 text-sm w-full md:w-[350px]" sx={{ borderRadius: "8px", overflow: "hidden" }}>
              <Box className="grid grid-cols-[130px_1fr] border-b border-gray-200 dark:border-gray-700">
                <Box className="bg-gray-50 dark:bg-gray-800 p-2 flex justify-end font-medium">Gross</Box>
                <Box className="p-2 text-right font-medium">{(values?.returnProductDetails?.item || []).reduce((a: number, b: SupplierBillReturnProductItem) => a + (Number(b?.taxableAmount) || 0), 0).toFixed(2)}</Box>
              </Box>
              <Box className="grid grid-cols-[130px_1fr] border-b border-gray-200 dark:border-gray-700">
                <Box className="bg-gray-50 dark:bg-gray-800 p-2 flex justify-end font-medium">Tax Amount</Box>
                <Box className="p-2 text-right font-medium">{(values?.returnProductDetails?.item || []).reduce((a: number, b: SupplierBillReturnProductItem) => a + (Number(b?.taxAmount) || 0), 0).toFixed(2)}</Box>
              </Box>
              <Box className="grid grid-cols-[130px_1fr] border-b border-gray-200 dark:border-gray-700">
                <Box className="bg-gray-50 dark:bg-gray-800 p-2 flex justify-end font-medium text-blue-500">Roundoff</Box>
                <Box className="p-1 px-2 flex justify-end">
                  <span className="text-gray-900 dark:text-gray-100 font-bold ml-1 w-50">
                    <CommonValidationTextField name="returnProductDetails.summary.roundOff" label="" type="number" size="small" sx={{ width: "100px", "& input": { textAlign: "right" } }} />
                  </span>
                </Box>
              </Box>
              <Box className="grid grid-cols-[130px_1fr]">
                <Box className="bg-gray-50 dark:bg-gray-800 p-3 flex justify-end font-bold text-lg">Net Amount</Box>
                <Box className="p-3 text-right font-bold text-lg">{((values?.returnProductDetails?.item || []).reduce((a: number, b: SupplierBillReturnProductItem) => a + (Number(b?.total) || 0), 0) + (Number(values?.returnProductDetails?.summary?.roundOff) || 0)).toFixed(2)}</Box>
              </Box>
            </Box>
          </Box>
        </CommonTabPanel>
      </Box>
    </>
  );
};
export default SupplierBillTabs;
