import { Box } from "@mui/material";
import { useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { Mutations, Queries } from "../../../Api";
import { CommonActionColumn, CommonBreadcrumbs, CommonCard, CommonDataGrid, CommonDeleteModal } from "../../../Components/Common";
import { PAGE_TITLE, ROUTES } from "../../../Constants";
import { BREADCRUMBS } from "../../../Data";
import type { AppGridColDef, BillOfLiveProductBase } from "../../../Types";
import { useDataGrid, usePagePermission } from "../../../Utils/Hooks";
import { FormatDate } from "../../../Utils";

const BillOfLiveProduct = () => {
  const { paginationModel, setPaginationModel, sortModel, setSortModel, filterModel, setFilterModel, rowToDelete, setRowToDelete, isActive, setActive, params } = useDataGrid();
  const navigate = useNavigate();
  const permission = usePagePermission(PAGE_TITLE.INVENTORY.BILL_OF_LIVE_PRODUCT.BASE);
  const { data, isLoading, isFetching } = Queries.useGetBillOfLiveProduct(params);
  const { mutate: deleteBOM, isPending: isDeleteLoading } = Mutations.useDeleteBillOfLiveProduct();
  const { mutate: editBOM, isPending: isEditLoading } = Mutations.useEditBillOfLiveProduct();
  const rows = useMemo(() => {
    return data?.data?.billOfLiveProduct_data.map((item) => ({ ...item, id: item._id, createdByName: item.createdBy || "" })) || [];
  }, [data]);

  const totalRows = data?.data?.totalData || 0;

  const handleAdd = () => navigate(ROUTES.BILL_OF_LIVE_PRODUCT.ADD_EDIT, { state: { no: data?.data?.totalData } });

  const handleDelete = () => {
    if (!rowToDelete) return;
    deleteBOM(rowToDelete._id as string, {
      onSuccess: () => setRowToDelete(null),
    });
  };

  const columns: AppGridColDef<BillOfLiveProductBase>[] = [
    { field: "number", headerName: "Bill Of Live Product No.", width: 400 },
    { field: "date", headerName: "Bill Of Live Product Date", valueGetter: (v) => FormatDate(v), flex: 1 },
    ...(permission?.edit || permission?.delete
      ? [
          CommonActionColumn<BillOfLiveProductBase>({
            ...(permission?.edit && { active: (row) => editBOM({ billOfLiveProductId: row?._id, isActive: !row.isActive }), editRoute: ROUTES.BILL_OF_LIVE_PRODUCT.ADD_EDIT }),
            ...(permission?.delete && { onDelete: (row) => setRowToDelete({ _id: row?._id, title: row.number }) }),
          }),
        ]
      : []),
  ];

  const gridOptions = {
    columns,
    rows,
    rowCount: totalRows,
    loading: isLoading || isFetching || isEditLoading,
    isActive,
    setActive,
    handleAdd,
    paginationModel,
    onPaginationModelChange: setPaginationModel,
    sortModel,
    onSortModelChange: setSortModel,
    filterModel,
    onFilterModelChange: setFilterModel,
  };

  return (
    <>
      <CommonBreadcrumbs title={PAGE_TITLE.INVENTORY.BILL_OF_LIVE_PRODUCT.BASE} maxItems={1} breadcrumbs={BREADCRUMBS.BILL_OF_LIVE_PRODUCT.BASE} />

      <Box sx={{ p: { xs: 2, md: 3 }, display: "grid", gap: 2 }}>
        <CommonCard hideDivider>
          <CommonDataGrid {...gridOptions} />
        </CommonCard>
        <CommonDeleteModal open={Boolean(rowToDelete)} itemName={rowToDelete?.title} loading={isDeleteLoading} onClose={() => setRowToDelete(null)} onConfirm={handleDelete} />
      </Box>
    </>
  );
};

export default BillOfLiveProduct;
