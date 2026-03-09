import { Grid, Paper, Typography, Box, useTheme, alpha } from "@mui/material";
import type { CommonStatsCardProps } from "../../Types";
import type { FC } from "react";

const CommonStatsCard:FC<CommonStatsCardProps> = ({ stats, grid = { xs: 10, sm: 4, md: 4 }, paperSx, variant = "default" }) => {
  const theme = useTheme();

  return (
    <Box width="100%">
      <Grid container spacing={3}>
        {stats.map((item, index) => (
          <Grid key={index} size={grid} display="flex" justifyContent="center">
            {variant === "radio" ? (
              <Box onClick={item.onClick} sx={{ border: "1px solid", borderColor: item.selected ? "primary.main" : "divider", borderRadius: 1, p: 2, cursor: "pointer", display: "flex", alignItems: "flex-start", gap: 1.5, bgcolor: item.selected ? (theme.palette.mode === "dark" ? alpha(theme.palette.primary.main, 0.1) : "primary.50") : "transparent", width: "100%", transition: "all 0.2s", ...paperSx }}>
                {/* Check if Radio exists, if not we will just render a circle for now, but assume MUI Radio is available. Let's import it at top. */}
                <Box sx={{ width: 20, height: 20, borderRadius: "50%", border: "2px solid", borderColor: item.selected ? "primary.main" : "text.secondary", display: "flex", alignItems: "center", justifyContent: "center", mt: 0.2 }}>{item.selected && <Box sx={{ width: 10, height: 10, borderRadius: "50%", bgcolor: "primary.main" }} />}</Box>
                <Box sx={{ flex: 1, textAlign: "left" }}>
                  <Typography sx={{ fontWeight: 500, mb: 0.5, color: item.selected ? "primary.main" : "text.primary" }}>{item.value}</Typography>
                  <Typography sx={{ fontSize: "0.80rem", color: "text.secondary" }}>{item.desc || item.label}</Typography>
                </Box>
              </Box>
            ) : (
              <Box textAlign="center">
                <Paper elevation={0} className={item.color} sx={{ borderRadius: 3, width: 100, height: 70, display: "flex", alignItems: "center", justifyContent: "center", mb: 1, backgroundColor: theme.palette.mode === "dark" ? "#1e293b" : "#edf3ff", color: theme.palette.mode === "dark" ? "#ffffff" : "#1e293b", transition: "0.2s ease", ...paperSx }}>
                  <Typography sx={{ fontSize: 22, fontWeight: 700, lineHeight: 1 }}>{item.value}</Typography>
                </Paper>
                <Typography sx={{ fontSize: 13, fontWeight: 500, color: theme.palette.mode === "dark" ? "grey.400" : "text.secondary" }}>{item.label}</Typography>
              </Box>
            )}
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default CommonStatsCard;
