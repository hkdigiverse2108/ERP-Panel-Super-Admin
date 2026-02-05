import { Grid, Paper, Typography, Box, useTheme } from "@mui/material";
import type { FC } from "react";
import type { SxProps, Theme } from "@mui/material/styles";
import type { GridType } from "../../Types";

export interface CommonStatsItem {
  label: string;
  value: number | string;
  color?: string;
}

interface CommonStatsCardProps {
  stats: CommonStatsItem[];
  grid?: GridType;
  paperSx?: SxProps<Theme>;
}

const CommonStatsCard: FC<CommonStatsCardProps> = ({ stats, grid = { xs: 10, sm: 4, md: 4 }, paperSx }) => {
  const theme = useTheme();

  return (
    <Box width="100%">
      <Grid container spacing={3}>
        {stats.map((item, index) => (
          <Grid key={index} size={grid} display="flex" justifyContent="center">
            <Box textAlign="center">
              <Paper elevation={0} className={item.color} sx={{ borderRadius: 3, width: 100, height: 70, display: "flex", alignItems: "center", justifyContent: "center", mb: 1, backgroundColor: theme.palette.mode === "dark" ? "#1e293b" : "#edf3ff", color: theme.palette.mode === "dark" ? "#ffffff" : "#1e293b", transition: "0.2s ease", ...paperSx }}>
                <Typography sx={{ fontSize: 22, fontWeight: 700, lineHeight: 1 }}>{item.value}</Typography>
              </Paper>
              <Typography sx={{ fontSize: 13, fontWeight: 500, color: theme.palette.mode === "dark" ? "grey.400" : "text.secondary" }}>{item.label}</Typography>
            </Box>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default CommonStatsCard;
