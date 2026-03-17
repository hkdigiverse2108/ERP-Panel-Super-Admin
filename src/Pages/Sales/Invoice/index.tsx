import { useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { Mutations, Queries } from "../../../Api";
import { AdvancedSearch, CalculateGridSummary, CommonActionColumn, CommonBreadcrumbs, CommonCard, CommonDataGrid, CommonDataGridSummaryFooter, CommonDeleteModal, CommonStatsCard } from "../../../Components/Common";
import { PAGE_TITLE, ROUTES } from "../../../Constants";
import type { AppGridColDef, InvoiceBase } from "../../../Types";
import { CreateFilter, FormatDate, GenerateOptions } from "../../../Utils";
import { BREADCRUMBS, INVOICE_STATUS, INVOICE_STATUS_STATS } from "../../../Data";
import { Box } from "@mui/material";
import { useDataGrid } from "../../../Utils/Hooks";

const Invoice = () => {
  const { paginationModel, setPaginationModel, sortModel, setSortModel, filterModel, setFilterModel, rowToDelete, setRowToDelete, isActive, setActive, params, advancedFilter, updateAdvancedFilter } = useDataGrid();
  const navigate = useNavigate();

  const { data: invoice, isLoading: invoiceLoading, isFetching: invoiceFetching } = Queries.useGetInvoice(params);
  const { mutate: deleteInvoiceMutate } = Mutations.useDeleteInvoice();
  const { mutate: editInvoice, isPending: isEditLoading } = Mutations.useEditInvoice();

  // Filter Data Queries
  const { data: companyData, isLoading: companyDataLoading } = Queries.useGetCompanyDropdown();
  const companyId = advancedFilter?.companyFilter?.[0];
  const { data: customerData, isLoading: customerDataLoading } = Queries.useGetContactDropdown({ typeFilter: "customer", companyFilter: companyId });

  const allInvoice = useMemo(() => invoice?.data?.invoice_data?.map((invoice) => ({
    ...invoice,
    id: invoice._id,
    netAmount: Number((invoice.transactionSummary?.netAmount || 0).toFixed(2)),
    taxAmount: Number((invoice.transactionSummary?.taxAmount || 0).toFixed(2)),
    dueAmount: Number(((invoice.transactionSummary?.netAmount || 0) - (invoice.paidAmount || 0)).toFixed(2))
  })) || [], [invoice]);

  const totalRows = invoice?.data?.totalData || 0;

  const summary = useMemo(() => {
    return CalculateGridSummary(allInvoice, ["netAmount", "taxAmount", "paidAmount", "dueAmount"]);
  }, [allInvoice]);

  const handleDeleteBtn = () => {
    if (!rowToDelete) return;
    deleteInvoiceMutate(rowToDelete?._id as string, { onSuccess: () => setRowToDelete(null) });
  };

  const handleAdd = () => navigate(ROUTES.INVOICE.ADD_EDIT);

  const columns: AppGridColDef<InvoiceBase>[] = [
    { field: "invoiceNo", headerName: "Invoice No", width: 120 },
    { field: "date", headerName: "Invoice Date", width: 130, renderCell: (params) => FormatDate(params.row.date) },
    { field: "dueDate", headerName: "Due Date", width: 130, renderCell: (params) => FormatDate(params.row.dueDate) },
    { field: "customerId", headerName: "Customer Name", width: 150, valueGetter: (_, row: InvoiceBase) => (row?.customerId ? (typeof row.customerId === 'object' ? `${row.customerId.firstName || ""} ${row.customerId.lastName || ""}`.trim() || row.customerId.companyName || "" : "") : "") },
    { field: "netAmount", headerName: "Net Amount", width: 110, type: "number" },
    { field: "paidAmount", headerName: "Paid Amount", width: 110, type: "number" },
    { field: "dueAmount", headerName: "Due Amount", width: 110, type: "number" },
    { field: "status", headerName: "Status", headerAlign: "center", width: 190, renderCell: (params) => <span className={`status-${params.row.status} overflow-hidden! text-nowrap`}>{params.row.status}</span> },
    { field: "paymentStatus", headerName: "Payment Status", width: 120, renderCell: (params) => <span className={`status-${params.row.paymentStatus}`}>{params.row.paymentStatus}</span> },
    { field: "taxAmount", headerName: "Tax Amount", flex: 1, minWidth: 110 },
    CommonActionColumn({
      active: (row) => editInvoice({ invoiceId: row?._id, isActive: !row.isActive }),
      editRoute: ROUTES.INVOICE.ADD_EDIT,
      onDelete: (row) => setRowToDelete({ _id: row?._id }),
    }),
  ];

  const CommonDataGridOption = {
    columns,
    rows: allInvoice,
    rowCount: totalRows,
    loading: invoiceLoading || invoiceFetching || isEditLoading,
    isActive,
    setActive,
    handleAdd,
    paginationModel,
    onPaginationModelChange: setPaginationModel,
    sortModel,
    onSortModelChange: setSortModel,
    filterModel,
    onFilterModelChange: setFilterModel,
    slots: {
      bottomContainer: () => <CommonDataGridSummaryFooter summary={summary} />,
    },
  };

  const filter = [
    CreateFilter("Select Company", "companyFilter", advancedFilter, updateAdvancedFilter, GenerateOptions(companyData?.data), companyDataLoading, { xs: 12, sm: 6, md: 3 }),
    CreateFilter("Select Customer", "customerFilter", advancedFilter, updateAdvancedFilter, GenerateOptions(customerData?.data), customerDataLoading, { xs: 12, sm: 6, md: 3 }),
    CreateFilter("Select Status", "statusFilter", advancedFilter, updateAdvancedFilter, INVOICE_STATUS, false, { xs: 12, sm: 6, md: 3 })
  ];

  // const stats = [
  //   { label: "All Invoices", value: totalRows || 0, color: "primary" },
  //   { label: "Paid", value: allInvoice.filter((item) => item.paymentStatus === "paid").length, color: "success" },
  //   { label: "Unpaid", value: allInvoice.filter((item) => item.paymentStatus === "unpaid").length, color: "error" },
  //   { label: "Partial", value: allInvoice.filter((item) => item.paymentStatus === "partial").length, color: "warning" },
  // ];

  const STATUS_COLOR: Record<string, string> = {
    all: "primary",
    pending: "warning",
    invoice_created: "info",
    partial_invoice_created: "info",
    delivery_challan_created: "success",
    partial_delivery_challan_created: "success",
    partially_cancelled: "error",
    cancelled: "error",
  };

  const stats = INVOICE_STATUS_STATS.map((status) => ({
    label: status.label,
    value:
      status.value === "all"
        ? totalRows || 0
        : allInvoice.filter((item) => item.status === status.value).length,
    color: STATUS_COLOR[status.value] || "primary",
  }));

  return (
    <>
      <CommonBreadcrumbs title={PAGE_TITLE.INVOICE.BASE} maxItems={1} breadcrumbs={BREADCRUMBS.INVOICE.BASE} />
      <Box sx={{ p: { xs: 2, md: 3 }, display: "grid", gap: 2 }}>
        <CommonStatsCard stats={stats} grid={{ xs: 6, sm: 2, md: 2, xl: 1.3 }} />
        <AdvancedSearch filter={filter} />
        <CommonCard hideDivider>
          <CommonDataGrid {...CommonDataGridOption} />
        </CommonCard>
        <CommonDeleteModal open={Boolean(rowToDelete)} itemName={rowToDelete?.title} onClose={() => setRowToDelete(null)} onConfirm={() => handleDeleteBtn()} />
      </Box>
    </>
  );
};

export default Invoice;
