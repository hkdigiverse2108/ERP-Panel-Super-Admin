import { Box } from "@mui/material";
import { useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { Mutations, Queries } from "../../../Api";
import { AdvancedSearch, CommonActionColumn, CommonBreadcrumbs, CommonCard, CommonDataGrid, CommonDeleteModal, CommonObjectNameColumn } from "../../../Components/Common";
import { PAGE_TITLE, ROUTES } from "../../../Constants";
import { BREADCRUMBS, PAYMENT_TYPE_OPTIONS } from "../../../Data";
import type { AppGridColDef, PosPaymentBase } from "../../../Types";
import { useDataGrid, usePagePermission } from "../../../Utils/Hooks";
import { CreateFilter, GenerateOptions } from "../../../Utils";
import { CommonObjectPropertyColumn } from "../../../Components/Common/CommonDataGrid/CommonColumns";

const Payment = () => {
  const { paginationModel, setPaginationModel, sortModel, setSortModel, filterModel, setFilterModel, rowToDelete, setRowToDelete, isActive, setActive, params, advancedFilter, updateAdvancedFilter } = useDataGrid();

  const navigate = useNavigate();
  const permission = usePagePermission(PAGE_TITLE.PAYMENT.BASE);

  const { data: contactData, isLoading: contactDataLoading } = Queries.useGetContactDropdown();

  const { refetch: fetchAll, isFetching: AllFetching, isLoading: AllLoading } = Queries.useGetPosPayment({}, false);
  const { data, isLoading, isFetching } = Queries.useGetPosPayment({ ...params, voucherTypeFilter: "purchase" });
  const { data: CompanyData, isLoading: CompanyDataLoading } = Queries.useGetCompanyDropdown();
  const { mutate: deletePayment, isPending: isDeleteLoading } = Mutations.useDeletePosPayment();
  const { mutate: editPayment, isPending: isEditLoading } = Mutations.useEditPosPayment();
  const rows = useMemo(() => {
    return data?.data?.posPayment_data.map((r) => ({ ...r, id: r?._id })) || [];
  }, [data]);

  const totalRows = data?.data?.totalData || 0;

  const handleAdd = () => navigate(ROUTES.PAYMENT.ADD_EDIT);

  const handleDelete = () => {
    if (!rowToDelete) return;
    deletePayment(rowToDelete?._id as string, {
      onSuccess: () => setRowToDelete(null),
    });
  };

  const columns: AppGridColDef<PosPaymentBase>[] = [
    CommonObjectNameColumn<PosPaymentBase>("companyId", { headerName: "Company", width: 200 }),
    CommonObjectPropertyColumn<PosPaymentBase>("voucherType", "voucherType", [], { headerName: "Payment No", flex: 1, minWidth: 150, type: "format" }),
    CommonObjectPropertyColumn<PosPaymentBase>("partyId", "partyId", ["firstName", "lastName"], { headerName: "Party Name", flex: 1, minWidth: 150 }),
    CommonObjectPropertyColumn<PosPaymentBase>("paymentMode", "paymentMode", [], { headerName: "Payment Mode", flex: 1, minWidth: 150, type: "format" }),
    CommonObjectPropertyColumn<PosPaymentBase>("paymentType", "paymentType", [], { headerName: "Payment Type", flex: 1, minWidth: 150, type: "format" }),
    CommonObjectPropertyColumn<PosPaymentBase>("date", "date", [], { headerName: "Payment Date", flex: 1, minWidth: 150, type: "date" }),
    { field: "amount", headerName: "Amount", flex: 1, minWidth: 150 },
    CommonObjectPropertyColumn<PosPaymentBase>("status", "status", [], { headerName: "Status", width: 150, type: "status" }),
    CommonObjectPropertyColumn<PosPaymentBase>("createdBy", "createdBy", ["fullName"], { headerName: "Created By", flex: 1, minWidth: 150 }),

    ...(permission?.edit || permission?.delete
      ? [
          CommonActionColumn<PosPaymentBase>({
            ...(permission?.edit && {
              active: (row) => editPayment({ posPaymentId: row?._id, isActive: !row.isActive }),
              editRoute: ROUTES.PAYMENT.ADD_EDIT,
            }),
            ...(permission?.delete && { onDelete: (row) => setRowToDelete({ _id: row?._id, title: row?.voucherType }) }),
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
    fileName: PAGE_TITLE.PAYMENT.BASE,
    onExportAll: { onExportAll: fetchAll, isFetching: AllLoading || AllFetching },
  };

  const filter = [
    CreateFilter("Select Company", "companyFilter", advancedFilter, updateAdvancedFilter, GenerateOptions(CompanyData?.data), CompanyDataLoading, { xs: 12, sm: 6, md: 3 }), //
    CreateFilter("Select Payment Type", "paymentTypeFilter", advancedFilter, updateAdvancedFilter, PAYMENT_TYPE_OPTIONS, false, { xs: 12, sm: 6, md: 3 }),
    CreateFilter("Select party", "partyFilter", advancedFilter, updateAdvancedFilter, GenerateOptions(contactData?.data), contactDataLoading, { xs: 12, sm: 6, md: 3 }),
  ];

  return (
    <>
      <CommonBreadcrumbs title={PAGE_TITLE.PAYMENT.BASE} maxItems={1} breadcrumbs={BREADCRUMBS.PAYMENT.BASE} />

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

export default Payment;
