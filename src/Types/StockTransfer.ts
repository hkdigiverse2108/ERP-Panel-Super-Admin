import type { CommonDataType, MessageStatus, PageState } from "./Common";

export interface StockTransferCreatedBy {
  _id: string;
  fullName: string;
}

export interface StockTransferItem {
  productId: {
    _id: string;
    name: string;
  };
  price: number;
  requestedQty: number;
  approvedQty: number;
  receivedQty: number;
}

export interface StockTransferBase extends Omit<CommonDataType, "createdBy" | "updatedBy"> {
  createdBy: StockTransferCreatedBy;
  updatedBy: string;
  companyId: {
    _id: string;
    name: string;
  };
  branchId: {
    _id: string;
    name: string;
  };
  transferNo: string;
  requestedByBranchId: {
    _id: string;
    name: string;
  };
  requestedToBranchId: {
    _id: string;
    name: string;
  };
  status: string;
  items: StockTransferItem[];
  requestNote: string;
  approvalNote?: string;
  approvedAt?: string;
  approvedBy?: {
    _id: string;
    fullName: string;
  };
  receiptNote?: string;
  receivedAt?: string;
  receivedBy?: {
    _id: string;
    fullName: string;
  };
  id?: string;
}

export interface StockTransferApiResponse extends MessageStatus {
  data: {
    stock_transfer: StockTransferBase[];
    totalData: number;
    state: PageState;
  };
}

export interface SingleStockTransferApiResponse extends MessageStatus {
  data: StockTransferBase;
}

export interface EditStockTransferPayload {
  stockTransferId: string;
  isActive?: boolean;
}

export interface AddStockTransferPayload {
  companyId: string;
  branchId: string;
  requestedToBranchId: string;
  requestNote?: string;
  isActive?: boolean;
  items: {
    productId: string;
    requestedQty: number;
    price?: number;
  }[];
}

export interface ApproveStockTransferPayload {
  stockTransferId: string;
  approvalNote: string;
  items: {
    productId: string;
    approvedQty: number;
    price: number;
  }[];
}

export interface RejectStockTransferPayload {
  stockTransferId: string;
  approvalNote: string;
}

export interface ConfirmReceiptStockTransferPayload {
  stockTransferId: string;
  receiptNote: string;
  items: {
    productId: string;
    receivedQty: number;
  }[];
}
