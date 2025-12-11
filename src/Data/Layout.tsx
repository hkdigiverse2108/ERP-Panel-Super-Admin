// import CalendarMonthRoundedIcon from "@mui/icons-material/CalendarMonthRounded";
// import FormatListBulletedRoundedIcon from "@mui/icons-material/FormatListBulletedRounded";
// import PersonRoundedIcon from "@mui/icons-material/PersonRounded";
import SettingsIcon from '@mui/icons-material/Settings';
// import TableChartRoundedIcon from "@mui/icons-material/TableChartRounded";
import GridViewRoundedIcon from '@mui/icons-material/GridViewRounded';
import { PAGE_TITLE, ROUTES } from "../Constants";
import type { NavItem } from "../Types";
export const NavItems: NavItem[] = [
  { icon: <GridViewRoundedIcon />, name: PAGE_TITLE.DASHBOARD, path: ROUTES.DASHBOARD },
  // { icon: <DescriptionRoundedIcon />, name: "Contact", path: ROUTES.CONTACT.BASE },
  // { icon: <DashboardRoundedIcon />, name: "Employee", path: ROUTES.EMPLOYEE.BASE },
  // { icon: <DashboardRoundedIcon />, name: "Inventory", path: ROUTES.EMPLOYEE.BASE },
  // {
  //   icon: <CalendarMonthRoundedIcon />,
  //   name: "Calendar",
  //   path: "/calendar",
  // },
  // {
  //   icon: <PersonRoundedIcon />,
  //   name: "User Profile",
  //   path: "/profile",
  // },
  // {
  //   name: "Forms",
  //   icon: <FormatListBulletedRoundedIcon />,
  //   subItems: [{ name: "Form Elements", path: "/form-elements", pro: false }],
  // },
  // {
  //   name: "Tables",
  //   icon: <TableChartRoundedIcon />,
  //   subItems: [{ name: "Basic Tables", path: "/basic-tables", pro: false }],
  // },
  {
    name: PAGE_TITLE.SETTINGS.BASE,
    icon: <SettingsIcon  />,
    subItems: [
      { name: PAGE_TITLE.SETTINGS.GENERAL, path: ROUTES.SETTINGS.GENERAL, pro: false },
    ],
  },
];
