import GridViewRoundedIcon from "@mui/icons-material/GridViewRounded";
import PeopleIcon from "@mui/icons-material/People";
import SettingsIcon from "@mui/icons-material/Settings";
import { PAGE_TITLE, ROUTES } from "../Constants";
import type { NavItem } from "../Types";

export const NavItems: NavItem[] = [
  { icon: <GridViewRoundedIcon />, name: PAGE_TITLE.DASHBOARD, path: ROUTES.DASHBOARD },
  { icon: <PeopleIcon />, name: PAGE_TITLE.USER.BASE, path: ROUTES.USER.BASE },
  { icon: <GridViewRoundedIcon />, name: PAGE_TITLE.BRANCH.BASE, path: ROUTES.BRANCH.BASE },
  {
    name: PAGE_TITLE.INVENTORY.BASE,
    icon: <SettingsIcon />,
    subItems: [
      { name: PAGE_TITLE.INVENTORY.PRODUCT.BASE, path: ROUTES.PRODUCT.BASE, pro: false },
      { name: PAGE_TITLE.INVENTORY.BRAND.BASE, path: ROUTES.BRAND.BASE, pro: false },
      { name: PAGE_TITLE.INVENTORY.CATEGORY.BASE, path: ROUTES.CATEGORY.BASE, pro: false },
      { name: PAGE_TITLE.INVENTORY.UOM.BASE, path: ROUTES.UOM.BASE, pro: false },
      { name: PAGE_TITLE.INVENTORY.TAX.BASE, path: ROUTES.TAX.BASE, pro: false },
    ],
  },
];
