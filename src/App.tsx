import { ThemeProvider } from "@mui/material/styles";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { RouterProvider } from "react-router-dom";
import { Router } from "./Routers";
import { useAppSelector } from "./Store/hooks";
import { getTheme } from "./Theme";
import { GlobalSnackbar } from "./Attribute";

function App() {
  const { isToggleTheme } = useAppSelector((state) => state.layout);

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <ThemeProvider theme={getTheme(isToggleTheme === "light" ? "light" : "dark")}>
        <RouterProvider router={Router} />
        <GlobalSnackbar />
      </ThemeProvider>
    </LocalizationProvider>
  );
}

export default App;
