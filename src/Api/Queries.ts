import { KEYS, URL_KEYS } from "../Constants";
import type { AdditionalChargesApiResponse, AdditionalChargesDropdownApiResponse, AdminSettingApiResponse, AnnouncementApiResponse, AppQueryOptions, BankApiResponse, BankDropdownApiResponse, BankTransactionApiResponse, BankTransactionDropdownApiResponse, BillOfLiveProductApiResponse, BranchApiResponse, BranchDropdownApiResponse, BrandApiResponse, BrandDropdownApiResponse, CallRequestApiResponse, CategoryApiResponse, CategoryDropdownApiResponse, CompanyApiResponse, CompanyDropdownApiResponse, ContactApiResponse, ContactDropdownApiResponse, CountryApiResponse, CouponApiResponse, CouponDropdownApiResponse, CreditNoteApiResponse, DebitNoteApiResponse, DeliveryChallanApiResponse, DeliveryChallanDropdownApiResponse, EstimateApiResponse, EstimateDropdownApiResponse, ExpenseApiResponse, InvoiceApiResponse, InvoiceDropdownApiResponse, LocationApiResponse, LoyaltyApiResponse, LoyaltyDropdownApiResponse, LoyaltyPointsApiResponse, MaterialConsumptionApiResponse, ModuleApiResponse, Params, PermissionChildApiResponse, PermissionDetailsApiResponse, PosCashRegisterApiResponse, PosCashRegisterDropdownApiResponse, PosCreditNoteApiResponse, PosOrderApiResponse, PosOrderDropdownApiResponse, PosPaymentApiResponse, ProductApiResponse, ProductDropDownApiResponse, ProductTypeApiResponse, ProductTypeDropdownApiResponse, PurchaseDebitNoteApiResponse, PurchaseDebitNoteDropdownApiResponse, PurchaseOrderApiResponse, PurchaseOrderDropdownApiResponse, RecipeApiResponse, RecipeDropdownApiResponse, RolesApiResponse, RolesDropdownApiResponse, SalaryApiResponse, SalesCreditNoteApiResponse, SalesCreditNoteDropdownApiResponse, SalesOrderApiResponse, SalesOrderDropdownApiResponse, SingleCompanyApiResponse, SingleDeliveryChallanApiResponse, SingleEmployeeApiResponse, SingleInvoiceApiResponse, SinglePurchaseDebitNoteApiResponse, SingleSalesCreditNoteApiResponse, StockApiResponse, StockVerificationApiResponse, SupplierBillApiResponse, TaxApiResponse, TaxDropdownApiResponse, TermsConditionApiResponse, TermsConditionDropdownApiResponse, UomApiResponse, UomDropdownApiResponse, UploadResponse, UserApiResponse, UserModulePermissionApiResponse } from "../Types";
import { Get } from "./Methods";
import { useQueries } from "./ReactQuery";

