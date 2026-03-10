import { Add, Clear } from "@mui/icons-material";
import { Box, Tab, Tabs } from "@mui/material";
import { FieldArray, useFormikContext } from "formik";
import { useEffect, useRef, useState } from "react";
import { Queries } from "../../../Api";
import { CommonButton, CommonTextField, CommonValidationSelect, CommonValidationTextField } from "../../../Attribute";
import { CommonCard, CommonTabPanel, CommonTermsAndCondition } from "../../../Components/Common";
import CommonTable from "../../../Components/Common/CommonTable";
import { GenerateOptions } from "../../../Utils";
import type { CommonTableColumn, ProductBase, ProductSelectCellProps, PurchaseOrderFormValues, PurchaseOrderItem, TaxBase, TermsConditionBase } from "../../../Types";
import BillingSummary from "./BillingSummary";

const ProductSelectCell = ({ index, productData, taxData, isLoading }: ProductSelectCellProps) => {
  const { values, setFieldValue } = useFormikContext<PurchaseOrderFormValues>();
  const productId = values.items?.[index]?.productId;
  const prevProductId = useRef(productId);

  useEffect(() => {
    if (productId && productId !== prevProductId.current) {
      const productList = productData?.data || [];
      const product = productList?.find((p: ProductBase) => p._id === productId);
      if (product) {
        const taxId = typeof product.purchaseTaxId === "object" ? (product.purchaseTaxId as unknown as { _id: string })?._id : product.purchaseTaxId;
        const tax = taxData?.data?.find((t: TaxBase) => t._id === taxId);

        if (tax && tax.percentage !== undefined) {
          setFieldValue(`items.${index}.tax`, tax.percentage);
          setFieldValue(`items.${index}.taxName`, tax.name || (tax as TaxBase & { taxName?: string }).taxName || "");
        }
        setFieldValue(`items.${index}.qty`, 1);
        setFieldValue(`items.${index}.unitCost`, product.landingCost || 0);
        setFieldValue(`items.${index}.uomId`, product.uomId?._id || "");
        setFieldValue(`items.${index}.unit`, product.uomId?.name || product.unit || "");
        setFieldValue(`items.${index}.mrp`, product.mrp || 0);
      }
      prevProductId.current = productId;
    }
  }, [productId, productData, taxData, setFieldValue, index]);

  return <CommonValidationSelect name={`items.${index}.productId`} label="Search Product" isLoading={isLoading} options={GenerateOptions(productData?.data)} required />;
};

const TotalInputCell = ({ index }: { index: number }) => {
  const { values, setFieldValue } = useFormikContext<PurchaseOrderFormValues>();
  const item = values.items?.[index];

  if (!item) return null;

  const handleTotalChange = (value: string) => {
    const newTotal = Number(value) || 0;
    setFieldValue(`items.${index}.total`, newTotal);

    const qty = Number(item.qty) || 0;
    const taxPercent = Number(item.tax) || 0;
    const isTaxInclusive = values.taxType === "tax_inclusive";

    if (qty > 0) {
      const landingCost = newTotal / qty;
      let unitCost = 0;

      if (isTaxInclusive) {
        unitCost = landingCost;
      } else {
        unitCost = landingCost / (1 + taxPercent / 100);
      }
      setFieldValue(`items.${index}.unitCost`, unitCost);
    }
  };

  return <CommonTextField type="number" onChange={handleTotalChange} value={item.total || 0} />;
};

