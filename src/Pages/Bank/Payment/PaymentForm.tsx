import { Box, Grid } from "@mui/material";
import { Form, Formik, type FormikHelpers } from "formik";
import { useLocation, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { Mutations, Queries } from "../../../Api";
import { PAGE_TITLE } from "../../../Constants";
import { usePagePermission } from "../../../Utils/Hooks";
import type { PosPaymentFormValues, VoucherRow } from "../../../Types";
import { GetChangedFields, RemoveEmptyFields, GenerateOptions } from "../../../Utils";
import { CommonValidationRadio, CommonValidationSelect, CommonValidationTextField, CommonValidationDatePicker, CommonValidationSwitch, CommonTextField, CommonSelect, CommonButton } from "../../../Attribute";
import { CommonBreadcrumbs, CommonCard, CommonBottomActionBar, DependentSelect, CommonStatsCard, CommonTable } from "../../../Components/Common";
import type { CommonTableColumn } from "../../../Types";
import ClearIcon from "@mui/icons-material/Clear";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import { BREADCRUMBS, PAYMENT_MODE_OPTIONS, POS_PAYMENT_MODE } from "../../../Data";

const PaymentForm = () => {
  const { data: companyData, isLoading: companyDataLoading } = Queries.useGetCompanyDropdown();
  const location = useLocation();
  const navigate = useNavigate();
  const { data } = location.state || {};
  const permission = usePagePermission(PAGE_TITLE.PAYMENT.BASE);

  const { mutate: addPayment, isPending: isAddLoading } = Mutations.useAddPosPayment();
  const { mutate: editPayment, isPending: isEditLoading } = Mutations.useEditPosPayment();

  const isEditing = Boolean(data?._id);
  const pageMode = isEditing ? "EDIT" : "ADD";

  const initialValues: PosPaymentFormValues = {
    companyId: data?.companyId?._id || "",
    paymentNo: data?.paymentNo || "",
    voucherType: data?.voucherType || "expense",
    paymentType: data?.paymentType || "advance",
    partyId: data?.partyId?._id || "",
    bankId: data?.bankId?._id || "",
    posOrderId: data?.posOrderId?._id || "",
    paymentMode: data?.paymentMode || "cash",
    paymentDate: data?.paymentDate || null,
    amount: data?.amount || 0,
    isNonGST: data?.isNonGST || false,
    isActive: data?.isActive ?? true,
    accountId: data?.accountId?._id || "",
    remark: data?.remark || "",
    voucherDetails: data?.voucherDetails || [{ billId: "", netAmount: 0, paidAmount: 0, pendingAmount: 0, kasarAmount: 0, amount: 0, paymentAmount: 0 }],
  };

  const handleSubmit = async (values: PosPaymentFormValues, { resetForm }: FormikHelpers<PosPaymentFormValues>) => {
    const { _submitAction, voucherDetails, ...rest } = values;

    const payload = {
      ...rest,
      ...(values.paymentType === "against_bill" && { voucherRow: voucherDetails }),
    };

    const handleSuccess = () => {
      if (_submitAction === "SAVE_AND_NEW") {
        resetForm();
      } else {
        navigate(-1);
      }
    };

    if (isEditing) {
      const changedFields = GetChangedFields(payload, data);
      await editPayment({ ...changedFields, paymentId: data._id }, { onSuccess: handleSuccess });
    } else {
      await addPayment(RemoveEmptyFields(payload), { onSuccess: handleSuccess });
    }
  };

  const topContent = (
    <CommonValidationRadio
      name="paymentMode"
      options={POS_PAYMENT_MODE.map((opt) => ({
        label: opt,
        value: opt,
        disabled: isEditing && opt !== data?.paymentMode,
      }))}
      grid={{ xs: "auto" }}
    />
  );

  useEffect(() => {
    const hasAccess = isEditing ? permission.edit : permission.add;
    if (!hasAccess) navigate(-1);
  }, [isEditing, permission, navigate]);

  return (
    <>
      <CommonBreadcrumbs title={PAGE_TITLE.CONTACT[pageMode]} maxItems={3} breadcrumbs={BREADCRUMBS.CONTACT[pageMode]} />
      <Box sx={{ p: { xs: 2, md: 3 }, mb: 8 }}>
        <Formik initialValues={initialValues} onSubmit={handleSubmit} enableReinitialize>
          {({ resetForm, setFieldValue, dirty, values }) => {
            const voucherDetails = values.voucherDetails || [];

            const updateRow = <K extends keyof VoucherRow>(index: number, key: K, value: VoucherRow[K]) => {
              setFieldValue(
                "voucherDetails",
                voucherDetails.map((row, i) => (i === index ? { ...row, [key]: value } : row)),
              );
            };

            const addRow = () => {
              setFieldValue("voucherDetails", [...voucherDetails, { billId: "", netAmount: 0, paidAmount: 0, pendingAmount: 0, kasarAmount: 0, amount: 0, paymentAmount: 0 }]);
            };

            const removeRow = (index: number) => {
              setFieldValue(
                "voucherDetails",
                voucherDetails.filter((_, i) => i !== index),
              );
            };

            const voucherColumns: CommonTableColumn<VoucherRow>[] = [
              {
                key: "sr",
                header: "#",
                render: (_, idx) => idx + 1,
                bodyClass: "w-10",
                footer: "",
              },
              {
                key: "billId",
                header: "Bill No.",
                bodyClass: "min-w-40",
                render: (r, idx) => <CommonSelect options={[]} placeholder="Select Bill" value={r.billId ? [r.billId] : []} onChange={(v) => updateRow(idx, "billId", v[0] || "")} />,
                footer: () => (
                  <Box sx={{ display: "flex", alignItems: "center", color: "primary.main", fontWeight: 600, cursor: "pointer" }} onClick={addRow}>
                    <AddCircleIcon sx={{ fontSize: 18, mr: 0.5 }} /> Add More
                  </Box>
                ),
                footerClass: "text-left",
              },
              { key: "netAmount", header: "Net Amount", bodyClass: "min-w-30", render: (r) => r.netAmount || "", footer: "" },
              { key: "paidAmount", header: "Paid Amount", bodyClass: "min-w-30", render: (r) => r.paidAmount || "", footer: "Total", footerClass: "text-right font-bold" },
              { key: "pendingAmount", header: "Pending Amount", bodyClass: "min-w-30", render: (r) => r.pendingAmount || "", footer: "" },
              { key: "kasarAmount", header: "Kasar Amount", bodyClass: "min-w-30", render: (r, idx) => <CommonTextField type="number" value={r.kasarAmount} onChange={(v) => updateRow(idx, "kasarAmount", Number(v))} />, footer: "" },
              { key: "amount", header: "Amount*", bodyClass: "min-w-30", render: (r, idx) => <CommonTextField type="number" value={r.amount} onChange={(v) => updateRow(idx, "amount", Number(v))} />, footer: "" },
              { key: "paymentAmount", header: "Payment Amount", bodyClass: "min-w-30", render: (r) => <CommonTextField disabled type="number" value={r.amount} onChange={() => { }} />, footer: (data) => data.reduce((sum, row) => sum + Number((row as VoucherRow).amount || 0), 0).toFixed(2), footerClass: "font-bold text-center" },
              {
                key: "actions",
                header: "",
                bodyClass: "w-10",
                render: (_, idx) => (
                  <CommonButton size="small" color="error" variant="outlined" onClick={() => removeRow(idx)}>
                    <ClearIcon />
                  </CommonButton>
                ),
                footer: "",
              },
            ];

            return (
              <Form noValidate>
                <Grid container spacing={2}>
                  {/* PAYMENT TYPE CARDS */}

                  {/* GENERAL DETAILS */}
                  <CommonCard topContent={topContent} title="Payment Details" grid={{ xs: 12 }}>
                    <Grid container spacing={2} sx={{ p: 2 }}>
                      <CommonValidationSelect name="companyId" label="Company Name" required isLoading={companyDataLoading} options={GenerateOptions(companyData?.data)} grid={{ xs: 12, md: 4 }} />
                      {values?.paymentMode === "cash" && (
                        <>
                          <DependentSelect params={{ companyId: values?.companyId }} name="accountId" label="Cash / Account" grid={{ xs: 12, md: 4 }} query={Queries.useGetAccountDropdown} disabled={!values?.companyId} required />
                        </>
                      )}
                      {values?.paymentMode === "bank" && (
                        <>
                          <DependentSelect params={{ companyId: values?.companyId }} name="BankId" label="Bank" grid={{ xs: 12, md: 4 }} query={Queries.useGetBankDropdown} disabled={!values?.companyId} required />
                          <CommonValidationRadio name="paymentMode" grid={{ xs: 12, md: 4 }} options={PAYMENT_MODE_OPTIONS} />
                          <CommonValidationDatePicker name="transactionDate" label="Transaction Date" required grid={{ xs: 12, md: 4 }} />
                          <CommonValidationTextField name="transactionNo" label="Transaction No" type="number" required grid={{ xs: 12, md: 4 }} />
                        </>
                      )}
                      <DependentSelect params={{ companyId: values?.companyId }} name="partyId" label="Party" grid={{ xs: 12, md: 4 }} query={Queries.useGetContactDropdown} disabled={!values?.companyId} required />
                      <CommonValidationDatePicker name="paymentDate" label="Payment Date" required grid={{ xs: 12, md: 4 }} />
                      <Grid size={{ xs: 12 }}>
                        <CommonStatsCard
                          variant="radio"
                          grid={{ xs: 12, md: 4 }}
                          stats={[
                            { value: "On Account", label: "", desc: "Upfront Payment", selected: values.paymentType === "on_account", onClick: () => setFieldValue("paymentType", "on_account") },
                            { value: "Advance Payment", label: "", desc: "Will be offset by upcoming bills", selected: values.paymentType === "advance", onClick: () => setFieldValue("paymentType", "advance") },
                            { value: "Against Voucher", label: "", desc: "Make Payment Against Voucher", selected: values.paymentType === "against_bill", onClick: () => setFieldValue("paymentType", "against_bill") },
                          ]}
                        />
                      </Grid>
                      <CommonValidationTextField name="amount" label="Amount" type="number" required isCurrency currencyDisabled grid={{ xs: 12, md: 4 }} />
                      <CommonValidationTextField name="remark" label="Description" multiline grid={{ xs: 12, md: 8 }} />
                      {values.paymentType === "against_bill" && (
                        <Grid size={{ xs: 12 }}>
                          <CommonCard hideDivider>
                            <Box sx={{ overflowX: "auto" }} className="custom-scrollbar">
                              <CommonTable data={voucherDetails} columns={voucherColumns} rowKey={(_, index) => index.toString()} showFooter />
                            </Box>
                          </CommonCard>
                        </Grid>
                      )}
                    </Grid>
                  </CommonCard>

                  {!isEditing && <CommonValidationSwitch name="isActive" label="Is Active" grid={{ xs: 12 }} />}

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

export default PaymentForm;
