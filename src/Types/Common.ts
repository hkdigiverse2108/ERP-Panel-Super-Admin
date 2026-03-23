import type { Breakpoint, ButtonProps, DrawerProps, PaperProps as MuiPaperProps, SxProps, TextFieldProps } from "@mui/material";
import type { GridColDef, GridFilterModel, GridPaginationModel, GridRowsProp, GridSlotsComponentsProps, GridSortModel, GridValidRowModel } from "@mui/x-data-grid";
import type { Dayjs } from "dayjs";
import type { MuiTelInputProps } from "mui-tel-input";
import type { FocusEvent, ReactNode } from "react";
import * as Yup from "yup";
import type { BrandBase } from "./Brand";
import type { CategoryBase } from "./Category";
import type { LocationBase } from "./Location";
import type { RolesBase } from "./Roles";
import type { TaxBase } from "./Tax";
import type { UomBase } from "./Uom";
import type { TermsConditionBase } from "./TermsCondition";
import type { AdditionalChargesBase } from "./AdditionalCharges";
import type { BankTransactionBase } from "./BankTransaction";
import type { PosCreditNoteBase } from "./PosCreditNote";
import type { Theme } from "@emotion/react";
import type { ProductTypeBase } from "./ProductType";

export type GridType = number | object | "auto" | "grow";

export interface PhoneNumberType {
  countryCode?: string;
  phoneNo?: string;
}

export type AppGridColDef<T extends GridValidRowModel> = GridColDef<T> & {
  exportFormatter?: (value: unknown, row: T) => string | number;
  isSummary?: boolean;
};

// ************ Drawer Start ***********

export interface CommonDrawerProps extends Omit<DrawerProps, "anchor" | "title"> {
  open: boolean;
  onClose: () => void;
  anchor?: "left" | "right" | "top" | "bottom";
  title?: React.ReactNode;
  width?: number | string;
  fullScreenBelow?: Breakpoint;
  showDivider?: boolean;
  hideCloseButton?: boolean;
  paperProps?: MuiPaperProps;
}

// ************ Drawer End ***********

// ************ Select Start ***********

export type SelectOptionType = {
  label: string;
  value: string;
};

export interface CommonSelectProps {
  label?: string;
  options: SelectOptionType[];
  value: string[];
  onChange: (values: string[]) => void;
  multiple?: boolean;
  limitTags?: number;
  size?: "small" | "medium";
  grid?: GridType;
  required?: boolean;
  disabled?: boolean;
  readOnly?: boolean;
  variant?: "standard" | "outlined" | "filled";
  placeholder?: string;
  syncFieldName?: string;
  isLoading?: boolean;
}

export interface CommonValidationSelectProps extends Omit<CommonSelectProps, "onChange" | "value"> {
  name: string;
}

// ************ Select End ***********

// ************ Common Phone Number start ***********

export interface CommonPhoneNumberProps extends Omit<MuiTelInputProps, "value" | "onChange" | "name" | "forceCallingCode"> {
  countryCodeName: string; // Formik field
  numberName: string; // Formik field
  label?: string;
  required?: boolean;
  isFormLabel?: boolean;
  grid?: object | number;
}

// ************  Common Phone Number End ***********

// ************ Date Range Selector Start ***********

export interface CommonDateRangeSelectorProps {
  value: { start: Dayjs; end: Dayjs };
  onChange: (range: { start: Dayjs; end: Dayjs }) => void;
  BoxClassName?: string;
  active?: string;
}

export type DatePickerOption = {
  minDate?: any;
  maxDate?: any;
};

export interface CommonValidationDatePickerProps extends DatePickerOption {
  name: string;
  disabled?: boolean;
  grid?: GridType;
  required?: boolean;
  label?: string;
  pickerType?: "date" | "datetime";
}

export interface CommonDatePickerProps extends CommonValidationDatePickerProps {
  value: any;
  onChange: (value: any) => void;
}

// ************ Date Range Selector End ***********

// ************ Time Selector Start ***********

export type TimePickerOption = {
  minTime?: any;
  maxTime?: any;
};

export interface CommonValidationTimePickerProps extends TimePickerOption {
  name: string;
  disabled?: boolean;
  grid?: GridType;
  required?: boolean;
  label?: string;
  ampm?: boolean;
}

export interface CommonTimePickerProps extends CommonValidationTimePickerProps {
  value: any;
  onChange: (value: any) => void;
}

// ************ Time Selector End ***********

// ************ Table Start ***********

export interface Params {
  [key: string]: any;
}

export interface UseDataGridOptions {
  page?: number;
  pageSize?: number;
  initialSort?: GridSortModel;
  initialFilter?: GridFilterModel;
  active?: boolean;
  debounceDelay?: number;
  pagination?: boolean;
}

