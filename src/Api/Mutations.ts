import { KEYS, URL_KEYS } from "../Constants";
import type { AddAdditionalChargesPayload, AddAnnouncementPayload, AddBankPayload, AddBillOfLiveProductPayload, AddBranchPayload, AddBrandPayload, AddCallRequestPayload, AddCategoryPayload, AddCompanyPayload, AddContactPayload, AddCouponPayload, AddCreditNotePayload, AddDebitNotePayload, AddDeliveryChallanPayload, AddEstimatePayload, AddInvoicePayload, AddLocationPayload, AddLoyaltyPayload, AddMaterialConsumptionPayload, AddModulePayload, AddModulePermissionPayload, AddPosCreditNotePayload, AddPosProductOrderPayload, AddProductPayload, AddProductTypePayload, AddPurchaseOrderPayload, AddRecipePayload, AddReturnPosOrderPayload, AddRolesPayload, AddSalesCreditNotePayload, AddSalesOrderPayload, AddStockBulkAdjustmentPayload, AddStockPayload, AddStockVerificationPayload, AddSupplierBillPayload, AddTaxPayload, AddTermsConditionPayload, AddUomPayload, AddUserPayload, ApplyCouponPayload, ChangePasswordPayload, EditAdditionalChargesPayload, EditAdminSettingPayload, EditAnnouncementPayload, EditBankPayload, EditBillOfLiveProductPayload, EditBranchPayload, EditBrandPayload, EditCallRequestPayload, EditCategoryPayload, EditCompanyPayload, EditContactPayload, EditCouponPayload, EditCreditNotePayload, EditDebitNotePayload, EditDeliveryChallanPayload, EditEstimatePayload, EditInvoicePayload, EditLocationPayload, EditLoyaltyPayload, EditLoyaltyPointPayload, EditMaterialConsumptionPayload, EditModulePayload, EditPermissionPayload, EditPosCreditNotePayload, EditPosProductOrderPayload, EditProductPayload, EditProductTypePayload, EditPurchaseOrderPayload, EditRecipePayload, EditReturnPosOrderPayload, EditRolesPayload, EditSalesCreditNotePayload, EditSalesOrderPayload, EditStockVerificationPayload, EditSupplierBillPayload, EditTaxPayload, EditTermsConditionPayload, EditUomPayload, EditUserPayload, LoginPayload, LoginResponse, PosCreditNoteRefundFormValues, ResendOtpPayload, UploadResponse, UserApiResponse, VerifyOtpPayload } from "../Types";
import { Delete, Post, Put } from "./Methods";
import { useMutations } from "./ReactQuery";

