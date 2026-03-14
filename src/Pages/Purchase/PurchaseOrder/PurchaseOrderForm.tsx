import { Box, Grid } from "@mui/material";
import type { FormikHelpers } from "formik";
import { Form, Formik } from "formik";
import { useLocation, useNavigate } from "react-router-dom";
import { Mutations } from "../../../Api";
import { CommonBottomActionBar, CommonBreadcrumbs, CommonCard, CommonSummarySection, CommonSummaryWatcher } from "../../../Components/Common";
import { PAGE_TITLE } from "../../../Constants";
import { BREADCRUMBS } from "../../../Data";
import type { AddPurchaseOrderPayload, PurchaseOrderFormValues } from "../../../Types";
import { GetChangedFields, PurchaseOrderFormSchema, RemoveEmptyFields } from "../../../Utils";
import { PurchaseOrderDetails, PurchaseOrderTabs } from "../../../Components/Purchase";


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
    companyId: typeof data?.companyId === "object" ? data.companyId?._id : data?.companyId || "",

    supplierId: typeof data?.supplierId === "object" ? data.supplierId?._id : data?.supplierId || "",
    orderDate: data?.orderDate || data?.date || "",
    shippingDate: data?.shippingDate || data?.date || data?.orderDate || "",
    shippingNote: data?.shippingNote || "",

    placeOfSupply: data?.placeOfSupply || "",
    billingAddress: typeof data?.billingAddress === "object" ? data.billingAddress?._id : data?.billingAddress || "",
    gstIn: data?.gstIn || "",
    taxType: data?.taxType || "default",

    items: data?.items?.length ? data.items.map((i: any) => {
      const pId = typeof i.productId === "object" ? i.productId?._id : i.productId;
      return {
        ...emptyRow,
        ...i,
        productId: pId,
        _prevProductId: pId,
        uomId: typeof i.uomId === "object" ? i.uomId?._id : i.uomId,
        taxId: typeof i.taxId === "object" ? i.taxId?._id : i.taxId,
      };
    }) : [emptyRow],
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
              <CommonSummaryWatcher summaryKey="summary" priceKey="unitCost" taxAmountKey="taxAmount" />
              <Grid container spacing={2}>
                <Box sx={{ display: "grid", gap: 2, width: "100%" }}>
                  <CommonCard title="Purchase Order Details" grid={{ xs: 12 }}>
                    <PurchaseOrderDetails />
                  </CommonCard>

                  <CommonCard hideDivider grid={{ xs: 12 }}>
                    <PurchaseOrderTabs emptyRow={emptyRow} />
                  </CommonCard>

                  <CommonCard hideDivider grid={{ xs: 12 }}>
                    <CommonSummarySection name="summary" />
                  </CommonCard>
                </Box>

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
