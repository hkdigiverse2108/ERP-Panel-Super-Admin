import { KEYS, URL_KEYS } from "../Constants";
import type { AccountGroupApiResponse, AccountGroupDropdownApiResponse, AccountGroupTreeApiResponse, AnnouncementApiResponse, AppQueryOptions, BranchApiResponse, BranchDropdownApiResponse, BrandApiResponse, BrandDropdownApiResponse, CategoryApiResponse, CategoryDropdownApiResponse, CompanyApiResponse, CompanyDropdownApiResponse, CountryApiResponse, CreditNoteApiResponse, DebitNoteApiResponse, LocationApiResponse, MaterialConsumptionApiResponse, ModuleApiResponse, Params, PermissionChildApiResponse, PermissionDetailsApiResponse, ProductApiResponse, ProductDropDownApiResponse, RoleApiResponse, RoleDropdownApiResponse, SingleCompanyApiResponse, TaxApiResponse, TaxDropdownApiResponse, UomApiResponse, UomDropdownApiResponse, UploadResponse, UserApiResponse, UserModulePermissionApiResponse } from "../Types";
import type { AccountApiResponse, AccountDropdownApiResponse } from "../Types/Account";
import type { ContactApiResponse, ContactDropdownApiResponse } from "../Types/Contact";
import type { TermsConditionApiResponse, TermsConditionDropdownApiResponse } from "../Types/TermsCondition";
import type { BankApiResponse, BankDropdownApiResponse } from "../Types/Bank";
import type { PurchaseOrderApiResponse, PurchaseOrderDropdownApiResponse } from "../Types/PurchaseOrder";
import { Get } from "./Methods";
import { useQueries } from "./ReactQuery";

