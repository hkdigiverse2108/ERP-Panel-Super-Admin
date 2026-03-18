import { Box, Grid } from "@mui/material";
import { Form, Formik, type FormikHelpers } from "formik";
import { useLocation, useNavigate } from "react-router-dom";
import { Mutations } from "../../Api";
import { CommonValidationQuillInput, CommonValidationSwitch, CommonValidationTextField } from "../../Attribute";
import { CommonBottomActionBar, CommonBreadcrumbs, CommonCard } from "../../Components/Common";
import { BREADCRUMBS } from "../../Data";
import { PAGE_TITLE } from "../../Constants";
import { GetChangedFields, RemoveEmptyFields } from "../../Utils";
import type { AnnouncementFormValues, AddAnnouncementPayload, EditAnnouncementPayload } from "../../Types";

const AnnouncementForm = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { data } = location.state || {};

  const isEditing = Boolean(data?._id);
  const pageMode = isEditing ? "EDIT" : "ADD";

  const { mutate: addAnnouncement, isPending: isAddLoading } = Mutations.useAddAnnouncement();
  const { mutate: editAnnouncement, isPending: isEditLoading } = Mutations.useEditAnnouncement();

  // ✅ INITIAL VALUES
  const initialValues: AnnouncementFormValues = {
    link: data?.link || "",
    version: data?.version || "",
    desc: Array.isArray(data?.desc) ? data.desc.join(", ") : data?.desc || "",
    isActive: data?.isActive ?? true,
  };

  const handleSubmit = async (values: AnnouncementFormValues, { resetForm }: FormikHelpers<AnnouncementFormValues>) => {
    const { _submitAction, ...rest } = values;

    const handleSuccess = () => {
      if (_submitAction === "saveAndNew") resetForm();
      else navigate(-1);
    };

    const payload = { ...rest };

    if (isEditing) {
      const changedFields = GetChangedFields(payload, data);
      editAnnouncement({ ...changedFields, announcementId: data._id } as EditAnnouncementPayload, { onSuccess: handleSuccess });
    } else {
      addAnnouncement(RemoveEmptyFields(payload) as AddAnnouncementPayload, { onSuccess: handleSuccess });
    }
  };

  return (
    <>
      <CommonBreadcrumbs title={PAGE_TITLE.ANNOUNCEMENT[pageMode]} maxItems={3} breadcrumbs={BREADCRUMBS.ANNOUNCEMENT[pageMode]} />

      <Box sx={{ p: { xs: 2, md: 3 }, mb: 8 }}>
        <Formik<AnnouncementFormValues> initialValues={initialValues} onSubmit={handleSubmit}>
          {({ setFieldValue, resetForm, dirty }) => (
            <Form noValidate>
              <Box sx={{ display: "grid", gap: 2 }}>
                {/* ANNOUNCEMENT DETAILS */}
                <CommonCard title="Announcement Details">
                  <Grid container spacing={2} sx={{ p: 2 }}>
                    <CommonValidationTextField name="link" label="Link" grid={{ xs: 12, md: 6 }} />
                    <CommonValidationTextField name="version" label="Version" grid={{ xs: 12, md: 6 }} />
                    <CommonValidationQuillInput name="desc" label="Description" grid={{ xs: 12 }} />
                  </Grid>
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

export default AnnouncementForm;
