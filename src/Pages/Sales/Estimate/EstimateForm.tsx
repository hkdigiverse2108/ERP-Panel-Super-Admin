import { Box, Grid } from "@mui/material";
import { Form, Formik, type FormikHelpers } from "formik";
import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Mutations } from "../../../Api";
import { CommonBottomActionBar, CommonBreadcrumbs, CommonCard, CommonSummaryWatcher } from "../../../Components/Common";
import { PAGE_TITLE, ROUTES } from "../../../Constants";
import { BREADCRUMBS } from "../../../Data";
import type { AddEstimatePayload, AdditionalChargeItem, EstimateFormValues, EstimateItem, TaxBase, TaxDropdownApiResponse } from "../../../Types";
import { DateConfig, GetChangedFields, RemoveEmptyFields } from "../../../Utils";
import { usePagePermission } from "../../../Utils/Hooks";
import { EstimateFormSchema } from "../../../Utils/ValidationSchemas";
import { EstimateDetails, EstimateTabs } from "../../../Components/Sales";
import CommonAdditionalChargeSection from "../../../Components/Common/CommonAdditionalChargeSection";

import { Queries } from "../../../Api";

const EstimateForm = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const permission = usePagePermission(PAGE_TITLE.ESTIMATE.BASE);
  const { data } = location.state || {};

  const emptyRow = { productId: "", qty: 1, freeQty: 0, uomId: "", price: 0, discount1: 0, taxId: "", taxableAmount: 0, totalAmount: 0 };

  const initialValues: EstimateFormValues = {
    companyId: typeof data?.companyId === "object" ? data.companyId?._id : data?.companyId || "",
    branchId: typeof data?.branchId === "object" ? data.branchId?._id : data?.branchId || "",
    date: data?.date || DateConfig.utc().toISOString(),
    dueDate: data?.dueDate || "",
    customerId: typeof data?.customerId === "object" ? data.customerId?._id : data?.customerId || "",
    placeOfSupply: data?.placeOfSupply || "",
    billingAddress: typeof data?.billingAddress === "object" ? data.billingAddress?._id : data?.billingAddress || "",
    shippingAddress: typeof data?.shippingAddress === "object" ? data.shippingAddress?._id : data?.shippingAddress || "",
    paymentTermsId: typeof data?.paymentTermsId === "object" ? data.paymentTermsId?._id : data?.paymentTermsId || "",
    taxType: data?.taxType || "default",
    reverseCharge: data?.reverseCharge !== undefined ? String(data.reverseCharge) : "false",
    termsAndConditionIds: data?.termsAndConditionIds?.map((t: string | { _id: string }) => (typeof t === "string" ? t : t._id)) || [],
    items: data?.items?.length
      ? data.items.map((i: EstimateItem) => ({
          ...emptyRow,
          ...i,
          productId: typeof i.productId === "object" ? i.productId?._id : i.productId,
          uomId: typeof i.uomId === "object" ? i.uomId?._id : i.uomId,
          taxId: typeof i.taxId === "object" ? i.taxId?._id : i.taxId,
        }))
      : [emptyRow],
    additionalCharges: data?.additionalCharges?.length
      ? data.additionalCharges.map((r: AdditionalChargeItem) => ({
          ...r,
          chargeId: typeof r.chargeId === "object" ? r.chargeId?._id : r.chargeId,
          taxId: typeof r.taxId === "object" ? r.taxId?._id : r.taxId,
        }))
      : [],
    shippingDetails: {
      shippingType: data?.shippingDetails?.shippingType || "delivery",
      shippingDate: data?.shippingDetails?.shippingDate || "",
      referenceNo: data?.shippingDetails?.referenceNo || "",
      transportDate: data?.shippingDetails?.transportDate || "",
      modeOfTransport: data?.shippingDetails?.modeOfTransport || "",
      transporterId: typeof data?.shippingDetails?.transporterId === "object" ? data.shippingDetails.transporterId?._id : data?.shippingDetails?.transporterId || "",
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
    notes: data?.notes || "",
  };

  const { mutate: addEstimate, isPending: isAddLoading } = Mutations.useAddEstimate();
  const { mutate: editEstimate, isPending: isEditLoading } = Mutations.useEditEstimate();

  const isEditing = Boolean(data?._id);
  const pageMode = isEditing ? "EDIT" : "ADD";

  useEffect(() => {
    const hasAccess = isEditing ? permission.edit : permission.add;
    if (!hasAccess) navigate(-1);
  }, [isEditing, permission, navigate]);

  const getCalculatedSummary = (values: EstimateFormValues, taxData: TaxDropdownApiResponse | undefined) => {
    const itemGross = values.items?.reduce((s: number, r: EstimateItem) => s + Number(r.qty || 0) * Number(r.price || 0), 0) || 0;
    const itemDiscount = values.items?.reduce((s: number, r: EstimateItem) => s + Number(r.discount1 || 0), 0) || 0;
    const itemTaxable = values.items?.reduce((s: number, r: EstimateItem) => s + Number(r.taxableAmount || 0), 0) || 0;
    const itemTax = values.items?.reduce((s: number, r: EstimateItem) => s + Number(r.totalAmount || 0) - Number(r.taxableAmount || 0), 0) || 0;

    const isReverseCharge = String(values.reverseCharge) === "true";
    const chargeTaxable = isReverseCharge ? 0 : values.additionalCharges?.reduce((s: number, r: AdditionalChargeItem) => s + Number(r.amount || 0), 0) || 0;
    const chargeTax = isReverseCharge ? 0 : values.additionalCharges?.reduce((s: number, r: AdditionalChargeItem) => s + (Number(r.totalAmount || 0) - Number(r.amount || 0)), 0) || 0;

    const totalTaxable = itemTaxable + chargeTaxable;
    const totalTax = itemTax + chargeTax;

    const flatDiscount = Number(values.transactionSummary?.flatDiscount || 0);
    const roundOffAmount = Number(values.transactionSummary?.roundOff || 0);

    const netBeforeRoundOff = totalTaxable + totalTax - flatDiscount;
    const netAmount = netBeforeRoundOff + roundOffAmount;

    // Calculate Tax Summary
    const taxMap: Record<string, { name: string; rate: number; amount: number }> = {};
    const processTax = (taxId: string | TaxBase | undefined, amount: number) => {
      if (!taxId) return;
      const id = typeof taxId === "object" ? taxId._id : taxId;
      const tax = taxData?.data?.find((t: TaxBase) => t._id === id);
      if (!tax) return;
      if (!taxMap[id]) {
        taxMap[id] = { name: tax.name || "Tax", rate: tax.percentage || 0, amount: 0 };
      }
      taxMap[id].amount += amount;
    };

    values.items?.forEach((r: EstimateItem) => processTax(r.taxId, Number(r.totalAmount || 0) - Number(r.taxableAmount || 0)));
    if (!isReverseCharge) {
      values.additionalCharges?.forEach((r: AdditionalChargeItem) => processTax(r.taxId, Number(r.totalAmount || 0) - Number(r.amount || 0)));
    }

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
    const payload: AddEstimatePayload = {
      ...rest,
      items: values.items
        ?.filter((i: EstimateItem) => i.productId)
        .map((i: EstimateItem) => ({
          ...i,
          qty: Number(i.qty || 0),
          freeQty: Number(i.freeQty || 0),
          price: Number(i.price || 0),
          discount1: Number(i.discount1 || 0),
          taxableAmount: Number(i.taxableAmount || 0),
          tax: Number(i.tax || 0),
          totalAmount: Number(i.totalAmount || 0),
        })),
      additionalCharges: values.additionalCharges?.filter((r) => r.chargeId).map((r) => ({ chargeId: r.chargeId, taxId: r.taxId, amount: Number(r.amount), totalAmount: Number(r.totalAmount) })),
      transactionSummary: getCalculatedSummary(values, taxData),
    };

    const handleSuccess = () => {
      if (_submitAction === "saveAndNew") {
        resetForm();
      } else {
        navigate(ROUTES.ESTIMATE.BASE);
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
      <Box sx={{ p: { xs: 2, md: 3 }, mb: 8 }}>
        <Formik<EstimateFormValues> initialValues={initialValues} validationSchema={EstimateFormSchema} onSubmit={handleSubmit} enableReinitialize={isEditing} validateOnMount>
          {({ setFieldValue, dirty, resetForm }) => (
            <Form noValidate>
              <CommonSummaryWatcher summaryKey="transactionSummary" priceKey="price" hasAdditionalCharges />
              <Grid container spacing={2}>
                <Box sx={{ display: "grid", gap: 2, width: "100%" }}>
                  <CommonCard title="Estimate Details" grid={{ xs: 12 }}>
                    <EstimateDetails />
                  </CommonCard>

                  <CommonCard hideDivider grid={{ xs: 12 }}>
                    <EstimateTabs emptyRow={emptyRow} />
                  </CommonCard>

                  <CommonCard grid={{ xs: 12 }} hideDivider>
                    <CommonAdditionalChargeSection />
                  </CommonCard>
                </Box>

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
