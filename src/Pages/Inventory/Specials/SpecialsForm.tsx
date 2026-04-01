import { Grid } from "@mui/material";
import { Form, Formik, useFormikContext, type FormikHelpers, type FormikValues } from "formik";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { Mutations } from "../../../Api";
import { CommonButton, CommonValidationSwitch, CommonValidationTextField } from "../../../Attribute";
import { CommonModal } from "../../../Components/Common";
import { CommonFormImageBox } from "../../../Components/Common/CommonUploadImage/CommonImageBox";
import { PAGE_TITLE } from "../../../Constants";
import { useAppDispatch, useAppSelector } from "../../../Store/hooks";
import { setSelectedFiles, setSpecialsModal, setUploadModal } from "../../../Store/Slices/ModalSlice";
import type { ImageSyncProps, SpecialsFormValues } from "../../../Types";
import { GetChangedFields, RemoveEmptyFields } from "../../../Utils";
import { SpecialsFormSchema } from "../../../Utils/ValidationSchemas";

const SpecialsForm = () => {
  const { mutate: addSpecial, isPending: isAddLoading } = Mutations.useAddSpecial();
  const { mutate: editSpecial, isPending: isEditLoading } = Mutations.useEditSpecial();

  const [activeImageKey, setActiveImageKey] = useState<"image" | null>(null);
  const { isSpecialsModal } = useAppSelector((state) => state.modal);

  const dispatch = useDispatch();

  const isEdit = isSpecialsModal.data;
  const openModal = isSpecialsModal.open;
  const isEditing = Boolean(isEdit?._id);
  const pageMode = isEditing ? "EDIT" : "ADD";

  const initialValues: SpecialsFormValues = {
    name: isEdit?.name || "",
    price: isEdit?.price || "",
    image: typeof isEdit?.image === "string" ? isEdit.image : null,
    description: isEdit?.description || "",
    isActive: isEdit?.isActive ?? true,
  };

  const FormikImageSync = <T extends FormikValues>({ activeKey, clearActiveKey }: ImageSyncProps) => {
    const { selectedFiles } = useAppSelector((state) => state.modal);
    const dispatch = useAppDispatch();
    const { setFieldValue } = useFormikContext<T>();

    useEffect(() => {
      if (!selectedFiles[0] || !activeKey) return;

      setFieldValue(activeKey, selectedFiles[0]);

      dispatch(setSelectedFiles([]));
      clearActiveKey();
    }, [selectedFiles, activeKey, setFieldValue, dispatch, clearActiveKey]);

    return null;
  };

  const handleUpload = () => {
    setActiveImageKey("image");
    dispatch(setUploadModal({ open: true, type: "image" }));
  };

  const closeModal = () => dispatch(setSpecialsModal({ open: false, data: null }));

  const handleSubmit = (values: SpecialsFormValues, { resetForm }: FormikHelpers<SpecialsFormValues>) => {
    const onSuccessHandler = () => {
      resetForm();
      closeModal();
    };

    if (isEditing) {
      const changedFields = GetChangedFields(values, isEdit as Partial<SpecialsFormValues>);
      editSpecial({ ...changedFields, specialId: isEdit?._id as string }, { onSuccess: onSuccessHandler });
    } else {
      addSpecial(RemoveEmptyFields(values) as any, { onSuccess: onSuccessHandler });
    }
  };

  return (
    <CommonModal title={PAGE_TITLE.INVENTORY.SPECIALS[pageMode]} isOpen={openModal} onClose={closeModal} className="max-w-125">
      <Formik<SpecialsFormValues> enableReinitialize initialValues={initialValues} validationSchema={SpecialsFormSchema} onSubmit={handleSubmit}>
        {({ setFieldValue, dirty }) => (
          <Form noValidate>
            <FormikImageSync activeKey={activeImageKey} clearActiveKey={() => setActiveImageKey(null)} />

            <Grid container spacing={2} sx={{ p: 1 }}>
              <CommonValidationTextField name="name" label="Item Name" required grid={{ xs: 12 }} />
              <CommonValidationTextField name="price" label="Price" type="number" required grid={{ xs: 12 }} />
              <CommonValidationTextField name="description" label="Description" multiline rows={3} grid={{ xs: 12 }} />
              <CommonFormImageBox name="image" label="Image" type="image" grid={{ xs: 12 }} onUpload={handleUpload} onDelete={() => setFieldValue("image", null)} />

              <CommonValidationSwitch name="isActive" label="Is Active" grid={{ xs: 12 }} />
              
              <Grid sx={{ display: "flex", gap: 2, ml: "auto", mt: 2 }}>
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

export default SpecialsForm;
