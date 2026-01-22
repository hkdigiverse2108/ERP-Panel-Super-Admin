import { PAGE_TITLE, ROUTES } from "../Constants";
import type { NavItem } from "../Types";
import { AdminPanelSettings, Apartment, GridViewRounded, MyLocation, People, ReceiptLong, Settings, AccountTree, ViewModule } from "@mui/icons-material";

export const NavItems: NavItem[] = [
  { icon: <GridViewRounded />, name: PAGE_TITLE.DASHBOARD, path: ROUTES.DASHBOARD },
  { icon: <People />, name: PAGE_TITLE.USER.BASE, path: ROUTES.USER.BASE },
  { icon: <Apartment />, name: PAGE_TITLE.COMPANY.BASE, path: ROUTES.COMPANY.BASE },
  { icon: <AccountTree />, name: PAGE_TITLE.BRANCH.BASE, path: ROUTES.BRANCH.BASE },
  { icon: <MyLocation />, name: PAGE_TITLE.LOCATION.BASE, path: ROUTES.LOCATION.BASE },
  { icon: <AdminPanelSettings />, name: PAGE_TITLE.ROLE.BASE, path: ROUTES.ROLE.BASE },
  { icon: <ViewModule />, name: PAGE_TITLE.MODULE.BASE, path: ROUTES.MODULE.BASE },
  {
    name: PAGE_TITLE.INVENTORY.BASE,
    icon: <Settings />,
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
    icon: <ReceiptLong />,
    subItems: [
      { name: PAGE_TITLE.ACCOUNT_GROUP.BASE, path: ROUTES.ACCOUNT_GROUP.BASE },
      { name: PAGE_TITLE.ACCOUNT.BASE, path: ROUTES.ACCOUNT.BASE },
    ],
  },
];
