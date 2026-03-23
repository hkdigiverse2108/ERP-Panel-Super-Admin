import { Box } from "@mui/material";
import { useDispatch } from "react-redux";
import { Mutations, Queries } from "../../../Api";
import { AdvancedSearch, CommonActionColumn, CommonBreadcrumbs, CommonCard, CommonDataGrid, CommonDeleteModal, CommonObjectNameColumn } from "../../../Components/Common";
import { PAGE_TITLE } from "../../../Constants";
import { BREADCRUMBS } from "../../../Data";
import { setAdditionalChargeModal } from "../../../Store/Slices/ModalSlice";
import type { AdditionalChargesBase, AppGridColDef } from "../../../Types";
import { CreateFilter, GenerateOptions } from "../../../Utils";
import { useDataGrid } from "../../../Utils/Hooks";
import AdditionalChargesForm from "./AdditionalChargesForm";
import { CommonObjectPropertyColumn } from "../../../Components/Common/CommonDataGrid/CommonColumns";

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
    CommonObjectNameColumn<AdditionalChargesBase>("companyId", { headerName: "Company", width: 200 }),
    { field: "name", headerName: "Additional Charge", width: 250 },
    { field: "defaultValue", headerName: "Default Value", width: 250 },
    { field: "hsnSac", headerName: "HSN Code", width: 200 },
    CommonObjectPropertyColumn<AdditionalChargesBase>("taxId", "taxId", ["name"], { headerName: "Tax", width: 150 }),

    CommonActionColumn<AdditionalChargesBase>({
      active: (row) =>
        editAdditionalCharges({
          additionalChargeId: row._id,
          isActive: !row.isActive,
        }),
      onEdit: { handleEdit: (row) => handleEdit(row) },
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
    fileName: PAGE_TITLE.SETTINGS.ADDITIONAL_CHARGES.BASE,
  };
  const filter = [CreateFilter("Select Company", "companyFilter", advancedFilter, updateAdvancedFilter, GenerateOptions(CompanyData?.data), CompanyDataLoading, { xs: 12, sm: 6, md: 3 })];

  return (
    <>
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
