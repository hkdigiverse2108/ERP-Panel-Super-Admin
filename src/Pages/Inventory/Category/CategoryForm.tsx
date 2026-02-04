import { Grid } from "@mui/material";
import { Form, Formik, useFormikContext, type FormikHelpers, type FormikValues } from "formik";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { Mutations, Queries } from "../../../Api";
import { CommonButton, CommonValidationSelect, CommonValidationSwitch, CommonValidationTextField } from "../../../Attribute";
import { CommonModal } from "../../../Components/Common";
import { CommonFormImageBox } from "../../../Components/Common/CommonUploadImage/CommonImageBox";
import { PAGE_TITLE } from "../../../Constants";
import { useAppDispatch, useAppSelector } from "../../../Store/hooks";
import { setCategoryModal, setSelectedFiles, setUploadModal } from "../../../Store/Slices/ModalSlice";
import type { CategoryFormValues, ImageSyncProps } from "../../../Types";
import { GenerateOptions, GetChangedFields, RemoveEmptyFields } from "../../../Utils";
import { CategoryFormSchema } from "../../../Utils/ValidationSchemas";

const CategoryForm = () => {
  const { mutate: addCategory, isPending: isAddLoading } = Mutations.useAddCategory();
  const { mutate: editCategory, isPending: isEditLoading } = Mutations.useEditCategory();
  const { data: categoryData, isLoading: categoryDataLoading } = Queries.useGetCategoryDropdown({ onlyCategoryFilter: true });

  const dispatch = useDispatch();
  const { isCategoryModal } = useAppSelector((state) => state.modal);
  const [activeImageKey, setActiveImageKey] = useState<"image" | null>(null);

  const isEdit = isCategoryModal.data;
  const openModal = isCategoryModal.open;
  const isEditing = Boolean(isEdit?._id);
  const pageMode = isEditing ? "EDIT" : "ADD";

  const initialValues: CategoryFormValues = {
    name: isEdit?.name || "",
    code: isEdit?.code || "",
    image: typeof isEdit?.image === "string" ? isEdit.image : null,
    description: isEdit?.description || "",
    parentCategoryId: isEdit?.parentCategoryId?._id || "",
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

  const closeModal = () => dispatch(setCategoryModal({ open: false, data: null }));

  const handleSubmit = (values: CategoryFormValues, { resetForm }: FormikHelpers<CategoryFormValues>) => {
    const onSuccessHandler = () => {
      resetForm();
      closeModal();
    };

    if (isEditing) {
      const changedFields = GetChangedFields(values, isEdit as Partial<CategoryFormValues>);
      editCategory({ ...changedFields, categoryId: isEdit?._id }, { onSuccess: onSuccessHandler });
    } else {
      addCategory(RemoveEmptyFields(values), { onSuccess: onSuccessHandler });
    }
  };

  return (
    <CommonModal title={PAGE_TITLE.INVENTORY.CATEGORY[pageMode]} isOpen={openModal} onClose={closeModal} className="max-w-125">
      <Formik<CategoryFormValues> enableReinitialize initialValues={initialValues} validationSchema={CategoryFormSchema} onSubmit={handleSubmit}>
        {({ setFieldValue, dirty }) => (
          <Form noValidate>
            <FormikImageSync activeKey={activeImageKey} clearActiveKey={() => setActiveImageKey(null)} />

            <Grid container spacing={2} sx={{ p: 1 }}>
              <CommonValidationTextField name="name" label="Category Name" required grid={{ xs: 12 }} />
              <CommonValidationTextField name="code" label="Code"  grid={{ xs: 12 }} />
              <CommonValidationTextField name="description" label="Description" grid={{ xs: 12 }} />
              <CommonValidationSelect name="parentCategoryId" label="Parent Category" isLoading={categoryDataLoading} options={GenerateOptions(categoryData?.data)} grid={{ xs: 12 }} />
              <CommonFormImageBox name="image" label="Image" type="image" grid={{ xs: 12 }} onUpload={handleUpload} onDelete={() => setFieldValue("image", null)} />

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
export default CategoryForm;
