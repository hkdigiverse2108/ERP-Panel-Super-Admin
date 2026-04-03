import { Box, Grid } from "@mui/material";
import { useMemo, useState } from "react";
import { Mutations, Queries } from "../../../Api";
import { AdvancedSearch, CommonActionColumn, CommonBreadcrumbs, CommonCard, CommonDataGrid, CommonDeleteModal, CommonObjectNameColumn } from "../../../Components/Common";
import { PAGE_TITLE } from "../../../Constants";
import { BREADCRUMBS, ORDER_STATUS } from "../../../Data";
import type { AppGridColDef, PosOrderBase } from "../../../Types";
import { CreateFilter, DateConfig, GenerateOptions } from "../../../Utils";
import { useDataGrid, usePagePermission } from "../../../Utils/Hooks";
import { CommonObjectPropertyColumn } from "../../../Components/Common/CommonDataGrid/CommonColumns";
import type { GridRenderCellParams } from "@mui/x-data-grid";
import { CommonDateRangeSelector } from "../../../Attribute";

const OrderList = () => {
  const { paginationModel, setPaginationModel, sortModel, setSortModel, filterModel, setFilterModel, params, rowToDelete, setRowToDelete, advancedFilter, updateAdvancedFilter } = useDataGrid({});
  const permission = usePagePermission(PAGE_TITLE.POS.BASE);

   const [range, setRange] = useState({ start:  DateConfig.utc().startOf("day"), end:  DateConfig.utc().endOf("day") });

   const { data: orderData, isLoading: orderDataLoading, isFetching: orderDataFetching } = Queries.useGetPosOrder({ ...params, startDate: range.start.toISOString(), endDate: range.end.toISOString() });
  const { refetch: fetchAllOrders, isFetching: orderDataAllFetching, isLoading: orderDataAllLoading } = Queries.useGetPosOrder({ startDate: range.start.toISOString(), endDate: range.end.toISOString() }, false);
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
    { field: "totalAmount", headerName: "Total Amount", width: 150 },
    { field: "dueAmount", headerName: "Due Amount", width: 150 },
    CommonObjectPropertyColumn<PosOrderBase>("paymentMethod", "paymentMethod", [], { headerName: "Payment Mode", width: 120, type: "format" }),
    CommonObjectPropertyColumn<PosOrderBase>("paymentStatus", "paymentStatus", [], { headerName: "Payment Status", width: 130, type: "status" }),
    { field: "redeemCreditAmount", headerName: "Credit Applied Amt", width: 150 },
    CommonObjectPropertyColumn<PosOrderBase>("orderType", "orderType", [], { headerName: "Order Type", width: 120, type: "format" }),
    CommonObjectPropertyColumn<PosOrderBase>("salesManId", "salesManId", ["fullName"], { headerName: "Sales Man", width: 150 }),
    CommonObjectPropertyColumn<PosOrderBase>("status", "status", [], { headerName: "Status", flex: 1, minWidth: 150, type: "status" }),
    CommonObjectPropertyColumn<PosOrderBase>("createdBy", "createdBy", ["fullName"], { headerName: "Created By", flex: 1, minWidth: 150 }),

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

  const accountingColumns: AppGridColDef<PosOrderBase>[] = [
    { field: "orderNo", headerName: "Invoice No", flex: 1, minWidth: 150 },
    {
      field: "items",
      headerName: "Product Name",
      flex: 1,
      minWidth: 150,
      renderCell: (params: GridRenderCellParams<PosOrderBase>) => {
        return <div>{params.row.items?.map((item) => item?.productId?.name).join(", ")}</div>;
      },
      exportFormatter: (_, row: PosOrderBase) => {
        return row?.items?.map((item) => item?.productId?.name)?.join(", ") || "";
      },
    },
    CommonObjectPropertyColumn<PosOrderBase>("customerId", "customerId", ["firstName", "lastName"], { headerName: "Customer Name", width: 150 }),
    {
      field: "state",
      headerName: "State",
      flex: 1,
      minWidth: 150,
      renderCell: (params: GridRenderCellParams<PosOrderBase>) => {
        return <div>{params.row.customerId?.address?.[0].state?.name}</div>;
      },
      exportFormatter: (_, row: PosOrderBase) => {
        return row?.customerId?.address?.[0].state?.name || "";
      },
    },
    CommonObjectPropertyColumn<PosOrderBase>("paymentMethod", "paymentMethod", [], { headerName: "Payment Mode", width: 120, type: "format" }),
    CommonObjectPropertyColumn<PosOrderBase>("created", "createdAt", [], { headerName: "Date", width: 120, type: "date" }), //
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
    fileName: PAGE_TITLE.POS.ORDER_LIST,
    onExportAll: { onExportAll: fetchAllOrders, isFetching: orderDataAllLoading || orderDataAllFetching },
    onAccountingExportAll: { accountingColumns: accountingColumns, onAccountingExportAll: fetchAllOrders, isFetching: orderDataAllLoading || orderDataAllFetching },
  };

      const topContent = (
    <>
      <Grid size={{ xs: 12, sm: 4, xxl: 3 }}>
        <CommonDateRangeSelector value={range} onChange={setRange} active="This Financial Year"/>
      </Grid>
    </>
  );

  return (
    <>
      <CommonBreadcrumbs title={PAGE_TITLE.POS.ORDER_LIST} breadcrumbs={BREADCRUMBS.POS_ORDER_LIST.BASE} />
      <Box sx={{ p: { xs: 2, md: 3 }, display: "grid", gap: 2 }}>
        <AdvancedSearch filter={filter} defaultExpanded children={topContent} />
        <CommonCard hideDivider>
          <CommonDataGrid {...CommonDataGridOption} />
        </CommonCard>
        <CommonDeleteModal open={Boolean(rowToDelete)} itemName={rowToDelete?.title} loading={isDeleteLoading} onClose={() => setRowToDelete(null)} onConfirm={handleDeleteBtn} />
      </Box>
    </>
  );
};

export default OrderList;
