import SearchIcon from "@mui/icons-material/Search";
import { Form, Formik, useFormikContext } from "formik";
import { CommonTextField } from "../../../Attribute";
import { Grid } from "@mui/material";
import { CommonBreadcrumbs } from "../../../Components/Common";
import { GeneralSettingBreadcrumbs } from "../../../Data";
import { PAGE_TITLE } from "../../../Constants";

const GeneralSetting = () => {
  const formik = useFormikContext<any>();
  if (!formik) {
    console.warn("CommonTextField must be used inside <Formik>!");
  }
  return (
    <>
      <CommonBreadcrumbs title={PAGE_TITLE.SETTINGS.GENERAL} maxItems={1} breadcrumbs={GeneralSettingBreadcrumbs} />
      <div className="m-4 md:m-6">
        <Formik initialValues={{ name: "", password: "", search: "", username: "" }} onSubmit={(values) => console.log(values)}>
          <Form>
            <Grid container spacing={2}>
              <CommonTextField name="name" label="Full Name" placeholder="John Doe" required isFormLabel grid={{ xs: 12, sm: 6 }} />
              <CommonTextField name="password" label="password" type="password" required showPasswordToggle grid={{ xs: 12, sm: 6 }} />
              <CommonTextField name="search" label="Search" clearable isFormLabel endIcon={<SearchIcon />} grid={{ xs: 12, sm: 6 }} />
              <CommonTextField name="username" label="Username" validating={false} grid={{ xs: 12, sm: 6 }} />
              <button type="submit">Save</button>
            </Grid>
          </Form>
        </Formik>
      </div>
    </>
  );
};

export default GeneralSetting;
