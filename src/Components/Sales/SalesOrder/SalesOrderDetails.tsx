import { Box, Grid, Typography, IconButton } from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import { CommonValidationDatePicker, CommonValidationSelect } from "../../../Attribute";
import { REVERSE_CHARGE, TAX_TYPE } from "../../../Data";
import { useFormikContext } from "formik";
import type { ContactAddressApi, PaymentTermsBase, SalesOrderFormValues } from "../../../Types";
import { useState, useEffect, useRef, useMemo } from "react";
import { AddressSelectionModal, DependentSelect } from "../../Common";
import { Queries } from "../../../Api";
import { GenerateOptions, DateConfig } from "../../../Utils";

const SalesOrderDetails = ({ isEditing }: { isEditing: boolean }) => {
  const { values, setFieldValue } = useFormikContext<SalesOrderFormValues>();
  const [modalType, setModalType] = useState<"billing" | "shipping" | null>(null);

  const { data: companyData, isLoading: isCompanyLoading } = Queries.useGetCompanyDropdown();
  const companyOptions = GenerateOptions(companyData?.data || []);
  const { data: paymentTermsData } = Queries.useGetPaymentTermsDropdown();

  const { data: customerData, isLoading: isCustomerLoading, isFetching: isCustomerFetching } = Queries.useGetContactDropdown({ typeFilter: "customer", companyFilter: values?.companyId }, !!values?.companyId);

  const { data: estimateData, isLoading: isEstimateLoading, isFetching: isEstimateFetching } = Queries.useGetEstimateDropdown({ companyFilter: values?.companyId, branchFilter: values?.branchId, customerId: values?.customerId, includeId: values?.selectedEstimateId }, !!values?.companyId && !!values?.customerId && !!values?.branchId);

  const { data: salesPersonData, isLoading: isSalesPersonLoading, isFetching: isSalesPersonFetching } = Queries.useGetUserDropdown({ companyFilter: values?.companyId }, !!values?.companyId);

  const customers = useMemo(() => customerData?.data || [], [customerData]);
  const salesPersonOptions = useMemo(() => GenerateOptions(salesPersonData?.data || []), [salesPersonData]);

  const selectedCustomer = useMemo(() => customers.find((c) => c._id === values.customerId), [customers, values.customerId]);
  const billingAddressObj = useMemo(() => selectedCustomer?.address?.find((addr: ContactAddressApi) => addr._id === values.billingAddress), [selectedCustomer, values.billingAddress]);
  const shippingAddressObj = useMemo(() => selectedCustomer?.address?.find((addr: ContactAddressApi) => addr._id === values.shippingAddress), [selectedCustomer, values.shippingAddress]);

  const displayBilling = billingAddressObj || selectedCustomer?.address?.[0];
  const displayShipping = shippingAddressObj || selectedCustomer?.address?.[0];

  const handleAddressSelect = (addressId: string) => {
    if (modalType === "billing") {
      if (values.billingAddress !== addressId) setFieldValue("billingAddress", addressId);
    }
    if (modalType === "shipping") {
      if (values.shippingAddress !== addressId) setFieldValue("shippingAddress", addressId);
    }
  };

  // Set default addresses when customer is selected
  useEffect(() => {
    if (selectedCustomer && selectedCustomer.address && selectedCustomer.address.length > 0) {
      const isBillingValid = selectedCustomer.address.some((a: ContactAddressApi) => a._id === values.billingAddress);
      const isShippingValid = selectedCustomer.address.some((a: ContactAddressApi) => a._id === values.shippingAddress);

      if (!values.billingAddress || !isBillingValid) {
        const firstAddressId = selectedCustomer.address[0]._id;
        if (values.billingAddress !== firstAddressId) {
          setFieldValue("billingAddress", firstAddressId);
        }
      }
      if (!values.shippingAddress || !isShippingValid) {
        const firstAddressId = selectedCustomer.address[0]._id;
        if (values.shippingAddress !== firstAddressId) {
          setFieldValue("shippingAddress", firstAddressId);
        }
      }
    } else if (!selectedCustomer || !selectedCustomer.address || selectedCustomer.address.length === 0) {
      if (values.billingAddress) setFieldValue("billingAddress", "");
      if (values.shippingAddress) setFieldValue("shippingAddress", "");
    }
  }, [selectedCustomer, values.billingAddress, values.shippingAddress, setFieldValue]);

  // Sync place of supply with billing address
  useEffect(() => {
    const activeBilling = selectedCustomer?.address?.find((a: ContactAddressApi) => a._id === values.billingAddress) || selectedCustomer?.address?.[0];
    if (activeBilling?.state?.name) {
      if (values.placeOfSupply !== activeBilling.state.name) {
        setFieldValue("placeOfSupply", activeBilling.state.name);
      }
    }
  }, [values.billingAddress, selectedCustomer, values.placeOfSupply, setFieldValue]);

  // Sync due date with date and payment terms
  const prevDateRef = useRef(values.date);
  const prevPaymentTermsRef = useRef(values.paymentTermsId);

  useEffect(() => {
    const dateChanged = values.date !== prevDateRef.current;
    const termsChanged = values.paymentTermsId !== prevPaymentTermsRef.current;

    if (dateChanged || termsChanged) {
      const selectedTerm = paymentTermsData?.data?.find((t: PaymentTermsBase) => t._id === values.paymentTermsId);

      if (selectedTerm && values.date) {
        const days = selectedTerm.day || 0;

        const newDueDate = DateConfig(values.date).add(days, "day").toISOString();

        if (values.dueDate !== newDueDate) {
          setFieldValue("dueDate", newDueDate);
        }
      }
    }

    prevDateRef.current = values.date;
    prevPaymentTermsRef.current = values.paymentTermsId;
  }, [values.paymentTermsId, values.date, values.dueDate, paymentTermsData]);

  return (
    <Grid container spacing={2} sx={{ p: 2 }}>
      <Grid size={{ xs: 12, md: 3 }} container spacing={2}>
        <CommonValidationSelect name="companyId" label="Select Company" required options={companyOptions} isLoading={isCompanyLoading} grid={{ xs: 12 }} />
        <Grid
          size={{ xs: 12, md: 12 }}
          container
          spacing={2}
          sx={{
            order: { xs: 10, md: 5 },
            display: { xs: "none", md: "flex" },
          }}
        >
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
      </Grid>

      <Grid size={{ xs: 12, md: 9 }} container spacing={2}>
        <DependentSelect name="branchId" label="Select Branch" query={Queries.useGetBranchDropdown} params={{ companyFilter: values.companyId }} enabled={Boolean(values.companyId)} disabled={!values.companyId} grid={{ xs: 12, md: 4 }} required />
        <CommonValidationSelect name="customerId" label="Select Customer" required options={GenerateOptions(customers)} disabled={!values.companyId} isLoading={isCustomerLoading || isCustomerFetching} grid={{ xs: 12, md: 4 }} />

        <CommonValidationDatePicker name="date" label="Sales Order Date" required grid={{ xs: 12, md: 4 }} />

        <DependentSelect name="paymentTermsId" label="Payment Term" query={Queries.useGetPaymentTermsDropdown} params={{ companyFilter: values.companyId }} enabled={Boolean(values.companyId)} disabled={!values.companyId} grid={{ xs: 12, md: 4 }} />

        <CommonValidationDatePicker name="dueDate" label="Due Date" grid={{ xs: 12, md: 4 }} />

        <CommonValidationSelect name="taxType" label="Tax Type" options={TAX_TYPE} grid={{ xs: 12, md: 4 }} />

        <CommonValidationSelect name="salesManId" label="Sales Person" options={salesPersonOptions} disabled={!values.companyId} isLoading={isSalesPersonLoading || isSalesPersonFetching} grid={{ xs: 12, md: 4 }} />

        <CommonValidationSelect name="selectedEstimateId" label="Reference Estimate" options={GenerateOptions(estimateData?.data || [])} disabled={!values.companyId || !values.branchId || !values.customerId || isEditing} isLoading={isEstimateLoading || isEstimateFetching} grid={{ xs: 12, md: 4 }} />

        <CommonValidationSelect name="reverseCharge" label="Reverse Charge" options={REVERSE_CHARGE} grid={{ xs: 12, md: 4 }} />
      </Grid>

      <Grid
        size={{ xs: 12, md: 12 }}
        container
        spacing={2}
        sx={{
          order: { xs: 10, md: 5 },
          display: { xs: "flex", md: "none" },
        }}
      >
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

      <AddressSelectionModal isOpen={Boolean(modalType)} onClose={() => setModalType(null)} addresses={selectedCustomer?.address || []} onSelect={handleAddressSelect} selectedAddressId={modalType === "billing" ? values.billingAddress : values.shippingAddress} title={modalType === "billing" ? "Select Billing Address" : "Select Shipping Address"} />
    </Grid>
  );
};

export default SalesOrderDetails;