export const Mutations = {
  // ************ Auth ***********
  useSignin: () => useMutations<LoginPayload, LoginResponse>([KEYS.AUTH.SIGNIN], (input) => Post(URL_KEYS.AUTH.SIGNIN, input, false)),
  useChangePassword: () => useMutations<ChangePasswordPayload, void>([KEYS.AUTH.CHANGE_PASSWORD], (input) => Post(URL_KEYS.AUTH.CHANGE_PASSWORD, input)),
  useVerifyOtp: () => useMutations<VerifyOtpPayload, void>([KEYS.AUTH.VERIFY_OTP], (input) => Post(URL_KEYS.AUTH.VERIFY_OTP, input)),
  useResendOtp: () => useMutations<ResendOtpPayload, void>([KEYS.AUTH.RESEND_OTP], (input) => Post(URL_KEYS.AUTH.RESEND_OTP, input)),

  // ************ Admin Settings ***********
  useEditAdminSetting: () => useMutations<EditAdminSettingPayload, void>([KEYS.ADMIN_SETTING.UPDATE, KEYS.ADMIN_SETTING.BASE], (input) => Put(URL_KEYS.ADMIN_SETTING.UPDATE, input)),

  // ************ Upload ***********
  useUpload: () => useMutations<FormData, UploadResponse>([KEYS.UPLOAD.ADD, KEYS.UPLOAD.ALL_IMAGE, KEYS.UPLOAD.ALL_PDF], (input) => Post(URL_KEYS.UPLOAD.ADD, input)),
  useDeleteUpload: () => useMutations<{ fileUrl: string }, void>([KEYS.UPLOAD.DELETE, KEYS.UPLOAD.ALL_IMAGE, KEYS.UPLOAD.ALL_PDF], (id) => Delete(`${URL_KEYS.UPLOAD.DELETE}`, id)),

  // ************ Company ***********
  useAddCompany: () => useMutations<AddCompanyPayload, void>([KEYS.COMPANY.ADD, KEYS.COMPANY.BASE], (input) => Post(URL_KEYS.COMPANY.ADD, input)),
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

  // ************ Product Type ***********
  useAddProductType: () => useMutations<AddProductTypePayload, void>([KEYS.PRODUCT_TYPE.ADD, KEYS.PRODUCT_TYPE.BASE], (input) => Post(URL_KEYS.PRODUCT_TYPE.ADD, input)),
  useEditProductType: () => useMutations<EditProductTypePayload, void>([KEYS.PRODUCT_TYPE.EDIT, KEYS.PRODUCT_TYPE.BASE], (input) => Put(URL_KEYS.PRODUCT_TYPE.EDIT, input)),
  useDeleteProductType: () => useMutations<string, void>([KEYS.PRODUCT_TYPE.DELETE, KEYS.PRODUCT_TYPE.BASE], (id) => Delete(`${URL_KEYS.PRODUCT_TYPE.BASE}/${id}`)),

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

  // ************ Stock ***********
  useAddStock: () => useMutations<AddStockPayload, void>([KEYS.STOCK.ADD, KEYS.STOCK.BASE], (input) => Post(URL_KEYS.STOCK.ADD, input)),
  useAddStockBulkAdjustment: () => useMutations<AddStockBulkAdjustmentPayload, void>([KEYS.STOCK.BULK_ADJUSTMENT, KEYS.STOCK.BASE, KEYS.PRODUCT.BASE], (input) => Put(URL_KEYS.STOCK.BULK_ADJUSTMENT, input)),

  // ************ Location ***********
  useAddLocation: () => useMutations<AddLocationPayload, void>([KEYS.LOCATION.ADD, KEYS.LOCATION.BASE], (input) => Post(URL_KEYS.LOCATION.ADD, input)),
  useEditLocation: () => useMutations<EditLocationPayload, void>([KEYS.LOCATION.EDIT, KEYS.LOCATION.BASE], (input) => Put(URL_KEYS.LOCATION.EDIT, input)),
  useDeleteLocation: () => useMutations<string, void>([KEYS.LOCATION.DELETE, KEYS.LOCATION.BASE], (id) => Delete(`${URL_KEYS.LOCATION.BASE}/${id}`)),

  //*************** Role **************** */
  useAddRole: () => useMutations<AddRolesPayload, void>([KEYS.ROLE.ADD, KEYS.ROLE.BASE], (input) => Post(URL_KEYS.ROLE.ADD, input)),
  useEditRole: () => useMutations<EditRolesPayload, void>([KEYS.ROLE.EDIT, KEYS.ROLE.BASE], (input) => Put(URL_KEYS.ROLE.EDIT, input)),
  useDeleteRole: () => useMutations<string, void>([KEYS.ROLE.DELETE, KEYS.ROLE.BASE], (id) => Delete(`${URL_KEYS.ROLE.BASE}/${id}`)),

  //*************** Purchase Order  **************/
  useAddPurchaseOrder: () => useMutations<AddPurchaseOrderPayload, void>([KEYS.PURCHASE_ORDER.ADD, KEYS.PURCHASE_ORDER.BASE], (input) => Post(URL_KEYS.PURCHASE_ORDER.ADD, input)),
  useEditPurchaseOrder: () => useMutations<EditPurchaseOrderPayload, void>([KEYS.PURCHASE_ORDER.EDIT, KEYS.PURCHASE_ORDER.BASE], (input) => Put(URL_KEYS.PURCHASE_ORDER.EDIT, input)),
  useDeletePurchaseOrder: () => useMutations<string, void>([KEYS.PURCHASE_ORDER.DELETE, KEYS.PURCHASE_ORDER.BASE], (id) => Delete(`${URL_KEYS.PURCHASE_ORDER.BASE}/${id}`)),

  //*************** Terms and Condition  **************/
  useAddTermsCondition: () => useMutations<AddTermsConditionPayload, void>([KEYS.TERMS_CONDITION.ADD, KEYS.TERMS_CONDITION.BASE], (input) => Post(URL_KEYS.TERMS_CONDITION.ADD, input)),
  useEditTermsCondition: () => useMutations<EditTermsConditionPayload, void>([KEYS.TERMS_CONDITION.EDIT, KEYS.TERMS_CONDITION.BASE], (input) => Put(URL_KEYS.TERMS_CONDITION.EDIT, input)),
  useDeleteTermsCondition: () => useMutations<string, void>([KEYS.TERMS_CONDITION.DELETE, KEYS.TERMS_CONDITION.BASE], (id) => Delete(`${URL_KEYS.TERMS_CONDITION.BASE}/${id}`)),

  //*************** Module **************** */
  useAddModule: () => useMutations<AddModulePayload, void>([KEYS.MODULE.ADD, KEYS.MODULE.BASE, KEYS.PERMISSION.DETAILS], (input) => Post(URL_KEYS.MODULE.ADD, input)),
  useEditModule: () => useMutations<EditModulePayload, void>([KEYS.MODULE.EDIT, KEYS.MODULE.BASE, KEYS.PERMISSION.DETAILS], (input) => Put(URL_KEYS.MODULE.EDIT, input)),
  useDeleteModule: () => useMutations<string, void>([KEYS.MODULE.DELETE, KEYS.MODULE.BASE, KEYS.PERMISSION.DETAILS], (id) => Delete(`${URL_KEYS.MODULE.BASE}/${id}`)),
  useAddUserModulePermission: () => useMutations<AddModulePermissionPayload, void>([KEYS.MODULE.USER_PERMISSION, KEYS.MODULE.BASE, KEYS.PERMISSION.DETAILS], (input) => Put(URL_KEYS.MODULE.BULK_EDIT, input)),

  //*************** Permission **************** */
  useEditUserPermission: () => useMutations<EditPermissionPayload, void>([KEYS.MODULE.USER_PERMISSION, KEYS.MODULE.BASE, KEYS.PERMISSION.DETAILS], (input) => Put(URL_KEYS.PERMISSION.EDIT, input)),

  //*************** Debit Note **************** */
  useAddDebitNote: () => useMutations<AddDebitNotePayload, void>([KEYS.DEBIT_NOTE.ADD, KEYS.DEBIT_NOTE.BASE], (input) => Post(URL_KEYS.DEBIT_NOTE.ADD, input)),
  useEditDebitNote: () => useMutations<EditDebitNotePayload, void>([KEYS.DEBIT_NOTE.EDIT, KEYS.DEBIT_NOTE.BASE], (input) => Put(URL_KEYS.DEBIT_NOTE.EDIT, input)),
  useDeleteDebitNote: () => useMutations<string, void>([KEYS.DEBIT_NOTE.DELETE, KEYS.DEBIT_NOTE.BASE], (id) => Delete(`${URL_KEYS.DEBIT_NOTE.BASE}/${id}`)),

  //*************** Credit Note **************** */
  useAddCreditNote: () => useMutations<AddCreditNotePayload, void>([KEYS.CREDIT_NOTE.ADD, KEYS.CREDIT_NOTE.BASE], (input) => Post(URL_KEYS.CREDIT_NOTE.ADD, input)),
  useEditCreditNote: () => useMutations<EditCreditNotePayload, void>([KEYS.CREDIT_NOTE.EDIT, KEYS.CREDIT_NOTE.BASE], (input) => Put(URL_KEYS.CREDIT_NOTE.EDIT, input)),
  useDeleteCreditNote: () => useMutations<string, void>([KEYS.CREDIT_NOTE.DELETE, KEYS.CREDIT_NOTE.BASE], (id) => Delete(`${URL_KEYS.CREDIT_NOTE.BASE}/${id}`)),

  //*************** Material Consumption **************** */
  useAddMaterialConsumption: () => useMutations<AddMaterialConsumptionPayload, void>([KEYS.MATERIAL_CONSUMPTION.ADD, KEYS.MATERIAL_CONSUMPTION.BASE], (input) => Post(URL_KEYS.MATERIAL_CONSUMPTION.ADD, input)),
  useEditMaterialConsumption: () => useMutations<EditMaterialConsumptionPayload, void>([KEYS.MATERIAL_CONSUMPTION.EDIT, KEYS.MATERIAL_CONSUMPTION.BASE], (input) => Put(URL_KEYS.MATERIAL_CONSUMPTION.EDIT, input)),
  useDeleteMaterialConsumption: () => useMutations<string, void>([KEYS.MATERIAL_CONSUMPTION.DELETE, KEYS.MATERIAL_CONSUMPTION.BASE], (id) => Delete(`${URL_KEYS.MATERIAL_CONSUMPTION.BASE}/${id}`)),

  //*************** Supplier Bill **************** */
  useAddSupplierBill: () => useMutations<AddSupplierBillPayload, void>([KEYS.SUPPLIER_BILL.ADD, KEYS.SUPPLIER_BILL.BASE], (input) => Post(URL_KEYS.SUPPLIER_BILL.ADD, input)),
  useEditSupplierBill: () => useMutations<EditSupplierBillPayload, void>([KEYS.SUPPLIER_BILL.EDIT, KEYS.SUPPLIER_BILL.BASE], (input) => Put(URL_KEYS.SUPPLIER_BILL.EDIT, input)),
  useDeleteSupplierBill: () => useMutations<string, void>([KEYS.SUPPLIER_BILL.DELETE, KEYS.SUPPLIER_BILL.BASE], (id) => Delete(`${URL_KEYS.SUPPLIER_BILL.BASE}/${id}`)),

  //*************** Additional Charge **************** */
  useAddAdditionalCharges: () => useMutations<AddAdditionalChargesPayload, void>([KEYS.ADDITIONAL_CHARGE.ADD, KEYS.ADDITIONAL_CHARGE.BASE], (input) => Post(URL_KEYS.ADDITIONAL_CHARGE.ADD, input)),
  useEditAdditionalCharges: () => useMutations<EditAdditionalChargesPayload, void>([KEYS.ADDITIONAL_CHARGE.EDIT, KEYS.ADDITIONAL_CHARGE.BASE], (input) => Put(URL_KEYS.ADDITIONAL_CHARGE.EDIT, input)),
  useDeleteAdditionalCharges: () => useMutations<string, void>([KEYS.ADDITIONAL_CHARGE.DELETE, KEYS.ADDITIONAL_CHARGE.BASE], (id) => Delete(`${URL_KEYS.ADDITIONAL_CHARGE.BASE}/${id}`)),

  //*************** Contact **************** */
  useAddContacts: () => useMutations<AddContactPayload, void>([KEYS.CONTACT.ADD, KEYS.CONTACT.BASE], (input) => Post(URL_KEYS.CONTACT.ADD, input)),
  useEditContacts: () => useMutations<EditContactPayload, void>([KEYS.CONTACT.EDIT, KEYS.CONTACT.BASE], (input) => Put(URL_KEYS.CONTACT.EDIT, input)),
  useDeleteContacts: () => useMutations<string, void>([KEYS.CONTACT.DELETE, KEYS.CONTACT.BASE], (id) => Delete(`${URL_KEYS.CONTACT.BASE}/${id}`)),
  //************** recipe **************** */
  useAddRecipe: () => useMutations<AddRecipePayload, void>([KEYS.RECIPE.ADD, KEYS.RECIPE.BASE], (input) => Post(URL_KEYS.RECIPE.ADD, input)),
  useEditRecipe: () => useMutations<EditRecipePayload, void>([KEYS.RECIPE.EDIT, KEYS.RECIPE.BASE], (input) => Put(URL_KEYS.RECIPE.EDIT, input)),
  useDeleteRecipe: () => useMutations<string, void>([KEYS.RECIPE.DELETE, KEYS.RECIPE.BASE], (id) => Delete(`${URL_KEYS.RECIPE.BASE}/${id}`)),

  // ************ Stock Verification ***********
  useAddStockVerification: () => useMutations<AddStockVerificationPayload, void>([KEYS.STOCK_VERIFICATION.ADD, KEYS.STOCK_VERIFICATION.BASE], (input) => Post(URL_KEYS.STOCK_VERIFICATION.ADD, input)),
  useEditStockVerification: () => useMutations<EditStockVerificationPayload, void>([KEYS.STOCK_VERIFICATION.EDIT, KEYS.STOCK_VERIFICATION.BASE], (input) => Put(URL_KEYS.STOCK_VERIFICATION.EDIT, input)),
  useDeleteStockVerification: () => useMutations<string, void>([KEYS.STOCK_VERIFICATION.DELETE, KEYS.STOCK_VERIFICATION.BASE], (id) => Delete(`${URL_KEYS.STOCK_VERIFICATION.BASE}/${id}`)),
  //************** bill of live product **************** */
  useAddBillOfLiveProduct: () => useMutations<AddBillOfLiveProductPayload, void>([KEYS.BILL_OF_LIVE_PRODUCT.ADD, KEYS.BILL_OF_LIVE_PRODUCT.BASE], (input) => Post(URL_KEYS.BILL_OF_LIVE_PRODUCT.ADD, input)),
  useEditBillOfLiveProduct: () => useMutations<EditBillOfLiveProductPayload, void>([KEYS.BILL_OF_LIVE_PRODUCT.EDIT, KEYS.BILL_OF_LIVE_PRODUCT.BASE], (input) => Put(URL_KEYS.BILL_OF_LIVE_PRODUCT.EDIT, input)),
  useDeleteBillOfLiveProduct: () => useMutations<string, void>([KEYS.BILL_OF_LIVE_PRODUCT.DELETE, KEYS.BILL_OF_LIVE_PRODUCT.BASE], (id) => Delete(`${URL_KEYS.BILL_OF_LIVE_PRODUCT.BASE}/${id}`)),

  //************* bank **************/
  useAddBank: () => useMutations<AddBankPayload, void>([KEYS.BANK.ADD, KEYS.BANK.BASE], (input) => Post(URL_KEYS.BANK.ADD, input)),
  useEditBank: () => useMutations<EditBankPayload, void>([KEYS.BANK.EDIT, KEYS.BANK.BASE], (input) => Put(URL_KEYS.BANK.EDIT, input)),
  useDeleteBank: () => useMutations<string, void>([KEYS.BANK.DELETE, KEYS.BANK.BASE], (id) => Delete(`${URL_KEYS.BANK.BASE}/${id}`)),

  //*************** Coupon **************** */
  useAddCoupon: () => useMutations<AddCouponPayload, void>([KEYS.COUPON.ADD, KEYS.COUPON.BASE], (input) => Post(URL_KEYS.COUPON.ADD, input)),
  useEditCoupon: () => useMutations<EditCouponPayload, void>([KEYS.COUPON.EDIT, KEYS.COUPON.BASE], (input) => Put(URL_KEYS.COUPON.EDIT, input)),
  useDeleteCoupon: () => useMutations<string, void>([KEYS.COUPON.DELETE, KEYS.COUPON.BASE], (id) => Delete(`${URL_KEYS.COUPON.BASE}/${id}`)),
  useApplyCoupon: () => useMutations<ApplyCouponPayload, void>([KEYS.COUPON.APPLY, KEYS.COUPON.BASE], (input) => Post(URL_KEYS.COUPON.APPLY, input)),

  //*************** Loyalty **************** */
  useAddLoyalty: () => useMutations<AddLoyaltyPayload, void>([KEYS.LOYALTY.ADD, KEYS.LOYALTY.BASE], (input) => Post(URL_KEYS.LOYALTY.ADD, input)),
  useEditLoyalty: () => useMutations<EditLoyaltyPayload, void>([KEYS.LOYALTY.EDIT, KEYS.LOYALTY.BASE], (input) => Put(URL_KEYS.LOYALTY.EDIT, input)),
  useDeleteLoyalty: () => useMutations<string, void>([KEYS.LOYALTY.DELETE, KEYS.LOYALTY.BASE], (id) => Delete(`${URL_KEYS.LOYALTY.BASE}/${id}`)),
  useAddLoyaltyPoint: () => useMutations<EditLoyaltyPointPayload, void>([KEYS.LOYALTY.POINTS_ADD, KEYS.LOYALTY.BASE], (input) => Post(URL_KEYS.LOYALTY.POINTS_ADD, input)),

  //************** Announcement **************** */
  useAddAnnouncement: () => useMutations<AddAnnouncementPayload, void>([KEYS.ANNOUNCEMENT.ADD, KEYS.ANNOUNCEMENT.BASE], (input) => Post(URL_KEYS.ANNOUNCEMENT.ADD, input)),
  useEditAnnouncement: () => useMutations<EditAnnouncementPayload, void>([KEYS.ANNOUNCEMENT.EDIT, KEYS.ANNOUNCEMENT.BASE], (input) => Put(URL_KEYS.ANNOUNCEMENT.EDIT, input)),
  useDeleteAnnouncement: () => useMutations<string, void>([KEYS.ANNOUNCEMENT.DELETE, KEYS.ANNOUNCEMENT.BASE], (id) => Delete(`${URL_KEYS.ANNOUNCEMENT.BASE}/${id}`)),

  //************** Support Desk **************** */
  useAddCallRequest: () => useMutations<AddCallRequestPayload, void>([KEYS.CALL_REQUEST.ADD, KEYS.CALL_REQUEST.BASE], (input) => Post(URL_KEYS.CALL_REQUEST.ADD, input)),
  useEditCallRequest: () => useMutations<EditCallRequestPayload, void>([KEYS.CALL_REQUEST.EDIT, KEYS.CALL_REQUEST.BASE], (input) => Put(URL_KEYS.CALL_REQUEST.EDIT, input)),
  useDeleteCallRequest: () => useMutations<string, void>([KEYS.CALL_REQUEST.DELETE, KEYS.CALL_REQUEST.BASE], (id) => Delete(`${URL_KEYS.CALL_REQUEST.BASE}/${id}`)),

  //*************** POS Credit Note *********
  useAddPosCreditNote: () => useMutations<AddPosCreditNotePayload, void>([KEYS.POS_CREDIT_NOTE.ADD, KEYS.POS_CREDIT_NOTE.BASE], (input) => Post(URL_KEYS.POS_CREDIT_NOTE.ADD, input)),
  useEditPosCreditNote: () => useMutations<EditPosCreditNotePayload, void>([KEYS.POS_CREDIT_NOTE.EDIT, KEYS.POS_CREDIT_NOTE.BASE], (input) => Put(URL_KEYS.POS_CREDIT_NOTE.EDIT, input)),
  useDeletePosCreditNote: () => useMutations<string, void>([KEYS.POS_CREDIT_NOTE.DELETE, KEYS.POS_CREDIT_NOTE.BASE], (id) => Delete(`${URL_KEYS.POS_CREDIT_NOTE.BASE}/${id}`)),
  useRefundCreditNote: () => useMutations<PosCreditNoteRefundFormValues, void>([KEYS.POS_CREDIT_NOTE.REFUND, KEYS.POS_CREDIT_NOTE.BASE], (input) => Post(URL_KEYS.POS_CREDIT_NOTE.REFUND, input)),

  //*************** POS Return Order *********
  useAddReturnPosOrder: () => useMutations<AddReturnPosOrderPayload, void>([KEYS.RETURN_POS_ORDER.ADD, KEYS.RETURN_POS_ORDER.BASE], (input) => Post(URL_KEYS.RETURN_POS_ORDER.ADD, input)),
  useEditReturnPosOrder: () => useMutations<EditReturnPosOrderPayload, void>([KEYS.RETURN_POS_ORDER.EDIT, KEYS.RETURN_POS_ORDER.BASE], (input) => Put(URL_KEYS.RETURN_POS_ORDER.EDIT, input)),
  useDeleteReturnPosOrder: () => useMutations<string, void>([KEYS.RETURN_POS_ORDER.DELETE, KEYS.RETURN_POS_ORDER.BASE], (id) => Delete(`${URL_KEYS.RETURN_POS_ORDER.BASE}/${id}`)),

  //*************** POS **************** */
  useAddPosOrder: () => useMutations<AddPosProductOrderPayload, void>([KEYS.POS.ADD, KEYS.POS.BASE, KEYS.POS.HOLD_ORDER, KEYS.POS_ORDER.BASE, KEYS.POS_CASH_REGISTER.DETAILS], (input) => Post(URL_KEYS.POS.ADD, input)),
  useEditPosOrder: () => useMutations<EditPosProductOrderPayload, void>([KEYS.POS.EDIT, KEYS.POS.BASE, KEYS.POS.HOLD_ORDER], (input) => Put(URL_KEYS.POS.EDIT, input)),
  useDeletePosOrder: () => useMutations<string, void>([KEYS.POS.DELETE, KEYS.POS.BASE, KEYS.POS.HOLD_ORDER], (id) => Delete(`${URL_KEYS.POS.BASE}/${id}`)),

  //*************** Estimate **************** */

  useAddEstimate: () => useMutations<AddEstimatePayload, void>([KEYS.ESTIMATE.ADD, KEYS.ESTIMATE.BASE], (input) => Post(URL_KEYS.ESTIMATE.ADD, input)),
  useEditEstimate: () => useMutations<EditEstimatePayload, void>([KEYS.ESTIMATE.EDIT, KEYS.ESTIMATE.BASE], (input) => Put(URL_KEYS.ESTIMATE.EDIT, input)),
  useDeleteEstimate: () => useMutations<string, void>([KEYS.ESTIMATE.DELETE, KEYS.ESTIMATE.BASE], (id) => Delete(`${URL_KEYS.ESTIMATE.BASE}/${id}`)),

  //*************** Sales Order **************** */

  useAddSalesOrder: () => useMutations<AddSalesOrderPayload, void>([KEYS.SALES_ORDER.ADD, KEYS.SALES_ORDER.BASE], (input) => Post(URL_KEYS.SALES_ORDER.ADD, input)),
  useEditSalesOrder: () => useMutations<EditSalesOrderPayload, void>([KEYS.SALES_ORDER.EDIT, KEYS.SALES_ORDER.BASE], (input) => Put(URL_KEYS.SALES_ORDER.EDIT, input)),
  useDeleteSalesOrder: () => useMutations<string, void>([KEYS.SALES_ORDER.DELETE, KEYS.SALES_ORDER.BASE], (id) => Delete(`${URL_KEYS.SALES_ORDER.BASE}/${id}`)),

  //*************** Invoice **************** */

  useAddInvoice: () => useMutations<AddInvoicePayload, void>([KEYS.INVOICE.ADD, KEYS.INVOICE.BASE], (input) => Post(URL_KEYS.INVOICE.ADD, input)),
  useEditInvoice: () => useMutations<EditInvoicePayload, void>([KEYS.INVOICE.EDIT, KEYS.INVOICE.BASE], (input) => Put(URL_KEYS.INVOICE.EDIT, input)),
  useDeleteInvoice: () => useMutations<string, void>([KEYS.INVOICE.DELETE, KEYS.INVOICE.BASE], (id) => Delete(`${URL_KEYS.INVOICE.BASE}/${id}`)),

  //*************** Delivery Challan **************** */

  useAddDeliveryChallan: () => useMutations<AddDeliveryChallanPayload, void>([KEYS.DELIVERY_CHALLAN.ADD, KEYS.DELIVERY_CHALLAN.BASE], (input) => Post(URL_KEYS.DELIVERY_CHALLAN.ADD, input)),
  useEditDeliveryChallan: () => useMutations<EditDeliveryChallanPayload, void>([KEYS.DELIVERY_CHALLAN.EDIT, KEYS.DELIVERY_CHALLAN.BASE], (input) => Put(URL_KEYS.DELIVERY_CHALLAN.EDIT, input)),
  useDeleteDeliveryChallan: () => useMutations<string, void>([KEYS.DELIVERY_CHALLAN.DELETE, KEYS.DELIVERY_CHALLAN.BASE], (id) => Delete(`${URL_KEYS.DELIVERY_CHALLAN.BASE}/${id}`)),
  //*************** Sales Credit Note **************** */
  useAddSalesCreditNote: () => useMutations<AddSalesCreditNotePayload, void>([KEYS.SALES_CREDIT_NOTE.ADD, KEYS.SALES_CREDIT_NOTE.BASE], (input) => Post(URL_KEYS.SALES_CREDIT_NOTE.ADD, input)),
  useEditSalesCreditNote: () => useMutations<EditSalesCreditNotePayload, void>([KEYS.SALES_CREDIT_NOTE.EDIT, KEYS.SALES_CREDIT_NOTE.BASE], (input) => Put(URL_KEYS.SALES_CREDIT_NOTE.EDIT, input)),
  useDeleteSalesCreditNote: () => useMutations<string, void>([KEYS.SALES_CREDIT_NOTE.DELETE, KEYS.SALES_CREDIT_NOTE.BASE], (id) => Delete(`${URL_KEYS.SALES_CREDIT_NOTE.BASE}/${id}`)),
};
