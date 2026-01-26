import { Navigate } from "react-router-dom";
import { PAGE_TITLE, ROUTES } from "../Constants";
import AccountGroup from "../Pages/Accounting/AccountGroup";
import AccountGroupTree from "../Pages/Accounting/AccountGroup/AccountGroupTree";
import Account from "../Pages/Accounting/Account";
import SignInForm from "../Pages/Auth/SignInForm";
import Branch from "../Pages/Branch";
import BranchForm from "../Pages/Branch/BranchForm";
import Company from "../Pages/Company";
import CompanyForm from "../Pages/Company/CompanyForm";
import Dashboard from "../Pages/Dashboard";
import Brand from "../Pages/Inventory/Brand";
import Category from "../Pages/Inventory/Category";
import Product from "../Pages/Inventory/Product";
import ItemForm from "../Pages/Inventory/Product/ItemForm";
import ProductForm from "../Pages/Inventory/Product/ProductForm";
import Tax from "../Pages/Inventory/Tax";
import Uom from "../Pages/Inventory/Uom";
import Location from "../Pages/Location";
import LocationForm from "../Pages/Location/LocationForm";
import Users from "../Pages/User";
import UserForm from "../Pages/User/UserForm";
import Role from "../Pages/Role";
import Module from "../Pages/Module";
import ModuleForm from "../Pages/Module/ModuleForm";
import Permission from "../Pages/User/Permission";
import NotFound from "../Pages/NotFound";
import AccessDenied from "../Pages/AccessDenied";

export const PageRoutes = [
  { path: ROUTES.HOME, name: PAGE_TITLE.DASHBOARD, element: <Navigate to={ROUTES.DASHBOARD} replace /> },

  { path: ROUTES.DASHBOARD , name: PAGE_TITLE.DASHBOARD, element: <Dashboard /> },

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
  { path: ROUTES.PRODUCT.ITEM_ADD_EDIT, name: PAGE_TITLE.INVENTORY.PRODUCT.ITEM.BASE, element: <ItemForm /> },

  { path: ROUTES.BRAND.BASE, name: PAGE_TITLE.INVENTORY.BRAND.BASE, element: <Brand /> },

  { path: ROUTES.UOM.BASE, name: PAGE_TITLE.INVENTORY.UOM.BASE, element: <Uom /> },

  { path: ROUTES.TAX.BASE, name: PAGE_TITLE.INVENTORY.TAX.BASE, element: <Tax /> },

  { path: ROUTES.CATEGORY.BASE, name: PAGE_TITLE.INVENTORY.CATEGORY.BASE, element: <Category /> },

  { path: ROUTES.ACCOUNT_GROUP.BASE, name: PAGE_TITLE.ACCOUNT_GROUP.BASE, element: <AccountGroup /> },
  { path: ROUTES.ACCOUNT_GROUP.TREE, name: PAGE_TITLE.ACCOUNT_GROUP.BASE, element: <AccountGroupTree /> },

  { path: ROUTES.ACCOUNT.BASE, name: PAGE_TITLE.ACCOUNT.BASE, element: <Account /> },

  { path: ROUTES.ROLE.BASE, name: PAGE_TITLE.ROLE.BASE, element: <Role /> },

  { path: ROUTES.MODULE.BASE, name: PAGE_TITLE.MODULE.BASE, element: <Module /> },
  { path: ROUTES.MODULE.ADD_EDIT, name: PAGE_TITLE.MODULE.BASE, element: <ModuleForm /> },
  { path: ROUTES.NOT_FOUND, element: <NotFound /> },
  { path: ROUTES.ACCESS_DENIED, element: <AccessDenied /> }
];

export const AuthRoutes = [
  { path: ROUTES.HOME, element: <Navigate to={ROUTES.AUTH.SIGNIN} replace /> },
  { path: ROUTES.AUTH.SIGNIN, element: <SignInForm /> },
];
