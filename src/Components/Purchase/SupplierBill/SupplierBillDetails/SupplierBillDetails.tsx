import { Box } from "@mui/material";
import { CommonValidationDatePicker, CommonValidationSelect, CommonValidationSwitch, CommonValidationTextField } from "../../../../Attribute";
import { PAYMENT_TERMS, REVERSE_CHARGE, TAX_TYPE } from "../../../../Data";
import type { SupplierBillDetailsProps } from "../../../../Types";
const SupplierBillDetails = ({ supplierOptions, selectedSupplier, isEditing, companyOptions, isCompanyLoading }: SupplierBillDetailsProps) => {
  return (
    <Box sx={{ p: 2, display: "grid", gridTemplateColumns: { xs: "1fr", md: "340px 1fr" }, gap: 2 }}>
      {/* ================= LEFT SIDE ================= */}
      <Box display="flex" flexDirection="column" gap={2}>
        <CommonValidationSelect name="companyId" label="Select Company" required options={companyOptions} isLoading={isCompanyLoading} />
        <CommonValidationSelect name="supplierId" label="Select Supplier" required options={supplierOptions} />
        <Box display="flex" gap={1}>
          <Box fontWeight={600}>Place of Supply:</Box>
          <Box color="text.secondary">{selectedSupplier?.address?.[0]?.state?.name || "-"}</Box>
        </Box>
        <Box display="flex" gap={1}>
          <Box fontWeight={600}>GSTIN:</Box>
          <Box color="text.secondary">{selectedSupplier?.address?.[0]?.gstIn || "-"}</Box>
        </Box>
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
            <Box color="text.secondary">Billing Address is not provided</Box>
          )}
        </Box>
      </Box>

      {/* ================= RIGHT SIDE ================= */}
      <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", md: "repeat(3, 1fr)" }, gap: 2 }}>
        <CommonValidationDatePicker name="supplierBillDate" label="Supplier Bill Date" required />
        {isEditing && <CommonValidationTextField name="referenceBillNo" label="Reference Bill No." />}
        <CommonValidationTextField name="supplierBillNo" label="Supplier Bill No." required />
        <CommonValidationSelect name="paymentTerm" label="Payment Term" options={PAYMENT_TERMS} />
        <CommonValidationDatePicker name="dueDate" label="Due Date" required />
        <CommonValidationSelect name="reverseCharge" label="Reverse Charge" options={REVERSE_CHARGE} />
        <CommonValidationDatePicker name="shippingDate" label="Shipping Date" required />
        <CommonValidationSelect name="taxType" label="Tax Type" options={TAX_TYPE} />
        <CommonValidationTextField name="invoiceAmount" label="Invoice Amount" required />
        <CommonValidationSwitch name="exportSez" label="Export / SEZ" />
      </Box>
    </Box>
  );
};

export default SupplierBillDetails;
