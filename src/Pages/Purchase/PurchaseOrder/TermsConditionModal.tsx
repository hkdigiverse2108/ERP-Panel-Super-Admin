import { Grid, Box } from "@mui/material";
import { Form, Formik, type FormikHelpers } from "formik";
import type { FC } from "react";
import { useEffect } from "react";
import { CommonButton, CommonSwitch, CommonValidationTextField } from "../../../Attribute";
import { CommonCard, CommonModal } from "../../../Components/Common";
import { Queries } from "../../../Api/Queries";
import type { TermsAndConditionModalProps, TermsConditionBase, TermsConditionFormValues } from "../../../Types/TermsCondition";
import { TermsConditionFormSchema } from "../../../Utils/ValidationSchemas";

const TermsAndConditionModal: FC<TermsAndConditionModalProps> = ({ openModal, setOpenModal, onSave, initialValues }) => {
  const { data } = Queries.useGetTermsCondition({ pageNumber: 1, pageSize: 10 }, { enabled: !!openModal && !initialValues });

  const formInitialValues: TermsConditionFormValues = {
    termsCondition: initialValues?.termsCondition || "",
    isDefault: initialValues?.isDefault || false,
  };

  const handleSubmit = (values: TermsConditionFormValues, { resetForm }: FormikHelpers<TermsConditionFormValues>) => {
    const newTerm: TermsConditionBase = {
      _id: initialValues?._id || Date.now().toString(),
      termsCondition: values.termsCondition,
      isActive: true, // Assuming default active
      isDefault: values.isDefault || false,
    };
    onSave(newTerm);
    resetForm();
    setOpenModal(false);
  };
  return (
    <CommonModal
      title={initialValues ? "Edit Terms & Conditions" : "Add Terms & Conditions"}
      isOpen={openModal}
      onClose={() => setOpenModal(false)}
      className="max-w-125 m-2 sm:m-5"
    >
      <Formik initialValues={formInitialValues} validationSchema={TermsConditionFormSchema} onSubmit={handleSubmit} enableReinitialize>
        {({ dirty, isValid, values, setFieldValue }) => (
          <Form noValidate>
            <Grid container spacing={2}>
              <CommonCard hideDivider grid={{ xs: 12 }}>
                <Grid container spacing={2} sx={{ p: 2 }}>
                  <AutoPopulateTerms data={data?.data} setFieldValue={setFieldValue} initialValues={initialValues} />
                  <CommonValidationTextField label="Terms & Conditions" name="termsCondition" multiline rows={4} placeholder="Enter terms & conditions" required />

                  <Box sx={{ display: "flex", gap: 2, width: "100%" }}>
                    <CommonSwitch label="Default" name="isDefault" onChange={(checked) => setFieldValue("isDefault", checked)} value={values.isDefault} />
                  </Box>

                  <Grid sx={{ display: "flex", gap: 2, ml: "auto" }}>
                    <CommonButton variant="outlined" title="Cancel" onClick={() => setOpenModal(false)} />
                    <CommonButton type="submit" variant="contained" title={initialValues ? "Update" : "Save"} disabled={!dirty || !isValid} />
                  </Grid>
                </Grid>
              </CommonCard>
            </Grid>
          </Form>
        )}
      </Formik>
    </CommonModal >
  );
};


const AutoPopulateTerms = ({ data, setFieldValue, initialValues }: { data: TermsConditionBase[] | undefined; setFieldValue: (field: string, value: any) => void; initialValues?: TermsConditionBase | null }) => {
  useEffect(() => {
    if (!initialValues && data && data.length > 0) {
      const defaultTerm = data.find((item) => item.isDefault) || data[0];
      setFieldValue("termsCondition", defaultTerm.termsCondition);
    }
  }, [data, setFieldValue, initialValues]);

  return null;
};

export default TermsAndConditionModal;
