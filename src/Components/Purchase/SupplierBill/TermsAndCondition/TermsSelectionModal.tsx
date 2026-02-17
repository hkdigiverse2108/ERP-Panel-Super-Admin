import { Grid } from "@mui/material";
import { Formik, Form, type FormikHelpers } from "formik";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { CommonModal, CommonCard } from "../../../Common";
import { CommonCheckbox, CommonButton } from "../../../../Attribute";
import { useAppSelector } from "../../../../Store/hooks";
import { Queries } from "../../../../Api";
import { setTermsSelectionModal } from "../../../../Store/Slices/ModalSlice";
import type { TermsConditionApiResponse, TermsConditionBase, TermsSelectionFormValues } from "../../../../Types";

const TermsSelectionModal = () => {
  const dispatch = useDispatch();

  const { isTermsSelectionModal } = useAppSelector((state) => state.modal);

  const openModal = isTermsSelectionModal.open;
  const selectedIds: string[] = isTermsSelectionModal.data || [];

  const { data, isLoading } = Queries.useGetTermsCondition({
    enabled: openModal,
  });

  const [terms, setTerms] = useState<TermsConditionBase[]>([]);

  useEffect(() => {
    const response = data as TermsConditionApiResponse | undefined;
    if (response?.data?.termsCondition_data) {
      setTerms(response.data.termsCondition_data);
    }
  }, [data]);

  const closeModal = () => {
    dispatch(setTermsSelectionModal({ open: false, data: null }));
  };

  const initialValues: TermsSelectionFormValues = {
    selected: selectedIds,
  };

  const handleSubmit = (values: TermsSelectionFormValues, { resetForm }: FormikHelpers<TermsSelectionFormValues>) => {
    dispatch(
      setTermsSelectionModal({
        open: false,
        data: values.selected,
      }),
    );
    resetForm();
  };

  return (
    <CommonModal title="Edit Terms" isOpen={openModal} onClose={closeModal} className="max-w-125 m-2 sm:m-5">
      <Formik<TermsSelectionFormValues> enableReinitialize initialValues={initialValues} onSubmit={handleSubmit}>
        {({ values, setFieldValue }) => (
          <Form noValidate>
            <Grid container spacing={2}>
              <CommonCard hideDivider grid={{ xs: 12 }}>
                <Grid container spacing={2} sx={{ p: 2 }}>
                  {isLoading ? (
                    <Grid size={12}>Loading...</Grid>
                  ) : (
                    terms.map((term) => (
                      <Grid size={12} key={term._id}>
                        <CommonCheckbox
                          name={`term_${term._id}`}
                          label={term.termsCondition || ""}
                          value={values.selected.includes(term._id)}
                          onChange={(checked: boolean) => {
                            if (checked) {
                              setFieldValue("selected", [...values.selected, term._id]);
                            } else {
                              setFieldValue(
                                "selected",
                                values.selected.filter((id) => id !== term._id),
                              );
                            }
                          }}
                        />
                      </Grid>
                    ))
                  )}

                  <Grid sx={{ display: "flex", gap: 2, ml: "auto" }}>
                    <CommonButton variant="outlined" title="Cancel" onClick={closeModal} />
                    <CommonButton type="submit" variant="contained" title="Save" />
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

export default TermsSelectionModal;
