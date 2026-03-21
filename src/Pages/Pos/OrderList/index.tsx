import { Box } from "@mui/material";
import { useMemo } from "react";
import { Mutations, Queries } from "../../../Api";
import { AdvancedSearch, CommonActionColumn, CommonBreadcrumbs, CommonCard, CommonDataGrid, CommonDeleteModal, CommonObjectNameColumn } from "../../../Components/Common";
import { PAGE_TITLE } from "../../../Constants";
import { BREADCRUMBS, ORDER_STATUS } from "../../../Data";
import type { AppGridColDef, PosOrderBase } from "../../../Types";
import { CreateFilter, GenerateOptions } from "../../../Utils";
import { useDataGrid, usePagePermission } from "../../../Utils/Hooks";
import { CommonObjectPropertyColumn } from "../../../Components/Common/CommonDataGrid/CommonColumns";

const OrderList = () => {
  const { paginationModel, setPaginationModel, sortModel, setSortModel, filterModel, setFilterModel, params, rowToDelete, setRowToDelete, advancedFilter, updateAdvancedFilter } = useDataGrid({});
  const permission = usePagePermission(PAGE_TITLE.POS.BASE);

  const { data: orderData, isLoading: orderDataLoading, isFetching: orderDataFetching } = Queries.useGetPosOrder(params);
  const { data: CompanyData, isLoading: CompanyDataLoading } = Queries.useGetCompanyDropdown();
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

  const filter = [CreateFilter("Select Company", "companyFilter", advancedFilter, updateAdvancedFilter, GenerateOptions(CompanyData?.data), CompanyDataLoading, { xs: 12, sm: 6, md: 3 }), CreateFilter("Select Status", "statusFilter", advancedFilter, updateAdvancedFilter, ORDER_STATUS, false, { xs: 12, sm: 6, md: 3 })];

  const columns: AppGridColDef<PosOrderBase>[] = [
    CommonObjectNameColumn<PosOrderBase>("companyId", { headerName: "Company", width: 200 }),
    { field: "orderNo", headerName: "Invoice No", width: 150 },
    CommonObjectPropertyColumn<PosOrderBase>("created", "createdAt", [], { headerName: "Date", width: 120, type: "date" }),
    CommonObjectPropertyColumn<PosOrderBase>("dueDate", "payLater", ["dueDate"], { headerName: "Due Date", width: 120, type: "date" }),
    CommonObjectPropertyColumn<PosOrderBase>("customerId", "customerId", ["firstName", "lastName"], { headerName: "Customer Name", width: 150 }),
    { field: "totalAmount", headerName: "Total Amount", flex: 1, minWidth: 120 },
    { field: "dueAmount", headerName: "Due Amount", flex: 1, minWidth: 100 },
    CommonObjectPropertyColumn<PosOrderBase>("paymentMethod", "paymentMethod", [], { headerName: "Payment Mode", width: 120, type: "format" }),
    CommonObjectPropertyColumn<PosOrderBase>("paymentStatus", "paymentStatus", [], { headerName: "Payment Status", width: 130, type: "status" }),
    { field: "redeemCreditAmount", headerName: "Credit Applied Amt", flex: 1, minWidth: 150 },
    CommonObjectPropertyColumn<PosOrderBase>("orderType", "orderType", [], { headerName: "Order Type", width: 120, type: "format" }),
    CommonObjectPropertyColumn<PosOrderBase>("salesManId", "salesManId", ["fullName"], { headerName: "Sales Man", width: 150 }),
    CommonObjectPropertyColumn<PosOrderBase>("status", "status", [], { headerName: "Status", flex: 1, minWidth: 150, type: "status" }),
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
    paginationModel,
    onPaginationModelChange: setPaginationModel,
    sortModel,
    onSortModelChange: setSortModel,
    filterModel,
    onFilterModelChange: setFilterModel,
    fileName:PAGE_TITLE.POS.ORDER_LIST,
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
