import { Grid } from "@mui/material";
import { Form, Formik, type FormikHelpers } from "formik";
import { Mutations, Queries } from "../../../Api";
import { CommonButton, CommonValidationTextField, CommonValidationSwitch, CommonValidationSelect, CommonValidationRadio } from "../../../Attribute";
import { PAGE_TITLE } from "../../../Constants";
import { GenerateOptions, GetChangedFields, RemoveEmptyFields } from "../../../Utils";
import { AdditionalChargesFormSchema } from "../../../Utils/ValidationSchemas";
import { CommonCard, CommonModal, DependentSelect } from "../../Common";
import { useAppSelector } from "../../../Store/hooks";
import { useDispatch } from "react-redux";
import { setAdditionalChargeModal } from "../../../Store/Slices/ModalSlice";
import { OPTION_TYPE } from "../../../Data";
import type { AdditionalChargesFormValues } from "../../../Types";

const AdditionalChargesForm = () => {
  const { mutate: addAdditionalCharge, isPending: isAddLoading } = Mutations.useAddAdditionalCharges();
  const { mutate: editAdditionalCharge, isPending: isEditLoading } = Mutations.useEditAdditionalCharges();
  const { data: TaxData, isLoading: TaxDataLoading } = Queries.useGetTaxDropdown();
  const { data: companyData, isLoading: isCompanyLoading } = Queries.useGetCompanyDropdown();
  const { isAdditionalChargeModal } = useAppSelector((state) => state.modal);
  const dispatch = useDispatch();
  const isEdit = isAdditionalChargeModal.data;
  const openModal = isAdditionalChargeModal.open;
  const isEditing = Boolean(isEdit?._id);

  const initialValues: AdditionalChargesFormValues = {
    type: (isEdit?.type?.toLocaleLowerCase() as AdditionalChargesFormValues["type"]) || "purchase",
    name: isEdit?.name || "",
    hsnSac: isEdit?.hsnSac || "",
    taxId: (typeof isEdit?.taxId === "object" ? isEdit?.taxId?._id : isEdit?.taxId) || "",
    accountGroupId: (typeof isEdit?.accountGroupId === "object" ? isEdit?.accountGroupId?._id : isEdit?.accountGroupId) || "",
    isActive: isEdit?.isActive ?? true,
    defaultValue: isEdit?.defaultValue,
    isTaxIncluding: isEdit?.isTaxIncluding || false,
    companyId: (typeof isEdit?.companyId === "object" ? isEdit?.companyId?._id : isEdit?.companyId) || "",
  };
  const closeModal = () => dispatch(setAdditionalChargeModal({ open: false, data: null }));
  const handleSubmit = (values: AdditionalChargesFormValues, { resetForm }: FormikHelpers<AdditionalChargesFormValues>) => {
    const onSuccessHandler = () => {
      resetForm();
      closeModal();
    };

    if (isEditing) {
      const changedFields = GetChangedFields(values, isEdit as Partial<AdditionalChargesFormValues>);
      editAdditionalCharge({ ...changedFields, additionalChargeId: isEdit?._id }, { onSuccess: onSuccessHandler });
    } else {
      addAdditionalCharge(RemoveEmptyFields(values), { onSuccess: onSuccessHandler });
    }
  };
  const topContent = <CommonValidationRadio name="type" options={OPTION_TYPE.map((opt) => ({ ...opt, disabled: isEditing && opt.value !== (isEdit?.type?.toLowerCase() || "purchase") }))} grid={{ xs: "auto" }} />;

  return (
    <CommonModal title={isEditing ? PAGE_TITLE.SETTINGS.ADDITIONAL_CHARGES.EDIT : PAGE_TITLE.SETTINGS.ADDITIONAL_CHARGES.ADD} isOpen={openModal} onClose={() => dispatch(setAdditionalChargeModal({ open: false, data: null }))} className="max-w-125 m-2 sm:m-5">
      <Formik enableReinitialize initialValues={initialValues} validationSchema={AdditionalChargesFormSchema} onSubmit={handleSubmit}>
        {({ dirty, values }) => {
          return (
            <Form noValidate>
              <Grid container spacing={2}>
                <CommonCard topContent={topContent} grid={{ xs: 12 }}>
                  <Grid container spacing={2} sx={{ p: 2 }}>
                    <CommonValidationSelect name="companyId" label="Select Company" isLoading={isCompanyLoading} options={GenerateOptions(companyData?.data)} required grid={{ xs: 12 }} />
                    <CommonValidationTextField name="name" label="Additional Charge" required grid={{ xs: 12 }} />
                    <CommonValidationTextField name="defaultValue" label="Default value" type="number" required grid={{ xs: 12 }} isCurrency currencyDisabled />
                    <CommonValidationSelect name="taxId" label="Select Tax" isLoading={TaxDataLoading} options={GenerateOptions(TaxData?.data)} required grid={{ xs: 12 }} />
                    <CommonValidationSwitch name="isTaxIncluding" label={`${values.type === "purchase" ? "Purchase" : "Sales"} Tax Included`} grid={{ xs: 12 }} />
                    <DependentSelect name="accountGroupId" label="Select Group" query={Queries.useGetAccountGroupDropdown} params={{ natureFilter: values.type }} required grid={{ xs: 12 }} />
                    <CommonValidationTextField name="hsnSac" label="HSN / SAC" grid={{ xs: 12 }} />
                    {!isEditing && <CommonValidationSwitch name="isActive" label="Is Active" grid={{ xs: 12 }} />}
                    <Grid sx={{ display: "flex", gap: 2, ml: "auto" }}>
                      <CommonButton variant="outlined" title="Cancel" onClick={() => dispatch(setAdditionalChargeModal({ open: false, data: null }))} />
                      <CommonButton type="submit" variant="contained" title="Save" loading={isAddLoading || isEditLoading} disabled={!dirty} />
                    </Grid>
                  </Grid>
                </CommonCard>
              </Grid>
            </Form>
          );
        }}
      </Formik>
    </CommonModal>
  );
};

export default AdditionalChargesForm;
