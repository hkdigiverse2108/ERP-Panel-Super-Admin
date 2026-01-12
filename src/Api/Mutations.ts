import { KEYS, URL_KEYS } from "../Constants";
import type { AddBranchPayload, AddBrandPayload, AddCategoryPayload, AddProductPayload, AddTaxPayload, AddUomPayload, AddUserPayload, CallRequestFormValues, CompanyApiResponse, EditBranchPayload, EditBrandPayload, EditCategoryPayload, EditCompanyPayload, EditProductPayload, EditTaxPayload, EditUomPayload, EditUserPayload, LoginPayload, LoginResponse, UploadResponse, UserApiResponse } from "../Types";
import { Delete, Post, Put } from "./Methods";
import { useMutations } from "./ReactQuery";

export const Mutations = {
  // ************ Auth ***********
  useSignin: () => useMutations<LoginPayload, LoginResponse>([KEYS.AUTH.SIGNIN], (input) => Post(URL_KEYS.AUTH.SIGNIN, input, false)),

  // ************ Upload ***********
  useUpload: () => useMutations<FormData, UploadResponse>([KEYS.UPLOAD.ADD, KEYS.UPLOAD.ALL_IMAGE, KEYS.UPLOAD.ALL_PDF], (input) => Post(URL_KEYS.UPLOAD.ADD, input)),
  useDeleteUpload: () => useMutations<{ fileUrl: string }, void>([KEYS.UPLOAD.DELETE, KEYS.UPLOAD.ALL_IMAGE, KEYS.UPLOAD.ALL_PDF], (id) => Delete(`${URL_KEYS.UPLOAD.DELETE}`, id)),

  // ************ User ***********
  useEditUser: () => useMutations<EditUserPayload, UserApiResponse>([KEYS.USER.EDIT], (input) => Put(URL_KEYS.USER.EDIT, input)),

  // ************ Company ***********
  useEditCompany: () => useMutations<EditCompanyPayload, CompanyApiResponse>([KEYS.COMPANY.EDIT], (input) => Put(URL_KEYS.COMPANY.EDIT, input)),

  // ************ User ***********
  useAddUser: () => useMutations<AddUserPayload, void>([KEYS.USER.ADD, KEYS.USER.BASE], (input) => Post(URL_KEYS.USER.ADD, input)),
  // useEditUser: () => useMutations<EditUserPayload, void>([KEYS.USER.EDIT, KEYS.USER.BASE], (input) => Put(URL_KEYS.USER.EDIT, input)),
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
};