export const Queries = {
  // ************ Upload ***********
  useGetUploadImage: (options?: AppQueryOptions<UploadResponse>) => useQueries<UploadResponse>([KEYS.UPLOAD.ALL_IMAGE], () => Get(URL_KEYS.UPLOAD.ALL_IMAGE), options),
  useGetUploadPdf: (options?: AppQueryOptions<UploadResponse>) => useQueries<UploadResponse>([KEYS.UPLOAD.ALL_PDF], () => Get(URL_KEYS.UPLOAD.ALL_PDF), options),

  // ************ User ***********
  useGetUser: (params?: Params) => useQueries<UserApiResponse>([KEYS.USER.BASE, params], () => Get(URL_KEYS.USER.ALL, params)),
  useGetUserdata: (id?: string) => useQueries<UserApiResponse>([KEYS.USER.BASE], () => Get(`${URL_KEYS.USER.BASE}/${id}`), { enabled: !!id }),

  // ************ Role ***********
  useGetRole: (params?: Params) => useQueries<RoleApiResponse>([KEYS.ROLE.BASE, params], () => Get(URL_KEYS.ROLE.ALL, params)),
  useGetRoleDropdown: (params?: Params, enabled?: boolean) => useQueries<RoleDropdownApiResponse>([KEYS.ROLE.BASE, params], () => Get(URL_KEYS.ROLE.DROPDOWN, params), { enabled: enabled }),

  // ************ Company ***********
  useGetSingleCompany: (id?: string) => useQueries<SingleCompanyApiResponse>([KEYS.COMPANY.BASE, id], () => Get(`${URL_KEYS.COMPANY.BASE}/${id}`), { enabled: !!id }),
  useGetCompany: (params?: Params) => useQueries<CompanyApiResponse>([KEYS.COMPANY.BASE, params], () => Get(URL_KEYS.COMPANY.ALL, params)),
  useGetCompanyDropdown: (params?: Params) => useQueries<CompanyDropdownApiResponse>([KEYS.COMPANY.BASE, params], () => Get(URL_KEYS.COMPANY.DROPDOWN, params)),

  // ************ Branch ***********
  useGetBranch: (params?: Params) => useQueries<BranchApiResponse>([KEYS.BRANCH.BASE, params], () => Get(URL_KEYS.BRANCH.ALL, params)),
  useGetBranchDropdown: (params?: Params, enabled?: boolean) => useQueries<BranchDropdownApiResponse>([KEYS.BRANCH.BASE, params], () => Get(URL_KEYS.BRANCH.DROPDOWN, params), { enabled: enabled }),

  // ************ Brand ***********
  useGetBrand: (params?: Params) => useQueries<BrandApiResponse>([KEYS.BRAND.BASE, params], () => Get(URL_KEYS.BRAND.ALL, params)),
  useGetBrandDropdown: (params?: Params, enabled?: boolean) => useQueries<BrandDropdownApiResponse>([KEYS.BRAND.BASE, params], () => Get(URL_KEYS.BRAND.DROPDOWN, params), { enabled: enabled }),

  // ************ Uom ***********
  useGetUom: (params?: Params) => useQueries<UomApiResponse>([KEYS.UOM.BASE, params], () => Get(URL_KEYS.UOM.ALL, params)),
  useGetUomDropdown: (params?: Params) => useQueries<UomDropdownApiResponse>([KEYS.UOM.BASE, params], () => Get(URL_KEYS.UOM.DROPDOWN, params)),

  // ************ Tax ***********
  useGetTax: (params?: Params) => useQueries<TaxApiResponse>([KEYS.TAX.BASE, params], () => Get(URL_KEYS.TAX.ALL, params)),
  useGetTaxDropdown: (params?: Params) => useQueries<TaxDropdownApiResponse>([KEYS.TAX.BASE, params], () => Get(URL_KEYS.TAX.DROPDOWN, params)),

  // ************ Category ***********
  useGetCategory: (params?: Params) => useQueries<CategoryApiResponse>([KEYS.CATEGORY.BASE, params], () => Get(URL_KEYS.CATEGORY.ALL, params)),
  useGetCategoryDropdown: (params?: Params, enabled?: boolean) => useQueries<CategoryDropdownApiResponse>([KEYS.CATEGORY.BASE, params], () => Get(URL_KEYS.CATEGORY.DROPDOWN, params), { enabled: enabled }),

  // ************ Announcement ***********
  useGetAnnouncement: () => useQueries<AnnouncementApiResponse>([KEYS.ANNOUNCEMENT.BASE], () => Get(URL_KEYS.ANNOUNCEMENT.ALL)),

  // **************product****************/
  useGetProduct: (params?: Params) => useQueries<ProductApiResponse>([KEYS.PRODUCT.BASE, params], () => Get(URL_KEYS.PRODUCT.ALL, params)),
  useGetProductDropdown: (params?: Params) => useQueries<ProductDropDownApiResponse>([KEYS.PRODUCT.DROPDOWN, params], () => Get(URL_KEYS.PRODUCT.DROPDOWN, params)),

  //***************bank**************** */
  useGetBank: (params?: Params) => useQueries<BankApiResponse>([KEYS.BANK.BASE, params], () => Get(URL_KEYS.BANK.ALL, params)),
  useGetBankDropdown: (params?: Params, enabled?: boolean) => useQueries<BankDropdownApiResponse>([KEYS.BANK.BASE, params], () => Get(URL_KEYS.BANK.DROPDOWN, params), { enabled: enabled }),

  //*************** Location **************** */
  useGetLocation: (params?: Params) => useQueries<LocationApiResponse>([KEYS.LOCATION.BASE, params], () => Get(URL_KEYS.LOCATION.ALL, params)),
  useGetCountryLocation: () => useQueries<CountryApiResponse>([KEYS.LOCATION.BASE], () => Get(URL_KEYS.LOCATION.COUNTRY)),
  useGetStateLocation: (id?: string) => useQueries<CountryApiResponse>([KEYS.LOCATION.BASE, id], () => Get(`${URL_KEYS.LOCATION.STATE}/${id}`), { enabled: !!id }),
  useGetCityLocation: (id?: string) => useQueries<CountryApiResponse>([KEYS.LOCATION.BASE, id], () => Get(`${URL_KEYS.LOCATION.CITY}/${id}`), { enabled: !!id }),

  //*************** Account Group **************** */
  useGetAccountGroup: (params?: Params) => useQueries<AccountGroupApiResponse>([KEYS.ACCOUNT_GROUP.BASE, params], () => Get(URL_KEYS.ACCOUNT_GROUP.ALL, params)),
  useGetAccountGroupDropdown: (params?: Params, enabled?: boolean) => useQueries<AccountGroupDropdownApiResponse>([KEYS.ACCOUNT_GROUP.BASE, params], () => Get(URL_KEYS.ACCOUNT_GROUP.DROPDOWN, params), { enabled: enabled }),
  useGetAccountGroupTree: (params?: Params) => useQueries<AccountGroupTreeApiResponse>([KEYS.ACCOUNT_GROUP.BASE, params], () => Get(URL_KEYS.ACCOUNT_GROUP.TREE, params)),

  //*************** Account **************** */
  useGetAccount: (params?: Params) => useQueries<AccountApiResponse>([KEYS.ACCOUNT.BASE, params], () => Get(URL_KEYS.ACCOUNT.ALL, params)),
  useGetAccountDropdown: (params?: Params) => useQueries<AccountDropdownApiResponse>([KEYS.ACCOUNT.BASE, params], () => Get(URL_KEYS.ACCOUNT.DROPDOWN, params)),

  //*************** Contact **************** */
 
  useGetContact: (params?: Params) => useQueries<ContactApiResponse>([KEYS.CONTACT.BASE, params], () => Get(URL_KEYS.CONTACT.ALL, params)),
  useGetContactDropdown: (params?: Params, enabled?: boolean) => useQueries<ContactDropdownApiResponse>([KEYS.CONTACT.BASE, params], () => Get(URL_KEYS.CONTACT.DROPDOWN, params), { enabled: enabled }),

  //*************** Purchase Order *********
  useGetPurchaseOrder: (params?: Params) => useQueries<PurchaseOrderApiResponse>([KEYS.PURCHASE_ORDER.BASE, params], () => Get(URL_KEYS.PURCHASE_ORDER.ALL, params)),
  useGetPurchaseOrderDropdown: (params?: Params) => useQueries<PurchaseOrderDropdownApiResponse>([KEYS.PURCHASE_ORDER.BASE, params], () => Get(URL_KEYS.PURCHASE_ORDER.DROPDOWN, params)),

  //*************** Terms and Condition *********
  useGetTermsCondition: (params?: Params) => useQueries<TermsConditionApiResponse>([KEYS.TERMS_CONDITION.BASE, params], () => Get(URL_KEYS.TERMS_CONDITION.ALL, params)),
  useGetTermsConditionDropdown: (params?: Params) => useQueries<TermsConditionDropdownApiResponse>([KEYS.TERMS_CONDITION.BASE, params], () => Get(URL_KEYS.TERMS_CONDITION.DROPDOWN, params)),

  //*************** Module **************** */
  useGetModule: (params?: Params) => useQueries<ModuleApiResponse>([KEYS.MODULE.BASE, params], () => Get(URL_KEYS.MODULE.ALL, params)),
  useGetModuleUserPermission: (params?: Params, enabled?: boolean) => useQueries<UserModulePermissionApiResponse>([KEYS.MODULE.BASE, params], () => Get(URL_KEYS.MODULE.USER_PERMISSION, params), { enabled: enabled }),

  //*************** Permission **************** */
  useGetPermissionDetails: (params?: Params, enabled?: boolean) => useQueries<PermissionDetailsApiResponse>([KEYS.PERMISSION.DETAILS, params], () => Get(URL_KEYS.PERMISSION.DETAILS, params), { enabled: enabled }),
  useGetPermissionChildDetails: (params?: Params, enabled?: boolean) => useQueries<PermissionChildApiResponse>([KEYS.PERMISSION.DETAILS, params], () => Get(URL_KEYS.PERMISSION.CHILD, params), { enabled: enabled }),

  //*************** Debit Note **************** */
  useGetDebitNote: (params?: Params) => useQueries<DebitNoteApiResponse>([KEYS.DEBIT_NOTE.BASE, params], () => Get(URL_KEYS.DEBIT_NOTE.ALL, params)),

  //*************** Credit Note **************** */
  useGetCreditNote: (params?: Params) => useQueries<CreditNoteApiResponse>([KEYS.CREDIT_NOTE.BASE, params], () => Get(URL_KEYS.CREDIT_NOTE.ALL, params)),

  //*************** Material Consumption **************** */
  useGetMaterialConsumption: (params?: Params) => useQueries<MaterialConsumptionApiResponse>([KEYS.MATERIAL_CONSUMPTION.BASE, params], () => Get(URL_KEYS.MATERIAL_CONSUMPTION.ALL, params)),
};
