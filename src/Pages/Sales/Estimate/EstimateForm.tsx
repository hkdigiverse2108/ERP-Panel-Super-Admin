import { Box, Grid } from "@mui/material";
import { Form, Formik, type FormikHelpers, useFormikContext } from "formik";
import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Mutations } from "../../../Api";
import { CommonBottomActionBar, CommonBreadcrumbs, CommonCard } from "../../../Components/Common";
import { PAGE_TITLE } from "../../../Constants";
import { BREADCRUMBS } from "../../../Data";
import type { EstimateFormValues } from "../../../Types";
import { DateConfig, GetChangedFields, RemoveEmptyFields } from "../../../Utils";
import { usePagePermission } from "../../../Utils/Hooks";
import { EstimateFormSchema } from "../../../Utils/ValidationSchemas";
import EstimateDetails from "../../../Components/Sales/Estimate/EstimateDetails/EstimateDetails";
import EstimateTabs from "../../../Components/Sales/Estimate/EstimateDetails/EstimateTabs";
import CommonAdditionalChargeSection from "../../../Components/Common/CommonAdditionalChargeSection";

import { Queries } from "../../../Api";

const SummaryWatcher = ({ onSummaryChange }: { onSummaryChange: (summary: any) => void }) => {
  const { values } = useFormikContext<EstimateFormValues>();
  const { data: taxData } = Queries.useGetTaxDropdown();

  const calculateSummary = () => {
    const itemGross = values.items?.reduce((s: number, r: any) => s + Number(r.qty || 0) * Number(r.price || 0), 0) || 0;
    const itemDiscount = values.items?.reduce((s: number, r: any) => s + Number(r.discount1 || 0), 0) || 0;
    const itemTaxable = values.items?.reduce((s: number, r: any) => s + Number(r.taxableAmount || 0), 0) || 0;
    const itemTax = values.items?.reduce((s: number, r: any) => s + Number(r.totalAmount || 0) - Number(r.taxableAmount || 0), 0) || 0;

    const chargeTaxable = values.additionalCharges?.reduce((s: number, r: any) => s + Number(r.amount || 0), 0) || 0;
    const chargeTax = values.additionalCharges?.reduce((s: number, r: any) => s + (Number(r.totalAmount || 0) - Number(r.amount || 0)), 0) || 0;

    const totalTaxable = itemTaxable + chargeTaxable;
    const totalTax = itemTax + chargeTax;

    const flatDiscount = Number(values.transactionSummary?.flatDiscount || 0);
    const roundOffAmount = Number(values.transactionSummary?.roundOff || 0);

    const netBeforeRoundOff = totalTaxable + totalTax - flatDiscount;
    const netAmount = netBeforeRoundOff + roundOffAmount;

    // Calculate Tax Summary
    const taxMap: Record<string, { name: string; rate: number; amount: number }> = {};
    const processTax = (taxId: string | undefined, amount: number) => {
      if (!taxId) return;
      const tax = taxData?.data?.find((t: any) => t._id === taxId);
      if (!tax) return;
      if (!taxMap[taxId]) {
        taxMap[taxId] = { name: tax.name || "Tax", rate: tax.percentage || 0, amount: 0 };
      }
      taxMap[taxId].amount += amount;
    };

    values.items?.forEach((r: any) => processTax(r.taxId, Number(r.totalAmount || 0) - Number(r.taxableAmount || 0)));
    values.additionalCharges?.forEach((r: any) => processTax(r.taxId, Number(r.totalAmount || 0) - Number(r.amount || 0)));

    return {
      flatDiscount,
      grossAmount: Number(itemGross.toFixed(2)),
      discountAmount: Number((itemDiscount + flatDiscount).toFixed(2)),
      taxableAmount: Number(totalTaxable.toFixed(2)),
      taxAmount: Number(totalTax.toFixed(2)),
      roundOff: Number(roundOffAmount.toFixed(2)),
      netAmount: Number(netAmount.toFixed(2)),
      taxSummary: Object.values(taxMap).map((t) => ({ ...t, amount: Number(t.amount.toFixed(2)) })),
    };
  };

  useEffect(() => {
    const newSummary = calculateSummary();
    const currentSummary = values.transactionSummary;

    // Deep comparison to prevent infinite loop
    if (JSON.stringify(newSummary) !== JSON.stringify(currentSummary)) {
      onSummaryChange(newSummary);
    }
  }, [values.items, values.additionalCharges, values.transactionSummary?.flatDiscount, values.transactionSummary?.roundOff, taxData]);

  return null;
};

