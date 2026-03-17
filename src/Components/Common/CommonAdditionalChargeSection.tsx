import { Box } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import { ClearIcon } from "@mui/x-date-pickers-pro";
import { CommonButton, CommonSelect, CommonTextField } from "../../Attribute";
import { CommonSummarySection, CommonTable, CommonCard } from ".";
import type { AdditionalChargeItem, CommonTableColumn } from "../../Types";
import { Queries } from "../../Api";
import { GenerateOptions } from "../../Utils";
import { FieldArray, useFormikContext } from "formik";
import { useState } from "react";

interface CommonAdditionalChargeSectionProps {
  name?: string;
  summaryName?: string;
}

const CommonAdditionalChargeSection = ({ name = "additionalCharges", summaryName = "transactionSummary" }: CommonAdditionalChargeSectionProps) => {
  const { values, setFieldValue } = useFormikContext<any>();
  const [show, setShow] = useState(Array.isArray(values[name]) && values[name]?.length > 0);

  const { data: TaxData, isLoading: isTaxLoading } = Queries.useGetTaxDropdown();
  const taxOptions = GenerateOptions(TaxData?.data || []);

  const { data: additionalchargedata, isLoading: isAdditionalChargeLoading } = Queries.useGetAdditionalChargesDropdown();
  const additionalChargeOptions = GenerateOptions(additionalchargedata?.data);

  const emptyRow: AdditionalChargeItem = { chargeId: "", amount: 0, taxId: "", taxAmount: 0, totalAmount: 0 };

  const handleRowChange = (index: number, field: keyof AdditionalChargeItem, value: any, rows: AdditionalChargeItem[]) => {
    const newRows = [...rows];
    let row = { ...newRows[index], [field]: value };

    if (field === "chargeId") {
      const charge = additionalchargedata?.data?.find((c: any) => c._id === value);
      if (charge) {
        row.amount = charge.defaultValue || 0;
        row.taxId = charge.taxId?._id || "";
      }
    }

    const amount = Number(row.amount) || 0;
    const tax = TaxData?.data?.find((t: any) => t._id === row.taxId);
    const taxRate = tax?.percentage || 0;
    const taxAmount = (amount * taxRate) / 100;

    row.taxAmount = Number(taxAmount.toFixed(2));
    row.totalAmount = Number((amount + taxAmount).toFixed(2));

    newRows[index] = row;
    setFieldValue(name, newRows);
  };

  const calculateTotal = (rows: AdditionalChargeItem[]) => {
    return rows.reduce((acc, row) => acc + (row.totalAmount || 0), 0).toFixed(2);
  };

  const getColumns = (push: any, remove: any, rows: AdditionalChargeItem[]): CommonTableColumn<AdditionalChargeItem>[] => [
    {
      key: "actions",
      header: "",
      bodyClass: "p-2 flex justify-center gap-1",
      render: (_, index) => (
        <>
          {index === rows.length - 1 && (
            <CommonButton size="small" variant="outlined" onClick={() => push(emptyRow)}>
              <AddIcon />
            </CommonButton>
          )}
          {rows.length > 1 && (
            <CommonButton size="small" color="error" variant="outlined" onClick={() => remove(index)}>
              <ClearIcon />
            </CommonButton>
          )}
        </>
      ),
      footer: () => <span className="p-2 text-right block">Total</span>,
      footerClass: "text-right",
    },
    { key: "sr", header: "#", render: (_, i) => i + 1, bodyClass: "w-10", footer: "" },
    {
      key: "chargeId",
      header: "Additional Charge",
      headerClass: "text-start",
      bodyClass: "min-w-60 text-start",
      render: (row, index) => <CommonSelect label="Select Additional Charge" value={row.chargeId ? [row.chargeId] : []} options={additionalChargeOptions} isLoading={isAdditionalChargeLoading} onChange={(v) => handleRowChange(index, "chargeId", v[0], rows)} />,
      footer: "",
    },
    { key: "amount", header: "Amount", bodyClass: "min-w-32", render: (row, index) => <CommonTextField type="number" value={row.amount || ""} onChange={(v: any) => handleRowChange(index, "amount", v, rows)} />, footer: "" },
    {
      key: "taxId",
      header: "Tax",
      bodyClass: "min-w-52",
      render: (row, index) => <CommonSelect value={row.taxId ? [row.taxId] : []} options={taxOptions} label="Select Tax" isLoading={isTaxLoading} onChange={(v) => handleRowChange(index, "taxId", v[0], rows)} />,
      footer: "",
    },
    { key: "totalAmount", header: "Total", headerClass: "text-right", bodyClass: "min-w-28 p-2 text-right", render: (row) => row.totalAmount || 0, footer: () => calculateTotal(rows), footerClass: "text-right" },
  ];

  return (
    <Box>
      {!show ? (
        <Box p={2}>
          <CommonButton
            size="small"
            startIcon={<AddIcon fontSize="small" />}
            onClick={() => {
              setShow(true);
              if (!values[name] || values[name].length === 0) {
                setFieldValue(name, [emptyRow]);
              }
            }}
          >
            Add Additional Charges
          </CommonButton>
        </Box>
      ) : (
        <CommonCard
          hideDivider
          title="Additional Charge"
          topContent={
            <CommonButton
              size="small"
              color="error"
              variant="outlined"
              onClick={() => {
                setShow(false);
                setFieldValue(name, []);
              }}
            >
              <ClearIcon fontSize="small" />
            </CommonButton>
          }
        >
          <FieldArray name={name}>
            {({ push, remove }) => {
              const rows = values[name] || [];
              return (
                <Box className="custom-scrollbar" sx={{ flex: 1, overflowX: "auto" }}>
                  <Box sx={{ minWidth: 800 }}>
                    <CommonTable data={rows} columns={getColumns(push, remove, rows)} rowKey={(_: any, i: number) => String(i)} showFooter />
                  </Box>
                </Box>
              );
            }}
          </FieldArray>
        </CommonCard>
      )}
      <CommonSummarySection name={summaryName} />
    </Box>
  );
};

export default CommonAdditionalChargeSection;

