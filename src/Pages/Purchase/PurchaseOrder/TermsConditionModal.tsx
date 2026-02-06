import { Grid } from "@mui/material";
import { Form, Formik, type FormikHelpers } from "formik";
import type { FC } from "react";
import * as Yup from "yup";
import type { TermsConditionBase } from "../../../Types/TermsCondition";
import { CommonCard, CommonModal } from "../../../Components/Common";
import { CommonButton, CommonValidationTextField } from "../../../Attribute";


interface TermsAndConditionModalProps {
  openModal: boolean;
  setOpenModal: (value: boolean) => void;
  onSave: (term: TermsConditionBase) => void;
}

interface FormValues {
  termsCondition: string;
}

const TermsAndConditionModal: FC<TermsAndConditionModalProps> = ({ openModal, setOpenModal, onSave }) => {
  const initialValues: FormValues = {
    termsCondition: "",
  };

  const validationSchema = Yup.object().shape({
    termsCondition: Yup.string().required("Terms & Condition is required"),
  });

  const handleSubmit = (values: FormValues, { resetForm }: FormikHelpers<FormValues>) => {
    const newTerm: TermsConditionBase = {
      _id: Date.now().toString(),
      termsCondition: values.termsCondition,
    };

    onSave(newTerm);
    resetForm();
    setOpenModal(false);
  };

  return (
    <CommonModal title="Add Terms & Conditions" isOpen={openModal} onClose={() => setOpenModal(false)} className="max-w-125 m-2 sm:m-5">
      <Formik initialValues={initialValues} validationSchema={validationSchema} onSubmit={handleSubmit}>
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
