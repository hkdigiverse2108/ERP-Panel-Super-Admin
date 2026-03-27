import { Box, Grid } from "@mui/material";
import { Form, Formik, type FormikHelpers } from "formik";
import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Mutations } from "../../../Api";
import { CommonBottomActionBar, CommonBreadcrumbs, CommonCard, CommonSummaryWatcher } from "../../../Components/Common";
import { PAGE_TITLE, ROUTES } from "../../../Constants";
import { BREADCRUMBS } from "../../../Data";
import type {  AdditionalChargeItem, DeliveryChallanBase, InvoiceFormValues, InvoiceItem, SalesOrderBase, ShippingDetails } from "../../../Types";
import { DateConfig, GetChangedFields, RemoveEmptyFields } from "../../../Utils";
import { usePagePermission } from "../../../Utils/Hooks";
import { InvoiceFormSchema } from "../../../Utils/ValidationSchemas";
import { InvoiceDetails, InvoiceTabs } from "../../../Components/Sales";
import CommonAdditionalChargeSection from "../../../Components/Common/CommonAdditionalChargeSection";

const InvoiceForm = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const permission = usePagePermission(PAGE_TITLE.INVOICE.BASE);
  const { data } = location.state || {};

  const emptyRow: InvoiceItem = { 
    productId: "", 
    qty: 1, 
    freeQty: 0, 
    mrp: 0, 
    price: 0, 
    discount1: 0, 
    discountType: "percentage", 
    discountAmount: 0, 
    uomId: "",
    unit: "",
    taxId: "", 
    taxAmount: 0, 
    taxableAmount: 0, 
    totalAmount: 0 
  };

  const initialValues: InvoiceFormValues = {
    companyId: typeof data?.companyId === "object" ? data.companyId?._id : data?.companyId || "",
    date: data?.date || DateConfig.utc().toISOString(),
    dueDate: data?.dueDate || "",
    customerId: typeof data?.customerId === "object" ? data.customerId?._id : data?.customerId || "",
    placeOfSupply: data?.placeOfSupply || "",
    billingAddress: typeof data?.billingAddress === "object" ? data.billingAddress?._id : data?.billingAddress || "",
    shippingAddress: typeof data?.shippingAddress === "object" ? data.shippingAddress?._id : data?.shippingAddress || "",
    paymentTermsId: typeof data?.paymentTermsId === "object" ? data.paymentTermsId?._id : data?.paymentTermsId || "",
    taxType: data?.taxType || "default",
    reverseCharge: data?.reverseCharge !== undefined ? String(data.reverseCharge) : "false",
    createdFrom: data?.createdFrom || "sales-order",
    selectedSalesOrderId: data?.salesOrderIds?.map((so: SalesOrderBase) => (typeof so === "object" ? so?._id : so)) || [],
    selectedDeliveryChallanId: data?.deliveryChallanIds?.map((dc: DeliveryChallanBase) => (typeof dc === "object" ? dc?._id : dc)) || [],
    termsAndConditionIds: data?.termsAndConditionIds?.map((t: string | { _id: string }) => (typeof t === "string" ? t : t._id)) || [],
    items: data?.items?.length ? data.items.map((i: InvoiceItem) => ({
      ...emptyRow,
      ...i,
      productId: typeof i.productId === "object" ? i.productId?._id : i.productId,
      taxId: typeof i.taxId === "object" ? i.taxId?._id : i.taxId,
      price: i.price || 0,
      discount1: i.discount1 || 0,
    })) : [emptyRow],
    additionalCharges: data?.additionalCharges?.length ? data.additionalCharges.map((r: AdditionalChargeItem) => ({
      ...r,
      chargeId: typeof r.chargeId === "object" ? r.chargeId?._id : r.chargeId,
      taxId: typeof r.taxId === "object" ? r.taxId?._id : r.taxId,
    })) : [],
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
    salesManId: typeof data?.salesManId === "object" ? data.salesManId?._id : data?.salesManId || "",
    paymentStatus: data?.paymentStatus || "unpaid",
    paidAmount: data?.paidAmount || 0,
    balanceAmount: data?.balanceAmount || 0,
    status: data?.status || "invoiced",
  };

  const { mutate: addInvoice, isPending: isAddLoading } = Mutations.useAddInvoice();
  const { mutate: editInvoice, isPending: isEditLoading } = Mutations.useEditInvoice();

  const isEditing = Boolean(data?._id);
  const pageMode = isEditing ? "EDIT" : "ADD";

  useEffect(() => {
    const hasAccess = isEditing ? permission.edit : permission.add;
    if (!hasAccess) navigate(-1);
  }, [isEditing, permission, navigate]);


  const getCalculatedSummary = (values: InvoiceFormValues) => {
    const itemGross = values.items?.reduce((s: number, r: InvoiceItem) => s + Number(r.qty || 0) * Number(r.price || 0), 0) || 0;
    const itemDiscount = values.items?.reduce((s: number, r: InvoiceItem) => s + Number(r.discountAmount || 0), 0) || 0;
    const itemTaxable = values.items?.reduce((s: number, r: InvoiceItem) => s + Number(r.taxableAmount || 0), 0) || 0;
    const itemTax = values.items?.reduce((s: number, r: InvoiceItem) => s + Number(r.taxAmount || 0), 0) || 0;

    const isReverseCharge = String(values.reverseCharge) === "true";
    const chargeTaxable = isReverseCharge ? 0 : values.additionalCharges?.reduce((s: number, r: AdditionalChargeItem) => s + Number(r.amount || 0), 0) || 0;
    const chargeTax = isReverseCharge ? 0 : values.additionalCharges?.reduce((s: number, r: AdditionalChargeItem) => s + (Number(r.totalAmount || 0) - Number(r.amount || 0)), 0) || 0;

    const totalTaxable = itemTaxable + chargeTaxable;
    const totalTax = itemTax + chargeTax;

    const flatDiscount = Number(values.transactionSummary?.flatDiscount || 0);
    const roundOffAmount = Number(values.transactionSummary?.roundOff || 0);

    const netBeforeRoundOff = totalTaxable + totalTax - flatDiscount;
    const netAmount = netBeforeRoundOff + roundOffAmount;

    // Calculate Tax Summary (optional, but consistent with Estimate if needed)
    // For now we just return the basics needed for transactionSummary payload

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

  const handleSubmit = async (values: InvoiceFormValues, { resetForm }: FormikHelpers<InvoiceFormValues>) => {
    const { _submitAction, selectedSalesOrderId, selectedDeliveryChallanId, reverseCharge, createdFrom, ...rest } = values;
    const payload: InvoiceFormValues = {
      ...rest,
      createdFrom: createdFrom || "",
      reverseCharge: String(String(reverseCharge) === "true"),
      salesOrderIds: Array.isArray(selectedSalesOrderId) ? selectedSalesOrderId : [],
      deliveryChallanIds: Array.isArray(selectedDeliveryChallanId) ? selectedDeliveryChallanId : [],
      items: values.items?.filter((i: InvoiceItem) => i.productId).map((i: InvoiceItem) => ({
        productId: i.productId,
        qty: Number(i.qty || 0),
        freeQty: Number(i.freeQty || 0),
        uomId: i.uomId || null,
        unit: i.unit || null,
        price: Number(i.price || 0),
        discount1: Number(i.discount1 || 0),
        taxId: i.taxId || null,
        tax: Number(i.taxAmount || 0),
        taxableAmount: Number(i.taxableAmount || 0),
        totalAmount: Number(i.totalAmount || 0),
      })),
      additionalCharges: values.additionalCharges?.filter((r) => r.chargeId).map((r) => ({ 
        chargeId: r.chargeId, 
        taxId: r.taxId, 
        amount: Number(r.amount), 
        totalAmount: Number(r.totalAmount) 
      })),
      shippingDetails: values.shippingDetails ? {
        ...values.shippingDetails,
        weight: Number(values.shippingDetails.weight || 0),
        transporterId: values.shippingDetails.transporterId || null,
      } as ShippingDetails : undefined,
      transactionSummary: getCalculatedSummary(values),
    };

    const handleSuccess = () => {
      if (_submitAction === "saveAndNew") {
        resetForm();
      } else {
        navigate(ROUTES.INVOICE.BASE);
      }
    };

    if (isEditing) {
      const changedFields = GetChangedFields(payload, data);
      await editInvoice({ ...changedFields, invoiceId: data._id }, { onSuccess: handleSuccess });
    } else {
      await addInvoice(RemoveEmptyFields(payload) as InvoiceFormValues, { onSuccess: handleSuccess });
    }
  };

  return (
    <>
      <CommonBreadcrumbs title={PAGE_TITLE.INVOICE[pageMode]} maxItems={3} breadcrumbs={BREADCRUMBS.INVOICE[pageMode]} />
      <Box sx={{ p: { xs: 2, md: 3 }, mb: 8 }}>
        <Formik<InvoiceFormValues> initialValues={initialValues} validationSchema={InvoiceFormSchema} onSubmit={handleSubmit} enableReinitialize={isEditing} validateOnMount>
          {({ setFieldValue, dirty, isValid, resetForm }) => (
            <Form noValidate>
              <CommonSummaryWatcher summaryKey="transactionSummary" priceKey="price" hasAdditionalCharges />
              <Grid container spacing={2}>
                <Box sx={{ display: "grid", gap: 2, width: "100%" }}>
                  <CommonCard title="Invoice Details" grid={{ xs: 12 }}>
                    <InvoiceDetails isEditing={isEditing} />
                  </CommonCard>

                  <CommonCard hideDivider grid={{ xs: 12 }}>
                    <InvoiceTabs emptyRow={emptyRow} />
                  </CommonCard>

                  <CommonCard grid={{ xs: 12 }} hideDivider>
                    <CommonAdditionalChargeSection />
                  </CommonCard>
                </Box>

                <CommonBottomActionBar 
                  save={isEditing} 
                  clear={!isEditing} 
                  disabled={!dirty || !isValid} 
                  isLoading={isEditLoading || isAddLoading} 
                  onClear={() => resetForm({ values: initialValues })} 
                  onSave={() => setFieldValue("_submitAction", "save")} 
                  onSaveAndNew={() => setFieldValue("_submitAction", "saveAndNew")} 
                />
              </Grid>
            </Form>
          )}
        </Formik>
      </Box>
    </>
  );
};

export default InvoiceForm;
