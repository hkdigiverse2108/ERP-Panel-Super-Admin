import type { FormikProps } from "formik";
import type { NavigateFunction } from "react-router-dom";
import type { CommonDataType, MessageStatus, PageStatus } from "./Common";
import type { ContactBase } from "./Contacts";
import type { ProductBase, ProductDropDownApiResponse } from "./Product";
import type { TaxBase, TaxDropdownApiResponse } from "./Tax";
import type { TermsConditionBase } from "./TermsCondition";
import type { UomBase } from "./Uom";
// import { TAX_TYPE, ORDER_STATUS } from "../../Data";

export interface PurchaseOrderSummary {
  flatDiscount?: number;
  grossAmount?: number;
  discountAmount?: number;
  taxableAmount?: number;
  taxAmount?: number;
  roundOff?: number;
  netAmount?: number;
  taxSummary?: { name: string; rate: number; amount: number }[];
}

export interface PurchaseOrderBase extends Omit<PurchaseOrderFormValues, "supplierId" | "items">, CommonDataType {
  _id: string;
  supplierId?: ContactBase;
  items?: (Omit<PurchaseOrderItem, "productId"> & { productId: ProductBase })[];
}
export type Supplier = ContactBase;

export interface PurchaseOrderItem {
  productId: string | ProductBase;
  qty: number;
  name?: string;
  freeQty?: number;
  mrp?: number | string;
  sellingPrice?: number | string;
  discount1?: number | string;
  discount2?: number | string;
  taxableAmount?: number | string;
  itemCode?: string;
  unit?: string;
  uomId?: string | UomBase;
  unitCost?: number | string;
  tax?: string | null;
  landingCost?: string | null;
  margin?: string | null;
  total?: number | string;
  taxAmount?: number | string;
  taxName?: string;
  taxId?: string | TaxBase;
}
export interface PurchaseOrderFormValues {
  supplierId?: string;
  contactId?: string;
  companyId?: string;
  branchId?: string;

  date?: string | Date;
  orderDate?: string | Date;
  orderNo?: string | null;

  shippingDate?: string | Date | null;
  shippingNote?: string | null;
  placeOfSupply?: string | null;
  billingAddress?: string | null;
  gstIn?: string | null;
  // taxType?: TAX_TYPE;

  items?: PurchaseOrderItem[];

  termsAndConditionIds?: string[];

  notes?: string | null;

  // totalQty?: string | null;
  // totalTax?: string | null;
  // total?: string | null;

  summary?: PurchaseOrderSummary;

  status?: string;
  taxType?: string;

  isActive?: boolean;
  _submitAction?: string;
}
export interface AddPurchaseOrderPayload extends Omit<PurchaseOrderFormValues, "supplierId" | "contact"> {
  supplierId: string;
  items: PurchaseOrderItem[];
}
export interface EditPurchaseOrderPayload extends PurchaseOrderFormValues {
  purchaseOrderId: string;
}
interface PurchaseOrderSummaryResponse {
  allOrders: number;
  cancelled: number;
  completed: number;
  delivered: number;
  exceed: number;
  inProgress: number;
}
export interface PurchaseOrderDataResponse extends PageStatus {
  purchaseOrder_data: PurchaseOrderBase[];
  summary: PurchaseOrderSummaryResponse;
}

export interface PurchaseOrderApiResponse extends MessageStatus {
  data: PurchaseOrderDataResponse;
}

export interface SinglePurchaseOrderApiResponse extends MessageStatus {
  data: PurchaseOrderBase;
}

export interface PurchaseOrderDropdownApiResponse extends MessageStatus {
  data: PurchaseOrderBase[];
}

export interface ProductSelectCellProps {
  index: number;
  productData?: ProductDropDownApiResponse;
  taxData?: TaxDropdownApiResponse;
  isLoading: boolean;
}

export interface BillingSummaryProps {
  productData?: ProductDropDownApiResponse;
}

export interface PurchaseOrderFormContentProps extends FormikProps<PurchaseOrderFormValues> {
  isEditing: boolean;
  addLoading: boolean;
  editLoading: boolean;
  navigate: NavigateFunction;
  supplierQueryEnabled?: boolean;
}

export interface SelectTermsModalProps {
  open: boolean;
  onClose: () => void;
  onSave: (selected: TermsConditionBase[]) => void;
  alreadySelected: TermsConditionBase[];
  companyId?: string;
}

export interface TaxDetailsTableProps {
  items: PurchaseOrderItem[];
  productData: ProductBase[];
  taxType?: string;
}
