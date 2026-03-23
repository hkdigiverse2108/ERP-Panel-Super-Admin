import { Box } from "@mui/material";
import { useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { Mutations, Queries } from "../../Api";
import { CommonActionColumn, CommonBreadcrumbs, CommonCard, CommonDataGrid, CommonDeleteModal } from "../../Components/Common";
import { PAGE_TITLE, ROUTES } from "../../Constants";
import { BREADCRUMBS } from "../../Data";
import type { AppGridColDef, CompanyBase } from "../../Types";
import { useDataGrid, usePagePermission } from "../../Utils/Hooks";
import { CommonObjectPropertyColumn } from "../../Components/Common/CommonDataGrid/CommonColumns";

const Company = () => {
  const { paginationModel, setPaginationModel, sortModel, setSortModel, filterModel, setFilterModel, rowToDelete, setRowToDelete, isActive, setActive, params } = useDataGrid();
  const navigate = useNavigate();
  const permission = usePagePermission(PAGE_TITLE.COMPANY.BASE);

  const { refetch: fetchAll, isFetching: AllFetching, isLoading: AllLoading } = Queries.useGetCompany({}, false);
  const { data: companyData, isLoading: companyDataLoading, isFetching: companyDataFetching } = Queries.useGetCompany(params);
  const { mutate: deleteCompanyMutate } = Mutations.useDeleteCompany();
  const { mutate: editCompany, isPending: isEditLoading } = Mutations.useEditCompany();

  const allCompany = useMemo(() => companyData?.data?.company_data.map((company) => ({ ...company, id: company?._id })) || [], [companyData]);
  const totalRows = companyData?.data?.totalData || 0;

  const handleDeleteBtn = () => {
    if (!rowToDelete) return;
    deleteCompanyMutate(rowToDelete?._id as string, { onSuccess: () => setRowToDelete(null) });
  };

  const handleAdd = () => navigate(ROUTES.COMPANY.ADD_EDIT);

  const columns: AppGridColDef<CompanyBase>[] = [
    CommonObjectPropertyColumn<CompanyBase>("accountingType", "accountingType", [], { headerName: "Accounting Type", width: 150 }),
    { field: "name", headerName: "Company Name", width: 170 },
    { field: "displayName", headerName: "Display Name", width: 140 },
    { field: "contactName", headerName: "Contact Name", width: 150 },
    CommonObjectPropertyColumn<CompanyBase>("planStartDate", "planStartDate", [], { headerName: "Plan Start Date", width: 150, type: "date" }),
    CommonObjectPropertyColumn<CompanyBase>("planEndDate", "planEndDate", [], { headerName: "Plan End Date", width: 150, type: "date" }),
    CommonObjectPropertyColumn<CompanyBase>("phoneNo", "phoneNo", ["countryCode", "phoneNo"], { headerName: "Phone No", width: 150, type: "phone" }),
    { field: "email", headerName: "Email", width: 150 },
    { field: "webSite", headerName: "Website", flex: 1, minWidth: 200 },
    ...(permission?.edit || permission?.delete
      ? [
          CommonActionColumn<CompanyBase>({
            ...(permission?.edit && {
              active: (row) => editCompany({ companyId: row?._id, isActive: !row.isActive }),
              editRoute: ROUTES.COMPANY.ADD_EDIT,
            }),
            ...(permission?.delete && { onDelete: (row) => setRowToDelete({ _id: row?._id, title: row?.name }) }),
          }),
        ]
      : []),
  ];

  const CommonDataGridOption = {
    columns,
    rows: allCompany,
    rowCount: totalRows,
    loading: companyDataLoading || companyDataFetching || isEditLoading,
    isActive,
    setActive,
    ...(permission?.add && { handleAdd }),
    paginationModel,
    onPaginationModelChange: setPaginationModel,
    sortModel,
    onSortModelChange: setSortModel,
    filterModel,
    onFilterModelChange: setFilterModel,
    fileName: PAGE_TITLE.COMPANY.BASE,
    onExportAll: { onExportAll: fetchAll, isFetching: AllLoading || AllFetching },
  };

  return (
    <>
      <CommonBreadcrumbs title={PAGE_TITLE.COMPANY.BASE} maxItems={1} breadcrumbs={BREADCRUMBS.COMPANY.BASE} />
      <Box sx={{ p: { xs: 2, md: 3 }, display: "grid", gap: 2 }}>
        <CommonCard hideDivider>
          <CommonDataGrid {...CommonDataGridOption} />
        </CommonCard>
        <CommonDeleteModal open={Boolean(rowToDelete)} itemName={rowToDelete?.title} onClose={() => setRowToDelete(null)} onConfirm={() => handleDeleteBtn()} />
      </Box>
    </>
  );
};

export default Company;
