import { Grid } from "@mui/material";
import { Form, Formik, type FormikHelpers } from "formik";
import { useDispatch } from "react-redux";
import { Mutations } from "../../../Api";
import { CommonButton, CommonValidationSwitch, CommonValidationTextField } from "../../../Attribute";
import { CommonModal } from "../../../Components/Common";
import { PAGE_TITLE } from "../../../Constants";
import { useAppSelector } from "../../../Store/hooks";
import type { ProductTypeFormValues } from "../../../Types";
import { GetChangedFields, RemoveEmptyFields } from "../../../Utils";
import { ProductTypeFormSchema } from "../../../Utils/ValidationSchemas";
import { setProductTypeModal } from "../../../Store/Slices/ModalSlice";

const ProductTypeForm = () => {
  const { mutate: addProductType, isPending: isAddLoading } = Mutations.useAddProductType();
  const { mutate: editProductType, isPending: isEditLoading } = Mutations.useEditProductType();

  const dispatch = useDispatch();
  const { isProductTypeModal } = useAppSelector((state) => state.modal);

  const isEdit = isProductTypeModal.data;
  const openModal = isProductTypeModal.open;
  const isEditing = Boolean(isEdit?._id);
  const pageMode = isEditing ? "EDIT" : "ADD";

  const initialValues: ProductTypeFormValues = {
    name: isEdit?.name || "",
    isActive: isEdit?.isActive ?? true,
  };

  const closeModal = () => dispatch(setProductTypeModal({ open: false, data: null }));

  const handleSubmit = (values: ProductTypeFormValues, { resetForm }: FormikHelpers<ProductTypeFormValues>) => {
    const onSuccessHandler = () => {
      resetForm();
      closeModal();
    };

    if (isEditing) {
      const changedFields = GetChangedFields(values, isEdit as Partial<ProductTypeFormValues>);
      editProductType({ ...changedFields, productTypeId: isEdit?._id }, { onSuccess: onSuccessHandler });
    } else {
      addProductType(RemoveEmptyFields(values), { onSuccess: onSuccessHandler });
    }
  };

  return (
    <CommonModal title={PAGE_TITLE.INVENTORY.PRODUCT_TYPE[pageMode]} isOpen={openModal} onClose={closeModal} className="max-w-125">
      <Formik<ProductTypeFormValues> enableReinitialize initialValues={initialValues} validationSchema={ProductTypeFormSchema} onSubmit={handleSubmit}>
        {({ dirty }) => (
          <Form noValidate>
            <Grid container spacing={2} sx={{ p: 1 }}>
              <CommonValidationTextField name="name" label="Product Type Name" required grid={{ xs: 12 }} />

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
export default ProductTypeForm;
