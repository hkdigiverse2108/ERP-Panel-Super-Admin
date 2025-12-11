import { ROUTES } from "../Constants";
import SignInForm from "../Pages/Auth/SigninForm";
import Dashboard from "../Pages/Dashboard";
import GeneralSetting from "../Pages/Settings/General/Index";

export const PageRoutes = [
  { path: ROUTES.HOME, element: <Dashboard /> },
  { path: ROUTES.DASHBOARD, element: <Dashboard /> },
  { path: ROUTES.SETTINGS.GENERAL, element: <GeneralSetting /> },
];

export const AuthRoutes = [
  { path: ROUTES.AUTH.SIGNIN, element: <SignInForm /> },
];
