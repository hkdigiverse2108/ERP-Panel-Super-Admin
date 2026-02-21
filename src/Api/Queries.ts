import { KEYS, URL_KEYS } from "../Constants";
import type { AccountGroupApiResponse, AccountGroupDropdownApiResponse, AccountGroupTreeApiResponse, AnnouncementApiResponse, AppQueryOptions, BillOfLiveProductApiResponse, BranchApiResponse, BranchDropdownApiResponse, BrandApiResponse, BrandDropdownApiResponse, CategoryApiResponse, CategoryDropdownApiResponse, CompanyApiResponse, CompanyDropdownApiResponse, CountryApiResponse, CreditNoteApiResponse, DebitNoteApiResponse, LocationApiResponse, MaterialConsumptionApiResponse, ModuleApiResponse, Params, PermissionChildApiResponse, PermissionDetailsApiResponse, ProductApiResponse, ProductDropDownApiResponse, PurchaseOrderApiResponse, PurchaseOrderDropdownApiResponse, RoleApiResponse, RoleDropdownApiResponse, SingleCompanyApiResponse, StockApiResponse, StockVerificationApiResponse, TaxApiResponse, TaxDropdownApiResponse, TermsConditionApiResponse, TermsConditionDropdownApiResponse, UomApiResponse, UomDropdownApiResponse, UploadResponse, UserApiResponse, UserModulePermissionApiResponse } from "../Types";
import type { AccountGroupApiResponse, AccountGroupDropdownApiResponse, AccountGroupTreeApiResponse, AnnouncementApiResponse, AppQueryOptions, BranchApiResponse, BranchDropdownApiResponse, BrandApiResponse, BrandDropdownApiResponse, CategoryApiResponse, CategoryDropdownApiResponse, CompanyApiResponse, CompanyDropdownApiResponse, CountryApiResponse, CouponApiResponse, CouponDropdownApiResponse, CreditNoteApiResponse, DebitNoteApiResponse, LocationApiResponse, LoyaltyApiResponse, LoyaltyDropdownApiResponse, LoyaltyPointsApiResponse, MaterialConsumptionApiResponse, ModuleApiResponse, Params, PermissionChildApiResponse, PermissionDetailsApiResponse, ProductApiResponse, ProductDropDownApiResponse, PurchaseOrderApiResponse, PurchaseOrderDropdownApiResponse, RolesApiResponse, RolesDropdownApiResponse, SingleCompanyApiResponse, SingleEmployeeApiResponse, StockApiResponse, StockVerificationApiResponse, TaxApiResponse, TaxDropdownApiResponse, TermsConditionApiResponse, TermsConditionDropdownApiResponse, UomApiResponse, UomDropdownApiResponse, UploadResponse, UserApiResponse, UserModulePermissionApiResponse } from "../Types";
import type { SupplierBillApiResponse } from "../Types/SupplierBill";
import type { AccountApiResponse, AccountDropdownApiResponse } from "../Types/Account";
import type { ContactApiResponse, ContactDropdownApiResponse } from "../Types/Contacts";
import type { BankApiResponse, BankDropdownApiResponse } from "../Types/Bank";
import { Get } from "./Methods";
import { useQueries } from "./ReactQuery";
import type { RecipeApiResponse, RecipeDropdownApiResponse } from "../Types/Recipe";

