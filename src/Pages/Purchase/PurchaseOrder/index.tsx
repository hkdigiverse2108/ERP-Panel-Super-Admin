import { Box } from "@mui/material";
import { useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { Mutations, Queries } from "../../../Api";
import { CommonActionColumn, CommonBreadcrumbs, CommonCard, CommonDataGrid, CommonDeleteModal } from "../../../Components/Common";
import { PAGE_TITLE, ROUTES } from "../../../Constants";
import { BREADCRUMBS } from "../../../Data";
import type { AppGridColDef, PurchaseOrderBase } from "../../../Types";
import { useDataGrid } from "../../../Utils/Hooks";

const PurchaseOrder = () => {
  const { paginationModel, setPaginationModel, sortModel, setSortModel, filterModel, setFilterModel, rowToDelete, setRowToDelete, isActive, setActive, params } = useDataGrid();
  const navigate = useNavigate();

  const { data: purchaseOrderData, isLoading: purchaseOrderDataLoading, isFetching: purchaseOrderDataFetching } = Queries.useGetPurchaseOrder(params);
  const { mutate: deletePurchaseOrderMutate } = Mutations.useDeletePurchaseOrder();
  const { mutate: editPurchaseOrder, isPending: isEditLoading } = Mutations.useEditPurchaseOrder();

  const allPurchaseOrder = useMemo(() => purchaseOrderData?.data?.purchase_orders?.map((purchaseOrder) => ({ ...purchaseOrder, id: purchaseOrder._id })) || [], [purchaseOrderData]);

  const totalRows = purchaseOrderData?.data?.totalData || 0;

  const handleDeleteBtn = () => {
    if (!rowToDelete) return;
    deletePurchaseOrderMutate(rowToDelete?._id as string, { onSuccess: () => setRowToDelete(null) });
  };

  const handleAdd = () => navigate(ROUTES.PURCHASE_ORDER.ADD_EDIT);

  const columns: AppGridColDef<PurchaseOrderBase>[] = [
    { field: "status", headerName: "Status", width: 170 },
    { field: "productId", headerName: "Product", width: 170 },
    { field: "orderNo", headerName: "Order No", width: 170 },
    { field: "shippingDate", headerName: "Shipping Date", width: 240 },
    // { field: "supplier", headerName: "Supplier", width: 150, valueGetter: (params) => params.row?.supplierId?.name || params.row?.contactName || "N/A" },

    { field: "webSite", headerName: "Website", width: 170 },
    { field: "notes", headerName: "Notes", flex: 1, minWidth: 150 },
    CommonActionColumn({
      active: (row) => editPurchaseOrder({ purchaseOrderId: row?._id, isActive: !row.isActive }),
      editRoute: ROUTES.PURCHASE_ORDER.ADD_EDIT,
      onDelete: (row) => setRowToDelete({ _id: row?._id }),
    }),
  ];

  const CommonDataGridOption = {
    columns,
    rows: allPurchaseOrder,
    rowCount: totalRows,
    loading: purchaseOrderDataLoading || purchaseOrderDataFetching || isEditLoading,
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
      <CommonBreadcrumbs title={PAGE_TITLE.PURCHASE_ORDER.BASE} maxItems={1} breadcrumbs={BREADCRUMBS.PURCHASE_ORDER.BASE} />
      <Box sx={{ p: { xs: 2, md: 3 }, display: "grid", gap: 2 }}>
        <CommonCard hideDivider>
          <CommonDataGrid {...CommonDataGridOption} />
        </CommonCard>
        <CommonDeleteModal open={Boolean(rowToDelete)} itemName={rowToDelete?.title} onClose={() => setRowToDelete(null)} onConfirm={() => handleDeleteBtn()} />
      </Box>
    </>
  );
};

export default PurchaseOrder;
