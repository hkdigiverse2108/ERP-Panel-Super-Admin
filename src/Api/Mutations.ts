import { KEYS, URL_KEYS } from "../Constants";
import type { AddBranchPayload, AddBrandPayload, AddCategoryPayload, AddProductPayload, AddProductRequestPayload, AddUserPayload, CallRequestFormValues, EditBranchPayload, EditBrandPayload, EditCategoryPayload, EditCompanyPayload, EditProductPayload, EditUserPayload, LoginPayload, LoginResponse, SingleCompanyApiResponse, UploadResponse, UserApiResponse } from "../Types";
import { Delete, Post, Put } from "./Methods";
import { useMutations } from "./ReactQuery";

export const Mutations = {
  // ************ Auth ***********
  useSignin: () => useMutations<LoginPayload, LoginResponse>([KEYS.AUTH.SIGNIN], (input) => Post(URL_KEYS.AUTH.SIGNIN, input, false)),

  // ************ Upload ***********
  useUpload: () => useMutations<FormData, UploadResponse>([KEYS.UPLOAD.ADD, KEYS.UPLOAD.ALL_IMAGE, KEYS.UPLOAD.ALL_PDF], (input) => Post(URL_KEYS.UPLOAD.ADD, input)),
  useDeleteUpload: () => useMutations<{ fileUrl: string }, void>([KEYS.UPLOAD.DELETE, KEYS.UPLOAD.ALL_IMAGE, KEYS.UPLOAD.ALL_PDF], (id) => Delete(`${URL_KEYS.UPLOAD.DELETE}`, id)),

  // ************ User ***********
  useEditUser: () => useMutations<EditUserPayload, UserApiResponse>([KEYS.USER.EDIT, KEYS.USER.BASE], (input) => Put(URL_KEYS.USER.EDIT, input)),

  // ************ Company ***********
  useEditCompany: () => useMutations<EditCompanyPayload, SingleCompanyApiResponse>([KEYS.COMPANY.EDIT], (input) => Put(URL_KEYS.COMPANY.EDIT, input)),

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

     // ************ Category ***********
  useAddCategory: () => useMutations<AddCategoryPayload, void>([KEYS.CATEGORY.ADD, KEYS.CATEGORY.BASE], (input) => Post(URL_KEYS.CATEGORY.ADD, input)),
  useEditCategory: () => useMutations<EditCategoryPayload, void>([KEYS.CATEGORY.EDIT, KEYS.CATEGORY.BASE], (input) => Put(URL_KEYS.CATEGORY.EDIT, input)),
  useDeleteCategory: () => useMutations<string, void>([KEYS.CATEGORY.DELETE, KEYS.CATEGORY.BASE], (id) => Delete(`${URL_KEYS.CATEGORY.BASE}/${id}`)),

  // ************ product ***********
  useAddProduct: () => useMutations<AddProductPayload, void>([KEYS.PRODUCT.ADD, KEYS.PRODUCT.BASE], (input) => Post(URL_KEYS.PRODUCT.ADD, input)),
  useEditProduct: () => useMutations<EditProductPayload, void>([KEYS.PRODUCT.EDIT, KEYS.PRODUCT.BASE], (input) => Put(URL_KEYS.PRODUCT.EDIT, input)),
  useDeleteProduct: () => useMutations<string, void>([KEYS.PRODUCT.DELETE, KEYS.PRODUCT.BASE], (id) => Delete(`${URL_KEYS.PRODUCT.BASE}/${id}`)),

  useAddProductRequest: () => useMutations<AddProductRequestPayload, void>([KEYS.PRODUCT_REQUEST.ADD, KEYS.PRODUCT_REQUEST.BASE], (input) => Post(URL_KEYS.PRODUCT_REQUEST.ADD, input)),


  // ************ Call Request ***********
  useAddCallRequest: () => useMutations<CallRequestFormValues, void>([KEYS.CALL_REQUEST.ADD], (input) => Post(URL_KEYS.CALL_REQUEST.ADD, input)),
};
