import ApartmentIcon from '@mui/icons-material/Apartment';
import GridViewRoundedIcon from "@mui/icons-material/GridViewRounded";
import MyLocationIcon from '@mui/icons-material/MyLocation';
import PeopleIcon from "@mui/icons-material/People";
import ReceiptLongIcon from "@mui/icons-material/ReceiptLong";
import SettingsIcon from "@mui/icons-material/Settings";
import { PAGE_TITLE, ROUTES } from "../Constants";
import type { NavItem } from "../Types";

export const NavItems: NavItem[] = [
  { icon: <GridViewRoundedIcon />, name: PAGE_TITLE.DASHBOARD, path: ROUTES.DASHBOARD },
  { icon: <PeopleIcon />, name: PAGE_TITLE.USER.BASE, path: ROUTES.USER.BASE },
  { icon: <ApartmentIcon />, name: PAGE_TITLE.COMPANY.BASE, path: ROUTES.COMPANY.BASE },
  { icon: <GridViewRoundedIcon />, name: PAGE_TITLE.BRANCH.BASE, path: ROUTES.BRANCH.BASE },
  { icon: <MyLocationIcon />, name: PAGE_TITLE.LOCATION.BASE, path: ROUTES.LOCATION.BASE },
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
  {
    name: PAGE_TITLE.ACCOUNTING.BASE,
    icon: <ReceiptLongIcon />,
    subItems: [
      { name: PAGE_TITLE.ACCOUNT_GROUP.BASE, path: ROUTES.ACCOUNT_GROUP.BASE},
      { name: PAGE_TITLE.ACCOUNT.BASE, path: ROUTES.ACCOUNT.BASE},
    ],
  },
];