export interface CommonDataGridProps {
  columns: GridColDef[];
  rows: any[];
  rowCount: number;
  loading?: boolean;

  handleAdd?: () => void;

  isActive?: boolean;
  setActive?: (active: boolean) => void;

  // Pagination
  paginationModel?: GridPaginationModel;
  onPaginationModelChange?: (model: GridPaginationModel) => void;

  // Sorting
  sortModel: GridSortModel;
  onSortModelChange: (model: GridSortModel) => void;

  // Filter
  filterModel: GridFilterModel;
  onFilterModelChange: (model: GridFilterModel) => void;

  pageSizeOptions?: number[];
  defaultHidden?: string[];
  BoxClass?: string;
  isExport?: boolean;
  fileName?: string;
  pagination?: boolean;
  isToolbar?: boolean;
  slots?: any;
  slotProps?: GridSlotsComponentsProps;
  onExportAll?: { onExportAll: () => void; isFetching: boolean };
}

export interface CustomToolbarProps {
  apiRef: any;
  columns: GridColDef[];
  rows: GridRowsProp;
  rowCount: number;
  handleAdd?: () => void;
  isActive?: boolean;
  setActive?: (active: boolean) => void;
  isExport?: boolean;
  fileName?: string;
  filterModel: GridFilterModel;
  onFilterModelChange: (model: GridFilterModel) => void;
  onExportAll?: { onExportAll: () => void; isFetching: boolean };
}

export interface ExportToExcelProps<T extends GridValidRowModel> {
  columns: readonly GridColDef[];
  rows: readonly T[];
  fileName?: string;
  title?: string;
}

export interface ExportToPDFProps<T extends GridValidRowModel> {
  columns: readonly GridColDef[];
  rows: readonly T[];
  fileName?: string;
  title?: string;
  user?: string;
  email?: string;
}

export type ColumnFormatType = "default" | "phone" | "date" | "datetime" | "format" | "status";
export interface CommonObjectNameColumnOptions {
  headerName?: string;
  width?: number;
  flex?: number;
  minWidth?: number;
  type?: ColumnFormatType;
}

export interface CommonActionColumnProps<T> {
  editRoute?: string;
  permissionRoute?: string;
  onEdit?: { handleEdit: (row: T) => void; isPermission?: (row: T) => boolean };
  onDelete?: (row: T) => void;
  active?: (row: T) => void;
  onRefund?: (row: T) => void;
  onPrint?: (row: T) => void;
  onSalesInvoice?: { handleSalesInvoice: (row: T) => void; isPermission?: (row: T) => boolean };
}
export interface CommonTableColumn<T> {
  key: string;
  header: string;
  headerClass?: string;
  bodyClass?: string;
  render?: (row: T, index: number) => ReactNode;
  footer?: ReactNode | ((data: T[]) => ReactNode);
  footerClass?: string;
}

export interface CommonTableProps<T> {
  data: T[];
  columns: CommonTableColumn<T>[];
  rowKey: (row: T, index: number) => string;
  getRowClass?: (row: T, index: number) => string;
  showFooter?: boolean;
  isLoading?: boolean;
}

// ************ Table End ***********

// ************ Input Start ***********

export interface CommonValidationTextFieldProps {
  label?: string;
  name: string;
  type?: string;
  placeholder?: string;
  required?: boolean;
  autoComplete?: string;
  isFormLabel?: boolean;
  grid?: GridType;
  validating?: boolean;
  clearable?: boolean;
  startIcon?: ReactNode;
  endIcon?: ReactNode;
  showPasswordToggle?: boolean;
  disabled?: boolean;
  currencyDisabled?: boolean;
  onFocus?: (e: FocusEvent<HTMLInputElement | HTMLTextAreaElement, Element>) => void;
  onBlur?: (e: FocusEvent<HTMLInputElement | HTMLTextAreaElement, Element>) => void;
  helperText?: string;
  multiline?: boolean;
  isCurrency?: boolean;
  color?: TextFieldProps["color"];
  focused?: boolean;
  rows?: number;
  onCurrencyLog?: (value: string) => void;
  sx?: object;
  size?: "small" | "medium";
  maxDigits?: number;
  InputLabelProps?: TextFieldProps["InputLabelProps"];
}
export interface CommonTextFieldProps extends Omit<CommonValidationTextFieldProps, "name"> {
  value: string | number;
  onChange?: (value: string) => void;
}

// ************ Input End ***********

// ************ Button Start ***********

export interface CommonButtonProps extends ButtonProps {
  loading?: boolean;
  loadingPosition?: "start" | "end";
  disabled?: boolean;
  title?: string;
  grid?: GridType;
  sx?: object;
  children?: ReactNode;
}

// ************ Button End ***********

// ************ Breadcrumb Start ***********

