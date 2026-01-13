import { KEYS, URL_KEYS } from "../Constants";
import type { AnnouncementApiResponse, AppQueryOptions, BranchApiResponse, BrandApiResponse, BrandDropdownApiResponse, CategoryApiResponse, CategoryDropdownApiResponse, CompanyApiResponse, Params, ProductApiResponse, RolesApiResponse, SingleCompanyApiResponse, TaxApiResponse, TaxDropdownApiResponse, UomApiResponse, UploadResponse, UserApiResponse } from "../Types";
import { Get } from "./Methods";
import { useQueries } from "./ReactQuery";

export const Queries = {
  // ************ Upload ***********
  useGetUploadImage: (options?: AppQueryOptions<UploadResponse>) => useQueries<UploadResponse>([KEYS.UPLOAD.ALL_IMAGE], () => Get(URL_KEYS.UPLOAD.ALL_IMAGE), options),
  useGetUploadPdf: (options?: AppQueryOptions<UploadResponse>) => useQueries<UploadResponse>([KEYS.UPLOAD.ALL_PDF], () => Get(URL_KEYS.UPLOAD.ALL_PDF), options),

  // ************ User ***********
  useGetUserdata: (id?: string) => useQueries<UserApiResponse>([KEYS.USER.BASE], () => Get(`${URL_KEYS.USER.BASE}/${id}`), { enabled: !!id }),

  // ************ Roles ***********
  useGetRoles: (params?: Params) => useQueries<RolesApiResponse>([KEYS.ROLE.BASE, params], () => Get(URL_KEYS.ROLE.ALL, params)),

  // ************ Company ***********
  useGetSingleCompany: (id?: string) => useQueries<SingleCompanyApiResponse>([KEYS.COMPANY.BASE, id], () => Get(`${URL_KEYS.COMPANY.BASE}/${id}`), { enabled: !!id }),
  useGetCompany: (params?: Params) => useQueries<CompanyApiResponse>([KEYS.COMPANY.BASE, params], () => Get(URL_KEYS.COMPANY.ALL, params)),

  // ************ User ***********
  useGetUser: (params?: Params) => useQueries<UserApiResponse>([KEYS.USER.BASE, params], () => Get(URL_KEYS.USER.ALL, params)),

  // ************ Branch ***********

  useGetBranch: (params?: Params) => useQueries<BranchApiResponse>([KEYS.BRANCH.BASE, params], () => Get(URL_KEYS.BRANCH.ALL, params)),

  // ************ Brand ***********

  useGetBrand: (params?: Params) => useQueries<BrandApiResponse>([KEYS.BRAND.BASE, params], () => Get(URL_KEYS.BRAND.ALL, params)),
  useGetBrandDropdown: (params?: Params, enabled?: boolean) => useQueries<BrandDropdownApiResponse>([KEYS.BRAND.BASE, params], () => Get(URL_KEYS.BRAND.DROPDOWN, params), { enabled: enabled }),

  // ************ Uom ***********

  useGetUom: (params?: Params) => useQueries<UomApiResponse>([KEYS.UOM.BASE, params], () => Get(URL_KEYS.UOM.ALL, params)),

  // ************ Tax ***********

  useGetTax: (params?: Params) => useQueries<TaxApiResponse>([KEYS.TAX.BASE, params], () => Get(URL_KEYS.TAX.ALL, params)),
  useGetTaxDropdown: (params?: Params) => useQueries<TaxDropdownApiResponse>([KEYS.TAX.BASE, params], () => Get(URL_KEYS.TAX.DROPDOWN, params)),

  // ************ Category ***********
  useGetCategory: (params?: Params) => useQueries<CategoryApiResponse>([KEYS.CATEGORY.BASE, params], () => Get(URL_KEYS.CATEGORY.ALL, params)),
  useGetCategoryDropdown: (params?: Params, enabled?: boolean) => useQueries<CategoryDropdownApiResponse>([KEYS.CATEGORY.BASE, params], () => Get(URL_KEYS.CATEGORY.DROPDOWN, params), { enabled: enabled }),

  // ************ Announcement ***********

  useGetAnnouncement: () => useQueries<AnnouncementApiResponse>([KEYS.ANNOUNCEMENT.BASE], () => Get(URL_KEYS.ANNOUNCEMENT.ALL)),

  //***************product**************** */
  useGetProduct: (params?: Params) => useQueries<ProductApiResponse>([KEYS.PRODUCT.BASE, params], () => Get(URL_KEYS.PRODUCT.ALL, params)),
};
