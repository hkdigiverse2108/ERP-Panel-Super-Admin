import { Box, Grid } from "@mui/material";
import { useMemo } from "react";
import { useDispatch } from "react-redux";
import { Mutations, Queries } from "../../../Api";
import { AdvancedSearch, CommonActionColumn, CommonBreadcrumbs, CommonCard, CommonDataGrid, CommonDeleteModal, CommonObjectNameColumn } from "../../../Components/Common";
import { PAGE_TITLE } from "../../../Constants";
import { BREADCRUMBS } from "../../../Data";
import { setPrefixModal } from "../../../Store/Slices/ModalSlice";
import type { AppGridColDef, PrefixBase } from "../../../Types";
import { CreateFilter, GenerateOptions, WithAllOption } from "../../../Utils";
import { useDataGrid, usePagePermission } from "../../../Utils/Hooks";
import PrefixForm from "./PrefixForm";
import { CommonObjectPropertyColumn } from "../../../Components/Common/CommonDataGrid/CommonColumns";

const Prefix = () => {
  const { paginationModel, setPaginationModel, sortModel, setSortModel, filterModel, setFilterModel, params, advancedFilter, updateAdvancedFilter, rowToDelete, setRowToDelete, isActive, setActive } = useDataGrid();
  const dispatch = useDispatch();
  const permission = usePagePermission(PAGE_TITLE.SETTINGS.PREFIX.BASE);

  const prefixParams = useMemo(() => {
    const p = { ...params };
    const rawFilter = advancedFilter["companyFilter"];

    if (!rawFilter || rawFilter.length === 0) {
      // Case 1: Initial load / No selection -> Don't pass anything
      delete p.companyFilter;
    } else if (rawFilter.includes("")) {
      // Case 2: "All" selected -> Pass "all"
      p.companyFilter = "all";
    }
    // Case 3: Specific company selected -> Already in p.companyFilter if exists
    return p;
  }, [params, advancedFilter]);

  const { refetch: fetchAll, isFetching: AllFetching, isLoading: AllLoading } = Queries.useGetPrefix({}, false);
  const { data: prefixData, isLoading: prefixDataLoading, isFetching: prefixDataFetching } = Queries.useGetPrefix(prefixParams);
  const { data: companyData, isLoading: companyLoading } = Queries.useGetCompanyDropdown();
  const companyId = advancedFilter?.companyFilter?.[0] || "";
  const { data: BranchData, isLoading: BranchDataLoading } = Queries.useGetBranchDropdown({ companyFilter: companyId }, Boolean(companyId));
  const { mutate: deletePrefix, isPending: deleteLoading } = Mutations.useDeletePrefix();
  const { mutate: editPrefix, isPending: editLoading } = Mutations.useEditPrefix();

  const allRows = useMemo(() => prefixData?.data?.prefix_data.map((item) => ({ ...item, id: item?._id })) || [], [prefixData]);
  const totalRows = prefixData?.data?.totalData || 0;

  const handleEdit = (row: PrefixBase) => dispatch(setPrefixModal({ open: true, data: row }));
  const handleAddNew = () => dispatch(setPrefixModal({ open: true, data: null }));

  const handleDelete = () => {
    if (rowToDelete?._id) {
      deletePrefix(rowToDelete._id, {
        onSuccess: () => setRowToDelete(null),
      });
    }
  };

  const columns: AppGridColDef<PrefixBase>[] = [
    CommonObjectNameColumn<PrefixBase>("companyId", { headerName: "Company", width: 200 }),
    CommonObjectNameColumn<PrefixBase>("branchId", { headerName: "Branch", width: 200 }),
    { field: "prefixType", headerName: "Prefix Type", flex: 1, minWidth: 200, valueGetter: (_value, row: PrefixBase) => row.prefixType?.split("_").join(" ") || "-" },
    { field: "prefix", headerName: "Prefix", flex: 1, minWidth: 200 },
    { field: "sequenceNumber", headerName: "Sequence No.", flex: 1, minWidth: 150 },
    CommonObjectPropertyColumn<PrefixBase>("createdBy", "createdBy", ["fullName"], { headerName: "Created By", flex: 1, minWidth: 150 }),

    ...(permission?.edit || permission?.delete
      ? [
          CommonActionColumn<PrefixBase>({
            ...(permission?.edit && {
              onEdit: { handleEdit: (row: PrefixBase) => handleEdit(row) },
              active: (row: PrefixBase) => editPrefix({ prefixId: row._id, isActive: !row.isActive }),
            }),
            ...(permission?.delete && { onDelete: (row: PrefixBase) => setRowToDelete({ _id: row._id, title: row.prefix || "" }) }),
          }),
        ]
      : []),
  ];

  const filters = [
    CreateFilter("Company", "companyFilter", advancedFilter, updateAdvancedFilter, WithAllOption(GenerateOptions(companyData?.data), "All", ""), companyLoading, { xs: 12, sm: 12, md: 4 }), //
    CreateFilter("Select Branch", "branchFilter", advancedFilter, updateAdvancedFilter, GenerateOptions(BranchData?.data), BranchDataLoading, { xs: 12, sm: 6, md: 3 }),
  ];

  const CommonDataGridOption = {
    columns,
    rows: allRows,
    rowCount: totalRows,
    loading: prefixDataLoading || prefixDataFetching || editLoading,
    isActive,
    setActive,
    ...(permission?.add && { handleAdd: handleAddNew }),
    paginationModel,
    onPaginationModelChange: setPaginationModel,
    sortModel,
    onSortModelChange: setSortModel,
    filterModel,
    onFilterModelChange: setFilterModel,
    fileName: PAGE_TITLE.SETTINGS.PREFIX.BASE,
    onExportAll: { onExportAll: fetchAll, isFetching: AllLoading || AllFetching },
  };

  return (
    <>
      <CommonBreadcrumbs title={PAGE_TITLE.SETTINGS.PREFIX.BASE} maxItems={1} breadcrumbs={BREADCRUMBS.PREFIX.BASE} />
      <Box sx={{ p: { xs: 2, md: 3 }, display: "grid", gap: 2 }}>
        <AdvancedSearch filter={filters} />
        <Grid size={{ xs: 12, xsm: 6, sm: 3, xxl: 2 }}></Grid>
        <CommonCard hideDivider>
          <CommonDataGrid {...CommonDataGridOption} />
        </CommonCard>
        <PrefixForm />
        <CommonDeleteModal open={Boolean(rowToDelete)} itemName={rowToDelete?.title} onClose={() => setRowToDelete(null)} loading={deleteLoading} onConfirm={handleDelete} />
      </Box>
    </>
  );
};

export default Prefix;
