import { ThemeProvider } from "@mui/material/styles";
import { RouterProvider } from "react-router-dom";
import { Router } from "./Routers";
import { useAppSelector } from "./Store/hooks";
import { getTheme } from "./Theme";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";

function App() {
  const { isToggleTheme } = useAppSelector((state) => state.layout);
  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <ThemeProvider theme={getTheme(isToggleTheme === "light" ? "light" : "dark")}>
        <RouterProvider router={Router} />
      </ThemeProvider>
    </LocalizationProvider>
  );
}

export default App;
