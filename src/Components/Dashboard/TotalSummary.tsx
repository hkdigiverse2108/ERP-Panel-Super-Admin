import { Grid, Paper, Typography } from "@mui/material";
import dayjs from "dayjs";
import { useState } from "react";
import { CommonDateRangeSelector, CommonSelect } from "../../Attribute";
import { CommonCard } from "../Common";

const TotalSummary = () => {
  const stats = [
    { label: "Total Sales", value: "₹0", color: "bg-brand-100! dark:bg-brand-800!" },
    { label: "Total Invoice", value: "0", color: "bg-brand-100!  dark:bg-brand-800!" },
    { label: "Sold Qty", value: "0", color: "bg-brand-100!  dark:bg-brand-800!" },
    { label: "Total Customers", value: "4", color: "bg-brand-100!  dark:bg-brand-800!" },
    { label: "To Receive", value: "₹0", color: "bg-brand-100!  dark:bg-brand-800!" },
    { label: "Total Sales Return", value: "₹0", color: "bg-brand-100!  dark:bg-brand-800!" },

    { label: "Total Purchase", value: "₹0", color: "bg-sky-100!  dark:bg-sky-800!" },
    { label: "Total Bills", value: "0", color: "bg-sky-100!  dark:bg-sky-800!" },
    { label: "Purchase Qty", value: "0", color: "bg-sky-100!  dark:bg-sky-800!" },
    { label: "Total Suppliers", value: "0", color: "bg-sky-100!  dark:bg-sky-800!" },
    { label: "To Pay", value: "₹0", color: "bg-sky-100!  dark:bg-sky-800!" },
    { label: "Total Purchase Return", value: "₹0", color: "bg-sky-100!  dark:bg-sky-800!" },

    { label: "Total Paid", value: "₹0", color: "bg-purple-100!  dark:bg-purple-800!" },
    { label: "Total Expense", value: "₹0", color: "bg-purple-100!  dark:bg-purple-800!" },
    { label: "Total Products", value: "43", color: "bg-purple-100!  dark:bg-purple-800!" },
    { label: "Stock Qty", value: "56", color: "bg-purple-100!  dark:bg-purple-800!" },
    { label: "Stock Value", value: "₹5635", color: "bg-purple-100!  dark:bg-purple-800!" },
    { label: "Cash in Hand", value: "10985", color: "bg-purple-100!  dark:bg-purple-800!" },

    { label: "Gross Profit", value: "0", color: "bg-rose-100!  dark:bg-rose-800!" },
    { label: "Avg. Profit Margin", value: "₹0", color: "bg-rose-100!  dark:bg-rose-800!" },
    { label: "Avg. Profit Margin (%)", value: "0.00", color: "bg-rose-100!  dark:bg-rose-800!" },
    { label: "Avg. Cart Value", value: "₹0", color: "bg-rose-100!  dark:bg-rose-800!" },
    { label: "Avg. Bills (Nos.)", value: "0", color: "bg-rose-100!  dark:bg-rose-800!" },
    { label: "Bank Accounts", value: "-32260", color: "bg-rose-100!  dark:bg-rose-800!" },
  ];
  const gstOptions = [
    { label: "ALL", value: "all" },
    { label: "Online", value: "online" },
    { label: "Offline", value: "offline" },
  ];

  const [values, setValues] = useState<string[]>([]);
  const [value, setValue] = useState<string[]>([]);
  const [range, setRange] = useState({
    start: dayjs(),
    end: dayjs(),
  });

  const topContent = (
    <>
      <Grid size={{ xs: 12, sm: 4, xxl: 3 }}>
        <CommonDateRangeSelector value={range} onChange={setRange} />
      </Grid>
      <Grid size={{ xs: 12, xsm: 6, sm: 4, xxl: 3 }} offset={{ xl: "auto" }}>
        <CommonSelect label="Select Location" options={gstOptions} value={value} onChange={(v) => setValue(v)} limitTags={1}/>
      </Grid>
      <Grid size={{ xs: 12, xsm: 6, sm: 4, xxl: 3 }}>
        <CommonSelect label="Select Channel" options={gstOptions} value={values} onChange={(v) => setValues(v)} limitTags={1} />
      </Grid>
    </>
  );

  return (
    <CommonCard grid={{ xs: 12, md: 8 }} topContent={topContent}>
      <Grid container spacing={1.5} p={1.5}>
        {stats.map((item, index) => (
          <Grid size={{ xs: 6, sm: 4, lg: 3, xl: 2 }} key={index}>
            <Paper className={item.color} elevation={0} sx={{ p: 1.5, borderRadius: 2, height: "100%", display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", textAlign: "center" }}>
              <Typography variant="h6">{item.value}</Typography>
              <Typography variant="body2" color="text.secondary">
                {item.label}
              </Typography>
            </Paper>
          </Grid>
        ))}
      </Grid>
    </CommonCard>
  );
};

export default TotalSummary;