export interface BreadcrumbItem {
  label: string;
  href?: string;
}

export interface BreadcrumbHeaderProps {
  title: string;
  breadcrumbs?: BreadcrumbItem[];
  maxItems?: number;
}

// ************ Breadcrumb Start ***********

// ************ Validation Yup schema Start ***********

export type Primitive = string | number;
export type DepValue = Primitive | Primitive[] | undefined;

export type FieldSchemaArgs<K extends keyof FieldTypeMap> = [type: K, options?: FieldOptions<FieldTypeMap[K]>] | [type: K, label: string, options?: FieldOptions<FieldTypeMap[K]>];

export type FieldTypeMap = {
  string: Yup.StringSchema<string | null | undefined>;
  number: Yup.NumberSchema<number | null | undefined>;
  boolean: Yup.BooleanSchema<boolean | null | undefined>;
  array: Yup.ArraySchema<any[], Yup.AnyObject>;
};

export interface FieldOptions<T> {
  required?: boolean;
  extraRules?: (schema: T) => T;
  minItems?: number;
}

// ************ Validation Yup schema End ***********

// ************ Notification Start ***********

export type MuiNotificationType = "success" | "info" | "warning" | "error";

// ************ Notification End ***********

// ************ Common Api Data Type Start ***********

export interface PageState {
  page: number;
  limit: number;
  totalPages: number;
}

export interface PageStatus {
  totalData: number;
  state: PageState;
}

export interface MessageStatus {
  status: number;
  message: string;
  error: Record<string, unknown>;
}

export interface CommonDataType {
  _id: string;
  isDeleted: boolean;
  createdBy?: string | Record<string, unknown> | null;
  updatedBy?: string | Record<string, unknown> | null;
  createdAt: string;
  updatedAt: string;
  isActive?: boolean;
}

export interface AddressBase {
  address?: string;
  country?: string;
  state?: string;
  city?: string;
  pinCode?: string;
}

export interface AddressApi extends Omit<AddressBase, "country" | "state" | "city"> {
  country?: LocationBase;
  state?: LocationBase;
  city?: LocationBase;
}

// ************ Common Api Data Type End ***********

// ************ Common Switch Start ***********

export interface CommonValidationSwitchProps {
  name: string;
  label?: string;
  required?: boolean;
  disabled?: boolean;
  isFormLabel?: boolean;
  grid?: GridType;
  switchPlacement?: "start" | "between";
  syncFieldName?: string;
}

export interface CommonSwitchProps extends CommonValidationSwitchProps {
  // For NON-FORMIK switch
  value?: boolean;
  onChange?: (val: boolean) => void;
}

// ************ Common Switch End ***********

// ************ Upload Start ***********

export interface CommonUploadProps {
  title?: string;
  type?: "image" | "pdf";
}

export interface UploadResponse extends MessageStatus {
  data: string[];
}

// ************ Upload End ***********

// ************ Delete Start ***********

export interface CommonDeleteModalProps {
  open: boolean;
  title?: string;
  description?: string;
  itemName?: string;
  loading?: boolean;
  onClose: () => void;
  onConfirm?: () => void;
}

// ************ Delete End ***********

// ************ Bottom Action Bar Start ***********

export interface CommonBottomActionBarProps {
  children?: ReactNode;
  isLoading?: boolean;
  save?: boolean;
}
// ************ Bottom Action Bar End ***********

// ************ Modal Start ***********

export interface CommonModalProps {
  isOpen: boolean;
  onClose: () => void;
  className?: string;
  children: ReactNode;
  showCloseButton?: boolean;
  isFullscreen?: boolean;
  title?: string;
  subTitle?: string;
}

type UploadType = "image" | "pdf";

export interface ModalStateSlice {
  isUploadModal: { open: boolean; type: UploadType; multiple?: boolean };
  selectedFiles: string[];
  selectedTermIds: string[];
  isModalVideoPlay: { open: boolean; link: string };
  isBrandModal: { open: boolean; data: BrandBase | null };
  isUomModal: { open: boolean; data: UomBase | null };
  isTaxModal: { open: boolean; data: TaxBase | null };
  isCategoryModal: { open: boolean; data: CategoryBase | null };
  isLocationModal: { open: boolean; data: LocationBase | null };
  isRoleModal: { open: boolean; data: RolesBase | null };
  isAdditionalChargeModal: { open: boolean; data: AdditionalChargesBase | null };
  isBankTransactionModal: { open: boolean; data: BankTransactionBase | null };
  isOrderRefundModal: { open: boolean; data: PosCreditNoteBase | null };
  isProductTypeModal: { open: boolean; data: ProductTypeBase | null };
  isTermsSelectionModal: { open: boolean; data: any | null };
  isTermsAndConditionFormModal: { open: boolean; data: TermsConditionBase | null; companyId?: string };
  isTermsAndConditionSelectionModal: { open: boolean; alreadySelectedIds: string[]; companyId: string };
}

