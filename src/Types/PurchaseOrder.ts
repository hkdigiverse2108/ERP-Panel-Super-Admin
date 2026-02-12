import type { FormikProps } from "formik";
import type { NavigateFunction } from "react-router-dom";
import type { CommonDataType, MessageStatus, PageStatus } from "./Common";
import type { SupplierBase } from "./Contact";
import type { ProductBase, ProductDropDownApiResponse } from "./Product";
import type { TaxDropdownApiResponse } from "./Tax";
import type { TermsConditionBase } from "./TermsCondition";
// import { TAX_TYPE, ORDER_STATUS } from "../../Data";

export interface PurchaseOrderBase extends Omit<PurchaseOrderFormValues, "supplierId">, CommonDataType {
  _id: string;
  supplierId?: SupplierBase;
}
export type Supplier = SupplierBase;

export interface PurchaseOrderItem {
  productId: string;
  qty: number;
  freeQty?: number;
  mrp?: number | string;
  sellingPrice?: number | string;
  discount1?: number | string;
  discount2?: number | string;
  taxableAmount?: number | string;
  itemCode?: string;
  unit?: string;
  uomId?: string;
  unitCost?: number | string;
  tax?: string | null;
  landingCost?: string | null;
  margin?: string | null;
  total?: number | string;
  taxAmount?: number | string;
  taxName?: string;
}
export interface PurchaseOrderFormValues {
  supplierId?: string;
  contactId?: string;
  companyId?: string;

  date?: string | Date;
  orderDate?: string | Date;
  orderNo?: string | null;

  shippingDate?: string | Date | null;
  shippingNote?: string | null;

  // taxType?: TAX_TYPE;

  items?: PurchaseOrderItem[];

  termsAndConditionIds?: string[];

  notes?: string | null;

  totalQty?: string | null;
  totalTax?: string | null;
  total?: string | null;

  flatDiscount?: number;
  grossAmount?: number;
  discountAmount?: number;
  taxableAmount?: number;
  tax?: number;
  roundOff?: number;
  netAmount?: number;

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
export interface PurchaseOrderDataResponse extends PageStatus {
  purchaseOrder_data: PurchaseOrderBase[];
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
}

export interface TaxDetailsTableProps {
  items: PurchaseOrderItem[];
  productData: ProductBase[];
  taxType?: string;
}
