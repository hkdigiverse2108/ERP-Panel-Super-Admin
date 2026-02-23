import { Box } from "@mui/material";
import type { FormikHelpers } from "formik";
import { Form, Formik, useFormikContext } from "formik";
import { useLocation, useNavigate } from "react-router-dom";
import { Mutations, Queries } from "../../../Api";
import { CommonValidationDatePicker, CommonValidationSelect, CommonValidationTextField } from "../../../Attribute";
import { CommonBottomActionBar, CommonBreadcrumbs, CommonCard } from "../../../Components/Common";
import { PAGE_TITLE } from "../../../Constants";
import { BREADCRUMBS, ORDER_STATUS, TAX_TYPE } from "../../../Data";
import type { AddPurchaseOrderPayload, PurchaseOrderFormContentProps, PurchaseOrderFormValues, Supplier } from "../../../Types";
import { GenerateOptions, GetChangedFields, PurchaseOrderFormSchema, RemoveEmptyFields } from "../../../Utils";
import ProductAndTerm from "./ProductAndTerm";

const PurchaseOrderFormContent = ({ isEditing, addLoading, editLoading, navigate, resetForm, setFieldValue, dirty, supplierQueryEnabled }: PurchaseOrderFormContentProps) => {
  const { values } = useFormikContext<PurchaseOrderFormValues>();
  const { data: supplierData, isLoading: supplierDataLoading } = Queries.useGetContactDropdown({ typeFilter: "supplier", companyId: values.companyId || undefined }, supplierQueryEnabled);
  const { data: companyData, isLoading: companyDataLoading } = Queries.useGetCompanyDropdown();

  const selectedSupplier = (supplierData?.data as unknown as Supplier[])?.find((s) => s._id === values.supplierId);

  return (
    <Form noValidate>
      <Box sx={{ display: "grid", gap: 2 }}>
        {/* BASIC DETAILS */}
        <CommonCard title="Purchase Order Details" grid={{ xs: 12 }}>
          <Box sx={{ p: 2, display: "grid", gridTemplateColumns: { xs: "1fr", md: "340px 1fr" }, gap: 2 }}>
            {/* ================= LEFT SIDE ================= */}
            <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
              <CommonValidationSelect name="supplierId" label="Select Supplier" required isLoading={supplierDataLoading} options={GenerateOptions(supplierData?.data)} grid={{ xs: 12 }} disabled={!values.companyId} />

              {/* PLACE OF SUPPLY */}
              <Box display="flex" gap={1} flexWrap="wrap">
                <Box fontWeight={600}>Place of Supply:</Box>
                <Box color="text.secondary">{selectedSupplier?.address?.[0]?.state?.name || "-"}</Box>
              </Box>

              {/* GSTIN */}
              <Box display="flex" gap={1} flexWrap="wrap">
                <Box fontWeight={600}>GSTIN:</Box>
                <Box color="text.secondary">{selectedSupplier?.address?.[0]?.gstIn || "-"}</Box>
              </Box>

              {/* BILLING ADDRESS */}
              <Box display="flex" gap={1}>
                <Box fontWeight={600}>Billing Address:</Box>
                {selectedSupplier?.address?.length ? (
                  <Box color="text.secondary">
                    <Box>{selectedSupplier.address[0]?.addressLine1}</Box>
                    <Box>
                      {selectedSupplier.address[0]?.city?.name}, {selectedSupplier.address[0]?.state?.name}
                    </Box>
                    <Box>{selectedSupplier.address[0]?.pinCode}</Box>
                  </Box>
                ) : (
                  <Box color="text.secondary">-</Box>
                )}
              </Box>
            </Box>

            {/* ================= RIGHT SIDE ================= */}
            <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", md: "repeat(3, 1fr)" }, gap: 2 }}>
              <CommonValidationSelect name="companyId" label="Select Company" required isLoading={companyDataLoading} options={GenerateOptions(companyData?.data)} grid={{ xs: 12 }} />
              <CommonValidationDatePicker name="orderDate" label="Purchase Order Date" required grid={{ xs: 12 }} />
              <CommonValidationDatePicker name="shippingDate" label="Shipping Date" required grid={{ xs: 12 }} />
              <CommonValidationTextField name="shippingNote" label="Shipping Note" grid={{ xs: 12 }} />
              {isEditing && <CommonValidationTextField name="orderNo" label="Purchase Order No." grid={{ xs: 12 }} />}
              <CommonValidationSelect name="taxType" label="Tax Type" required options={TAX_TYPE} grid={{ xs: 12 }} />
              <CommonValidationSelect name="status" label="Order Status" required options={ORDER_STATUS} grid={{ xs: 12 }} />
            </Box>
          </Box>
        </CommonCard>
      </Box>

      <Box sx={{ display: "grid", gap: 2, mt: 2 }}>
        <ProductAndTerm isEditing={isEditing} />
      </Box>

      <CommonBottomActionBar save={isEditing} clear={!isEditing} disabled={!dirty} isLoading={addLoading || editLoading} onClear={() => (isEditing ? navigate(-1) : resetForm())} onSave={() => setFieldValue("_submitAction", "save")} onSaveAndNew={() => setFieldValue("_submitAction", "saveAndNew")} />
    </Form>
  );
};

