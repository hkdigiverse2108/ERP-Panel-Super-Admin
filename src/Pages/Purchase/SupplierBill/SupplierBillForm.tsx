import { Box, Grid } from "@mui/material";
import type { FormikHelpers } from "formik";
import { Form, Formik } from "formik";
import { useLocation, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { Mutations } from "../../../Api";
import { CommonBottomActionBar, CommonBreadcrumbs, CommonCard, CommonSummaryWatcher, CommonAdditionalChargeSection } from "../../../Components/Common";
import { PAGE_TITLE, ROUTES } from "../../../Constants";
import { BREADCRUMBS } from "../../../Data";
import type { AdditionalChargeItem, SupplierBillFormValues, SupplierBillProductItem, SupplierBillReturnProductItem } from "../../../Types";
import { DateConfig, GetChangedFields, RemoveEmptyFields } from "../../../Utils";
import { usePagePermission } from "../../../Utils/Hooks";
import { SupplierBillFormSchema } from "../../../Utils/ValidationSchemas";
import SupplierBillDetails from "../../../Components/Purchase/SupplierBill/SupplierBillDetails";
import SupplierBillTabs from "../../../Components/Purchase/SupplierBill/SupplierBillTabs";

const SupplierBillForm = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const permission = usePagePermission(PAGE_TITLE.SUPPLIER_BILL.BASE);
  const { data } = location.state || {};

  const isEditing = Boolean(data?._id);

  const { mutate: addSupplierBill, isPending: addLoading } = Mutations.useAddSupplierBill();
  const { mutate: editSupplierBill, isPending: editLoading } = Mutations.useEditSupplierBill();

  const pageMode = isEditing ? "EDIT" : "ADD";

  useEffect(() => {
    const hasAccess = isEditing ? permission.edit : permission.add;
    if (!hasAccess) navigate(-1);
  }, [isEditing, permission, navigate]);

  const emptyRow = { productId: "", _prevProductId: "", qty: 1, freeQty: 0, mrp: 0, uomId: "", unit: "", sellingPrice: 0, unitCost: 0, discount1: 0, taxable: 0, taxableAmount: 0, taxId: "", tax: 0, taxAmount: 0, landingCost: 0, margin: 0, total: 0 };
  const emptyReturnRow = { productId: "", _prevProductId: "", qty: 1, uomId: "", unit: "", unitCost: 0, discount1: 0, taxable: 0, taxableAmount: 0, taxId: "", tax: 0, taxAmount: 0, landingCost: 0, margin: 0, total: 0 };

  const initialValues: SupplierBillFormValues = {
    companyId: typeof data?.companyId === "object" ? data.companyId?._id : data?.companyId || "",
    supplierId: typeof data?.supplierId === "object" ? data.supplierId?._id : data?.supplierId || "",
    supplierBillNo: data?.supplierBillNo || "",
    referenceBillNo: data?.referenceBillNo || "",
    supplierBillDate: data?.supplierBillDate || DateConfig.utc().toISOString(),
    paymentTermsId:  typeof data?.paymentTermsId === "object" ? data.paymentTermsId?._id : data?.paymentTermsId || "",
    dueDate: data?.dueDate || "",
    shippingDate: data?.shippingDate || data?.date || data?.orderDate || "",
    reverseCharge: data?.reverseCharge !== undefined ? String(data.reverseCharge) : "false",
    taxType: data?.taxType || "tax_exclusive",
    invoiceAmount: data?.invoiceAmount || "",
    placeOfSupply: data?.placeOfSupply || "",
    gstIn: data?.gstIn || "",
    billingAddress: typeof data?.billingAddress === "object" ? data.billingAddress?._id : data?.billingAddress || "",

    productDetails: (data?.productDetails || [])?.length
      ? (data?.productDetails || []).map((i: SupplierBillProductItem) => {
        const pId = typeof i.productId === "object" ? i.productId?._id : i.productId;
        return {
          ...emptyRow,
          ...i,
          productId: pId,
          _prevProductId: pId,
          uomId: typeof i.uomId === "object" ? i.uomId?._id : i.uomId,
          taxId: typeof i.taxId === "object" ? i.taxId?._id : i.taxId,
        };
      })
      : [emptyRow],
    returnProductDetails: {
      item: (data?.returnProductDetails?.item || [])?.length
        ? (data?.returnProductDetails?.item || []).map((i: SupplierBillReturnProductItem) => {
          const pId = typeof i.productId === "object" ? i.productId?._id : i.productId;
          return {
            ...emptyReturnRow,
            ...i,
            productId: pId,
            _prevProductId: pId,
            uomId: typeof i.uomId === "object" ? i.uomId?._id : i.uomId,
            taxId: typeof i.taxId === "object" ? i.taxId?._id : i.taxId,
          };
        })
        : [emptyReturnRow],
      summary: {
        roundOff: data?.returnProductDetails?.summary?.roundOff || data?.returnProductDetails?.roundOff || 0,
      },
    },
    additionalCharges: (data?.additionalCharges || [])?.length
      ? (data?.additionalCharges || []).map((r: AdditionalChargeItem) => ({
        ...r,
        chargeId: typeof r.chargeId === "object" ? r.chargeId?._id : r.chargeId,
        taxId: typeof r.taxId === "object" ? r.taxId?._id : r.taxId,
      }))
      : [],
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
    paidAmount: data?.paidAmount || 0,
    balanceAmount: data?.balanceAmount || 0,
    paymentStatus: data?.paymentStatus || "unpaid",
    status: ["active", "cancelled"].includes(data?.status) ? data.status : "active",
    isActive: true,
  };

  const handleSubmit = async (values: SupplierBillFormValues, { resetForm }: FormikHelpers<SupplierBillFormValues>) => {
    const { _submitAction, ...rest } = values;

    const payload = {
      ...rest,
      productDetails: rest.productDetails?.map((item: SupplierBillProductItem) => ({
        productId: typeof item.productId === "object" ? item.productId?._id : item.productId,
        qty: Number(item.qty || 0),
        freeQty: Number(item.freeQty || 0),
        mrp: Number(item.mrp || 0),
        uomId: typeof item.uomId === "object" ? item.uomId?._id : item.uomId,
        unit: String(item.unit || ""),
        sellingPrice: Number(item.sellingPrice || 0),
        unitCost: Number(item.unitCost || 0),
        discount1: Number(item.discount1 || 0),
        taxable: Number(item.taxable || item.taxableAmount || 0),
        taxId: typeof item.taxId === "object" ? item.taxId?._id : item.taxId,
        tax: String(item.tax || ""),
        landingCost: Number(item.landingCost || 0),
        margin: Number(item.margin || 0),
        total: Number(item.total || 0),
      })),
      returnProductDetails: {
        item: rest.returnProductDetails?.item
          ?.filter((i) => i.productId)
          .map((item: SupplierBillReturnProductItem) => ({
            productId: typeof item.productId === "object" ? item.productId?._id : item.productId,
            qty: Number(item.qty || 0),
            uomId: typeof item.uomId === "object" ? item.uomId?._id : item.uomId,
            unit: String(item.unit || ""),
            unitCost: Number(item.unitCost || 0),
            discount1: Number(item.discount1 || 0),
            taxable: Number(item.taxable || item.taxableAmount || 0),
            taxId: typeof item.taxId === "object" ? item.taxId?._id : item.taxId,
            tax: String(item.tax || ""),
            landingCost: Number(item.landingCost || 0),
            total: Number(item.total || 0),
          })),
        summary: {
          roundOff: Number(rest.returnProductDetails?.summary?.roundOff || 0),
          grossAmount: rest.returnProductDetails?.item?.filter((i) => i.productId).reduce((a: number, b: SupplierBillReturnProductItem) => a + Number(b.taxableAmount || 0), 0) || 0,
          taxAmount: rest.returnProductDetails?.item?.filter((i) => i.productId).reduce((a: number, b: SupplierBillReturnProductItem) => a + Number(b.taxAmount || 0), 0) || 0,
          netAmount: (rest.returnProductDetails?.item?.filter((i) => i.productId).reduce((a: number, b: SupplierBillReturnProductItem) => a + Number(b.total || 0), 0) || 0) + Number(rest.returnProductDetails?.summary?.roundOff || 0),
        },
      },
      additionalCharges: Array.isArray(rest.additionalCharges)
        ? rest.additionalCharges
          ?.filter((r: AdditionalChargeItem) => r.chargeId)
          .map((r: AdditionalChargeItem) => ({
            chargeId: typeof r.chargeId === "object" ? r.chargeId?._id : r.chargeId,
            taxId: typeof r.taxId === "object" ? r.taxId?._id : r.taxId,
            amount: Number(r.amount || 0),
            totalAmount: Number(r.totalAmount || 0),
          }))
        : [],
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
      else navigate(ROUTES.SUPPLIER_BILL.BASE);
    };
    if (isEditing) {
      const changedFields = GetChangedFields(payload, data);
      await editSupplierBill({ ...changedFields, supplierBillId: data._id }, { onSuccess: handleSuccess });
    } else {
      await addSupplierBill(RemoveEmptyFields(payload) as SupplierBillFormValues, { onSuccess: handleSuccess });
    }
  };

  return (
    <>
      <CommonBreadcrumbs title={PAGE_TITLE.SUPPLIER_BILL[pageMode]} breadcrumbs={BREADCRUMBS.SUPPLIER_BILL[pageMode]} />

      <Box sx={{ p: { xs: 2, md: 3 }, mb: 14 }}>
        <Formik<SupplierBillFormValues> initialValues={initialValues} validationSchema={SupplierBillFormSchema} onSubmit={handleSubmit} enableReinitialize={isEditing} validateOnMount>
          {({ setFieldValue, dirty, isValid, resetForm }) => (
            <Form noValidate>
              <CommonSummaryWatcher itemsKey="productDetails" summaryKey="summary" priceKey="unitCost" taxAmountKey="taxAmount" hasAdditionalCharges />
              <Grid container spacing={2}>
                <Box sx={{ display: "grid", gap: 2, width: "100%" }}>
                  <CommonCard title="Supplier Bill Details" grid={{ xs: 12 }}>
                    <SupplierBillDetails />
                  </CommonCard>

                  <CommonCard hideDivider grid={{ xs: 12 }}>
                    <SupplierBillTabs emptyRow={emptyRow} emptyReturnRow={emptyReturnRow} />
                  </CommonCard>

                  <CommonCard hideDivider grid={{ xs: 12 }}>
                    <CommonAdditionalChargeSection summaryName="summary" />
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

export default SupplierBillForm;
