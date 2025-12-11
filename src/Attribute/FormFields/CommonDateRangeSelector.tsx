import { Box, Divider, List, ListItemButton, ListItemText, Popover, TextField } from "@mui/material";
import { DateRangeCalendar, type DateRange } from "@mui/x-date-pickers-pro";
import dayjs, { Dayjs } from "dayjs";
import { useEffect, useState, type FC } from "react";
import type { CommonDateRangeSelectorProps } from "../../Types";
import {CommonButton} from "./CommonButton";

const ranges = ["Today", "Yesterday", "This Week", "This Month", "Last 15 Days", "Last 30 Days", "This Quarter", "Last Quarter", "This Financial Year", "Last Financial Year"] as const;

type RangeLabel = (typeof ranges)[number];

const getRange = (label: RangeLabel): DateRange<Dayjs> => {
  const today = dayjs();
  const year = today.year();
  const month = today.month();

  switch (label) {
    case "Yesterday":
      return [today.subtract(1, "day"), today.subtract(1, "day")];

    case "This Week":
      return [today.startOf("week"), today.endOf("week")];

    case "This Month":
      return [today.startOf("month"), today.endOf("month")];

    case "Last 15 Days":
      return [today.subtract(15, "day"), today];

    case "Last 30 Days":
      return [today.subtract(30, "day"), today];

    case "This Quarter":
      if (month < 3) return [dayjs(`${year}-01-01`), dayjs(`${year}-03-31`)];
      if (month < 6) return [dayjs(`${year}-04-01`), dayjs(`${year}-06-30`)];
      if (month < 9) return [dayjs(`${year}-07-01`), dayjs(`${year}-09-30`)];
      return [dayjs(`${year}-10-01`), dayjs(`${year}-12-31`)];

    case "Last Quarter":
      if (month < 3) return [dayjs(`${year - 1}-10-01`), dayjs(`${year - 1}-12-31`)];
      if (month < 6) return [dayjs(`${year}-01-01`), dayjs(`${year}-03-31`)];
      if (month < 9) return [dayjs(`${year}-04-01`), dayjs(`${year}-06-30`)];
      return [dayjs(`${year}-07-01`), dayjs(`${year}-09-30`)];

    case "This Financial Year":
      return [dayjs(`${year}-04-01`), dayjs(`${year + 1}-03-31`)];

    case "Last Financial Year":
      return [dayjs(`${year - 1}-04-01`), dayjs(`${year}-03-31`)];

    default:
      return [today, today];
  }
};

export const CommonDateRangeSelector: FC<CommonDateRangeSelectorProps> = ({ value, onChange, BoxClassName, active }) => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [selectedRange, setSelectedRange] = useState<RangeLabel>((active as RangeLabel) ?? "Today");
  const [tempRange, setTempRange] = useState<DateRange<Dayjs>>([value.start, value.end]);

  const handleRangeSelect = (label: RangeLabel) => {
    setSelectedRange(label);
    setTempRange(getRange(label));
  };

useEffect(() => {
  if (!active) return;

  const label = active as RangeLabel;
  const range = getRange(label);

  // Only sync parent value
  onChange({ start: range[0]!, end: range[1]! });
}, [active, onChange]);


  const applyCustom = () => {
    if (tempRange[0] && tempRange[1]) {
      onChange({ start: tempRange[0], end: tempRange[1] });
      setAnchorEl(null);
    }
  };
  
  const handleClose = () => {
    setAnchorEl(null);
    setSelectedRange((active as RangeLabel) ?? "Today");
    setTempRange([value.start, value.end]);
  };

  return (
    <Box className={BoxClassName}>
      <TextField value={`${value.start.format("DD/MM/YYYY")} - ${value.end.format("DD/MM/YYYY")}`} onClick={(e) => setAnchorEl(e.currentTarget)} fullWidth size="small" slotProps={{ input: { style: { cursor: "pointer" } } }} />

      <Popover open={Boolean(anchorEl)} anchorEl={anchorEl} onClose={() => handleClose()} anchorOrigin={{ vertical: "bottom", horizontal: "left" }} sx={{ mt: 1 }}>
        <Box
          sx={{
            display: "flex",
            flexDirection: { xs: "column", md: "row" },
            width: { xs: "100%", md: "auto" },
            maxWidth: { xs: "100vw", md: "none" },
          }}
        >
          {/* LEFT LIST */}
          <List dense sx={{ width: { xs: "100%", md: 200 }, borderRight: { md: "1px solid #ddd" }, borderBottom: { xs: "1px solid #ddd", md: "none" } }}>
            {ranges.map((item) => (
              <ListItemButton key={item} selected={selectedRange === item} onClick={() => handleRangeSelect(item)}>
                <ListItemText primary={item} />
              </ListItemButton>
            ))}
          </List>

          {/* RIGHT CALENDAR */}
          <Box sx={{ flexGrow: 1, minWidth: { xs: "100%", md: 300 }, display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center" }}>
            <DateRangeCalendar value={tempRange} onChange={(newValue) => setTempRange(newValue)} calendars={1} />

            <Divider sx={{ my: 2 }} />

            <Box sx={{ width: "100%", display: "flex", flexDirection: { xs: "column", md: "row" }, justifyContent: "space-between", alignItems: "center", pb: 2, px: 2, gap: { xs: 1, md: 0 } }}>
              <Box>{tempRange[0] && tempRange[1] ? `${tempRange[0].format("DD/MM/YYYY")} - ${tempRange[1].format("DD/MM/YYYY")}` : ""}</Box>

              <Box sx={{ display: "flex", gap: 1, pl: 2 }}>
                <CommonButton variant="outlined" onClick={() => setAnchorEl(null)} title="Cancel"/>
                <CommonButton variant="contained" onClick={applyCustom} title="Apply"/>
              </Box>
            </Box>
          </Box>
        </Box>
      </Popover>
    </Box>
  );
};