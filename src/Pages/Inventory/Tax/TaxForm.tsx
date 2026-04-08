import { Grid } from "@mui/material";
import { Form, Formik, type FormikHelpers } from "formik";
import { useDispatch } from "react-redux";
import { Mutations, Queries } from "../../../Api";
import { CommonButton, CommonValidationSelect, CommonValidationSwitch, CommonValidationTextField } from "../../../Attribute";
import { CommonModal, DependentSelect } from "../../../Components/Common";
import { PAGE_TITLE } from "../../../Constants";
import { useAppSelector } from "../../../Store/hooks";
import { setTaxModal } from "../../../Store/Slices/ModalSlice";
import type { TaxFormValues } from "../../../Types";
import { GenerateOptions, GetChangedFields, RemoveEmptyFields } from "../../../Utils";
import { TaxFormSchema } from "../../../Utils/ValidationSchemas";

const TaxForm = () => {
  const { mutate: addTax, isPending: isAddLoading } = Mutations.useAddTax();
  const { mutate: editTax, isPending: isEditLoading } = Mutations.useEditTax();
  const { data: CompanyData, isLoading: CompanyDataLoading } = Queries.useGetCompanyDropdown();

  const dispatch = useDispatch();
  const { isTaxModal } = useAppSelector((state) => state.modal);
  const isEdit = isTaxModal.data;
  const openModal = isTaxModal.open;
  const isEditing = Boolean(isEdit?._id);
  const pageMode = isEditing ? "EDIT" : "ADD";

  const initialValues: TaxFormValues = {
    name: isEdit?.name || "",
    percentage: isEdit?.percentage || "",
    isActive: isEdit?.isActive ?? true,
    companyId: typeof isEdit?.companyId === "object" ? isEdit?.companyId?._id : isEdit?.companyId || "",
    branchId: typeof isEdit?.branchId === "object" ? isEdit?.branchId?._id : isEdit?.branchId || "",
  };

  const closeModal = () => dispatch(setTaxModal({ open: false, data: null }));

  const handleSubmit = (values: TaxFormValues, { resetForm }: FormikHelpers<TaxFormValues>) => {
    const onSuccessHandler = () => {
      resetForm();
      closeModal();
    };

    if (isEditing) {
      const changedFields = GetChangedFields(values, isEdit as Partial<TaxFormValues>);
      editTax({ ...changedFields, taxId: isEdit?._id }, { onSuccess: onSuccessHandler });
    } else {
      addTax(RemoveEmptyFields(values), { onSuccess: onSuccessHandler });
    }
  };

  return (
    <CommonModal title={PAGE_TITLE.INVENTORY.TAX[pageMode]} isOpen={openModal} onClose={closeModal} className="max-w-125">
      <Formik<TaxFormValues> enableReinitialize initialValues={initialValues} validationSchema={TaxFormSchema} onSubmit={handleSubmit}>
        {({ dirty, values }) => (
          <Form noValidate>
            <Grid container spacing={2} sx={{ p: 1 }}>
              <CommonValidationSelect name="companyId" label="Company" options={GenerateOptions(CompanyData?.data)} isLoading={CompanyDataLoading} grid={{ xs: 12 }} />
              <DependentSelect name="branchId" label="Select Brach" query={Queries.useGetBranchDropdown} params={{ companyFilter: values.companyId }} enabled={Boolean(values.companyId)} disabled={!values.companyId} grid={{ xs: 12 }} />
              <CommonValidationTextField name="name" label="Tax Name" required grid={{ xs: 12 }} />
              <CommonValidationTextField name="percentage" label="percentage" type="number" required grid={{ xs: 12 }} />

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
export default TaxForm;
