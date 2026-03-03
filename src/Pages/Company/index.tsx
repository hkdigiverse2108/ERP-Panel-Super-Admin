import { Box } from "@mui/material";
import { useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { Mutations, Queries } from "../../Api";
import { CommonActionColumn, CommonBreadcrumbs, CommonCard, CommonDataGrid, CommonDeleteModal, CommonPhoneColumns } from "../../Components/Common";
import { PAGE_TITLE, ROUTES } from "../../Constants";
import { ACCOUNTING_TYPE, BREADCRUMBS } from "../../Data";
import type { AppGridColDef, CompanyBase } from "../../Types";
import { useDataGrid, usePagePermission } from "../../Utils/Hooks";
import { FormatDate } from "../../Utils";

const Company = () => {
  const { paginationModel, setPaginationModel, sortModel, setSortModel, filterModel, setFilterModel, rowToDelete, setRowToDelete, isActive, setActive, params } = useDataGrid();
  const navigate = useNavigate();
  const permission = usePagePermission(PAGE_TITLE.COMPANY.BASE);

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
    { field: "accountingType", headerName: "Accounting Type", width: 150, renderCell: (params) => ACCOUNTING_TYPE.find((item) => item.value === params.value)?.label },
    { field: "name", headerName: "Company Name", width: 170 },
    { field: "displayName", headerName: "Display Name", width: 140 },
    { field: "contactName", headerName: "Contact Name", width: 150 },
    { field: "planStartDate", headerName: "Plan Start Date", width: 150, renderCell: (params) => FormatDate(params?.value) },
    { field: "planEndDate", headerName: "Plan End Date", width: 150, renderCell: (params) => FormatDate(params?.value) },
    CommonPhoneColumns<CompanyBase>("phoneNo", { headerName: "Phone No", width: 150 }),
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
