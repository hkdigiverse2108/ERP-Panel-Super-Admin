import { Box } from "@mui/material";
import { Form, Formik, useFormikContext, type FormikHelpers, type FormikProps } from "formik";
import { useLocation, useNavigate } from "react-router-dom";
import { CommonBottomActionBar, CommonBreadcrumbs, CommonCard } from "../../../Components/Common";
import { PAGE_TITLE } from "../../../Constants";
import { DateConfig, GenerateOptions, GetChangedFields, RemoveEmptyFields } from "../../../Utils";
import { BREADCRUMBS } from "../../../Data";
import { Mutations, Queries } from "../../../Api";
import { useEffect, useRef, useState } from "react";
import TermsAndConditionModal from "../../../Components/Purchase/SupplierBill/TermsAndCondition/TermsAndConditionModal";
import SupplierBillTabs from "../../../Components/Purchase/SupplierBill/SupplierBillDetails/SupplierBillTab";
import AdditionalChargesSection from "../../../Components/Purchase/SupplierBill/AdditionalChargeSection";
import SupplierBillDetails from "../../../Components/Purchase/SupplierBill/SupplierBillDetails/SupplierBillDetails";
import type { AdditionalChargeDetails, AdditionalChargeItem, AdditionalChargeRow, BillSupplier as Supplier, ProductRow, SupplierBillFormValues, SupplierBillProductDetails, SupplierBillProductItem } from "../../../Types/SupplierBill";
import type { ProductBase, TermsConditionBase } from "../../../Types";
import TermsSelectionModal from "../../../Components/Purchase/SupplierBill/TermsAndCondition/TermsSelectionModal";
import { usePagePermission } from "../../../Utils/Hooks";
import { useAppSelector } from "../../../Store/hooks";

