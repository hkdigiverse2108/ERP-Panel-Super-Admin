import { Add, Delete } from "@mui/icons-material";
import { Box, Button, Grid, IconButton, Typography } from "@mui/material";
import { FieldArray, Form, Formik, type FormikHelpers } from "formik";
import { useEffect, useMemo } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Mutations, Queries } from "../../../Api";
import { CommonValidationDatePicker, CommonValidationSelect, CommonValidationSwitch, CommonValidationTextField } from "../../../Attribute";
import { CommonBottomActionBar, CommonBreadcrumbs, CommonCard, CommonTable } from "../../../Components/Common";
import { PAGE_TITLE } from "../../../Constants";
import { BREADCRUMBS } from "../../../Data";
import type { JournalVoucherFormValues } from "../../../Types";
import { DateConfig, GenerateOptions, GetChangedFields, RemoveEmptyFields } from "../../../Utils";
import { usePagePermission } from "../../../Utils/Hooks";
import { JournalVoucherFormSchema } from "../../../Utils/ValidationSchemas";

const STATUS_OPTIONS = [
    { label: "Draft", value: "draft" },
    { label: "Posted", value: "posted" },
];

const JournalVoucherFormContent = ({ values, errors, isEditing, accountData, accountLoading, companyData, companyLoading, isAddLoading, isEditLoading, resetForm, setFieldValue, dirty }: any) => {
    const totalDebit = values.entries.reduce((sum: number, entry: any) => sum + Number(entry.debit || 0), 0);
    const totalCredit = values.entries.reduce((sum: number, entry: any) => sum + Number(entry.credit || 0), 0);

    return (
        <Form noValidate>
            <Grid container spacing={2}>
                <CommonCard title="Journal Voucher Details" hideDivider grid={{ xs: 12 }}>
                    <Grid container spacing={2} sx={{ p: 2 }}>
                        {isEditing && <CommonValidationTextField name="paymentNo" label="Payment No" grid={{ xs: 12, md: 3 }} disabled />}
                        <CommonValidationSelect name="companyId" label="Company" options={GenerateOptions(companyData?.data)} isLoading={companyLoading} grid={{ xs: 12, md: isEditing ? 3 : 4 }} required />
                        <CommonValidationDatePicker name="date" label="Date" grid={{ xs: 12, md: isEditing ? 3 : 4 }} required />
                        <CommonValidationSelect name="status" label="Status" options={STATUS_OPTIONS} grid={{ xs: 12, md: isEditing ? 3 : 4 }} required />
                        <CommonValidationTextField name="description" label="Description" grid={{ xs: 12 }} multiline rows={2} />
                        {!isEditing && <CommonValidationSwitch name="isActive" label="Is Active" grid={{ xs: 12 }} />}
                    </Grid>
                </CommonCard>

                <CommonCard title="Journal Entries" hideDivider grid={{ xs: 12 }}>
                    <Box sx={{ p: 2 }}>
                        <FieldArray name="entries">
                            {({ push, remove }) => {
                                const columns = [
                                    {
                                        key: "accountId",
                                        header: "Account *",
                                        render: (_: any, index: number) => <CommonValidationSelect name={`entries.${index}.accountId`} label="" options={GenerateOptions(accountData?.data)} isLoading={accountLoading} required />,
                                        footer: () => (
                                            <Typography variant="h6" color="text.secondary" textAlign="right">
                                                Total:
                                            </Typography>
                                        ),
                                    },
                                    {
                                        key: "debit",
                                        header: "Debit",
                                        render: (_: any, index: number) => <CommonValidationTextField name={`entries.${index}.debit`} label="" type="number" />,
                                        footer: () => (
                                            <Typography variant="h6" color={Math.abs(totalDebit - totalCredit) > 0.01 ? "error.main" : "success.main"}>
                                                {totalDebit.toFixed(2)}
                                            </Typography>
                                        ),
                                    },
                                    {
                                        key: "credit",
                                        header: "Credit",
                                        render: (_: any, index: number) => <CommonValidationTextField name={`entries.${index}.credit`} label="" type="number" />,
                                        footer: () => (
                                            <Typography variant="h6" color={Math.abs(totalDebit - totalCredit) > 0.01 ? "error.main" : "success.main"}>
                                                {totalCredit.toFixed(2)}
                                            </Typography>
                                        ),
                                    },
                                    {
                                        key: "description",
                                        header: "Description",
                                        render: (_: any, index: number) => <CommonValidationTextField name={`entries.${index}.description`} label="" />,
                                    },
                                    {
                                        key: "action",
                                        header: "Action",
                                        render: (_: any, index: number) => (
                                            <IconButton color="error" onClick={() => remove(index)} disabled={values.entries.length <= 2}>
                                                <Delete />
                                            </IconButton>
                                        ),
                                    },
                                ];

                                return (
                                    <Box>
                                        <CommonTable data={values.entries} columns={columns} rowKey={(_, index) => String(index)} showFooter />

                                        <Box sx={{ mt: 2, display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                                            <Button variant="outlined" startIcon={<Add />} onClick={() => push({ accountId: "", debit: "", credit: "", description: "" })}>
                                                Add Row
                                            </Button>
                                            {Math.abs(totalDebit - totalCredit) > 0.01 && (
                                                <Typography color="error" sx={{ pr: 2 }}>
                                                    Total Debit must equal Total Credit. Difference: {Math.abs(totalDebit - totalCredit).toFixed(2)}
                                                </Typography>
                                            )}
                                            {typeof errors?.entries === "string" && (
                                                <Typography color="error" sx={{ pr: 2, display: "block", mt: 1 }}>
                                                    {errors.entries}
                                                </Typography>
                                            )}
                                        </Box>
                                    </Box>
                                );
                            }}
                        </FieldArray>
                    </Box>
                </CommonCard>

                <CommonBottomActionBar save={isEditing} clear={!isEditing} disabled={!dirty || !values.entries.length} isLoading={isAddLoading || isEditLoading} onClear={() => resetForm()} onSave={() => setFieldValue("_submitAction", "save")} onSaveAndNew={() => setFieldValue("_submitAction", "saveAndNew")} />
            </Grid>

        </Form>
    );
};

const JournalVoucherForm = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const { data } = location.state || {};
    const permission = usePagePermission(PAGE_TITLE.JOURNAL_VOUCHER.BASE);

    const { data: accountData, isLoading: accountLoading } = Queries.useGetAccountDropdown();
    const { data: companyData, isLoading: companyLoading } = Queries.useGetCompanyDropdown();

    const { mutate: addJournalVoucher, isPending: isAddLoading } = Mutations.useAddJournalVoucher();
    const { mutate: editJournalVoucher, isPending: isEditLoading } = Mutations.useEditJournalVoucher();

    const isEditing = Boolean(data?._id);
    const pageMode = isEditing ? "EDIT" : "ADD";

    const initialValues: JournalVoucherFormValues = useMemo(() => {
        const defaultEntries = [
            { accountId: "", debit: "", credit: "", description: "" },
            { accountId: "", debit: "", credit: "", description: "" },
        ];

        return {
            companyId: data?.companyId?._id || data?.companyId || "",
            paymentNo: data?.paymentNo || "",
            date: data?.date || DateConfig.utc().toISOString(),
            description: data?.description || "",
            status: data?.status || "draft",
            isActive: data?.isActive ?? true,
            entries: data?.entries?.length
                ? data.entries.map((e: any) => ({
                    accountId: e.accountId?._id || e.accountId || "",
                    debit: e.debit || "",
                    credit: e.credit || "",
                    description: e.description || "",
                }))
                : defaultEntries,
        };
    }, [data]);

    const handleSubmit = async (values: JournalVoucherFormValues, { resetForm }: FormikHelpers<JournalVoucherFormValues>) => {
        const { _submitAction, ...rest } = values;

        const payload = {
            ...rest,
            entries: rest.entries.map((e: any) => ({
                accountId: e.accountId,
                debit: Number(e.debit || 0),
                credit: Number(e.credit || 0),
                description: e.description,
            })),
            totalDebit: rest.entries.reduce((sum: number, e: any) => sum + Number(e.debit || 0), 0),
            totalCredit: rest.entries.reduce((sum: number, e: any) => sum + Number(e.credit || 0), 0),
        };

        const handleSuccess = () => {
            if (_submitAction === "saveAndNew") resetForm();
            else navigate(-1);
        };

        if (isEditing) {
            const changedFields = GetChangedFields(payload, data);
            await editJournalVoucher({ ...changedFields, journalVoucherId: data._id } as any, { onSuccess: handleSuccess });
        } else {
            await addJournalVoucher(RemoveEmptyFields(payload) as any, { onSuccess: handleSuccess });
        }
    };

    useEffect(() => {
        const hasAccess = isEditing ? permission.edit : permission.add;
        if (!hasAccess) navigate(-1);
    }, [isEditing, permission, navigate]);

    return (
        <>
            <CommonBreadcrumbs title={PAGE_TITLE.JOURNAL_VOUCHER[pageMode]} maxItems={3} breadcrumbs={BREADCRUMBS.JOURNAL_VOUCHER[pageMode]} />

            <Box sx={{ p: { xs: 2, md: 3 }, mb: 8 }}>
                <Formik<JournalVoucherFormValues> enableReinitialize initialValues={initialValues} validationSchema={JournalVoucherFormSchema} onSubmit={handleSubmit}>
                    {({ resetForm, setFieldValue, dirty, values, errors }) => <JournalVoucherFormContent values={values} errors={errors} isEditing={isEditing} accountData={accountData} accountLoading={accountLoading} companyData={companyData} companyLoading={companyLoading} isAddLoading={isAddLoading} isEditLoading={isEditLoading} resetForm={resetForm} setFieldValue={setFieldValue} dirty={dirty} />}
                </Formik>
            </Box>
        </>
    );
};

export default JournalVoucherForm;
