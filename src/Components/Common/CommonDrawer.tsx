import CloseIcon from "@mui/icons-material/Close";
import { Box, Divider, Drawer, IconButton, Typography, useMediaQuery, useTheme } from "@mui/material";
import type { CSSProperties } from "@mui/material/styles";
import { type FC } from "react";
import type { CommonDrawerProps } from "../../Types";

const defaultWidth = 420;

const CommonDrawer: FC<CommonDrawerProps> = ({ open, onClose, anchor = "right", title, width = defaultWidth, fullScreenBelow = "sm", showDivider = true, hideCloseButton = false, children, paperProps, ...drawerProps }) => {
  const theme = useTheme();
  const isNarrow = useMediaQuery(theme.breakpoints.down(fullScreenBelow));

  const paperSx: CSSProperties | any = {
    width: anchor === "left" || anchor === "right" ? (isNarrow ? "100%" : width) : undefined,
    height: anchor === "top" || anchor === "bottom" ? (isNarrow ? "100%" : undefined) : undefined,
    display: "flex",
    flexDirection: "column",
    ...((paperProps && (paperProps as any).sx) || {}),
  };

  return (
    <Drawer open={open} onClose={onClose} anchor={anchor} ModalProps={{ keepMounted: true }} slotProps={{ paper: { sx: paperSx, ...paperProps } }} {...drawerProps}>
      <Box className="flex justify-between items-center p-3">
        {title && (
          <Typography variant="h5" className="font-medium! text-gray-800 dark:text-gray-200">
            {title}
          </Typography>
        )}

        {!hideCloseButton && (
          <IconButton onClick={onClose} className="text-gray-700 dark:text-gray-300! hover:text-gray-900! dark:hover:text-white" size="medium">
            <CloseIcon />
          </IconButton>
        )}
      </Box>

      {showDivider && <Divider className="dark:border-gray-700!" />}

      <Box sx={{ flex: 1, overflowY: "auto", p: 2 }}>{children}</Box>
    </Drawer>
  );
};

export default CommonDrawer;