const TaxTypeWatcher = ({ onChange }: { onChange: (taxType: string) => void }) => {
  const { values } = useFormikContext<SupplierBillFormValues>();
  useEffect(() => {
    onChange(values.taxType || "default");
  }, [values.taxType]);
  return null;
};
const CompanyWatcher = ({ selectedCompanyId, onChange }: { selectedCompanyId: string; onChange: (companyId: string) => void }) => {
  const { values, setFieldValue } = useFormikContext<SupplierBillFormValues>();
  useEffect(() => {
    const newCompanyId = values.companyId || "";
    if (newCompanyId !== selectedCompanyId) {
      onChange(newCompanyId);
      if (selectedCompanyId) {
        setFieldValue("supplierId", "");
        setFieldValue("termsAndConditionIds", []);
      }
    }
  }, [values.companyId, selectedCompanyId, onChange, setFieldValue]);
  return null;
};
const SupplierWatcher = ({ suppliers, onChange }: { suppliers: Supplier[]; onChange: (supplier: Supplier | null) => void }) => {
  const { values } = useFormikContext<SupplierBillFormValues>();
  useEffect(() => {
    const supplierId = values.supplierId;
    if (!supplierId) {
      onChange(null);
      return;
    }
    const supplier = suppliers.find((s) => String(s._id) === String(supplierId));
    onChange(supplier ?? null);
  }, [values.supplierId, suppliers]);
  return null;
};
const SupplierBillForm = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const permission = usePagePermission(PAGE_TITLE.SUPPLIER_BILL.BASE);
  const data = location.state?.data;

  const { _id, createdAt, updatedAt, isDeleted, createdBy, updatedBy, __v, ...cleanData } = data || {};
  const defaultValues: SupplierBillFormValues = { supplierId: "", supplierBillNo: "", supplierBillDate: DateConfig.utc().toISOString(), taxType: "exclusive", paymentTerm: "", dueDate: "", reverseCharge: false, shippingDate: "", invoiceAmount: "", termsAndConditionIds: [], notes: "", paidAmount: 0, balanceAmount: 0, paymentStatus: "unpaid", status: "active", isActive: true };
  const initialValues: SupplierBillFormValues = { ...defaultValues, ...cleanData, supplierId: cleanData?.supplierId?._id || cleanData?.supplierId || defaultValues.supplierId, companyId: cleanData?.companyId?._id || cleanData?.companyId || "", branchId: cleanData?.branchId?._id || cleanData?.branchId || "", reverseCharge: Boolean(cleanData?.reverseCharge), termsAndConditionIds: data?.termsAndConditionIds?.map((t: { _id: string }) => t._id) || [] };

  const [selectedCompanyId, setSelectedCompanyId] = useState<string>(initialValues.companyId || "");

  const { data: companyData, isLoading: isCompanyLoading } = Queries.useGetCompanyDropdown();
  const companyOptions = GenerateOptions(companyData?.data || []);
  const { data: supplierData } = Queries.useGetContactDropdown({ activeFilter: true, typeFilter: "supplier", companyId: selectedCompanyId }, !!selectedCompanyId);
  const suppliers = (supplierData?.data || []) as Supplier[];
  const supplierOptions = GenerateOptions(suppliers);
  const isEditing = Boolean(data?._id);
  const pageMode = isEditing ? "EDIT" : "ADD";
  useEffect(() => {
    const hasAccess = isEditing ? permission.edit : permission.add;
    if (!hasAccess) {
      navigate(-1);
    }
  }, [isEditing, permission, navigate]);
  const [selectedSupplier, setSelectedSupplier] = useState<Supplier | null>(null);

  const handleCompanyChange = (newCompanyId: string) => {
    setSelectedCompanyId(newCompanyId);
    if (newCompanyId) {
      setRows([emptyRow]);
      setReturnRows([emptyRow]);
      setSelectedTermIds([]);
    }
  };
  const emptyRow: ProductRow = { productId: "", itemCode: "", qty: "", freeQty: "", unit: "", unitCost: "", mrp: "", sellingPrice: "", disc1: "", disc2: "", taxableAmount: "", itemTax: "", landingCost: "", margin: "", totalAmount: "", mfgDate: "", expiryDate: "", taxRate: "", taxName: "" };
  const additionalChargeEmptyRow: AdditionalChargeRow = { chargeId: "", taxableAmount: "", tax: "", taxAmount: "", totalAmount: "" };
  const [rows, setRows] = useState<ProductRow[]>([emptyRow]);
  const [returnRows, setReturnRows] = useState<ProductRow[]>([emptyRow]);
  const [additionalChargeRows, setAdditionalChargeRows] = useState<AdditionalChargeRow[]>([additionalChargeEmptyRow]);
  const { mutate: addSupplierBill, isPending: isAddLoading } = Mutations.useAddSupplierBill();
  const { mutate: editSupplierBill, isPending: isEditLoading } = Mutations.useEditSupplierBill();
  const formikRef = useRef<FormikProps<SupplierBillFormValues> | null>(null);
  const [tabValue, setTabValue] = useState(0);
  const [allTerms, setAllTerms] = useState<TermsConditionBase[]>([]);
  const [selectedTermIds, setSelectedTermIds] = useState<string[]>([]);
  const [showAdditionalCharge, setShowAdditionalCharge] = useState(false);
  const { data: TaxData, isLoading: TaxDataLoading } = Queries.useGetTaxDropdown();
  const taxOptions = GenerateOptions(TaxData?.data || []);
  const { data: ProductsData, isLoading: ProductsDataLoading } = Queries.useGetProductDropdown({ companyFilter: selectedCompanyId }, !!selectedCompanyId);
  const productOptions = GenerateOptions(ProductsData?.data);
  const [flatDiscount, setFlatDiscount] = useState<string | number>(0);
  const { data: additionalchargedata, isLoading: additionalchargeLoading } = Queries.useGetAdditionalChargesDropdown();
  const { data: termsConditionData } = Queries.useGetTermsCondition({ companyId: selectedCompanyId }, { enabled: !!selectedCompanyId });
  const additionalChargeOptions = GenerateOptions(additionalchargedata?.data);
  const [roundOffAmount, setRoundOffAmount] = useState<string | number>(0);
  const [returnRoundOffAmount, setReturnRoundOffAmount] = useState<string | number>(0);
  const { isTermsSelectionModal } = useAppSelector((state) => state.modal);
  useEffect(() => {
    if (!isTermsSelectionModal.open && isTermsSelectionModal.data) {
      setSelectedTermIds(isTermsSelectionModal.data);
    }
  }, [isTermsSelectionModal]);
  const calculateSummary = () => {
    const itemDiscount = rows.reduce((s, r) => s + (Number(r.disc1) || 0) + (Number(r.disc2) || 0), 0);
    const itemTaxable = rows.reduce((s, r) => s + (Number(r.taxableAmount) || 0), 0);
    const itemTax = rows.reduce((s, r) => s + (Number(r.itemTax) || 0), 0);
    const itemGross = rows.reduce((s, r) => s + (Number(r.qty) || 0) * (Number(r.sellingPrice) || 0), 0);
    const additionalTaxable = additionalChargeRows.reduce((s, r) => s + (Number(r.taxableAmount) || 0), 0);
    const additionalTax = additionalChargeRows.reduce((s, r) => s + (Number(r.taxAmount) || 0), 0);
    const grossAmount = itemGross + additionalTaxable;
    const totalTaxableBeforeDiscount = itemTaxable + additionalTaxable;
    const flatDisc = Number(flatDiscount) || 0;
    const taxableAfterDiscount = Math.max(0, totalTaxableBeforeDiscount - flatDisc);
    const effectiveTaxRate = totalTaxableBeforeDiscount > 0 ? (itemTax + additionalTax) / totalTaxableBeforeDiscount : 0;
    const taxAmount = taxableAfterDiscount * effectiveTaxRate;
    const roundOff = Number(roundOffAmount) || 0;
    const netAmount = taxableAfterDiscount + taxAmount + roundOff;
    const taxBreakdown: Record<string, { rate: number; amount: number }> = {};
    rows.forEach((r) => {
      const amount = Number(r.itemTax) || 0;
      if (r.taxName && amount > 0) {
        if (!taxBreakdown[r.taxName]) {
          taxBreakdown[r.taxName] = { rate: Number(r.taxRate) || 0, amount: 0 };
        }
        taxBreakdown[r.taxName].amount += amount;
      }
    });
    additionalChargeRows.forEach((r) => {
      const amount = Number(r.taxAmount) || 0;
      if (r.tax && amount > 0) {
        const taxObj = TaxData?.data?.find((t) => String(t._id) === String(r.tax));
        const name = taxObj?.name || "Tax";
        const rate = taxObj?.percentage || 0;
        if (!taxBreakdown[name]) {
          taxBreakdown[name] = { rate, amount: 0 };
        }
        taxBreakdown[name].amount += amount;
      }
    });
    const taxSummary = Object.entries(taxBreakdown).map(([name, data]) => ({ name, rate: data.rate, amount: Number(data.amount.toFixed(2)) }));
    const summaryItemDiscount = itemDiscount + flatDisc;
    const summaryGrossAmount = grossAmount - flatDisc;
    return { itemDiscount: summaryItemDiscount, grossAmount: summaryGrossAmount, taxableAmount: taxableAfterDiscount, itemTax: Number(itemTax.toFixed(2)), roundOff, netAmount: Number(netAmount.toFixed(2)), taxSummary };
  };
  const summary = calculateSummary();
  const displayTerms = allTerms.filter((term) => selectedTermIds.includes(term._id)).sort((a, b) => (b.isDefault ? 1 : 0) - (a.isDefault ? 1 : 0));
  useEffect(() => {
    if (!termsConditionData?.data) return;
    const response = termsConditionData.data;
    const all: TermsConditionBase[] = Array.isArray(response) ? response : (response.termsCondition_data ?? []);
    setAllTerms(all);
    if (isEditing && data?.termsAndConditionIds && data.companyId?._id === selectedCompanyId) {
      setSelectedTermIds(data.termsAndConditionIds.map((t: TermsConditionBase) => t._id));
    } else {
      const defaultTerms = all.filter((t) => t.isDefault);
      setSelectedTermIds(defaultTerms.map((t) => t._id));
    }
  }, [termsConditionData, isEditing, data, selectedCompanyId]);
  useEffect(() => {
    if (isEditing && data) {
      if (data.productDetails?.item) {
        setRows(
          data.productDetails.item.map((item: SupplierBillProductItem) => {
            const product = item.productId as ProductBase | undefined;
            return { productId: product?._id || (item.productId as string), qty: item.qty || "", freeQty: item.freeQty || "", mrp: item.mrp || "", sellingPrice: item.sellingPrice || "", disc1: item.discount1 || "", disc2: item.discount2 || "", taxAmount: item.taxAmount || "", totalAmount: item.total || "", itemCode: product?.itemCode || "", unit: product?.unit || "", taxableAmount: ((item.total || 0) - (item.taxAmount || 0)).toFixed(2), landingCost: item.landingCost || "", margin: item.margin || "", mfgDate: item.mfgDate ? DateConfig.utc(item.mfgDate).toISOString() : "", expiryDate: item.expiryDate ? DateConfig.utc(item.expiryDate).toISOString() : "", taxRate: product?.purchaseTaxId?.percentage || 0, taxName: product?.purchaseTaxId?.name || "" };
          }),
        );
      }
      if (data.additionalCharges?.item && data.additionalCharges.item.length > 0) {
        setAdditionalChargeRows(data.additionalCharges.item.map((item: AdditionalChargeItem) => ({ chargeId: String(item.chargeId || ""), taxableAmount: item.value?.toString() || "", tax: item.taxRate?.toString() || "", taxAmount: ((item.total || 0) - (item.value || 0))?.toFixed(2) || "", totalAmount: item.total?.toString() || "" })));
        setShowAdditionalCharge(true);
      } else {
        setAdditionalChargeRows([additionalChargeEmptyRow]);
      }
      if (data.summary?.flatDiscount) {
        setFlatDiscount(data.summary.flatDiscount);
      }
      if (data.summary?.roundOff) {
        setRoundOffAmount(data.summary.roundOff);
      }
      if (data.returnProductDetails?.summary?.roundOff) {
        setReturnRoundOffAmount(data.returnProductDetails.summary.roundOff);
      }
    }
    // termsAndConditionIds handling moved to terms effect
  }, [data, isEditing]);

  const mapProductRows = (): SupplierBillProductDetails => {
    const item = rows.map((r) => ({ productId: r.productId, qty: +r.qty || 0, freeQty: +r.freeQty || 0, mrp: +r.mrp || 0, sellingPrice: +r.sellingPrice || 0, landingCost: +r.landingCost || 0, margin: +r.margin || 0, discount1: +r.disc1 || 0, discount2: +r.disc2 || 0, taxAmount: +r.itemTax || 0, total: +r.totalAmount || 0 }));
    return { item, totalQty: item.reduce((s, r) => s + r.qty!, 0), totalTax: item.reduce((s, r) => s + r.taxAmount!, 0), total: item.reduce((s, r) => s + r.total!, 0) };
  };
  const mapAdditionalCharges = (): AdditionalChargeDetails => {
    const validRows = additionalChargeRows.filter((row) => row.chargeId);
    const item = validRows.map(({ chargeId, taxableAmount, tax, totalAmount }) => ({ chargeId: chargeId, value: +taxableAmount || 0, taxRate: +tax || 0, total: +totalAmount || 0 }));
    return { item, total: item.reduce((a, b) => a + b.total!, 0) };
  };
  const handleAdd = () => {
    setRows((prev) => [...prev, { ...emptyRow }]);
  };
  const handleCut = (index: number) => {
    setRows((prev) => (prev.length === 1 ? prev : prev.filter((_, i) => i !== index)));
  };
  const calculateRow = (row: ProductRow, taxType: string): ProductRow => {
    const qty = Number(row.qty) || 0;
    const unitCost = Number(row.unitCost) || 0;
    const taxRate = taxType === "outOfScope" ? 0 : Number(row.taxRate) || 0;
    const disc1 = Number(row.disc1) || 0;
    const disc2 = Number(row.disc2) || 0;
    const discountPerUnit = disc1 + disc2;
    const mrp = Number(row.mrp) || 0;
    const discountedCost = Math.max(0, unitCost - discountPerUnit);
    let landingCost = 0;
    let taxAmount = 0;
    if (taxType === "taxInclusive") {
      landingCost = discountedCost;
      const totalCtx = qty * discountedCost;
      taxAmount = totalCtx - totalCtx / (1 + taxRate / 100);
    } else {
      landingCost = discountedCost + (discountedCost * taxRate) / 100;
      taxAmount = qty * discountedCost * (taxRate / 100);
    }
    const totalAmount = landingCost * qty;
    const taxableAmount = totalAmount - taxAmount;
    const sellingPrice = mrp;
    const margin = sellingPrice - landingCost;
    return { ...row, taxableAmount: taxableAmount.toFixed(2), itemTax: taxAmount.toFixed(2), landingCost: landingCost.toFixed(2), sellingPrice: sellingPrice.toFixed(2), margin: margin.toFixed(2), totalAmount: totalAmount.toFixed(2) };
  };

  const calculateReturnRow = (row: ProductRow, taxType: string): ProductRow => {
    const qty = Number(row.qty) || 0;
    const unitCost = Number(row.unitCost) || 0;
    const taxRate = taxType === "outOfScope" ? 0 : Number(row.taxRate) || 0;
    const disc1 = Number(row.disc1) || 0;
    const disc2 = Number(row.disc2) || 0;
    const discountPerUnit = disc1 + disc2;
    const discountedCost = Math.max(0, unitCost - discountPerUnit);
    let landingCost = 0;
    let taxAmount = 0;
    if (taxType === "taxInclusive") {
      landingCost = discountedCost;
      const totalCtx = qty * discountedCost;
      taxAmount = totalCtx - totalCtx / (1 + taxRate / 100);
    } else {
      landingCost = discountedCost + (discountedCost * taxRate) / 100;
      taxAmount = qty * discountedCost * (taxRate / 100);
    }
    const totalAmount = landingCost * qty;
    const taxableAmount = totalAmount - taxAmount;
    return { ...row, taxableAmount: taxableAmount.toFixed(2), itemTax: taxAmount.toFixed(2), landingCost: landingCost.toFixed(2), totalAmount: totalAmount.toFixed(2) };
  };

  const handleRowChange = (index: number, field: keyof ProductRow, value: string | number | string[]) => {
    const taxType = formikRef.current?.values.taxType || "default";
    setRows((prev) => {
      const newRows = [...prev];
      const finalValue = Array.isArray(value) ? value[0] : value;
      let updatedRow = { ...newRows[index], [field]: finalValue };
      if (field === "productId") {
        if (!finalValue) {
          updatedRow = { ...emptyRow };
          newRows[index] = updatedRow;
          return newRows;
        }
        const product = (ProductsData?.data || []).find((p) => String(p._id) === String(finalValue));
        if (product) {
          updatedRow = { ...updatedRow, itemCode: product.itemCode || "", qty: 1, unit: product.unit || "", unitCost: product.purchasePrice || 0, mrp: product.mrp || 0, sellingPrice: product.purchasePrice || product.sellingPrice || 0, landingCost: product.landingCost || 0, taxRate: product.purchaseTaxId?.percentage || 0, taxName: product.purchaseTaxId?.name || "" };
        }
      }
      newRows[index] = calculateRow(updatedRow, taxType);
      return newRows;
    });
  };
  const handleReturnRowChange = (index: number, field: keyof ProductRow, value: string | number | string[]) => {
    const taxType = formikRef.current?.values.taxType || "default";
    setReturnRows((prev) => {
      const newRows = [...prev];
      const finalValue = Array.isArray(value) ? value[0] : value;
      let updatedRow = { ...newRows[index], [field]: finalValue };
      if (field === "productId") {
        if (!finalValue) {
          updatedRow = { ...emptyRow };
          newRows[index] = updatedRow;
          return newRows;
        }
        const product = (ProductsData?.data || []).find((p) => String(p._id) === String(finalValue));
        if (product) {
          updatedRow = { ...updatedRow, itemCode: product.itemCode || "", qty: 1, unit: product.unit || "", unitCost: product.purchasePrice || 0, sellingPrice: product.purchasePrice || product.sellingPrice || 0, landingCost: product.landingCost || 0, taxRate: product.purchaseTaxId?.percentage || 0, taxName: product.purchaseTaxId?.name || "" };
        }
      }
      newRows[index] = calculateReturnRow(updatedRow, taxType);
      return newRows;
    });
  };

  const handleAddReturn = () => {
    setReturnRows((prev) => [...prev, { ...emptyRow }]);
  };
  const handleCutReturn = (index: number) => {
    setReturnRows((prev) => (prev.length === 1 ? prev : prev.filter((_, i) => i !== index)));
  };
  const handleAddAdditionalCharge = () => {
    setAdditionalChargeRows((prev) => [...prev, { ...additionalChargeEmptyRow }]);
  };
  const handleCutAdditionalCharge = (index: number) => {
    setAdditionalChargeRows((prev) => (prev.length === 1 ? prev : prev.filter((_, i) => i !== index)));
  };
  const handleAdditionalChargeRowChange = (index: number, field: keyof AdditionalChargeRow, value: string | number | string[]) => {
    setAdditionalChargeRows((prev) => {
      const newRows = [...prev];
      const finalValue = Array.isArray(value) ? value[0] : value;
      newRows[index] = { ...newRows[index], [field]: finalValue };
      const recalculate = (rowIndex: number) => {
        const taxable = Number(newRows[rowIndex].taxableAmount) || 0;
        const taxId = newRows[rowIndex].tax;
        const taxObj = TaxData?.data?.find((t) => String(t._id) === String(taxId));
        const taxRate = taxObj?.percentage || 0;
        const taxAmt = (taxable * taxRate) / 100;
        const total = taxable + taxAmt;
        newRows[rowIndex].taxAmount = taxAmt.toFixed(2);
        newRows[rowIndex].totalAmount = total.toFixed(2);
      };
      if (field === "taxableAmount" || field === "tax") {
        recalculate(index);
      }
      if (field === "chargeId") {
        if (!finalValue) {
          newRows[index] = { ...additionalChargeEmptyRow };
          return newRows;
        }
        const selectedCharge = additionalchargedata?.data?.find((c: any) => c._id === finalValue);
        if (selectedCharge) {
          if (typeof selectedCharge.defaultValue === "number") {
            newRows[index].taxableAmount = selectedCharge.defaultValue.toFixed(2);
          }
          if (selectedCharge.taxId?._id) {
            newRows[index].tax = selectedCharge.taxId._id;
          }
          recalculate(index);
        }
      }
      return newRows;
    });
  };
  const handleDeleteTerm = (index: number) => {
    const termToRemove = displayTerms[index];
    if (!termToRemove?._id) return;
    const id = termToRemove._id;
    setSelectedTermIds((prev) => prev.filter((termId) => termId !== id));
    setAllTerms((prev) => prev.filter((term) => term._id !== id));
  };
  const handleSubmit = async (values: SupplierBillFormValues, { resetForm }: FormikHelpers<SupplierBillFormValues>) => {
    const { taxSummary, ...restSummary } = summary;
    const payload: SupplierBillFormValues = { ...values, productDetails: mapProductRows(), additionalCharges: mapAdditionalCharges(), termsAndConditionIds: selectedTermIds, summary: restSummary };

    const handleSuccess = () => {
      resetForm();
      navigate(-1);
    };

    if (isEditing) {
      const changedFields = GetChangedFields(payload, data);
      editSupplierBill({ ...changedFields, supplierBillId: data._id }, { onSuccess: handleSuccess });
    } else {
      addSupplierBill(RemoveEmptyFields(payload) as SupplierBillFormValues, { onSuccess: handleSuccess });
    }
  };
  return (
    <>
      <CommonBreadcrumbs title={PAGE_TITLE.SUPPLIER_BILL[pageMode]} maxItems={3} breadcrumbs={BREADCRUMBS.SUPPLIER_BILL[pageMode]} />
      <Box sx={{ p: { xs: 2, md: 3 }, mb: 8, display: "grid", gap: 2 }}>
        <Formik innerRef={formikRef} initialValues={initialValues} onSubmit={handleSubmit} enableReinitialize={isEditing}>
          {() => (
            <>
              <Form noValidate>
                <CompanyWatcher selectedCompanyId={selectedCompanyId} onChange={handleCompanyChange} />
                <SupplierWatcher suppliers={suppliers} onChange={setSelectedSupplier} />
                <TaxTypeWatcher
                  onChange={(type) => {
                    setRows((prev) => prev.map((r) => calculateRow(r, type)));
                    setReturnRows((prev) => prev.map((r) => calculateReturnRow(r, type)));
                  }}
                />
                <CommonCard title="Supplier Bill Details">
                  <SupplierBillDetails supplierOptions={supplierOptions} selectedSupplier={selectedSupplier} isEditing={isEditing} companyOptions={companyOptions} isCompanyLoading={isCompanyLoading} isSupplierDisabled={!selectedCompanyId} />
                </CommonCard>
              </Form>
              <CommonCard hideDivider>
                <SupplierBillTabs tabValue={tabValue} setTabValue={setTabValue} rows={rows} handleAdd={handleAdd} handleCut={handleCut} handleRowChange={handleRowChange} returnRows={returnRows} handleAddReturn={handleAddReturn} handleCutReturn={handleCutReturn} handleReturnRowChange={handleReturnRowChange} termsList={displayTerms} handleDeleteTerm={handleDeleteTerm} productOptions={productOptions} isProductLoading={ProductsDataLoading} returnRoundOffAmount={returnRoundOffAmount} onReturnRoundOffAmountChange={setReturnRoundOffAmount} isProductDisabled={!selectedCompanyId} isTermsDisabled={!selectedCompanyId} />
              </CommonCard>
              <CommonCard grid={{ xs: 12 }} hideDivider>
                <AdditionalChargesSection show={showAdditionalCharge} onToggle={setShowAdditionalCharge} rows={additionalChargeRows} onAdd={handleAddAdditionalCharge} onRemove={handleCutAdditionalCharge} onChange={handleAdditionalChargeRowChange} taxOptions={taxOptions} isTaxLoading={TaxDataLoading} flatDiscount={flatDiscount} onFlatDiscountChange={setFlatDiscount} summary={summary} isAdditionalChargeLoading={additionalchargeLoading} additionalChargeOptions={additionalChargeOptions} roundOffAmount={roundOffAmount} onRoundOffAmountChange={setRoundOffAmount} />
              </CommonCard>
              <CommonBottomActionBar save isLoading={isAddLoading || isEditLoading} onSave={() => formikRef.current?.submitForm()} />
            </>
          )}
        </Formik>
      </Box>
      <TermsAndConditionModal
        onSave={(term: TermsConditionBase) => {
          setAllTerms((prev) => {
            const index = prev.findIndex((t) => t._id === term._id);
            if (index > -1) {
              const updated = [...prev];
              updated[index] = term;
              return updated;
            }
            return [...prev, term];
          });
          setSelectedTermIds((prev) => {
            if (term.isDefault) {
              return prev.includes(term._id) ? prev : [...prev, term._id];
            } else {
              return prev.filter((id) => id !== term._id);
            }
          });
        }}
        companyId={selectedCompanyId}
      />
      <TermsSelectionModal companyId={selectedCompanyId} />
    </>
  );
};
export default SupplierBillForm;
