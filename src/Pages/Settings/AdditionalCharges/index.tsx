import { useDataGrid } from "../../../Utils/Hooks";
import { PAGE_TITLE } from "../../../Constants";
import { Mutations, Queries } from "../../../Api";
import type { AdditionalChargesBase, AppGridColDef } from "../../../Types";
import { AdvancedSearch, CommonActionColumn, CommonBreadcrumbs, CommonCard, CommonDataGrid, CommonDeleteModal, CommonObjectNameColumn } from "../../../Components/Common";
import { useDispatch } from "react-redux";
import { setAdditionalChargeModal } from "../../../Store/Slices/ModalSlice";
import AdditionalChargesForm from "./AdditionalChargesForm";
import { CreateFilter, GenerateOptions } from "../../../Utils";
import { Box } from "@mui/material";
import { BREADCRUMBS } from "../../../Data";

const AdditionalCharges = () => {
  const { paginationModel, setPaginationModel, sortModel, setSortModel, filterModel, setFilterModel, rowToDelete, setRowToDelete, isActive, setActive, params, advancedFilter, updateAdvancedFilter } = useDataGrid();
  const { data: additional_charge_data, isLoading: additionalChargesDataLoading, isFetching: additionalChargesDataFetching } = Queries.useGetAdditionalCharges(params);

  const dispatch = useDispatch();
  const { mutate: deleteAdditionalChargesMutate } = Mutations.useDeleteAdditionalCharges();
  const { mutate: editAdditionalCharges, isPending: isEditLoading } = Mutations.useEditAdditionalCharges();
  const { data: CompanyData, isLoading: CompanyDataLoading } = Queries.useGetCompanyDropdown();

  const allRows = additional_charge_data?.data?.additional_charge_data?.map((additionalCharges: AdditionalChargesBase) => ({ ...additionalCharges, id: additionalCharges._id })) || [];
  const totalRows = additional_charge_data?.data?.totalData || 0;

  const handleDeleteBtn = () => {
    if (!rowToDelete) return;
    deleteAdditionalChargesMutate(rowToDelete?._id as string, {
      onSuccess: () => setRowToDelete(null),
    });
  };

  const handleAdd = () => {
    dispatch(setAdditionalChargeModal({ open: true, data: null }));
  };
  const handleEdit = (row: AdditionalChargesBase) => {
    dispatch(setAdditionalChargeModal({ open: true, data: row }));
  };

  const columns: AppGridColDef<AdditionalChargesBase>[] = [
    { field: "name", headerName: "Additional Charge", width: 170 },
    { field: "defaultValue", headerName: "Default Value", width: 150 },
    CommonObjectNameColumn<AdditionalChargesBase>("companyId", { headerName: "Company", width: 200 }),
    { field: "hsnSac", headerName: "HSN Code", width: 150 },
    { field: "accountGroupId", headerName: "Account Group", width: 140, valueGetter: (_v, row) => (typeof row.accountGroupId === "object" ? row.accountGroupId?.name : row.accountGroupId) },
    { field: "taxId", headerName: "Tax", flex: 1, valueGetter: (_v, row) => (typeof row.taxId === "object" ? row.taxId?.name : row.taxId) },
    CommonActionColumn<AdditionalChargesBase>({
      active: (row) =>
        editAdditionalCharges({
          additionalChargeId: row._id,
          isActive: !row.isActive,
        }),
      onEdit: (row) => handleEdit(row),
      onDelete: (row) => setRowToDelete({ _id: row._id, title: row.name }),
    }),
  ];

  const CommonDataGridOption = {
    columns,
    rows: allRows,
    rowCount: totalRows,
    loading: additionalChargesDataLoading || additionalChargesDataFetching || isEditLoading,
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
  const filter = [CreateFilter("Select Company", "companyFilter", advancedFilter, updateAdvancedFilter, GenerateOptions(CompanyData?.data), CompanyDataLoading, { xs: 12, sm: 6, md: 3 })];

  return (
    <>
      <CommonCard title={PAGE_TITLE.SETTINGS.ADDITIONAL_CHARGES.BASE} hideDivider>
        <Box sx={{ p: { xs: 2, md: 3 }, display: "grid" }}>
          <AdvancedSearch filter={filter} />
        </Box>
        <CommonDataGrid {...CommonDataGridOption} />
      </CommonCard>
      <CommonDeleteModal open={Boolean(rowToDelete)} itemName={rowToDelete?.title} onClose={() => setRowToDelete(null)} onConfirm={() => handleDeleteBtn()} />
      <AdditionalChargesForm />
      <CommonBreadcrumbs title={PAGE_TITLE.SETTINGS.ADDITIONAL_CHARGES.BASE} maxItems={1} breadcrumbs={BREADCRUMBS.SETTINGS.ADDITIONAL_CHARGES} />

      <Box sx={{ p: { xs: 2, md: 3 }, display: "grid", gap: 2 }}>
        <AdvancedSearch filter={filter} />
        <CommonCard hideDivider>
          <CommonDataGrid {...CommonDataGridOption} />
        </CommonCard>
        <CommonDeleteModal open={Boolean(rowToDelete)} itemName={rowToDelete?.title} onClose={() => setRowToDelete(null)} onConfirm={() => handleDeleteBtn()} />
        <AdditionalChargesForm />
      </Box>
    </>
  );
};

export default AdditionalCharges;
