import { Box, Grid, Tab, Tabs } from "@mui/material";
import { Form, Formik, type FormikHelpers } from "formik";
import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Mutations, Queries } from "../../Api";
import { CommonButton, CommonValidationSelect, CommonValidationSwitch, CommonValidationTextField } from "../../Attribute";
import { CommonBottomActionBar, CommonBreadcrumbs, CommonCard, CommonTabPanel } from "../../Components/Common";
import { PAGE_TITLE } from "../../Constants";
import { BREADCRUMBS } from "../../Data";
import type { ModuleFormValues, UserModulePermissionDataResponse } from "../../Types";
import { GenerateOptions, GetChangedFields, RemoveEmptyFields } from "../../Utils";
import { ModuleFormSchema } from "../../Utils/ValidationSchemas";
import ModuleAccess from "./ModuleAccess";

const ModuleForm = () => {
  const [value, setValue] = useState(0);
  const [moduleRows, setModuleRows] = useState<UserModulePermissionDataResponse[]>([]);
  const location = useLocation();
  const navigate = useNavigate();
  const { data } = location.state || {};

  const { data: ModuleData, isLoading: ModuleDataLoading } = Queries.useGetModule({ activeFilter: true });

  const { mutate: addModulePermission, isPending: isAddModulePermissionLoading } = Mutations.useAddUserModulePermission();
  const { mutate: addModule, isPending: isAddLoading } = Mutations.useAddModule();
  const { mutate: editModule, isPending: isEditLoading } = Mutations.useEditModule();

  const isEditing = Boolean(data?._id);
  const pageMode = isEditing ? "EDIT" : "ADD";

  const initialValues: ModuleFormValues = {
    tabName: data?.tabName || "",
    displayName: data?.displayName || "",
    tabUrl: data?.tabUrl || "",
    number: data?.number || "",
    default: data?.default ?? true,
    hasAdd: data?.hasAdd ?? true,
    hasEdit: data?.hasEdit ?? true,
    hasView: data?.hasView ?? true,
    hasDelete: data?.hasDelete ?? true,
    parentId: data?.parentId?._id || "",
    isActive: data?.isActive ?? true,
  };

  const handleSubmit = async (values: ModuleFormValues, { resetForm }: FormikHelpers<ModuleFormValues>) => {
    const { _submitAction, ...rest } = values;
    const payload = { ...rest };

    const handleSuccess = () => {
      if (_submitAction === "saveAndNew") resetForm();
      else navigate(-1);
    };
    if (isEditing) {
      const changedFields = GetChangedFields(payload, data);
      await editModule({ ...changedFields, moduleId: data._id }, { onSuccess: handleSuccess });
    } else {
      await addModule(RemoveEmptyFields(payload), { onSuccess: handleSuccess });
    }
  };

  const handleSaveAll = async () => {
    const payload = {
      moduleId: data?._id,
      users: moduleRows.map((row) => ({
        _id: row.id || row._id,
        fullName: row.fullName,
        email: row.email,
        role: row.role,
        permissions: row.permissions,
      })),
    };

    await addModulePermission(payload);
  };

  return (
    <>
      <CommonBreadcrumbs title={PAGE_TITLE.MODULE[pageMode]} maxItems={4} breadcrumbs={BREADCRUMBS.MODULE[pageMode]} />
      <Box sx={{ p: { xs: 2, md: 3 }, mb: 8 }}>
        <Grid container spacing={2}>
          <CommonCard hideDivider>
            <Box sx={{ width: "100%" }}>
              {isEditing && (
                <Box sx={{ borderBottom: 1, borderColor: "divider", display: "flex", alignItems: "center", justifyContent: "space-between", pr: 2 }}>
                  <Tabs value={value} onChange={(_, newValue: number) => setValue(newValue)} aria-label="module tabs">
                    <Tab label={PAGE_TITLE.MODULE.EDIT} />
                    <Tab label="Module Access" />
                  </Tabs>
                  {value === 1 && <CommonButton variant="contained" title="Save All" size="small" loading={isAddModulePermissionLoading} onClick={handleSaveAll} />}
                </Box>
              )}

              <CommonTabPanel value={value} index={0}>
                <Formik<ModuleFormValues> enableReinitialize initialValues={initialValues} validationSchema={ModuleFormSchema} onSubmit={handleSubmit}>
                  {({ resetForm, setFieldValue, dirty }) => (
                    <Form noValidate>
                      <Grid container spacing={2} sx={{ p: 2 }}>
                        <CommonValidationTextField name="tabName" label="Tab Name" grid={{ xs: 12, md: 4 }} required />
                        <CommonValidationTextField name="displayName" label="Display Name" grid={{ xs: 12, md: 4 }} required />
                        <CommonValidationTextField name="tabUrl" label="Tab URL" grid={{ xs: 12, md: 4 }} />
                        <CommonValidationTextField name="number" label="Number" type="number" grid={{ xs: 12, md: 4 }} required />
                        <CommonValidationSelect name="parentId" label="Parent Module" options={GenerateOptions(ModuleData?.data?.module_data)} isLoading={ModuleDataLoading} grid={{ xs: 12, md: 4 }} />
                        <CommonValidationSwitch name="default" label="Default" grid={{ xs: 12 }} />
                        <CommonValidationSwitch name="hasAdd" label="Add" grid={{ xs: 12 }} />
                        <CommonValidationSwitch name="hasEdit" label="Edit" grid={{ xs: 12 }} />
                        <CommonValidationSwitch name="hasView" label="View" grid={{ xs: 12 }} />
                        <CommonValidationSwitch name="hasDelete" label="Delete" grid={{ xs: 12 }} />
                        {!isEditing && <CommonValidationSwitch name="isActive" label="Is Active" grid={{ xs: 12 }} />}
                      </Grid>

                      <CommonBottomActionBar save={isEditing} clear={!isEditing} disabled={!dirty} isLoading={isEditLoading || isAddLoading} onClear={() => resetForm({ values: initialValues })} onSave={() => setFieldValue("_submitAction", "save")} onSaveAndNew={() => setFieldValue("_submitAction", "saveAndNew")} />
                    </Form>
                  )}
                </Formik>
              </CommonTabPanel>
              <CommonTabPanel value={value} index={1}>
                <ModuleAccess data={data} moduleRows={moduleRows} setModuleRows={setModuleRows} />
              </CommonTabPanel>
            </Box>
          </CommonCard>
        </Grid>
      </Box>
    </>
  );
};

export default ModuleForm;
