import { Box } from "@mui/material";
import { useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { useDataGrid, usePagePermission } from "../../Utils/Hooks";
import { PAGE_TITLE, ROUTES } from "../../Constants";
import { Mutations, Queries } from "../../Api";
import type { AppGridColDef, CallRequestBase } from "../../Types";
import { CommonActionColumn, CommonBreadcrumbs, CommonCard, CommonDataGrid, CommonDeleteModal } from "../../Components/Common";
import { BREADCRUMBS } from "../../Data";

const SupportDesk = () => {
  const { paginationModel, setPaginationModel, sortModel, setSortModel, filterModel, setFilterModel, rowToDelete, setRowToDelete, isActive, setActive, params } = useDataGrid();

  const navigate = useNavigate();
  const permission = usePagePermission(PAGE_TITLE.CALL_REQUEST.BASE);

  const { data, isLoading, isFetching } = Queries.useGetCallRequest(params);
  const { mutate: deleteCallRequest, isPending: isDeleteLoading } = Mutations.useDeleteCallRequest();
  const { mutate: editCallRequest, isPending: isEditLoading } = Mutations.useEditCallRequest();
  const rows = useMemo(() => {
    return data?.data?.call_request_data?.map((r) => ({ ...r, id: r?._id })) || [];
  }, [data]);

  const totalRows = data?.data?.totalData || 0;

  const handleAdd = () => navigate(ROUTES.CALL_REQUEST.ADD_EDIT);

  const handleDelete = () => {
    if (!rowToDelete) return;
    deleteCallRequest(rowToDelete?._id as string, {
      onSuccess: () => setRowToDelete(null),
    });
  };

  const columns: AppGridColDef<CallRequestBase>[] = [
    { field: "businessName", headerName: "Business Name", width: 100 },
    { field: "contactName", headerName: "Contact Name", width: 330 },
    { field: "contactNo", headerName: "Contact No", width: 150 },
    { field: "note", headerName: "Note", flex: 1, minWidth: 200 },
    ...(permission?.edit || permission?.delete
      ? [
          CommonActionColumn<CallRequestBase>({
            ...(permission?.edit && {
              active: (row) =>
                editCallRequest({
                  callRequestId: row._id,
                  is_active: !row.is_active,
                }),
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

  return (
    <>
      <CommonBreadcrumbs title={PAGE_TITLE.CALL_REQUEST.BASE} maxItems={1} breadcrumbs={BREADCRUMBS.CALL_REQUEST.BASE} />

      <Box sx={{ p: { xs: 2, md: 3 }, display: "grid", gap: 2 }}>
        <CommonCard hideDivider>
          <CommonDataGrid {...gridOptions} />
        </CommonCard>

        <CommonDeleteModal open={Boolean(rowToDelete)} itemName={rowToDelete?.title} loading={isDeleteLoading} onClose={() => setRowToDelete(null)} onConfirm={handleDelete} />
      </Box>
    </>
  );
};

export default SupportDesk;
