import type { CommonDataType, MessageStatus, PageStatus, SelectOptionType } from "./Common";
import type { ProductBase } from "./Product";
import type { SupplierBase as ContactBase } from "./Contact";
import type { TermsConditionBase } from "./TermsCondition";

/* ===================== SUPPLIER ===================== */

export type BillSupplier = ContactBase;

/* ===================== PRODUCT (FORM) ===================== */

export interface SupplierBillProductItem {
  productId?: string;
  qty?: number;
  freeQty?: number;
  mrp?: number;
  sellingPrice?: number;
  landingCost?: number;
  margin?: number;
  discount1?: number;
  discount2?: number;
  taxAmount?: number;
  total?: number;
  mfgDate?: string;
  expiryDate?: string;
}

export interface SupplierBillProductDetails {
  item?: SupplierBillProductItem[];
  totalQty?: number;
  totalTax?: number;
  total?: number;
}

/* ===================== RETURN PRODUCT ===================== */

export interface SupplierBillReturnProductItem {
  productId?: string;
  qty?: number;
  discount1?: number;
  discount2?: number;
  taxAmount?: number;
  landingCost?: number;
  total?: number;
}

export interface SupplierBillReturnProductSummary {
  grossAmount?: number;
  taxAmount?: number;
  roundOff?: number;
  netAmount?: number;
}

export interface SupplierBillReturnProductDetails {
  item?: SupplierBillReturnProductItem[];
  totalQty?: number;
  total?: number;
  summary?: SupplierBillReturnProductSummary;
}

/* ===================== ADDITIONAL CHARGES ===================== */

export interface AdditionalChargeItem {
  chargeId?: string;
  value?: number;
  taxRate?: number;
  total?: number;
}

export interface AdditionalChargeDetails {
  item?: AdditionalChargeItem[];
  total?: number;
}

/* ===================== SUMMARY ===================== */

export interface SupplierBillSummary {
  flatDiscount?: number;
  grossAmount?: number;
  itemDiscount?: number;
  taxableAmount?: number;
  itemTax?: number;
  additionalChargeAmount?: number;
  additionalChargeTax?: number;
  billDiscount?: number;
  roundOff?: number;
  netAmount?: number;
  taxSummary?: {
    name: string;
    rate: number;
    amount: number;
  }[];
}

/* ===================== FORM VALUES ===================== */

export interface SupplierBillFormValues {
  supplierId: string;
  supplierBillNo?: string;
  referenceBillNo?: string;
  supplierBillDate: string | Date;
  paymentTerm?: string;
  dueDate?: string | Date;
  reverseCharge?: boolean;
  shippingDate?: string | Date;
  taxType?: string;
  invoiceAmount?: string;
  productDetails?: SupplierBillProductDetails;
  returnProductDetails?: SupplierBillReturnProductDetails;
  additionalCharges?: AdditionalChargeDetails;
  termsAndConditionIds?: string[];
  notes?: string;
  summary?: SupplierBillSummary;
  paidAmount?: number;
  balanceAmount?: number;
  paymentStatus?: "paid" | "unpaid" | "partial";
  status?: "active" | "cancelled";
  companyId?: string;
  isActive?: boolean;
  _submitAction?: string;
}

/* ===================== UI ROW TYPES ===================== */

export interface ProductRow {
  productId: string;
  itemCode: string;
  qty: string | number;
  freeQty: string | number;
  unit: string;
  unitCost: string | number;
  mrp: string | number;
  sellingPrice: string | number;
  disc1: string | number;
  disc2: string | number;
  taxableAmount: string | number;
  itemTax: string | number;
  landingCost: string | number;
  margin: string | number;
  totalAmount: string | number;
  mfgDate: string;
  expiryDate: string;
  taxRate?: number | string;
  taxName?: string;
}

export interface AdditionalChargeRow {
  chargeId: string;
  taxableAmount: string;
  tax: string;
  taxAmount: string;
  totalAmount: string;
}

