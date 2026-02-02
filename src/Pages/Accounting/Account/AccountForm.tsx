import { Grid } from "@mui/material";
import { Form, Formik, type FormikHelpers } from "formik";
import { useDispatch } from "react-redux";
import { Mutations, Queries } from "../../../Api";
import { CommonButton, CommonValidationSelect, CommonValidationSwitch, CommonValidationTextField } from "../../../Attribute";
import { CommonModal } from "../../../Components/Common";
import { PAGE_TITLE } from "../../../Constants";
import { ACCOUNT_TYPE } from "../../../Data";
import { useAppSelector } from "../../../Store/hooks";
import { setAccountModal } from "../../../Store/Slices/ModalSlice";
import type { AccountFormValues, AddAccountPayload } from "../../../Types";
import { GenerateOptions, GetChangedFields, RemoveEmptyFields } from "../../../Utils";

const AccountForm = () => {
  const { isAccountModal } = useAppSelector((state) => state.modal);
  const { data: accountGroupData, isLoading: accountDataLoading } = Queries.useGetAccountGroupDropdown({}, Boolean(isAccountModal.open));
  const { mutate: addAccount, isPending: isAddLoading } = Mutations.useAddAccount();
  const { mutate: editAccount, isPending: isEditLoading } = Mutations.useEditAccount();

  const dispatch = useDispatch();

  const isEdit = isAccountModal.data;
  const openModal = isAccountModal.open;
  const isEditing = Boolean(isEdit?._id);
  const pageMode = isEditing ? "EDIT" : "ADD";

  const initialValues: AccountFormValues = {
    name: isEdit?.name || "",
    groupId: isEdit?.groupId?._id,
    type: isEdit?.type || "",
    openingBalance: isEdit?.openingBalance || 0,
    currentBalance: isEdit?.currentBalance || 0,
    isActive: isEdit?.isActive ?? true,
  };

  const closeModal = () => dispatch(setAccountModal({ open: false, data: null }));

  const handleSubmit = (values: AccountFormValues, { resetForm }: FormikHelpers<AccountFormValues>) => {
    const onSuccessHandler = () => {
      resetForm();
      closeModal();
    };

    if (isEditing) {
      const changedFields = GetChangedFields(values, isEdit as Partial<AccountFormValues>);
      editAccount( { ...changedFields, accountId: isEdit?._id, } , { onSuccess: onSuccessHandler });
    } else {
      addAccount(RemoveEmptyFields(values) as AddAccountPayload, { onSuccess: onSuccessHandler });
      // addAccount(RemoveEmptyFields(values) as AddAccountPayload, { onSuccess: onSuccessHandler });
    }
  };

  return (
    <CommonModal title={PAGE_TITLE.ACCOUNT[pageMode]} isOpen={openModal} onClose={closeModal} className="max-w-125">
      <Formik<AccountFormValues> enableReinitialize initialValues={initialValues}  onSubmit={handleSubmit}>
        {({ dirty }) => (
          <Form noValidate>
            <Grid container spacing={2} sx={{ p: 1 }}>
              <CommonValidationTextField name="name" label="Account Name" required grid={{ xs: 12 }} />
              <CommonValidationSelect name="groupId" label="Account Group" isLoading={accountDataLoading} options={GenerateOptions(accountGroupData?.data)} required grid={{ xs: 12 }} />
              <CommonValidationSelect name="type" label="Type" grid={{ xs: 12 }} options={ACCOUNT_TYPE}/>
              <CommonValidationTextField name="openingBalance" label="Opening Balance" type="number" grid={{ xs: 6 }} />
              <CommonValidationTextField name="currentBalance" label="Current Balance" type="number" grid={{ xs: 6 }} />

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
export default AccountForm;



