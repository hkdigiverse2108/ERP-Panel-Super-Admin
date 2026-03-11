import { Box, Grid } from "@mui/material";
import { Form, Formik, type FormikHelpers } from "formik";
import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Mutations, Queries } from "../../../Api";
import { CommonValidationDatePicker, CommonValidationSelect, CommonValidationSwitch, CommonValidationTextField } from "../../../Attribute";
import { CommonBottomActionBar, CommonBreadcrumbs, CommonCard } from "../../../Components/Common";
import { PAGE_TITLE } from "../../../Constants";
import { BREADCRUMBS, EXPENSE_TYPE_OPTIONS } from "../../../Data";
import { ExpenseFormSchema, GenerateOptions, GetChangedFields, RemoveEmptyFields } from "../../../Utils";
import { usePagePermission } from "../../../Utils/Hooks";
import type { ExpenseFormValues } from "../../../Types/Expense";

const ExpenseForm = () => {
  const { data: companyData, isLoading: companyDataLoading } = Queries.useGetCompanyDropdown();

  const location = useLocation();
  const navigate = useNavigate();
  const { data } = location.state || {};
  const permission = usePagePermission(PAGE_TITLE.EXPENSE.BASE);

  const { mutate: addExpense, isPending: isAddLoading } = Mutations.useAddExpense();
  const { mutate: editExpense, isPending: isEditLoading } = Mutations.useEditExpense();

  const isEditing = Boolean(data?._id);
  const pageMode = isEditing ? "EDIT" : "ADD";

  const initialValues: ExpenseFormValues = {
    companyId: data?.companyId?._id || "",
    partyId: data?.partyId?._id || "",
    date: data?.date || null,
    amount: data?.amount || 0,
    isActive: data?.isActive ?? true,
    accountId: data?.accountId?._id || "",
    remark: data?.remark || "",
    type: data?.type || "",
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
            const { data: contactData, isLoading: contactLoading, isFetching: contactFetching } = Queries.useGetContactDropdown({ activeFilter: true, companyFilter: values?.companyId }, Boolean(values?.companyId));
            return (
              <Form noValidate>
                <Grid container spacing={2}>
                  <CommonCard title="Expense Details" grid={{ xs: 12 }}>
                    <Grid container spacing={2} sx={{ p: 2 }}>
                      <CommonValidationSelect name="companyId" label="Company Name" required isLoading={companyDataLoading} options={GenerateOptions(companyData?.data)} grid={{ xs: 12, md: 4 }} />
                      <CommonValidationSelect name="partyId" label="Party" grid={{ xs: 12, md: 4 }} disabled={!values?.companyId} options={contactLoading || contactFetching ? [] : GenerateOptions(contactData?.data || [])} isLoading={contactLoading || contactFetching} required />
                      <CommonValidationSelect name="type" label="Expense Type" grid={{ xs: 12, md: 4 }} options={EXPENSE_TYPE_OPTIONS} />
                      <CommonValidationDatePicker name="date" label="Expense Date" required grid={{ xs: 12, md: 4 }} />
                      <CommonValidationTextField name="amount" label="Amount"  grid={{ xs: 12, md: 4 }} />
                      <CommonValidationTextField name="remark" label="Description" multiline grid={{ xs: 12, md:4 }} />
                    </Grid>
                    {!isEditing && <CommonValidationSwitch name="isActive" label="Is Active" grid={{ xs: 12 }} />}
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
