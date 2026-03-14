import { Box, Grid, Typography, IconButton } from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import { CommonValidationDatePicker, CommonValidationSelect } from "../../../Attribute";
import { PAYMENT_TERMS_OPTIONS, REVERSE_CHARGE, TAX_TYPE } from "../../../Data";
import { useFormikContext } from "formik";
import type { EstimateFormValues } from "../../../Types";
import { useState, useEffect, useRef } from "react";
import { AddressSelectionModal } from "../../Common";
import { Queries } from "../../../Api";
import { GenerateOptions, DateConfig } from "../../../Utils";

const EstimateDetails = () => {
  const { values, setFieldValue } = useFormikContext<EstimateFormValues>();
  const [modalType, setModalType] = useState<"billing" | "shipping" | null>(null);

  const { data: companyData, isLoading: isCompanyLoading } = Queries.useGetCompanyDropdown();
  const companyOptions = GenerateOptions(companyData?.data || []);

  const { data: customerData, isLoading: isCustomerLoading, isFetching: isCustomerFetching } = Queries.useGetContactDropdown({ typeFilter: "customer", companyFilter: values?.companyId }, !!values?.companyId);
  const customers = customerData?.data || [];

  // console.log("values", values, customers);
  const selectedCustomer = customers.find((c) => c._id === values.customerId);
  const billingAddressObj = selectedCustomer?.address?.find((addr: any) => addr._id === values.billingAddress);
  const shippingAddressObj = selectedCustomer?.address?.find((addr: any) => addr._id === values.shippingAddress);

  // Fallback to first address if not selected yet (optional, or just show provided/not provided)
  const displayBilling = billingAddressObj || selectedCustomer?.address?.[0];
  const displayShipping = shippingAddressObj || selectedCustomer?.address?.[0];

  const handleAddressSelect = (addressId: string) => {
    if (modalType === "billing") setFieldValue("billingAddress", addressId);
    if (modalType === "shipping") setFieldValue("shippingAddress", addressId);
  };

  // Set default addresses when customer is selected
  useEffect(() => {
    if (selectedCustomer && selectedCustomer.address && selectedCustomer.address.length > 0) {
      const isBillingValid = selectedCustomer.address.some((a: any) => a._id === values.billingAddress);
      const isShippingValid = selectedCustomer.address.some((a: any) => a._id === values.shippingAddress);

      if (!values.billingAddress || !isBillingValid) {
        setFieldValue("billingAddress", selectedCustomer.address[0]._id);
      }
      if (!values.shippingAddress || !isShippingValid) {
        setFieldValue("shippingAddress", selectedCustomer.address[0]._id);
      }
    } else if (!selectedCustomer || !selectedCustomer.address || selectedCustomer.address.length === 0) {
      if (values.billingAddress) setFieldValue("billingAddress", "");
      if (values.shippingAddress) setFieldValue("shippingAddress", "");
    }
  }, [selectedCustomer, values.billingAddress, values.shippingAddress, setFieldValue]);

  // Sync place of supply with billing address
  useEffect(() => {
    const activeBilling = selectedCustomer?.address?.find((a: any) => a._id === values.billingAddress) || selectedCustomer?.address?.[0];
    if (activeBilling?.state?.name) {
      setFieldValue("placeOfSupply", activeBilling.state.name);
    }
  }, [values.billingAddress, selectedCustomer, setFieldValue]);

  // Sync due date with date and payment terms
  const prevDateRef = useRef(values.date);
  const prevPaymentTermsRef = useRef(values.paymentTerms);

  useEffect(() => {
    const dateChanged = values.date !== prevDateRef.current;
    const termsChanged = values.paymentTerms !== prevPaymentTermsRef.current;

    if (dateChanged || termsChanged) {
      if (values.paymentTerms && values.date) {
        const days = parseInt(values.paymentTerms.split("_")[0]);
        if (!isNaN(days)) {
          const newDueDate = DateConfig(values.date).add(days, "day").toISOString();
          setFieldValue("dueDate", newDueDate);
        }
      }
      prevDateRef.current = values.date;
      prevPaymentTermsRef.current = values.paymentTerms;
    }
  }, [values.paymentTerms, values.date, setFieldValue]);

  return (
    <Grid container spacing={2} sx={{ p: 2 }}>
      <Grid size={{ xs: 12, md: 3 }} sx={{ order: { xs: 1, md: 1 } }}>
        <CommonValidationSelect name="companyId" label="Select Company" required options={companyOptions} isLoading={isCompanyLoading} />
      </Grid>

      <Grid size={{ xs: 12, md: 3 }} sx={{ order: { xs: 2, md: 2 } }}>
        <CommonValidationSelect name="customerId" label="Select Customer" required options={GenerateOptions(customers)} disabled={!values.companyId} isLoading={isCustomerLoading || isCustomerFetching} />
      </Grid>

      <Grid size={{ xs: 12, md: 3 }} sx={{ order: { xs: 3, md: 3 } }}>
        <CommonValidationDatePicker name="date" label="Estimate Date" required />
      </Grid>

      <Grid size={{ xs: 12, md: 3 }} sx={{ order: { xs: 4, md: 4 } }}>
        <CommonValidationSelect name="paymentTerms" label="Payment Term" options={PAYMENT_TERMS_OPTIONS} />
      </Grid>

      <Grid size={{ xs: 12, md: 3 }} container spacing={2} sx={{ order: { xs: 10, md: 5 } }}>
        <Grid size={{ xs: 12, md: 12 }}>
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
              {selectedCustomer && (
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
                {!values?.customerId ? "-" : "Billing Address is not provided"}
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
              {selectedCustomer && (
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
                {!values?.customerId ? "-" : "Shipping Address is not provided"}
              </Typography>
            )}
          </Box>
        </Grid>
      </Grid>

      <Grid size={{ xs: 12, md: 3 }} sx={{ order: { xs: 5, md: 5 } }}>
        <CommonValidationDatePicker name="dueDate" label="Due Date" required />
      </Grid>

      <Grid size={{ xs: 12, md: 3 }} sx={{ order: { xs: 6, md: 6 } }}>
        <CommonValidationSelect name="taxType" label="Tax Type" options={TAX_TYPE} />
      </Grid>

      <Grid size={{ xs: 12, md: 3 }} sx={{ order: { xs: 7, md: 7 } }}>
        <CommonValidationSelect name="reverseCharge" label="Reverse Charge" options={REVERSE_CHARGE} />
      </Grid>

      <AddressSelectionModal isOpen={Boolean(modalType)} onClose={() => setModalType(null)} addresses={selectedCustomer?.address || []} onSelect={handleAddressSelect} selectedAddressId={modalType === "billing" ? values.billingAddress : values.shippingAddress} title={modalType === "billing" ? "Select Billing Address" : "Select Shipping Address"} />
    </Grid>
  );
};

export default EstimateDetails;
