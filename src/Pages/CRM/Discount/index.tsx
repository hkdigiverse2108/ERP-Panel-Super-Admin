import { Box } from "@mui/material";
import { useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { Mutations, Queries } from "../../../Api";
import { CommonActionColumn, CommonBreadcrumbs, CommonCard, CommonDataGrid, CommonDeleteModal, CommonStatsCard } from "../../../Components/Common";
import { PAGE_TITLE, ROUTES } from "../../../Constants";
import { BREADCRUMBS } from "../../../Data";
import type { AppGridColDef, DiscountBase } from "../../../Types";
import { FormatDate, FormatPayment, FormatValidity } from "../../../Utils";
import { useDataGrid, usePagePermission } from "../../../Utils/Hooks";

const Discount = () => {
  const { paginationModel, setPaginationModel, sortModel, setSortModel, filterModel, setFilterModel, rowToDelete, setRowToDelete, isActive, setActive, params } = useDataGrid();
  const navigate = useNavigate();
  const permission = usePagePermission(PAGE_TITLE.CRM.DISCOUNT.BASE);
  const { data, isLoading, isFetching } = Queries.useGetDiscount(params);
  const { mutate: deleteDiscount } = Mutations.useDeleteDiscount();
  const { mutate: editDiscount } = Mutations.useEditDiscount();

  const handleDeleteBtn = () => {
    if (!rowToDelete) return;
    deleteDiscount(rowToDelete?._id as string, {
      onSuccess: () => setRowToDelete(null),
    });
  };

  const rows = useMemo(() => data?.data?.discount_data.map((r: DiscountBase) => ({ ...r, id: r?._id })) || [], [data]);

  const stats = useMemo(() => {
    const total = data?.data?.totalData || rows.length;
    const active = rows.filter((r) => r.isActive).length;
    return [
      { label: "Total Coupons", value: total },
      { label: "Active Coupons", value: active },
      { label: "Order with Coupons", value: 0 },
      { label: "Order without Coupons", value: 0 },
      { label: "Revenue from Coupons", value: 0 },
      { label: "Discount Given", value: 0 },
    ];
  }, [data, rows]);

  const columns: AppGridColDef<DiscountBase>[] = [
    { field: "title", headerName: "Title", width: 200 },
    { field: "createdAt", headerName: "Created On", width: 160, valueGetter: (v) => FormatDate(v) },
    { field: "validity", headerName: "Validity", width: 250, valueGetter: (v, row) => FormatValidity(v, row) },
    { field: "orders", headerName: "Orders", width: 120 },
    { field: "revenue", headerName: "Revenue", width: 120 },
    { field: "discountValue", headerName: "Discount", width: 120 },
    { field: "discountType", headerName: "Discount Type", width: 150, valueGetter: (v) => FormatPayment(v) },
    { field: "status", headerName: "Status", headerAlign: "center", flex: 1, minWidth: 100, renderCell: (params) => <span className={`status-${params.row.status}`}>{params.row.status}</span> },
    ...(permission?.edit || permission?.delete
      ? [
          CommonActionColumn<DiscountBase>({
            ...(permission?.edit && { active: (row) => editDiscount({ discountId: row?._id, isActive: !row.isActive }), editRoute: ROUTES.DISCOUNT.ADD_EDIT }),
            ...(permission?.delete && { onDelete: (row) => setRowToDelete({ _id: row?._id, title: row?.title || row?.discountCode }) }),
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
    ...(permission?.add && { handleAdd: () => navigate(ROUTES.DISCOUNT.ADD_EDIT) }),
    paginationModel,
    onPaginationModelChange: setPaginationModel,
    sortModel,
    onSortModelChange: setSortModel,
    filterModel,
    onFilterModelChange: setFilterModel,
    isExport: false,
  };

  return (
    <>
      <CommonBreadcrumbs title={PAGE_TITLE.CRM.DISCOUNT.BASE} breadcrumbs={BREADCRUMBS.DISCOUNT.BASE} />
      <Box sx={{ p: { xs: 2, md: 3 }, display: "grid", gap: 1.5 }}>
        <CommonStatsCard stats={stats} grid={{ xs: 6, sm: 4, md: 2 }} />
        <CommonCard hideDivider>
          <CommonDataGrid {...gridOptions} />
        </CommonCard>
        <CommonDeleteModal open={Boolean(rowToDelete)} itemName={rowToDelete?.title} onClose={() => setRowToDelete(null)} onConfirm={handleDeleteBtn} />
      </Box>
    </>
  );
};

export default Discount;
