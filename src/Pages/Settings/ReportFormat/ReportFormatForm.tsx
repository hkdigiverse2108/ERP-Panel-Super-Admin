import { useLocation, useNavigate } from "react-router-dom";
import { Mutations } from "../../../Api";
import { FieldArray, Form, Formik, type FormikHelpers } from "formik";
import type { AddReportFormatPayload, EditReportFormatPayload, ReportFormat, ReportFormatFormValues } from "../../../Types";
import { GetChangedFields, RemoveEmptyFields, ReportFormatFormSchema } from "../../../Utils";
import { CommonBottomActionBar, CommonBreadcrumbs, CommonCard } from "../../../Components/Common";
import { PAGE_TITLE } from "../../../Constants";
import { BREADCRUMBS } from "../../../Data";
import { Box, Grid } from "@mui/material";
import { CommonButton, CommonSwitch, CommonValidationSwitch, CommonValidationTextField } from "../../../Attribute";
import { GridCloseIcon } from "@mui/x-data-grid";
import { Add } from "@mui/icons-material";

const ReportFormatForm = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { data } = location.state || {};

  const isEditing = Boolean(data?._id);
  const pageMode = isEditing ? "EDIT" : "ADD";

  const { mutate: addReportFormat, isPending: isAddLoading } = Mutations.useAddReportFormat();
  const { mutate: editReportFormat, isPending: isEditLoading } = Mutations.useEditReportFormat();

  const initialValues: ReportFormatFormValues = {
    type: data?.type || "",
    formats: [
      ...(data?.formats?.length > 0
        ? data?.formats?.map((format: ReportFormat) => ({
            name: format.name || "",
            isActive: format.isActive ?? true,
            isSelected: format.isSelected ?? true,
          }))
        : [{ name: "", isActive: true, isSelected: true }]),
    ],
    isActive: data?.isActive ?? true,
  };

  const handleSubmit = async (values: ReportFormatFormValues, { resetForm }: FormikHelpers<ReportFormatFormValues>) => {
    const { _submitAction, ...rest } = values;

    const handleSuccess = () => {
      if (_submitAction === "saveAndNew") resetForm();
      else navigate(-1);
    };

    const payload = { ...rest };

    if (isEditing) {
      const changedFields = GetChangedFields(payload, data);
      editReportFormat({ ...changedFields, reportFormatId: data._id } as EditReportFormatPayload, { onSuccess: handleSuccess });
    } else {
      addReportFormat(RemoveEmptyFields(payload) as AddReportFormatPayload, { onSuccess: handleSuccess });
    }
  };

  return (
    <>
      <CommonBreadcrumbs title={PAGE_TITLE.REPORT_FORMAT[pageMode]} maxItems={3} breadcrumbs={BREADCRUMBS.REPORT_FORMAT[pageMode]} />

      <Box sx={{ p: { xs: 2, md: 3 }, mb: 8 }}>
        <Formik<ReportFormatFormValues> enableReinitialize initialValues={initialValues} validationSchema={ReportFormatFormSchema} onSubmit={handleSubmit}>
          {({ setFieldValue, resetForm, dirty, values }) => (
            <Form noValidate>
              <Box sx={{ display: "grid", gap: 2 }}>
                <CommonCard title="Report Format" grid={{ xs: 12 }}>
                  <Grid container spacing={2} sx={{ p: 2 }}>
                    <CommonValidationTextField name="type" label="Type" required grid={{ xs: 12, md: 4 }} />
                  </Grid>
                </CommonCard>

                <CommonCard title="Report Format" grid={{ xs: 12 }}>
                  <Box sx={{ p: 2, overflowX: "auto" }}>
                    <FieldArray name="formats">
                      {({ push, remove }) => {
                        return (
                          <>
                            {values?.formats?.map((_, index) => (
                              <Box key={index} sx={{ display: "flex", gap: 2, mb: 2, alignItems: "flex-end", minWidth: 700 }}>
                                <Box sx={{ flex: 1 }}>
                                  <CommonValidationTextField name={`formats.${index}.name`} label="Name" required />
                                </Box>
                                <Box>
                                  <CommonValidationSwitch name={`formats.${index}.isActive`} label="Is Active" />
                                </Box>
                                <Box>
                                  <CommonSwitch
                                    name={`formats.${index}.isSelected`}
                                    label="Is Selected"
                                    value={values?.formats?.[index]?.isSelected}
                                    onChange={(checked) => {
                                      if (checked) {
                                        const updatedFormats = values.formats?.map((format, fIndex) => ({
                                          ...format,
                                          isSelected: fIndex === index,
                                        }));
                                        setFieldValue("formats", updatedFormats);
                                      } else {
                                        setFieldValue(`formats.${index}.isSelected`, false);
                                      }
                                    }}
                                  />
                                </Box>

                                <Box sx={{ display: "flex", gap: 1 }}>
                                  {(values?.formats?.length || 0) > 1 && (
                                    <CommonButton type="button" title="Remove Format" variant="outlined" size="small" color="error" sx={{ minWidth: 40, height: 40 }} onClick={() => remove(index)}>
                                      <GridCloseIcon />
                                    </CommonButton>
                                  )}
                                  <CommonButton type="button" title="Add Format" variant="outlined" size="small" color="primary" sx={{ minWidth: 40, height: 40 }} onClick={() => push({ name: "", isSelected: false, isActive: true })}>
                                    <Add />
                                  </CommonButton>
                                </Box>
                              </Box>
                            ))}
                          </>
                        );
                      }}
                    </FieldArray>
                  </Box>
                </CommonCard>

                {!isEditing && <CommonValidationSwitch name="isActive" label="Is Active" grid={{ xs: 12 }} />}

                <CommonBottomActionBar save={isEditing} clear={!isEditing} disabled={!dirty} isLoading={isAddLoading || isEditLoading} onClear={() => resetForm({ values: initialValues })} onSave={() => setFieldValue("_submitAction", "save")} onSaveAndNew={() => setFieldValue("_submitAction", "saveAndNew")} />
              </Box>
            </Form>
          )}
        </Formik>
      </Box>
    </>
  );
};

export default ReportFormatForm;
