import { KEYS, URL_KEYS } from "../Constants";
import type { AddAccountGroupPayload, AddBranchPayload, AddBrandPayload, AddCategoryPayload, AddCompanyPayload, AddLocationPayload, AddProductPayload, AddRolePayload, AddStockBulkAdjustmentPayload, AddStockPayload, AddTaxPayload, AddUomPayload, AddUserPayload, CallRequestFormValues, EditAccountGroupPayload, EditBranchPayload, EditBrandPayload, EditCategoryPayload, EditCompanyPayload, EditLocationPayload, EditProductPayload, EditRolePayload, EditTaxPayload, EditUomPayload, EditUserPayload, LoginPayload, LoginResponse, UploadResponse, UserApiResponse } from "../Types";
import type { AddAccountPayload, EditAccountPayload } from "../Types/Account";
import type { AddPurchaseOrderPayload, EditPurchaseOrderPayload } from "../Types/PurchaseOrder";
import { Delete, Post, Put } from "./Methods";
import { useMutations } from "./ReactQuery";

export const Mutations = {
  // ************ Auth ***********
  useSignin: () => useMutations<LoginPayload, LoginResponse>([KEYS.AUTH.SIGNIN], (input) => Post(URL_KEYS.AUTH.SIGNIN, input, false)),

  // ************ Upload ***********
  useUpload: () => useMutations<FormData, UploadResponse>([KEYS.UPLOAD.ADD, KEYS.UPLOAD.ALL_IMAGE, KEYS.UPLOAD.ALL_PDF], (input) => Post(URL_KEYS.UPLOAD.ADD, input)),
  useDeleteUpload: () => useMutations<{ fileUrl: string }, void>([KEYS.UPLOAD.DELETE, KEYS.UPLOAD.ALL_IMAGE, KEYS.UPLOAD.ALL_PDF], (id) => Delete(`${URL_KEYS.UPLOAD.DELETE}`, id)),

  // ************ Company ***********
  useAddCompany: () => useMutations<AddCompanyPayload, void>([KEYS.COMPANY.ADD, KEYS.COMPANY.BASE], (input) => Put(URL_KEYS.COMPANY.ADD, input)),
  useEditCompany: () => useMutations<EditCompanyPayload, void>([KEYS.COMPANY.EDIT, KEYS.COMPANY.BASE], (input) => Put(URL_KEYS.COMPANY.EDIT, input)),
  useDeleteCompany: () => useMutations<string, void>([KEYS.COMPANY.DELETE, KEYS.COMPANY.BASE], (id) => Delete(`${URL_KEYS.COMPANY.BASE}/${id}`)),
  
  // ************ User ***********
  useAddUser: () => useMutations<AddUserPayload, void>([KEYS.USER.ADD, KEYS.USER.BASE], (input) => Post(URL_KEYS.USER.ADD, input)),
  useEditUser: () => useMutations<EditUserPayload, UserApiResponse>([KEYS.USER.EDIT, KEYS.USER.BASE], (input) => Put(URL_KEYS.USER.EDIT, input)),
  useDeleteUser: () => useMutations<string, void>([KEYS.USER.DELETE, KEYS.USER.BASE], (id) => Delete(`${URL_KEYS.USER.BASE}/${id}`)),

  // ************ Branch ***********
  useAddBranch: () => useMutations<AddBranchPayload, void>([KEYS.BRANCH.ADD, KEYS.BRANCH.BASE], (input) => Post(URL_KEYS.BRANCH.ADD, input)),
  useEditBranch: () => useMutations<EditBranchPayload, void>([KEYS.BRANCH.EDIT, KEYS.BRANCH.BASE], (input) => Put(URL_KEYS.BRANCH.EDIT, input)),
  useDeleteBranch: () => useMutations<string, void>([KEYS.BRANCH.DELETE, KEYS.BRANCH.BASE], (id) => Delete(`${URL_KEYS.BRANCH.BASE}/${id}`)),

  // ************ Brand ***********
  useAddBrand: () => useMutations<AddBrandPayload, void>([KEYS.BRAND.ADD, KEYS.BRAND.BASE], (input) => Post(URL_KEYS.BRAND.ADD, input)),
  useEditBrand: () => useMutations<EditBrandPayload, void>([KEYS.BRAND.EDIT, KEYS.BRAND.BASE], (input) => Put(URL_KEYS.BRAND.EDIT, input)),
  useDeleteBrand: () => useMutations<string, void>([KEYS.BRAND.DELETE, KEYS.BRAND.BASE], (id) => Delete(`${URL_KEYS.BRAND.BASE}/${id}`)),

  // ************ Uom ***********
  useAddUom: () => useMutations<AddUomPayload, void>([KEYS.UOM.ADD, KEYS.UOM.BASE], (input) => Post(URL_KEYS.UOM.ADD, input)),
  useEditUom: () => useMutations<EditUomPayload, void>([KEYS.UOM.EDIT, KEYS.UOM.BASE], (input) => Put(URL_KEYS.UOM.EDIT, input)),
  useDeleteUom: () => useMutations<string, void>([KEYS.UOM.DELETE, KEYS.UOM.BASE], (id) => Delete(`${URL_KEYS.UOM.BASE}/${id}`)),

  // ************ Tax ***********
  useAddTax: () => useMutations<AddTaxPayload, void>([KEYS.TAX.ADD, KEYS.TAX.BASE], (input) => Post(URL_KEYS.TAX.ADD, input)),
  useEditTax: () => useMutations<EditTaxPayload, void>([KEYS.TAX.EDIT, KEYS.TAX.BASE], (input) => Put(URL_KEYS.TAX.EDIT, input)),
  useDeleteTax: () => useMutations<string, void>([KEYS.TAX.DELETE, KEYS.TAX.BASE], (id) => Delete(`${URL_KEYS.TAX.BASE}/${id}`)),

  // ************ Category ***********
  useAddCategory: () => useMutations<AddCategoryPayload, void>([KEYS.CATEGORY.ADD, KEYS.CATEGORY.BASE], (input) => Post(URL_KEYS.CATEGORY.ADD, input)),
  useEditCategory: () => useMutations<EditCategoryPayload, void>([KEYS.CATEGORY.EDIT, KEYS.CATEGORY.BASE], (input) => Put(URL_KEYS.CATEGORY.EDIT, input)),
  useDeleteCategory: () => useMutations<string, void>([KEYS.CATEGORY.DELETE, KEYS.CATEGORY.BASE], (id) => Delete(`${URL_KEYS.CATEGORY.BASE}/${id}`)),

  // ************ product ***********
  useAddProduct: () => useMutations<AddProductPayload, void>([KEYS.PRODUCT.ADD, KEYS.PRODUCT.BASE], (input) => Post(URL_KEYS.PRODUCT.ADD, input)),
  useEditProduct: () => useMutations<EditProductPayload, void>([KEYS.PRODUCT.EDIT, KEYS.PRODUCT.BASE], (input) => Put(URL_KEYS.PRODUCT.EDIT, input)),
  useDeleteProduct: () => useMutations<string, void>([KEYS.PRODUCT.DELETE, KEYS.PRODUCT.BASE], (id) => Delete(`${URL_KEYS.PRODUCT.BASE}/${id}`)),

  // ************ Call Request ***********
  useAddCallRequest: () => useMutations<CallRequestFormValues, void>([KEYS.CALL_REQUEST.ADD], (input) => Post(URL_KEYS.CALL_REQUEST.ADD, input)),
  
  // ************ Stock ***********
  useAddStock: () => useMutations<AddStockPayload, void>([KEYS.STOCK.ADD, KEYS.STOCK.BASE], (input) => Post(URL_KEYS.STOCK.ADD, input)),
  useAddStockBulkAdjustment: () => useMutations<AddStockBulkAdjustmentPayload, void>([KEYS.STOCK.BULK_ADJUSTMENT, KEYS.STOCK.BASE], (input) => Put(URL_KEYS.STOCK.BULK_ADJUSTMENT, input)),

  // ************ Location ***********
  useAddLocation: () => useMutations<AddLocationPayload, void>([KEYS.LOCATION.ADD, KEYS.LOCATION.BASE], (input) => Post(URL_KEYS.LOCATION.ADD, input)),
  useEditLocation: () => useMutations<EditLocationPayload, void>([KEYS.LOCATION.EDIT, KEYS.LOCATION.BASE], (input) => Put(URL_KEYS.LOCATION.EDIT, input)),
  useDeleteLocation: () => useMutations<string, void>([KEYS.LOCATION.DELETE, KEYS.LOCATION.BASE], (id) => Delete(`${URL_KEYS.LOCATION.BASE}/${id}`)),

  
  //*************** Account Group **************** */
  useAddAccountGroup: () => useMutations<AddAccountGroupPayload, void>([KEYS.ACCOUNT_GROUP.ADD, KEYS.ACCOUNT_GROUP.BASE], (input) => Post(URL_KEYS.ACCOUNT_GROUP.ADD, input)),
  useEditAccountGroup: () => useMutations<EditAccountGroupPayload, void>([KEYS.ACCOUNT_GROUP.EDIT, KEYS.ACCOUNT_GROUP.BASE], (input) => Put(URL_KEYS.ACCOUNT_GROUP.EDIT, input)),
  useDeleteAccountGroup: () => useMutations<string, void>([KEYS.ACCOUNT_GROUP.DELETE, KEYS.ACCOUNT_GROUP.BASE], (id) => Delete(`${URL_KEYS.ACCOUNT_GROUP.BASE}/${id}`)),

  //*************** Account **************** */
  useAddAccount: () => useMutations<AddAccountPayload, void>([KEYS.ACCOUNT.ADD, KEYS.ACCOUNT.BASE], (input) => Post(URL_KEYS.ACCOUNT.ADD, input)),
  useEditAccount: () => useMutations<EditAccountPayload, void>([KEYS.ACCOUNT.EDIT, KEYS.ACCOUNT.BASE], (input) => Put(URL_KEYS.ACCOUNT.EDIT, input)),
  useDeleteAccount: () => useMutations<string, void>([KEYS.ACCOUNT.DELETE, KEYS.ACCOUNT.BASE], (id) => Delete(`${URL_KEYS.ACCOUNT.BASE}/${id}`)),

  //*************** Role **************** */
  useAddRole: () => useMutations<AddRolePayload, void>([KEYS.ROLE.ADD, KEYS.ROLE.BASE], (input) => Post(URL_KEYS.ROLE.ADD, input)),
  useEditRole: () => useMutations<EditRolePayload, void>([KEYS.ROLE.EDIT, KEYS.ROLE.BASE], (input) => Put(URL_KEYS.ROLE.EDIT, input)),
  useDeleteRole: () => useMutations<string, void>([KEYS.ROLE.DELETE, KEYS.ROLE.BASE], (id) => Delete(`${URL_KEYS.ROLE.BASE}/${id}`)),

  //*************** Purchase Order  **************/
  useAddPurchaseOrder: () => useMutations<AddPurchaseOrderPayload, void>([KEYS.PURCHASE_ORDER.ADD, KEYS.PURCHASE_ORDER.BASE], (input) => Post(URL_KEYS.PURCHASE_ORDER.ADD, input)), 
  useEditPurchaseOrder: () => useMutations<EditPurchaseOrderPayload, void>([KEYS.PURCHASE_ORDER.EDIT, KEYS.PURCHASE_ORDER.BASE], (input) => Put(URL_KEYS.PURCHASE_ORDER.EDIT, input)),
  useDeletePurchaseOrder: () => useMutations<string, void>([KEYS.PURCHASE_ORDER.DELETE, KEYS.PURCHASE_ORDER.BASE], (id) => Delete(`${URL_KEYS.PURCHASE_ORDER.BASE}/${id}`)),

};
