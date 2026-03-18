import { Navigate } from "react-router-dom";
import { PAGE_TITLE, ROUTES } from "../Constants";
import AccessDenied from "../Pages/AccessDenied";
import CreditNote from "../Pages/Accounting/CreditNote";
import CreditNoteForm from "../Pages/Accounting/CreditNote/CreditNoteForm";
import DebitNote from "../Pages/Accounting/DebitNote";
import DebitNoteForm from "../Pages/Accounting/DebitNote/DebitNoteForm";
import SignInForm from "../Pages/Auth/SignInForm";
import Bank from "../Pages/Bank/Bank";
import BankForm from "../Pages/Bank/Bank/BankForm";
import Branch from "../Pages/Branch";
import BranchForm from "../Pages/Branch/BranchForm";
import Company from "../Pages/Company";
import CompanyForm from "../Pages/Company/CompanyForm";
import Contact from "../Pages/Contacts";
import ContactForm from "../Pages/Contacts/ContactForm";
import Coupon from "../Pages/CRM/Coupon";
import CouponForm from "../Pages/CRM/Coupon/CouponForm";
import Loyalty from "../Pages/CRM/Loyalty";
import LoyaltyForm from "../Pages/CRM/Loyalty/LoyaltyForm";
import Dashboard from "../Pages/Dashboard";
import BillOfLiveProduct from "../Pages/Inventory/BillOfLiveProduct";
import BillOfLiveProductForm from "../Pages/Inventory/BillOfLiveProduct/BillOfLiveProductForm";
import Brand from "../Pages/Inventory/Brand";
import Category from "../Pages/Inventory/Category";
import MaterialConsumption from "../Pages/Inventory/MaterialConsumption";
import MaterialConsumptionForm from "../Pages/Inventory/MaterialConsumption/MaterialConsumptionForm";
import Product from "../Pages/Inventory/Product";
import ItemForm from "../Pages/Inventory/Product/ItemForm";
import ProductForm from "../Pages/Inventory/Product/ProductForm";
import Recipe from "../Pages/Inventory/Recipe";
import RecipeForm from "../Pages/Inventory/Recipe/RecipeForm";
import Stock from "../Pages/Inventory/Stock";
import StockVerification from "../Pages/Inventory/StockVerification";
import StockVerificationForm from "../Pages/Inventory/StockVerification/StockVerificationForm";
import Tax from "../Pages/Inventory/Tax";
import Uom from "../Pages/Inventory/Uom";
import Location from "../Pages/Location";
import LocationForm from "../Pages/Location/LocationForm";
import Module from "../Pages/Module";
import ModuleForm from "../Pages/Module/ModuleForm";
import NotFound from "../Pages/NotFound";
import PurchaseOrder from "../Pages/Purchase/PurchaseOrder";
import PurchaseOrderForm from "../Pages/Purchase/PurchaseOrder/PurchaseOrderForm";
import SupplierBill from "../Pages/Purchase/SupplierBill";
import SupplierBillForm from "../Pages/Purchase/SupplierBill/SupplierBillForm";
import PurchaseDebitNote from "../Pages/Purchase/PurchaseDebitNote";
import PurchaseDebitNoteForm from "../Pages/Purchase/PurchaseDebitNote/PurchaseDebitNoteForm";
import Role from "../Pages/Role";
import AdditionalCharges from "../Pages/Settings/AdditionalCharges";
import AdditionalChargesForm from "../Pages/Settings/AdditionalCharges/AdditionalChargesForm";
import Users from "../Pages/User";
import Permission from "../Pages/User/Permission";
import UserForm from "../Pages/User/UserForm";
import Announcement from "../Pages/Announcement";
import AnnouncementForm from "../Pages/Announcement/AnnouncementForm";
import ChangePassword from "../Pages/Auth/ChangePassword";
import VerifyOtp from "../Pages/Auth/VerifyOtp";
import SupportDeskForm from "../Pages/SupportDesk/CallRequest/CallRequestForm";
import AdminSetting from "../Pages/Settings/AdminSetting/AdminSetting";
import BankTransaction from "../Pages/Bank/BankTransaction";
import BankTransactionForm from "../Pages/Bank/BankTransaction/BankTransactionForm";
import SupportDesk from "../Pages/SupportDesk/CallRequest";
import CreditNoteList from "../Pages/Pos/CreditNote";
import OrderList from "../Pages/Pos/OrderList";
import PaymentForm from "../Pages/Bank/Payment/PaymentForm";
import Payment from "../Pages/Bank/Payment";
import PosCreditNote from "../Pages/Pos/CreditNote";
import ProductType from "../Pages/Inventory/ProductType";
import Receipt from "../Pages/Bank/Receipt";
import ReceiptForm from "../Pages/Bank/Receipt/ReceiptForm";
import Expense from "../Pages/Bank/Expense";
import ExpenseForm from "../Pages/Bank/Expense/ExpenseForm";
import SalaryForm from "../Pages/Bank/Salary/SalaryForm";
import Salary from "../Pages/Bank/Salary";
import Estimate from "../Pages/Sales/Estimate";
import EstimateForm from "../Pages/Sales/Estimate/EstimateForm";
import SalesOrder from "../Pages/Sales/SalesOrder";
import SalesOrderForm from "../Pages/Sales/SalesOrder/SalesOrderForm";
import Invoice from "../Pages/Sales/Invoice";
import InvoiceForm from "../Pages/Sales/Invoice/InvoiceForm";
import DeliveryChallan from "../Pages/Sales/DeliveryChallan";
import DeliveryChallanForm from "../Pages/Sales/DeliveryChallan/DeliveryChallanForm";
import SalesCreditNote from "../Pages/Sales/SalesCreditNote";
import SalesCreditNoteForm from "../Pages/Sales/SalesCreditNote/SalesCreditNoteForm";
import SalesRegister from "../Pages/Pos/SalesRegister";
import Profile from "../Pages/Settings/Profile";