export interface AdditionalChargesSectionProps {
  show: boolean;
  onToggle: (value: boolean) => void;
  rows: AdditionalChargeRow[];
  onAdd: () => void;
  onRemove: (index: number) => void;
  onChange: (index: number, field: keyof AdditionalChargeRow, value: string | number | string[]) => void;
  taxOptions: SelectOptionType[];
  isTaxLoading: boolean;
  flatDiscount: string | number;
  onFlatDiscountChange: (value: string | number) => void;
  summary: SupplierBillSummary;
  isAdditionalChargeLoading: boolean;
  additionalChargeOptions: SelectOptionType[];
  roundOffAmount: string | number;
  onRoundOffAmountChange: (value: string | number) => void;
}

export interface TaxDetailsProps {
  rows: ProductRow[];
  additionalChargeRows: AdditionalChargeRow[];
  flatDiscount: string | number;
  roundOffAmount: string | number;
}

/* ===================== COMPONENT PROPS ===================== */

export interface SupplierBillDetailsProps {
  supplierOptions: SelectOptionType[];
  selectedSupplier: BillSupplier | null;
  isEditing: boolean;
  companyOptions: SelectOptionType[];
  isCompanyLoading: boolean;
  isSupplierDisabled?: boolean;
}

/* ===================== API BASE ===================== */

export interface SupplierBillBase extends CommonDataType {
  supplierId?: BillSupplier;
  supplierBillNo?: string;
  referenceBillNo?: string;
  supplierBillDate?: string;
  purchaseOrderId?: string | null;
  paymentTerm?: string;
  dueDate?: string;
  reverseCharge?: boolean;
  shippingDate?: string;
  taxType?: string;
  invoiceAmount?: string;
  productDetails?: {
    item?: (Omit<SupplierBillProductItem, "productId"> & {
      productId?: ProductBase;
    })[];
    totalQty?: number;
    totalTax?: number;
    total?: number;
  };

  returnProductDetails?: SupplierBillReturnProductDetails;

  additionalCharges?: {
    item?: (Omit<AdditionalChargeItem, "chargeId"> & {
      chargeId?: {
        _id: string;
        name?: string;
        type?: string;
      };
    })[];
    total?: number;
  };

  termsAndConditionIds?: TermsConditionBase[];

  notes?: string;

  summary?: SupplierBillSummary;

  paidAmount?: number;
  balanceAmount?: number;

  paymentStatus?: "paid" | "unpaid" | "partial";
  status?: "active" | "cancelled";

  companyId?: {
    _id: string;
    name?: string;
  };

  isActive?: boolean;
}

/* ===================== PAYLOADS ===================== */

export type AddSupplierBillPayload = SupplierBillFormValues;

export type EditSupplierBillPayload = Partial<SupplierBillFormValues> & {
  supplierBillId: string;
};

/* ===================== API RESPONSES ===================== */

export interface SupplierBillDataResponse extends PageStatus {
  supplierBill_data: SupplierBillBase[];
  totalData: number;
}

export interface SupplierBillApiResponse extends MessageStatus {
  data: SupplierBillDataResponse;
}
export interface SupplierBillTabsProps {
  tabValue: number;
  setTabValue: (value: number) => void;
  rows: ProductRow[];
  handleAdd: () => void;
  handleCut: (index: number) => void;
  handleRowChange: (index: number, field: keyof ProductRow, value: string | number | string[]) => void;
  productOptions: SelectOptionType[];
  isProductLoading: boolean;
  termsList: TermsConditionBase[];
  handleDeleteTerm: (index: number) => void;
  returnRows: ProductRow[];
  handleAddReturn: () => void;
  handleCutReturn: (index: number) => void;
  handleReturnRowChange: (index: number, field: keyof ProductRow, value: string | number | string[]) => void;
  returnRoundOffAmount: string | number;
  onReturnRoundOffAmountChange: (value: string | number) => void;
  isProductDisabled?: boolean;
  isTermsDisabled?: boolean;
}
