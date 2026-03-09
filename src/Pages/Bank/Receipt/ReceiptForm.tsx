import { Box, Grid } from "@mui/material";
import { Form, Formik, type FormikHelpers } from "formik";
import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Mutations, Queries } from "../../../Api";
import { CommonSelect, CommonTextField, CommonValidationDatePicker, CommonValidationSelect, CommonValidationSwitch, CommonValidationTextField } from "../../../Attribute";
import { CommonBottomActionBar, CommonBreadcrumbs, CommonCard, CommonStatsCard, CommonTable } from "../../../Components/Common";
import { PAGE_TITLE } from "../../../Constants";
import { BREADCRUMBS, PAYMENT_MODE } from "../../../Data";
import type { CommonTableColumn, PosOrderBase, PosPaymentFormValues } from "../../../Types";
import { GenerateOptions, GetChangedFields, PaymentFormSchema, RemoveEmptyFields } from "../../../Utils";
import { usePagePermission } from "../../../Utils/Hooks";

const ReceiptForm = () => {
  const { data: companyData, isLoading: companyDataLoading } = Queries.useGetCompanyDropdown();
  const location = useLocation();
  const navigate = useNavigate();
  const { data } = location.state || {};
  const permission = usePagePermission(PAGE_TITLE.RECEIPT.BASE);

  const { mutate: addPayment, isPending: isAddLoading } = Mutations.useAddPosPayment();
  const { mutate: editPayment, isPending: isEditLoading } = Mutations.useEditPosPayment();

  const isEditing = Boolean(data?._id);
  const pageMode = isEditing ? "EDIT" : "ADD";

  const initialValues: PosPaymentFormValues = {
    companyId: data?.companyId?._id || "",
    voucherType: data?.voucherType || "sales",
    paymentType: data?.paymentType || "advance",
    partyId: data?.partyId?._id || "",
    bankId: data?.bankId?._id || data?.bankId || "",
    posOrderId: data?.posOrderId?._id || data?.posOrderId || "",
    paymentMode: data?.paymentMode || "cash",
    date: data?.date || null,
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
      <CommonBreadcrumbs title={PAGE_TITLE.RECEIPT[pageMode]} maxItems={3} breadcrumbs={BREADCRUMBS.RECEIPT[pageMode]} />
      <Box sx={{ p: { xs: 2, md: 3 }, mb: 8 }}>
        <Formik initialValues={initialValues} onSubmit={handleSubmit} validationSchema={PaymentFormSchema} enableReinitialize>
          {({ resetForm, setFieldValue, dirty, values }) => {
            const { data: posOrderDropdown, isLoading: posOrderDropdownLoading } = Queries.useGetPosOrderDropdown({ customerFilter: values.partyId, duePaymentFilter: true }, Boolean(values.partyId));
            const { data: bankDropdown, isLoading: bankDropdownLoading } = Queries.useGetBankDropdown({ companyId: values?.companyId }, Boolean(values?.companyId));
            const { data: contactData, isLoading: contactLoading, isFetching: contactFetching } = Queries.useGetContactDropdown({ activeFilter: true, companyFilter: values?.companyId }, Boolean(values?.companyId));

            const handleTableChange = (key: string, value: string | number | undefined) => {
              let newValues = { ...values, [key]: value };
              if (key === "posOrderId") {
                const selectedOrder = posOrderDropdown?.data?.find((item: PosOrderBase) => item._id === value);
                if (selectedOrder) {
                  newValues.totalAmount = selectedOrder.totalAmount ?? 0;
                  newValues.paidAmount = selectedOrder.paidAmount ?? 0;
                  newValues.pendingAmount = selectedOrder.dueAmount ?? 0;
                  newValues.amount = selectedOrder.dueAmount ?? 0;
                  newValues.kasar = 0;
                }
              }

              if (key === "paymentMode") {
                if (typeof value === "string" && value.toLowerCase() === "cash") {
                  newValues.bankId = "";
                }
              }

              if (key === "amount" || key === "kasar" || key === "posOrderId") {
                const pending = Number(newValues.pendingAmount ?? 0);
                let kasar = Number(newValues.kasar ?? 0);
                let amount = Number(newValues.amount ?? 0);

                if (kasar + amount > pending) {
                  amount = pending - kasar;
                  if (amount < 0) {
                    amount = 0;
                    kasar = pending;
                  }
                }
                newValues.amount = amount;
                newValues.kasar = kasar;
              }

              Object.keys(newValues).forEach((k) => {
                if (newValues[k as keyof PosPaymentFormValues] !== values[k as keyof PosPaymentFormValues]) {
                  setFieldValue(k, newValues[k as keyof PosPaymentFormValues]);
                }
              });
            };

            const voucherColumns: CommonTableColumn<PosPaymentFormValues>[] = [
              { key: "sr", header: "#", render: () => 1, bodyClass: "w-10" },
              { key: "posOrderId", header: "Sales", bodyClass: "min-w-40", render: (r) => <CommonSelect options={GenerateOptions(posOrderDropdown?.data?.map((item) => ({ ...item, name: item.orderNo })))} isLoading={posOrderDropdownLoading} placeholder="Select Sales" value={r.posOrderId ? [r.posOrderId] : []} onChange={(v) => handleTableChange("posOrderId", v[0] || "")} disabled={!r.partyId} /> },
              { key: "paymentMode", header: "Payment Mode", bodyClass: "min-w-40", render: (r) => <CommonSelect options={PAYMENT_MODE} placeholder="Payment Mode" value={r.paymentMode ? [r.paymentMode] : []} onChange={(v) => handleTableChange("paymentMode", v[0] || "")} /> },
              ...(values.paymentMode?.toLowerCase() !== "cash"
                ? [
                    {
                      key: "bankId",
                      header: "Bank",
                      bodyClass: "min-w-40",
                      render: (r) => <CommonSelect options={GenerateOptions(bankDropdown?.data)} isLoading={bankDropdownLoading} placeholder="Select Bank" value={r.bankId ? [r.bankId] : []} onChange={(v) => handleTableChange("bankId", v[0] || "")} />,
                    } as CommonTableColumn<PosPaymentFormValues>,
                  ]
                : []),
              { key: "totalAmount", header: "Total Payment", bodyClass: "min-w-30", render: (r) => <CommonTextField type="number" value={r.totalAmount || 0} disabled /> },
              { key: "paidAmount", header: "Paid Amount", bodyClass: "min-w-30", render: (r) => <CommonTextField type="number" value={r.paidAmount || 0} disabled /> },
              { key: "pendingAmount", header: "Pending Amount", bodyClass: "min-w-30", render: (r) => <CommonTextField type="number" value={r.pendingAmount || 0} disabled /> },
              { key: "amount", header: "Amount", bodyClass: "min-w-30", render: (r) => <CommonTextField type="number" value={r.amount || 0} onChange={(v) => handleTableChange("amount", Number(v))} /> },
              { key: "kasar", header: "Kasar Amount", bodyClass: "min-w-30", render: (r) => <CommonTextField type="number" value={r.kasar || 0} onChange={(v) => handleTableChange("kasar", Number(v))} /> },
            ];

            return (
              <Form noValidate>
                <Grid container spacing={2}>
                  <CommonCard title="Payment Details" grid={{ xs: 12 }}>
                    <Grid container spacing={2} sx={{ p: 2 }}>
                      <CommonValidationSelect name="companyId" label="Company Name" required isLoading={companyDataLoading} options={GenerateOptions(companyData?.data)} grid={{ xs: 12, md: 4 }} />
                      <CommonValidationSelect name="partyId" label="Party" grid={{ xs: 12, md: 4 }} disabled={!values?.companyId} options={contactLoading || contactFetching ? [] : GenerateOptions(contactData?.data || [])} isLoading={contactLoading || contactFetching} required/>
                      <CommonValidationDatePicker name="date" label="Receipt Date" required grid={{ xs: 12, md: 4 }} />
                      <Grid size={{ xs: 12 }}>
                        <CommonStatsCard
                          variant="radio"
                          grid={{ xs: 12, md: 4 }}
                          stats={[
                            { value: "Advance Payment", label: "", desc: "Will be offset by upcoming bills", selected: values.paymentType === "advance", onClick: () => setFieldValue("paymentType", "advance") },
                            { value: "Against Voucher", label: "", desc: "Make Payment Against Voucher", selected: values.paymentType === "against_bill", onClick: () => setFieldValue("paymentType", "against_bill") },
                          ]}
                        />
                      </Grid>
                      <CommonValidationTextField name="amount" label="Amount" type="number" required isCurrency currencyDisabled grid={{ xs: 12, md: 4 }} disabled={values.paymentType === "against_bill"} />
                      <CommonValidationTextField name="remark" label="Description" multiline grid={{ xs: 12, md: 8 }} />
                      {values.paymentType === "against_bill" && (
                        <Grid size={{ xs: 12 }}>
                          <CommonCard hideDivider>
                            <Box sx={{ overflowX: "auto" }} className="custom-scrollbar">
                              <CommonTable data={[values]} columns={voucherColumns} rowKey={() => "1"} />
                            </Box>
                          </CommonCard>
                        </Grid>
                      )}
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

export default ReceiptForm;
