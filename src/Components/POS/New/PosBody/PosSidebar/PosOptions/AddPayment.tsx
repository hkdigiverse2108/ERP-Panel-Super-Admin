import { Grid } from "@mui/material";
import { Form, Formik } from "formik";
import { CommonButton, CommonValidationRadio, CommonValidationSelect, CommonValidationSwitch, CommonValidationTextField } from "../../../../../../Attribute";
import { PAYMENT_MODE, PAYMENT_TYPE, VOUCHER_TYPE } from "../../../../../../Data";
import { useAppDispatch, useAppSelector } from "../../../../../../Store/hooks";
import { setAddPaymentModal } from "../../../../../../Store/Slices/ModalSlice";
import { CommonModal } from "../../../../../Common";

const AddPayment = () => {
  const { isAddPaymentModal } = useAppSelector((state) => state.modal);
  const dispatch = useAppDispatch();

  const initialValues = {
    voucherType: "sales",
    paymentType: "againstBill",
    partyType: "",
    sales: "",
    paymentMode: "",
    bank: "",
    totalPayment: "",
    paidAmount: "",
    pendingAmount: "",
    kasar: "",
    amount: "",
    remark: "",
  };

  const handleSubmit = () => {};

  return (
    <CommonModal title="Payments" isOpen={isAddPaymentModal} onClose={() => dispatch(setAddPaymentModal())} className="max-w-[1000px]">
      <Formik enableReinitialize initialValues={initialValues} onSubmit={handleSubmit}>
        {({ values }) => {
          const showBank = values.paymentMode && values.paymentMode !== "cash";

          return (
            <Form noValidate>
              <Grid container spacing={2}>
                <CommonValidationRadio name="voucherType" label="Select Voucher Type" options={VOUCHER_TYPE} grid={12} />
                {values.voucherType === "sales" && (
                  <>
                    <CommonValidationRadio name="paymentType" label="Select Payment Type" options={PAYMENT_TYPE} grid={12} />
                    {values.paymentType === "advancePayment" ? (
                      <>
                        <CommonValidationSelect name="partyType" label="Select Party Name" options={PAYMENT_TYPE} grid={{ xs: 12, sm: 6 }} required />
                        <CommonValidationSelect name="paymentMode" label="Payment Mode" options={PAYMENT_MODE} grid={{ xs: 12, sm: 6 }} required />
                        <CommonValidationSelect name="bank" label="Select Bank" options={PAYMENT_MODE} grid={{ xs: 12, sm: 6 }} disabled={!showBank} required />
                        <CommonValidationTextField name="amount" label="Amount" type="number" grid={{ xs: 12, sm: 6 }} required />
                        <CommonValidationTextField name="remark" label="Remark" grid={{ xs: 12 }} multiline />
                      </>
                    ) : (
                      <>
                        <CommonValidationSelect name="partyType" label="Select Party Name" options={PAYMENT_TYPE} grid={{ xs: 12, sm: 6, md: 4 }} required />
                        <CommonValidationSelect name="sales" label="Select Sales" options={PAYMENT_TYPE} grid={{ xs: 12, sm: 6, md: 4 }} required />
                        <CommonValidationSelect name="paymentMode" label="Payment Mode" options={PAYMENT_MODE} grid={{ xs: 12, sm: 6, md: 4 }} required />
                        <CommonValidationSelect name="bank" label="Select Bank" options={PAYMENT_MODE} grid={{ xs: 12, sm: 6, md: 4 }} disabled={!showBank} required />
                        <CommonValidationTextField name="totalPayment" label="Total Payment" type="number" grid={{ xs: 12, sm: 6, md: 4 }} disabled isCurrency />
                        <CommonValidationTextField name="paidAmount" label="Paid Amount" type="number" grid={{ xs: 12, sm: 6, md: 4 }} disabled isCurrency />
                        <CommonValidationTextField name="pendingAmount" label="Pending Amount" type="number" grid={{ xs: 12, sm: 6, md: 4 }} disabled isCurrency />
                        <CommonValidationTextField name="kasar" label="Kasar" type="number" grid={{ xs: 12, sm: 6, md: 4 }} />
                        <CommonValidationTextField name="amount" label="Amount" type="number" grid={{ xs: 12, sm: 6, md: 4 }} required />
                        <CommonValidationTextField name="remark" label="Remark" grid={{ xs: 12 }} multiline />
                      </>
                    )}
                  </>
                )}
                {values.voucherType === "purchase" && (
                  <>
                    <CommonValidationRadio name="paymentType" label="Select Payment Type" options={PAYMENT_TYPE} grid={12} />
                    {values.paymentType === "advancePayment" ? (
                      <>
                        <CommonValidationSelect name="partyType" label="Select Party Name" options={PAYMENT_TYPE} grid={{ xs: 12, sm: 6 }} required />
                        <CommonValidationSelect name="paymentMode" label="Payment Mode" options={PAYMENT_MODE} grid={{ xs: 12, sm: 6 }} required />
                        <CommonValidationSelect name="bank" label="Select Bank" options={PAYMENT_MODE} grid={{ xs: 12, sm: 6 }} disabled={!showBank} required />
                        <CommonValidationTextField name="amount" label="Amount" type="number" grid={{ xs: 12, sm: 6 }} required />
                        <CommonValidationTextField name="remark" label="Remark" grid={{ xs: 12 }} multiline />
                      </>
                    ) : (
                      <>
                        <CommonValidationSelect name="partyType" label="Select Party Name" options={PAYMENT_TYPE} grid={{ xs: 12, sm: 6, md: 4 }} required />
                        <CommonValidationSelect name="sales" label="Select Bill" options={PAYMENT_TYPE} grid={{ xs: 12, sm: 6, md: 4 }} required />
                        <CommonValidationSelect name="paymentMode" label="Payment Mode" options={PAYMENT_MODE} grid={{ xs: 12, sm: 6, md: 4 }} required />
                        <CommonValidationSelect name="bank" label="Select Bank" options={PAYMENT_MODE} grid={{ xs: 12, sm: 6, md: 4 }} disabled={!showBank} required />
                        <CommonValidationTextField name="totalPayment" label="Total Payment" type="number" grid={{ xs: 12, sm: 6, md: 4 }} disabled isCurrency />
                        <CommonValidationTextField name="paidAmount" label="Paid Amount" type="number" grid={{ xs: 12, sm: 6, md: 4 }} disabled isCurrency />
                        <CommonValidationTextField name="pendingAmount" label="Pending Amount" type="number" grid={{ xs: 12, sm: 6, md: 4 }} disabled isCurrency />
                        <CommonValidationTextField name="kasar" label="Kasar" type="number" grid={{ xs: 12, sm: 6, md: 4 }} />
                        <CommonValidationTextField name="amount" label="Amount" type="number" grid={{ xs: 12, sm: 6, md: 4 }} required />
                        <CommonValidationTextField name="remark" label="Remark" grid={{ xs: 12 }} multiline />
                      </>
                    )}
                  </>
                )}
                {values.voucherType === "expense" && (
                  <>
                    <CommonValidationSelect name="partyType" label="Select Party Name" options={PAYMENT_TYPE} grid={{ xs: 12, sm: 6, md: 4 }} required />
                    <CommonValidationSelect name="account" label="Account" options={PAYMENT_TYPE} grid={{ xs: 12, sm: 6, md: 4 }} required />
                    <CommonValidationTextField name="amount" label="Amount" type="number" grid={{ xs: 12, sm: 6, md: 4 }} required />
                    <CommonValidationTextField name="remark" label="Remark" grid={{ xs: 12 }} multiline />
                    <CommonValidationSwitch name="isCash" label="Non-GST" grid={{ xs: 12, md: 6 }} />
                  </>
                )}
                <Grid sx={{ display: "flex", justifyContent: "center", gap: 2 }} size={12}>
                  <CommonButton type="submit" variant="contained" title="Save" />
                  {values.voucherType === "sales" && values.paymentType === "advancePayment" && <CommonButton type="submit" variant="contained" title="Save & Print" />}
                </Grid>
              </Grid>
            </Form>
          );
        }}
      </Formik>
    </CommonModal>
  );
};

export default AddPayment;
