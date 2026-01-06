import dayjs from "dayjs";
import { useState } from "react";
import { CommonCard } from "../Common";
import { Box, Grid } from "@mui/material";
import { BarChart } from "@mui/x-charts/BarChart";
import { CommonDateRangeSelector } from "../../Attribute";
// import { ChartToolbar } from "@mui/x-charts/ChartToolbar";

const SalesAndPurchase = () => {
  const [range, setRange] = useState({
    start: dayjs(),
    end: dayjs(),
  });

  const filename = "Population_vs_GDP_Per_Capita_USD_2019";

  const topContent = (
    <Grid size={{ xs: 12, sm: 5, md: 4 }}>
      <CommonDateRangeSelector value={range} onChange={setRange} active="This Week"/>
    </Grid>
  );

  return (
    <CommonCard title="Important Announcement" topContent={topContent} grid={{ xs: 12, md: 6 }}>
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
          // slots={{
          //   toolbar: ChartToolbar, // ← Required
          // }}
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

export default SalesAndPurchase;
