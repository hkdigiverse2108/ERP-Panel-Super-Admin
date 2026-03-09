import { Box } from "@mui/material";
import { useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { Mutations, Queries } from "../../../Api";
import { AdvancedSearch, CommonActionColumn, CommonBreadcrumbs, CommonCard, CommonDataGrid, CommonDeleteModal, CommonObjectNameColumn } from "../../../Components/Common";
import { PAGE_TITLE, ROUTES } from "../../../Constants";
import { BREADCRUMBS } from "../../../Data";
import type { AppGridColDef, PosPaymentBase } from "../../../Types";
import { useDataGrid, usePagePermission } from "../../../Utils/Hooks";
import { CreateFilter, FormatDate, GenerateOptions } from "../../../Utils";

const Receipt = () => {
  const { paginationModel, setPaginationModel, sortModel, setSortModel, filterModel, setFilterModel, rowToDelete, setRowToDelete, isActive, setActive, params, advancedFilter, updateAdvancedFilter } = useDataGrid();

  const navigate = useNavigate();
  const permission = usePagePermission(PAGE_TITLE.RECEIPT.BASE);

  const { data, isLoading, isFetching } = Queries.useGetPosPayment({ ...params,  voucherTypeFilter: "sales" });
  const { data: CompanyData, isLoading: CompanyDataLoading } = Queries.useGetCompanyDropdown();
  const { mutate: deletePayment, isPending: isDeleteLoading } = Mutations.useDeletePosPayment();
  const { mutate: editPayment, isPending: isEditLoading } = Mutations.useEditPosPayment();
  const rows = useMemo(() => {
    return data?.data?.posPayment_data.map((r) => ({ ...r, id: r?._id })) || [];
  }, [data]);

  const totalRows = data?.data?.totalData || 0;

  const handleAdd = () => navigate(ROUTES.RECEIPT.ADD_EDIT);

  const handleDelete = () => {
    if (!rowToDelete) return;
    deletePayment(rowToDelete?._id as string, {
      onSuccess: () => setRowToDelete(null),
    });
  };

  const columns: AppGridColDef<PosPaymentBase>[] = [
    CommonObjectNameColumn<PosPaymentBase>("companyId", { headerName: "Company", width: 200 }),
    { field: "paymentNo", headerName: "Payment No", width: 200 },
    { field: "partyId", headerName: "Party Name", width: 230, valueGetter: (_v, row: PosPaymentBase) => (row?.partyId ? `${row?.partyId?.firstName} ${row?.partyId?.lastName}` : "-") },
    { field: "paymentMode", headerName: "Payment Mode", width: 140 },
    { field: "paymentType", headerName: "Payment Type", width: 140 },
    { field: "paymentDate", headerName: "Payment Date", width: 190, valueGetter: (v) => FormatDate(v) },
    { field: "amount", headerName: "Amount", minWidth: 150, flex: 1, valueGetter: (_v, row: PosPaymentBase) => row?.amount ?? row?.totalAmount ?? 0 },
    { field: "status", headerName: "Status", headerAlign: "center", width: 110, renderCell: (params) => <span className={`status-${params.row.status}`}>{params.row.status}</span> },

    ...(permission?.edit || permission?.delete
      ? [
        CommonActionColumn<PosPaymentBase>({
          ...(permission?.edit && {
            active: (row) => editPayment({ posPaymentId: row?._id, isActive: !row.isActive }),
            editRoute: ROUTES.RECEIPT.ADD_EDIT,
          }),
          ...(permission?.delete && { onDelete: (row) => setRowToDelete({ _id: row?._id, title: row?.paymentNo }) }),
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
    ...(permission?.add && { handleAdd }),
    paginationModel,
    onPaginationModelChange: setPaginationModel,
    sortModel,
    onSortModelChange: setSortModel,
    filterModel,
    onFilterModelChange: setFilterModel,
  };

  const filter = [
    CreateFilter("Select Company", "companyFilter", advancedFilter, updateAdvancedFilter, GenerateOptions(CompanyData?.data), CompanyDataLoading, { xs: 12, sm: 6, md: 3 }), //
  ];

  return (
    <>
      <CommonBreadcrumbs title={PAGE_TITLE.RECEIPT.BASE} maxItems={1} breadcrumbs={BREADCRUMBS.RECEIPT.BASE} />

      <Box sx={{ p: { xs: 2, md: 3 }, display: "grid", gap: 2 }}>
        <AdvancedSearch filter={filter} />
        <CommonCard hideDivider>
          <CommonDataGrid {...gridOptions} />
        </CommonCard>

        <CommonDeleteModal open={Boolean(rowToDelete)} itemName={rowToDelete?.title} loading={isDeleteLoading} onClose={() => setRowToDelete(null)} onConfirm={handleDelete} />
      </Box>
    </>
  );
};

export default Receipt;

