import { Navigate } from "react-router-dom";
import { ROUTES } from "../Constants";
import SignInForm from "../Pages/Auth/SignInForm";
import Branch from "../Pages/Branch";
import BranchForm from "../Pages/Branch/BranchForm";
import Dashboard from "../Pages/Dashboard";
import Employees from "../Pages/Employee";
import EmployeeForm from "../Pages/Employee/EmployeeForm";
import Brand from "../Pages/Inventory/Brand";
import BrandForm from "../Pages/Inventory/Brand/BrandForm";
import Product from "../Pages/Inventory/Product";
import ProductForm from "../Pages/Inventory/Product/ProductForm";

export const PageRoutes = [
  { path: ROUTES.HOME, element: <Dashboard /> },

  { path: ROUTES.DASHBOARD, element: <Dashboard /> },

  { path: ROUTES.EMPLOYEE.BASE, element: <Employees /> },
  { path: ROUTES.EMPLOYEE.ADD_EDIT, element: <EmployeeForm /> },

  { path: ROUTES.BRANCH.BASE, element: <Branch /> },
  { path: ROUTES.BRANCH.ADD_EDIT, element: <BranchForm /> },

  { path: ROUTES.PRODUCT.BASE, element: <Product /> },
  { path: ROUTES.PRODUCT.ADD_EDIT, element: <ProductForm /> },

  { path: ROUTES.BRAND.BASE, element: <Brand /> },
  { path: ROUTES.BRAND.ADD_EDIT, element: <BrandForm /> },
];

export const AuthRoutes = [
  { path: ROUTES.HOME, element: <Navigate to={ROUTES.AUTH.SIGNIN} replace /> },
  { path: ROUTES.AUTH.SIGNIN, element: <SignInForm /> },
];
