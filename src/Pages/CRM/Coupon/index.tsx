import { Box } from "@mui/material";
import { useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { Mutations, Queries } from "../../../Api";
import { AdvancedSearch, CommonActionColumn, CommonBreadcrumbs, CommonCard, CommonDataGrid, CommonDeleteModal } from "../../../Components/Common";
import { PAGE_TITLE, ROUTES } from "../../../Constants";
import { BREADCRUMBS } from "../../../Data";
import type { AppGridColDef, CouponBase } from "../../../Types";
import { useDataGrid, usePagePermission } from "../../../Utils/Hooks";
import { CreateFilter, FormatDate, GenerateOptions } from "../../../Utils";

const Coupon = () => {
  const { paginationModel, setPaginationModel, sortModel, setSortModel, filterModel, setFilterModel, rowToDelete, setRowToDelete, isActive, setActive, params, advancedFilter, updateAdvancedFilter } = useDataGrid();
  const navigate = useNavigate();
  const permission = usePagePermission(PAGE_TITLE.CRM.COUPON.BASE);

  const { data: CompanyData, isLoading: CompanyDataLoading } = Queries.useGetCompanyDropdown();

  const { data: couponData, isLoading: couponDataLoading, isFetching: couponDataFetching } = Queries.useGetCoupon({ ...params });
  const { mutate: deleteCouponMutate, isPending: isDeleteLoading } = Mutations.useDeleteCoupon();
  const { mutate: editCoupon, isPending: isEditLoading } = Mutations.useEditCoupon();

  const allCoupon = useMemo(() => couponData?.data?.coupon_data.map((item) => ({ ...item, id: item?._id })) || [], [couponData]);
  const totalRows = couponData?.data?.totalData || 0;

  const handleDeleteBtn = () => {
    if (!rowToDelete) return;
    deleteCouponMutate(rowToDelete?._id as string, { onSuccess: () => setRowToDelete(null) });
  };

  const handleAdd = () => navigate(ROUTES.COUPON.ADD_EDIT);

  const columns: AppGridColDef<CouponBase>[] = [
    { field: "name", headerName: "Coupon name", width: 170 },
    {
      field: "companyId",
      headerName: "Company Name",
      width: 150,
      valueGetter: (_value, row) => {
        if (typeof row.companyId === "object") return row.companyId?.name;
        return CompanyData?.data?.find((c) => c._id === row.companyId)?.name || "";
      },
    },
    { field: "couponPrice", headerName: "Coupon Price", width: 100 },
    { field: "redeemValue", headerName: "Redeem value", width: 120 },
    { field: "usageLimit", headerName: "Usage limit", width: 100 },
    { field: "usedCount", headerName: "Used count", width: 100 },
    { field: "expiryDays", headerName: "Expiry days", width: 100 },
    { field: "endDate", headerName: "End Date", width: 150, renderCell: (params) => FormatDate(params.row.endDate) },
    { field: "startDate", headerName: "Start Date", width: 150, renderCell: (params) => FormatDate(params.row.startDate) },
    { field: "redemptionType", headerName: "Redemption Type", width: 150, renderCell: (params) => params.row.redemptionType },
    { field: "singleTimeUse", headerName: "Single Time Use", width: 150, renderCell: (params) => (params.row.singleTimeUse ? "Yes" : "No") },
    { field: "status", headerName: "Status", flex: 1, minWidth: 100, renderCell: (params) => params.row.status },
    ...(permission?.edit || permission?.delete
      ? [
        CommonActionColumn<CouponBase>({
          ...(permission?.edit && {
            active: (row) => editCoupon({ couponId: row?._id, isActive: !row.isActive }),
            editRoute: ROUTES.COUPON.ADD_EDIT,
          }),
          ...(permission?.delete && { onDelete: (row) => setRowToDelete({ _id: row?._id, title: row?.name }) }),
        }),
      ]
      : []),
  ];

  const CommonDataGridOption = {
    columns,
    rows: allCoupon,
    rowCount: totalRows,
    loading: couponDataLoading || couponDataFetching || isEditLoading,
    isActive,
    setActive,
    ...(permission?.add && { handleAdd }),
    paginationModel,
    onPaginationModelChange: setPaginationModel,
    sortModel,
    onSortModelChange: setSortModel,
    filterModel,
    onFilterModelChange: setFilterModel,
    isExport: false,
  };

  const filter = [CreateFilter("Select Company", "companyFilter", advancedFilter, updateAdvancedFilter, GenerateOptions(CompanyData?.data), CompanyDataLoading, { xs: 12, sm: 6, md: 3 })];

  return (
    <>
      <CommonBreadcrumbs title={PAGE_TITLE.CRM.COUPON.BASE} maxItems={1} breadcrumbs={BREADCRUMBS.COUPON.BASE} />
      <Box sx={{ p: { xs: 2, md: 3 }, display: "grid", gap: 2 }}>
        <AdvancedSearch filter={filter} />
        <CommonCard hideDivider>
          <CommonDataGrid {...CommonDataGridOption} />
        </CommonCard>
        <CommonDeleteModal open={Boolean(rowToDelete)} itemName={rowToDelete?.title} loading={isDeleteLoading} onClose={() => setRowToDelete(null)} onConfirm={() => handleDeleteBtn()} />
      </Box>
    </>
  );
};

export default Coupon;
