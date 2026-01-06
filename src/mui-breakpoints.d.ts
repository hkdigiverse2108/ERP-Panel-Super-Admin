import "@mui/material/styles";

declare module "@mui/material/styles" {
  interface BreakpointOverrides {
    xs: true;
    sm: true;
    md: true;
    lg: true;
    xl: true;

    xxs: true;
    xsm: true;
    xxl: true;
    xxxl: true;
  }
  interface Components {
    MuiDataGrid?: {
      styleOverrides?: {
        root?: {
          borderRadius: number;
          border: string;
        };
      };
    };
  }
}
