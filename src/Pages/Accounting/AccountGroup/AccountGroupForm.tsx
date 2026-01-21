import { Grid } from "@mui/material";
import { Form, Formik, type FormikHelpers } from "formik";
import { useDispatch } from "react-redux";
import { Mutations, Queries } from "../../../Api";
import { CommonButton, CommonValidationSelect, CommonValidationSwitch, CommonValidationTextField } from "../../../Attribute";
import { CommonModal } from "../../../Components/Common";
import { PAGE_TITLE } from "../../../Constants";
import { useAppSelector } from "../../../Store/hooks";
import { setAccountGroupModal } from "../../../Store/Slices/ModalSlice";
import type { AccountGroupFormValues } from "../../../Types";
import { AccountGroupFormSchema, GenerateOptions, GetChangedFields, RemoveEmptyFields } from "../../../Utils";

const AccountGroupForm = () => {
  const { isAccountGroupModal } = useAppSelector((state) => state.modal);
  const { data: AccountGroupData, isLoading: AccountGroupDataLoading } = Queries.useGetAccountGroupDropdown({}, Boolean(isAccountGroupModal.open));

  const { mutate: addAccountGroup, isPending: isAddLoading } = Mutations.useAddAccountGroup();
  const { mutate: editAccountGroup, isPending: isEditLoading } = Mutations.useEditAccountGroup();

  const dispatch = useDispatch();

  const isEdit = isAccountGroupModal.data;
  const openModal = isAccountGroupModal.open;
  const isEditing = Boolean(isEdit?._id);
  const pageMode = isEditing ? "EDIT" : "ADD";

  const initialValues: AccountGroupFormValues = {
    name: isEdit?.name || "",
    parentGroupId: isEdit?.parentGroupId?._id || "",
    isActive: isEdit?.isActive ?? true,
  };

  const closeModal = () => dispatch(setAccountGroupModal({ open: false, data: null }));

  const GroupDetails = (value: { value?: string }) => {
    const group = AccountGroupData?.data?.find((item) => item._id === value.value);

    return (
      <Grid size={{ xs: 12 }} sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
        <p className="text-gray-800 dark:text-gray-400">
          Group Under : <span className="font-normal capitalize text-gray-700 dark:text-gray-200">{group?.parentGroupId?.name}</span>
        </p>
        <p className="text-gray-800 dark:text-gray-400">
          Group Nature : <span className="font-normal capitalize text-gray-700 dark:text-gray-200">{group?.parentGroupId?.nature}</span>
        </p>
        <p className="text-gray-800 dark:text-gray-400">
          Group Level : <span className="font-normal capitalize text-gray-700 dark:text-gray-200">{group?.parentGroupId?.groupLevel}</span>
        </p>
      </Grid>
    );
  };

  const handleSubmit = (values: AccountGroupFormValues, { resetForm }: FormikHelpers<AccountGroupFormValues>) => {
    const onSuccessHandler = () => {
      resetForm();
      closeModal();
    };

    if (isEditing) {
      const changedFields = GetChangedFields(values, isEdit as Partial<AccountGroupFormValues>);
      editAccountGroup({ ...changedFields, accountGroupId: isEdit?._id }, { onSuccess: onSuccessHandler });
    } else {
      addAccountGroup(RemoveEmptyFields(values), { onSuccess: onSuccessHandler });
    }
  };

  return (
    <CommonModal title={PAGE_TITLE.ACCOUNT_GROUP[pageMode]} isOpen={openModal} onClose={closeModal} className="max-w-125">
      <Formik<AccountGroupFormValues> enableReinitialize initialValues={initialValues} validationSchema={AccountGroupFormSchema} onSubmit={handleSubmit}>
        {({ dirty, values }) => (
          <Form noValidate>
            <Grid container spacing={2} sx={{ p: 1 }}>
              <CommonValidationTextField name="name" label="Group Name" required grid={{ xs: 12 }} />
              <CommonValidationSelect name="parentGroupId" label="Parent Group" isLoading={AccountGroupDataLoading} options={GenerateOptions(AccountGroupData?.data)} grid={{ xs: 12 }} />
              <GroupDetails value={values.parentGroupId} />

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
export default AccountGroupForm;
