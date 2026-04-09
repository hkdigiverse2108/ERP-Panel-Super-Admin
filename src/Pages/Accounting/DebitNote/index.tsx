import { Box } from "@mui/material";
import type { GridColDef } from "@mui/x-data-grid";
import { useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { Mutations, Queries } from "../../../Api";
import { AdvancedSearch, CommonActionColumn, CommonBreadcrumbs, CommonCard, CommonDataGrid, CommonDeleteModal, CommonObjectNameColumn } from "../../../Components/Common";
import { PAGE_TITLE, ROUTES } from "../../../Constants";
import { BREADCRUMBS } from "../../../Data";
import type { DebitNoteBase } from "../../../Types";
import { useDataGrid, usePagePermission } from "../../../Utils/Hooks";
import { CreateFilter, GenerateOptions } from "../../../Utils";
import { CommonObjectPropertyColumn } from "../../../Components/Common/CommonDataGrid/CommonColumns";

const DebitNote = () => {
  const { paginationModel, setPaginationModel, sortModel, setSortModel, filterModel, setFilterModel, rowToDelete, setRowToDelete, isActive, setActive, params, advancedFilter, updateAdvancedFilter } = useDataGrid();
  const navigate = useNavigate();
  const permission = usePagePermission(PAGE_TITLE.DEBIT_NOTE.BASE);
  const { refetch: fetchAll, isFetching: AllFetching, isLoading: AllLoading } = Queries.useGetDebitNote({}, false);
  const { data: debitNoteData, isLoading: debitNoteDataLoading, isFetching: debitNoteDataFetching } = Queries.useGetDebitNote(params);
  const { mutate: deleteDebitNoteMutate } = Mutations.useDeleteDebitNote();
  const { data: CompanyData, isLoading: CompanyDataLoading } = Queries.useGetCompanyDropdown();
  const companyId = advancedFilter?.companyFilter?.[0] || "";
  const { data: BranchData, isLoading: BranchDataLoading } = Queries.useGetBranchDropdown({ companyFilter: companyId }, Boolean(companyId));

  const { mutate: editDebitNote, isPending: isEditLoading } = Mutations.useEditDebitNote();

  const allDebitNotes = useMemo(() => debitNoteData?.data?.debitNote_data.map((debitNote) => ({ ...debitNote, id: debitNote?._id })) || [], [debitNoteData]);
  const totalRows = debitNoteData?.data?.totalData || 0;

  const handleDeleteBtn = () => {
    if (!rowToDelete) return;
    deleteDebitNoteMutate(rowToDelete?._id as string, { onSuccess: () => setRowToDelete(null) });
  };

  const handleAdd = () => navigate(ROUTES.DEBIT_NOTE.ADD_EDIT);

  const columns: GridColDef<DebitNoteBase>[] = [
    CommonObjectNameColumn<DebitNoteBase>("companyId", { headerName: "Company", width: 200 }),
    CommonObjectNameColumn<DebitNoteBase>("branchId", { headerName: "Branch", width: 200 }),
    { field: "personName", headerName: "Person Name", width: 200 },
    { field: "amount", headerName: "Amount", width: 140 },
    CommonObjectPropertyColumn<DebitNoteBase>("date", "date", [], { headerName: "Date", width: 120, type: "date" }),
    CommonObjectPropertyColumn<DebitNoteBase>("phoneNo", "phoneNo", ["countryCode", "phoneNo"], { headerName: "Phone No", width: 150, type: "phone" }),
    { field: "description", headerName: "Description", flex: 1, minWidth: 200 },
    CommonObjectPropertyColumn<DebitNoteBase>("createdBy", "createdBy", ["fullName"], { headerName: "Created By", flex: 1, minWidth: 150 }),

    ...(permission?.edit || permission?.delete
      ? [
          CommonActionColumn<DebitNoteBase>({
            ...(permission?.edit && {
              active: (row) => editDebitNote({ debitNoteId: row?._id, isActive: !row.isActive }),
              editRoute: ROUTES.DEBIT_NOTE.ADD_EDIT,
            }),
            ...(permission?.delete && { onDelete: (row) => setRowToDelete({ _id: row?._id, title: row?.amount }) }),
          }),
        ]
      : []),
  ];

  const CommonDataGridOption = {
    columns,
    rows: allDebitNotes,
    rowCount: totalRows,
    loading: debitNoteDataLoading || debitNoteDataFetching || isEditLoading,
    isActive,
    setActive,
    ...(permission?.add && { handleAdd }),
    paginationModel,
    onPaginationModelChange: setPaginationModel,
    sortModel,
    onSortModelChange: setSortModel,
    filterModel,
    onFilterModelChange: setFilterModel,
    fileName: PAGE_TITLE.DEBIT_NOTE.BASE,
    onExportAll: { onExportAll: fetchAll, isFetching: AllLoading || AllFetching },
  };
  const filter = [
    CreateFilter("Select Company", "companyFilter", advancedFilter, updateAdvancedFilter, GenerateOptions(CompanyData?.data), CompanyDataLoading, { xs: 12, sm: 6, md: 3 }), //
    CreateFilter("Select Branch", "branchFilter", advancedFilter, updateAdvancedFilter, GenerateOptions(BranchData?.data), BranchDataLoading, { xs: 12, sm: 6, md: 3 }),
  ];

  return (
    <>
      <CommonBreadcrumbs title={PAGE_TITLE.DEBIT_NOTE.BASE} maxItems={1} breadcrumbs={BREADCRUMBS.DEBIT_NOTE.BASE} />
      <Box sx={{ p: { xs: 2, md: 3 }, display: "grid", gap: 2 }}>
        <AdvancedSearch filter={filter} />
        <CommonCard hideDivider>
          <CommonDataGrid {...CommonDataGridOption} />
        </CommonCard>
        <CommonDeleteModal open={Boolean(rowToDelete)} itemName={rowToDelete?.title} onClose={() => setRowToDelete(null)} onConfirm={() => handleDeleteBtn()} />
      </Box>
    </>
  );
};

export default DebitNote;
