import { Add, Delete } from "@mui/icons-material";
import { Box, Button, Grid, IconButton } from "@mui/material";
import type { FormikHelpers } from "formik";
import { FieldArray, Form, Formik, useFormikContext } from "formik";
import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Mutations } from "../../../Api";
import { CommonValidationDatePicker, CommonValidationSelect, CommonValidationTextField } from "../../../Attribute";
import { CommonBottomActionBar, CommonBreadcrumbs, CommonCard } from "../../../Components/Common";
import { PAGE_TITLE } from "../../../Constants";
import { BREADCRUMBS, TAX_TYPE } from "../../../Data";
import type { PurchaseOrderFormValues } from "../../../Types";
import { GetChangedFields, RemoveEmptyFields } from "../../../Utils";

const PurchaseOrderForm = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { data } = location.state || {};

  const isEditing = Boolean(data?._id);

  const { mutate: addPurchaseOrder, isPending: addLoading } = Mutations.useAddPurchaseOrder();
  const { mutate: editPurchaseOrder, isPending: editLoading } = Mutations.useEditPurchaseOrder();

  const { data: supplierData } = Queries.useGetContactDropdown({ type: "supplier" });
  const { data: productData } = Queries.useGetProductDropdown();
   
  const pageMode = isEditing ? "EDIT" : "ADD";
  const initialValues: PurchaseOrderFormValues = {
    supplierId: data?.supplierId?._id || "",
    contactId: data?.contactId?._id || "",
    date: data?.date || data?.orderDate || "",
    orderNo: data?.orderNo || "",
    shippingDate: data?.shippingDate || "",
    shippingNote: data?.shippingNote || "",
    taxType: data?.taxType || "",

    items: data?.items?.length
      ? data.items
      : [
          {
            productId: "",  
            qty: 1,
            unitCost: 0,
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
  };

  const PurchaseOrderCalcSync = () => {
    const { values, setFieldValue } = useFormikContext<PurchaseOrderFormValues>();

    useEffect(() => {
      const itemsTotal =
        values.items?.reduce((sum, item, index) => {
          const total = (item.qty || 0) * (item.unitCost || 0);
          if (values.items?.[index]?.total !== total) {
            setFieldValue(`items.${index}.total`, total);
          }
          return sum + total;
        }, 0) ?? 0;

      const discount = values.flatDiscount || 0;
      const taxableAmount = Math.max(itemsTotal - discount, 0);
      const taxAmount = values.tax || 0;
      const roundOff = values.roundOff || 0;

      const netAmount = taxableAmount + taxAmount + roundOff;

      if (values.grossAmount !== itemsTotal) setFieldValue("grossAmount", itemsTotal);
      if (values.taxableAmount !== taxableAmount) setFieldValue("taxableAmount", taxableAmount); 
      if (values.netAmount !== netAmount) setFieldValue("netAmount", netAmount);
    }, [values.items, values.flatDiscount, values.tax, values.roundOff, setFieldValue, values.grossAmount, values.taxableAmount, values.netAmount]);

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
     await addPurchaseOrder(RemoveEmptyFields(rest) as any, {onSuccess: handleSuccess});
    }
  };

  return (
    <>
      <CommonBreadcrumbs title={PAGE_TITLE.PURCHASE_ORDER[pageMode]} breadcrumbs={BREADCRUMBS.PURCHASE_ORDER[pageMode]} />

      <Box sx={{ p: 3, mb: 8 }}>
        <Formik initialValues={initialValues} onSubmit={handleSubmit}>
          {({ values, dirty }) => (
            <Form noValidate>
              <PurchaseOrderCalcSync /> 

              <Grid container spacing={2}>
                {/* BASIC DETAILS */}
                <CommonCard title="Purchase Order Details" grid={{ xs: 12 }}>
                  <Grid container spacing={2} sx={{ p: 2 }}>
                    <CommonValidationSelect name="supplierId" label="Supplier" options={GenerateOptions(supplierData?.data)} required grid={{ xs: 12, md: 4 }} /> 

                     <CommonValidationDatePicker name="date" label="OrderDate" grid={{ xs: 12, md: 4 }} required />

                    <CommonValidationTextField name="orderNo" label="Order No" grid={{ xs: 12, md: 4 }} />
                    <CommonValidationSelect name="taxType" label="Tax Type" options={TAX_TYPE} grid={{ xs: 12, md: 4 }} />
                  </Grid>
                </CommonCard>

                {/* ITEMS */}
                <CommonCard title="Items" grid={{ xs: 12 }}>  
                  <FieldArray name="items">
                    {({ push, remove }) => (
                      <>
                       {values.items?.map((_, index) => (
                          <Grid container spacing={2} sx={{ p: 2 }} key={index}>
                            <CommonValidationSelect name={`items.${index}.productId`} label="Product" options={GenerateOptions(productData?.data)} required grid={{ xs: 12, md: 3 }} />

                              <CommonValidationTextField name={`items.${index}.qty`} label="Qty" type="number" required grid={{ xs: 12, md: 2 }} />

                              <CommonValidationTextField name={`items.${index}.unitCost`} label="Unit Cost" type="number" grid={{ xs: 12, md: 2 }} />

                              <CommonValidationTextField name={`items.${index}.total`} label="Total" disabled grid={{ xs: 12, md: 2 }} />

                              <Grid size="auto">
                                <IconButton color="error" onClick={() => remove(index)}>
                                  <Delete />
                                </IconButton>
                              </Grid>
                            </Grid>
                          ))}

                          <Button
                            startIcon={<Add />}
                            onClick={() =>
                              push({
                                productId: "",
                                qty: 1,
                                unitCost: 0,
                                total: 0,
                              })
                            }
                          >
                            Add Item
                          </Button>
                        </>
                      )}
                    </FieldArray>
                  </CommonCard>
                
                <CommonCard title="Notes" grid={{ xs: 12 }}>
                  <Grid container spacing={2} sx={{ p: 2 }}>
                    <CommonValidationTextField name="notes" label="Notes" multiline rows={3} grid={{ xs: 12 }} />
                  </Grid>
                </CommonCard>

                
                {/* BILLING SUMMARY */}
                <Grid size={{ xs: 12 }}>
                  <Box sx={{ display: "flex", justifyContent: "flex-end", mt: 2 }}>
                    <Box sx={{ p: 2, bgcolor: "#f3f4f6", borderRadius: 2, width: { xs: "100%", md: "40%", lg: "30%" } }}>
                      <Grid container spacing={1}>
                        {[
                          { label: "Gross Amount", name: "grossAmount", disabled: true },
                          { label: "Flat Discount", name: "flatDiscount", type: "number" },
                          { label: "Discount", name: "discountAmount", disabled: true },
                          { label: "Taxable Amount", name: "taxableAmount", disabled: true },
                          { label: "Tax", name: "tax", type: "number" },
                          { label: "Round Off", name: "roundOff", type: "number" },
                          { label: "Net Amount", name: "netAmount", disabled: true, sx: { fontWeight: "bold", fontSize: "1.2rem", color: "text.primary" } },
                        ].map((field) => (
                          <Grid container key={field.name} alignItems="center" justifyContent="space-between" sx={{ mb: 1 }}>
                            <Grid size={{ xs: 5 }}>
                              <Box sx={{ ...field.sx, textAlign: "right", pr: 2, fontSize: "0.9rem" }}>{field.label}</Box>
                            </Grid>
                            <Grid size={{ xs: 7 }}>
                              <CommonValidationTextField
                                name={field.name}
                                label=""
                                type={field.type}
                                disabled={field.disabled}
                                size="small"
                                sx={{
                                  "& .MuiInputBase-input": { textAlign: "right", py: 0.5, ...field.sx },
                                  "& .MuiOutlinedInput-root": { bgcolor: "background.paper" },
                                }}
                              />
                            </Grid>
                          </Grid>
                        ))}
                      </Grid>
                    </Box>
                  </Box>
                </Grid>

                <CommonBottomActionBar save disabled={!dirty} isLoading={addLoading || editLoading} />
              </Grid>
            </Form>
          )}
        </Formik>
      </Box>
    </>
  );
};

export default PurchaseOrderForm;
