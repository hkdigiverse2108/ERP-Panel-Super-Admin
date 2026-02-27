import { Add } from "@mui/icons-material";
import CloseIcon from "@mui/icons-material/Close";
import { Box, Grid } from "@mui/material";
import { FieldArray, Form, Formik, useFormikContext, type FormikValues } from "formik";
import { useEffect, useState } from "react";
import { Mutations, Queries } from "../../../Api";
import { CommonButton, CommonPhoneNumber, CommonValidationSwitch, CommonValidationTextField } from "../../../Attribute";
import { CommonBottomActionBar, CommonBreadcrumbs, CommonCard } from "../../../Components/Common";
import { CommonFormImageBox } from "../../../Components/Common/CommonUploadImage/CommonImageBox";
import { PAGE_TITLE } from "../../../Constants";
import { BREADCRUMBS } from "../../../Data";
import { useAppDispatch, useAppSelector } from "../../../Store/hooks";
import { setSelectedFiles, setUploadModal } from "../../../Store/Slices/ModalSlice";
import type { AdminSettingFormValues, AdminSettingLink } from "../../../Types/AdminSetting";
import type { Params } from "../../../Types";
import type { AdminSettingBase } from "../../../Types/AdminSetting";
import { GetChangedFields } from "../../../Utils/FormHelpers";
import { AdminSettingFormSchema } from "../../../Utils/ValidationSchemas";

type AdminSettingImageKey = "logo" | "favicon" | "themeImage";

const ADMIN_SETTING_IMAGES = [
  { key: "logo", label: "Logo" },
  { key: "favicon", label: "Favicon" },
  { key: "themeImage", label: "Theme Image" },
] as const;

