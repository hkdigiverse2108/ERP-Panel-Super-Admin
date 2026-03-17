import { Box, Grid, Typography, IconButton } from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import { CommonValidationDatePicker, CommonValidationSelect, CommonValidationTextField } from "../../../Attribute";
import { ORDER_STATUS, TAX_TYPE } from "../../../Data";
import { useFormikContext } from "formik";
import type { ContactAddressApi, PurchaseOrderFormValues } from "../../../Types";
import { useState, useEffect } from "react";
import { AddressSelectionModal } from "../../Common";
import { Queries } from "../../../Api";
import { GenerateOptions } from "../../../Utils";

const PurchaseOrderDetails = () => {
  const { values, setFieldValue } = useFormikContext<PurchaseOrderFormValues>();
  const [addressModal, setAddressModal] = useState<boolean>(false);

  const { data: companyData, isLoading: isCompanyLoading } = Queries.useGetCompanyDropdown();
  const companyOptions = GenerateOptions(companyData?.data || []);

  const { data: customerData, isLoading: supplierDataLoading, isFetching: supplierDataFetching } = Queries.useGetContactDropdown({ typeFilter: "supplier", companyFilter: values?.companyId }, !!values?.companyId);
  const suppliers = customerData?.data || [];

  // console.log("values", values, customers);
  const selectedSupplier = suppliers.find((c) => c._id === values.supplierId);
  const billingAddressObj = selectedSupplier?.address?.find((addr: ContactAddressApi) => addr._id === values.billingAddress);

  // Fallback to first address if not selected yet (optional, or just show provided/not provided)
  const displayBilling = billingAddressObj || selectedSupplier?.address?.[0];

  const handleAddressSelect = (addressId: string) => {
    setFieldValue("billingAddress", addressId);
  };

  // Set default addresses when customer is selected
  useEffect(() => {
    if (selectedSupplier && selectedSupplier.address && selectedSupplier.address.length > 0) {
      const isBillingValid = selectedSupplier.address.some((a: ContactAddressApi) => a._id === values.billingAddress);

      if (!values.billingAddress || !isBillingValid) {
        const firstAddressId = selectedSupplier.address[0]._id;
        if (values.billingAddress !== firstAddressId) {
          setFieldValue("billingAddress", firstAddressId);
        }
      }
    } else if (!selectedSupplier || !selectedSupplier.address || selectedSupplier.address.length === 0) {
      if (values.billingAddress) setFieldValue("billingAddress", "");
    }
  }, [selectedSupplier, values.billingAddress, setFieldValue]);

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

  return (
    <Grid container spacing={2} sx={{ p: 2 }}>
      <Grid size={{ xs: 12, md: 3 }} sx={{ order: { xs: 1, md: 1 } }}>
        <CommonValidationSelect name="companyId" label="Select Company" required options={companyOptions} isLoading={isCompanyLoading} />
      </Grid>

      <Grid size={{ xs: 12, md: 3 }} sx={{ order: { xs: 2, md: 2 } }}>
        <CommonValidationSelect name="supplierId" label="Select Supplier" required isLoading={supplierDataLoading || supplierDataFetching} options={GenerateOptions(suppliers)} grid={{ xs: 12 }} disabled={!values.companyId} />
      </Grid>

      <Grid size={{ xs: 12, md: 3 }} sx={{ order: { xs: 3, md: 3 } }}>
        <CommonValidationDatePicker name="orderDate" label="Purchase Order Date" required grid={{ xs: 12 }} />
      </Grid>

      <Grid size={{ xs: 12, md: 3 }} sx={{ order: { xs: 4, md: 4 } }}>
        <CommonValidationDatePicker name="shippingDate" label="Shipping Date" required grid={{ xs: 12 }} />
      </Grid>

      <Grid size={{ xs: 12, md: 3 }} container spacing={2} sx={{ order: { xs: 10, md: 5 } }}>
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

      <Grid size={{ xs: 12, md: 3 }} sx={{ order: { xs: 5, md: 5 } }}>
        <CommonValidationTextField name="shippingNote" label="Shipping Note" grid={{ xs: 12 }} />
      </Grid>

      <Grid size={{ xs: 12, md: 3 }} sx={{ order: { xs: 6, md: 6 } }}>
        <CommonValidationSelect name="taxType" label="Tax Type" required options={TAX_TYPE} grid={{ xs: 12 }} />
      </Grid>

      <Grid size={{ xs: 12, md: 3 }} sx={{ order: { xs: 7, md: 7 } }}>
        <CommonValidationSelect name="status" label="Order Status" required options={ORDER_STATUS} grid={{ xs: 12 }} />
      </Grid>

      <AddressSelectionModal isOpen={addressModal} onClose={() => setAddressModal(false)} addresses={selectedSupplier?.address || []} onSelect={handleAddressSelect} selectedAddressId={values?.billingAddress} title={"Select Billing Address"} />
    </Grid>
  );
};

export default PurchaseOrderDetails;
