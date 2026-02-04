import { Add, Clear } from "@mui/icons-material";
import { Box, Grid, Tab, Tabs } from "@mui/material";
import type { FormikHelpers } from "formik";
import { FieldArray, Form, Formik, useFormikContext } from "formik";
import React, { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Mutations, Queries } from "../../../Api";
import { CommonButton, CommonValidationDatePicker, CommonValidationSelect, CommonValidationTextField } from "../../../Attribute";
import { CommonBottomActionBar, CommonBreadcrumbs, CommonCard, CommonTabPanel } from "../../../Components/Common";
import { PAGE_TITLE } from "../../../Constants";
import { BREADCRUMBS } from "../../../Data";
import type { PurchaseOrderFormValues, Supplier } from "../../../Types";
import { GenerateOptions, GetChangedFields, PurchaseOrderFormSchema, RemoveEmptyFields } from "../../../Utils";
import TermsConditionModal from "./TermsConditionModal";

const a11yProps = (index: number) => {
  return {
    id: `simple-tab-${index}`,
    "aria-controls": `simple-tabpanel-${index}`,
  };
};

const PurchaseOrderForm = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { data } = location.state || {};
  const isEditing = Boolean(data?._id);

  const { mutate: addPurchaseOrder, isPending: addLoading } = Mutations.useAddPurchaseOrder();
  const { mutate: editPurchaseOrder, isPending: editLoading } = Mutations.useEditPurchaseOrder();
  const { mutate: addTerm } = Mutations.useAddTermsCondition();
  const { data: supplierData, isLoading: supplierDataLoading } = Queries.useGetContactDropdown({ typeFilter: "supplier" });

  const { data: productData } = Queries.useGetProductDropdown();
  const { data: termsData, refetch: refetchTerms } = Queries.useGetTermsConditionDropdown();

  const [tabValue, setTabValue] = React.useState(0);
  const [openTermsModal, setOpenTermsModal] = React.useState(false);

  const handleTabChange = (_: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  const handleSaveTerm = (term: any) => {
    addTerm({ termsCondition: term.termsCondition } as any, {
      onSuccess: () => {
        refetchTerms();
      },
    });
  };

  const pageMode = isEditing ? "EDIT" : "ADD";
  const initialValues: PurchaseOrderFormValues = {
    supplierId: data?.supplierId?._id || "",
    contactId: data?.contactId?._id || "",
    date: data?.date || data?.orderDate || "",
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

  const PurchaseOrderCalcSync = () => {
    const { values, setFieldValue } = useFormikContext<PurchaseOrderFormValues>();

    useEffect(() => {
      const itemsTotal =
        values.items?.reduce((sum, item, index) => {
          // Placeholder calculation - align with business logic as needed
          const total = (Number(item.qty) || 0) * (Number(item.unitCost) || 0);
          // If you have more complex logic involving discounts, add it here
          if (values.items?.[index]?.total !== total) {
            setFieldValue(`items.${index}.total`, total);
          }
          return sum + total;
        }, 0) ?? 0;

      const discount = values.flatDiscount || 0;
      const taxableAmount = Math.max(itemsTotal - discount, 0);
      const taxPercent = values.tax || 0;
      const taxAmount = taxableAmount * (taxPercent / 100);
      const roundOff = values.roundOff || 0;

      const netAmount = taxableAmount + taxAmount + roundOff;

      if (values.grossAmount !== itemsTotal) setFieldValue("grossAmount", itemsTotal);
      if (values.taxableAmount !== taxableAmount) setFieldValue("taxableAmount", taxableAmount);
      if (values.netAmount !== netAmount) setFieldValue("netAmount", netAmount);
    }, [values.items, values.flatDiscount, values.tax, values.roundOff, setFieldValue]);

    return null;
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

            const summary = {
              grossAmount: values.grossAmount || 0,
              taxableAmount: values.taxableAmount || 0,
              taxAmount: (values.taxableAmount || 0) * ((values.tax || 0) / 100),
              netAmount: values.netAmount || 0,
            };

            return (
              <Form noValidate>
                <PurchaseOrderCalcSync />
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
                        <CommonValidationDatePicker name="date" label="Purchase Order Date" required grid={{ xs: 12 }} />

                        <CommonValidationDatePicker name="shippingDate" label="Shipping Date" required grid={{ xs: 12 }} />

                        <CommonValidationTextField name="shippingNote" label="Shipping Note" grid={{ xs: 12 }} />

                        <CommonValidationTextField name="orderNo" label="Purchase Order No." grid={{ xs: 12 }} />
                      </Box>
                    </Box>
                  </CommonCard>

                  {/* PRODUCT DETAILS TAB */}
                  {/* ================= TABS HEADER ================= */}
                  <CommonCard title="Product Details" grid={{ xs: 12 }}>
                    <Box sx={{ borderBottom: 1, borderColor: "divider", width: "100%", mb: 2 }}>
                      <Tabs value={tabValue} onChange={handleTabChange} aria-label="purchase order tabs">
                        <Tab label="Product Details" {...a11yProps(0)} />
                        <Tab label="Terms & Conditions" {...a11yProps(1)} />
                      </Tabs>
                    </Box>

                    {/* ================= TAB 1 : PRODUCT DETAILS ================= */}
                    <CommonTabPanel value={tabValue} index={0}>
                      <Box sx={{ mt: 2, overflowX: "auto" }}>
                        <Box sx={{ minWidth: 1400 }}>
                          <table className="w-full text-sm">
                            <thead className="sticky top-0 bg-gray-100 dark:bg-gray-900">
                              <tr>
                                <th className="p-2"></th>
                                <th className="p-2">#</th>
                                <th className="p-2">Product</th>
                                <th className="p-2">Qty</th>
                                <th className="p-2">Tax</th>
                                <th className="p-2">Landing</th>
                                <th className="p-2">Margin</th>
                                <th className="p-2">Total</th>
                              </tr>
                            </thead>

                            <FieldArray name="items">
                              {({ push, remove }) => (
                                <tbody>
                                  {values.items?.map((_, index) => (
                                    <tr key={index} className="text-center align-top">
                                      <td className="p-2 flex justify-center gap-1">
                                        <Box display="flex" gap={1}>
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
                                          {values.items && values.items.length > 1 && (
                                            <CommonButton size="small" color="error" variant="outlined" onClick={() => remove(index)}>
                                              <Clear fontSize="small" />
                                            </CommonButton>
                                          )}
                                        </Box>
                                      </td>

                                      <td className="p-2">{index + 1}</td>

                                      <td className="p-2 min-w-60">
                                        <CommonValidationSelect name={`items.${index}.productId`} label="Search Product" options={GenerateOptions(productData?.data)} required />
                                      </td>

                                      {/* Qty */}
                                      <td className="p-2 min-w-28">
                                        <CommonValidationTextField name={`items.${index}.qty`} type="number" />
                                      </td>

                                      {/* Tax */}
                                      <td className="p-2 min-w-28">
                                        <CommonValidationTextField name={`items.${index}.tax`} type="number" />
                                      </td>
                                      {/* Landing */}
                                      <td className="p-2 min-w-28">
                                        <CommonValidationTextField name={`items.${index}.landingCost`} type="number" />
                                      </td>
                                      {/* Margin */}
                                      <td className="p-2 min-w-28">
                                        <CommonValidationTextField name={`items.${index}.margin`} type="number" />
                                      </td>
                                      {/* Total */}
                                      <td className="p-2 min-w-28">
                                        <CommonValidationTextField name={`items.${index}.total`} type="number" disabled />
                                      </td>
                                    </tr>
                                  ))}
                                </tbody>
                              )}
                            </FieldArray>
                          </table>
                        </Box>
                      </Box>
                    </CommonTabPanel>

                    {/* ================= TAB 2 : TERMS ================= */}
                    <CommonTabPanel value={tabValue} index={1}>
                      <Box sx={{ mt: 2, display: "grid", gridTemplateColumns: { xs: "1fr", md: "2fr 1fr" }, gap: 3 }}>
                        <Box>
                          <Box display="flex" justifyContent="space-between" mb={2}>
                            <Box fontWeight={600}>Terms & Conditions</Box>
                            <CommonButton startIcon={<Add />} onClick={() => setOpenTermsModal(true)}>
                              New Term
                            </CommonButton>
                          </Box>

                          <table className="w-full text-sm border border-gray-200 dark:border-gray-700">
                            <thead className="bg-gray-100 dark:bg-gray-900 text-gray-700 dark:text-gray-200">
                              <tr>
                                <th className="p-2 w-10">#</th>
                                <th className="p-2 text-left">Condition</th>
                              </tr>
                            </thead>
                            <tbody>
                              {termsData?.data?.map((term, index) => (
                                <tr key={term._id} className="text-gray-600 dark:text-gray-300 bg-white dark:bg-gray-800 even:bg-gray-50 dark:even:bg-gray-dark border-b border-gray-100 dark:border-gray-700">
                                  <td className="p-2">{index + 1}</td>
                                  <td className="p-2">{term.termsCondition}</td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </Box>

                        <Box>
                          <Box fontWeight={600} mb={1}>
                            Note
                          </Box>
                          <CommonValidationTextField name="notes" multiline rows={4} placeholder="Enter a note (max 200 characters)" />
                          <Box mt={1} fontSize={12} textAlign="right">
                            {values.notes?.length || 0}/200 characters
                          </Box>
                        </Box>
                      </Box>
                    </CommonTabPanel>
                  </CommonCard>

                  {/* BILLING SUMMARY */}
                  <Box
                    sx={{
                      mt: 3,
                      display: "grid",
                      gridTemplateColumns: { xs: "1fr", md: "1fr 300px" },
                      gap: 2,
                    }}
                  >
                    <Box />

                    <Box
                      sx={{
                        border: "1px solid",
                        borderColor: "divider",
                        bgcolor: "background.paper",
                        borderRadius: 1,
                        overflow: "hidden",
                      }}
                    >
                      {/* Gross */}
                      <Box className="flex justify-between p-2 border-b">
                        <span>Gross Amount</span>
                        <span>{summary.grossAmount.toFixed(2)}</span>
                      </Box>

                      {/* Flat Discount */}
                      <Box className="flex justify-between p-2 border-b">
                        <span>Flat Discount</span>
                        <CommonValidationTextField name="flatDiscount" type="number" size="small" sx={{ width: 100 }} />
                      </Box>

                      {/* Taxable */}
                      <Box className="flex justify-between p-2 border-b">
                        <span>Taxable Amount</span>
                        <span>{summary.taxableAmount.toFixed(2)}</span>
                      </Box>

                      {/* Tax */}
                      <Box className="flex justify-between p-2 border-b">
                        <span>Tax (%)</span>
                        <CommonValidationTextField name="tax" type="number" size="small" sx={{ width: 100 }} />
                      </Box>

                      {/* Tax Amount */}
                      <Box className="flex justify-between p-2 border-b">
                        <span>Tax Amount</span> 
                        <span>{summary.taxAmount.toFixed(2)}</span>
                      </Box>

                      {/* Round Off */}
                      <Box className="flex justify-between p-2 border-b text-blue-600">
                        <span>Round Off</span>
                        <CommonValidationTextField name="roundOff" type="number" size="small" sx={{ width: 100 }} />
                      </Box>

                      {/* Net */}
                      <Box className="flex justify-between p-3 text-lg font-semibold bg-gray-50 dark:bg-gray-900">
                        <span>Net Amount</span>
                        <span>{summary.netAmount.toFixed(2)}</span>
                      </Box>
                    </Box>
                  </Box>

                  <CommonBottomActionBar save={isEditing} clear={!isEditing} disabled={!dirty} isLoading={addLoading || editLoading} onClear={() => (isEditing ? navigate(-1) : resetForm())} onSave={() => setFieldValue("_submitAction", "save")} onSaveAndNew={() => setFieldValue("_submitAction", "saveAndNew")} />
                </Grid>
              </Form>
            );
          }}
        </Formik>
      </Box>
      <TermsConditionModal openModal={openTermsModal} setOpenModal={setOpenTermsModal} onSave={handleSaveTerm} />
    </>
  );
};

export default PurchaseOrderForm;
