import { Grid } from "@mui/material";
import { Form, Formik, useFormikContext, type FormikHelpers } from "formik";
import { useEffect, useRef } from "react";
import { Mutations, Queries } from "../../../Api";
import { CommonButton, CommonValidationSelect, CommonValidationTextField } from "../../../Attribute";
import { CommonModal } from "../../../Components/Common";
import { useAppDispatch, useAppSelector } from "../../../Store/hooks";
import { setOrderRefundModal } from "../../../Store/Slices/ModalSlice";
import type { PosCreditNoteRefundFormValues, ReturnPosOrderFormValues } from "../../../Types";
import { GenerateOptions, RemoveEmptyFields, ReturnPosOrderFormSchema } from "../../../Utils";

const OrderRefund = () => {
  const { isOrderRefundModal } = useAppSelector((state) => state.modal);
  const dispatch = useAppDispatch();

  const { data: bankDropdown, isLoading: bankDropdownLoading } = Queries.useGetBankDropdown();
  const { mutate: refundCreditNote, isPending: isRefundCreditNoteLoading } = Mutations.useRefundCreditNote();

  const posOrderData = isOrderRefundModal.data;

  const initialValues: PosCreditNoteRefundFormValues = {
    posCreditNoteId: posOrderData?._id || "",
    refundViaCash: posOrderData?.creditsRemaining || 0,
    refundViaBank: 0,
    bankAccountId: "",
    refundDescription: "",
  };

  const handleClose = () => dispatch(setOrderRefundModal({ open: false, data: null }));

  const handleSubmit = async (values: PosCreditNoteRefundFormValues, { setSubmitting }: FormikHelpers<PosCreditNoteRefundFormValues>) => {
    await refundCreditNote(RemoveEmptyFields(values), {
      onSettled: () => {
        handleClose();
        setSubmitting(false);
      },
    });
  };

  const AutoAdjustLogic = ({ creditsRemaining }: { creditsRemaining: number }) => {
    const { values, setFieldValue } = useFormikContext<ReturnPosOrderFormValues>();

    const prevCash = useRef(values.refundViaCash);
    const prevBank = useRef(values.refundViaBank);

    useEffect(() => {
      const cash = Number(values.refundViaCash) || 0;
      const bank = Number(values.refundViaBank) || 0;

      // Detect which field changed
      const cashChanged = cash !== prevCash.current;
      const bankChanged = bank !== prevBank.current;

      if (cashChanged) {
        const newBank = Math.max(0, creditsRemaining - cash);
        if (newBank !== bank) setFieldValue("refundViaBank", newBank, false);
      }

      if (bankChanged) {
        const newCash = Math.max(0, creditsRemaining - bank);
        if (newCash !== cash) setFieldValue("refundViaCash", newCash, false);
      }

      prevCash.current = cash;
      prevBank.current = bank;
    }, [values.refundViaCash, values.refundViaBank, creditsRemaining, setFieldValue]);

    return null;
  };

  return (
    <CommonModal title="Order Refund" isOpen={isOrderRefundModal.open} onClose={handleClose} className="max-w-[400px]">
      <Formik<PosCreditNoteRefundFormValues> enableReinitialize initialValues={initialValues} validateOnChange validateOnBlur validationSchema={ReturnPosOrderFormSchema} onSubmit={handleSubmit}>
        {({ values }) => {
          return (
            <Form noValidate>
              <AutoAdjustLogic creditsRemaining={posOrderData?.creditsRemaining || 0} />
              <Grid container spacing={2} py={1}>
                <CommonValidationTextField name="refundViaCash" label="Cash Amount" grid={12} required />
                <CommonValidationSelect name="bankAccountId" label="Bank" options={GenerateOptions(bankDropdown?.data)} disabled={bankDropdownLoading} grid={12} />
                <CommonValidationTextField name="refundViaBank" label="Bank Amount" grid={12} disabled={!values.bankAccountId} />
                <CommonValidationTextField name="refundDescription" label="Description" grid={12} />
                <Grid size={12} sx={{ display: "flex", gap: 2, justifyContent: "center" }}>
                  <CommonButton type="submit" variant="contained" title="Finalize Payment" loading={isRefundCreditNoteLoading} />
                </Grid>
              </Grid>
            </Form>
          );
        }}
      </Formik>
    </CommonModal>
  );
};

export default OrderRefund;
