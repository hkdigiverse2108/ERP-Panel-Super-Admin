import { Grid } from "@mui/material";
import { Formik } from "formik";
import { Form } from "react-router-dom";
import { CommonButton, CommonValidationSelect, CommonValidationTextField } from "../../../../../Attribute";
import { CountryOptions } from "../../../../../Data";
import { useAppDispatch, useAppSelector } from "../../../../../Store/hooks";
import { setCardModal } from "../../../../../Store/Slices/ModalSlice";
import { CommonModal } from "../../../../Common";

const CardDetails = () => {
  const { isCardModal } = useAppSelector((state) => state.modal);
  const dispatch = useAppDispatch();

  const initialValues = {
    paymentAccount: "",
    name: "",
    amount: "",
    cardHolder: "",
    cardNo: "",
  };

  const handleClose = () => dispatch(setCardModal());

  const handleSubmit = (values: any) => {
    console.log(values);
  };

  return (
    <CommonModal title="Card Details" isOpen={isCardModal} onClose={() => handleClose()} className="max-w-[400px]">
      <Formik enableReinitialize initialValues={initialValues} onSubmit={handleSubmit}>
        {() => (
          <Form noValidate>
            <Grid container spacing={2} py={1}>
              <CommonValidationSelect name="paymentAccount" label="Payment Account" options={CountryOptions} grid={12} />
              <CommonValidationTextField name="name" label="Customer Bank Name" grid={12} />
              <CommonValidationTextField name="amount" label="Card Payment Amount" grid={12} />
              <CommonValidationTextField name="cardHolder" label="Card Holder Name" grid={12} />
              <CommonValidationTextField name="cardNo" label="Card Transaction No." grid={12} />
              <Grid size={12} sx={{ display: "flex", gap: 2, justifyContent: "center" }}>
                <CommonButton type="submit" variant="contained" title="Finalize Payment" loading={false} />
              </Grid>
            </Grid>
          </Form>
        )}
      </Formik>
    </CommonModal>
  );
};

export default CardDetails;
