import { Grid } from "@mui/material";
import { Form, Formik, type FormikHelpers } from "formik";
import type { FC } from "react";
import { Mutations } from "../../../Api";
import { CommonButton, CommonValidationSwitch, CommonValidationTextField } from "../../../Attribute";
import { CommonModal } from "..";
import { useAppDispatch, useAppSelector } from "../../../Store/hooks";
import { setTermsAndConditionFormModal } from "../../../Store/Slices/ModalSlice";
import type { TermsConditionFormValues } from "../../../Types";
import { TermsConditionFormSchema } from "../../../Utils/ValidationSchemas";

const CommonTermsAndConditionFormModal: FC = () => {
  const dispatch = useAppDispatch();
  const { isTermsAndConditionFormModal } = useAppSelector((state) => state.modal);
  const { open, data: initialData, companyId } = isTermsAndConditionFormModal;

  const { mutate: addTerm, isPending: isAddLoading } = Mutations.useAddTermsCondition();
  const { mutate: editTerm, isPending: isEditLoading } = Mutations.useEditTermsCondition();

  const handleCloseBtn = () => dispatch(setTermsAndConditionFormModal({ open: false, data: null }));

  console.log("isTermsAndConditionFormModal", isTermsAndConditionFormModal);
  const handleSubmit = (values: TermsConditionFormValues, { resetForm }: FormikHelpers<TermsConditionFormValues>) => {
    const onSuccessHandler = () => {
      resetForm();
      handleCloseBtn();
    };

    if (initialData?._id) {
      editTerm(
        {
          termsConditionId: initialData._id,
          termsCondition: values.termsCondition,
          isDefault: values.isDefault,
          companyId,
        },
        { onSuccess: onSuccessHandler },
      );
    } else {
      addTerm(
        {
          termsCondition: values.termsCondition,
          isDefault: values.isDefault,
          companyId,
        },
        { onSuccess: onSuccessHandler },
      );
    }
  };

  const formInitialValues: TermsConditionFormValues = {
    termsCondition: initialData?.termsCondition || "",
    isDefault: initialData ? !initialData.isDefault : true,
  };

  return (
    <CommonModal title={initialData?._id ? "Edit Terms & Conditions" : "Add Terms & Conditions"} isOpen={open} onClose={handleCloseBtn} className="max-w-125 m-2 sm:m-5">
      <Formik enableReinitialize initialValues={formInitialValues} validationSchema={TermsConditionFormSchema} onSubmit={handleSubmit}>
        {({ dirty, isValid }) => (
          <Form noValidate>
            <Grid container spacing={2} sx={{ py: 2 }}>
              <CommonValidationTextField label="Terms & Conditions" name="termsCondition" multiline rows={4} placeholder="Enter terms & conditions" required grid={{ xs: 12 }} />
              <CommonValidationSwitch label="Default" name="isDefault" grid={{ xs: 12 }} />

              <Grid sx={{ display: "flex", gap: 2, ml: "auto" }} mt={2}>
                <CommonButton variant="outlined" title="Cancel" onClick={handleCloseBtn} />
                <CommonButton type="submit" variant="contained" title={initialData?._id ? "Update" : "Save"} disabled={!dirty || !isValid} loading={isAddLoading || isEditLoading} />
              </Grid>
            </Grid>
          </Form>
        )}
      </Formik>
    </CommonModal>
  );
};

export default CommonTermsAndConditionFormModal;