const EstimateForm = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const permission = usePagePermission(PAGE_TITLE.ESTIMATE.BASE);
  const { data } = location.state || {};

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
    taxType: data?.taxType || "default",
    reverseCharge: data?.reverseCharge || false,
    termsAndConditionIds: data?.termsAndConditionIds?.map((t: string | { _id: string }) => (typeof t === "string" ? t : t._id)) || [],
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
  };

  const { mutate: addEstimate, isPending: isAddLoading } = Mutations.useAddEstimate();
  const { mutate: editEstimate, isPending: isEditLoading } = Mutations.useEditEstimate();

  const isEditing = Boolean(data?._id);
  const pageMode = isEditing ? "EDIT" : "ADD";

  useEffect(() => {
    const hasAccess = isEditing ? permission.edit : permission.add;
    if (!hasAccess) navigate(-1);
  }, [isEditing, permission, navigate]);

  const getCalculatedSummary = (values: EstimateFormValues, taxData: any) => {
    const itemGross = values.items?.reduce((s: number, r: any) => s + Number(r.qty || 0) * Number(r.price || 0), 0) || 0;
    const itemDiscount = values.items?.reduce((s: number, r: any) => s + Number(r.discount1 || 0), 0) || 0;
    const itemTaxable = values.items?.reduce((s: number, r: any) => s + Number(r.taxableAmount || 0), 0) || 0;
    const itemTax = values.items?.reduce((s: number, r: any) => s + Number(r.totalAmount || 0) - Number(r.taxableAmount || 0), 0) || 0;

    const chargeTaxable = values.additionalCharges?.reduce((s: number, r: any) => s + Number(r.amount || 0), 0) || 0;
    const chargeTax = values.additionalCharges?.reduce((s: number, r: any) => s + (Number(r.totalAmount || 0) - Number(r.amount || 0)), 0) || 0;

    const totalTaxable = itemTaxable + chargeTaxable;
    const totalTax = itemTax + chargeTax;

    const flatDiscount = Number(values.transactionSummary?.flatDiscount || 0);
    const roundOffAmount = Number(values.transactionSummary?.roundOff || 0);

    const netBeforeRoundOff = totalTaxable + totalTax - flatDiscount;
    const netAmount = netBeforeRoundOff + roundOffAmount;

    // Calculate Tax Summary
    const taxMap: Record<string, { name: string; rate: number; amount: number }> = {};
    const processTax = (taxId: string | undefined, amount: number) => {
      if (!taxId) return;
      const tax = taxData?.data?.find((t: any) => t._id === taxId);
      if (!tax) return;
      if (!taxMap[taxId]) {
        taxMap[taxId] = { name: tax.name || "Tax", rate: tax.percentage || 0, amount: 0 };
      }
      taxMap[taxId].amount += amount;
    };

    values.items?.forEach((r: any) => processTax(r.taxId, Number(r.totalAmount || 0) - Number(r.taxableAmount || 0)));
    values.additionalCharges?.forEach((r: any) => processTax(r.taxId, Number(r.totalAmount || 0) - Number(r.amount || 0)));

    return {
      flatDiscount,
      grossAmount: Number(itemGross.toFixed(2)),
      discountAmount: Number((itemDiscount + flatDiscount).toFixed(2)),
      taxableAmount: Number(totalTaxable.toFixed(2)),
      taxAmount: Number(totalTax.toFixed(2)),
      roundOff: Number(roundOffAmount.toFixed(2)),
      netAmount: Number(netAmount.toFixed(2)),
    };
  };

  const { data: taxData } = Queries.useGetTaxDropdown();

  const handleSubmit = async (values: EstimateFormValues, { resetForm }: FormikHelpers<EstimateFormValues>) => {
    const { _submitAction, ...rest } = values;
    const payload: any = {
      ...rest,
      additionalCharges: values.additionalCharges?.filter((r) => r.chargeId).map((r) => ({ chargeId: r.chargeId, taxId: r.taxId, amount: Number(r.amount), totalAmount: Number(r.totalAmount) })),
      transactionSummary: getCalculatedSummary(values, taxData),
    };

    const handleSuccess = () => {
      if (_submitAction === "saveAndNew") {
        resetForm();
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
        <Formik<EstimateFormValues> initialValues={initialValues} validationSchema={EstimateFormSchema} onSubmit={handleSubmit} enableReinitialize={isEditing} validateOnMount>
          {({ setFieldValue, dirty, isValid, resetForm }) => (
            <Form noValidate>
              <SummaryWatcher onSummaryChange={(summary) => setFieldValue("transactionSummary", summary)} />
              <Grid container spacing={2}>
                <CommonCard title="Estimate Details" grid={{ xs: 12 }}>
                  <EstimateDetails />
                </CommonCard>

                <CommonCard hideDivider grid={{ xs: 12 }}>
                  <EstimateTabs emptyRow={emptyRow} />
                </CommonCard>

                <CommonCard grid={{ xs: 12 }} hideDivider>
                  <CommonAdditionalChargeSection />
                </CommonCard>

                <CommonBottomActionBar save={isEditing} clear={!isEditing} disabled={!dirty || !isValid} isLoading={isEditLoading || isAddLoading} onClear={() => resetForm({ values: initialValues })} onSave={() => setFieldValue("_submitAction", "save")} onSaveAndNew={() => setFieldValue("_submitAction", "saveAndNew")} />
              </Grid>
            </Form>
          )}
        </Formik>
      </Box>
    </>
  );
};

export default EstimateForm;
