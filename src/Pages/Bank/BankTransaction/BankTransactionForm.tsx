import { Grid } from "@mui/material";
import { Form, Formik, type FormikHelpers } from "formik";
import { useDispatch } from "react-redux";
import { Mutations, Queries } from "../../../Api";
import { CommonButton, CommonValidationSelect, CommonValidationSwitch, CommonValidationTextField, CommonValidationDatePicker } from "../../../Attribute";
import { CommonModal } from "../../../Components/Common";
import { PAGE_TITLE } from "../../../Constants";
import { useAppSelector } from "../../../Store/hooks";
import { setBankTransactionModal } from "../../../Store/Slices/ModalSlice";
import type { BankTransactionFormValues } from "../../../Types";
import { GenerateOptions, RemoveEmptyFields } from "../../../Utils";
import { BankTransactionFormSchema } from "../../../Utils/ValidationSchemas";

const TRANSACTION_TYPE_OPTIONS = [
  { label: "Deposit", value: "deposit" },
  { label: "Withdrawal", value: "withdrawal" },
  { label: "Transfer", value: "transfer" },
];

const BankTransactionForm = () => {
  const { mutate: addBankTransaction, isPending: isAddLoading } = Mutations.useAddBankTransaction();
  const { mutate: editBankTransaction, isPending: isEditLoading } = Mutations.useEditBankTransaction();

  const { data: AccountData, isLoading: AccountDataLoading } = Queries.useGetAccountDropdown();
  const { isBankTransactionModal } = useAppSelector((state) => state.modal);

  const dispatch = useDispatch();

  const isEdit: any = isBankTransactionModal.data;
  const openModal = isBankTransactionModal.open;
  const isEditing = Boolean(isEdit?._id);
  const pageMode = isEditing ? "EDIT" : "ADD";

  const initialValues: BankTransactionFormValues = {
    voucherNo: isEdit?.voucherNo || "",
    transactionDate: isEdit?.transactionDate || new Date().toISOString(),
    transactionType: isEdit?.transactionType || "deposit",
    fromAccount: (typeof isEdit?.fromAccount === "object" ? isEdit?.fromAccount?._id : isEdit?.fromAccount) || "",
    toAccount: (typeof isEdit?.toAccount === "object" ? isEdit?.toAccount?._id : isEdit?.toAccount) || "",
    amount: isEdit?.amount || 0,
    description: isEdit?.description || "",
    isActive: isEdit?.isActive ?? true,
  };

  const closeModal = () => dispatch(setBankTransactionModal({ open: false, data: null }));

  const handleSubmit = (values: BankTransactionFormValues, { resetForm }: FormikHelpers<BankTransactionFormValues>) => {
    const onSuccessHandler = () => {
      resetForm();
      closeModal();
    };

    if (isEditing) {
      editBankTransaction({ ...values, bankTransactionId: isEdit?._id } as any, { onSuccess: onSuccessHandler });
    } else {
      addBankTransaction(RemoveEmptyFields(values) as BankTransactionFormValues, { onSuccess: onSuccessHandler });
    }
  };

  return (
    <CommonModal title={PAGE_TITLE.BANK_TRANSACTION[pageMode]} isOpen={openModal} onClose={closeModal} className="max-w-125">
      <Formik<BankTransactionFormValues> enableReinitialize initialValues={initialValues} validationSchema={BankTransactionFormSchema} onSubmit={handleSubmit}>
        {({ values, dirty }) => (
          <Form noValidate>
            <Grid container spacing={2} sx={{ p: 1 }}>
              <CommonValidationDatePicker name="transactionDate" label="Transaction Date" required grid={{ xs: 12, md: 6 }} />
              <CommonValidationTextField name="voucherNo" label="Voucher No" grid={{ xs: 12, md: 6 }} />
              <CommonValidationSelect name="transactionType" label="Transaction Type" required options={TRANSACTION_TYPE_OPTIONS} grid={{ xs: 12 }} />
              <CommonValidationSelect name="fromAccount" label="From Account" required isLoading={AccountDataLoading} options={GenerateOptions(AccountData?.data)} grid={{ xs: 12, md: 6 }} />
              {values.transactionType === "transfer" && (
                <CommonValidationSelect name="toAccount" label="To Account" required isLoading={AccountDataLoading} options={GenerateOptions(AccountData?.data)} grid={{ xs: 12, md: 6 }} />
              )}
              <CommonValidationTextField name="amount" label="Amount" type="number" required grid={{ xs: 12 }} />
              <CommonValidationTextField name="description" label="Description" grid={{ xs: 12 }} />

              {!isEditing && <CommonValidationSwitch name="isActive" label="Is Active" grid={{ xs: 12 }} />}
              <Grid sx={{ display: "flex", gap: 2, ml: "auto" }}>
                <CommonButton variant="outlined" onClick={closeModal} title="Cancel" />
                <CommonButton type="submit" variant="contained" title="Save" loading={isEditLoading || isAddLoading} disabled={!dirty} />
              </Grid>
            </Grid>
          </Form>
        )}
      </Formik>
    </CommonModal>
  );
};
export default BankTransactionForm;

