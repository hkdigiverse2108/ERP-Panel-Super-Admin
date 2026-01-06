import CloseIcon from "@mui/icons-material/Close";
import { Grid, Tooltip } from "@mui/material";
import { Form, Formik } from "formik";
import { useState } from "react";
import { CommonButton, CommonValidationSelect, CommonValidationTextField } from "../../../../Attribute";
import { BAUD_RATE } from "../../../../Data";
import { CommonModal } from "../../../Common";

const CurrentRegister = () => {
  const [open, setOpen] = useState(false);
  // const [nosMap, setNosMap] = useState<Record<number, number>>({});

  const initialValues = {
    baudRate: "",
    bankTransfer: "",
    cashFlow: "",
    totalCashLeftInDrawer: "",
    physicalDrawer: "",
    closingNote: "",
    nos: {} as Record<number, number>,
  };

  const Sales = [
    { label: "Opening Cash", value: 100.0 },
    { label: "Cash Payment", value: 7513.0 },
    { label: "Cheque Payment", value: 0.0 },
    { label: "Card Payment", value: 32170.0 },
    { label: "Bank Transfer", value: 0.0 },
    { label: "UPI Payment", value: 853.0 },
    { label: "Wallet Payment", value: 0.0 },
    { label: "Sales Return", value: 0.0 },
    { label: "Cash Refund", value: 0.0 },
    { label: "Bank Refund", value: 0.0 },
    { label: "Credit/Advance Redeemed", value: 0.0 },
    { label: "Pay Later", value: 0.0 },
    { label: "Expense", value: 0.0 },
    { label: "Purchase Payment", value: 0.0 },
  ];

  const totalSales = Sales.reduce((sum, i) => sum + i.value, 0);

  const currencyNotes = [1, 2, 5, 10, 20, 50, 100, 200, 500];
  // const getAmount = (note: number) => {
  //   return (nosMap[note] || 0) * note;
  // };

  // const totalAmount = currencyNotes.reduce((sum, note) => sum + getAmount(note), 0);

  const handleSubmit = () => {};

  return (
    <>
      <Tooltip title="Open Cash Drawer/Close Register">
        <div onClick={() => setOpen(!open)} className="head-icon">
          <CloseIcon sx={{ fontSize: { xs: 20, md: 22 } }} />
        </div>
      </Tooltip>
      <CommonModal isOpen={open} onClose={() => setOpen(!open)} title="Current Register (20 Nov 2025 12:35 pm - 30 Dec 2025 11:59 am )" className="max-w-[1100px] m-2 sm:m-5">
        <div className="flex flex-col items-center text-center">
          <Formik initialValues={initialValues} enableReinitialize onSubmit={handleSubmit}>
            {({ values }) => {
              const getAmount = (note: number) => (Number(values.nos?.[note]) || 0) * note;
              console.log(values);

              const totalAmount = currencyNotes.reduce((sum, note) => sum + getAmount(note), 0);
              return (
                <Form noValidate className="flex flex-col gap-5">
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    <div className="border border-gray-200 dark:border-gray-600 rounded-md overflow-hidden">
                      <table className="w-full text-sm">
                        <tbody>
                          {Sales.map((item, index) => (
                            <tr key={index} className="bg-white dark:bg-gray-800 odd:bg-gray-50 dark:odd:bg-gray-900">
                              <th className="px-3 py-2 text-start font-medium text-gray-600 dark:text-gray-300">{item.label}</th>
                              <td className="px-3 py-2 text-right font-medium dark:text-gray-100">{item.value.toFixed(2)}</td>
                            </tr>
                          ))}

                          <tr className="font-semibold bg-gray-100 dark:bg-gray-dark dark:text-gray-100">
                            <th className="px-3 py-2 text-start">Total Sales</th>
                            <td className="px-3 py-2 text-right">{totalSales.toFixed(2)}</td>
                          </tr>
                        </tbody>
                      </table>
                    </div>

                    <div className="border border-gray-200 dark:border-gray-600 rounded-md overflow-hidden">
                      <table className="w-full text-sm h-full">
                        <thead className="bg-gray-100 text-gray-700 dark:bg-gray-dark dark:text-gray-100">
                          <tr>
                            <th className="px-3 py-2 text-left">Currency</th>
                            <th className="px-3 py-2">Nos</th>
                            <th className="px-3 py-2 text-right">Amount</th>
                          </tr>
                        </thead>
                        <tbody>
                          {currencyNotes.map((note) => (
                            <tr key={note} className="bg-white dark:bg-gray-800 even:bg-gray-50 dark:even:bg-gray-900">
                              <td className="px-3 py-2 text-start font-medium text-gray-600 dark:text-gray-300">₹{note}</td>
                              <td className="px-3">
                                <CommonValidationTextField name={`nos.${note}`} type="text" />
                              </td>
                              <td className="px-3 py-2 text-right dark:text-gray-100">{getAmount(note).toFixed(2)}</td>
                            </tr>
                          ))}
                          <tr className="font-semibold bg-gray-100 dark:bg-gray-dark dark:text-gray-100">
                            <th className="px-3 py-2 text-start" colSpan={2}>
                              Total
                            </th>
                            <td className="px-3 py-2 text-right">{totalAmount.toFixed(2)}</td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                    <div className="space-y-3 text-sm">
                      <Grid container spacing={2}>
                        <CommonValidationSelect name="bankAccount" label="Bank Account" options={BAUD_RATE} grid={{ xs: 12 }} />
                        <CommonValidationTextField name="bankTransfer" label="Bank Transfer" grid={{ xs: 12 }} />
                        <CommonValidationTextField name="cashFlow" label="Cash Flow" grid={{ xs: 12 }} />
                        <CommonValidationTextField name="totalCashLeftInDrawer" label="Total Cash Left In Drawer" grid={{ xs: 12 }} />
                        <CommonValidationTextField name="physicalDrawer" label="Physical Drawer" required grid={{ xs: 12 }} />
                        <CommonValidationTextField name="closingNote" label="Closing Note" grid={{ xs: 12 }} rows={3} multiline />
                      </Grid>
                    </div>
                  </div>
                  <CommonButton type="submit" variant="contained" title="Close Register" size="medium" loading={false} grid={"auto"} />
                </Form>
              );
            }}
          </Formik>
        </div>
      </CommonModal>
    </>
  );
};

export default CurrentRegister;
