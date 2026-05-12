import { Box, Grid } from "@mui/material";
import { Form, Formik, useFormikContext, type FormikHelpers } from "formik";
import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Mutations, Queries } from "../../../Api";
import { CommonSelect, CommonTextField, CommonValidationDatePicker, CommonValidationSelect, CommonValidationSwitch, CommonValidationTextField } from "../../../Attribute";
import { CommonBottomActionBar, CommonBreadcrumbs, CommonCard, CommonStatsCard, CommonTable, DependentSelect } from "../../../Components/Common";
import { PAGE_TITLE } from "../../../Constants";
import { BREADCRUMBS, PAYMENT_MODE, POS_PAYMENT_METHOD } from "../../../Data";
import type { CommonTableColumn, PosPaymentFormValues } from "../../../Types";
import { GenerateOptions, GetChangedFields, PaymentFormSchema, RemoveEmptyFields } from "../../../Utils";
import { usePagePermission } from "../../../Utils/Hooks";

const PaymentForm = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { data } = location.state || {};
  const permission = usePagePermission(PAGE_TITLE.PAYMENT.BASE);
  const { data: companyData, isLoading: companyDataLoading } = Queries.useGetCompanyDropdown();

  const { mutate: addPayment, isPending: isAddLoading } = Mutations.useAddPosPayment();
  const { mutate: editPayment, isPending: isEditLoading } = Mutations.useEditPosPayment();

  const isEditing = Boolean(data?._id);
  const pageMode = isEditing ? "EDIT" : "ADD";

  const initialValues: PosPaymentFormValues = {
    companyId: data?.companyId?._id || "",
    branchId: data?.branchId?._id || "",
    voucherType: data?.voucherType || "purchase",
    paymentType: data?.paymentType || "advance",
    partyId: data?.partyId?._id || "",
    bankId: data?.bankId?._id || data?.bankId || "",
    isActive: data?.isActive ?? true,
    remark: data?.remark || "",
    paymentMode: data?.paymentMode || "cash",
    date: data?.date || null,
    amount: data?.amount || 0,
    posOrderId: data?.posOrderId?._id || data?.posOrderId || "",
    purchaseBillId: data?.purchaseBillId?._id || data?.purchaseBillId || "",
    posCreditNoteId: data?.posCreditNoteId?._id || data?.posCreditNoteId || "",
    totalAmount: data?.totalAmount || 0,
    paidAmount: data?.paidAmount || 0,
    pendingAmount: data?.pendingAmount || 0,
    kasar: data?.kasar || 0,
  };
  const [partyId, setPartyId] = useState(initialValues.partyId);

  const handleSubmit = async (values: PosPaymentFormValues, { resetForm }: FormikHelpers<PosPaymentFormValues>) => {
    const { _submitAction, ...rest } = values;
    const payload = { ...rest };
    if (values.paymentMode?.toLowerCase() === "cash") delete payload.bankId;

    const handleSuccess = () => {
      if (_submitAction === "saveAndNew") resetForm();
      else navigate(-1);
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

  const PaymentTable = () => {
    const { values, setFieldValue } = useFormikContext<PosPaymentFormValues>();
    const { data: contactData } = Queries.useGetContactDropdown({ typeFilter: "customer,supplier", companyFilter: values?.companyId });
    const isCustomer = contactData?.data?.find((item) => item._id === partyId)?.contactType?.includes("customer") ?? false;
    const { data: posCreditNoteDropdown, isLoading: isPosCreditNoteDropdownLoading, isFetching: isPosCreditNoteDropdownFetching } = Queries.useGetPosCreditNoteDropdown({ companyFilter: values?.companyId, branchFilter: values?.branchId, typeFilter: "credit_note", customerFilter: partyId, includeId: data?.posCreditNoteId?._id }, Boolean(partyId && isCustomer));
    const { data: posSupplierBillDropdown, isLoading: isPosSupplierBillDropdownLoading, isFetching: isPosSupplierBillDropdownFetching } = Queries.useGetSupplierBillDropdown({ companyFilter: values?.companyId, branchFilter: values?.branchId, paymentStatus: "unpaid,partial", supplierId: partyId, includeId: data?.purchaseBillId?._id }, Boolean(partyId && !isCustomer));

    const handleTableChange = (key: string, value: string | number | undefined) => {
      const newValues = { ...values, [key]: value };
      if (key === "purchaseBillId") {
        const selectedOrder = posSupplierBillDropdown?.data?.find((item) => item._id === value);
        if (selectedOrder) {
          newValues.totalAmount = selectedOrder.netAmount ?? 0;
          newValues.paidAmount = selectedOrder.netAmount - (selectedOrder.balanceAmount ?? 0);
          newValues.pendingAmount = selectedOrder.balanceAmount ?? 0;
          newValues.amount = selectedOrder.balanceAmount ?? 0;
          newValues.kasar = 0;
        } else Object.assign(newValues, { totalAmount: 0, paidAmount: 0, pendingAmount: 0, amount: 0, kasar: 0 });
      } else if (key === "posCreditNoteId") {
        const selectedOrder = posCreditNoteDropdown?.data?.find((item) => item._id === value);
        if (selectedOrder) {
          newValues.totalAmount = selectedOrder.amount ?? 0;
          newValues.paidAmount = selectedOrder.amount - selectedOrder.creditsRemaining;
          newValues.pendingAmount = selectedOrder.creditsRemaining ?? 0;
          newValues.amount = selectedOrder.creditsRemaining ?? 0;
        } else Object.assign(newValues, { totalAmount: 0, paidAmount: 0, pendingAmount: 0, amount: 0 });
      }

      if (["amount", "kasar", "purchaseBillId", "posCreditNoteId"].includes(key)) {
        const pending = Number(newValues.pendingAmount ?? 0);

        let kasar = Number(newValues.kasar ?? 0);
        let amount = Number(newValues.amount ?? 0);

        if (kasar + amount > pending) {
          if (key === "kasar") amount = pending - kasar;
          else if (key === "amount") kasar = pending - amount;
        }

        if (amount < 0) amount = 0;
        if (kasar < 0) kasar = 0;

        if (key === "kasar") {
          amount = pending - kasar;
          if (amount < 0) amount = 0;
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

    const creditNoteColumns: CommonTableColumn<PosPaymentFormValues>[] = [
      { key: "sr", header: "#", render: () => 1, bodyClass: "w-10" },
      { key: "posCreditNoteId", header: "Voucher No.", bodyClass: "min-w-40", render: (r) => <CommonSelect options={GenerateOptions(posCreditNoteDropdown?.data)} isLoading={isPosCreditNoteDropdownLoading || isPosCreditNoteDropdownFetching} placeholder="Select Bill" value={r.posCreditNoteId ? [r.posCreditNoteId] : []} onChange={(v) => handleTableChange("posCreditNoteId", v[0] || "")} disabled={!r.partyId} /> },
      { key: "totalAmount", header: "Net Amount", bodyClass: "min-w-30", render: (r) => <CommonTextField type="number" value={r.totalAmount || 0} disabled /> },
      { key: "paidAmount", header: "Used Amount", bodyClass: "min-w-30", render: (r) => <CommonTextField type="number" value={r.paidAmount || 0} disabled /> },
      { key: "pendingAmount", header: "Remaining Amount", bodyClass: "min-w-30", render: (r) => <CommonTextField type="number" value={r.pendingAmount || 0} disabled /> },
      { key: "amount", header: "Amount", bodyClass: "min-w-30", render: (r) => <CommonTextField type="number" value={r.amount || 0} onChange={(v) => handleTableChange("amount", Number(v))} /> },
    ];
    const supplierColumns: CommonTableColumn<PosPaymentFormValues>[] = [
      { key: "sr", header: "#", render: () => 1, bodyClass: "w-10" },
      { key: "purchaseBillId", header: "Bill No.", bodyClass: "min-w-40", render: (r) => <CommonSelect options={GenerateOptions(posSupplierBillDropdown?.data)} isLoading={isPosSupplierBillDropdownLoading || isPosSupplierBillDropdownFetching} placeholder="Select Bill" value={r.purchaseBillId ? [r.purchaseBillId] : []} onChange={(v) => handleTableChange("purchaseBillId", v[0] || "")} disabled={!r.partyId} /> },
      { key: "totalAmount", header: "Net Amount", bodyClass: "min-w-30", render: (r) => <CommonTextField type="number" value={r.totalAmount || 0} disabled /> },
      { key: "paidAmount", header: "Paid Amount", bodyClass: "min-w-30", render: (r) => <CommonTextField type="number" value={r.paidAmount || 0} disabled /> },
      { key: "pendingAmount", header: "Pending Amount", bodyClass: "min-w-30", render: (r) => <CommonTextField type="number" value={r.pendingAmount || 0} disabled /> },
      { key: "kasar", header: "Kasar Amount", bodyClass: "min-w-30", render: (r) => <CommonTextField type="number" value={r.kasar || 0} onChange={(v) => handleTableChange("kasar", Number(v))} /> },
      { key: "amount", header: "Amount", bodyClass: "min-w-30", render: (r) => <CommonTextField type="number" value={r.amount || 0} onChange={(v) => handleTableChange("amount", Number(v))} /> },
    ];
    return (
      <Grid size={{ xs: 12 }}>
        <CommonCard hideDivider>
          <Box sx={{ overflowX: "auto" }} className="custom-scrollbar">
            <CommonTable data={[values]} columns={isCustomer ? creditNoteColumns : supplierColumns} rowKey={() => "1"} />
          </Box>
        </CommonCard>
      </Grid>
    );
  };

  return (
    <>
      <CommonBreadcrumbs title={PAGE_TITLE.PAYMENT[pageMode]} maxItems={3} breadcrumbs={BREADCRUMBS.PAYMENT[pageMode]} />
      <Box sx={{ p: { xs: 2, md: 3 }, mb: 8 }}>
        <Formik initialValues={initialValues} onSubmit={handleSubmit} validationSchema={PaymentFormSchema} enableReinitialize>
          {({ resetForm, setFieldValue, dirty, values }) => {
            return (
              <Form noValidate>
                <Grid container spacing={2}>
                  <CommonCard title="Payment Details" grid={{ xs: 12 }}>
                    <Grid container spacing={2} sx={{ p: 2 }}>
                      <CommonValidationSelect name="companyId" label="Company Name" required isLoading={companyDataLoading} options={GenerateOptions(companyData?.data)} grid={{ xs: 12, md: 4 }} />
                      <DependentSelect name="branchId" label="Branch" query={Queries.useGetBranchDropdown} params={{ companyFilter: values.companyId }} enabled={Boolean(values.companyId)} disabled={!values.companyId} required grid={{ xs: 12, md: 4 }} />
                      <DependentSelect
                        params={{ typeFilter: "customer,supplier", companyFilter: values?.companyId }}
                        value={values.partyId ? [values.partyId] : []}
                        name="partyId"
                        label="Party"
                        required
                        query={Queries.useGetContactDropdown}
                        grid={{ xs: 12, md: 4 }}
                        onChange={(val) => {
                          const selected = val?.[0] || "";
                          setFieldValue("partyId", selected);
                          setPartyId(selected);
                        }}
                        disabled={!values?.companyId && !values.branchId}
                      />
                      <CommonValidationDatePicker name="date" label="Payment Date" required grid={{ xs: 12, md: 4 }} />
                      <CommonValidationSelect name="paymentMode" label="Payment Mode" required options={PAYMENT_MODE} grid={{ xs: 12, md: 4 }} />
                      {values.paymentMode !== POS_PAYMENT_METHOD.CASH && <DependentSelect params={{ companyFilter: values?.companyId }} name="bankId" label="Bank" query={Queries.useGetBankDropdown} grid={{ xs: 12, md: 4 }} disabled={!values?.companyId} required />}

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
                      {values.paymentType === "against_bill" && <PaymentTable />}
                      {!isEditing && <CommonValidationSwitch name="isActive" label="Is Active" grid={{ xs: 12 }} />}
                    </Grid>
                  </CommonCard>

                  <CommonBottomActionBar save={isEditing} clear={!isEditing} disabled={!dirty} isLoading={isAddLoading || isEditLoading} onClear={() => resetForm({ values: initialValues })} onSave={() => setFieldValue("_submitAction", "save")} onSaveAndNew={() => setFieldValue("_submitAction", "saveAndNew")} />
                </Grid>
              </Form>
            );
          }}
        </Formik>
      </Box>
    </>
  );
};

export default PaymentForm;
