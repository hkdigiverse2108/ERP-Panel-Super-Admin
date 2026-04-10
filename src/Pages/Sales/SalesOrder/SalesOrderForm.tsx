import { Box, Grid } from "@mui/material";
import { Form, Formik, type FormikHelpers } from "formik";
import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Mutations } from "../../../Api";
import { CommonBottomActionBar, CommonBreadcrumbs, CommonCard, CommonSummaryWatcher, CommonAdditionalChargeSection } from "../../../Components/Common";
import { PAGE_TITLE, ROUTES } from "../../../Constants";
import { BREADCRUMBS } from "../../../Data";
import type { AdditionalChargeItem, SalesOrderFormValues, SalesOrderItem } from "../../../Types";
import { DateConfig, GetChangedFields, RemoveEmptyFields } from "../../../Utils";
import { usePagePermission } from "../../../Utils/Hooks";
import { SalesOrderFormSchema } from "../../../Utils/ValidationSchemas";
import { SalesOrderDetails, SalesOrderTabs } from "../../../Components/Sales";

const SalesOrderForm = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const permission = usePagePermission(PAGE_TITLE.SALES_ORDER.BASE);
  const { data } = location.state || {};

  const emptyRow: SalesOrderItem = { productId: "", qty: 1, freeQty: 0, uomId: "", price: 0, discount1: 0, taxId: "", taxableAmount: 0, totalAmount: 0 };

  const initialValues: SalesOrderFormValues = {
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
    items: data?.items?.length ? data.items.map((i: SalesOrderItem) => ({
      ...emptyRow,
      ...i,
      productId: typeof i.productId === "object" ? i.productId?._id : i.productId,
      uomId: typeof i.uomId === "object" ? i.uomId?._id : i.uomId,
      taxId: typeof i.taxId === "object" ? i.taxId?._id : i.taxId,
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
    status: data?.status || "pending",
    salesManId: (typeof (data?.salesManId || data?.salesMan || data?.sales_man_id || data?.sales_person_id) === "object" ? (data?.salesManId || data?.salesMan || data?.sales_man_id || data?.sales_person_id)?._id : (data?.salesManId || data?.salesMan || data?.sales_man_id || data?.sales_person_id)) || "",
    selectedEstimateId: (typeof (data?.estimateId || data?.selectedEstimateId || data?.estimate || data?.estimate_id || data?.selected_estimate_id) === "object" ? (data?.estimateId || data?.selectedEstimateId || data?.estimate || data?.estimate_id || data?.selected_estimate_id)?._id : (data?.estimateId || data?.selectedEstimateId || data?.estimate || data?.estimate_id || data?.selected_estimate_id)) || "",
    estimateNo: data?.estimateNo || data?.estimateId?.estimateNo || data?.estimate?.estimateNo || "",
    notes: data?.notes || "",
  };

  const { mutate: addSalesOrder, isPending: isAddLoading } = Mutations.useAddSalesOrder();
  const { mutate: editSalesOrder, isPending: isEditLoading } = Mutations.useEditSalesOrder();

  const isEditing = Boolean(data?._id);
  const pageMode = isEditing ? "EDIT" : "ADD";

  useEffect(() => {
    const hasAccess = isEditing ? permission.edit : permission.add;
    if (!hasAccess) navigate(-1);
  }, [isEditing, permission, navigate]);

//   const { data: taxData } = Queries.useGetTaxDropdown();

  const getCalculatedSummary = (values: SalesOrderFormValues) => {
    const itemGross = values.items?.reduce((s: number, r: SalesOrderItem) => s + Number(r.qty || 0) * Number(r.price || 0), 0) || 0;
    const itemDiscount = values.items?.reduce((s: number, r: SalesOrderItem) => s + Number(r.discount1 || 0), 0) || 0;
    const itemTaxable = values.items?.reduce((s: number, r: SalesOrderItem) => s + Number(r.taxableAmount || 0), 0) || 0;
    const itemTax = values.items?.reduce((s: number, r: SalesOrderItem) => s + Number(r.totalAmount || 0) - Number(r.taxableAmount || 0), 0) || 0;

    const isReverseCharge = String(values.reverseCharge) === "true";
    const chargeTaxable = isReverseCharge ? 0 : values.additionalCharges?.reduce((s: number, r: AdditionalChargeItem) => s + Number(r.amount || 0), 0) || 0;
    const chargeTax = isReverseCharge ? 0 : values.additionalCharges?.reduce((s: number, r: AdditionalChargeItem) => s + (Number(r.totalAmount || 0) - Number(r.amount || 0)), 0) || 0;

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

  const handleSubmit = async (values: SalesOrderFormValues, { resetForm }: FormikHelpers<SalesOrderFormValues>) => {
    const { _submitAction, estimateNo, ...rest } = values;
    const payload: SalesOrderFormValues = {
      ...rest,
      items: values.items?.filter((i: SalesOrderItem) => i.productId).map((i: SalesOrderItem) => ({
        productId: typeof i.productId === "object" ? i.productId?._id : i.productId,
        qty: Number(i.qty || 0),
        freeQty: Number(i.freeQty || 0),
        price: Number(i.price || 0),
        discount1: Number(i.discount1 || 0),
        taxableAmount: Number(i.taxableAmount || 0),
        totalAmount: Number(i.totalAmount || 0),
        uomId: typeof i.uomId === "object" ? i.uomId?._id : i.uomId,
        taxId: typeof i.taxId === "object" ? i.taxId?._id : i.taxId,
      })),
      additionalCharges: values.additionalCharges?.filter((r) => r.chargeId).map((r: AdditionalChargeItem) => ({
        chargeId: typeof r.chargeId === "object" ? r.chargeId?._id : r.chargeId,
        taxId: typeof r.taxId === "object" ? r.taxId?._id : r.taxId,
        amount: Number(r.amount || 0),
        totalAmount: Number(r.totalAmount || 0),
      })),
      transactionSummary: getCalculatedSummary(values),
    };

    const handleSuccess = () => {
      if (_submitAction === "saveAndNew") {
        resetForm();
      } else {
        navigate(ROUTES.SALES_ORDER.BASE);
      }
    };

    if (isEditing) {
      const changedFields = GetChangedFields(payload, data);
      await editSalesOrder({ ...changedFields, salesOrderId: data._id }, { onSuccess: handleSuccess });
    } else {
      await addSalesOrder(RemoveEmptyFields(payload) as SalesOrderFormValues, { onSuccess: handleSuccess });
    }
  };

  return (
    <>
      <CommonBreadcrumbs title={PAGE_TITLE.SALES_ORDER[pageMode]} maxItems={3} breadcrumbs={BREADCRUMBS.SALES_ORDER[pageMode]} />
      <Box sx={{ p: { xs: 2, md: 3 }, mb: 8 }}>
        <Formik<SalesOrderFormValues> initialValues={initialValues} validationSchema={SalesOrderFormSchema} onSubmit={handleSubmit} enableReinitialize={isEditing} validateOnMount>
          {({ setFieldValue, dirty, resetForm }) => (
            <Form noValidate>
              <CommonSummaryWatcher summaryKey="transactionSummary" priceKey="price" hasAdditionalCharges />
              <Grid container spacing={2}>
                <Box sx={{ display: "grid", gap: 2, width: "100%" }}>
                  <CommonCard title="Sales Order Details" grid={{ xs: 12 }}>
                    <SalesOrderDetails />
                  </CommonCard>

                  <CommonCard hideDivider grid={{ xs: 12 }}>
                    <SalesOrderTabs emptyRow={emptyRow} />
                  </CommonCard>

                  <CommonCard grid={{ xs: 12 }} hideDivider>
                    <CommonAdditionalChargeSection />
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

export default SalesOrderForm;
