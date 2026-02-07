import { Grid } from "@mui/material";
import { Form, Formik, type FormikHelpers } from "formik";
import type { FC } from "react";
import { CommonButton, CommonValidationTextField } from "../../../Attribute";
import { CommonCard, CommonModal } from "../../../Components/Common";
import type { TermsAndConditionModalProps, TermsConditionBase, TermsConditionFormValues } from "../../../Types/TermsCondition";
import { PurchaseOrderFormSchema } from "../../../Utils/ValidationSchemas";

const TermsAndConditionModal: FC<TermsAndConditionModalProps> = ({ openModal, setOpenModal, onSave }) => {
  const initialValues: TermsConditionFormValues = {
    termsCondition: "",
  };

  const handleSubmit = (values: TermsConditionFormValues, { resetForm }: FormikHelpers<TermsConditionFormValues>) => {
    const newTerm: TermsConditionBase = {
      _id: Date.now().toString(),
      termsCondition: values.termsCondition,
      isActive: true, // Assuming default active
      isDefault: false
    };
    onSave(newTerm);
    resetForm();
    setOpenModal(false);
  };
  return (
    <CommonModal title="Add Terms & Conditions" isOpen={openModal} onClose={() => setOpenModal(false)} className="max-w-125 m-2 sm:m-5">
      <Formik initialValues={initialValues} validationSchema={PurchaseOrderFormSchema} onSubmit={handleSubmit}>
        {({ dirty, isValid }) => (
          <Form noValidate>
            <Grid container spacing={2}>
              <CommonCard hideDivider grid={{ xs: 12 }}>
                <Grid container spacing={2} sx={{ p: 2 }}>
                  <CommonValidationTextField label="Terms & Conditions" name="termsCondition" multiline rows={4} placeholder="Enter terms & conditions" required />

                  <Grid sx={{ display: "flex", gap: 2, ml: "auto" }}>
                    <CommonButton variant="outlined" title="Cancel" onClick={() => setOpenModal(false)} />
                    <CommonButton type="submit" variant="contained" title="Save" disabled={!dirty || !isValid} />
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
