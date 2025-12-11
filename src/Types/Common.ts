import type { Breakpoint, ButtonProps, DrawerProps, PaperProps as MuiPaperProps } from "@mui/material";
import type { GridColDef, GridFilterModel, GridPaginationModel, GridSortModel } from "@mui/x-data-grid";
import type { Dayjs } from "dayjs";
import type { ReactNode } from "react";
import * as Yup from "yup";

type GridType = number | object | "auto" | "grow";

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
}

export interface CommonValidationSelectProps extends CommonSelectProps {
  name: string;
}

// ************ Select End ***********

// ************ Date Range Selector Start ***********

export interface CommonDateRangeSelectorProps {
  value: { start: Dayjs; end: Dayjs };
  onChange: (range: { start: Dayjs; end: Dayjs }) => void;
  BoxClassName?: string;
  active?: string;
}

// ************ Date Range Selector End ***********

// ************ Table Start ***********

export interface Params {
  [key: string]: any;
}

export interface UseDataGridOptions {
  page?: number;
  pageSize?: number;
  initialSort?: GridSortModel;
  initialFilter?: GridFilterModel;
}

export interface CommonColumn<T = any> {
  field: keyof T | string;
  headerName: string;
  width?: number;
  flex?: number;
  sortable?: boolean;
  align?: "left" | "right" | "center";
  headerAlign?: "left" | "right" | "center";
  renderCell?: (params: any) => React.ReactNode;
}

export interface CommonDataGridProps<T = any> {
  columns: GridColDef[];
  rows: T[];
  rowCount: number;
  loading?: boolean;

  // Pagination
  paginationModel: GridPaginationModel;
  onPaginationModelChange: (model: GridPaginationModel) => void;

  // Sorting
  sortModel: GridSortModel;
  onSortModelChange: (model: GridSortModel) => void;

  // Filter
  filterModel: GridFilterModel;
  onFilterModelChange: (model: GridFilterModel) => void;

  pageSizeOptions?: number[];
  defaultHidden?: string[];
  BoxClass?: string;
}

// ************ Table End ***********

// ************ Input Start ***********

export interface CommonTextFieldProps {
  label?: string;
  name: string;
  type?: string;
  placeholder?: string;
  required?: boolean;
  autoComplete?: string;
  isFormLabel?: boolean;
  grid?: object;
  validating?: boolean;
  clearable?: boolean;
  startIcon?: ReactNode;
  endIcon?: ReactNode;
  showPasswordToggle?: boolean;
  [key: string]: any;
}

// ************ Input End ***********

// ************ Button Start ***********

export interface CommonButtonProps extends ButtonProps {
  loading?: boolean;
  loadingPosition?: "start" | "end";
  disabled?: boolean;
  title?: string;
  grid?: object;
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

export type   MuiNotificationType = "success" | "info" | "warning" | "error";

// ************ Notification End ***********

// ************ Common Api Data Type Start ***********

export interface PageState {
  page: number;
  limit: number;
  page_limit: number;
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
  isDeleted: boolean;
  isActive: boolean;
  createdBy: null;
  updatedBy: null;
  createdAt: string;
  updatedAt: string;
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
}

export interface CommonSwitchProps extends CommonValidationSwitchProps {
  // For NON-FORMIK switch
  value?: boolean;
  onChange?: (val: boolean) => void;
}

// ************ Common Switch End ***********