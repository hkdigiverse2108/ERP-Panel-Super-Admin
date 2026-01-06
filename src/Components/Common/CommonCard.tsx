import { Divider, Grid, Paper, Typography, type PaperProps } from "@mui/material";
import { type FC, type ReactNode } from "react";
import { Link } from "react-router-dom";
import { CommonButton } from "../../Attribute";

interface CommonCardProps {
  title?: string;
  children: ReactNode;
  grid?: object;
  paperProps?: PaperProps;
  hideDivider?: boolean;
  topContent?: ReactNode;
  btnHref?: string;
}

const CommonCard: FC<CommonCardProps> = ({ title, children, grid = { xs: 12 }, paperProps, hideDivider = false, topContent, btnHref }) => {
  return (
    <Grid size={grid}>
      <Paper elevation={0} className="rounded-lg! border! border-gray-200! bg-white! dark:border-gray-800! dark:bg-gray-dark!" {...paperProps}>
        {(topContent || title) && (
          <Grid container spacing={1.5} className="flex! max-xsm:flex-col! items-center justify-between p-3">
            {title && (
              <Grid size="auto">
                <Typography variant="subtitle1" fontWeight={600} px={0.5} py={0.7} className="text-gray-700! dark:text-gray-200!">
                  {title}
                </Typography>
              </Grid>
            )}
            {topContent}
            {btnHref && (
              <Grid size="auto">
                <Link to={btnHref}>
                  <CommonButton variant="contained" size="small">
                    ADD
                  </CommonButton>
                </Link>
              </Grid>
            )}
          </Grid> 
        )}

        {!hideDivider && <Divider className="border-gray-200! dark:border-gray-800!" />}

        {children}
      </Paper>
    </Grid>
  );
};

export default CommonCard;
