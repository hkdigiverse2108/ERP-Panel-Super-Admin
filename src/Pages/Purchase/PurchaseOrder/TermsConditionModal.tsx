import { Grid, Box } from "@mui/material";
import { Formik } from "formik";
import type { FC } from "react";
import { CommonButton, CommonSwitch, CommonValidationTextField } from "../../../Attribute";
import { CommonCard, CommonModal } from "../../../Components/Common";
import type { TermsAndConditionModalProps, TermsConditionBase, TermsConditionFormValues } from "../../../Types/TermsCondition";
import { TermsConditionFormSchema } from "../../../Utils/ValidationSchemas";

const TermsAndConditionModal: FC<TermsAndConditionModalProps> = ({ openModal, setOpenModal, onSave, initialValues, isLoading }) => {

  const formInitialValues: TermsConditionFormValues = {
    termsCondition: initialValues?.termsCondition || "",
    isDefault: initialValues ? !!initialValues.isDefault : true,
  };

  const handleSubmit = (values: TermsConditionFormValues) => {
    const newTerm: TermsConditionBase = {
      _id: initialValues?._id || Date.now().toString(),
      termsCondition: values.termsCondition,
      isActive: true, // Assuming 
      // default active
      isDefault: values.isDefault || true,
    };
    onSave(newTerm);
  };
  return (
    <CommonModal
      title={initialValues ? "Edit Terms & Conditions" : "Add Terms & Conditions"}
      isOpen={openModal}
      onClose={() => setOpenModal(false)}
      className="max-w-125 m-2 sm:m-5"
    >
      <Formik initialValues={formInitialValues} validationSchema={TermsConditionFormSchema} onSubmit={handleSubmit} enableReinitialize>
        {({ dirty, isValid, values, setFieldValue, submitForm }) => (
          <Box className="w-full">
            <Grid container spacing={2}>
              <CommonCard hideDivider grid={{ xs: 12 }}>
                <Grid container spacing={2} sx={{ p: 2 }}>
                  <CommonValidationTextField label="Terms & Conditions" name="termsCondition" multiline rows={4} placeholder="Enter terms & conditions" required />

                  <Box sx={{ display: "flex", gap: 2, width: "100%" }}>
                    <CommonSwitch label="Default" name="isDefault" onChange={(checked) => setFieldValue("isDefault", checked)} value={values.isDefault} />
                  </Box>

                  <Grid sx={{ display: "flex", gap: 2, ml: "auto" }}>
                    <CommonButton variant="outlined" title="Cancel" onClick={() => setOpenModal(false)} />
                    <CommonButton type="button" variant="contained" title={initialValues ? "Update" : "Save"} disabled={!dirty || !isValid || isLoading} onClick={() => submitForm()} />
                  </Grid>
                </Grid>
              </CommonCard>
            </Grid>
          </Box>
        )}
      </Formik>
    </CommonModal >
  );
};

export default TermsAndConditionModal;