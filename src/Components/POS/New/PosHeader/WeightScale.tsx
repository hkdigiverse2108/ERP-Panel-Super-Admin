import { Grid, Tooltip } from "@mui/material";
import { Form, Formik } from "formik";
import { useState } from "react";
import { CommonButton, CommonValidationSelect } from "../../../../Attribute";
import { BAUD_RATE, DATA_BITS, FLOW_CONTROL, PARITY, PRECISION, STOP_BITS } from "../../../../Data";
import { CommonModal } from "../../../Common";
import type { WeightScaleFormValues } from "../../../../Types";

const WeightScale = () => {
  const [open, setOpen] = useState(false);
  const initialValues: WeightScaleFormValues = {
    baudRate: "",
    dataBits: "",
    stopBits: "",
    parity: "",
    flowControl: "",
    precision: "",
  };
  const handleSubmit = (values: WeightScaleFormValues) => {
    console.log(values);
  };

  return (
    <>
      <Tooltip title="Select Your Weight Scale Properties">
        <div onClick={() => setOpen(!open)} className="head-icon">
          W
        </div>
      </Tooltip>
      <CommonModal isOpen={open} title="Select Your Weight Scale Properties" onClose={() => setOpen(!open)} className="max-w-[700px] m-2 sm:m-5">
        <Formik<WeightScaleFormValues> initialValues={initialValues} enableReinitialize onSubmit={handleSubmit}>
          {() => (
            <Form noValidate>
              <Grid sx={{ px: 1 }} container spacing={2}>
                <CommonValidationSelect name="baudRate" label="Select Baud Rate" options={BAUD_RATE} required grid={{ xs: 12, md: 6 }} />
                <CommonValidationSelect name="dataBits" label="Data Bits" options={DATA_BITS} required grid={{ xs: 12, md: 6 }} />
                <CommonValidationSelect name="stopBits" label="Stop Bits" options={STOP_BITS} required grid={{ xs: 12, md: 6 }} />
                <CommonValidationSelect name="parity" label="Parity" options={PARITY} required grid={{ xs: 12, md: 6 }} />
                <CommonValidationSelect name="flowControl" label="Flow Control" options={FLOW_CONTROL} required grid={{ xs: 12, md: 6 }} />
                <CommonValidationSelect name="precision" label="Set Precision" options={PRECISION} required grid={{ xs: 12, md: 6 }} />
                <CommonButton type="submit" variant="contained" title="Select Port" size="medium" loading={false} grid={"auto"} />
              </Grid>
            </Form>
          )}
        </Formik>
      </CommonModal>
    </>
  );
};

export default WeightScale;
