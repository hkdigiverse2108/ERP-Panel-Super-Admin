import { Grid } from "@mui/material";
import { Form, Formik, type FormikHelpers } from "formik";
import { useDispatch } from "react-redux";
import { Mutations, Queries } from "../../Api";
import { CommonButton, CommonValidationRadio, CommonValidationSelect, CommonValidationSwitch, CommonValidationTextField } from "../../Attribute";
import { CommonModal } from "../../Components/Common";
import { PAGE_TITLE } from "../../Constants";
import { LOCATION_TYPE } from "../../Data";
import { useAppSelector } from "../../Store/hooks";
import { setBrandModal } from "../../Store/Slices/ModalSlice";
import type { LocationFormValues } from "../../Types";
import { GenerateOptions, GetChangedFields, RemoveEmptyFields } from "../../Utils";
import { BrandFormSchema } from "../../Utils/ValidationSchemas";

const LocationForm = () => {
  const { mutate: addBrand, isPending: isAddLoading } = Mutations.useAddBrand();
  const { mutate: editBrand, isPending: isEditLoading } = Mutations.useEditBrand();

  const { data: brandData, isLoading: brandDataLoading } = Queries.useGetBrandDropdown();
  const { isBrandModal } = useAppSelector((state) => state.modal);

  const dispatch = useDispatch();

  const isEdit = isBrandModal.data;
  const openModal = isBrandModal.open;
  const isEditing = Boolean(isEdit?._id);
  const pageMode = isEditing ? "EDIT" : "ADD";

  const initialValues: LocationFormValues = {
    name: isEdit?.name || "",
    code: isEdit?.code || "",
    type: isEdit?.type || "country",
    parentLocationId: isEdit?.parentLocationId?._id || "",
    isActive: isEdit?.isActive ?? true,
  };

  const closeModal = () => dispatch(setBrandModal({ open: false, data: null }));

  const handleSubmit = (values: LocationFormValues, { resetForm }: FormikHelpers<LocationFormValues>) => {
    const onSuccessHandler = () => {
      resetForm();
      closeModal();
    };

    if (isEditing) {
      const changedFields = GetChangedFields(values, isEdit as Partial<LocationFormValues>);
      editBrand({ ...changedFields, brandId: isEdit?._id }, { onSuccess: onSuccessHandler });
    } else {
      addBrand(RemoveEmptyFields(values), { onSuccess: onSuccessHandler });
    }
  };

  return (
    <CommonModal title={PAGE_TITLE.LOCATION[pageMode]} isOpen={openModal} onClose={closeModal} className="max-w-125">
      <Formik<LocationFormValues> enableReinitialize initialValues={initialValues} validationSchema={BrandFormSchema} onSubmit={handleSubmit}>
        {({ dirty, values }) => (
          <Form noValidate>
            <Grid container spacing={2} sx={{ p: 1 }}>
              <CommonValidationRadio name="type" options={LOCATION_TYPE} grid={{ xs: 12 }} />
              {values.type !== "country" && <CommonValidationSelect name="parentBrandId" label={`${values.type} Name`} isLoading={brandDataLoading} options={GenerateOptions(brandData?.data)} grid={{ xs: 12 }} />}
              <CommonValidationTextField name="name" label={`${values.type} Name`} required grid={{ xs: 12 }} />
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
export default LocationForm;