const ProductAndTerm = ({ isEditing }: { isEditing: boolean }) => {
  const { values, setFieldValue } = useFormikContext<PurchaseOrderFormValues>();
  const [tabValue, setTabValue] = useState(0);
  const { data: productData, isLoading: productDataLoading } = Queries.useGetProductDropdown({ companyFilter: values.companyId || undefined });
  const { data: termsData } = Queries.useGetTermsCondition({ all: true, companyId: values.companyId || undefined }, { enabled: !!values.companyId });
  const termsList = termsData?.data?.termsCondition_data || [];
  const defaultsInitialized = useRef(false);

  useEffect(() => {
    if (!isEditing && termsList.length > 0 && !defaultsInitialized.current) {
      const defaultTerms = termsList.filter((t: TermsConditionBase) => t.isDefault).map((t: TermsConditionBase) => t._id);
      if (defaultTerms.length > 0) {
        if (!values.termsAndConditionIds || values.termsAndConditionIds.length === 0) {
          setFieldValue("termsAndConditionIds", defaultTerms);
        }
        defaultsInitialized.current = true;
      }
    }
  }, [isEditing, termsList, setFieldValue, values.termsAndConditionIds]);
  const { data: taxData } = Queries.useGetTaxDropdown();

  useEffect(() => {
    let hasChanges = false;
    const newItems = values.items?.map((item: PurchaseOrderItem) => {
      // 1. Calculate Landing Cost
      const unitCost = Number(item.unitCost) || 0;
      const isOutOfScope = values.taxType === "out_of_scope";
      const taxPercent = isOutOfScope ? 0 : Number(item.tax) || 0;
      const isTaxInclusive = values.taxType === "tax_inclusive";

      let landingCost = 0;
      let taxAmount = 0;

      if (isTaxInclusive && !isOutOfScope) {
        landingCost = unitCost;
        const qty = Number(item.qty) || 0;
        const totalCtx = qty * unitCost;
        taxAmount = totalCtx - totalCtx / (1 + taxPercent / 100);
      } else {
        landingCost = unitCost + (unitCost * taxPercent) / 100;
        // Exclusive
        const qty = Number(item.qty) || 0;
        taxAmount = qty * unitCost * (taxPercent / 100);
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
  }, [values.items, values.taxType, values.summary?.flatDiscount, values.summary?.roundOff, setFieldValue]);

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
            <Box className="custom-scrollbar" sx={{ overflowX: "auto" }}>
              <Box sx={{ minWidth: 1400 }}>
                <FieldArray name="items">
                  {({ push, remove }) => {
                    const columns: CommonTableColumn<PurchaseOrderItem>[] = [
                      {
                        key: "action",
                        header: "",
                        headerClass: "text-center",
                        bodyClass: "text-center w-[100px]",
                        render: (_row, index) => (
                          <Box display="flex" justifyContent="center" gap={1}>
                            {index === (values.items?.length || 0) - 1 && (
                              <CommonButton variant="outlined" onClick={() => push({ productId: "", qty: 1, freeQty: 0, mrp: 0, sellingPrice: 0, discount1: 0, discount2: 0, taxableAmount: 0, unitCost: 0, tax: "0", landingCost: "0", margin: "0", total: 0 })}>
                                <Add />
                              </CommonButton>
                            )}

                            {(values.items?.length || 0) > 1 && (
                              <CommonButton color="error" variant="outlined" onClick={() => remove(index)}>
                                <Clear />
                              </CommonButton>
                            )}
                          </Box>
                        ),
                        footer: "Total",
                      },
                      { key: "sr", header: "#", bodyClass: "align-middle text-center w-[50px]", render: (_row, index) => index + 1 },
                      { key: "productId", header: "Product*", bodyClass: "min-w-[250px]", render: (_row, index) => <ProductSelectCell index={index} productData={productData} taxData={taxData} isLoading={productDataLoading} /> },
                      { key: "mrp", header: "MRP", bodyClass: "min-w-[120px]", render: (_row, index) => <CommonValidationTextField name={`items.${index}.mrp`} type="number" /> },
                      { key: "qty", header: "Qty", bodyClass: "min-w-[100px]", render: (_row, index) => <CommonValidationTextField name={`items.${index}.qty`} type="number" /> },
                      { key: "unit", header: "Unit", bodyClass: "min-w-[100px]", render: (_row, index) => <CommonValidationTextField name={`items.${index}.unit`} disabled /> },
                      { key: "unitCost", header: "Unit Cost", bodyClass: "min-w-[120px]", render: (_row, index) => <CommonValidationTextField name={`items.${index}.unitCost`} type="number" /> },
                      {
                        key: "tax",
                        header: "Tax",
                        bodyClass: "min-w-[140px] text-center",
                        render: (row) => (
                          <Box className="flex flex-col items-center">
                            <span className="text-sm font-medium">
                              {row.tax}% (₹{row.taxAmount})
                            </span>
                            <span className="text-xs text-gray-500">{row.taxName}</span>
                          </Box>
                        ),
                      },
                      { key: "landingCost", header: "Landing Cost", bodyClass: "min-w-[120px]", render: (_row, index) => <CommonValidationTextField name={`items.${index}.landingCost`} type="number" disabled /> },
                      { key: "margin", header: "Margin", bodyClass: "min-w-[120px]", render: (_row, index) => <CommonValidationTextField name={`items.${index}.margin`} type="number" disabled /> },
                      { key: "total", header: "Total", bodyClass: "min-w-[140px]", render: (_row, index) => <TotalInputCell index={index} />, footer: (data) => data.reduce((sum, item) => sum + (Number(item.total) || 0), 0).toFixed(2) },
                    ];

                    return <CommonTable showFooter data={values.items || []} columns={columns} rowKey={(_row, index) => index.toString()} getRowClass={() => "align-top"} />;
                  }}
                </FieldArray>
              </Box>
            </Box>
          </CommonTabPanel>

          {/* TAB 1: TERMS & CONDITIONS */}
          <CommonTabPanel value={tabValue} index={1}>
            <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr" }, gap: 3, mt: 2 }}>
              <CommonTermsAndCondition selectedTermIds={values.termsAndConditionIds || []} onChange={(ids) => setFieldValue("termsAndConditionIds", ids)} companyId={values.companyId} isView={!values.companyId} />
            </Box>
          </CommonTabPanel>
        </Box>
      </CommonCard>
      <BillingSummary productData={productData} />
    </>
  );
};
export default ProductAndTerm;
