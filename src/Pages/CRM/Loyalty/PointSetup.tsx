import { Grid, Skeleton } from "@mui/material";
import { Form, Formik, type FormikHelpers } from "formik";
import { Mutations, Queries } from "../../../Api";
import { CommonButton, CommonValidationTextField } from "../../../Attribute";
import type { LoyaltyPointFormValues } from "../../../Types";
import { RemoveEmptyFields } from "../../../Utils";
import { PointSetupSchema } from "../../../Utils/ValidationSchemas";

const PointSetup = () => {
  const { mutate: addLoyaltyPoint, isPending: isAddLoading } = Mutations.useAddLoyaltyPoint();
  const { data: loyaltyData, isLoading: loyaltyDataLoading } = Queries.useGetLoyaltyPoints();

  const initialValues: LoyaltyPointFormValues = {
    amount: loyaltyData?.data?.amount || "0",
    points: loyaltyData?.data?.points || "0",
  };

  const handleSubmit = async (values: LoyaltyPointFormValues, { resetForm }: FormikHelpers<LoyaltyPointFormValues>) => {
    const handleSuccess = () => {
      resetForm();
    };
    await addLoyaltyPoint(RemoveEmptyFields(values), { onSuccess: handleSuccess });
  };
  return (
    <>
      <Formik<LoyaltyPointFormValues> enableReinitialize initialValues={initialValues} validationSchema={PointSetupSchema} onSubmit={handleSubmit}>
        {({ dirty }) => (
          <Form noValidate>
            <Grid container spacing={2} sx={{ p: 2 }}>
              {loyaltyDataLoading ? (
                [1, 2].map((_, index) => (
                  <Grid size={6} key={index}>
                    <Skeleton height={70} />
                  </Grid>
                ))
              ) : (
                <>
                  <CommonValidationTextField name="amount" label="Amount" type="number" grid={{ xs: 12, md: 6, lg: 3 }} required />
                  <CommonValidationTextField name="points" label="Points" type="number" grid={{ xs: 12, md: 6, lg: 3 }} required />
                </>
              )}
              <Grid size={12}>
                <CommonButton type="submit" variant="contained" title="Save" loading={isAddLoading} disabled={!dirty} />
              </Grid>
            </Grid>
          </Form>
        )}
      </Formik>
    </>
  );
};

export default PointSetup;
