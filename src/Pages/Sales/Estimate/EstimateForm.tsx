import { Box, Grid } from "@mui/material";
import { Form, Formik, useFormikContext, type FormikHelpers } from "formik";
import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Mutations, Queries } from "../../../Api";
import { CommonBottomActionBar, CommonBreadcrumbs, CommonCard } from "../../../Components/Common";
import { PAGE_TITLE } from "../../../Constants";
import { BREADCRUMBS } from "../../../Data";
import type { ContactBase, EstimateFormValues } from "../../../Types";
import { DateConfig, GenerateOptions, GetChangedFields, RemoveEmptyFields } from "../../../Utils";
import { usePagePermission } from "../../../Utils/Hooks";
import EstimateDetails from "../../../Components/Sales/Estimate/EstimateDetails/EstimateDetails";
import EstimateTabs from "../../../Components/Sales/Estimate/EstimateDetails/EstimateTabs";
import AdditionalChargesSection from "../../../Components/Purchase/SupplierBill/AdditionalChargeSection";

// Watchers
// const TaxTypeWatcher = ({ onChange }: { onChange: (taxType: string) => void }) => {
//   const { values } = useFormikContext<EstimateFormValues>();
//   useEffect(() => {
//     onChange(values.taxType || "default");
//   }, [values.taxType, onChange]);
//   return null;
// };

// const CompanyWatcher = ({ selectedCompanyId, onChange }: { selectedCompanyId: string; onChange: (companyId: string) => void }) => {
//   const { values, setFieldValue } = useFormikContext<EstimateFormValues>();
//   useEffect(() => {
//     const newCompanyId = values.companyId || "";
//     if (newCompanyId !== selectedCompanyId) {
//       onChange(newCompanyId);
//       if (selectedCompanyId) {
//         setFieldValue("customerId", "");
//         setFieldValue("termsAndConditionIds", []);
//       }
//     }
//   }, [values.companyId, selectedCompanyId, onChange, setFieldValue]);
//   return null;
// };

// const CustomerWatcher = ({ customers, onChange }: { customers: ContactBase[]; onChange: (customer: ContactBase | null) => void }) => {
//   const { values, setFieldValue } = useFormikContext<EstimateFormValues>();
//   useEffect(() => {
//     const customerId = values.customerId;
//     if (!customerId) {
//       onChange(null);
//       return;
//     }
//     const customer = customers.find((c) => String(c._id) === String(customerId));
//     const selectedCustomer = customer ?? null;
//     onChange(selectedCustomer);

//     // Auto-select first address if none selected
//     if (selectedCustomer?.address?.length) {
//       if (!values.billingAddress) setFieldValue("billingAddress", selectedCustomer.address[0]._id);
//       if (!values.shippingAddress) setFieldValue("shippingAddress", selectedCustomer.address[0]._id);
//     }
//   }, [values.customerId, customers, onChange, setFieldValue]);
//   return null;
// };

