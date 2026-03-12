import { Box, Grid } from "@mui/material";
import type { FormikHelpers } from "formik";
import { Form, Formik, useFormikContext } from "formik";
import { useLocation, useNavigate } from "react-router-dom";
import { Mutations, Queries } from "../../../Api";
import { CommonBottomActionBar, CommonBreadcrumbs, CommonCard, CommonSummarySection } from "../../../Components/Common";
import { PAGE_TITLE } from "../../../Constants";
import { BREADCRUMBS } from "../../../Data";
import type { AddPurchaseOrderPayload, PurchaseOrderFormValues } from "../../../Types";
import { GetChangedFields, PurchaseOrderFormSchema, RemoveEmptyFields } from "../../../Utils";
import { PurchaseOrderDetails, PurchaseOrderTabs } from "../../../Components/Purchase";
import { useEffect } from "react";

const SummaryWatcher = ({ onSummaryChange }: { onSummaryChange: (summary: any) => void }) => {
  const { values } = useFormikContext<PurchaseOrderFormValues>();
  const { data: taxData } = Queries.useGetTaxDropdown();

  const calculateSummary = () => {
    // Replicates standard logic based on items array calculations for Purchase Order
    const itemGross = values.items?.reduce((s: number, r: any) => s + Number(r.qty || 0) * Number(r.unitCost || 0), 0) || 0;
    const itemDiscount = values.items?.reduce((s: number, r: any) => s + Number(r.discount1 || 0), 0) || 0;
    const itemTaxable = values.items?.reduce((s: number, r: any) => s + Number(r.taxableAmount || 0), 0) || 0;
    const itemTax = values.items?.reduce((s: number, r: any) => s + Number(r.taxAmount || 0), 0) || 0;

    const totalTaxable = itemTaxable;
    const totalTax = itemTax;

    const flatDiscount = Number(values.summary?.flatDiscount || 0);
    const roundOffAmount = Number(values.summary?.roundOff || 0);

    const netBeforeRoundOff = totalTaxable + totalTax - flatDiscount;
    const netAmount = netBeforeRoundOff + roundOffAmount;

    // Calculate Tax Summary
    const taxMap: Record<string, { name: string; rate: number; amount: number }> = {};
    const processTax = (taxId: string | undefined, amount: number) => {
      if (!taxId || !amount) return;
      const tax = taxData?.data?.find((t: any) => t._id === taxId);
      if (!tax) return;
      if (!taxMap[taxId]) {
        taxMap[taxId] = { name: tax.name || "Tax", rate: tax.percentage || 0, amount: 0 };
      }
      taxMap[taxId].amount += amount;
    };

    values.items?.forEach((r: any) => processTax(r.taxId, Number(r.taxAmount || 0)));

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
    const currentSummary = values.summary;
    const currentTaxSummary = values.summary?.taxSummary;

    // Simplified deep compare check before bubbling changes back
    if (newSummary.grossAmount !== currentSummary?.grossAmount || newSummary.discountAmount !== currentSummary?.discountAmount || newSummary.taxableAmount !== currentSummary?.taxableAmount || newSummary.taxAmount !== currentSummary?.taxAmount || newSummary.netAmount !== currentSummary?.netAmount || JSON.stringify(newSummary.taxSummary) !== JSON.stringify(currentTaxSummary)) {
      onSummaryChange({ ...currentSummary, ...newSummary });
    }
  }, [values.items, values.summary?.flatDiscount, values.summary?.roundOff, taxData]);

  return null;
};

