import { Box, Grid } from "@mui/material";
import { Form, Formik, useFormikContext, type FormikHelpers, type FormikValues } from "formik";
import { useLocation, useNavigate } from "react-router-dom";
import { Mutations } from "../../../Api";
import { CommonValidationSelect, CommonValidationSwitch, CommonValidationTextField } from "../../../Attribute";
import { CommonBottomActionBar, CommonBreadcrumbs, CommonCard } from "../../../Components/Common";
import { PAGE_TITLE } from "../../../Constants";
import { BREADCRUMBS, PRODUCT_TYPE_OPTIONS } from "../../../Data";
import type { ImageSyncProps, ProductRequestFormValues } from "../../../Types";
import { RemoveEmptyFields } from "../../../Utils";
import { ProductRequestFormSchema } from "../../../Utils/ValidationSchemas";
import { CommonFormImageBox } from "../../../Components/Common/CommonUploadImage/CommonImageBox";
import { useAppDispatch, useAppSelector } from "../../../Store/hooks";
import { useEffect, useState } from "react";
import { setSelectedFiles, setUploadModal } from "../../../Store/Slices/ModalSlice";

const ProductRequestForm = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const [activeImageKey, setActiveImageKey] = useState<"images" | null>(null);

  const { data } = location.state || {};
  const { mutate: addProductRequest, isPending: isAddLoadingRequest } = Mutations.useAddProductRequest();

  const initialValues: ProductRequestFormValues = {
    name: data?.name || "",
    printName: data?.printName || "",
    category: data?.categoryId || "",
    subCategory: data?.subCategoryId || "",
    brand: data?.brandId || "",
    subBrand: data?.subBrandId || "",
    productType: data?.productType || "",
    hasExpiry: data?.hasExpiry ?? false,
    description: data?.description || "",
    uomId: data?.uomId || "",
    images: data?.images || [],
  };

  const FormikImageSync = <T extends FormikValues>({ activeKey, clearActiveKey }: ImageSyncProps) => {
    const { selectedFiles } = useAppSelector((state) => state.modal);
    const { setFieldValue, values } = useFormikContext<T>();

    useEffect(() => {
      if (!selectedFiles.length || !activeKey) return;
      const merged = [...(values[activeKey] || []), ...selectedFiles].filter((v, i, arr) => arr.indexOf(v) === i);
      setFieldValue(activeKey, merged);

      dispatch(setSelectedFiles([]));
      clearActiveKey();
    }, [selectedFiles, activeKey, setFieldValue, clearActiveKey, values]);

    return null;
  };
  const handleUpload = () => {
    setActiveImageKey("images");
    dispatch(setUploadModal({ open: true, type: "image", multiple: true }));
  };
  const handleSubmit = async (values: ProductRequestFormValues, { resetForm }: FormikHelpers<ProductRequestFormValues>) => {
    const { _submitAction, ...rest } = values;

    const handleSuccess = () => {
      if (_submitAction === "saveAndNew") resetForm();
      else navigate(-1);
    };

    await addProductRequest(RemoveEmptyFields(rest), { onSuccess: handleSuccess });
  };
  return (
    <>
      <CommonBreadcrumbs title={PAGE_TITLE.INVENTORY.PRODUCT.REQUEST.ADD} maxItems={1} breadcrumbs={BREADCRUMBS.PRODUCT.REQUEST.ADD} />

      <Box sx={{ p: { xs: 2, md: 3 }, mb: 8 }}>
        <Formik<ProductRequestFormValues> enableReinitialize initialValues={initialValues} validationSchema={ProductRequestFormSchema} onSubmit={handleSubmit}>
          {({ setFieldValue, resetForm, dirty }) => (
            <Form noValidate>
              <FormikImageSync activeKey={activeImageKey} clearActiveKey={() => setActiveImageKey(null)} />
              <Grid container spacing={2}>
                {/* ---------- GENERAL DETAILS ---------- */}
                <CommonCard title="General Details" grid={{ xs: 12 }}>
                  <Grid container spacing={2} sx={{ p: 2 }}>
                    <CommonValidationTextField name="name" label="Product Name" required grid={{ xs: 12, sm: 6, md: 3 }} />
                    <CommonValidationTextField name="printName" label="Print Name" grid={{ xs: 12, sm: 6, md: 3 }} />
                    <CommonValidationTextField name="category" label="Category" required grid={{ xs: 12, sm: 6, md: 3 }} />
                    <CommonValidationTextField name="subCategory" label="Sub Category" grid={{ xs: 12, sm: 6, md: 3 }} />
                    <CommonValidationTextField name="brand" label="Brand" required grid={{ xs: 12, sm: 6, md: 3 }} />
                    <CommonValidationTextField name="subBrand" label="Sub Brand" grid={{ xs: 12, sm: 6, md: 3 }} />
                    <CommonValidationSelect name="productType" label="Product Type" options={PRODUCT_TYPE_OPTIONS} grid={{ xs: 12, md: 3 }} required />
                    <CommonValidationTextField name="description" label="Description" multiline rows={4} grid={{ xs: 12 }} />
                    <CommonFormImageBox name="images" label="Product Images" type="image" grid={{ xs: 12 }} required multiple onUpload={handleUpload} />

                    <CommonValidationSwitch name="hasExpiry" label="Has Expiry" grid={{ xs: 12 }} />
                  </Grid>
                </CommonCard>

                {/* ---------- ACTION BAR ---------- */}
                <CommonBottomActionBar clear disabled={!dirty} isLoading={isAddLoadingRequest} onClear={() => resetForm({ values: initialValues })} onSave={() => setFieldValue("_submitAction", "save")} onSaveAndNew={() => setFieldValue("_submitAction", "saveAndNew")} />
              </Grid>
            </Form>
          )}
        </Formik>
      </Box>
    </>
  );
};

export default ProductRequestForm;
