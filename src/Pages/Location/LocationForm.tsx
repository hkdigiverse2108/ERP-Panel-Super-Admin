import { Grid } from "@mui/material";
import { Form, Formik, type FormikHelpers } from "formik";
import { useDispatch } from "react-redux";
import { Mutations, Queries } from "../../Api";
import { CommonButton, CommonValidationRadio, CommonValidationSelect, CommonValidationSwitch, CommonValidationTextField } from "../../Attribute";
import { CommonModal } from "../../Components/Common";
import { PAGE_TITLE } from "../../Constants";
import { LOCATION_TYPE } from "../../Data";
import { useAppSelector } from "../../Store/hooks";
import { setLocationModal } from "../../Store/Slices/ModalSlice";
import type { LocationFormValues } from "../../Types";
import { GenerateOptions, GetChangedFields, RemoveEmptyFields } from "../../Utils";
import { LocationFormSchema } from "../../Utils/ValidationSchemas";

const LocationForm = () => {
  const { mutate: addLocation, isPending: isAddLoading } = Mutations.useAddLocation();
  const { mutate: editLocation, isPending: isEditLoading } = Mutations.useEditLocation();

  const { isLocationModal } = useAppSelector((state) => state.modal);

  const dispatch = useDispatch();

  const isEdit = isLocationModal.data;
  const openModal = isLocationModal.open;
  const isEditing = Boolean(isEdit?._id);
  const pageMode = isEditing ? "EDIT" : "ADD";

  const initialValues: LocationFormValues = {
    name: isEdit?.name || "",
    code: isEdit?.code || "",
    type: isEdit?.type || "country",
    parentId: isEdit?.parentId?._id || "",
    isActive: isEdit?.isActive ?? true,
  };

  const closeModal = () => dispatch(setLocationModal({ open: false, data: null }));

  const LocationSelect = ({ id }: { id?: string }) => {
    const typeFilter = id === "state" ? "country" : "state";
    const label = `${id === "state" ? "Country" : "State"} Name`;
    const { data: locationData, isLoading: locationDataLoading } = Queries.useGetLocation({ typeFilter });
    return id !== "country" && <CommonValidationSelect name="parentId" label={label} isLoading={locationDataLoading} options={GenerateOptions(locationData?.data?.location_data)} grid={{ xs: 12 }} required />;
  };

  const handleSubmit = (values: LocationFormValues, { resetForm }: FormikHelpers<LocationFormValues>) => {
    const onSuccessHandler = () => {
      resetForm();
      closeModal();
    };

    if (isEditing) {
      const changedFields = GetChangedFields(values, isEdit as Partial<LocationFormValues>);
      editLocation({ ...changedFields, locationId: isEdit?._id }, { onSuccess: onSuccessHandler });
    } else {
      addLocation(RemoveEmptyFields(values), { onSuccess: onSuccessHandler });
    }
  };

  return (
    <CommonModal title={PAGE_TITLE.LOCATION[pageMode]} isOpen={openModal} onClose={closeModal} className="max-w-125">
      <Formik<LocationFormValues> enableReinitialize initialValues={initialValues} validationSchema={LocationFormSchema} onSubmit={handleSubmit}>
        {({ dirty, values }) => (
          <Form noValidate>
            <Grid container spacing={2} sx={{ p: 1 }}>
              <CommonValidationRadio name="type" options={LOCATION_TYPE.map((opt) => ({ ...opt, disabled: isEditing && opt.value !== isEdit?.type }))} grid={{ xs: 12 }} />
              <LocationSelect id={values.type} />
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
