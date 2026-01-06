import React, { useState, type SyntheticEvent } from "react";
import { CommonSelect } from "../../../../Attribute";
import { Box, FormControlLabel, Grid, Radio, RadioGroup, Tab, Tabs } from "@mui/material";
import { ImagePath } from "../../../../Constants";
import { CommonModal } from "../../../Common";

export interface ISelectOption {
  label: string;
  value: string;
}

export interface IReportItem {
  value: string;
  label: string;
  preview: string;
}

export interface IReportData {
  [tabIndex: number]: IReportItem[];
}

export interface IGeneralSettingTab {
  label: string;
  value: number;
}

const gstOptions: ISelectOption[] = [
  { label: "ALL", value: "all" },
  { label: "Thermal", value: "thermal" },
  { label: "A4", value: "a4" },
  { label: "A5", value: "a5" },
];

const ReportFormats = () => {
  const [format, setFormat] = useState<string[]>([]);
  const [tab, setTab] = useState(0);
  const [open, setOpen] = useState(false);
  const [imageUrl, setImageUrl] = useState("");

  const [value, setValue] = useState("");

  const handleRadioChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setValue((event.target as HTMLInputElement).value);
  };

  const handleChange = (_: SyntheticEvent, newValue: number) => setTab(newValue);
  const generalSettingTabs: IGeneralSettingTab[] = [
    { label: "POS Offline", value: 0 },
    { label: "POS(B2C)", value: 1 },
    { label: "Sales(B2B)", value: 2 },
    { label: "Material Inward", value: 3 },
    { label: "Order", value: 4 },
    { label: "Bill", value: 5 },
    { label: "Debit Note", value: 6 },
    { label: "Estimate", value: 7 },
    { label: "Delivery Challan", value: 8 },
    { label: "Stock Transfer", value: 9 },
    { label: "Receipt", value: 10 },
  ];

  const reportData: IReportData = {
    0: [
      { value: "pos1", label: "POS Offline - Report 1", preview: `${ImagePath}/report-format/thermal_80mm-offline.jpg` },
      { value: "pos2", label: "POS Offline - Report 2", preview: `${ImagePath}/report-format/thermal_80mm-offline.jpg` },
      { value: "pos3", label: "POS Offline - Report 1", preview: `${ImagePath}/report-format/thermal_80mm-offline.jpg` },
      { value: "pos4", label: "POS Offline - Report 2", preview: `${ImagePath}/report-format/thermal_80mm-offline.jpg` },
      { value: "pos5", label: "POS Offline - Report 1", preview: `${ImagePath}/report-format/thermal_80mm-offline.jpg` },
      { value: "pos6", label: "POS Offline - Report 2", preview: `${ImagePath}/report-format/thermal_80mm-offline.jpg` },
    ],
    1: [{ value: "b2c1", label: "B2C - Report 1", preview: `${ImagePath}/report-format/thermal_80mm-offline.jpg` }],
    2: [
      { value: "b2b1", label: "B2B - Report 1", preview: `${ImagePath}/report-format/thermal_80mm-offline.jpg` },
      { value: "b2b1", label: "B2B - Report 1", preview: `${ImagePath}/report-format/thermal_80mm-offline.jpg` },
    ],

    3: [
      { value: "b2b1", label: "B2B - Report 1", preview: `${ImagePath}/report-format/thermal_80mm-offline.jpg` },
      { value: "b2b1", label: "B2B - Report 1", preview: `${ImagePath}/report-format/thermal_80mm-offline.jpg` },
      { value: "b2b1", label: "B2B - Report 1", preview: `${ImagePath}/report-format/thermal_80mm-offline.jpg` },
    ],
    4: [
      { value: "b2b1", label: "B2B - Report 1", preview: `${ImagePath}/report-format/thermal_80mm-offline.jpg` },
      { value: "pos1", label: "POS Offline - Report 1", preview: `${ImagePath}/report-format/thermal_80mm-offline.jpg` },
      { value: "pos2", label: "POS Offline - Report 2", preview: `${ImagePath}/report-format/thermal_80mm-offline.jpg` },
      { value: "pos3", label: "POS Offline - Report 1", preview: `${ImagePath}/report-format/thermal_80mm-offline.jpg` },
      { value: "pos4", label: "POS Offline - Report 2", preview: `${ImagePath}/report-format/thermal_80mm-offline.jpg` },
      { value: "pos5", label: "POS Offline - Report 1", preview: `${ImagePath}/report-format/thermal_80mm-offline.jpg` },
      { value: "pos6", label: "POS Offline - Report 2", preview: `${ImagePath}/report-format/thermal_80mm-offline.jpg` },
    ],

    // ... continue for all 10 tabs
  };
  const items = reportData[tab] || [];

  return (
    <Grid container spacing={2}>
      <Grid size={{ xs: 8, md: 4, xl: 3 }}>
        <CommonSelect label="Format Type" options={gstOptions} value={format} onChange={(v) => setFormat(v)} limitTags={1} />
      </Grid>
      <Box className=" bg-white dark:bg-gray-dark! border-b border-gray-200 dark:border-gray-800 w-full">
        <Tabs orientation="horizontal" variant="scrollable" value={tab} onChange={handleChange}>
          {generalSettingTabs.map((tab, index) => (
            <Tab key={index} label={tab.label} value={tab.value} iconPosition="start" />
          ))}
        </Tabs>
      </Box>
      {/* <Grid size={{ xs: 12, md: 9, lg: 9, xl: 12 }} className="rounded-lg p-4 bg-white dark:bg-gray-dark! border border-gray-200 dark:border-gray-800">
        {tabViews[tab]}
      </Grid> */}
      <Grid container spacing={2}>
        <RadioGroup name="formats" value={value} onChange={handleRadioChange} style={{ width: "100%" }}>
          <Grid container spacing={2}>
            {items.map((item, index) => (
              <Grid key={index} size={{ xs: 12, sm: items?.length <= 1 ? 12 : items?.length <= 2 ? 6 : items?.length <= 3 ? 4 : 6, lg: items?.length <= 1 ? 12 : items?.length <= 2 ? 6 : items?.length <= 3 ? 4 : 6, xl: items?.length <= 1 ? 12 : items?.length <= 2 ? 6 : items?.length <= 3 ? 4 : 4, xxl: items?.length <= 1 ? 12 : items?.length <= 2 ? 6 : items?.length <= 3 ? 4 : 3 }}>
                <Box className="rounded-lg bg-white  dark:bg-gray-dark! border border-gray-200 dark:border-gray-800 overflow-hidden w-fit ">
                  <FormControlLabel value={item.value} control={<Radio />} label={item.label} className="text-nowrap px-4! " />
                  <img
                    src={item.preview}
                    alt="report preview"
                    className="border-t p-2 cursor-pointer"
                    onClick={() => {
                      setOpen(true);
                      setImageUrl(item.preview);
                    }}
                  />
                </Box>
              </Grid>
            ))}
          </Grid>
        </RadioGroup>

        <CommonModal isOpen={open} title="" subTitle="" onClose={() => setOpen(!open)} className="max-w-[500px] m-2 sm:m-5">
          <div className="flex flex-col gap-5">
            <img src={imageUrl} alt="" />
          </div>
        </CommonModal>
      </Grid>
    </Grid>
  );
};

export default ReportFormats;
