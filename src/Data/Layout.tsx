import { PAGE_TITLE, ROUTES } from "../Constants";
import type { NavItem } from "../Types";
import { AdminPanelSettings, Apartment, GridViewRounded, MyLocation, People, ReceiptLong, Settings, AccountTree, ViewModule, Work, PersonRounded, AccountBalance, Redeem, PointOfSale, Announcement, SupportAgent, ShoppingCart } from "@mui/icons-material";

export const NavItems: NavItem[] = [
  { icon: <GridViewRounded />, name: PAGE_TITLE.DASHBOARD, path: ROUTES.DASHBOARD },
  { icon: <People />, name: PAGE_TITLE.USER.BASE, path: ROUTES.USER.BASE },
  { icon: <PersonRounded />, name: PAGE_TITLE.CONTACT.BASE, path: ROUTES.CONTACTS.BASE },

  { icon: <Apartment />, name: PAGE_TITLE.COMPANY.BASE, path: ROUTES.COMPANY.BASE },
  { icon: <AccountTree />, name: PAGE_TITLE.BRANCH.BASE, path: ROUTES.BRANCH.BASE },
  { icon: <MyLocation />, name: PAGE_TITLE.LOCATION.BASE, path: ROUTES.LOCATION.BASE },
  { icon: <AdminPanelSettings />, name: PAGE_TITLE.ROLE.BASE, path: ROUTES.ROLE.BASE },
  { icon: <ViewModule />, name: PAGE_TITLE.MODULE.BASE, path: ROUTES.MODULE.BASE },
  { icon: <Announcement />, name: PAGE_TITLE.ANNOUNCEMENT.BASE, path: ROUTES.ANNOUNCEMENT.BASE },
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
      { name: PAGE_TITLE.INVENTORY.RECIPE.BASE, path: ROUTES.RECIPE.BASE, pro: false },
      { name: PAGE_TITLE.INVENTORY.STOCK.BASE, path: ROUTES.STOCK.BASE, pro: false },
      { name: PAGE_TITLE.INVENTORY.STOCK_VERIFICATION.BASE, path: ROUTES.STOCK_VERIFICATION.BASE, pro: false },
      { name: PAGE_TITLE.INVENTORY.BILL_OF_LIVE_PRODUCT.BASE, path: ROUTES.BILL_OF_LIVE_PRODUCT.BASE, pro: false },
      { name: PAGE_TITLE.INVENTORY.PRODUCT_TYPE.BASE, path: ROUTES.PRODUCT_TYPE.BASE },
      { name: PAGE_TITLE.INVENTORY.SPECIALS.BASE, path: ROUTES.SPECIALS.BASE },
      { name: PAGE_TITLE.INVENTORY.STOCK_TRANSFER.BASE, path: ROUTES.STOCK_TRANSFER.BASE },
    ],
  },
  {
    name: PAGE_TITLE.BANK_CASH.BASE,
    icon: <AccountBalance />,
    children: [
      { name: PAGE_TITLE.BANK.BASE, path: ROUTES.BANK.BASE },
      { name: PAGE_TITLE.PAYMENT.BASE, path: ROUTES.PAYMENT.BASE },
      { name: PAGE_TITLE.RECEIPT.BASE, path: ROUTES.RECEIPT.BASE },
      { name: PAGE_TITLE.EXPENSE.BASE, path: ROUTES.EXPENSE.BASE },
      { name: PAGE_TITLE.SALARY.BASE, path: ROUTES.SALARY.BASE },
      { name: PAGE_TITLE.BANK_TRANSACTION.BASE, path: ROUTES.BANK_TRANSACTION.BASE },
    ],
  },
  {
    name: PAGE_TITLE.SUPPORT.BASE,
    icon: <SupportAgent />,
    children: [{ name: PAGE_TITLE.CALL_REQUEST.BASE, path: ROUTES.CALL_REQUEST.BASE }],
  },
  {
    name: PAGE_TITLE.POS.BASE,
    icon: <PointOfSale />,
    children: [
      { name: PAGE_TITLE.POS.SALES_REGISTER, path: ROUTES.SALES_REGISTER.BASE, pro: false },
      { name: PAGE_TITLE.POS.CREDIT_NOTE, path: ROUTES.POS_CREDIT_NOTE.BASE, pro: false },
      { name: PAGE_TITLE.POS.ORDER_LIST, path: ROUTES.POS_ORDER_LIST.BASE, pro: false },
    ],
  },
  {
    name: PAGE_TITLE.CRM.BASE,
    icon: <Redeem />,
    children: [
      { name: PAGE_TITLE.CRM.COUPON.BASE, path: ROUTES.COUPON.BASE },
      { name: PAGE_TITLE.CRM.LOYALTY.BASE, path: ROUTES.LOYALTY.BASE },
      { name: PAGE_TITLE.CRM.DISCOUNT.BASE, path: ROUTES.DISCOUNT.BASE },
    ],
  },
  {
    name: PAGE_TITLE.ACCOUNTING.BASE,
    icon: <ReceiptLong />,
    children: [
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
      { name: PAGE_TITLE.PURCHASE_DEBIT_NOTE.BASE, path: ROUTES.PURCHASE_DEBIT_NOTE.BASE },
    ],
  },
  {
    name: PAGE_TITLE.SALES.BASE,
    icon: <ShoppingCart />,
    children: [
      { name: PAGE_TITLE.ESTIMATE.BASE, path: ROUTES.ESTIMATE.BASE },
      { name: PAGE_TITLE.SALES_ORDER.BASE, path: ROUTES.SALES_ORDER.BASE },
      { name: PAGE_TITLE.INVOICE.BASE, path: ROUTES.INVOICE.BASE },
      { name: PAGE_TITLE.DELIVERY_CHALLAN.BASE, path: ROUTES.DELIVERY_CHALLAN.BASE },
      { name: PAGE_TITLE.SALES_CREDIT_NOTE.BASE, path: ROUTES.SALES_CREDIT_NOTE.BASE },
    ],
  },
  {
    name: PAGE_TITLE.SETTINGS.BASE,
    icon: <Settings />,
    children: [
      { name: PAGE_TITLE.SETTINGS.ADDITIONAL_CHARGES.BASE, path: ROUTES.ADDITIONAL_CHARGES.BASE },
      { name: PAGE_TITLE.SETTINGS.PROFILE.BASE, path: ROUTES.PROFILE.BASE },
      { name: PAGE_TITLE.SETTINGS.ADMIN_SETTING.BASE, path: ROUTES.ADMIN_SETTING.BASE },
      { name: PAGE_TITLE.SETTINGS.REPORT_FORMAT.BASE, path: ROUTES.REPORT_FORMAT.BASE },
      { name: PAGE_TITLE.SETTINGS.PREFIX.BASE, path: ROUTES.PREFIX.BASE },
      { name: PAGE_TITLE.SETTINGS.CONSUMPTION_TYPE.BASE, path: ROUTES.CONSUMPTION_TYPE.BASE },
      { name: PAGE_TITLE.SETTINGS.PAYMENT_TERMS.BASE, path: ROUTES.PAYMENT_TERMS.BASE },
      { name: PAGE_TITLE.CREDENTIALS.BASE, path: ROUTES.CREDENTIALS.BASE },
      { name: PAGE_TITLE.BILLSNAP.BASE, path: ROUTES.BILLSNAP.BASE },
      { name: PAGE_TITLE.WHATSAPP.BASE, path: ROUTES.WHATSAPP.BASE },
    ],
  },
];
