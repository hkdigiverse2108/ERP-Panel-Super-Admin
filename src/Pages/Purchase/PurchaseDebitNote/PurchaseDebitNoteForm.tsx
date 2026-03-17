import { Box, Grid, CircularProgress } from "@mui/material";
import { Form, Formik, type FormikHelpers } from "formik";
import { useEffect, useMemo } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Mutations, Queries } from "../../../Api";
import { CommonBottomActionBar, CommonBreadcrumbs, CommonCard, CommonSummaryWatcher, CommonAdditionalChargeSection } from "../../../Components/Common";
import { PAGE_TITLE, ROUTES } from "../../../Constants";
import { BREADCRUMBS } from "../../../Data";
import type { PurchaseDebitNoteFormValues, PurchaseDebitNoteProductItem } from "../../../Types";
import { DateConfig, GetChangedFields, RemoveEmptyFields } from "../../../Utils";
import { usePagePermission } from "../../../Utils/Hooks";
import { PurchaseDebitNoteFormSchema } from "../../../Utils/ValidationSchemas";
import { PurchaseDebitNoteDetails, PurchaseDebitNoteTabs } from "../../../Components/Purchase/PurchaseDebitNote";

const PurchaseDebitNoteForm = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const permission = usePagePermission(PAGE_TITLE.PURCHASE_DEBIT_NOTE.BASE);
  const { data: routeData } = location.state || {};

  const isEditing = Boolean(routeData?._id);
  const pageMode = isEditing ? "EDIT" : "ADD";

  const { data: singleData, isLoading: isSingleLoading } = Queries.useGetSinglePurchaseDebitNote(routeData?._id);
  const data = useMemo(() => singleData?.data || routeData, [singleData, routeData]);

  const emptyRow: PurchaseDebitNoteProductItem = { productId: "", qty: 1, unitCost: 0, discount1: 0, taxId: "", tax: 0, total: 0 };

  const initialValues: PurchaseDebitNoteFormValues = useMemo(() => {
    return {
      companyId: typeof data?.companyId === "object" ? data.companyId?._id : data?.companyId || "",
      supplierId: typeof data?.supplierId === "object" ? data.supplierId?._id : data?.supplierId || "",
      purchaseId: typeof data?.purchaseId === "object" ? data.purchaseId?._id : data?.purchaseId || "",
      debitNoteDate: data?.debitNoteDate || DateConfig.utc().toISOString(),
      dueDate: data?.dueDate || "",
      shippingDate: data?.shippingDate || "",
      referenceBillNo: data?.referenceBillNo || "",
      placeOfSupply: data?.placeOfSupply || "",
      paymentTerm: data?.paymentTerm || "",
      billingAddress: typeof data?.billingAddress === "object" ? data.billingAddress?._id : data?.billingAddress || "",
      shippingAddress: typeof data?.shippingAddress === "object" ? data.shippingAddress?._id : data?.shippingAddress || "",
      // @ts-ignore
      reverseCharge: data?.reverseCharge !== undefined ? String(data.reverseCharge) : "false",
      reason: data?.reason || "",
      exportSez: data?.exportSez || "",
      productDetails: Array.isArray(data?.productDetails)
        ? data.productDetails.map((i: any) => ({
            ...emptyRow,
            ...i,
            productId: typeof i.productId === "object" ? i.productId?._id : i.productId,
            uomId: typeof i.uomId === "object" ? i.uomId?._id : i.uomId,
            taxId: typeof i.taxId === "object" ? i.taxId?._id : i.taxId,
          }))
        : data?.productDetails?.items?.length
        ? data.productDetails.items.map((i: any) => ({
            ...emptyRow,
            ...i,
            productId: typeof i.productId === "object" ? i.productId?._id : i.productId,
            uomId: typeof i.uomId === "object" ? i.uomId?._id : i.uomId,
            taxId: typeof i.taxId === "object" ? i.taxId?._id : i.taxId,
          }))
        : [emptyRow],
      additionalCharges: Array.isArray(data?.additionalCharges)
        ? data.additionalCharges.map((r: any) => ({
            ...r,
            chargeId: typeof r.chargeId === "object" ? r.chargeId?._id : r.chargeId,
            taxId: typeof r.taxId === "object" ? r.taxId?._id : r.taxId,
          }))
        : data?.additionalCharges?.items?.length
        ? data.additionalCharges.items.map((r: any) => ({
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
      notes: data?.notes || "",
      status: data?.status || "open",
      termsAndConditionIds: data?.termsAndConditionIds?.map((t: any) => (typeof t === "string" ? t : t._id)) || [],
    };
  }, [data]);

  const { mutate: addPurchaseDebitNote, isPending: isAddLoading } = Mutations.useAddPurchaseDebitNote();
  const { mutate: editPurchaseDebitNote, isPending: isEditLoading } = Mutations.useEditPurchaseDebitNote();

  useEffect(() => {
    const hasAccess = isEditing ? permission.edit : permission.add;
    if (!hasAccess) navigate(-1);
  }, [isEditing, permission, navigate]);

  const handleSubmit = async (values: PurchaseDebitNoteFormValues, { resetForm }: FormikHelpers<PurchaseDebitNoteFormValues>) => {
    const { _submitAction, ...rest } = values;

    const payload: any = {
      ...rest,
      // @ts-ignore
      reverseCharge: String(values.reverseCharge) === "true",
      productDetails: rest.productDetails?.filter((i: any) => i.productId).map((i: any) => ({
        productId: typeof i.productId === "object" ? i.productId?._id : i.productId,
        qty: Number(i.qty || 0),
        unit: i.unit,
        uomId: i.uomId,
        unitCost: Number(i.unitCost || 0),
        mrp: Number(i.mrp || 0),
        sellingPrice: Number(i.sellingPrice || 0),
        discount1: Number(i.discount1 || 0),
        tax: Number(i.tax || 0),
        taxId: i.taxId,
        landingCost: Number(i.landingCost || 0),
        margin: Number(i.margin || 0),
        total: Number(i.total || 0),
      })),
      additionalCharges: rest.additionalCharges?.filter((r: any) => r.chargeId).map((r: any) => ({
        chargeId: typeof r.chargeId === "object" ? r.chargeId?._id : r.chargeId,
        taxId: typeof r.taxId === "object" ? r.taxId?._id : r.taxId,
        amount: Number(r.amount || 0),
        totalAmount: Number(r.totalAmount || 0),
      })) || [],
      summary: {
        flatDiscount: Number(rest.summary?.flatDiscount || 0),
        grossAmount: Number(rest.summary?.grossAmount || 0),
        discountAmount: Number(rest.summary?.discountAmount || 0),
        taxableAmount: Number(rest.summary?.taxableAmount || 0),
        taxAmount: Number(rest.summary?.taxAmount || 0),
        roundOff: Number(rest.summary?.roundOff || 0),
        netAmount: Number(rest.summary?.netAmount || 0),
      }
    };

    const handleSuccess = () => {
      if (_submitAction === "saveAndNew") resetForm({ values: initialValues });
      else navigate(ROUTES.PURCHASE_DEBIT_NOTE.BASE);
    };

    if (isEditing) {
      const changedFields = GetChangedFields(payload, data);
      await editPurchaseDebitNote({ ...changedFields, purchaseDebitNoteId: data._id }, { onSuccess: handleSuccess });
    } else {
      await addPurchaseDebitNote(RemoveEmptyFields(payload) as any, { onSuccess: handleSuccess });
    }
  };

  if (isSingleLoading) return <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100%" }}><CircularProgress /></Box>;

  return (
    <>
      <CommonBreadcrumbs title={PAGE_TITLE.PURCHASE_DEBIT_NOTE[pageMode]} breadcrumbs={BREADCRUMBS.PURCHASE_DEBIT_NOTE[pageMode]} />
      <Box sx={{ p: { xs: 2, md: 3 }, mb: 8 }}>
        <Formik<PurchaseDebitNoteFormValues> initialValues={initialValues} validationSchema={PurchaseDebitNoteFormSchema} onSubmit={handleSubmit} enableReinitialize validateOnMount>
          {({ setFieldValue, dirty, isValid, resetForm }) => (
            <Form noValidate>
              <CommonSummaryWatcher summaryKey="summary" itemsKey="productDetails" priceKey="unitCost" taxAmountKey="tax" hasAdditionalCharges />
              <Grid container spacing={2}>
                <Box sx={{ display: "grid", gap: 2, width: "100%" }}>
                  <CommonCard title="Purchase Debit Note Details" grid={{ xs: 12 }}>
                    <PurchaseDebitNoteDetails />
                  </CommonCard>

                  <CommonCard hideDivider grid={{ xs: 12 }}>
                    <PurchaseDebitNoteTabs emptyRow={emptyRow} />
                  </CommonCard>

                  <CommonCard grid={{ xs: 12 }} hideDivider>
                    <CommonAdditionalChargeSection summaryName="summary" />
                  </CommonCard>
                </Box>

                <CommonBottomActionBar save={isEditing} clear={!isEditing} disabled={!dirty || !isValid} isLoading={isEditLoading || isAddLoading} onClear={() => (isEditing ? navigate(-1) : resetForm({ values: initialValues }))} onSave={() => setFieldValue("_submitAction", "save")} onSaveAndNew={() => setFieldValue("_submitAction", "saveAndNew")} />
              </Grid>
            </Form>
          )}
        </Formik>
      </Box>
    </>
  );
};

export default PurchaseDebitNoteForm;
