import { Box, Grid, IconButton, Typography } from "@mui/material";
import { useFormikContext } from "formik";
import { Queries } from "../../../Api";
import { CommonValidationDatePicker, CommonValidationSelect, CommonValidationTextField } from "../../../Attribute";
import { REVERSE_CHARGE, TAX_TYPE } from "../../../Data";
import { DateConfig, GenerateOptions } from "../../../Utils";
import { AddressSelectionModal, DependentSelect } from "../../Common";
import { useState, useEffect, useRef, useMemo } from "react";
import EditIcon from "@mui/icons-material/Edit";
import type { ContactAddressApi, ContactBase, PaymentTermsBase, SupplierBillFormValues } from "../../../Types";

const SupplierBillDetails = () => {
  const { values, setFieldValue } = useFormikContext<SupplierBillFormValues>();
  const [addressModal, setAddressModal] = useState<boolean>(false);

  const { data: paymentTermsData } = Queries.useGetPaymentTermsDropdown();
  const { data: companyData, isLoading: isCompanyLoading } = Queries.useGetCompanyDropdown();
  const companyOptions = GenerateOptions(companyData?.data || []);
  const { data: supplierData, isLoading: supplierDataLoading, isFetching: supplierDataFetching } = Queries.useGetContactDropdown({ activeFilter: true, typeFilter: "supplier", companyFilter: values.companyId }, !!values.companyId);
  // Use useMemo to avoid re-calculating (and creating new references) on every render
  const suppliers = useMemo(() => {
    return (supplierData?.data || []).map((s: ContactBase) => ({
      ...s,
      name: s.companyName || `${s.firstName} ${s.lastName}`,
    }));
  }, [supplierData?.data]);

  const supplierOptions = useMemo(() => GenerateOptions(suppliers), [suppliers]);

  const selectedSupplier = useMemo(() => suppliers.find((s: ContactBase) => s._id === values.supplierId), [suppliers, values.supplierId]);
  const billingAddressObj = useMemo(() => selectedSupplier?.address?.find((addr: ContactAddressApi) => addr._id === values.billingAddress), [selectedSupplier, values.billingAddress]);

  const displayBilling = billingAddressObj || selectedSupplier?.address?.[0];

  const handleAddressSelect = (addressId: string) => {
    if (values.billingAddress !== addressId) {
      setFieldValue("billingAddress", addressId);
    }
  };

  const prevDateRef = useRef(values.supplierBillDate);
  const prevPaymentTermsRef = useRef(values.paymentTermsId);

  // Set default addresses when supplier is selected
  useEffect(() => {
    const dateChanged = values.supplierBillDate !== prevDateRef.current;
    const termsChanged = values.paymentTermsId !== prevPaymentTermsRef.current;

    if (dateChanged || termsChanged) {
      const selectedTerm = paymentTermsData?.data?.find((t: PaymentTermsBase) => t._id === values.paymentTermsId);

      if (selectedTerm && values.supplierBillDate) {
        const days = selectedTerm.day || 0;

        const newDueDate = DateConfig(values.supplierBillDate).add(days, "day").toISOString();

        if (values.dueDate !== newDueDate) {
          setFieldValue("dueDate", newDueDate);
        }

        setFieldValue("dueDate", newDueDate);
      }
    }

    prevDateRef.current = values.supplierBillDate;
    prevPaymentTermsRef.current = values.paymentTermsId;
  }, [values.paymentTermsId, values.supplierBillDate, paymentTermsData]);

  // Sync place of supply with billing address
  useEffect(() => {
    const activeBilling = selectedSupplier?.address?.find((a: ContactAddressApi) => a._id === values.billingAddress) || selectedSupplier?.address?.[0];
    if (activeBilling?.state?.name) {
      if (values.placeOfSupply !== activeBilling.state.name) {
        setFieldValue("placeOfSupply", activeBilling.state.name);
      }
    }
    if (activeBilling?.gstIn) {
      if (values.gstIn !== activeBilling.gstIn) {
        setFieldValue("gstIn", activeBilling.gstIn);
      }
    }
  }, [values.billingAddress, selectedSupplier, values.placeOfSupply, values.gstIn, setFieldValue]);

  useEffect(() => {
    const dateChanged = values.supplierBillDate !== prevDateRef.current;
    const termsChanged = values.paymentTermsId !== prevPaymentTermsRef.current;

    if (dateChanged || termsChanged) {
      if (values.paymentTermsId && values.supplierBillDate) {
        const days = parseInt(values.paymentTermsId.split("_")[0]);
        if (!isNaN(days)) {
          const newDueDate = DateConfig(values.supplierBillDate).add(days, "day").toISOString();
          setFieldValue("dueDate", newDueDate);
        }
      }
      prevDateRef.current = values.supplierBillDate;
      prevPaymentTermsRef.current = values.paymentTermsId;
    }
  }, [values.paymentTermsId, values.supplierBillDate, setFieldValue]);

  return (
    <>
      <Grid container spacing={2} sx={{ p: 2 }}>
        <Grid container spacing={2} size={{ xs: 12, md: 3 }}>
          <Grid size={{ xs: 12, md: 12 }}>
            <CommonValidationSelect name="companyId" label="Select Company" required options={companyOptions} isLoading={isCompanyLoading} />
          </Grid>

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
                <Typography variant="caption" color="text.secondary" fontWeight={600}>
                  GSTIN: {displayBilling?.gstIn || "-"}
                </Typography>
              </Box>
            </Grid>

            <Grid size={{ xs: 12, md: 12 }}>
              <Box display="flex" flexDirection="column" gap={0.5}>
                <Box display="flex" justifyContent="space-between" alignItems="center">
                  <Typography variant="caption" color="text.secondary" fontWeight={600}>
                    Billing Address :
                  </Typography>
                  {selectedSupplier && (
                    <IconButton size="small" onClick={() => setAddressModal(true)} sx={{ p: 0.5 }}>
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
          </Grid>
        </Grid>

        <Grid container spacing={2} size={{ xs: 12, md: 9 }}>
          <CommonValidationSelect name="supplierId" label="Select Supplier" required isLoading={supplierDataLoading || supplierDataFetching} options={supplierOptions} grid={{ xs: 12, md: 4, xl: 3 }} disabled={!values.companyId} />
          <CommonValidationDatePicker name="supplierBillDate" label="Supplier Bill Date" required grid={{ xs: 12, md: 4, xl: 3 }} />
          <CommonValidationTextField name="referenceBillNo" label="Reference Bill No." grid={{ xs: 12, md: 4, xl: 3 }} />
          <DependentSelect name="paymentTermsId" label="Payment Term" query={Queries.useGetPaymentTermsDropdown} params={{ companyFilter: values.companyId }} enabled={Boolean(values.companyId)} disabled={!values.companyId} grid={{ xs: 12, md: 4, xl: 3 }} />
          <CommonValidationDatePicker name="dueDate" label="Due Date" required grid={{ xs: 12, md: 4, xl: 3 }} />
          <CommonValidationSelect name="reverseCharge" label="Reverse Charge" options={REVERSE_CHARGE} grid={{ xs: 12, md: 4, xl: 3 }} />
          <CommonValidationDatePicker name="shippingDate" label="Shipping Date" required grid={{ xs: 12, md: 4, xl: 3 }} />
          <CommonValidationSelect name="taxType" label="Tax Type" options={TAX_TYPE} grid={{ xs: 12, md: 4, xl: 3 }} />
          <CommonValidationTextField name="invoiceAmount" label="Invoice Amount" required grid={{ xs: 12, md: 4, xl: 3 }} />
          {/* <CommonValidationSwitch name="exportSez" label="Export / SEZ" grid={{ xs: 12, md: 4, xl: 3 }} /> */}
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
              <Typography variant="caption" color="text.secondary" fontWeight={600}>
                GSTIN: {displayBilling?.gstIn || "-"}
              </Typography>
            </Box>
          </Grid>

          <Grid size={{ xs: 12, md: 12 }}>
            <Box display="flex" flexDirection="column" gap={0.5}>
              <Box display="flex" justifyContent="space-between" alignItems="center">
                <Typography variant="caption" color="text.secondary" fontWeight={600}>
                  Billing Address :
                </Typography>
                {selectedSupplier && (
                  <IconButton size="small" onClick={() => setAddressModal(true)} sx={{ p: 0.5 }}>
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
        </Grid>

        <AddressSelectionModal isOpen={addressModal} onClose={() => setAddressModal(false)} addresses={selectedSupplier?.address || []} onSelect={handleAddressSelect} selectedAddressId={values?.billingAddress} title={"Select Billing Address"} />
      </Grid>
    </>
  );
};

export default SupplierBillDetails;
