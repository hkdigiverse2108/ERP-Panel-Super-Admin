import { Add, Clear } from "@mui/icons-material";
import { Box, Grid } from "@mui/material";
import type { FormikHelpers } from "formik";
import { FieldArray, Form, Formik } from "formik";
import { useLocation, useNavigate } from "react-router-dom";
import { Mutations, Queries } from "../../../Api";
import { CommonButton, CommonValidationDatePicker, CommonValidationSelect, CommonValidationTextField } from "../../../Attribute";
import { CommonBottomActionBar, CommonBreadcrumbs, CommonCard } from "../../../Components/Common";
import { PAGE_TITLE } from "../../../Constants";
import { BREADCRUMBS, TAX_TYPE } from "../../../Data";
import type { PurchaseOrderFormValues, Supplier } from "../../../Types";
import { GenerateOptions, GetChangedFields, PurchaseOrderFormSchema, RemoveEmptyFields } from "../../../Utils";
import CommonTable from "../../../Components/Common/CommonTable";
import PurchaseOrderBilling from "./PurchaseOrderBilling";

const PurchaseOrderForm = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { data } = location.state || {};
  const isEditing = Boolean(data?._id);

  const { mutate: addPurchaseOrder, isPending: addLoading } = Mutations.useAddPurchaseOrder();
  const { mutate: editPurchaseOrder, isPending: editLoading } = Mutations.useEditPurchaseOrder();

  const { data: supplierData, isLoading: supplierDataLoading } = Queries.useGetContactDropdown({ typeFilter: "supplier" });
  const { data: productData, isLoading: productDataLoading } = Queries.useGetProduct();

  const pageMode = isEditing ? "EDIT" : "ADD";
  const initialValues: PurchaseOrderFormValues = {
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
    status: data?.status || "PENDING",
    taxType: data?.taxType || "",
    termsAndConditionIds: data?.termsAndConditionIds || [],
  };

  const handleSubmit = async (values: PurchaseOrderFormValues, { resetForm }: FormikHelpers<PurchaseOrderFormValues>) => {
    const { _submitAction, ...rest } = values;

    const handleSuccess = () => {
      if (_submitAction === "saveAndNew") resetForm();
      else navigate(-1);
    };
    if (isEditing) {
      const changedFields = GetChangedFields(rest, data);
      await editPurchaseOrder({ ...changedFields, purchaseOrderId: data._id }, { onSuccess: handleSuccess });
    } else {
      await addPurchaseOrder(RemoveEmptyFields(rest) as any, { onSuccess: handleSuccess });
    }
  };

  return (
    <>
      <CommonBreadcrumbs title={PAGE_TITLE.PURCHASE_ORDER[pageMode]} breadcrumbs={BREADCRUMBS.PURCHASE_ORDER[pageMode]} />

      <Box sx={{ p: 3, mb: 8 }}>
        <Formik initialValues={initialValues} validationSchema={PurchaseOrderFormSchema} onSubmit={handleSubmit}>
          {({ values, dirty, setFieldValue, resetForm }) => {
            const selectedSupplier = (supplierData?.data as Supplier[])?.find((s) => s._id === values.supplierId);

            return (
              <Form noValidate>
                <Grid container spacing={2}>
                  {/* BASIC DETAILS */}
                  <CommonCard title="Purchase Order Details" grid={{ xs: 12 }}>
                    <Box
                      sx={{
                        p: 2,
                        display: "grid",
                        gridTemplateColumns: { xs: "1fr", md: "340px 1fr" },
                        gap: 2,
                      }}
                    >
                      {/* ================= LEFT SIDE ================= */}
                      <Box display="flex" flexDirection="column" gap={2}>
                        <CommonValidationSelect name="supplierId" label="Select Supplier" required isLoading={supplierDataLoading} options={GenerateOptions(supplierData?.data)} grid={{ xs: 12 }} />

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
                        <Box display="flex" gap={1} flexWrap="wrap">
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
                      <Box
                        sx={{
                          display: "grid",
                          gridTemplateColumns: { xs: "1fr", md: "repeat(4, 1fr)" },
                          gap: 2,
                        }}
                      >
                        <CommonValidationDatePicker name="orderDate" label="Purchase Order Date" required grid={{ xs: 12 }} />
                        <CommonValidationDatePicker name="shippingDate" label="Shipping Date" required grid={{ xs: 12 }} />
                        <CommonValidationTextField name="shippingNote" label="Shipping Note" grid={{ xs: 12 }} />
                        <CommonValidationTextField name="orderNo" label="Purchase Order No." grid={{ xs: 12 }} />
                        <CommonValidationSelect name="taxType" label="Tax Type" required options={TAX_TYPE} grid={{ xs: 12 }} />
                      </Box>
                    </Box>
                  </CommonCard>

                  {/* PRODUCT DETAILS */}
                  <CommonCard title="Product Details" grid={{ xs: 12 }}>
                    <Box sx={{ p: 2, overflowX: "auto" }}>
                      <FieldArray name="items">
                        {({ push, remove }) => {
                          const columns = [
                            {
                              key: "action",
                              header: "",
                              headerClass: "text-center",
                              bodyClass: "text-center",
                              render: (_row: any, index: number) => (
                                <Box display="flex" justifyContent="center" gap={1}>
                                  <CommonButton
                                    size="small"
                                    variant="outlined"
                                    onClick={() =>
                                      push({
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
                                      })
                                    }
                                  >
                                    <Add fontSize="small" />
                                  </CommonButton>

                                  {values.items.length > 1 && (
                                    <CommonButton size="small" color="error" variant="outlined" onClick={() => remove(index)}>
                                      <Clear fontSize="small" />
                                    </CommonButton>
                                  )}
                                </Box>
                              ),
                            },
                            {
                              key: "sr",
                              header: "#",
                              render: (_row: any, index: number) => index + 1,
                            },
                            {
                              key: "productId",
                              header: "Product",
                              bodyClass: "min-w-[240px]",
                              render: (_row: any, index: number) => <CommonValidationSelect name={`items.${index}.productId`} label="Search Product" isLoading={productDataLoading} options={GenerateOptions(productData?.data?.product_data)} required />,
                            },
                            {
                              key: "qty",
                              header: "Qty",
                              render: (_row: any, index: number) => <CommonValidationTextField name={`items.${index}.qty`} type="number" />,
                            },
                            {
                              key: "tax",
                              header: "Tax",
                              render: (_row: any, index: number) => <CommonValidationTextField name={`items.${index}.tax`} type="number" />,
                            },
                            {
                              key: "landingCost",
                              header: "Landing",
                              render: (_row: any, index: number) => <CommonValidationTextField name={`items.${index}.landingCost`} type="number" />,
                            },
                            {
                              key: "margin",
                              header: "Margin",
                              render: (_row: any, index: number) => <CommonValidationTextField name={`items.${index}.margin`} type="number" />,
                            },
                            {
                              key: "total",
                              header: "Total",
                              render: (_row: any, index: number) => <CommonValidationTextField name={`items.${index}.total`} type="number" disabled />,
                            },
                          ];

                          return <CommonTable data={values.items || []} columns={columns} rowKey={(_, index) => index} getRowClass={() => "align-top"} />;
                        }}
                      </FieldArray>
                    </Box>
                  </CommonCard>

                  {/* BILLING SUMMARY & TERMS */}
                  <PurchaseOrderBilling />

                  <CommonBottomActionBar save={isEditing} clear={!isEditing} disabled={!dirty} isLoading={addLoading || editLoading} onClear={() => (isEditing ? navigate(-1) : resetForm())} onSave={() => setFieldValue("_submitAction", "save")} onSaveAndNew={() => setFieldValue("_submitAction", "saveAndNew")} />
                </Grid>
              </Form>
            );
          }}
        </Formik>
      </Box>
    </>
  );
};

export default PurchaseOrderForm;
