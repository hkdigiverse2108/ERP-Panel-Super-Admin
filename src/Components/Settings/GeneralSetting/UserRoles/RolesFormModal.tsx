import { Grid } from "@mui/material";
import { Form, Formik, type FormikHelpers } from "formik";
import type { FC } from "react";
import { Mutations } from "../../../../Api";
import { CommonButton, CommonValidationTextField, CommonValidationSwitch } from "../../../../Attribute";
import { PAGE_TITLE } from "../../../../Constants";
import type { RolesBase, RolesFormValues } from "../../../../Types";
import { GetChangedFields, RemoveEmptyFields } from "../../../../Utils";
import { RolesFormSchema } from "../../../../Utils/ValidationSchemas";
import { CommonCard, CommonModal } from "../../../Common";

interface RolesFormModalProps {
  openModal: boolean;
  setOpenModal: (value: boolean) => void;
  isEdit: RolesBase;
}

const RolesFormModal: FC<RolesFormModalProps> = ({ openModal, setOpenModal, isEdit }) => {
  const { mutate: addRoles, isPending: isAddLoading } = Mutations.useAddRoles();
  const { mutate: editRoles, isPending: isEditLoading } = Mutations.useEditRoles();

  const isEditing = Boolean(isEdit?._id);
  const pageMode = isEditing ? "EDIT" : "ADD";

  const initialValues: RolesFormValues = {
    name: isEdit?.name || "",
    isActive: isEdit?.isActive ?? true,
  };

  const handleSubmit = (values: RolesFormValues, { resetForm }: FormikHelpers<RolesFormValues>) => {
    const { _submitAction, ...rest } = values;

    const onSuccessHandler = () => {
      if (_submitAction === "saveAndNew") resetForm({ values: initialValues });
      else {
        resetForm();
        setOpenModal(!openModal);
      }
    };

    if (isEditing) {
      const changedFields = GetChangedFields(rest, isEdit);
      editRoles({ ...changedFields, roleId: isEdit?._id }, { onSuccess: onSuccessHandler });
    } else {
      addRoles(RemoveEmptyFields(rest), { onSuccess: onSuccessHandler });
    }
  };
  return (
    <CommonModal title={PAGE_TITLE.ROLES[pageMode]} isOpen={openModal} onClose={() => setOpenModal(!openModal)} className="max-w-125 m-2 sm:m-5">
      <Formik<RolesFormValues> enableReinitialize initialValues={initialValues} validationSchema={RolesFormSchema} onSubmit={handleSubmit}>
        {({ setFieldValue, dirty }) => (
          <Form noValidate>
            <Grid container spacing={2}>
              <CommonCard hideDivider grid={{ xs: 12 }}>
                <Grid container spacing={2} sx={{ p: 2 }}>
                  <CommonValidationTextField name="name" label="Roles Name" required grid={{ xs: 12 }} />
                  {!isEditing && <CommonValidationSwitch name="isActive" label="Is Active" grid={{ xs: 12 }} />}
                  <Grid sx={{ display: "flex", gap: 2, ml: "auto" }}>
                    <CommonButton variant="outlined" onClick={() => setOpenModal(!openModal)} title="Cancel" />
                    <CommonButton type="submit" variant="contained" title="Save" onClick={() => setFieldValue("_submitAction", "save")} loading={isEditLoading || isAddLoading} disabled={!dirty} />
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

export default RolesFormModal;