const AdminSetting = () => {
  // const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const { data: adminSettingData } = Queries.useGetAdminSetting();
  const { mutateAsync: editAdminSetting, isPending: isEditLoading } = Mutations.useEditAdminSetting();

  const [activeKey, setActiveKey] = useState<AdminSettingImageKey | null>(null);

  const adminData: AdminSettingBase | undefined = Array.isArray(adminSettingData?.data) ? adminSettingData?.data[0] : (adminSettingData?.data as AdminSettingBase | undefined);

  const initialValues: AdminSettingFormValues = {
    logo: adminData?.logo || null,
    favicon: adminData?.favicon || null,
    themeImage: adminData?.themeImage || null,
    phoneNo: {
      countryCode: adminData?.phoneNo?.countryCode || "91",
      phoneNo: adminData?.phoneNo?.phoneNo || (typeof adminData?.phoneNo === "string" ? adminData?.phoneNo : ""),
    },
    email: adminData?.email || "",
    address: adminData?.address || "",
    workingHours: {
      startTime: adminData?.workingHours?.startTime || "",
      endTime: adminData?.workingHours?.endTime || "",
      timezone: adminData?.workingHours?.timezone || "",
    },
    links: [
      ...(adminData?.links?.map((link: AdminSettingLink) => ({
        title: link.title || "",
        link: link.link || "",
        icon: link.icon || "",
        isActive: link.isActive || false,
      })) || [{ title: "", link: "", icon: "", isActive: true }]),
    ],
  };

  const FormikImageSync = <T extends FormikValues>({ activeKey, clearActiveKey }: Params) => {
    const { selectedFiles } = useAppSelector((state) => state.modal);
    const { setFieldValue } = useFormikContext<T>();

    useEffect(() => {
      if (!selectedFiles[0] || !activeKey) return;

      setFieldValue(activeKey, selectedFiles[0]);

      dispatch(setSelectedFiles([]));
      clearActiveKey();
    }, [selectedFiles, activeKey, setFieldValue, clearActiveKey]);

    return null;
  };

  const handleUpload = (key: AdminSettingImageKey) => {
    setActiveKey(key);
    dispatch(setUploadModal({ open: true, type: "image" }));
  };

  const handleSubmit = async (values: AdminSettingFormValues) => {
    try {
      // Use GetChangedFields to omit unchanged empty fields or data that shouldn't be overridden
      const adminData: AdminSettingBase | undefined = Array.isArray(adminSettingData?.data) ? adminSettingData?.data[0] : (adminSettingData?.data as AdminSettingBase | undefined);
      const payload: any = GetChangedFields(values, adminData || {});

      // Clean up empty strings for images if backend strictly expects URL or null
      if (payload.logo === "") payload.logo = null;
      if (payload.favicon === "") payload.favicon = null;
      if (payload.themeImage === "") payload.themeImage = null;

      if (Object.keys(payload).length > 0) {
        await editAdminSetting({ ...payload });
      }
    } catch (error) {
      console.error("Failed to update admin settings:", error);
    }
  };

  return (
    <>
      <CommonBreadcrumbs title={PAGE_TITLE.SETTINGS.PROFILE.EDIT} maxItems={3} breadcrumbs={BREADCRUMBS.SETTINGS.ADMIN_SETTING} />
      <Box sx={{ p: { xs: 2, md: 3 }, mb: 8 }}>
        <Formik<AdminSettingFormValues> enableReinitialize initialValues={initialValues} validationSchema={AdminSettingFormSchema} onSubmit={handleSubmit}>
          {({ dirty, values }) => (
            <Form noValidate>
              <FormikImageSync activeKey={activeKey} clearActiveKey={() => setActiveKey(null)} />
              <Grid container spacing={2}>
                {/* BRAND IMAGES */}

                {/* CONTACT INFO */}
                <CommonCard title="Contact Info" grid={{ xs: 12 }}>
                  <Grid container spacing={2} sx={{ p: 2 }}>
                    <CommonPhoneNumber label="Phone No." countryCodeName="phoneNo.countryCode" numberName="phoneNo.phoneNo" grid={{ xs: 12, md: 4 }} />
                     <CommonValidationTextField name="email" label="Support Email" grid={{ xs: 12, md: 4 }} />
                    <CommonValidationTextField name="address" label="Address" multiline grid={{ xs: 12, md: 4 }} />
                  </Grid>
                </CommonCard>

                {/* WORKING HOURS */}
                {/* <CommonCard title="Working Hours" grid={{ xs: 12 }}>
                  <Grid container spacing={2} sx={{ p: 2 }}>
                    <CommonValidationTextField name="workingHours.startTime" label="Start Time" type="time" grid={{ xs: 12, md: 4 }} InputLabelProps={{ shrink: true }} />
                    <CommonValidationTextField name="workingHours.endTime" label="End Time" type="time" grid={{ xs: 12, md: 4 }} InputLabelProps={{ shrink: true }} />
                    <CommonValidationTextField name="workingHours.timezone" label="Timezone" grid={{ xs: 12, md: 4 }} />
                  </Grid>
                </CommonCard> */}

                {/* SOCIAL LINKS */}
                <CommonCard title="Social Links" grid={{ xs: 12 }}>
                  <Box sx={{ p: 2 }}>
                    <FieldArray name="links">
                      {({ push, remove }) => {
                        return (
                          <>
                            {values?.links?.map((_, index) => (
                              <Grid container spacing={2} key={index} sx={{ mb: 2, alignItems: "center" }}>
                                <CommonValidationTextField name={`links.${index}.title`} label="title" required grid={{ xs: 12, md: 3 }} />
                                <CommonValidationTextField name={`links.${index}.link`} label="link" required grid={{ xs: 12, md: 3 }} />
                                <CommonValidationTextField name={`links.${index}.icon`} label="icon" grid={{ xs: 12, md: 2 }} />
                                <CommonValidationSwitch name={`links.${index}.isActive`} label="Active" grid={{ xs: 12, md: 2 }} />
                                {(values?.links?.length || 0) > 1 && (
                                  <Grid size={"auto"}>
                                    <CommonButton variant="outlined" size="small" color="error" sx={{ minWidth: 20 }} onClick={() => remove(index)}>
                                      <CloseIcon />
                                    </CommonButton>
                                  </Grid>
                                )}
                                <Grid size={"auto"}>
                                  <CommonButton variant="outlined" size="small" color="primary" sx={{ minWidth: 20 }} onClick={() => push({ title: "", link: "", icon: "", isActive: true })}>
                                    <Add />
                                  </CommonButton>
                                </Grid>
                              </Grid>
                            ))}
                          </>
                        );
                      }}
                    </FieldArray>
                  </Box>
                </CommonCard>
                <CommonCard title="Brand Images" grid={{ xs: 12 }}>
                  <Grid container spacing={3} sx={{ p: 2 }}>
                    {ADMIN_SETTING_IMAGES.map(({ key, label }) => (
                      <CommonFormImageBox key={key} name={key} label={label} type="image" grid={{ xs: 12, xsm: 6, xl: 4 }} onUpload={() => handleUpload(key)} />
                    ))}
                  </Grid>
                </CommonCard>

                <CommonBottomActionBar save disabled={!dirty} isLoading={isEditLoading} />
              </Grid>
            </Form>
          )}
        </Formik>
      </Box>
    </>
  );
};

export default AdminSetting;
