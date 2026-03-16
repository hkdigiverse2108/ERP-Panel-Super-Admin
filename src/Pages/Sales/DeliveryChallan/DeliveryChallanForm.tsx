import { Box, Grid } from "@mui/material";
import { Form, Formik, type FormikHelpers } from "formik";
import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Mutations, Queries } from "../../../Api";
import { CommonBottomActionBar, CommonBreadcrumbs, CommonCard, CommonSummaryWatcher } from "../../../Components/Common";
import { PAGE_TITLE, ROUTES } from "../../../Constants";
import { BREADCRUMBS } from "../../../Data";
import type { DeliveryChallanFormValues, DeliveryChallanItem } from "../../../Types";
import { DateConfig, GetChangedFields, RemoveEmptyFields } from "../../../Utils";
import { usePagePermission } from "../../../Utils/Hooks";
import { DeliveryChallanFormSchema } from "../../../Utils/ValidationSchemas";
import { DeliveryChallanDetails, DeliveryChallanTabs } from "../../../Components/Sales";
import CommonAdditionalChargeSection from "../../../Components/Common/CommonAdditionalChargeSection";

const DeliveryChallanForm = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const permission = usePagePermission(PAGE_TITLE.DELIVERY_CHALLAN.BASE);
  const { data } = location.state || {};

  const emptyRow: DeliveryChallanItem = { 
    productId: "", 
    qty: 1, 
    freeQty: 0, 
    mrp: 0, 
    price: 0, 
    discount1: 0, 
    discountAmount: 0, 
    uomId: "",
    unit: "",
    taxId: "", 
    taxAmount: 0, 
    taxableAmount: 0, 
    totalAmount: 0 
  };

  const initialValues: DeliveryChallanFormValues = {
    companyId: typeof data?.companyId === "object" ? data.companyId?._id : data?.companyId || "",
    date: data?.date || DateConfig.utc().toISOString(),
    dueDate: data?.dueDate || DateConfig.utc().add(1, 'month').toISOString(),
    customerId: typeof data?.customerId === "object" ? data.customerId?._id : data?.customerId || "",
    placeOfSupply: data?.placeOfSupply || "",
    billingAddress: typeof data?.billingAddress === "object" ? data.billingAddress?._id : data?.billingAddress || "",
    shippingAddress: typeof data?.shippingAddress === "object" ? data.shippingAddress?._id : data?.shippingAddress || "",
    paymentTerms: data?.paymentTerms || "",
    taxType: data?.taxType || "default",
    createdFrom: data?.createdFrom || "",
    selectedSalesOrderId: data?.salesOrderIds?.map((so: any) => (typeof so === "object" ? so?._id : so)) || [],
    selectedInvoiceId: data?.invoiceIds?.map((inv: any) => (typeof inv === "object" ? inv?._id : inv)) || [],
    termsAndConditionIds: data?.termsAndConditionIds?.map((t: string | { _id: string }) => (typeof t === "string" ? t : t._id)) || [],
    items: data?.items?.length ? data.items.map((i: any) => ({
      ...emptyRow,
      ...i,
      productId: typeof i.productId === "object" ? i.productId?._id : i.productId,
      taxId: typeof i.taxId === "object" ? i.taxId?._id : i.taxId,
      price: i.price || i.unitPrice || 0,
      discount1: i.discount1 || i.discount || 0,
    })) : [emptyRow],
    additionalCharges: data?.additionalCharges?.length ? data.additionalCharges.map((r: any) => ({
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
    status: data?.status || "delivered",
  };

  const { mutate: addChallan, isPending: isAddLoading } = Mutations.useAddDeliveryChallan();
  const { mutate: editChallan, isPending: isEditLoading } = Mutations.useEditDeliveryChallan();

  const isEditing = Boolean(data?._id);
  const pageMode = isEditing ? "EDIT" : "ADD";

  useEffect(() => {
    const hasAccess = isEditing ? permission.edit : permission.add;
    if (!hasAccess) navigate(-1);
  }, [isEditing, permission, navigate]);

  // const { data: taxData } = Queries.useGetTaxDropdown();

  const getCalculatedSummary = (values: DeliveryChallanFormValues) => {
    const itemGross = values.items?.reduce((s: number, r: any) => s + Number(r.qty || 0) * Number(r.price || 0), 0) || 0;
    const itemDiscount = values.items?.reduce((s: number, r: any) => s + Number(r.discountAmount || 0), 0) || 0;
    const itemTaxable = values.items?.reduce((s: number, r: any) => s + Number(r.taxableAmount || 0), 0) || 0;
    const itemTax = values.items?.reduce((s: number, r: any) => s + Number(r.taxAmount || 0), 0) || 0;

    const chargeTaxable = values.additionalCharges?.reduce((s: number, r: any) => s + Number(r.amount || 0), 0) || 0;
    const chargeTax = values.additionalCharges?.reduce((s: number, r: any) => s + (Number(r.totalAmount || 0) - Number(r.amount || 0)), 0) || 0;

    const totalTaxable = itemTaxable + chargeTaxable;
    const totalTax = itemTax + chargeTax;

    const flatDiscount = Number(values.transactionSummary?.flatDiscount || 0);
    const roundOffAmount = Number(values.transactionSummary?.roundOff || 0);

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

  const handleSubmit = async (values: DeliveryChallanFormValues, { resetForm }: FormikHelpers<DeliveryChallanFormValues>) => {
    const { _submitAction, selectedSalesOrderId, selectedInvoiceId, createdFrom, ...rest } = values;
    const payload: any = {
      ...rest,
      createdFrom: createdFrom || null,
      salesOrderIds: Array.isArray(selectedSalesOrderId) ? selectedSalesOrderId : [],
      invoiceIds: Array.isArray(selectedInvoiceId) ? selectedInvoiceId : [],
      items: values.items?.filter((i: any) => i.productId).map((i: any) => ({
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
      shippingDetails: {
        ...values.shippingDetails,
        weight: Number(values.shippingDetails?.weight || 0),
        transporterId: values.shippingDetails?.transporterId || null,
      },
      transactionSummary: getCalculatedSummary(values),
    };

    const handleSuccess = () => {
      if (_submitAction === "saveAndNew") {
        resetForm();
      } else {
        navigate(ROUTES.DELIVERY_CHALLAN.BASE);
      }
    };

    if (isEditing) {
      const changedFields = GetChangedFields(payload, data);
      await editChallan({ ...changedFields, deliveryChallanId: data._id }, { onSuccess: handleSuccess });
    } else {
      await addChallan(RemoveEmptyFields(payload) as DeliveryChallanFormValues, { onSuccess: handleSuccess });
    }
  };

  return (
    <>
      <CommonBreadcrumbs title={PAGE_TITLE.DELIVERY_CHALLAN[pageMode]} maxItems={3} breadcrumbs={BREADCRUMBS.DELIVERY_CHALLAN[pageMode]} />
      <Box sx={{ p: { xs: 2, md: 3 }, mb: 8 }}>
        <Formik<DeliveryChallanFormValues> initialValues={initialValues} validationSchema={DeliveryChallanFormSchema} onSubmit={handleSubmit} enableReinitialize={isEditing} validateOnMount>
          {({ setFieldValue, dirty, isValid, resetForm }) => (
            <Form noValidate>
              <CommonSummaryWatcher summaryKey="transactionSummary" priceKey="price" hasAdditionalCharges />
              <Grid container spacing={2}>
                <Box sx={{ display: "grid", gap: 2, width: "100%" }}>
                  <CommonCard title="Delivery Challan Details" grid={{ xs: 12 }}>
                    <DeliveryChallanDetails isEditing={isEditing} />
                  </CommonCard>

                  <CommonCard hideDivider grid={{ xs: 12 }}>
                    <DeliveryChallanTabs emptyRow={emptyRow} />
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

export default DeliveryChallanForm;