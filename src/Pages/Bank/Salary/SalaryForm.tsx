import { Box, Grid } from "@mui/material";
import { Form, Formik, useFormikContext, type FormikHelpers, type FormikValues } from "formik";
import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Mutations, Queries } from "../../../Api";
import { CommonValidationDatePicker, CommonValidationSelect, CommonValidationSwitch, CommonValidationTextField } from "../../../Attribute";
import { CommonBottomActionBar, CommonBreadcrumbs, CommonCard, DependentSelect } from "../../../Components/Common";
import { PAGE_TITLE } from "../../../Constants";
import { BREADCRUMBS, EXPENSE_TYPE_OPTIONS } from "../../../Data";
import { GenerateOptions, RemoveEmptyFields, SalaryFormSchema } from "../../../Utils";
import { usePagePermission } from "../../../Utils/Hooks";
import { CommonFormImageBox } from "../../../Components/Common/CommonUploadImage/CommonImageBox";
import type { ImageSyncProps, SalaryFormValues } from "../../../Types";
import { useAppDispatch, useAppSelector } from "../../../Store/hooks";
import { setSelectedFiles, setUploadModal } from "../../../Store/Slices/ModalSlice";

const SalaryForm = () => {
  const { data: companyData, isLoading: companyDataLoading } = Queries.useGetCompanyDropdown();

  const location = useLocation();
  const navigate = useNavigate();
  const { data } = location.state || {};
  const permission = usePagePermission(PAGE_TITLE.SALARY.BASE);
  const [activeImageKey, setActiveImageKey] = useState<"image" | null>(null);
  const dispatch = useAppDispatch();
  const { mutate: addSalary, isPending: isAddLoading } = Mutations.useAddSalary();
  const { mutate: editSalary, isPending: isEditLoading } = Mutations.useEditSalary();

  const isEditing = Boolean(data?._id);
  const pageMode = isEditing ? "EDIT" : "ADD";

  const initialValues: SalaryFormValues = {
    companyId: data?.companyId?._id || "",
    branchId: data?.branchId?._id || "",
    partyId: data?.partyId?._id || "",
    fromDate: data?.fromDate || null,
    toDate: data?.toDate || null,
    incentive: data?.incentive || 0,
    amount: data?.amount || 0,
    total: data?.total || 0,
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
    setActiveImageKey("image");
    dispatch(setUploadModal({ open: true, type: "image" }));
  };
  const SalaryTotalCalculator = () => {
    const { values, setFieldValue } = useFormikContext<SalaryFormValues>();

    useEffect(() => {
      const amount = Number(values.amount || 0);
      const incentive = Number(values.incentive || 0);

      setFieldValue("total", amount + incentive);
    }, [values.amount, values.incentive, setFieldValue]);

    return null;
  };

  const handleSubmit = async (values: SalaryFormValues, { resetForm }: FormikHelpers<SalaryFormValues>) => {
    const { _submitAction, ...rest } = values;

    const handleSuccess = () => {
      if (_submitAction === "saveAndNew") resetForm();
      else navigate(-1);
    };
    if (isEditing) {
      await editSalary({ ...RemoveEmptyFields(rest), salaryId: data?._id }, { onSuccess: handleSuccess });
    } else {
      await addSalary(RemoveEmptyFields(rest), { onSuccess: handleSuccess });
    }
  };

  useEffect(() => {
    const hasAccess = isEditing ? permission.edit : permission.add;
    if (!hasAccess) navigate(-1);
  }, [isEditing, permission, navigate]);
  useEffect(() => {
    const hasAccess = isEditing ? permission.edit : permission.add;
    if (!hasAccess) navigate(-1);
  }, [isEditing, permission, navigate]);

  return (
    <>
      <CommonBreadcrumbs title={PAGE_TITLE.SALARY[pageMode]} maxItems={3} breadcrumbs={BREADCRUMBS.SALARY[pageMode]} />
      <Box sx={{ p: { xs: 2, md: 3 }, mb: 8 }}>
        <Formik initialValues={initialValues} onSubmit={handleSubmit} validationSchema={SalaryFormSchema} enableReinitialize>
          {({ resetForm, setFieldValue, dirty, values }) => {
            return (
              <Form noValidate>
                <SalaryTotalCalculator />
                <FormikImageSync activeKey={activeImageKey} clearActiveKey={() => setActiveImageKey(null)} />
                <Grid container spacing={2}>
                  <CommonCard grid={{ xs: 12 }}>
                    <Grid container spacing={2} sx={{ p: 2 }}>
                      <CommonValidationSelect name="companyId" label="Company Name" required isLoading={companyDataLoading} options={GenerateOptions(companyData?.data)} grid={{ xs: 12, md: 4 }} />
                      <DependentSelect params={{ companyFilter: values?.companyId }} name="branchId" label="Branch" query={Queries.useGetBranchDropdown} enabled={Boolean(values.companyId)} disabled={!values.companyId} required grid={{ xs: 12, md: 4 }} />
                      <DependentSelect params={{ companyFilter: values?.companyId, branchFilter: values?.branchId }} name="partyId" label="Party" required query={Queries.useGetUserDropdown} grid={{ xs: 12, md: 4 }} disabled={!values?.companyId || !values?.branchId} />
                      <CommonValidationSelect name="type" label="Expense Type" grid={{ xs: 12, md: 4 }} options={EXPENSE_TYPE_OPTIONS} required />
                      <CommonValidationDatePicker name="fromDate" label="From Date" required grid={{ xs: 12, md: 4 }} />
                      <CommonValidationDatePicker name="toDate" label="To Date" required grid={{ xs: 12, md: 4 }} />
                      <CommonValidationTextField name="amount" label="Amount" grid={{ xs: 12, md: 4 }} maxDigits={10} required />
                      <CommonValidationTextField name="incentive" label="Incentive" grid={{ xs: 12, md: 4 }} />
                      <CommonValidationTextField name="total" label="Total" grid={{ xs: 12, md: 4 }} disabled />
                      <CommonValidationTextField name="description" label="Description" multiline grid={{ xs: 12 }} />
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

export default SalaryForm;