const PurchaseOrderForm = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { data } = location.state || {};

  const isEditing = Boolean(data?._id);

  const { mutate: addPurchaseOrder, isPending: addLoading } = Mutations.useAddPurchaseOrder();
  const { mutate: editPurchaseOrder, isPending: editLoading } = Mutations.useEditPurchaseOrder();

  const pageMode = isEditing ? "EDIT" : "ADD";
  const initialValues: PurchaseOrderFormValues = {
    // New Fields
    companyId: data?.companyId?._id || "",

    supplierId: data?.supplierId?._id || "",
    contactId: data?.contactId?._id || "",
    orderDate: data?.orderDate || data?.date || "",
    orderNo: data?.orderNo || "",
    shippingDate: data?.shippingDate || data?.date || data?.orderDate || "",
    shippingNote: data?.shippingNote || "",
    items: data?.items?.length
      ? data.items
      : [
        {
          productId: "",
          qty: 1,
          freeQty: 0,
          mrp: 0,
          sellingPrice: 0,
          discount1: 0,
          discount2: 0,
          taxableAmount: 0,
          unitCost: 0,
          tax: "0",
          landingCost: "0",
          margin: "0",
          total: 0,
        },
      ],

    flatDiscount: data?.flatDiscount || 0,
    grossAmount: data?.grossAmount || 0,
    discountAmount: data?.discountAmount || 0,
    taxableAmount: data?.taxableAmount || 0,
    tax: data?.tax || 0,
    roundOff: data?.roundOff || 0,
    netAmount: data?.netAmount || 0,

    notes: data?.notes || "",
    status: ["in_progress", "delivered", "partially_delivered", "exceed", "completed", "cancelled"].includes(data?.status) ? data.status : "in_progress",
    taxType: data?.taxType || "",
    termsAndConditionIds: data?.termsAndConditionIds?.map((t: string | { _id: string }) => (typeof t === "string" ? t : t._id)) || [],
  };

  const handleSubmit = async (values: PurchaseOrderFormValues, { resetForm }: FormikHelpers<PurchaseOrderFormValues>) => {
    const { _submitAction, ...rest } = values;

    const payload = {
      ...rest,
      items: rest.items?.map(({ taxAmount, taxName, freeQty, mrp, sellingPrice, discount1, discount2, taxableAmount, unitCost, ...item }) => ({
        ...item,
        tax: String(item.tax || 0),
        landingCost: String(item.landingCost || 0),
        margin: String(item.margin || 0),
      })),
    };

    const handleSuccess = () => {
      if (_submitAction === "saveAndNew") resetForm();
      else navigate(-1);
    };
    if (isEditing) {
      const changedFields = GetChangedFields(payload, data);
      await editPurchaseOrder({ ...changedFields, purchaseOrderId: data._id }, { onSuccess: handleSuccess });
    } else {
      await addPurchaseOrder(RemoveEmptyFields(payload) as unknown as AddPurchaseOrderPayload, { onSuccess: handleSuccess });
    }
  };

  return (
    <>
      <CommonBreadcrumbs title={PAGE_TITLE.PURCHASE_ORDER[pageMode]} breadcrumbs={BREADCRUMBS.PURCHASE_ORDER[pageMode]} />

      <Box sx={{ p: { xs: 2, md: 3 }, mb: 14 }}>
        <Formik initialValues={initialValues} validationSchema={PurchaseOrderFormSchema} onSubmit={handleSubmit}>
          {(formikProps) => <PurchaseOrderFormContent {...formikProps} isEditing={isEditing} addLoading={addLoading} editLoading={editLoading} navigate={navigate} />}
        </Formik>
      </Box>
    </>
  );
};

export default PurchaseOrderForm;
