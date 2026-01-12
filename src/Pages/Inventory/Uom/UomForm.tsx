import { Grid } from "@mui/material";
import { Form, Formik, type FormikHelpers } from "formik";
import { useDispatch } from "react-redux";
import { Mutations } from "../../../Api";
import { CommonButton, CommonValidationSwitch, CommonValidationTextField } from "../../../Attribute";
import { CommonModal } from "../../../Components/Common";
import { PAGE_TITLE } from "../../../Constants";
import { useAppSelector } from "../../../Store/hooks";
import { setUomModal } from "../../../Store/Slices/ModalSlice";
import type { UomFormValues } from "../../../Types";
import { GetChangedFields, RemoveEmptyFields } from "../../../Utils";
import { UomFormSchema } from "../../../Utils/ValidationSchemas";

const UomForm = () => {
  const { mutate: addUom, isPending: isAddLoading } = Mutations.useAddUom();
  const { mutate: editUom, isPending: isEditLoading } = Mutations.useEditUom();

  const dispatch = useDispatch();
  const { isUomModal } = useAppSelector((state) => state.modal);

  const isEdit = isUomModal.data;
  const openModal = isUomModal.open;
  const isEditing = Boolean(isEdit?._id);
  const pageMode = isEditing ? "EDIT" : "ADD";

  const initialValues: UomFormValues = {
    name: isEdit?.name || "",
    code: isEdit?.code || "",
    isActive: isEdit?.isActive ?? true,
  };

  const closeModal = () => dispatch(setUomModal({ open: false, data: null }));

  const handleSubmit = (values: UomFormValues, { resetForm }: FormikHelpers<UomFormValues>) => {
    const onSuccessHandler = () => {
      resetForm();
      closeModal();
    };

    if (isEditing) {
      const changedFields = GetChangedFields(values, isEdit as Partial<UomFormValues>);
      editUom({ ...changedFields, uomId: isEdit?._id }, { onSuccess: onSuccessHandler });
    } else {
      addUom(RemoveEmptyFields(values), { onSuccess: onSuccessHandler });
    }
  };

  return (
    <CommonModal title={PAGE_TITLE.INVENTORY.UOM[pageMode]} isOpen={openModal} onClose={closeModal} className="max-w-125">
      <Formik<UomFormValues> enableReinitialize initialValues={initialValues} validationSchema={UomFormSchema} onSubmit={handleSubmit}>
        {({ dirty }) => (
          <Form noValidate>
            <Grid container spacing={2} sx={{ p: 1 }}>
              <CommonValidationTextField name="name" label="Uom Name" required grid={{ xs: 12 }} />
              <CommonValidationTextField name="code" label="Code" required grid={{ xs: 12 }} />

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
export default UomForm;
