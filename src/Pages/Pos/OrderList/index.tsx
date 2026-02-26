import { Box } from "@mui/material";
import dayjs from "dayjs";
import { useMemo } from "react";
import { Queries, Mutations } from "../../../Api";
import { CommonCard, CommonDataGrid, CommonBreadcrumbs, CommonActionColumn, CommonDeleteModal, AdvancedSearch } from "../../../Components/Common";
import { PAGE_TITLE } from "../../../Constants";
import { BREADCRUMBS, ORDER_STATUS } from "../../../Data";
import type { PosOrderBase, AppGridColDef } from "../../../Types";
import { useDataGrid, usePagePermission } from "../../../Utils/Hooks";
import { CreateFilter } from "../../../Utils";

const OrderList = () => {
  const { paginationModel, setPaginationModel, sortModel, setSortModel, filterModel, setFilterModel, params, rowToDelete, setRowToDelete, isActive, setActive, advancedFilter, updateAdvancedFilter } = useDataGrid({});
  const permission = usePagePermission(PAGE_TITLE.POS.BASE); // Or order list permission specifically if available

  const { data: orderData, isLoading: orderDataLoading, isFetching: orderDataFetching } = Queries.useGetPosOrder(params);
  const { mutate: deleteOrder, isPending: isDeleteLoading } = Mutations.useDeletePosOrder();
  const { mutate: editOrder, isPending: isEditLoading } = Mutations.useEditPosOrder();

  const allOrders = useMemo(() => orderData?.data?.posOrder_data?.map((order) => ({ ...order, id: order?._id })) || [], [orderData]);
  const totalRows = orderData?.data?.totalData || 0;

  const handleDeleteBtn = () => {
    if (!rowToDelete) return;
    deleteOrder(rowToDelete._id as string, {
      onSuccess: () => setRowToDelete(null),
    });
  };

  const filter = [CreateFilter("Select Status", "statusFilter", advancedFilter, updateAdvancedFilter, ORDER_STATUS, false, { xs: 12, sm: 6, md: 3 })];

  const columns: AppGridColDef<PosOrderBase>[] = [
    { field: "orderNo", headerName: "Invoice No", flex: 1, minWidth: 150 },
    {
      field: "createdAt",
      headerName: "Date",
      flex: 1,
      minWidth: 120,
      renderCell: (params) => (params.row.createdAt ? dayjs(params.row.createdAt).format("DD/MM/YYYY") : "-"),
    },
    {
      field: "dueDate",
      headerName: "Due Date",
      flex: 1,
      minWidth: 120,
      renderCell: (params) => (params.row.payLater?.dueDate ? dayjs(params.row.payLater.dueDate).format("DD/MM/YYYY") : "-"),
    },
    {
      field: "customerName",
      headerName: "Customer Name",
      flex: 1,
      minWidth: 150,  
      renderCell: (params) => {
        const customer = params.row.customerId;
        return customer ? `${customer.firstName || ""} ${customer.lastName || ""}`.trim() : "Walk-in";
      },
    },
    { field: "totalAmount", headerName: "Total Amount", flex: 1, minWidth: 120 },
    { field: "dueAmount", headerName: "Due Amount", flex: 1, minWidth: 100 },
    { field: "paymentMethod", headerName: "Payment Mode", flex: 1, minWidth: 120 },
    { field: "paymentStatus", headerName: "Payment Status", flex: 1, minWidth: 130 },
    {
      field: "creditAppliedAmt",
      headerName: "Credit Applied Amt",
      flex: 1,
      minWidth: 150,
      renderCell: (params) => (params.row.totalAmount && params.row.dueAmount ? params.row.totalAmount - params.row.dueAmount : 0),
    },
    { field: "orderType", headerName: "Order Type", flex: 1, minWidth: 100 },
    { field: "remark", headerName: "Feedback", flex: 1, minWidth: 120 },
    {
      field: "createdBy",
      headerName: "Created By",
      flex: 1,
      minWidth: 150,
      renderCell: (params) => {
        const salesMan = params.row.salesManId;
        return salesMan ? `${salesMan.fullName || ""}`.trim() : "-";
      },
    },
    { field: "channelName", headerName: "Channel Name", flex: 1, minWidth: 130, renderCell: () => "POS" },
    { field: "status", headerName: "Status", flex: 1, minWidth: 100 },
    ...(permission?.edit || permission?.delete
      ? [
          CommonActionColumn<PosOrderBase>({
            ...(permission?.edit && {
              active: (row) => editOrder({ posOrderId: row?._id, isActive: !row.isActive }),
            }),
            ...(permission?.delete && { onDelete: (row) => setRowToDelete({ _id: row?._id, title: row?.orderNo }) }),
          }),
        ]
      : []),
  ];

  const CommonDataGridOption = {
    columns,
    rows: allOrders,
    rowCount: totalRows,
    loading: orderDataLoading || orderDataFetching || isEditLoading,
    isActive,
    setActive,
    paginationModel,
    onPaginationModelChange: setPaginationModel,
    sortModel,
    onSortModelChange: setSortModel,
    filterModel,
    onFilterModelChange: setFilterModel,
  };

  return (
    <>
      <CommonBreadcrumbs title={PAGE_TITLE.POS.ORDER_LIST} breadcrumbs={BREADCRUMBS.POS_ORDER_LIST.BASE} />
      <Box sx={{ p: { xs: 2, md: 3 }, display: "grid", gap: 2 }}>
        <AdvancedSearch filter={filter} />
        <CommonCard hideDivider>
          <CommonDataGrid {...CommonDataGridOption} />
        </CommonCard>
        <CommonDeleteModal open={Boolean(rowToDelete)} itemName={rowToDelete?.title} loading={isDeleteLoading} onClose={() => setRowToDelete(null)} onConfirm={handleDeleteBtn} />
      </Box>
    </>
  );
};

export default OrderList;