const EstimateForm = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const permission = usePagePermission(PAGE_TITLE.ESTIMATE.BASE);
  const { data } = location.state || {};

  // const { _id, createdAt, updatedAt, isDeleted, createdBy, updatedBy, __v, ...data } = data || {};
  const emptyRow = { productId: "", qty: 1, freeQty: 0, uomId: "", price: 0, discount1: 0, taxId: "", taxableAmount: 0, totalAmount: 0 };

  const initialValues: EstimateFormValues = {
    companyId: data?.companyId || "",
    date: data?.date || DateConfig.utc().toISOString(),
    dueDate: data?.dueDate || "",
    customerId: data?.customerId || "",
    placeOfSupply: data?.placeOfSupply || "",
    billingAddress: data?.billingAddress?._id || "",
    shippingAddress: data?.shippingAddress?._id || "",
    paymentTerms: data?.paymentTerms || "",
    taxType: data?.taxType || "exclusive",
    reverseCharge: data?.reverseCharge || false,
    termsAndConditionIds: data?.termsAndConditionIds?.map((t: { _id: string }) => t._id) || [],
    items: data?.items || [emptyRow],
    additionalCharges: [],
    shippingDetails: {
      shippingType: data?.shippingDetails?.shippingType || "delivery",
      shippingDate: data?.shippingDetails?.shippingDate || "",
      referenceNo: data?.shippingDetails?.referenceNo || "",
      transportDate: data?.shippingDetails?.transportDate || "",
      modeOfTransport: data?.shippingDetails?.modeOfTransport || "",
      transporterId: data?.shippingDetails?.transporterId || "",
      vehicleNo: data?.shippingDetails?.vehicleNo || "",
      weight: data?.shippingDetails?.weight || 0,
    },
    transactionSummary: {
      flatDiscount: data?.transactionSummary?.flatDiscount || 0,
      grossAmount: data?.transactionSummary?.grossAmount || 0,
      discountAmount: data?.transactionSummary?.discountAmount || 0,
      taxableAmount: data?.transactionSummary?.taxableAmount || 0,
      taxAmount: data?.transactionSummary?.taxAmount || 0,
      roundOff: data?.transactionSummary?.roundOff || 0,
      netAmount: data?.transactionSummary?.netAmount || 0,
    },
    isActive: data?.isActive || true,
  };


  const additionalChargeEmptyRow = { chargeId: "", amount: 0, taxId: "", taxAmount: 0, totalAmount: 0 };
  const [additionalChargeRows, setAdditionalChargeRows] = useState<any[]>(data?.additionalCharges || [additionalChargeEmptyRow]);

  // Queries
  // const { data: companyData, isLoading: isCompanyLoading } = Queries.useGetCompanyDropdown();
  // const companyOptions = GenerateOptions(companyData?.data || []);

  // const { data: customerData } = Queries.useGetContactDropdown({ typeFilter: "customer", companyFilter: initialValues?.customerId }, !!initialValues?.customerId);
  // const customers = customerData?.data || [];
  // const updatedCustomers = customers.map((c) => ({ ...c, name: c.companyName || `${c.firstName} ${c.lastName}` }));
  // const customerOptions = GenerateOptions(updatedCustomers);

  // const { data: productsData, isLoading: isProductLoading } = Queries.useGetProductDropdown({ companyFilter: values?.customerId }, !!values?.customerId);
  // const productOptions = GenerateOptions(productsData?.data || []);

  // const { data: taxData, isLoading: isTaxLoading } = Queries.useGetTaxDropdown();
  // const taxOptions = GenerateOptions(taxData?.data || []);

  // const { data: additionalChargeData, isLoading: isAdditionalChargeLoading } = Queries.useGetAdditionalChargesDropdown();
  // const additionalChargeOptions = GenerateOptions(additionalChargeData?.data || []);

  const { mutate: addEstimate, isPending: isAddLoading } = Mutations.useAddEstimate();
  const { mutate: editEstimate, isPending: isEditLoading } = Mutations.useEditEstimate();

  const isEditing = Boolean(data?._id);
  const pageMode = isEditing ? "EDIT" : "ADD";

  useEffect(() => {
    const hasAccess = isEditing ? permission.edit : permission.add;
    if (!hasAccess) navigate(-1);
  }, [isEditing, permission, navigate]);

  // const handleAdditionalChargeRowChange = (index: number, field: string, value: any) => {
  //   setAdditionalChargeRows((prev) => {
  //     const newRows = [...prev];
  //     let row = { ...newRows[index], [field]: value };

  //     if (field === "chargeId") {
  //       const charge = additionalChargeData?.data?.find((c) => c._id === value);
  //       if (charge) {
  //         row.amount = charge.defaultValue || 0;
  //         row.taxId = charge.taxId?._id || "";
  //       }
  //     }

  //     const amount = Number(row.amount) || 0;
  //     const tax = taxData?.data?.find((t) => t._id === row.taxId);
  //     const taxRate = tax?.percentage || 0;
  //     const taxAmount = (amount * taxRate) / 100;

  //     row.taxAmount = Number(taxAmount.toFixed(2));
  //     row.totalAmount = Number((amount + taxAmount).toFixed(2));

  //     newRows[index] = row;
  //     return newRows;
  //   });
  // };

  const calculateSummary = () => {
    // const itemGross = rows.reduce((s, r) => s + Number(r.qty) * Number(r.price), 0);
    // const itemDiscount = rows.reduce((s, r) => s + (Number(r.discount1) + Number(r.discount2)), 0);
    // const itemTaxable = rows.reduce((s, r) => s + Number(r.taxableAmount), 0);
    // const itemTax = rows.reduce((s, r) => s + Number(r.taxAmount), 0);
    // const chargeTaxable = additionalChargeRows.reduce((s, r) => s + (Number(r.amount) || 0), 0);
    // const chargeTax = additionalChargeRows.reduce((s, r) => s + (Number(r.taxAmount) || 0), 0);
    // const totalTaxable = itemTaxable + chargeTaxable;
    // const totalTax = itemTax + chargeTax;
    // const netBeforeRoundOff = totalTaxable + totalTax - flatDiscount;
    // const netAmount = netBeforeRoundOff + roundOffAmount;
    // return { flatDiscount, grossAmount: Number(itemGross.toFixed(2)), discountAmount: Number((itemDiscount + flatDiscount).toFixed(2)), taxableAmount: Number(totalTaxable.toFixed(2)), taxAmount: Number(totalTax.toFixed(2)), roundOff: roundOffAmount, netAmount: Number(netAmount.toFixed(2)) };
  };

  const summary = calculateSummary();

  const handleSubmit = async (values: EstimateFormValues, { resetForm }: FormikHelpers<EstimateFormValues>) => {
    const { _submitAction, ...rest } = values;
    // console.log("Submit values", values);
    const payload: any = {
      ...rest,
      // items: rows.filter((r) => r.productId).map((r) => ({ productId: r.productId, qty: r.qty, freeQty: r.freeQty, uomId: r.uomId, price: r.price, discount1: r.discount1, discount2: r.discount2, taxId: r.taxId, taxableAmount: r.taxableAmount, totalAmount: r.totalAmount })),
      additionalCharges: additionalChargeRows.filter((r) => r.chargeId).map((r) => ({ chargeId: r.chargeId, taxId: r.taxId, amount: r.amount, totalAmount: r.totalAmount })),
      // termsAndConditionIds: selectedTermIds,
      transactionSummary: summary,
    };

    const handleSuccess = () => {
      if (_submitAction === "saveAndNew") {
        resetForm();
        
        setAdditionalChargeRows([additionalChargeEmptyRow]);
      } else {
        navigate(-1);
      }
    };

    if (isEditing) {
      const changedFields = GetChangedFields(payload, data);
      await editEstimate({ ...changedFields, estimateId: data._id }, { onSuccess: handleSuccess });
    } else {
      await addEstimate(RemoveEmptyFields(payload) as EstimateFormValues, { onSuccess: handleSuccess });
    }
  };

  return (
    <>
      <CommonBreadcrumbs title={PAGE_TITLE.ESTIMATE[pageMode]} maxItems={3} breadcrumbs={BREADCRUMBS.ESTIMATE[pageMode]} />
      <Box sx={{ p: { xs: 2, md: 3 }, mb: 8, display: "grid" }}>
        <Formik<EstimateFormValues> initialValues={initialValues} onSubmit={handleSubmit} enableReinitialize={isEditing}>
          {({ values, setFieldValue, dirty, resetForm }) => (
            <Form noValidate>
              <Grid container spacing={2}>
                {/* <CompanyWatcher selectedCompanyId={selectedCompanyId} onChange={handleCompanyChange} />
                <CustomerWatcher customers={customers} onChange={setSelectedCustomer} />
                <TaxTypeWatcher onChange={(type) => setRows((prev) => prev.map((r) => calculateRow(r, type)))} /> */}

                <CommonCard title="Estimate Details" grid={{ xs: 12 }}>
                  <EstimateDetails />
                </CommonCard>

                <CommonCard hideDivider grid={{ xs: 12 }}>
                  {/* <EstimateTabs rows={rows} handleAdd={() => setRows([...rows, emptyRow])} handleCut={(i) => setRows(rows.filter((_, idx) => idx !== i))} handleRowChange={(i, f, v) => handleRowChange(i, f, v, values.taxType || "exclusive")} isProductDisabled={!values?.customerId} isTermsDisabled={!values?.customerId} selectedTermIds={selectedTermIds} onTermsChange={setSelectedTermIds} companyId={values?.customerId} /> */}
                  <EstimateTabs emptyRow={emptyRow} />
                </CommonCard>

                {/* <CommonCard hideDivider>
                  <AdditionalChargesSection show={showAdditionalCharge} onToggle={setShowAdditionalCharge} rows={additionalChargeRows} onAdd={() => setAdditionalChargeRows([...additionalChargeRows, additionalChargeEmptyRow])} onRemove={(i) => setAdditionalChargeRows(additionalChargeRows.filter((_, idx) => idx !== i))} onChange={handleAdditionalChargeRowChange} taxOptions={taxOptions} isTaxLoading={isTaxLoading} flatDiscount={flatDiscount} onFlatDiscountChange={(v) => setFlatDiscount(Number(v))} summary={summary as any} isAdditionalChargeLoading={isAdditionalChargeLoading} additionalChargeOptions={additionalChargeOptions} roundOffAmount={roundOffAmount} onRoundOffAmountChange={(v) => setRoundOffAmount(Number(v))} />
                </CommonCard> */}

                <CommonBottomActionBar save={isEditing} clear={!isEditing} disabled={!dirty} isLoading={isEditLoading || isAddLoading} onClear={() => resetForm({ values: initialValues })} onSave={() => setFieldValue("_submitAction", "save")} onSaveAndNew={() => setFieldValue("_submitAction", "saveAndNew")} />
              </Grid>
            </Form>
          )}
        </Formik>
      </Box>
    </>
  );
};

export default EstimateForm;
