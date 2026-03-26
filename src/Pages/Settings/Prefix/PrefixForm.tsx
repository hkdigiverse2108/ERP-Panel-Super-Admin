import { Grid } from "@mui/material";
import { Form, Formik, type FormikHelpers } from "formik";
import { useDispatch } from "react-redux";
import { Mutations } from "../../../Api";
import { CommonButton, CommonValidationSelect, CommonValidationTextField } from "../../../Attribute";
import { PAGE_TITLE } from "../../../Constants";
import { PREFIX_MODULES_OPTIONS } from "../../../Data";
import { useAppSelector } from "../../../Store/hooks";
import { setPrefixModal } from "../../../Store/Slices/ModalSlice";
import type { PrefixFormValues } from "../../../Types";
import { GetChangedFields, PrefixFormSchema } from "../../../Utils";
import { CommonModal } from "../../../Components/Common";

const PrefixForm = () => {
  const { mutate: addPrefix, isPending: isAddLoading } = Mutations.useAddPrefix();
  const { mutate: editPrefix, isPending: isEditLoading } = Mutations.useEditPrefix();

  const dispatch = useDispatch();
  const { isPrefixModal } = useAppSelector((state) => state.modal);

  const isEdit = isPrefixModal.data;
  const openModal = isPrefixModal.open;

  const initialValues: PrefixFormValues = {
    prefixType: isEdit?.prefixType || "",
    prefix: isEdit?.prefix || "",
    sequenceNumber: isEdit?.sequenceNumber || 1,
  };

  const closeModal = () => dispatch(setPrefixModal({ open: false, data: null }));

  const handleSubmit = (values: PrefixFormValues, { resetForm }: FormikHelpers<PrefixFormValues>) => {
    const onSuccessHandler = () => {
      resetForm();
      closeModal();
    };

    if (isPrefixModal.data?._id) {
      const changedFields = GetChangedFields(values, isEdit as Partial<PrefixFormValues>);
      editPrefix({ ...changedFields, prefixId: isEdit?._id }, { onSuccess: onSuccessHandler });
    } else {
      addPrefix(values, { onSuccess: onSuccessHandler });
    }
  };

  return (
    <CommonModal title={isEdit ? PAGE_TITLE.SETTINGS.PREFIX.EDIT : PAGE_TITLE.SETTINGS.PREFIX.ADD} isOpen={openModal} onClose={closeModal} className="max-w-125">
      <Formik<PrefixFormValues> enableReinitialize initialValues={initialValues} validationSchema={PrefixFormSchema} onSubmit={handleSubmit}>
        {({ dirty }) => (
          <Form noValidate>
            <Grid container spacing={2} sx={{ p: 1 }}>
              <CommonValidationSelect name="prefixType" label="Prefix Type" required options={PREFIX_MODULES_OPTIONS} grid={{ xs: 12 }} />
              <CommonValidationTextField name="prefix" label="Prefix" required grid={{ xs: 12 }} />
              <CommonValidationTextField name="sequenceNumber" label="Sequence Number" type="number" required grid={{ xs: 12 }} />

              <Grid sx={{ display: "flex", gap: 2, ml: "auto" }}>
                <CommonButton variant="outlined" onClick={closeModal} title="Cancel" />
                <CommonButton type="submit" variant="contained" title="Save" loading={isAddLoading || isEditLoading} disabled={!dirty} />
              </Grid>
            </Grid>
          </Form>
        )}
      </Formik>
    </CommonModal>
  );
};

export default PrefixForm;
