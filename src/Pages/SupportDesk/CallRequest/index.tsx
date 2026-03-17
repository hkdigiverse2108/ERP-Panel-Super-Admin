import { Box } from "@mui/material";
import { useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { useDataGrid, usePagePermission } from "../../../Utils/Hooks";
import { PAGE_TITLE, ROUTES } from "../../../Constants";
import { Mutations, Queries } from "../../../Api";
import type { AppGridColDef, CallRequestBase } from "../../../Types";
import { AdvancedSearch, CommonActionColumn, CommonBreadcrumbs, CommonCard, CommonDataGrid, CommonDeleteModal, CommonObjectNameColumn, CommonPhoneColumns } from "../../../Components/Common";
import { CreateFilter, GenerateOptions } from "../../../Utils";
import { BREADCRUMBS } from "../../../Data";

const CallRequest = () => {
  const { paginationModel, setPaginationModel, sortModel, setSortModel, filterModel, setFilterModel, rowToDelete, setRowToDelete, isActive, setActive, params, advancedFilter, updateAdvancedFilter } = useDataGrid();

  const navigate = useNavigate();
  const permission = usePagePermission(PAGE_TITLE.CALL_REQUEST.BASE);
  const { data: CompanyData, isLoading: CompanyDataLoading } = Queries.useGetCompanyDropdown();
  const { data, isLoading, isFetching } = Queries.useGetCallRequest(params);
  const { mutate: deleteCallRequest, isPending: isDeleteLoading } = Mutations.useDeleteCallRequest();
  const { mutate: editCallRequest, isPending: isEditLoading } = Mutations.useEditCallRequest();
  const rows = useMemo(() => {
    return data?.data?.call_Request_data?.map((r) => ({ ...r, id: r?._id })) || [];
  }, [data]);
  // console.log("data", data);
  const totalRows = data?.data?.totalData || 0;

  const handleAdd = () => navigate(ROUTES.CALL_REQUEST.ADD_EDIT);

  const handleDelete = () => {
    if (!rowToDelete) return;
    deleteCallRequest(rowToDelete?._id as string, {
      onSuccess: () => setRowToDelete(null),
    });
  };

  const columns: AppGridColDef<CallRequestBase>[] = [
    CommonObjectNameColumn<CallRequestBase>("companyId", { headerName: "Company", width: 180 }),
    { field: "businessName", headerName: "Business Name", width: 220 },
    { field: "contactName", headerName: "Contact Name", width: 200 },
    CommonPhoneColumns<CallRequestBase>("contactNo", { headerName: "Contact No", width: 180 }),
    { field: "note", headerName: "Note", flex: 1, minWidth: 150 },
    ...(permission?.edit || permission?.delete
      ? [
          CommonActionColumn<CallRequestBase>({
            ...(permission?.edit && {
              active: (row) => editCallRequest({ callRequestId: row._id, isActive: !row.isActive }),
              editRoute: ROUTES.CALL_REQUEST.ADD_EDIT,
            }),
            ...(permission?.delete && { onDelete: (row) => setRowToDelete({ _id: row?._id, title: row?.businessName }) }),
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
  const filter = [CreateFilter("Select Company", "companyFilter", advancedFilter, updateAdvancedFilter, GenerateOptions(CompanyData?.data), CompanyDataLoading, { xs: 12, sm: 6, md: 3 })];

  return (
    <>
      <CommonBreadcrumbs title={PAGE_TITLE.CALL_REQUEST.BASE} maxItems={1} breadcrumbs={BREADCRUMBS.CALL_REQUEST.BASE} />
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

export default CallRequest;
