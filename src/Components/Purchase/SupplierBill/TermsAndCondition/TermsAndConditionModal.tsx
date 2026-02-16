import { Grid } from "@mui/material";
import { Form, Formik, type FormikHelpers } from "formik";
import { CommonCard, CommonModal } from "../../../Common";
import { CommonButton, CommonValidationSwitch, CommonValidationTextField } from "../../../../Attribute";
import { useAppSelector } from "../../../../Store/hooks";
import { useDispatch } from "react-redux";
import { setTermsAndConditionModal } from "../../../../Store/Slices/ModalSlice";
import { Mutations } from "../../../../Api";
import type { TermsAndConditionModalProps, TermsConditionBase, TermsConditionFormValues } from "../../../../Types";

const TermsAndConditionModal = ({ onSave }: Pick<TermsAndConditionModalProps, 'onSave'>) => {
  const { isTermsAndConditionModal } = useAppSelector((state) => state.modal);
  const dispatch = useDispatch();
  const openModal = isTermsAndConditionModal.open;
  const data = isTermsAndConditionModal.data as TermsConditionBase | null;
  const isEditing = Boolean(data?._id);
  const initialValues: TermsConditionFormValues = {
    termsCondition: data?.termsCondition || "",
    isDefault: data?.isDefault || false,
  };

  const closeModal = () => {
    dispatch(setTermsAndConditionModal({ open: false, data: null }));
  };
  const { mutate: addTerm } = Mutations.useAddTermsCondition();
  const { mutate: editTerm } = Mutations.useEditTermsCondition();
  const handleSubmit = (values: TermsConditionFormValues, { resetForm }: FormikHelpers<TermsConditionFormValues>) => {
    const onSuccessHandler = (savedTerm: TermsConditionBase) => {
      onSave(savedTerm);
      resetForm();
      closeModal();
    };
    if (isEditing && data?._id) {
      editTerm({ termsConditionId: data._id, termsCondition: values.termsCondition, isDefault: values.isDefault }, { onSuccess: (res: any) => onSuccessHandler(res.data) });
    } else {
      addTerm({ termsCondition: values.termsCondition, isDefault: values.isDefault }, { onSuccess: (res: any) => onSuccessHandler(res.data) });
    }
  };

  return (
    <CommonModal title={isEditing ? "Edit Terms & Conditions" : "Add Terms & Conditions"} isOpen={openModal} onClose={closeModal} className="max-w-125 m-2 sm:m-5">
      <Formik enableReinitialize initialValues={initialValues} onSubmit={handleSubmit}>
        {({ dirty }) => (
          <Form noValidate>
            <Grid container spacing={2}>
              <CommonCard hideDivider grid={{ xs: 12 }}>
                <Grid container spacing={2} sx={{ p: 2 }}>
                  <CommonValidationTextField name="termsCondition" label="Terms & Conditions" multiline rows={4} required grid={{ xs: 12 }} />
                  <CommonValidationSwitch name="isDefault" label="Default" grid={{ xs: 12 }} />

                  <Grid sx={{ display: "flex", gap: 2, ml: "auto" }}>
                    <CommonButton variant="outlined" title="Cancel" onClick={closeModal} />
                    <CommonButton type="submit" variant="contained" title="Save" disabled={!dirty} />
                  </Grid>
                </Grid>
              </CommonCard>
            </Grid>
          </Form>
        )}
      </Formik>
    </CommonModal>
  );
};

export default TermsAndConditionModal;
