// NoRowsOverlay.tsx
import { Box, Typography } from "@mui/material";

const NoRowsOverlay = () => {
  return (
    <Box sx={{ height: "100%", display: "flex", alignItems: "center", justifyContent: "center", flexDirection: "column", gap: 1.5, color: "text.secondary" }}>
      <Typography variant="h6">No data found</Typography>
      <Typography variant="body2">There are no records to display.</Typography>
    </Box>
  );
};

export default NoRowsOverlay;
