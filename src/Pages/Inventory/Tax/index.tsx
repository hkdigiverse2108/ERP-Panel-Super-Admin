import { Box } from "@mui/material";
import { useMemo } from "react";
import { useDispatch } from "react-redux";
import { Mutations, Queries } from "../../../Api";
import { AdvancedSearch, CommonActionColumn, CommonBreadcrumbs, CommonCard, CommonDataGrid, CommonDeleteModal, CommonObjectNameColumn } from "../../../Components/Common";
import { PAGE_TITLE } from "../../../Constants";
import { BREADCRUMBS } from "../../../Data";
import { setTaxModal } from "../../../Store/Slices/ModalSlice";
import type { AppGridColDef, TaxBase } from "../../../Types";
import { useDataGrid, usePagePermission } from "../../../Utils/Hooks";
import TaxForm from "./TaxForm";
import { CreateFilter, GenerateOptions } from "../../../Utils";
import { CommonObjectPropertyColumn } from "../../../Components/Common/CommonDataGrid/CommonColumns";

const Tax = () => {
  const { paginationModel, setPaginationModel, sortModel, setSortModel, filterModel, setFilterModel, rowToDelete, setRowToDelete, isActive, setActive, params, advancedFilter, updateAdvancedFilter } = useDataGrid();
  const dispatch = useDispatch();
  const permission = usePagePermission(PAGE_TITLE.INVENTORY.TAX.BASE);
  const { data: CompanyData, isLoading: CompanyDataLoading } = Queries.useGetCompanyDropdown();
  const { data: TaxData, isLoading: TaxDataLoading, isFetching: TaxDataFetching } = Queries.useGetTax(params);
  const { mutate: deleteTaxMutate } = Mutations.useDeleteTax();
  const { mutate: editTax, isPending: isEditLoading } = Mutations.useEditTax();

  const allTax = useMemo(() => TaxData?.data?.tax_data.map((Tax) => ({ ...Tax, id: Tax?._id })) || [], [TaxData]);
  const totalRows = TaxData?.data?.totalData || 0;

  const handleDeleteBtn = () => {
    if (!rowToDelete) return;
    deleteTaxMutate(rowToDelete?._id as string, { onSuccess: () => setRowToDelete(null) });
  };

  const handleAdd = () => dispatch(setTaxModal({ open: true, data: null }));

  const handleEdit = (row: TaxBase) => dispatch(setTaxModal({ open: true, data: row }));

  const columns: AppGridColDef<TaxBase>[] = [
    CommonObjectNameColumn<TaxBase>("companyId", { headerName: "Company", width: 200 }),
    { field: "name", headerName: "Name", flex: 1, minWidth: 200 },
    { field: "percentage", headerName: "Percentage", flex: 1, minWidth: 200 },
    CommonObjectPropertyColumn<TaxBase>("createdBy", "createdBy", ["fullName"], { headerName: "Created By", flex: 1, minWidth: 150 }),

    ...(permission?.edit || permission?.delete
      ? [
          CommonActionColumn<TaxBase>({
            ...(permission?.edit && {
              active: (row) => editTax({ taxId: row?._id, isActive: !row.isActive }),
              onEdit: { handleEdit: (row) => handleEdit(row) },
            }),
            ...(permission?.delete && { onDelete: (row) => setRowToDelete({ _id: row?._id, title: row?.name }) }),
          }),
        ]
      : []),
  ];

  const CommonDataGridOption = {
    columns,
    rows: allTax,
    rowCount: totalRows,
    loading: TaxDataLoading || TaxDataFetching || isEditLoading,
    isActive,
    setActive,
    ...(permission?.add && { handleAdd }),
    paginationModel,
    onPaginationModelChange: setPaginationModel,
    sortModel,
    onSortModelChange: setSortModel,
    filterModel,
    onFilterModelChange: setFilterModel,
    fileName: PAGE_TITLE.INVENTORY.TAX.BASE,
  };
  const filter = [CreateFilter("Select Company", "companyFilter", advancedFilter, updateAdvancedFilter, GenerateOptions(CompanyData?.data), CompanyDataLoading, { xs: 12, sm: 6, md: 3 })];
  return (
    <>
      <CommonBreadcrumbs title={PAGE_TITLE.INVENTORY.TAX.BASE} maxItems={1} breadcrumbs={BREADCRUMBS.TAX.BASE} />
      <Box sx={{ p: { xs: 2, md: 3 }, display: "grid", gap: 2 }}>
        <AdvancedSearch filter={filter} />
        <CommonCard hideDivider>
          <CommonDataGrid {...CommonDataGridOption} />
        </CommonCard>
        <CommonDeleteModal open={Boolean(rowToDelete)} itemName={rowToDelete?.title} onClose={() => setRowToDelete(null)} onConfirm={() => handleDeleteBtn()} />
        <TaxForm />
      </Box>
    </>
  );
};

export default Tax;
