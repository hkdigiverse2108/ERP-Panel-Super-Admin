import { Add, Edit } from "@mui/icons-material";
import { Box, Grid } from "@mui/material";
import { GridDeleteIcon } from "@mui/x-data-grid";
import { Form, Formik, type FormikHelpers } from "formik";
import { useEffect, useState } from "react";
import { Mutations, Queries } from "../../../Api";
import { CommonButton, CommonCheckbox, CommonValidationSwitch, CommonValidationTextField } from "../../../Attribute";
import { CommonCard, CommonModal, CommonTable } from "../index";
import type { CommonTableColumn, CommonTermsAndConditionProps, TermsAndConditionModalProps, TermsConditionApiResponse, TermsConditionBase, TermsConditionFormValues, TermsSelectionFormValues } from "../../../Types";

const AddTermModal = ({ open, term, onClose, onSave }: { open: boolean; term: TermsConditionBase | null; onClose: () => void } & TermsAndConditionModalProps) => {
  const isEditing = Boolean(term?._id);
  const initialValues: TermsConditionFormValues = {
    termsCondition: term?.termsCondition || "",
    isDefault: term?.isDefault || false,
  };

  const { mutate: addTerm, isPending: isAddLoading } = Mutations.useAddTermsCondition();
  const { mutate: editTerm, isPending: isEditLoading } = Mutations.useEditTermsCondition();

  const handleSubmit = (values: TermsConditionFormValues, { resetForm }: FormikHelpers<TermsConditionFormValues>) => {
    const onSuccessHandler = (savedTerm: TermsConditionBase) => {
      onSave(savedTerm);
      resetForm();
      onClose();
    };

    if (isEditing && term?._id) {
      editTerm(
        { termsConditionId: term._id, termsCondition: values.termsCondition, isDefault: values.isDefault },
        { onSuccess: () => onSuccessHandler({ ...term, ...values, _id: term._id }) }, // Optimistic or response based
      );
    } else {
      addTerm({ termsCondition: values.termsCondition, isDefault: values.isDefault }, { onSuccess: (res: any) => onSuccessHandler(res.data) });
    }
  };

  return (
    <CommonModal title={isEditing ? "Edit Terms & Conditions" : "Add Terms & Conditions"} isOpen={open} onClose={onClose} className="max-w-125 m-2 sm:m-5">
      <Formik enableReinitialize initialValues={initialValues} onSubmit={handleSubmit}>
        {({ dirty, submitForm }) => (
          <Form noValidate>
            <Grid container spacing={2}>
              <CommonCard hideDivider grid={{ xs: 12 }}>
                <Grid container spacing={2} sx={{ p: 2 }}>
                  <CommonValidationTextField name="termsCondition" label="Terms & Conditions" multiline rows={4} required grid={{ xs: 12 }} />
                  <CommonValidationSwitch name="isDefault" label="Default" grid={{ xs: 12 }} />
                  <Grid sx={{ display: "flex", gap: 2, ml: "auto" }}>
                    <CommonButton type="button" variant="outlined" title="Cancel" onClick={onClose} />
                    <CommonButton type="button" loading={isAddLoading || isEditLoading} variant="contained" title="Save" disabled={!dirty} onClick={submitForm} />
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

const SelectTermsModal = ({ open, selectedIds, onClose, onSave }: { open: boolean; selectedIds: string[]; onClose: () => void; onSave: (ids: string[]) => void }) => {
  const { data, isLoading } = Queries.useGetTermsCondition({ enabled: open });
  const [terms, setTerms] = useState<TermsConditionBase[]>([]);

  useEffect(() => {
    const response = data as TermsConditionApiResponse | undefined;
    if (response?.data?.termsCondition_data) {
      setTerms(response.data.termsCondition_data);
    } else if (Array.isArray(response?.data)) {
      setTerms(response.data);
    }
  }, [data]);

  const initialValues: TermsSelectionFormValues = {
    selected: selectedIds,
  };

  const handleSubmit = (values: TermsSelectionFormValues, { resetForm }: FormikHelpers<TermsSelectionFormValues>) => {
    onSave(values.selected);
    onClose();
    resetForm();
  };

  return (
    <CommonModal title="Edit Terms" isOpen={open} onClose={onClose} className="max-w-125 m-2 sm:m-5">
      <Formik<TermsSelectionFormValues> enableReinitialize initialValues={initialValues} onSubmit={handleSubmit}>
        {({ values, setFieldValue, submitForm }) => (
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
                                values.selected.filter((id: string) => id !== term._id),
                              );
                            }
                          }}
                        />
                      </Grid>
                    ))
                  )}
                  <Grid sx={{ display: "flex", gap: 2, ml: "auto" }}>
                    <CommonButton type="button" variant="outlined" title="Cancel" onClick={onClose} />
                    <CommonButton type="button" variant="contained" title="Save" onClick={submitForm} />
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

