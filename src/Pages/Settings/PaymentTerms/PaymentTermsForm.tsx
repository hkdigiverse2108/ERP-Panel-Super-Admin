import { Grid } from "@mui/material";
import { Form, Formik, type FormikHelpers } from "formik";
import { useDispatch } from "react-redux";
import { Mutations, Queries } from "../../../Api";
import { useAppSelector } from "../../../Store/hooks";
import type { PaymentTermsFormValues } from "../../../Types";
import { setPaymentTermsModal } from "../../../Store/Slices/ModalSlice";
import { GenerateOptions, GetChangedFields, PaymentTermsFormSchema, RemoveEmptyFields } from "../../../Utils";
import { CommonModal } from "../../../Components/Common";
import { PAGE_TITLE } from "../../../Constants";
import { CommonButton, CommonValidationSelect, CommonValidationSwitch, CommonValidationTextField } from "../../../Attribute";

const PaymentTermsForm = () => {
  const { data: CompanyData, isLoading: CompanyDataLoading } = Queries.useGetCompanyDropdown();
  const { mutate: addPaymentTerms, isPending: isAddLoading } = Mutations.useAddPaymentTerms();
  const { mutate: editPaymentTerms, isPending: isEditLoading } = Mutations.useEditPaymentTerms();

  const dispatch = useDispatch();
  const { isPaymentTermsModal } = useAppSelector((state) => state.modal);

  const isEdit = isPaymentTermsModal.data;
  const openModal = isPaymentTermsModal.open;
  const isEditing = Boolean(isEdit?._id);
  const pageMode = isEditing ? "EDIT" : "ADD";

  const initialValues: PaymentTermsFormValues = {
    companyId: isEdit?.companyId?._id || "",
    name: isEdit?.name || "",
    day: isEdit?.day,
    isActive: isEdit?.isActive ?? true,
  };

  const closeModal = () => dispatch(setPaymentTermsModal({ open: false, data: null }));

  const handleSubmit = (values: PaymentTermsFormValues, { resetForm }: FormikHelpers<PaymentTermsFormValues>) => {
    const onSuccessHandler = () => {
      resetForm();
      closeModal();
    };

    if (isEditing) {
      const changedFields = GetChangedFields(values, isEdit as Partial<PaymentTermsFormValues>);
      editPaymentTerms({ ...changedFields, paymentTermId: isEdit?._id }, { onSuccess: onSuccessHandler });
    } else {
      addPaymentTerms(RemoveEmptyFields(values), { onSuccess: onSuccessHandler });
    }
  };

  return (
    <CommonModal title={PAGE_TITLE.SETTINGS.PAYMENT_TERMS[pageMode]} isOpen={openModal} onClose={closeModal} className="max-w-125">
      <Formik<PaymentTermsFormValues> enableReinitialize initialValues={initialValues} validationSchema={PaymentTermsFormSchema} onSubmit={handleSubmit}>
        {({ dirty }) => (
          <Form noValidate>
            <Grid container spacing={2} sx={{ p: 1 }}>
              <CommonValidationSelect name="companyId" label="Company" options={GenerateOptions(CompanyData?.data)} isLoading={CompanyDataLoading} grid={{ xs: 12 }} />
              <CommonValidationTextField name="name" label="Payment Terms Name" required grid={{ xs: 12 }} />
              <CommonValidationTextField name="day" label="Payment Terms Day" type="number" required grid={{ xs: 12 }} />
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
export default PaymentTermsForm;
