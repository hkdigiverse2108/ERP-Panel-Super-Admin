import { Button, Grid } from "@mui/material";
import { type FC } from "react";
import type { CommonButtonProps } from "../../Types";

export const CommonButton: FC<CommonButtonProps> = ({ children, loading = false, loadingPosition = "start", disabled, sx = {}, title, grid, ...props }) => {
  const button = (
    <Button
      {...props}
      loading={loading}
      loadingPosition={loadingPosition}
      disabled={loading || disabled}
      sx={{
        borderRadius: 1.2,
        fontWeight: 600,
        height: props.size === "small" ? 36 : props.size === "large" ? 48 : 42,
        ...sx,
      }}
    >
      {children ? children : title}
    </Button>
  );

  return grid ? <Grid size={grid}>{button}</Grid> : button;
};