// ************ Modal End ***********

// ************ Radio start ***********

export type RadioOptionType = {
  label: string;
  value: string;
  disabled?: boolean;
};
export type ImageSyncProps = {
  activeKey: "image" | null | string;
  clearActiveKey: () => void;
};

export interface CommonRadioProps {
  label?: string;
  value: string;
  options: RadioOptionType[];
  onChange: (value: string) => void;
  row?: boolean;
  disabled?: boolean;
  grid?: GridType;
}

export interface CommonValidationRadioProps extends Omit<CommonRadioProps, "value" | "onChange"> {
  name: string;
  required?: boolean;
  onChange?: (value: string) => void;
}

// ************ Radio End ***********

// ************ Quill Input Start ***********

export interface CommonValidationQuillInputProps {
  label?: string;
  name: string;
  required?: boolean;
  placeholder?: string;
  disabled?: boolean;
  grid?: number | object;
  modules?: any;
}

// ************ Quill Input End ***********

// ************ Advanced Search Start ***********

export interface AdvancedSearchFilterOption {
  label: string;
  options: SelectOptionType[];
  value: string[];
  onChange: (values: string[]) => void;
  multiple?: boolean;
  limitTags?: number;
  grid?: GridType;
  isLoading?: boolean;
}

export interface AdvancedSearchProps {
  children?: ReactNode;
  filter?: AdvancedSearchFilterOption[];
  defaultExpanded?: boolean;
}

// ************ Advanced Search End ***********

// ************ Dependent Select End ***********

export type ApiOption = {
  _id: string;
  name?: string;
  firstName?: string;
  lastName?: string;
  title?: string;
};

export type DependentSelectProps<T extends ApiOption, P = string | undefined> = {
  params?: P;
  name: string;
  label: string;
  grid: GridType;
  required?: boolean;
  disabled?: boolean;
  enabled?: boolean;
  value?: string[];
  onChange?: (values: string[]) => void;
  multiple?: boolean;
  query: (
    params?: P,
    enabled?: boolean,
  ) => {
    data?: { data: T[] };
    isLoading: boolean;
    isFetching: boolean;
  };
};

// ************ Dependent Select End ***********
// ************ Dependent Select End ***********
export type ControlPlacement = "start" | "between";

export interface CommonValidationCheckboxProps {
  name: string;
  label?: string;
  required?: boolean;
  disabled?: boolean;
  isFormLabel?: boolean;
  grid?: GridType;
  checkboxPlacement?: ControlPlacement;
  syncFieldName?: string;
}

export interface CommonCheckboxProps extends CommonValidationCheckboxProps {
  value?: boolean;
  onChange?: (value: boolean) => void;
}

// ************ Tab Select End ***********

export interface TabPanelProps {
  children?: ReactNode;
  index: number;
  value: number;
}

// ************ Common Terms And Condition Start ***********

export interface CommonTermsAndConditionProps {
  selectedTermIds: string[];
  onChange: (ids: string[]) => void;
  isView?: boolean;
  companyId?: string;
}
export interface CommonValidationCreatableSelectProps {
  name: string;
  label: string;
  options: string[];
  required?: boolean;
  disabled?: boolean;
  grid?: GridType;
}

// ************ Common Additional Charge Start ***********
export interface AdditionalChargeItem {
  chargeId?: string | AdditionalChargesBase;
  amount?: number;
  taxAmount?: number;
  taxId?: string | TaxBase;
  totalAmount?: number;
}
// ************ Common Additional Charge End ***********
// ************ Common Transaction Summary Start ***********
export interface TaxSummaryItem {
  name: string;
  rate: number;
  amount: number;
}

export interface TransactionSummary {
  flatDiscount: number;
  grossAmount: number;
  discountAmount: number;
  taxableAmount: number;
  taxAmount: number;
  roundOff: number;
  netAmount: number;
  taxSummary?: TaxSummaryItem[];
}
// ************ Common Transaction Summary End ***********
// ************ Common Shipping Details Start ***********
export interface ShippingDetails {
  shippingType: "delivery" | "pickup";
  shippingDate: string;
  referenceNo: string;
  transportDate: string;
  modeOfTransport: string;
  transporterId?: string | null;
  vehicleNo: string;
  weight: number;
}
// ************ Common Shipping Details End ***********
export interface CommonStatsItem {
  label: string;
  value: number | string;
  color?: string;
  desc?: string;
  selected?: boolean;
  onClick?: () => void;
}

export interface CommonStatsCardProps {
  stats: CommonStatsItem[];
  grid?: GridType;
  paperSx?: SxProps<Theme>;
  variant?: "default" | "radio";
}