export const PageRoutes = [
  { path: ROUTES.HOME, name: PAGE_TITLE.DASHBOARD, element: <Navigate to={ROUTES.DASHBOARD} replace /> },

  { path: ROUTES.DASHBOARD, name: PAGE_TITLE.DASHBOARD, element: <Dashboard /> },

  { path: ROUTES.USER.BASE, name: PAGE_TITLE.USER.BASE, element: <Users /> },
  { path: ROUTES.USER.PERMISSION_ADD_EDIT, name: PAGE_TITLE.USER.BASE, element: <Permission /> },
  { path: ROUTES.USER.ADD_EDIT, name: PAGE_TITLE.USER.BASE, element: <UserForm /> },

  { path: ROUTES.COMPANY.BASE, name: PAGE_TITLE.COMPANY.BASE, element: <Company /> },
  { path: ROUTES.COMPANY.ADD_EDIT, name: PAGE_TITLE.COMPANY.BASE, element: <CompanyForm /> },

  { path: ROUTES.BRANCH.BASE, name: PAGE_TITLE.BRANCH.BASE, element: <Branch /> },
  { path: ROUTES.BRANCH.ADD_EDIT, name: PAGE_TITLE.BRANCH.BASE, element: <BranchForm /> },

  { path: ROUTES.LOCATION.BASE, name: PAGE_TITLE.LOCATION.BASE, element: <Location /> },
  { path: ROUTES.LOCATION.ADD_EDIT, name: PAGE_TITLE.LOCATION.BASE, element: <LocationForm /> },

  { path: ROUTES.PRODUCT.BASE, name: PAGE_TITLE.INVENTORY.PRODUCT.BASE, element: <Product /> },
  { path: ROUTES.PRODUCT.ADD_EDIT, name: PAGE_TITLE.INVENTORY.PRODUCT.BASE, element: <ProductForm /> },
  { path: ROUTES.PRODUCT.ITEM_ADD_EDIT, name: PAGE_TITLE.INVENTORY.STOCK.BASE, element: <ItemForm /> },

  { path: ROUTES.MATERIAL_CONSUMPTION.BASE, name: PAGE_TITLE.INVENTORY.MATERIAL_CONSUMPTION.BASE, element: <MaterialConsumption /> },
  { path: ROUTES.MATERIAL_CONSUMPTION.ADD_EDIT, name: PAGE_TITLE.INVENTORY.MATERIAL_CONSUMPTION.BASE, element: <MaterialConsumptionForm /> },

  { path: ROUTES.BRAND.BASE, name: PAGE_TITLE.INVENTORY.BRAND.BASE, element: <Brand /> },

  { path: ROUTES.UOM.BASE, name: PAGE_TITLE.INVENTORY.UOM.BASE, element: <Uom /> },

  { path: ROUTES.TAX.BASE, name: PAGE_TITLE.INVENTORY.TAX.BASE, element: <Tax /> },

  { path: ROUTES.PRODUCT_TYPE.BASE, name: PAGE_TITLE.INVENTORY.PRODUCT_TYPE.BASE, element: <ProductType /> },

  { path: ROUTES.CATEGORY.BASE, name: PAGE_TITLE.INVENTORY.CATEGORY.BASE, element: <Category /> },

  { path: ROUTES.DEBIT_NOTE.BASE, name: PAGE_TITLE.DEBIT_NOTE.BASE, element: <DebitNote /> },
  { path: ROUTES.DEBIT_NOTE.ADD_EDIT, name: PAGE_TITLE.DEBIT_NOTE.BASE, element: <DebitNoteForm /> },

  { path: ROUTES.CREDIT_NOTE.BASE, name: PAGE_TITLE.CREDIT_NOTE.BASE, element: <CreditNote /> },
  { path: ROUTES.CREDIT_NOTE.ADD_EDIT, name: PAGE_TITLE.CREDIT_NOTE.BASE, element: <CreditNoteForm /> },

  { path: ROUTES.ROLE.BASE, name: PAGE_TITLE.ROLE.BASE, element: <Role /> },

  { path: ROUTES.MODULE.BASE, name: PAGE_TITLE.MODULE.BASE, element: <Module /> },
  { path: ROUTES.MODULE.ADD_EDIT, name: PAGE_TITLE.MODULE.BASE, element: <ModuleForm /> },
  { path: ROUTES.NOT_FOUND, element: <NotFound /> },
  { path: ROUTES.ACCESS_DENIED, element: <AccessDenied /> },

  { path: ROUTES.PURCHASE_ORDER.BASE, name: PAGE_TITLE.PURCHASE.BASE, element: <PurchaseOrder /> },
  { path: ROUTES.PURCHASE_ORDER.ADD_EDIT, name: PAGE_TITLE.PURCHASE.BASE, element: <PurchaseOrderForm /> },

  { path: ROUTES.SUPPLIER_BILL.BASE, name: PAGE_TITLE.PURCHASE.BASE, element: <SupplierBill /> },
  { path: ROUTES.SUPPLIER_BILL.ADD_EDIT, name: PAGE_TITLE.PURCHASE.BASE, element: <SupplierBillForm /> },
  { path: ROUTES.PURCHASE_DEBIT_NOTE.BASE, name: PAGE_TITLE.PURCHASE.BASE, element: <PurchaseDebitNote /> },
  { path: ROUTES.PURCHASE_DEBIT_NOTE.ADD_EDIT, name: PAGE_TITLE.PURCHASE.BASE, element: <PurchaseDebitNoteForm /> },

  { path: ROUTES.ADDITIONAL_CHARGES.BASE, name: PAGE_TITLE.SETTINGS.ADDITIONAL_CHARGES.BASE, element: <AdditionalCharges /> },
  { path: ROUTES.ADDITIONAL_CHARGES.ADD_EDIT, name: PAGE_TITLE.SETTINGS.ADDITIONAL_CHARGES.BASE, element: <AdditionalChargesForm /> },

  { path: ROUTES.CONTACTS.BASE, name: PAGE_TITLE.CONTACT.BASE, element: <Contact /> },
  { path: ROUTES.CONTACTS.ADD_EDIT, name: PAGE_TITLE.CONTACT.BASE, element: <ContactForm /> },
  { path: ROUTES.RECIPE.BASE, name: PAGE_TITLE.INVENTORY.RECIPE.BASE, element: <Recipe /> },
  { path: ROUTES.RECIPE.ADD_EDIT, name: PAGE_TITLE.INVENTORY.RECIPE.BASE, element: <RecipeForm /> },

  { path: ROUTES.STOCK.BASE, name: PAGE_TITLE.INVENTORY.STOCK.BASE, element: <Stock /> },

  { path: ROUTES.STOCK_VERIFICATION.BASE, name: PAGE_TITLE.INVENTORY.STOCK_VERIFICATION.BASE, element: <StockVerification /> },
  { path: ROUTES.STOCK_VERIFICATION.ADD_EDIT, name: PAGE_TITLE.INVENTORY.STOCK_VERIFICATION.BASE, element: <StockVerificationForm /> },

  { path: ROUTES.BILL_OF_LIVE_PRODUCT.BASE, name: PAGE_TITLE.INVENTORY.BILL_OF_LIVE_PRODUCT.BASE, element: <BillOfLiveProduct /> },
  { path: ROUTES.BILL_OF_LIVE_PRODUCT.ADD_EDIT, name: PAGE_TITLE.INVENTORY.BILL_OF_LIVE_PRODUCT.BASE, element: <BillOfLiveProductForm /> },
  { path: ROUTES.BANK.BASE, name: PAGE_TITLE.BANK.BASE, element: <Bank /> },
  { path: ROUTES.BANK.ADD_EDIT, name: PAGE_TITLE.BANK.BASE, element: <BankForm /> },

  { path: ROUTES.COUPON.BASE, name: PAGE_TITLE.CRM.COUPON.BASE, element: <Coupon /> },
  { path: ROUTES.COUPON.ADD_EDIT, name: PAGE_TITLE.CRM.COUPON.BASE, element: <CouponForm /> },

  { path: ROUTES.LOYALTY.BASE, name: PAGE_TITLE.CRM.LOYALTY.BASE, element: <Loyalty /> },
  { path: ROUTES.LOYALTY.ADD_EDIT, name: PAGE_TITLE.CRM.LOYALTY.BASE, element: <LoyaltyForm /> },

  { path: ROUTES.PROFILE.BASE, name: PAGE_TITLE.SETTINGS.PROFILE.BASE, element: <Profile /> },

  { path: ROUTES.POS_CREDIT_NOTE.BASE, name: PAGE_TITLE.POS.CREDIT_NOTE, element: <PosCreditNote /> },
  { path: ROUTES.POS_CREDIT_NOTE.BASE, name: PAGE_TITLE.POS.CREDIT_NOTE, element: <CreditNoteList /> },

  { path: ROUTES.ANNOUNCEMENT.BASE, name: PAGE_TITLE.ANNOUNCEMENT.BASE, element: <Announcement /> },
  { path: ROUTES.ANNOUNCEMENT.ADD_EDIT, name: PAGE_TITLE.ANNOUNCEMENT.BASE, element: <AnnouncementForm /> },

  { path: ROUTES.CALL_REQUEST.BASE, name: PAGE_TITLE.CALL_REQUEST.BASE, element: <SupportDesk /> },
  { path: ROUTES.CALL_REQUEST.ADD_EDIT, name: PAGE_TITLE.CALL_REQUEST.BASE, element: <SupportDeskForm /> },

  { path: ROUTES.AUTH.CHANGE_PASSWORD, name: PAGE_TITLE.CHANGE_PASSWORD.BASE, element: <ChangePassword /> },

  { path: ROUTES.CALL_REQUEST.BASE, name: PAGE_TITLE.CALL_REQUEST.BASE, element: <SupportDesk /> },
  { path: ROUTES.CALL_REQUEST.ADD_EDIT, name: PAGE_TITLE.CALL_REQUEST.BASE, element: <SupportDeskForm /> },

  { path: ROUTES.BANK_TRANSACTION.BASE, name: PAGE_TITLE.BANK_TRANSACTION.BASE, element: <BankTransaction /> },
  { path: ROUTES.BANK_TRANSACTION.ADD_EDIT, name: PAGE_TITLE.BANK_TRANSACTION.BASE, element: <BankTransactionForm /> },

  { path: ROUTES.ADMIN_SETTING.BASE, name: PAGE_TITLE.SETTINGS.ADMIN_SETTING.BASE, element: <AdminSetting /> },

  { path: ROUTES.SALES_REGISTER.BASE, name: PAGE_TITLE.POS.SALES_REGISTER, element: <SalesRegister /> },
  { path: ROUTES.POS_CREDIT_NOTE.BASE, name: PAGE_TITLE.POS.CREDIT_NOTE, element: <CreditNoteList /> },
  { path: ROUTES.POS_ORDER_LIST.BASE, name: PAGE_TITLE.POS.ORDER_LIST, element: <OrderList /> },

  { path: ROUTES.POS_ORDER_LIST.BASE, name: PAGE_TITLE.POS.ORDER_LIST, element: <OrderList /> },

  { path: ROUTES.PAYMENT.BASE, name: PAGE_TITLE.PAYMENT.BASE, element: <Payment /> },
  { path: ROUTES.PAYMENT.ADD_EDIT, name: PAGE_TITLE.PAYMENT.BASE, element: <PaymentForm /> },

  { path: ROUTES.RECEIPT.BASE, name: PAGE_TITLE.RECEIPT.BASE, element: <Receipt /> },
  { path: ROUTES.RECEIPT.ADD_EDIT, name: PAGE_TITLE.RECEIPT.BASE, element: <ReceiptForm /> },

  { path: ROUTES.EXPENSE.BASE, name: PAGE_TITLE.EXPENSE.BASE, element: <Expense /> },
  { path: ROUTES.EXPENSE.ADD_EDIT, name: PAGE_TITLE.EXPENSE.BASE, element: <ExpenseForm /> },

  { path: ROUTES.SALARY.BASE, name: PAGE_TITLE.SALARY.BASE, element: <Salary /> },
  { path: ROUTES.SALARY.ADD_EDIT, name: PAGE_TITLE.SALARY.BASE, element: <SalaryForm /> },

  { path: ROUTES.ESTIMATE.BASE, name: PAGE_TITLE.ESTIMATE.BASE, element: <Estimate /> },
  { path: ROUTES.ESTIMATE.ADD_EDIT, name: PAGE_TITLE.ESTIMATE.BASE, element: <EstimateForm /> },

  { path: ROUTES.SALES_ORDER.BASE, name: PAGE_TITLE.SALES_ORDER.BASE, element: <SalesOrder /> },
  { path: ROUTES.SALES_ORDER.ADD_EDIT, name: PAGE_TITLE.SALES_ORDER.BASE, element: <SalesOrderForm /> },
  
  { path: ROUTES.INVOICE.BASE, name: PAGE_TITLE.INVOICE.BASE, element: <Invoice /> },
  { path: ROUTES.INVOICE.ADD_EDIT, name: PAGE_TITLE.INVOICE.BASE, element: <InvoiceForm /> },

  { path: ROUTES.DELIVERY_CHALLAN.BASE, name: PAGE_TITLE.DELIVERY_CHALLAN.BASE, element: <DeliveryChallan /> },
  { path: ROUTES.DELIVERY_CHALLAN.ADD_EDIT, name: PAGE_TITLE.DELIVERY_CHALLAN.BASE, element: <DeliveryChallanForm /> },

  { path: ROUTES.SALES_CREDIT_NOTE.BASE, name: PAGE_TITLE.SALES_CREDIT_NOTE.BASE, element: <SalesCreditNote /> },
  { path: ROUTES.SALES_CREDIT_NOTE.ADD_EDIT, name: PAGE_TITLE.SALES_CREDIT_NOTE.BASE, element: <SalesCreditNoteForm /> },
];

export const AuthRoutes = [
  { path: ROUTES.HOME, element: <Navigate to={ROUTES.AUTH.SIGNIN} replace /> },
  { path: ROUTES.AUTH.SIGNIN, element: <SignInForm /> },
  { path: ROUTES.AUTH.VERIFY_OTP, element: <VerifyOtp /> },
];