export const Queries = {
  // ************ Upload ***********
  useGetUploadImage: (options?: AppQueryOptions<UploadResponse>) => useQueries<UploadResponse>([KEYS.UPLOAD.ALL_IMAGE], () => Get(URL_KEYS.UPLOAD.ALL_IMAGE), options),
  useGetUploadPdf: (options?: AppQueryOptions<UploadResponse>) => useQueries<UploadResponse>([KEYS.UPLOAD.ALL_PDF], () => Get(URL_KEYS.UPLOAD.ALL_PDF), options),

  // ************ User ***********
  useGetUser: (params?: Params) => useQueries<UserApiResponse>([KEYS.USER.BASE, params], () => Get(URL_KEYS.USER.ALL, params)),
  useGetSingleUser: (id?: string) => useQueries<SingleEmployeeApiResponse>([KEYS.USER.BASE], () => Get(`${URL_KEYS.USER.BASE}/${id}`), { enabled: !!id }),
  useGetUserDropdown: (params?: Params, enabled?: boolean) => useQueries<SingleEmployeeApiResponse>([KEYS.USER.DROPDOWN, params], () => Get(URL_KEYS.USER.DROPDOWN, params), { enabled: enabled }),

  // ************ Role ***********
  useGetRole: (params?: Params) => useQueries<RolesApiResponse>([KEYS.ROLE.BASE, params], () => Get(URL_KEYS.ROLE.ALL, params)),
  useGetRoleDropdown: (params?: Params, enabled?: boolean) => useQueries<RolesDropdownApiResponse>([KEYS.ROLE.BASE, params], () => Get(URL_KEYS.ROLE.DROPDOWN, params), { enabled: enabled }),

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
  useGetProductDropdown: (params?: Params,  enabled?: boolean) => useQueries<ProductDropDownApiResponse>([KEYS.PRODUCT.BASE, params], () => Get(URL_KEYS.PRODUCT.DROPDOWN, params), { enabled: enabled }),

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
 
  useGetContacts: (params?: Params) => useQueries<ContactApiResponse>([KEYS.CONTACT.BASE, params], () => Get(URL_KEYS.CONTACT.ALL, params)),
  useGetContactDropdown: (params?: Params, enabled?: boolean) => useQueries<ContactDropdownApiResponse>([KEYS.CONTACT.BASE, params], () => Get(URL_KEYS.CONTACT.DROPDOWN, params), { enabled: enabled }),


  //*************** Purchase Order *********
  useGetPurchaseOrder: (params?: Params) => useQueries<PurchaseOrderApiResponse>([KEYS.PURCHASE_ORDER.BASE, params], () => Get(URL_KEYS.PURCHASE_ORDER.ALL, params)),
  useGetPurchaseOrderDropdown: (params?: Params) => useQueries<PurchaseOrderDropdownApiResponse>([KEYS.PURCHASE_ORDER.BASE, params], () => Get(URL_KEYS.PURCHASE_ORDER.DROPDOWN, params)),

  //*************** Terms and Condition *********
  useGetTermsCondition: (params?: Params, options?: AppQueryOptions<TermsConditionApiResponse>) => useQueries<TermsConditionApiResponse>([KEYS.TERMS_CONDITION.BASE, params], () => Get(URL_KEYS.TERMS_CONDITION.ALL, params), options),
  useGetTermsConditionDropdown: (params?: Params, options?: AppQueryOptions<TermsConditionDropdownApiResponse>) => useQueries<TermsConditionDropdownApiResponse>([KEYS.TERMS_CONDITION.BASE, params], () => Get(URL_KEYS.TERMS_CONDITION.DROPDOWN, params), options),

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

  //*************** Supplier Bill **************** */
  useGetSupplierBillDetails: (params?: Params) => useQueries<SupplierBillApiResponse>([KEYS.SUPPLIER_BILL.BASE, params], () => Get(URL_KEYS.SUPPLIER_BILL.ALL, params)),

  //*************** Additional Charge **************** */
  useGetAdditionalChargesDropdown: (params?: Params, enabled?: boolean) => useQueries<any>([KEYS.ADDITIONAL_CHARGE.BASE, params], () => Get(URL_KEYS.ADDITIONAL_CHARGE.DROPDOWN, params), { enabled: enabled }),
  useGetAdditionalCharges: (params?: Params, options?: AppQueryOptions<any>) => useQueries<any>([KEYS.ADDITIONAL_CHARGE.BASE, params], () => Get(URL_KEYS.ADDITIONAL_CHARGE.ALL, params), options),

   //************ recipe ********/
  useGetRecipe: (params?: Params) => useQueries<RecipeApiResponse>([KEYS.RECIPE.BASE, params], () => Get(URL_KEYS.RECIPE.ALL, params)),
  useGetRecipeDropdown: (params?: Params, enabled?: boolean) => useQueries<RecipeDropdownApiResponse>([KEYS.RECIPE.BASE, params], () => Get(URL_KEYS.RECIPE.DROPDOWN, params), { enabled: enabled }),

  //*************** stock **************** */
  useGetStock: (params?: Params) => useQueries<StockApiResponse>([KEYS.STOCK.BASE, params], () => Get(URL_KEYS.STOCK.ALL, params)),

  //*************** stock verification **************** */
  useGetStockVerification: (params?: Params) => useQueries<StockVerificationApiResponse>([KEYS.STOCK_VERIFICATION.BASE, params], () => Get(URL_KEYS.STOCK_VERIFICATION.ALL, params)),
//************ bill of live product ********/
  useGetBillOfLiveProduct: (params?: Params) => useQueries<BillOfLiveProductApiResponse>([KEYS.BILL_OF_LIVE_PRODUCT.BASE, params], () => Get(URL_KEYS.BILL_OF_LIVE_PRODUCT.ALL, params)),

  //*************** coupon **************** */
  useGetCoupon: (params?: Params) => useQueries<CouponApiResponse>([KEYS.COUPON.BASE, params], () => Get(URL_KEYS.COUPON.ALL, params)),
  useGetCouponDropdown: (params?: Params, enabled?: boolean) => useQueries<CouponDropdownApiResponse>([KEYS.COUPON.BASE, params], () => Get(URL_KEYS.COUPON.DROPDOWN, params), { enabled: enabled }),

   //*************** Loyalty *********
  useGetLoyalty: (params?: Params) => useQueries<LoyaltyApiResponse>([KEYS.LOYALTY.BASE, params], () => Get(URL_KEYS.LOYALTY.ALL, params)),
  useGetLoyaltyDropdown: (params?: Params, enabled?: boolean) => useQueries<LoyaltyDropdownApiResponse>([KEYS.LOYALTY.BASE, params], () => Get(URL_KEYS.LOYALTY.DROPDOWN, params), { enabled: enabled }),
  useGetLoyaltyPoints: (params?: Params, enabled?: boolean) => useQueries<LoyaltyPointsApiResponse>([KEYS.LOYALTY.BASE, params], () => Get(URL_KEYS.LOYALTY.POINTS, params), { enabled: enabled }),


};
