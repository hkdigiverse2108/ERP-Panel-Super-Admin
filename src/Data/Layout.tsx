import { PAGE_TITLE, ROUTES } from "../Constants";
import type { NavItem } from "../Types";
import { AdminPanelSettings, Apartment, GridViewRounded, MyLocation, People, ReceiptLong, Settings, AccountTree, ViewModule, Work, PersonRounded } from "@mui/icons-material";

export const NavItems: NavItem[] = [
  { icon: <GridViewRounded />, name: PAGE_TITLE.DASHBOARD, path: ROUTES.DASHBOARD },
  { icon: <People />, name: PAGE_TITLE.USER.BASE, path: ROUTES.USER.BASE },
    { icon: <PersonRounded />, name: PAGE_TITLE.CONTACT.BASE, path: ROUTES.CONTACT.BASE },

  { icon: <Apartment />, name: PAGE_TITLE.COMPANY.BASE, path: ROUTES.COMPANY.BASE },
  { icon: <AccountTree />, name: PAGE_TITLE.BRANCH.BASE, path: ROUTES.BRANCH.BASE },
  { icon: <MyLocation />, name: PAGE_TITLE.LOCATION.BASE, path: ROUTES.LOCATION.BASE },
  { icon: <AdminPanelSettings />, name: PAGE_TITLE.ROLE.BASE, path: ROUTES.ROLE.BASE },
  { icon: <ViewModule />, name: PAGE_TITLE.MODULE.BASE, path: ROUTES.MODULE.BASE },
  {
    name: PAGE_TITLE.INVENTORY.BASE,
    icon: <Settings />,
    children: [
      { name: PAGE_TITLE.INVENTORY.PRODUCT.BASE, path: ROUTES.PRODUCT.BASE, pro: false },
      { name: PAGE_TITLE.INVENTORY.BRAND.BASE, path: ROUTES.BRAND.BASE, pro: false },
      { name: PAGE_TITLE.INVENTORY.CATEGORY.BASE, path: ROUTES.CATEGORY.BASE, pro: false },
      { name: PAGE_TITLE.INVENTORY.UOM.BASE, path: ROUTES.UOM.BASE, pro: false },
      { name: PAGE_TITLE.INVENTORY.TAX.BASE, path: ROUTES.TAX.BASE, pro: false },
      { name: PAGE_TITLE.INVENTORY.MATERIAL_CONSUMPTION.BASE, path: ROUTES.MATERIAL_CONSUMPTION.BASE, pro: false },
    ],
  },
  {
    name: PAGE_TITLE.ACCOUNTING.BASE,
    icon: <ReceiptLong />,
    children: [
      { name: PAGE_TITLE.ACCOUNT_GROUP.BASE, path: ROUTES.ACCOUNT_GROUP.BASE },
      { name: PAGE_TITLE.ACCOUNT.BASE, path: ROUTES.ACCOUNT.BASE },
      { name: PAGE_TITLE.DEBIT_NOTE.BASE, path: ROUTES.DEBIT_NOTE.BASE },
      { name: PAGE_TITLE.CREDIT_NOTE.BASE, path: ROUTES.CREDIT_NOTE.BASE },
    ],
  },
  {
    name: PAGE_TITLE.PURCHASE.BASE,
    icon: <Work />,
    children: [
      { name: PAGE_TITLE.PURCHASE_ORDER.BASE, path: ROUTES.PURCHASE_ORDER.BASE },
      { name: PAGE_TITLE.SUPPLIER_BILL.BASE, path: ROUTES.SUPPLIER_BILL.BASE },
    ],
  },
  {
    name: PAGE_TITLE.SETTINGS.BASE,
    icon: <Settings />,
    children: [
      { name: PAGE_TITLE.SETTINGS.ADDITIONAL_CHARGES.BASE, path: ROUTES.ADDITIONAL_CHARGES.BASE }, ], // Settings
  },
  
];
