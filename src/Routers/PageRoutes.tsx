import { Navigate } from "react-router-dom";
import { ROUTES } from "../Constants";
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

export const PageRoutes = [
  { path: ROUTES.HOME, element: <Dashboard /> },

  { path: ROUTES.DASHBOARD, element: <Dashboard /> },

  { path: ROUTES.USER.BASE, element: <Users /> },
  { path: ROUTES.USER.ADD_EDIT, element: <UserForm /> },

  { path: ROUTES.COMPANY.BASE, element: <Company /> },
  { path: ROUTES.COMPANY.ADD_EDIT, element: <CompanyForm /> },

  { path: ROUTES.BRANCH.BASE, element: <Branch /> },
  { path: ROUTES.BRANCH.ADD_EDIT, element: <BranchForm /> },

  { path: ROUTES.LOCATION.BASE, element: <Location /> },
  { path: ROUTES.LOCATION.ADD_EDIT, element: <LocationForm /> },
  
  { path: ROUTES.PRODUCT.BASE, element: <Product /> },
  { path: ROUTES.PRODUCT.ADD_EDIT, element: <ProductForm /> },
  { path: ROUTES.PRODUCT.ITEM_ADD_EDIT, element: <ItemForm /> },
  
  { path: ROUTES.BRAND.BASE, element: <Brand /> },
  
  { path: ROUTES.UOM.BASE, element: <Uom /> },

  { path: ROUTES.TAX.BASE, element: <Tax /> },
  
  { path: ROUTES.CATEGORY.BASE, element: <Category /> },

  { path: ROUTES.ACCOUNT_GROUP.BASE, element: <AccountGroup /> },
  { path: ROUTES.ACCOUNT_GROUP.TREE, element: <AccountGroupTree /> },
  { path: ROUTES.ACCOUNT.BASE, element: <Account /> },
];

export const AuthRoutes = [
  { path: ROUTES.HOME, element: <Navigate to={ROUTES.AUTH.SIGNIN} replace /> },
  { path: ROUTES.AUTH.SIGNIN, element: <SignInForm /> },
];