const CommonTermsAndCondition = ({ selectedTermIds, onChange }: CommonTermsAndConditionProps) => {
  const [allTerms, setAllTerms] = useState<TermsConditionBase[]>([]);
  const { data: termsConditionData, refetch } = Queries.useGetTermsCondition();

  // Modals state
  const [addModalOpen, setAddModalOpen] = useState(false);
  const [selectModalOpen, setSelectModalOpen] = useState(false);
  const [editingTerm, setEditingTerm] = useState<TermsConditionBase | null>(null);

  useEffect(() => {
    if (!termsConditionData?.data) return;
    const response = termsConditionData.data;
    const all: TermsConditionBase[] = Array.isArray(response) ? response : (response.termsCondition_data ?? []);
    setAllTerms(all);
  }, [termsConditionData]);

  const displayTerms = allTerms.filter((term) => selectedTermIds.includes(term._id)).sort((a, b) => (b.isDefault ? 1 : 0) - (a.isDefault ? 1 : 0));

  const handleDeleteTerm = (index: number) => {
    const termToRemove = displayTerms[index];
    if (termToRemove?._id) {
      onChange(selectedTermIds.filter((id: string) => id !== termToRemove._id));
    }
  };

  const handleOpenAddTerm = () => {
    setEditingTerm(null);
    setAddModalOpen(true);
  };

  const handleEditSingleTerm = (term: TermsConditionBase) => {
    setEditingTerm(term);
    setAddModalOpen(true);
  };

  const handleSaveTerm = (savedTerm: TermsConditionBase) => {
    refetch();
    if (savedTerm.isDefault) {
      if (!selectedTermIds.includes(savedTerm._id)) {
        onChange([...selectedTermIds, savedTerm._id]);
      }
    }
  };

  const handleSaveSelection = (ids: string[]) => {
    onChange(ids);
  };

  const columns: CommonTableColumn<TermsConditionBase>[] = [
    { key: "sr", header: "#", bodyClass: "align-middle text-center w-[60px]", render: (_row: TermsConditionBase, index: number) => index + 1 },
    { key: "termsCondition", header: "Condition", headerClass: "text-left pl-6", bodyClass: "min-w-[400px] text-left pl-6" },
    {
      key: "action",
      header: "Action",
      headerClass: "text-center",
      bodyClass: "text-center w-[120px]",
      render: (row: TermsConditionBase, index: number) => (
        <Box display="flex" justifyContent="center" alignItems="center" gap={1} px={2}>
          <CommonButton type="button" size="small" color="primary" variant="outlined" onClick={() => handleEditSingleTerm(row)}>
            <Edit fontSize="small" />
          </CommonButton>
          <CommonButton type="button" size="small" color="error" variant="outlined" onClick={() => handleDeleteTerm(index)}>
            <GridDeleteIcon fontSize="small" />
          </CommonButton>
        </Box>
      ),
    },
  ];

  return (
    <Box sx={{ p: 3 }}>
      {/* HEADER */}
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
        <Box fontWeight={600}>Terms & Conditions</Box>

        <Box display="flex" gap={1}>
          <CommonButton type="button" size="small" startIcon={<Add />} onClick={handleOpenAddTerm} variant="outlined">
            New Term
          </CommonButton>
          <CommonButton type="button" size="small" onClick={() => setSelectModalOpen(true)} variant="outlined">
            <Edit fontSize="small" /> Edit Terms
          </CommonButton>
        </Box>
      </Box>

      {/* TABLE */}
      <Box sx={{ border: "1px solid", borderColor: "divider", borderRadius: 2, overflow: "hidden" }}>
        <CommonTable data={displayTerms} columns={columns} rowKey={(row: TermsConditionBase) => row._id || ""} />
      </Box>

      {/* NOTE */}
      <Box mt={3}>
        <CommonValidationTextField name="notes" label="Note" multiline rows={4} placeholder="Enter a note (max 200 characters)" />
      </Box>

      {/* MODALS */}
      <AddTermModal open={addModalOpen} term={editingTerm} onClose={() => setAddModalOpen(false)} onSave={handleSaveTerm} />
      <SelectTermsModal open={selectModalOpen} selectedIds={selectedTermIds} onClose={() => setSelectModalOpen(false)} onSave={handleSaveSelection} />
    </Box>
  );
};

export default CommonTermsAndCondition;
