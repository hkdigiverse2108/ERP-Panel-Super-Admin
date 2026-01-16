import { Navigate } from "react-router-dom";
import { ROUTES } from "../Constants";
import SignInForm from "../Pages/Auth/SignInForm";
import Branch from "../Pages/Branch";
import BranchForm from "../Pages/Branch/BranchForm";
import Dashboard from "../Pages/Dashboard";
import Brand from "../Pages/Inventory/Brand";
import Category from "../Pages/Inventory/Category";
import Product from "../Pages/Inventory/Product";
import ProductForm from "../Pages/Inventory/Product/ProductForm";
import Users from "../Pages/User";
import UserForm from "../Pages/User/UserForm";
import Uom from "../Pages/Inventory/Uom";
import Tax from "../Pages/Inventory/Tax";
import ItemForm from "../Pages/Inventory/Product/ItemForm";

export const PageRoutes = [
  { path: ROUTES.HOME, element: <Dashboard /> },

  { path: ROUTES.DASHBOARD, element: <Dashboard /> },

  { path: ROUTES.USER.BASE, element: <Users /> },
  { path: ROUTES.USER.ADD_EDIT, element: <UserForm /> },

  { path: ROUTES.BRANCH.BASE, element: <Branch /> },
  { path: ROUTES.BRANCH.ADD_EDIT, element: <BranchForm /> },

  { path: ROUTES.PRODUCT.BASE, element: <Product /> },
  { path: ROUTES.PRODUCT.ADD_EDIT, element: <ProductForm /> },
  { path: ROUTES.PRODUCT.ITEM_ADD_EDIT, element: <ItemForm /> },

  { path: ROUTES.BRAND.BASE, element: <Brand /> },
  
  { path: ROUTES.UOM.BASE, element: <Uom /> },

  { path: ROUTES.TAX.BASE, element: <Tax /> },

  { path: ROUTES.CATEGORY.BASE, element: <Category /> },
];

export const AuthRoutes = [
  { path: ROUTES.HOME, element: <Navigate to={ROUTES.AUTH.SIGNIN} replace /> },
  { path: ROUTES.AUTH.SIGNIN, element: <SignInForm /> },
];
