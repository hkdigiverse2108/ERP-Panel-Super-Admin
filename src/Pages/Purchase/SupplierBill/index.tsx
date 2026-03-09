import { Box } from "@mui/material";
import { useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { Mutations, Queries } from "../../../Api";
import { AdvancedSearch, CalculateGridSummary, CommonActionColumn, CommonBreadcrumbs, CommonCard, CommonDataGrid, CommonDataGridSummaryFooter, CommonDeleteModal, CommonObjectNameColumn, CommonStatsCard } from "../../../Components/Common";
import { PAGE_TITLE, ROUTES } from "../../../Constants";
import { BREADCRUMBS, PAYMENT_STATUS_OPTIONS } from "../../../Data";
import type { AppGridColDef, SupplierBillBase } from "../../../Types";
import { CreateFilter, FormatDate, GenerateOptions } from "../../../Utils";
import { useDataGrid, usePagePermission } from "../../../Utils/Hooks";

const SupplierBill = () => {
  const { paginationModel, setPaginationModel, sortModel, setSortModel, filterModel, setFilterModel, rowToDelete, setRowToDelete, isActive, setActive, advancedFilter, updateAdvancedFilter, params } = useDataGrid();
  const navigate = useNavigate();
  const permission = usePagePermission(PAGE_TITLE.SUPPLIER_BILL.BASE);
  const { data, isLoading, isFetching } = Queries.useGetSupplierBillDetails(params);
  const { data: CompanyData, isLoading: CompanyDataLoading } = Queries.useGetCompanyDropdown();
  const { mutate: deleteSupplierBill } = Mutations.useDeleteSupplierBill();
  const { mutate: editSupplierBill } = Mutations.useEditSupplierBill();
  const handleDeleteBtn = () => {
    if (!rowToDelete) return;
    deleteSupplierBill(rowToDelete?._id as string, {
      onSuccess: () => setRowToDelete(null),
    });
  };

  const rows = useMemo(() => {
    return (
      data?.data?.supplierBill_data.map((r: SupplierBillBase) => ({
        ...r,
        id: r?._id,
        billAmount: r?.summary?.netAmount ?? Number(r?.invoiceAmount ?? 0),
        taxAmount: Number(r?.summary?.taxAmount ?? 0),
        paidAmount: Number(r.paidAmount || 0),
        balanceAmount: Number(r.balanceAmount || 0),
      })) || []
    );
  }, [data]);

  const summary = useMemo(() => {
    return CalculateGridSummary(rows, ["billAmount", "taxAmount", "paidAmount", "balanceAmount"]);
  }, [rows]);

  const stats = useMemo(() => {
    const totalAmount = rows.reduce((acc, r) => acc + Number(r?.billAmount || 0), 0);
    const paidAmount = rows.reduce((acc, r) => acc + Number(r.paidAmount || 0), 0);
    const unpaidAmount = rows.reduce((acc, r) => acc + Number(r.balanceAmount || 0), 0);
    return [
      { label: "Total Expense", value: Math.round(totalAmount) },
      { label: "Paid", value: Math.round(paidAmount) },
      { label: "Unpaid", value: Math.round(unpaidAmount) },
    ];
  }, [rows]);
  const filter = [CreateFilter("Payment Status", "paymentStatus", advancedFilter, updateAdvancedFilter, PAYMENT_STATUS_OPTIONS, false, { xs: 12, sm: 6, md: 3 }), CreateFilter("Select Company", "companyFilter", advancedFilter, updateAdvancedFilter, GenerateOptions(CompanyData?.data), CompanyDataLoading, { xs: 12, sm: 6, md: 3 })];

  const columns: AppGridColDef<SupplierBillBase>[] = [
    { field: "paymentStatus", headerName: "Status", headerAlign: "center", width: 110, renderCell: (params) => <span className={`status-${params.row.paymentStatus}`}>{params.row.paymentStatus}</span> },
    CommonObjectNameColumn<SupplierBillBase>("companyId", { headerName: "Company", width: 200 }),
    { field: "supplierBillNo", headerName: "Bill No", width: 160 },

    { field: "supplierId", headerName: "Supplier", width: 240, valueGetter: (_, row: SupplierBillBase) => (row?.supplierId ? row.supplierId.name || `${row.supplierId.firstName || ""} ${row.supplierId.lastName || ""}`.trim() || row.supplierId.companyName || "" : "") },

    { field: "supplierBillDate", headerName: "Bill Date", width: 140, valueGetter: (v) => FormatDate(v) },

    { field: "billAmount", headerName: "Bill Amount", width: 150, type: "number" },

    { field: "paidAmount", headerName: "Paid Amount", width: 140, type: "number" },

    { field: "balanceAmount", headerName: "Due Amount", width: 140, type: "number" },

    { field: "taxAmount", headerName: "Tax Amount", width: 140, type: "number" },

    { field: "dueDate", headerName: "Due Date", width: 140, valueGetter: (v) => FormatDate(v) },

    { field: "notes", headerName: "Notes", width: 280 },

    ...(permission?.edit || permission?.delete
      ? [
          CommonActionColumn<SupplierBillBase>({
            ...(permission?.edit && { active: (row) => editSupplierBill({ supplierBillId: row?._id, isActive: !row.isActive }), editRoute: ROUTES.SUPPLIER_BILL.ADD_EDIT }),
            ...(permission?.delete && { onDelete: (row) => setRowToDelete({ _id: row?._id, title: row?.supplierBillNo }) }),
          }),
        ]
      : []),
  ];
  const gridOptions = {
    columns,
    rows,
    rowCount: data?.data?.totalData || 0,
    loading: isLoading || isFetching,
    isActive,
    setActive,
    ...(permission?.add && { handleAdd: () => navigate(ROUTES.SUPPLIER_BILL.ADD_EDIT) }),
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
  return (
    <>
      <CommonBreadcrumbs title={PAGE_TITLE.SUPPLIER_BILL.BASE} breadcrumbs={BREADCRUMBS.SUPPLIER_BILL.BASE} />
      <Box sx={{ p: { xs: 2, md: 3 }, display: "grid", gap: 2 }}>
        <CommonStatsCard stats={stats} />
        <AdvancedSearch filter={filter} />
        <CommonCard hideDivider>
          <CommonDataGrid {...gridOptions} />
        </CommonCard>
        <CommonDeleteModal open={Boolean(rowToDelete)} itemName={rowToDelete?.title} onClose={() => setRowToDelete(null)} onConfirm={handleDeleteBtn} />
      </Box>
    </>
  );
};
export default SupplierBill;
