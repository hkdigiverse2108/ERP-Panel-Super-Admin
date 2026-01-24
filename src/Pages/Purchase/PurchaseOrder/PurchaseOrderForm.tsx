import { Box, Grid, Button, IconButton } from "@mui/material";
import { Form, Formik, FieldArray, useFormikContext } from "formik";
import { useNavigate, useLocation } from "react-router-dom";
import { Add, Delete } from "@mui/icons-material";
import { Mutations, Queries } from "../../../Api";
import { CommonValidationTextField, CommonValidationSelect } from "../../../Attribute";
import { CommonBottomActionBar, CommonBreadcrumbs, CommonCard } from "../../../Components/Common";
import { PAGE_TITLE } from "../../../Constants";
import { TAX_TYPE, ORDER_STATUS } from "../../../Data";
import { GetChangedFields, RemoveEmptyFields } from "../../../Utils";
import type { FormikHelpers } from "formik";
import type { PurchaseOrderFormValues } from "../../../Types";

const PurchaseOrderCalcSync = () => {
  const { values, setFieldValue } = useFormikContext<PurchaseOrderFormValues>();

  const itemsTotal = values.items.reduce((sum, item, index) => {
    const total = (item.qty || 0) * (item.unitCost || 0);
    setFieldValue(`items.${index}.total`, total || 0);
    return sum + total;
  }, 0);

  const discount = values.flatDiscount || 0;
  const taxableAmount = Math.max(itemsTotal - discount, 0);
  const taxAmount = values.tax || 0;
  const roundOff = values.roundOff || 0;

  const netAmount = taxableAmount + taxAmount + roundOff;

  setFieldValue("grossAmount", itemsTotal);
  setFieldValue("taxableAmount", taxableAmount);
  setFieldValue("netAmount", netAmount);

  return null;
};

const PurchaseOrderForm = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { data } = location.state || {};

  const isEditing = Boolean(data?._id);

  const { mutate: addPurchaseOrder, isPending: addLoading } = Mutations.useAddPurchaseOrder();
  const { mutate: editPurchaseOrder, isPending: editLoading } = Mutations.useEditPurchaseOrder();

  // const { data: supplierData } = Queries.useGetSupplierDropdown();
  // const { data: productData } = Queries.useGetProductDropdown();

  const initialValues: PurchaseOrderFormValues = {
    supplierId: data?.supplierId?._id || "",
    orderDate: data?.orderDate || "",
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
    status: data?.status || ORDER_STATUS.IN_PROGRESS,
  };

  const handleSubmit = async (values: PurchaseOrderFormValues, { resetForm }: FormikHelpers<PurchaseOrderFormValues>) => {
    if (isEditing) {
      const changedFields = GetChangedFields(values, data);
      editPurchaseOrder({ ...changedFields, purchaseOrderId: data._id }, { onSuccess: () => navigate(-1) });
    } else {
      addPurchaseOrder(RemoveEmptyFields(values), {
        onSuccess: () => resetForm(),
      });
    }
  };

  return (
    <>
      <CommonBreadcrumbs title={PAGE_TITLE.PURCHASE.PURCHASE_ORDER[pageMode]} breadcrumbs={BREADCRUMBS.PURCHASE_ORDER[pageMode]} />

      <Box sx={{ p: 3, mb: 8 }}>
        <Formik initialValues={initialValues} onSubmit={handleSubmit}>
          {({ values, dirty }) => (
            <Form noValidate>
              <PurchaseOrderCalcSync />

              <Grid container spacing={2}>
                {/* BASIC DETAILS */}
                <CommonCard title="Purchase Order Details" grid={{ xs: 12 }}>
                  <Grid container spacing={2} sx={{ p: 2 }}>
                    <CommonValidationSelect name="supplierId" label="Supplier" options={supplierData?.data || []} required grid={{ xs: 12, md: 4 }} />

                    <CommonValidationTextField name="orderDate" label="Order Date" type="date" required grid={{ xs: 12, md: 4 }} />

                    <CommonValidationTextField name="orderNo" label="Order No" grid={{ xs: 12, md: 4 }} />

                    <CommonValidationSelect name="taxType" label="Tax Type" options={TAX_TYPE} grid={{ xs: 12, md: 4 }} />
                  </Grid>
                </CommonCard>

                {/* ITEMS */}
                <CommonCard title="Items" grid={{ xs: 12 }}>
                  <FieldArray name="items">
                    {({ push, remove }) => (
                      <>
                        {values.items.map((_, index) => (
                          <Grid container spacing={2} sx={{ p: 2 }} key={index}>
                            <CommonValidationSelect name={`items.${index}.productId`} label="Product" options={productData?.data || []} required grid={{ xs: 12, md: 3 }} />

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

                {/* SUMMARY */}
                <CommonCard title="Summary" grid={{ xs: 12 }}>
                  <Grid container spacing={2} sx={{ p: 2 }}>
                    <CommonValidationTextField name="grossAmount" label="Gross Amount" disabled />
                    <CommonValidationTextField name="flatDiscount" label="Flat Discount" type="number" />
                    <CommonValidationTextField name="taxableAmount" label="Taxable Amount" disabled />
                    <CommonValidationTextField name="tax" label="Tax" type="number" />
                    <CommonValidationTextField name="roundOff" label="Round Off" type="number" />
                    <CommonValidationTextField name="netAmount" label="Net Amount" disabled />
                  </Grid>
                </CommonCard>

                {/* NOTES */}
                <CommonCard title="Notes" grid={{ xs: 12 }}>
                  <Grid container spacing={2} sx={{ p: 2 }}>
                    <CommonValidationTextField name="notes" label="Notes" multiline rows={3} grid={{ xs: 12 }} />
                  </Grid>
                </CommonCard>

                {/* ACTIONS */}
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
