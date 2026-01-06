import dayjs from "dayjs";
import { useState } from "react";
import { CommonCard } from "../Common";
import { Box, Grid } from "@mui/material";
import { BarChart } from "@mui/x-charts/BarChart";
import { CommonDateRangeSelector, CommonSelect } from "../../Attribute";
// import { ChartToolbar } from "@mui/x-charts/ChartToolbar";

const Transaction = () => {
  const [range, setRange] = useState({
    start: dayjs(),
    end: dayjs(),
  });
  const [values, setValues] = useState<string[]>([]);

  const filename = "Population_vs_GDP_Per_Capita_USD_2019";
  const gstOptions = [
    { label: "Sales", value: "sales" },
    { label: "Purchase", value: "purchase" },
  ];
  const topContent = (
    <>
      <Grid size={{ xs: 12, xsm: 4, xl: 3 }} offset={{ xl: "auto" }}>
        <CommonSelect label="Select Transaction" options={gstOptions} value={values} onChange={(v) => setValues(v)} limitTags={1} />
      </Grid>
      <Grid size={{ xs: 12, sm: 4, xl: 4 }}>
        <CommonDateRangeSelector value={range} onChange={setRange} active="This Month" />
      </Grid>
    </>
  );

  return (
    <CommonCard title="Transaction" topContent={topContent} grid={{ xs: 12, md: 6 }}>
      <Box className="p-2">
        <BarChart
          xAxis={[
            {
              data: ["group A", "group B", "group C"],
              tickPlacement: "middle",
              tickLabelPlacement: "middle",
            },
          ]}
          series={[
            { data: [4, 3, 5], label: "Income A" },
            { data: [1, 6, 3], label: "Income B" },
            { data: [2, 5, 6], label: "Income C" },
          ]}
          height={300}
          slotProps={{
            toolbar: {
              printOptions: { fileName: filename },
              imageExportOptions: [
                { type: "image/png", filename },
                { type: "image/jpeg", filename },
                { type: "image/webp", filename },
              ],
              zoomOptions: true,
              legendOptions: true,
              position: "end", // toolbar position (right side)
            },
          }}
        />
      </Box>
    </CommonCard>
  );
};

export default Transaction;
