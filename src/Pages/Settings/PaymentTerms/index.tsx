import { Box } from "@mui/material";
import { useMemo } from "react";
import { useDispatch } from "react-redux";
import { useDataGrid, usePagePermission } from "../../../Utils/Hooks";
import { PAGE_TITLE } from "../../../Constants";
import { Mutations, Queries } from "../../../Api";
import type { AppGridColDef, PaymentTermsBase } from "../../../Types";
import { AdvancedSearch, CommonActionColumn, CommonBreadcrumbs, CommonCard, CommonDataGrid, CommonDeleteModal } from "../../../Components/Common";
import PaymentTermsForm from "./PaymentTermsForm";
import { BREADCRUMBS } from "../../../Data";
import { CreateFilter, GenerateOptions } from "../../../Utils";
import { CommonObjectNameColumn, CommonObjectPropertyColumn } from "../../../Components/Common/CommonDataGrid/CommonColumns";
import { setPaymentTermsModal } from "../../../Store/Slices/ModalSlice";

const PaymentTerms = () => {
  const { paginationModel, setPaginationModel, sortModel, setSortModel, filterModel, setFilterModel, rowToDelete, setRowToDelete, isActive, setActive, params, advancedFilter, updateAdvancedFilter } = useDataGrid();

  const dispatch = useDispatch();
  const permission = usePagePermission(PAGE_TITLE.SETTINGS.PAYMENT_TERMS.BASE);

  const { data: CompanyData, isLoading: CompanyDataLoading } = Queries.useGetCompanyDropdown();
  const { data: paymentTermsData, isLoading: paymentTermsDataLoading, isFetching: paymentTermsDataFetching } = Queries.useGetPaymentTerms(params);
  const { mutate: deletePaymentTermsMutate, isPending: isDeleteLoading } = Mutations.useDeletePaymentTerms();
  const { mutate: editPaymentTerms, isPending: isEditLoading } = Mutations.useEditPaymentTerms();

  const allRows = useMemo(() => paymentTermsData?.data?.paymentTerm_data.map((item) => ({ ...item, id: item?._id })) || [], [paymentTermsData]);
  const totalRows = paymentTermsData?.data?.totalData || 0;

  const handleDeleteBtn = () => {
    if (!rowToDelete) return;
    deletePaymentTermsMutate(rowToDelete?._id as string, { onSuccess: () => setRowToDelete(null) });
  };

  const handleAdd = () => dispatch(setPaymentTermsModal({ open: true, data: null }));

  const handleEdit = (row: PaymentTermsBase) => dispatch(setPaymentTermsModal({ open: true, data: row }));

  const columns: AppGridColDef<PaymentTermsBase>[] = [
    CommonObjectNameColumn<PaymentTermsBase>("companyId", { headerName: "Company", width: 200 }),
    { field: "name", headerName: "Payment Term", flex: 1, minWidth: 200 },
    { field: "day", headerName: "Payment Term Day", flex: 1, minWidth: 200 },
    CommonObjectPropertyColumn<PaymentTermsBase>("createdBy", "createdBy", ["fullName"], { headerName: "Created By", flex: 1, minWidth: 150 }),

    ...(permission?.edit || permission?.delete
      ? [
          CommonActionColumn<PaymentTermsBase>({
            ...(permission?.edit && { active: (row) => editPaymentTerms({ paymentTermId: row?._id, isActive: !row.isActive }), onEdit: { handleEdit: (row) => handleEdit(row) } }),
            ...(permission?.delete && { onDelete: (row) => setRowToDelete({ _id: row?._id, title: row?.name }) }),
          }),
        ]
      : []),
  ];

  const CommonDataGridOption = {
    columns,
    rows: allRows,
    rowCount: totalRows,
    loading: paymentTermsDataLoading || paymentTermsDataFetching || isEditLoading,
    isActive,
    setActive,
    ...(permission?.add && { handleAdd }),
    paginationModel,
    isExport: false,
    onPaginationModelChange: setPaginationModel,
    sortModel,
    onSortModelChange: setSortModel,
    filterModel,
    onFilterModelChange: setFilterModel,
    fileName: PAGE_TITLE.SETTINGS.PAYMENT_TERMS.BASE,
  };
  const filter = [CreateFilter("Select Company", "companyFilter", advancedFilter, updateAdvancedFilter, GenerateOptions(CompanyData?.data), CompanyDataLoading, { xs: 12, sm: 6, md: 3 })];

  return (
    <>
      <CommonBreadcrumbs title={PAGE_TITLE.SETTINGS.PAYMENT_TERMS.BASE} maxItems={1} breadcrumbs={BREADCRUMBS.PAYMENT_TERMS.BASE} />
      <Box sx={{ p: { xs: 2, md: 3 }, display: "grid", gap: 2 }}>
        <AdvancedSearch filter={filter} />
        <CommonCard hideDivider>
          <CommonDataGrid {...CommonDataGridOption} />
        </CommonCard>
        <CommonDeleteModal open={Boolean(rowToDelete)} itemName={rowToDelete?.title} loading={isDeleteLoading} onClose={() => setRowToDelete(null)} onConfirm={() => handleDeleteBtn()} />
        <PaymentTermsForm />
      </Box>
    </>
  );
};

export default PaymentTerms;
