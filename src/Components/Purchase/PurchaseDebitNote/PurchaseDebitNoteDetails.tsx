import { Box, Grid, Typography, IconButton } from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import { CommonValidationDatePicker, CommonValidationSelect, CommonValidationTextField } from "../../../Attribute";
import { REVERSE_CHARGE } from "../../../Data";
import { useFormikContext } from "formik";
import type { ContactAddressApi, ContactBase, PaymentTermsBase, PurchaseDebitNoteFormValues } from "../../../Types";
import { useState, useEffect, useMemo, useRef } from "react";
import { AddressSelectionModal, DependentSelect } from "../../Common";
import { Queries } from "../../../Api";
import { GenerateOptions, DateConfig } from "../../../Utils";

const PurchaseDebitNoteDetails = () => {
  const { values, setFieldValue } = useFormikContext<PurchaseDebitNoteFormValues>();
  const [modalType, setModalType] = useState<"billing" | "shipping" | null>(null);

  const { data: companyData, isLoading: isCompanyLoading } = Queries.useGetCompanyDropdown();
  const companyOptions = GenerateOptions(companyData?.data || []);

  const { data: paymentTermsData } = Queries.useGetPaymentTermsDropdown();
  const { data: supplierData, isLoading: isSupplierLoading, isFetching: isSupplierFetching } = Queries.useGetContactDropdown({ typeFilter: "supplier", companyFilter: values?.companyId }, !!values?.companyId);

  const { data: purchaseOrderData, isLoading: isPurchaseOrderLoading, isFetching: isPurchaseOrderFetching } = Queries.useGetPurchaseOrderDropdown({ companyFilter: values?.companyId, supplierFilter: values?.supplierId }, !!values?.companyId && !!values?.supplierId);
  console.log(purchaseOrderData, "purchaseOrderData");
  const purchaseOrderOptions = useMemo(() => GenerateOptions(purchaseOrderData?.data || []), [purchaseOrderData]);
  const suppliers = useMemo(() => supplierData?.data || [], [supplierData]);

  const selectedSupplier = useMemo(() => suppliers.find((s: ContactBase) => s._id === values.supplierId), [suppliers, values.supplierId]);
  const billingAddressObj = useMemo(() => selectedSupplier?.address?.find((addr: ContactAddressApi) => addr._id === values.billingAddress), [selectedSupplier, values.billingAddress]);
  const shippingAddressObj = useMemo(() => selectedSupplier?.address?.find((addr: ContactAddressApi) => addr._id === values.shippingAddress), [selectedSupplier, values.shippingAddress]);

  const displayBilling = billingAddressObj || selectedSupplier?.address?.[0];
  const displayShipping = shippingAddressObj || selectedSupplier?.address?.[0];

  const handleAddressSelect = (addressId: string) => {
    if (modalType === "billing") {
      if (values.billingAddress !== addressId) setFieldValue("billingAddress", addressId);
    }
    if (modalType === "shipping") {
      if (values.shippingAddress !== addressId) setFieldValue("shippingAddress", addressId);
    }
  };

  // Set default addresses when supplier is selected
  useEffect(() => {
    if (selectedSupplier && selectedSupplier.address && selectedSupplier.address.length > 0) {
      const isBillingValid = selectedSupplier.address.some((a: ContactAddressApi) => a._id === values.billingAddress);
      const isShippingValid = selectedSupplier.address.some((a: ContactAddressApi) => a._id === values.shippingAddress);

      if (!values.billingAddress || !isBillingValid) {
        const firstAddressId = selectedSupplier.address[0]._id;
        if (values.billingAddress !== firstAddressId) {
          setFieldValue("billingAddress", firstAddressId);
        }
      }
      if (!values.shippingAddress || !isShippingValid) {
        const firstAddressId = selectedSupplier.address[0]._id;
        if (values.shippingAddress !== firstAddressId) {
          setFieldValue("shippingAddress", firstAddressId);
        }
      }
    } else if (!selectedSupplier || !selectedSupplier.address || selectedSupplier.address.length === 0) {
      if (values.billingAddress) setFieldValue("billingAddress", "");
      if (values.shippingAddress) setFieldValue("shippingAddress", "");
    }
  }, [selectedSupplier, values.billingAddress, values.shippingAddress, setFieldValue]);

  // Sync due date with date and payment terms
  const prevDateRef = useRef(values.debitNoteDate);
  const prevPaymentTermsRef = useRef(values.paymentTermsId);

  useEffect(() => {
    const dateChanged = values.debitNoteDate !== prevDateRef.current;
    const termChanged = values.paymentTermsId !== prevPaymentTermsRef.current;

    if (dateChanged || termChanged) {
      const selectedTerm = paymentTermsData?.data?.find((t: PaymentTermsBase) => t._id === values.paymentTermsId);

      if (selectedTerm && values.debitNoteDate) {
        const days = selectedTerm.day || 0;

        const newDueDate = DateConfig(values.debitNoteDate).add(days, "day").toISOString();

        setFieldValue("dueDate", newDueDate);
      }
    }

    prevDateRef.current = values.debitNoteDate;
    prevPaymentTermsRef.current = values.paymentTermsId;
  }, [values.paymentTermsId, values.debitNoteDate, paymentTermsData]);

  return (
    <Grid container spacing={2} sx={{ p: 2 }}>
      <Grid size={{ xs: 12, md: 3 }} container spacing={2}>
        <CommonValidationSelect name="companyId" label="Select Company" required options={companyOptions} isLoading={isCompanyLoading} grid={{ xs: 12 }} />

        <Grid size={{ xs: 12 }} container spacing={2} sx={{ display: { xs: "none", md: "flex" } }}>
          <Grid size={{ xs: 12 }}>
            <Box display="flex" flexDirection="column" gap={0.5}>
              <Typography variant="caption" color="text.secondary" fontWeight={600}>
                Place of Supply: {displayBilling?.state?.name || "-"}
              </Typography>
            </Box>
          </Grid>

          <Grid size={{ xs: 12, md: 6 }}>
            <Box display="flex" flexDirection="column" gap={0.5}>
              <Box display="flex" justifyContent="space-between" alignItems="center">
                <Typography variant="caption" color="text.secondary" fontWeight={600}>
                  Billing Address :
                </Typography>
                {selectedSupplier && (
                  <IconButton size="small" onClick={() => setModalType("billing")} sx={{ p: 0.5 }}>
                    <EditIcon sx={{ fontSize: 14 }} />
                  </IconButton>
                )}
              </Box>
              {displayBilling ? (
                <Typography variant="body2" color="text.secondary">
                  {displayBilling.addressLine1}, {displayBilling.city?.name}, {displayBilling.state?.name}, {displayBilling.pinCode}
                </Typography>
              ) : (
                <Typography variant="body2" color="text.secondary">
                  {!values?.supplierId ? "-" : "Billing Address is not provided"}
                </Typography>
              )}
            </Box>
          </Grid>

          <Grid size={{ xs: 12, md: 6 }}>
            <Box display="flex" flexDirection="column" gap={0.5}>
              <Box display="flex" justifyContent="space-between" alignItems="center">
                <Typography variant="caption" color="text.secondary" fontWeight={600}>
                  Shipping Address :
                </Typography>
                {selectedSupplier && (
                  <IconButton size="small" onClick={() => setModalType("shipping")} sx={{ p: 0.5 }}>
                    <EditIcon sx={{ fontSize: 14 }} />
                  </IconButton>
                )}
              </Box>
              {displayShipping ? (
                <Typography variant="body2" color="text.secondary">
                  {displayShipping.addressLine1}, {displayShipping.city?.name}, {displayShipping.state?.name}, {displayShipping.pinCode}
                </Typography>
              ) : (
                <Typography variant="body2" color="text.secondary">
                  {!values?.supplierId ? "-" : "Shipping Address is not provided"}
                </Typography>
              )}
            </Box>
          </Grid>
        </Grid>
      </Grid>

      <Grid size={{ xs: 12, md: 9 }} container spacing={2}>
        <CommonValidationSelect name="supplierId" label="Select Supplier" required options={GenerateOptions(suppliers)} disabled={!values.companyId} isLoading={isSupplierLoading || isSupplierFetching} grid={{ xs: 12, md: 4 }} />

        <CommonValidationDatePicker name="debitNoteDate" label="Debit Note Date" required grid={{ xs: 12, md: 4 }} />

        <DependentSelect name="paymentTermsId" label="Payment Term" query={Queries.useGetPaymentTermsDropdown} params={{ companyFilter: values.companyId }} enabled={Boolean(values.companyId)} disabled={!values.companyId} grid={{ xs: 12, md: 4 }} />

        <CommonValidationDatePicker name="dueDate" label="Due Date" grid={{ xs: 12, md: 4 }} />

        <CommonValidationSelect name="purchaseId" label="Select Purchase" options={purchaseOrderOptions} disabled={!values.companyId || !values.supplierId} isLoading={isPurchaseOrderLoading || isPurchaseOrderFetching} grid={{ xs: 12, md: 4 }} />

        <CommonValidationTextField name="referenceBillNo" label="Reference Bill No" grid={{ xs: 12, md: 4 }} />

        <CommonValidationSelect name="reverseCharge" label="Reverse Charge" options={REVERSE_CHARGE} grid={{ xs: 12, md: 4 }} />

        <CommonValidationTextField name="reason" label="Reason" placeholder="Enter reason" grid={{ xs: 12, md: 4 }} />

        <CommonValidationTextField name="exportSez" label="Export SEZ" placeholder="Enter Export SEZ" grid={{ xs: 12, md: 4 }} />

        {/* <CommonValidationSelect name="status" label="Status" options={[{ label: "Open", value: "open" }, { label: "Closed", value: "closed" }, { label: "Cancelled", value: "cancelled" }]} grid={{ xs: 12, md: 4 }} /> */}
      </Grid>

      <Grid size={{ xs: 12 }} container spacing={2} sx={{ display: { xs: "flex", md: "none" } }}>
        <Grid size={{ xs: 12 }}>
          <Box display="flex" flexDirection="column" gap={0.5}>
            <Typography variant="caption" color="text.secondary" fontWeight={600}>
              Place of Supply: {displayBilling?.state?.name || "-"}
            </Typography>
          </Box>
        </Grid>

        <Grid size={{ xs: 12, md: 6 }}>
          <Box display="flex" flexDirection="column" gap={0.5}>
            <Box display="flex" justifyContent="space-between" alignItems="center">
              <Typography variant="caption" color="text.secondary" fontWeight={600}>
                Billing Address :
              </Typography>
              {selectedSupplier && (
                <IconButton size="small" onClick={() => setModalType("billing")} sx={{ p: 0.5 }}>
                  <EditIcon sx={{ fontSize: 14 }} />
                </IconButton>
              )}
            </Box>
            {displayBilling ? (
              <Typography variant="body2" color="text.secondary">
                {displayBilling.addressLine1}, {displayBilling.city?.name}, {displayBilling.state?.name}, {displayBilling.pinCode}
              </Typography>
            ) : (
              <Typography variant="body2" color="text.secondary">
                {!values?.supplierId ? "-" : "Billing Address is not provided"}
              </Typography>
            )}
          </Box>
        </Grid>

        <Grid size={{ xs: 12, md: 6 }}>
          <Box display="flex" flexDirection="column" gap={0.5}>
            <Box display="flex" justifyContent="space-between" alignItems="center">
              <Typography variant="caption" color="text.secondary" fontWeight={600}>
                Shipping Address :
              </Typography>
              {selectedSupplier && (
                <IconButton size="small" onClick={() => setModalType("shipping")} sx={{ p: 0.5 }}>
                  <EditIcon sx={{ fontSize: 14 }} />
                </IconButton>
              )}
            </Box>
            {displayShipping ? (
              <Typography variant="body2" color="text.secondary">
                {displayShipping.addressLine1}, {displayShipping.city?.name}, {displayShipping.state?.name}, {displayShipping.pinCode}
              </Typography>
            ) : (
              <Typography variant="body2" color="text.secondary">
                {!values?.supplierId ? "-" : "Shipping Address is not provided"}
              </Typography>
            )}
          </Box>
        </Grid>
      </Grid>

      <AddressSelectionModal isOpen={Boolean(modalType)} onClose={() => setModalType(null)} addresses={selectedSupplier?.address || []} onSelect={handleAddressSelect} selectedAddressId={modalType === "billing" ? values.billingAddress : values.shippingAddress} title={modalType === "billing" ? "Select Billing Address" : "Select Shipping Address"} />
    </Grid>
  );
};

export default PurchaseDebitNoteDetails;
