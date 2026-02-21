import { Grid } from "@mui/material";
import { Form, Formik, type FormikHelpers } from "formik";
import { useDispatch } from "react-redux";
import { Mutations } from "../../Api";
import { CommonButton, CommonValidationSwitch, CommonValidationTextField } from "../../Attribute";
import { CommonModal } from "../../Components/Common";
import { PAGE_TITLE } from "../../Constants";
import { useAppSelector } from "../../Store/hooks";
import { setRoleModal } from "../../Store/Slices/ModalSlice";
import type { RolesFormValues } from "../../Types";
import { GetChangedFields, RemoveEmptyFields } from "../../Utils";
import { RoleFormSchema } from "../../Utils/ValidationSchemas";

const RoleForm = () => {
  const { mutate: addRole, isPending: isAddLoading } = Mutations.useAddRole();
  const { mutate: editRole, isPending: isEditLoading } = Mutations.useEditRole();

  const { isRoleModal } = useAppSelector((state) => state.modal);

  const dispatch = useDispatch();

  const isEdit = isRoleModal.data;
  const openModal = isRoleModal.open;
  const isEditing = Boolean(isEdit?._id);
  const pageMode = isEditing ? "EDIT" : "ADD";

  const initialValues: RolesFormValues = {
    name: isEdit?.name || "",
    isActive: isEdit?.isActive ?? true,
  };

  const closeModal = () => dispatch(setRoleModal({ open: false, data: null }));

  const handleSubmit = (values: RolesFormValues, { resetForm }: FormikHelpers<RolesFormValues>) => {
    const onSuccessHandler = () => {
      resetForm();
      closeModal();
    };

    if (isEditing) {
      const changedFields = GetChangedFields(values, isEdit as Partial<RolesFormValues>);
      editRole({ ...changedFields, roleId: isEdit?._id as string }, { onSuccess: onSuccessHandler });
    } else {
      addRole(RemoveEmptyFields(values), { onSuccess: onSuccessHandler });
    }
  };

  return (
    <CommonModal title={PAGE_TITLE.ROLE[pageMode]} isOpen={openModal} onClose={closeModal} className="max-w-125">
      <Formik<RolesFormValues> enableReinitialize initialValues={initialValues} validationSchema={RoleFormSchema} onSubmit={handleSubmit}>
        {({ dirty }) => (
          <Form noValidate>
            <Grid container spacing={2} sx={{ p: 1 }}>
              <CommonValidationTextField name="name" label="Role Name" grid={{ xs: 12 }} required />

              {!isEditing && <CommonValidationSwitch name="isActive" label="Is Active" grid={{ xs: 12 }} />}
              <Grid sx={{ display: "flex", gap: 2, ml: "auto" }}>
                <CommonButton variant="outlined" onClick={closeModal} title="Cancel" />
                <CommonButton type="submit" variant="contained" title="Save" loading={isEditLoading || isAddLoading} disabled={!dirty} />
              </Grid>
            </Grid>
          </Form>
        )}
      </Formik>
    </CommonModal>
  );
};
export default RoleForm;
