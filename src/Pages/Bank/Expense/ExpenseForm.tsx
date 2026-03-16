import { Box, Grid } from "@mui/material";
import { Form, Formik, useFormikContext, type FormikHelpers, type FormikValues } from "formik";
import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Mutations, Queries } from "../../../Api";
import { CommonValidationDatePicker, CommonValidationSelect, CommonValidationSwitch, CommonValidationTextField } from "../../../Attribute";
import { CommonBottomActionBar, CommonBreadcrumbs, CommonCard, DependentSelect } from "../../../Components/Common";
import { PAGE_TITLE } from "../../../Constants";
import { BREADCRUMBS, EXPENSE_TYPE_OPTIONS } from "../../../Data";
import { ExpenseFormSchema, GenerateOptions, GetChangedFields, RemoveEmptyFields } from "../../../Utils";
import { usePagePermission } from "../../../Utils/Hooks";
import type { ExpenseFormValues } from "../../../Types/Expense";
import { CommonFormImageBox } from "../../../Components/Common/CommonUploadImage/CommonImageBox";
import type { ImageSyncProps } from "../../../Types";
import { useAppDispatch, useAppSelector } from "../../../Store/hooks";
import { setSelectedFiles, setUploadModal } from "../../../Store/Slices/ModalSlice";

const ExpenseForm = () => {
  const { data: companyData, isLoading: companyDataLoading } = Queries.useGetCompanyDropdown();

  const location = useLocation();
  const navigate = useNavigate();
  const { data } = location.state || {};
  const permission = usePagePermission(PAGE_TITLE.EXPENSE.BASE);
  const [activeImageKey, setActiveImageKey] = useState<"file" | null>(null);
  const dispatch = useAppDispatch();
  const { mutate: addExpense, isPending: isAddLoading } = Mutations.useAddExpense();
  const { mutate: editExpense, isPending: isEditLoading } = Mutations.useEditExpense();

  const isEditing = Boolean(data?._id);
  const pageMode = isEditing ? "EDIT" : "ADD";

  const initialValues: ExpenseFormValues = {
    companyId: data?.companyId?._id || "",
    partyId: data?.partyId?._id || "",
    fromDate: data?.fromDate || null,
    amount: data?.amount || 0,
    isActive: data?.isActive ?? true,
    description: data?.description || "",
    type: data?.type || "",
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
    setActiveImageKey("file");
    dispatch(setUploadModal({ open: true, type: "image" }));
  };

  const handleSubmit = async (values: ExpenseFormValues, { resetForm }: FormikHelpers<ExpenseFormValues>) => {
    const { _submitAction, ...rest } = values;
    const payload = { ...rest };

    const handleSuccess = () => {
      if (_submitAction === "saveAndNew") {
        resetForm();
      } else {
        navigate(-1);
      }
    };

    if (isEditing) {
      const changedFields = GetChangedFields(payload, data);
      await editExpense({ ...changedFields, expenseId: data._id }, { onSuccess: handleSuccess });
    } else {
      await addExpense(RemoveEmptyFields(payload), { onSuccess: handleSuccess });
    }
  };

  useEffect(() => {
    const hasAccess = isEditing ? permission.edit : permission.add;
    if (!hasAccess) navigate(-1);
  }, [isEditing, permission, navigate]);

  return (
    <>
      <CommonBreadcrumbs title={PAGE_TITLE.EXPENSE[pageMode]} maxItems={3} breadcrumbs={BREADCRUMBS.EXPENSE[pageMode]} />
      <Box sx={{ p: { xs: 2, md: 3 }, mb: 8 }}>
        <Formik initialValues={initialValues} onSubmit={handleSubmit} validationSchema={ExpenseFormSchema} enableReinitialize>
          {({ resetForm, setFieldValue, dirty, values }) => {
            return (
              <Form noValidate>
                <FormikImageSync activeKey={activeImageKey} clearActiveKey={() => setActiveImageKey(null)} />
                <Grid container spacing={2}>
                  <CommonCard title="Expense Details" grid={{ xs: 12 }}>
                    <Grid container spacing={2} sx={{ p: 2 }}>
                      <CommonValidationSelect name="companyId" label="Company Name" required isLoading={companyDataLoading} options={GenerateOptions(companyData?.data)} grid={{ xs: 12, md: 4 }} />
                      <DependentSelect params={{ companyFilter: values?.companyId }} name="partyId" label="Party" required query={Queries.useGetContactDropdown} grid={{ xs: 12, md: 4 }} disabled={!values?.companyId} />
                      <CommonValidationSelect name="type" label="Expense Type" grid={{ xs: 12, md: 4 }} options={EXPENSE_TYPE_OPTIONS} required />
                      <CommonValidationDatePicker name="fromDate" label="Expense Date" required grid={{ xs: 12, md: 4 }} />
                      <CommonValidationTextField name="amount" label="Amount" grid={{ xs: 12, md: 4 }} maxDigits={10} required />
                      <CommonValidationTextField name="description" label="Description" multiline grid={{ xs: 12, md: 4 }} />
                      <CommonFormImageBox name="image" label="Image" type="image" grid={{ xs: 12 }} onUpload={handleUpload} onDelete={() => setFieldValue("image", null)} />
                      {!isEditing && <CommonValidationSwitch name="isActive" label="Is Active" grid={{ xs: 12 }} />}
                    </Grid>
                  </CommonCard>

                  <CommonBottomActionBar
                    save={isEditing}
                    clear={!isEditing}
                    disabled={!dirty}
                    isLoading={isAddLoading || isEditLoading}
                    onClear={() => resetForm({ values: initialValues })}
                    onSave={() => {
                      setFieldValue("_submitAction", "save");
                    }}
                    onSaveAndNew={() => {
                      setFieldValue("_submitAction", "saveAndNew");
                    }}
                  />
                </Grid>
              </Form>
            );
          }}
        </Formik>
      </Box>
    </>
  );
};

export default ExpenseForm;
