import { KEYS, URL_KEYS } from "../Constants";
import type { AnnouncementApiResponse, AppQueryOptions, BranchApiResponse, BrandApiResponse, CategoryApiResponse, CompanyApiResponse, EmployeeApiResponse, Params, ProductApiResponse, ProductRequestApiResponse, UploadResponse } from "../Types";
import { Get } from "./Methods";
import { useQueries } from "./ReactQuery";

export const Queries = {
  // ************ Upload ***********
  useGetUploadImage: (options?: AppQueryOptions<UploadResponse>) => useQueries<UploadResponse>([KEYS.UPLOAD.ALL_IMAGE], () => Get(URL_KEYS.UPLOAD.ALL_IMAGE), options),
  useGetUploadPdf: (options?: AppQueryOptions<UploadResponse>) => useQueries<UploadResponse>([KEYS.UPLOAD.ALL_PDF], () => Get(URL_KEYS.UPLOAD.ALL_PDF), options),

  // ************ User ***********
  useGetUserdata: (id?: string) => useQueries<EmployeeApiResponse>([KEYS.USER.BASE], () => Get(`${URL_KEYS.USER.BASE}/${id}`), { enabled: !!id }),

  // ************ Company ***********
  useGetSingleCompany: (id?: string) => useQueries<CompanyApiResponse>([KEYS.COMPANY.BASE, id], () => Get(`${URL_KEYS.COMPANY.BASE}/${id}`), { enabled: !!id }),

  // ************ Employee ***********
  useGetEmployee: (params?: Params) => useQueries<EmployeeApiResponse>([KEYS.EMPLOYEE.BASE, params], () => Get(URL_KEYS.EMPLOYEE.ALL, params)),

  // ************ Branch ***********

  useGetBranch: (params?: Params) => useQueries<BranchApiResponse>([KEYS.BRANCH.BASE, params], () => Get(URL_KEYS.BRANCH.ALL, params)),

  // ************ Brand ***********

  useGetBrand: (params?: Params) => useQueries<BrandApiResponse>([KEYS.BRAND.BASE, params], () => Get(URL_KEYS.BRAND.ALL, params)),

  // ************ Category ***********
  useGetCategory: (params?: Params) => useQueries<CategoryApiResponse>([KEYS.CATEGORY.BASE, params], () => Get(URL_KEYS.CATEGORY.ALL, params)),

  // ************ Announcement ***********

  useGetAnnouncement: () => useQueries<AnnouncementApiResponse>([KEYS.ANNOUNCEMENT.BASE], () => Get(URL_KEYS.ANNOUNCEMENT.ALL)),

  //***************product**************** */
  useGetProduct: (params?: Params) => useQueries<ProductApiResponse>([KEYS.PRODUCT.BASE, params], () => Get(URL_KEYS.PRODUCT.ALL, params)),

  useGetProductRequest: (params?: Params) => useQueries<ProductRequestApiResponse>([KEYS.PRODUCT_REQUEST.BASE, params], () => Get(URL_KEYS.PRODUCT_REQUEST.ALL, params)),

};