const PurchaseOrderForm = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { data } = location.state || {};

  const isEditing = Boolean(data?._id);

  const { mutate: addPurchaseOrder, isPending: addLoading } = Mutations.useAddPurchaseOrder();
  const { mutate: editPurchaseOrder, isPending: editLoading } = Mutations.useEditPurchaseOrder();

  const pageMode = isEditing ? "EDIT" : "ADD";
  const emptyRow = { productId: "", qty: 1, uomId: "", unit: "", unitCost: 0, taxId: "", tax: "0", landingCost: "0", margin: "0", total: 0 };

  const initialValues: PurchaseOrderFormValues = {
    companyId: data?.companyId?._id || "",

    supplierId: data?.supplierId?._id || "",
    orderDate: data?.orderDate || data?.date || "",
    shippingDate: data?.shippingDate || data?.date || data?.orderDate || "",
    shippingNote: data?.shippingNote || "",

    placeOfSupply: data?.placeOfSupply,
    billingAddress: data?.billingAddress?._id || "",
    gstIn: data?.gstIn || "",
    taxType: data?.taxType || "default",

    items: data?.items?.length ? data.items : [emptyRow],
    termsAndConditionIds: data?.termsAndConditionIds?.map((t: string | { _id: string }) => (typeof t === "string" ? t : t._id)) || [],
    notes: data?.notes || "",

    summary: {
      flatDiscount: data?.summary?.flatDiscount || 0,
      grossAmount: data?.summary?.grossAmount || 0,
      discountAmount: data?.summary?.discountAmount || 0,
      taxableAmount: data?.summary?.taxableAmount || 0,
      taxAmount: data?.summary?.taxAmount || 0,
      roundOff: data?.summary?.roundOff || 0,
      netAmount: data?.summary?.netAmount || 0,
    },

    status: ["in_progress", "delivered", "partially_delivered", "exceed", "completed", "cancelled"].includes(data?.status) ? data.status : "in_progress",
  };

  const handleSubmit = async (values: PurchaseOrderFormValues, { resetForm }: FormikHelpers<PurchaseOrderFormValues>) => {
    const { _submitAction, ...rest } = values;

    const payload = {
      ...rest,
      items: rest.items?.map((item: any) => ({
        productId: typeof item.productId === "object" ? item.productId?._id : item.productId,
        qty: Number(item.qty || 0),
        uomId: typeof item.uomId === "object" ? item.uomId?._id : item.uomId,
        unit: String(item.unit || ""),
        unitCost: Number(item.unitCost || 0),
        taxId: typeof item.taxId === "object" ? item.taxId?._id : item.taxId,
        tax: String(item.tax || 0),
        landingCost: String(item.landingCost || 0),
        margin: String(item.margin || 0),
        total: Number(item.total || 0),
      })),
      summary: rest.summary
        ? {
            flatDiscount: Number(rest.summary.flatDiscount || 0),
            grossAmount: Number(rest.summary.grossAmount || 0),
            discountAmount: Number(rest.summary.discountAmount || 0),
            taxableAmount: Number(rest.summary.taxableAmount || 0),
            taxAmount: Number(rest.summary.taxAmount || 0),
            roundOff: Number(rest.summary.roundOff || 0),
            netAmount: Number(rest.summary.netAmount || 0),
          }
        : undefined,
    };

    const handleSuccess = () => {
      if (_submitAction === "saveAndNew") resetForm();
      else navigate(-1);
    };
    if (isEditing) {
      const changedFields = GetChangedFields(payload, data);
      await editPurchaseOrder({ ...changedFields, purchaseOrderId: data._id }, { onSuccess: handleSuccess });
    } else {
      await addPurchaseOrder(RemoveEmptyFields(payload) as AddPurchaseOrderPayload, { onSuccess: handleSuccess });
    }
  };

  return (
    <>
      <CommonBreadcrumbs title={PAGE_TITLE.PURCHASE_ORDER[pageMode]} breadcrumbs={BREADCRUMBS.PURCHASE_ORDER[pageMode]} />

      <Box sx={{ p: { xs: 2, md: 3 }, mb: 14 }}>
        <Formik<PurchaseOrderFormValues> initialValues={initialValues} validationSchema={PurchaseOrderFormSchema} onSubmit={handleSubmit} enableReinitialize={isEditing} validateOnMount>
          {({ setFieldValue, dirty, isValid, resetForm }) => (
            <Form noValidate>
              <SummaryWatcher
                onSummaryChange={(newSum) => {
                  setFieldValue("summary", newSum);
                }}
              />
              <Grid container spacing={2}>
                <Box sx={{ display: "grid", gap: 2 }}>
                  <CommonCard title="Purchase Order Details" grid={{ xs: 12 }}>
                    <PurchaseOrderDetails />
                  </CommonCard>

                  <CommonCard hideDivider grid={{ xs: 12 }}>
                    <PurchaseOrderTabs emptyRow={emptyRow} />
                  </CommonCard>
                </Box>

                <CommonCard hideDivider grid={{ xs: 12 }}>
                  <CommonSummarySection name="summary" />
                </CommonCard>

                <CommonBottomActionBar save={isEditing} clear={!isEditing} disabled={!dirty || !isValid} isLoading={addLoading || editLoading} onClear={() => (isEditing ? navigate(-1) : resetForm())} onSave={() => setFieldValue("_submitAction", "save")} onSaveAndNew={() => setFieldValue("_submitAction", "saveAndNew")} />
              </Grid>
            </Form>
          )}
        </Formik>
      </Box>
    </>
  );
};

export default PurchaseOrderForm;
