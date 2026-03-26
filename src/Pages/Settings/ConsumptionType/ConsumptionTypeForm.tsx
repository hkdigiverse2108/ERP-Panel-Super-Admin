import { Grid } from "@mui/material";
import { Form, Formik, type FormikHelpers } from "formik";
import { useDispatch } from "react-redux";
import { Mutations } from "../../../Api";
import { useAppSelector } from "../../../Store/hooks";
import type { ConsumptionTypeFormValues } from "../../../Types";
import { setConsumptionTypeModal } from "../../../Store/Slices/ModalSlice";
import { ConsumptionTypeFormSchema, GetChangedFields, RemoveEmptyFields } from "../../../Utils";
import { CommonModal } from "../../../Components/Common";
import { PAGE_TITLE } from "../../../Constants";
import { CommonButton, CommonValidationSwitch, CommonValidationTextField } from "../../../Attribute";

const ConsumptionTypeForm = () => {
  const { mutate: addConsumptionType, isPending: isAddLoading } = Mutations.useAddConsumptionType();
  const { mutate: editConsumptionType, isPending: isEditLoading } = Mutations.useEditConsumptionType();

  const dispatch = useDispatch();
  const { isConsumptionTypeModal } = useAppSelector((state) => state.modal);

  const isEdit = isConsumptionTypeModal.data;
  const openModal = isConsumptionTypeModal.open;
  const isEditing = Boolean(isEdit?._id);
  const pageMode = isEditing ? "EDIT" : "ADD";

  const initialValues: ConsumptionTypeFormValues = {
    name: isEdit?.name || "",
    isActive: isEdit?.isActive ?? true,
  };

  const closeModal = () => dispatch(setConsumptionTypeModal({ open: false, data: null }));

  const handleSubmit = (values: ConsumptionTypeFormValues, { resetForm }: FormikHelpers<ConsumptionTypeFormValues>) => {
    const onSuccessHandler = () => {
      resetForm();
      closeModal();
    };

    if (isEditing) {
      const changedFields = GetChangedFields(values, isEdit as Partial<ConsumptionTypeFormValues>);
      editConsumptionType({ ...changedFields, consumptionTypeId: isEdit?._id }, { onSuccess: onSuccessHandler });
    } else {
      addConsumptionType(RemoveEmptyFields(values), { onSuccess: onSuccessHandler });
    }
  };

  return (
    <CommonModal title={PAGE_TITLE.SETTINGS.CONSUMPTION_TYPE[pageMode]} isOpen={openModal} onClose={closeModal} className="max-w-125">
      <Formik<ConsumptionTypeFormValues> enableReinitialize initialValues={initialValues} validationSchema={ConsumptionTypeFormSchema} onSubmit={handleSubmit}>
        {({ dirty }) => (
          <Form noValidate>
            <Grid container spacing={2} sx={{ p: 1 }}>
              <CommonValidationTextField name="name" label="Payment Terms Name" required grid={{ xs: 12 }} />
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
export default ConsumptionTypeForm;
