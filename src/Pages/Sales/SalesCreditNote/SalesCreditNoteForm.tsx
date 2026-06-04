import { Box, Grid } from "@mui/material";
import { Form, Formik, type FormikHelpers } from "formik";
import { useEffect, useMemo } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Mutations, Queries } from "../../../Api";
import { CommonAdditionalChargeSection, CommonBottomActionBar, CommonBreadcrumbs, CommonCard, CommonSummaryWatcher } from "../../../Components/Common";
import { SalesCreditNoteDetails, SalesCreditNoteTabs } from "../../../Components/Sales";
import { PAGE_TITLE, ROUTES } from "../../../Constants";
import { BREADCRUMBS } from "../../../Data";
import type { AdditionalChargeItem, SalesCreditNoteFormValues, SalesCreditNoteItem } from "../../../Types";
import { DateConfig, GetChangedFields, RemoveEmptyFields } from "../../../Utils";
import { usePagePermission } from "../../../Utils/Hooks";
import { SalesCreditNoteFormSchema } from "../../../Utils/ValidationSchemas";

const SalesCreditNoteForm = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const permission = usePagePermission(PAGE_TITLE.SALES_CREDIT_NOTE.BASE);
  const { data: routeData } = location.state || {};

  const isEditing = Boolean(routeData?._id);
  const pageMode = isEditing ? "EDIT" : "ADD";

  const { data: singleData } = Queries.useGetSingleSalesCreditNote(routeData?._id, Boolean(routeData?._id));

  const data = useMemo(() => singleData?.data || routeData, [singleData, routeData]);

  const emptyRow: SalesCreditNoteItem = { productId: "", variantId: "", qty: 1, freeQty: 0, uomId: "", price: 0, discount1: 0, taxId: "", tax: 0, total: 0 };

  const initialValues: SalesCreditNoteFormValues = useMemo(() => {
    // Robust key mapping is restored because standard keys often differ in API responses
    const salesManIdValue = data?.salesManId;
    const reasonValue = data?.reason;

    return {
      companyId: typeof data?.companyId === "object" ? data.companyId?._id : data?.companyId || "",
      branchId: typeof data?.branchId === "object" ? data.branchId?._id : data?.branchId || "",
      creditNoteDate: data?.creditNoteDate || DateConfig.utc().toISOString(),
      dueDate: data?.dueDate || "",
      customerId: typeof data?.customerId === "object" ? data.customerId?._id : data?.customerId || "",
      placeOfSupply: data?.placeOfSupply || "",
      billingAddress: typeof data?.billingAddress === "object" ? data.billingAddress?._id : data?.billingAddress || "",
      shippingAddress: typeof data?.shippingAddress === "object" ? data.shippingAddress?._id : data?.shippingAddress || "",
      productType: data?.productType || "all",
      // String value is required for the Select component to show selected option
      reverseCharge: data?.reverseCharge !== undefined ? String(data.reverseCharge) : "false",
      reason: reasonValue,
      sez: data?.sez || "",
      paymentReminder: data?.paymentReminder || false,
      salesManId: typeof salesManIdValue === "object" ? salesManIdValue?._id : salesManIdValue || "",
      salesId: typeof data?.salesId === "object" ? data.salesId?._id : data?.salesId || "",
      termsAndConditionIds: data?.termsAndConditionIds?.map((t: string | { _id: string }) => (typeof t === "string" ? t : t._id)) || [],
      productDetails: data?.productDetails?.length
        ? data.productDetails.map((i: SalesCreditNoteItem) => ({
            ...emptyRow,
            ...i,
            productId: i?.variantId ? i.variantId : typeof i.productId === "object" ? i.productId._id : i.productId,
            variantId: i?.variantId ? (typeof i.productId === "object" ? i.productId._id : i.productId) : null,
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
      summary: {
        flatDiscount: data?.summary?.flatDiscount || 0,
        grossAmount: data?.summary?.grossAmount || 0,
        discountAmount: data?.summary?.discountAmount || 0,
        taxableAmount: data?.summary?.taxableAmount || 0,
        taxAmount: data?.summary?.taxAmount || 0,
        roundOff: data?.summary?.roundOff || 0,
        netAmount: data?.summary?.netAmount || 0,
      },
      status: data?.status || "open",
      notes: data?.notes || "",
    };
  }, [data]);

  const { mutate: addSalesCreditNote, isPending: isAddLoading } = Mutations.useAddSalesCreditNote();
  const { mutate: editSalesCreditNote, isPending: isEditLoading } = Mutations.useEditSalesCreditNote();

  useEffect(() => {
    const hasAccess = isEditing ? permission.edit : permission.add;
    if (!hasAccess) navigate(-1);
  }, [isEditing, permission, navigate]);

  const getCalculatedSummary = (values: SalesCreditNoteFormValues) => {
    const itemGross = values.productDetails?.reduce((s: number, r: SalesCreditNoteItem) => s + (Number(r.qty) || 0) * (Number(r.price) || 0), 0) || 0;
    const itemDiscount = values.productDetails?.reduce((s: number, r: SalesCreditNoteItem) => s + (Number(r.discount1) || 0), 0) || 0;

    // items taxable = items total - items tax
    const itemTax = values.productDetails?.reduce((s: number, r: SalesCreditNoteItem) => s + (Number(r.tax) || 0), 0) || 0;
    const itemTotal = values.productDetails?.reduce((s: number, r: SalesCreditNoteItem) => s + (Number(r.total) || 0), 0) || 0;
    const itemTaxable = itemTotal - itemTax;

    const isReverseCharge = String(values.reverseCharge) === "true";
    const chargeTaxable = values.additionalCharges?.reduce((s: number, r: AdditionalChargeItem) => s + (Number(r.amount) || 0), 0) || 0;
    const chargeTax = isReverseCharge ? 0 : values.additionalCharges?.reduce((s: number, r: AdditionalChargeItem) => s + ((Number(r.totalAmount) || 0) - (Number(r.amount) || 0)), 0) || 0;

    const totalTaxable = itemTaxable + chargeTaxable;
    const totalTax = itemTax + chargeTax;

    const flatDiscount = Number(values.summary?.flatDiscount || 0);
    const roundOffAmount = Number(values.summary?.roundOff || 0);

    const netBeforeRoundOff = totalTaxable + totalTax - flatDiscount;
    const netAmount = netBeforeRoundOff + roundOffAmount;

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

  const handleSubmit = async (values: SalesCreditNoteFormValues, { resetForm }: FormikHelpers<SalesCreditNoteFormValues>) => {
    const { _submitAction, ...rest } = values;
    const summary = getCalculatedSummary(values);

    const payload: SalesCreditNoteFormValues = {
      ...rest,
      // Convert reverseCharge to boolean for the API
      reverseCharge: String(values.reverseCharge) === "true",
      productDetails: values.productDetails
        ?.filter((i: SalesCreditNoteItem) => i.productId)
        .map((i: SalesCreditNoteItem) => ({
          productId: i?.variantId ? i.variantId : typeof i.productId === "object" ? i.productId._id : i.productId,
          variantId: i?.variantId ? (typeof i.productId === "object" ? i.productId._id : i.productId) : null,
          qty: Number(i.qty || 0),
          freeQty: Number(i.freeQty || 0),
          price: Number(i.price || 0),
          discount1: Number(i.discount1 || 0),
          tax: Number(i.tax || 0),
          total: Number(i.total || 0),
          uomId: typeof i.uomId === "object" ? i.uomId?._id : i.uomId,
          taxId: typeof i.taxId === "object" ? i.taxId?._id : i.taxId,
          unit: i.unit,
        })),
      additionalCharges: values.additionalCharges
        ?.filter((r: AdditionalChargeItem) => r.chargeId)
        .map((r: AdditionalChargeItem) => ({
          chargeId: typeof r.chargeId === "object" ? r.chargeId?._id : r.chargeId,
          taxId: typeof r.taxId === "object" ? r.taxId?._id : r.taxId,
          amount: Number(r.amount || 0),
          totalAmount: Number(r.totalAmount || 0),
        })),
      summary: summary,
    };

    const handleSuccess = () => {
      if (_submitAction === "saveAndNew") {
        resetForm();
      } else {
        navigate(ROUTES.SALES_CREDIT_NOTE.BASE);
      }
    };

    if (isEditing) {
      const changedFields = GetChangedFields(payload, data);
      await editSalesCreditNote({ ...changedFields, salesCreditNoteId: data._id }, { onSuccess: handleSuccess });
    } else {
      await addSalesCreditNote(RemoveEmptyFields(payload) as SalesCreditNoteFormValues, { onSuccess: handleSuccess });
    }
  };

  return (
    <>
      <CommonBreadcrumbs title={PAGE_TITLE.SALES_CREDIT_NOTE[pageMode]} maxItems={3} breadcrumbs={BREADCRUMBS.SALES_CREDIT_NOTE[pageMode]} />
      <Box sx={{ p: { xs: 2, md: 3 }, mb: 8 }}>
        <Formik<SalesCreditNoteFormValues> initialValues={initialValues} validationSchema={SalesCreditNoteFormSchema} onSubmit={handleSubmit} enableReinitialize validateOnMount>
          {({ setFieldValue, dirty, resetForm }) => (
            <Form noValidate>
              <CommonSummaryWatcher summaryKey="summary" itemsKey="productDetails" priceKey="price" taxAmountKey="tax" hasAdditionalCharges />
              <Grid container spacing={2}>
                <Box sx={{ display: "grid", gap: 2, width: "100%" }}>
                  <CommonCard title="Sales Credit Note Details" grid={{ xs: 12 }}>
                    <SalesCreditNoteDetails isEditing={isEditing} />
                  </CommonCard>

                  <CommonCard hideDivider grid={{ xs: 12 }}>
                    <SalesCreditNoteTabs emptyRow={emptyRow} isEditing={isEditing} />
                  </CommonCard>

                  <CommonCard grid={{ xs: 12 }} hideDivider>
                    <CommonAdditionalChargeSection summaryName="summary" />
                  </CommonCard>
                </Box>

                <CommonBottomActionBar save={isEditing} clear={!isEditing} disabled={!dirty} isLoading={isEditLoading || isAddLoading} onClear={() => (isEditing ? navigate(-1) : resetForm({ values: initialValues }))} onSave={() => setFieldValue("_submitAction", "save")} onSaveAndNew={() => setFieldValue("_submitAction", "saveAndNew")} />
              </Grid>
            </Form>
          )}
        </Formik>
      </Box>
    </>
  );
};

export default SalesCreditNoteForm;
