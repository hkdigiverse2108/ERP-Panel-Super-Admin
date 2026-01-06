import { Grid } from "@mui/material";
import { Form, Formik, useFormikContext, type FormikHelpers, type FormikValues } from "formik";
import { useEffect, useState, type FC } from "react";
import { useDispatch } from "react-redux";
import { Mutations, Queries } from "../../../Api";
import { CommonButton, CommonValidationSelect, CommonValidationSwitch, CommonValidationTextField } from "../../../Attribute";
import { CommonModal } from "../../../Components/Common";
import { CommonFormImageBox } from "../../../Components/Common/CommonUploadImage/CommonImageBox";
import { PAGE_TITLE } from "../../../Constants";
import { useAppDispatch, useAppSelector } from "../../../Store/hooks";
import { setBrandModal, setSelectedFiles, setUploadModal } from "../../../Store/Slices/ModalSlice";
import type { BrandFormValues, ImageSyncProps } from "../../../Types";
import { GenerateOptions, GetChangedFields, RemoveEmptyFields } from "../../../Utils";
import { BrandFormSchema } from "../../../Utils/ValidationSchemas";

const BrandForm: FC = () => {
    const { mutate: addBrand, isPending: isAddLoading } = Mutations.useAddBrand();
    const { mutate: editBrand, isPending: isEditLoading } = Mutations.useEditBrand();
    const { data: brandData } = Queries.useGetBrand();
    const dispatch = useDispatch();
    const { isBrandModal } = useAppSelector((state) => state.modal);
    const isEdit = isBrandModal.data;
    const openModal = isBrandModal.open;
    const isEditing = Boolean(isEdit?._id);
    const pageMode = isEditing ? "EDIT" : "ADD";

    const initialValues: BrandFormValues = {
        name: isEdit?.name || "",
        code: isEdit?.code || "",
        image: typeof isEdit?.image === 'string' ? isEdit.image : null,
        description: isEdit?.description || "",
        parentBrandId: isEdit?.parentBrandId?._id || "",
        isActive: isEdit?.isActive ?? true,
    };
    const [activeImageKey, setActiveImageKey] = useState<"image" | null>(null);

    const FormikImageSync = <T extends FormikValues>({
        activeKey,
        clearActiveKey,
    }: ImageSyncProps) => {
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


    const closeModal = () => {
        dispatch(setBrandModal({ open: false, data: null }));
    }
    const handleSubmit = (values: BrandFormValues, { resetForm }: FormikHelpers<BrandFormValues>) => {
        const { _submitAction, ...rest } = values;

        const onSuccessHandler = () => {
            resetForm()
            closeModal();
        };

        if (isEditing) {
            const changedFields = GetChangedFields(rest);
            editBrand({ ...changedFields, brandId: isEdit?._id }, { onSuccess: onSuccessHandler });
        } else {
            addBrand(RemoveEmptyFields(rest), { onSuccess: onSuccessHandler });
        }
    };


    return (
        <CommonModal title={PAGE_TITLE.INVENTORY.BRAND[pageMode]} isOpen={openModal} onClose={closeModal} className="max-w-125">
            <Formik<BrandFormValues> enableReinitialize initialValues={initialValues} validationSchema={BrandFormSchema} onSubmit={handleSubmit}>
                {({ setFieldValue, dirty }) => (
                    <Form noValidate>
                        <FormikImageSync
                            activeKey={activeImageKey}
                            clearActiveKey={() => setActiveImageKey(null)}
                        />

                        <Grid container spacing={2} sx={{ p: 1 }}>
                            <CommonValidationTextField name="name" label="Brand Name" required grid={{ xs: 12 }} />
                            <CommonValidationTextField name="code" label="Code" required grid={{ xs: 12 }} />
                            <CommonValidationTextField name="description" label="Description" required grid={{ xs: 12 }} />
                            <CommonValidationSelect name="parentBrandId" label="Parent Brand" options={GenerateOptions(brandData?.data?.brand_data)} grid={{ xs: 12 }} />
                            <CommonFormImageBox name="image" label="Image" type="image" grid={{ xs: 12 }} onUpload={handleUpload} onDelete={() => setFieldValue("image", null)} />

                            {!isEditing && <CommonValidationSwitch name="isActive" label="Is Active" grid={{ xs: 12 }} />}
                            <Grid sx={{ display: "flex", gap: 2, ml: "auto" }}>
                                <CommonButton variant="outlined" onClick={closeModal} title="Cancel" />
                                <CommonButton type="submit" variant="contained" title="Save" onClick={() => setFieldValue("_submitAction", "save")} loading={isEditLoading || isAddLoading} disabled={!dirty} />
                            </Grid>
                        </Grid>
                    </Form>
                )}
            </Formik>
        </CommonModal>
    );
};
export default BrandForm;