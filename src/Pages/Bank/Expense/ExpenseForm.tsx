import { Box, Grid } from "@mui/material";
import { Form, Formik, type FormikHelpers } from "formik";
import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Mutations, Queries } from "../../../Api";
import { CommonSelect, CommonTextField, CommonValidationDatePicker, CommonValidationSelect, CommonValidationSwitch, CommonValidationTextField } from "../../../Attribute";
import { CommonBottomActionBar, CommonBreadcrumbs, CommonCard, CommonTable } from "../../../Components/Common";
import { PAGE_TITLE } from "../../../Constants";
import { BREADCRUMBS, EXPENSE_TYPE_OPTIONS } from "../../../Data";
import type { CommonTableColumn, PosPaymentFormValues, TaxBase } from "../../../Types";
import { GenerateOptions, GetChangedFields, PaymentFormSchema, RemoveEmptyFields } from "../../../Utils";
import { usePagePermission } from "../../../Utils/Hooks";

const ExpenseForm = () => {
  const { data: companyData, isLoading: companyDataLoading } = Queries.useGetCompanyDropdown();
  const { data: accountDropdown, isLoading: accountDropdownLoading } = Queries.useGetAccountDropdown();
  const { data: taxDropdown, isLoading: taxDropdownLoading } = Queries.useGetTaxDropdown();

  const location = useLocation();
  const navigate = useNavigate();
  const { data } = location.state || {};
  const permission = usePagePermission(PAGE_TITLE.EXPENSE.BASE);

  const { mutate: addPayment, isPending: isAddLoading } = Mutations.useAddPosPayment();
  const { mutate: editPayment, isPending: isEditLoading } = Mutations.useEditPosPayment();

  const isEditing = Boolean(data?._id);
  const pageMode = isEditing ? "EDIT" : "ADD";

  const initialValues: PosPaymentFormValues = {
    companyId: data?.companyId?._id || "",
    voucherType: data?.voucherType || "Expense",
    paymentType: data?.paymentType || "advance",
    partyId: data?.partyId?._id || "",
    bankId: data?.bankId?._id || data?.bankId || "",
    posOrderId: data?.posOrderId?._id || data?.posOrderId || "",
    paymentMode: data?.paymentMode || "cash",
    date: data?.paymentDate || null,
    amount: data?.amount || 0,
    totalAmount: data?.totalAmount || 0,
    paidAmount: data?.paidAmount || 0,
    pendingAmount: data?.pendingAmount || 0,
    kasar: data?.kasar || 0,
    isNonGST: data?.isNonGST || false,
    isActive: data?.isActive ?? true,
    accountId: data?.accountId?._id || "",
    posCashRegisterId: data?.posCashRegisterId?._id || "",
    remark: data?.remark || "",
    expenseType: data?.expenseType || "service",
    discountAmount: data?.discountAmount || 0,
    taxId: data?.taxId?._id || data?.taxId || "",
  };

  const handleSubmit = async (values: PosPaymentFormValues, { resetForm }: FormikHelpers<PosPaymentFormValues>) => {
    const { _submitAction, voucherDetails, ...rest } = values;
    const payload = { ...rest };
    if (values.paymentMode?.toLowerCase() === "cash") {
      delete payload.bankId;
    }

    const handleSuccess = () => {
      if (_submitAction === "saveAndNew") {
        resetForm();
      } else {
        navigate(-1);
      }
    };

    if (isEditing) {
      const changedFields = GetChangedFields(payload, data);
      await editPayment({ ...changedFields, posPaymentId: data._id }, { onSuccess: handleSuccess });
    } else {
      await addPayment(RemoveEmptyFields(payload), { onSuccess: handleSuccess });
    }
  };

  useEffect(() => {
    const hasAccess = isEditing ? permission.edit : permission.add;
    if (!hasAccess) navigate(-1);
  }, [isEditing, permission, navigate]);

  return (
    <>
      <CommonBreadcrumbs title={PAGE_TITLE.PAYMENT[pageMode]} maxItems={3} breadcrumbs={BREADCRUMBS.PAYMENT[pageMode]} />
      <Box sx={{ p: { xs: 2, md: 3 }, mb: 8 }}>
        <Formik initialValues={initialValues} onSubmit={handleSubmit} validationSchema={PaymentFormSchema} enableReinitialize>
          {({ resetForm, setFieldValue, dirty, values }) => {
            const { data: contactData, isLoading: contactLoading, isFetching: contactFetching } = Queries.useGetContactDropdown({ activeFilter: true, companyFilter: values?.companyId }, Boolean(values?.companyId));

            const updateTotalAmount = (newVal: { amount?: number; discountAmount?: number; taxId?: string }) => {
              const amount = newVal.amount ?? values.amount ?? 0;
              const discount = newVal.discountAmount ?? values.discountAmount ?? 0;
              const taxId = newVal.taxId ?? values.taxId ?? "";
              const tax = (taxDropdown?.data as TaxBase[])?.find((t: TaxBase) => t._id === taxId);
              const taxPercentage = Number(tax?.percentage) || 0;
              const taxableAmount = Math.max(0, amount - discount);
              const totalAmount = taxableAmount + (taxableAmount * taxPercentage) / 100;
              setFieldValue("totalAmount", totalAmount);
            };

            const voucherColumns: CommonTableColumn<PosPaymentFormValues>[] = [
              { key: "sr", header: "#", render: () => 1, bodyClass: "w-10", footer: "" },
              { key: "accountId", header: "Account", bodyClass: "min-w-40", render: (r) => <CommonSelect options={GenerateOptions(accountDropdown?.data)} isLoading={accountDropdownLoading} placeholder="Search Account" value={r.accountId ? [r.accountId] : []} onChange={(v) => setFieldValue("accountId", v[0] || "")} />, footer: "Total" },
              { key: "expenseType", header: "Service/Product", bodyClass: "min-w-40", render: (r) => <CommonSelect options={EXPENSE_TYPE_OPTIONS} placeholder="Service/Product" value={r.expenseType ? [r.expenseType] : []} onChange={(v) => setFieldValue("expenseType", v[0] || "")} />, footer: "" },
              {
                key: "amount",
                header: "Amount",
                bodyClass: "min-w-10",
                render: (r) => (
                  <CommonTextField
                    type="number"
                    value={r.amount || 0}
                    disabled={!r.accountId}
                    onChange={(v) => {
                      const amount = Number(v);
                      setFieldValue("amount", amount);
                      updateTotalAmount({ amount });
                    }}
                  />
                ),
                footer: (data) => data.reduce((sum, r) => sum + (Number(r.amount) || 0), 0).toFixed(2),
              },
              {
                key: "discountAmount",
                header: "Discount Amount",
                bodyClass: "min-w-10",
                render: (r) => (
                  <CommonTextField
                    type="number"
                    value={r.discountAmount || 0}
                    disabled={!r.accountId}
                    onChange={(v) => {
                      const discountAmount = Number(v);
                      setFieldValue("discountAmount", discountAmount);
                      updateTotalAmount({ discountAmount });
                    }}
                  />
                ),
                footer: (data) => data.reduce((sum, r) => sum + (Number(r.discountAmount) || 0), 0).toFixed(2),
              },
              {
                key: "taxId",
                header: "Tax",
                bodyClass: "min-w-40",
                render: (r) => (
                  <CommonSelect
                    options={GenerateOptions(taxDropdown?.data)}
                    isLoading={taxDropdownLoading}
                    placeholder="Select Tax"
                    value={r.taxId ? [r.taxId] : []}
                    onChange={(v) => {
                      const taxId = v[0] || "";
                      setFieldValue("taxId", taxId);
                      updateTotalAmount({ taxId });
                    }}
                  />
                ),
                footer: "",
              },
              {
                key: "taxValue",
                header: "Tax Value",
                bodyClass: "min-w-20",
                render: (r) => {
                  const tax = (taxDropdown?.data as TaxBase[])?.find((t: TaxBase) => t._id === r.taxId);
                  const taxPercentage = Number(tax?.percentage) || 0;
                  const taxableAmount = Math.max(0, (r.amount || 0) - (r.discountAmount || 0));
                  const taxValue = (taxableAmount * taxPercentage) / 100;
                  return taxValue.toFixed(2);
                },
                footer: (data) =>
                  data
                    .reduce((sum, r) => {
                      const tax = (taxDropdown?.data as TaxBase[])?.find((t: TaxBase) => t._id === r.taxId);
                      const taxPercentage = Number(tax?.percentage) || 0;
                      const taxableAmount = Math.max(0, (r.amount || 0) - (r.discountAmount || 0));
                      const taxValue = (taxableAmount * taxPercentage) / 100;
                      return sum + taxValue;
                    }, 0)
                    .toFixed(2),
              },
              { key: "totalAmount", header: "Total", bodyClass: "min-w-20", render: (r) => (r.totalAmount || 0).toFixed(2), footer: (data) => data.reduce((sum, r) => sum + (Number(r.totalAmount) || 0), 0).toFixed(2) },
            ];

            return (
              <Form noValidate>
                <Grid container spacing={2}>
                  <CommonCard title="Payment Details" grid={{ xs: 12 }}>
                    <Grid container spacing={2} sx={{ p: 2 }}>
                      <CommonValidationSelect name="companyId" label="Company Name" required isLoading={companyDataLoading} options={GenerateOptions(companyData?.data)} grid={{ xs: 12, md: 4 }} />
                      <CommonValidationSelect name="partyId" label="Party" grid={{ xs: 12, md: 4 }} disabled={!values?.companyId} options={contactLoading || contactFetching ? [] : GenerateOptions(contactData?.data || [])} isLoading={contactLoading || contactFetching} required />
                      <CommonValidationDatePicker name="date" label="Expense Date" required grid={{ xs: 12, md: 4 }} />
                      <CommonValidationTextField name="remark" label="Description" multiline grid={{ xs: 12 }} />
                      <Grid size={{ xs: 12 }}>
                        <CommonCard hideDivider>
                          <Box sx={{ overflowX: "auto" }} className="custom-scrollbar">
                            <CommonTable showFooter data={[values]} columns={voucherColumns} rowKey={() => "1"} />
                          </Box>
                        </CommonCard>
                      </Grid>
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