export const Queries = {
  // ************ Upload ***********
  useGetUploadImage: (options?: AppQueryOptions<UploadResponse>) => useQueries<UploadResponse>([KEYS.UPLOAD.ALL_IMAGE], () => Get(URL_KEYS.UPLOAD.ALL_IMAGE), options),
  useGetUploadPdf: (options?: AppQueryOptions<UploadResponse>) => useQueries<UploadResponse>([KEYS.UPLOAD.ALL_PDF], () => Get(URL_KEYS.UPLOAD.ALL_PDF), options),

  // ************ User ***********
  useGetUser: (params?: Params) => useQueries<UserApiResponse>([KEYS.USER.BASE, params], () => Get(URL_KEYS.USER.ALL, params)),
  useGetSingleUser: (id?: string) => useQueries<SingleEmployeeApiResponse>([KEYS.USER.BASE, id], () => Get(`${URL_KEYS.USER.BASE}/${id}`), { enabled: !!id }),
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
  useGetAnnouncement: (params?: Params) => useQueries<AnnouncementApiResponse>([KEYS.ANNOUNCEMENT.BASE, params], () => Get(URL_KEYS.ANNOUNCEMENT.ALL, params)),

  // **************product****************/
  useGetProduct: (params?: Params) => useQueries<ProductApiResponse>([KEYS.PRODUCT.BASE, params], () => Get(URL_KEYS.PRODUCT.ALL, params)),
  useGetProductDropdown: (params?: Params, enabled?: boolean) => useQueries<ProductDropDownApiResponse>([KEYS.PRODUCT.BASE, params], () => Get(URL_KEYS.PRODUCT.DROPDOWN, params), { enabled: enabled }),

  //***************bank**************** */
  useGetBank: (params?: Params) => useQueries<BankApiResponse>([KEYS.BANK.BASE, params], () => Get(URL_KEYS.BANK.ALL, params)),
  useGetBankDropdown: (params?: Params, enabled?: boolean) => useQueries<BankDropdownApiResponse>([KEYS.BANK.BASE, params], () => Get(URL_KEYS.BANK.DROPDOWN, params), { enabled: enabled }),

  // ************ Product Type ***********
  useGetProductType: (params?: Params) => useQueries<ProductTypeApiResponse>([KEYS.PRODUCT_TYPE.BASE, params], () => Get(URL_KEYS.PRODUCT_TYPE.ALL, params)),
  useGetProductTypeDropdown: (params?: Params, enabled?: boolean) => useQueries<ProductTypeDropdownApiResponse>([KEYS.PRODUCT_TYPE.BASE, params], () => Get(URL_KEYS.PRODUCT_TYPE.DROPDOWN, params), { enabled: enabled }),

  //*************** Location **************** */
  useGetLocation: (params?: Params) => useQueries<LocationApiResponse>([KEYS.LOCATION.BASE, params], () => Get(URL_KEYS.LOCATION.ALL, params)),
  useGetCountryLocation: () => useQueries<CountryApiResponse>([KEYS.LOCATION.BASE], () => Get(URL_KEYS.LOCATION.COUNTRY)),
  useGetStateLocation: (id?: string) => useQueries<CountryApiResponse>([KEYS.LOCATION.BASE, id], () => Get(`${URL_KEYS.LOCATION.STATE}/${id}`), { enabled: !!id }),
  useGetCityLocation: (id?: string) => useQueries<CountryApiResponse>([KEYS.LOCATION.BASE, id], () => Get(`${URL_KEYS.LOCATION.CITY}/${id}`), { enabled: !!id }),

  //*************** Contact **************** */

  useGetContacts: (params?: Params) => useQueries<ContactApiResponse>([KEYS.CONTACT.BASE, params], () => Get(URL_KEYS.CONTACT.ALL, params)),
  useGetContactDropdown: (params?: Params, enabled?: boolean) => useQueries<ContactDropdownApiResponse>([KEYS.CONTACT.BASE, params], () => Get(URL_KEYS.CONTACT.DROPDOWN, params), { enabled: enabled }),

  //*************** Purchase Order *********
  useGetPurchaseOrder: (params?: Params) => useQueries<PurchaseOrderApiResponse>([KEYS.PURCHASE_ORDER.BASE, params], () => Get(URL_KEYS.PURCHASE_ORDER.ALL, params)),
  useGetPurchaseOrderDropdown: (params?: Params, enabled?: boolean) => useQueries<PurchaseOrderDropdownApiResponse>([KEYS.PURCHASE_ORDER.BASE, params], () => Get(URL_KEYS.PURCHASE_ORDER.DROPDOWN, params), { enabled: enabled }),

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

  //*************** Purchase Debit Note **************** */
  useGetPurchaseDebitNote: (params?: Params, enabled?: boolean) => useQueries<PurchaseDebitNoteApiResponse>([KEYS.PURCHASE_DEBIT_NOTE.BASE, params], () => Get(URL_KEYS.PURCHASE_DEBIT_NOTE.ALL, params), { enabled: enabled }),
  useGetSinglePurchaseDebitNote: (id?: string) => useQueries<SinglePurchaseDebitNoteApiResponse>([KEYS.PURCHASE_DEBIT_NOTE.BASE, id], () => Get(`${URL_KEYS.PURCHASE_DEBIT_NOTE.BASE}/${id}`), { enabled: !!id }),
  useGetPurchaseDebitNoteDropdown: (params?: Params, enabled?: boolean) => useQueries<PurchaseDebitNoteDropdownApiResponse>([KEYS.PURCHASE_DEBIT_NOTE.DROPDOWN, params], () => Get(URL_KEYS.PURCHASE_DEBIT_NOTE.DROPDOWN, params), { enabled: enabled }),

  //*************** Additional Charge **************** */
  useGetAdditionalChargesDropdown: (params?: Params, enabled?: boolean) => useQueries<AdditionalChargesDropdownApiResponse>([KEYS.ADDITIONAL_CHARGE.BASE, params], () => Get(URL_KEYS.ADDITIONAL_CHARGE.DROPDOWN, params), { enabled: enabled }),
  useGetAdditionalCharges: (params?: Params) => useQueries<AdditionalChargesApiResponse>([KEYS.ADDITIONAL_CHARGE.BASE, params], () => Get(URL_KEYS.ADDITIONAL_CHARGE.ALL, params)),

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

  //************ Support Desk ********/
  useGetCallRequest: (params?: Params) => useQueries<CallRequestApiResponse>([KEYS.CALL_REQUEST.BASE, params], () => Get(URL_KEYS.CALL_REQUEST.ALL, params)),

  //************ Admin Setting ********/
  useGetAdminSetting: (params?: Params) => useQueries<AdminSettingApiResponse>([KEYS.ADMIN_SETTING.BASE, params], () => Get(URL_KEYS.ADMIN_SETTING.ALL, params)),

  //***************bank transaction**************** */
  useGetBankTransaction: (params?: Params) => useQueries<BankTransactionApiResponse>([KEYS.BANK_TRANSACTION.BASE, params], () => Get(URL_KEYS.BANK_TRANSACTION.ALL, params)),
  useGetBankTransactionDropdown: (params?: Params, enabled?: boolean) => useQueries<BankTransactionDropdownApiResponse>([KEYS.BANK_TRANSACTION.BASE, params], () => Get(URL_KEYS.BANK_TRANSACTION.DROPDOWN, params), { enabled: enabled }),
  
  // ************ Announcement ***********
  useGetPosCashRegister: (params?: Params) => useQueries<PosCashRegisterApiResponse>([KEYS.POS_CASH_REGISTER.BASE, params], () => Get(URL_KEYS.POS_CASH_REGISTER.ALL, params)),
  useGetPosCashRegisterDropdown: (params?: Params, enabled?: boolean) => useQueries<PosCashRegisterDropdownApiResponse>([KEYS.POS_CASH_REGISTER.DROPDOWN, params], () => Get(URL_KEYS.POS_CASH_REGISTER.DROPDOWN, params), { enabled: enabled }),

  //*************** Pos Credit Note *********
  useGetPosCreditNote: (params?: Params, enabled?: boolean) => useQueries<PosCreditNoteApiResponse>([KEYS.POS_CREDIT_NOTE.BASE, params], () => Get(URL_KEYS.POS_CREDIT_NOTE.ALL, params), { enabled: enabled }),

  //*************** POS Order **************** */
  useGetPosOrder: (params?: Params, enabled?: boolean) => useQueries<PosOrderApiResponse>([KEYS.POS_ORDER.BASE, params], () => Get(URL_KEYS.POS_ORDER.ALL, params), { enabled: enabled }),
  useGetLastPosOrder: (params?: Params, enabled?: boolean) => useQueries<PosOrderApiResponse>([KEYS.POS_ORDER.BASE, params], () => Get(URL_KEYS.POS_ORDER.ALL, params), { enabled: enabled }),
  useGetPosOrderDropdown: (params?: Params, enabled?: boolean) => useQueries<PosOrderDropdownApiResponse>([KEYS.POS_ORDER.DROPDOWN, params], () => Get(URL_KEYS.POS_ORDER.DROPDOWN, params), { enabled: enabled }),

  // ************ Pos Payment ***********
  useGetPosPayment: (params?: Params) => useQueries<PosPaymentApiResponse>([KEYS.POS_PAYMENT.BASE, params], () => Get(URL_KEYS.POS_PAYMENT.ALL, params)),

  // ************ Expense *********** */
  useGetExpense: (params?: Params) => useQueries<ExpenseApiResponse>([KEYS.EXPENSE.BASE, params], () => Get(URL_KEYS.EXPENSE.ALL, params)),

  //*************** Salary *************** */
  useGetSalary: (params?: Params) => useQueries<SalaryApiResponse>([KEYS.SALARY.BASE, params], () => Get(URL_KEYS.SALARY.ALL, params)),
  //*************** Estimate **************** */
  useGetEstimate: (params?: Params, enabled?: boolean) => useQueries<EstimateApiResponse>([KEYS.ESTIMATE.BASE, params], () => Get(URL_KEYS.ESTIMATE.ALL, params), { enabled: enabled }),
  useGetEstimateDropdown: (params?: Params, enabled?: boolean) => useQueries<EstimateDropdownApiResponse>([KEYS.ESTIMATE.BASE, params], () => Get(URL_KEYS.ESTIMATE.DROPDOWN, params), { enabled: enabled }),

  //*************** Sales Order **************** */
  useGetSalesOrder: (params?: Params, enabled?: boolean) => useQueries<SalesOrderApiResponse>([KEYS.SALES_ORDER.BASE, params], () => Get(URL_KEYS.SALES_ORDER.ALL, params), { enabled: enabled }),
  useGetSalesOrderDropdown: (params?: Params, enabled?: boolean) => useQueries<SalesOrderDropdownApiResponse>([KEYS.SALES_ORDER.BASE, params], () => Get(URL_KEYS.SALES_ORDER.DROPDOWN, params), { enabled: enabled }),

  //*************** Invoice **************** */
  useGetInvoice: (params?: Params, enabled?: boolean) => useQueries<InvoiceApiResponse>([KEYS.INVOICE.BASE, params], () => Get(URL_KEYS.INVOICE.ALL, params), { enabled: enabled }),
  useGetSingleInvoice: (id?: string) => useQueries<SingleInvoiceApiResponse>([KEYS.INVOICE.BASE, id], () => Get(`${URL_KEYS.INVOICE.BASE}/${id}`), { enabled: !!id }),
  useGetInvoiceDropdown: (params?: Params, enabled?: boolean) => useQueries<InvoiceDropdownApiResponse>([KEYS.INVOICE.DROPDOWN, params], () => Get(URL_KEYS.INVOICE.DROPDOWN, params), { enabled: enabled }),
  //*************** Delivery Challan **************** */
  useGetDeliveryChallan: (params?: Params, enabled?: boolean) => useQueries<DeliveryChallanApiResponse>([KEYS.DELIVERY_CHALLAN.BASE, params], () => Get(URL_KEYS.DELIVERY_CHALLAN.ALL, params), { enabled: enabled }),
  useGetSingleDeliveryChallan: (id?: string) => useQueries<SingleDeliveryChallanApiResponse>([KEYS.DELIVERY_CHALLAN.BASE, id], () => Get(`${URL_KEYS.DELIVERY_CHALLAN.BASE}/${id}`), { enabled: !!id }),
  useGetDeliveryChallanDropdown: (params?: Params, enabled?: boolean) => useQueries<DeliveryChallanDropdownApiResponse>([KEYS.DELIVERY_CHALLAN.DROPDOWN, params], () => Get(URL_KEYS.DELIVERY_CHALLAN.DROPDOWN, params), { enabled: enabled }),
  //*************** Sales Credit Note **************** */
  useGetSalesCreditNote: (params?: Params, enabled?: boolean) => useQueries<SalesCreditNoteApiResponse>([KEYS.SALES_CREDIT_NOTE.BASE, params], () => Get(URL_KEYS.SALES_CREDIT_NOTE.ALL, params), { enabled: enabled }),
  useGetSingleSalesCreditNote: (id?: string) => useQueries<SingleSalesCreditNoteApiResponse>([KEYS.SALES_CREDIT_NOTE.BASE, id], () => Get(`${URL_KEYS.SALES_CREDIT_NOTE.BASE}/${id}`), { enabled: !!id }),
  useGetSalesCreditNoteDropdown: (params?: Params, enabled?: boolean) => useQueries<SalesCreditNoteDropdownApiResponse>([KEYS.SALES_CREDIT_NOTE.DROPDOWN, params], () => Get(URL_KEYS.SALES_CREDIT_NOTE.DROPDOWN, params), { enabled: enabled }),
};
