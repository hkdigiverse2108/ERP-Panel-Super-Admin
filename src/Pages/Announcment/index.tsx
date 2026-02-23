import { Box } from "@mui/material";
import { useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { useDataGrid, usePagePermission } from "../../Utils/Hooks";
import { PAGE_TITLE, ROUTES } from "../../Constants";
import { Mutations, Queries } from "../../Api";
import type { AnnouncementBase, AppGridColDef } from "../../Types";
import { AdvancedSearch, CommonActionColumn, CommonBreadcrumbs, CommonCard, CommonDataGrid, CommonDeleteModal, CommonObjectNameColumn } from "../../Components/Common";
import { CreateFilter, GenerateOptions } from "../../Utils";
import { BREADCRUMBS } from "../../Data";

const Announcement = () => {
  const { paginationModel, setPaginationModel, sortModel, setSortModel, filterModel, setFilterModel, rowToDelete, setRowToDelete, isActive, setActive, params, advancedFilter, updateAdvancedFilter } = useDataGrid();

  const navigate = useNavigate();
  const permission = usePagePermission(PAGE_TITLE.ANNOUNCEMENT.BASE);

  const { data, isLoading, isFetching } = Queries.useGetAnnouncement(params);
  const { data: CompanyData, isLoading: CompanyDataLoading } = Queries.useGetCompanyDropdown();
  const { mutate: deleteAnnouncement, isPending: isDeleteLoading } = Mutations.useDeleteAnnouncement();
  const { mutate: editAnnouncement, isPending: isEditLoading } = Mutations.useEditAnnouncement();
  const rows = useMemo(() => {
    return data?.data?.announcement_data.map((r) => ({ ...r, id: r?._id })) || [];
  }, [data]);

  const totalRows = data?.data?.totalData || 0;

  const handleAdd = () => navigate(ROUTES.ANNOUNCEMENT.ADD_EDIT);

  const handleDelete = () => {
    if (!rowToDelete) return;
    deleteAnnouncement(rowToDelete?._id as string, {
      onSuccess: () => setRowToDelete(null),
    });
  };

  const columns: AppGridColDef<AnnouncementBase>[] = [
    CommonObjectNameColumn<AnnouncementBase>("companyId", { headerName: "Company", width: 200 }),
    { field: "type", headerName: "Type", width: 150 },
    {
      field: "desc",
      headerName: "Description",
      width: 250,
      renderCell: (params) => (Array.isArray(params.row.desc) ? params.row.desc.join(", ") : params.row.desc),
    },
    { field: "link", headerName: "Link", width: 200 },
    { field: "version", headerName: "Version", width: 120 },
    ...(permission?.edit || permission?.delete
      ? [
        CommonActionColumn<AnnouncementBase>({
          ...(permission?.edit && {
            active: (row) =>
              editAnnouncement({
                announcementId: row._id,
                isActive: !row.isActive,
              }),
            editRoute: ROUTES.ANNOUNCEMENT.ADD_EDIT,
          }),
          ...(permission?.delete && { onDelete: (row) => setRowToDelete({ _id: row?._id, title: row?.type }) }),
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

  const filter = [CreateFilter("Select Company", "companyFilter", advancedFilter, updateAdvancedFilter, GenerateOptions(CompanyData?.data), CompanyDataLoading, { xs: 12, sm: 6, md: 3 }), CreateFilter("Select Type", "type", advancedFilter, updateAdvancedFilter, GenerateOptions(["General", "Update", "Maintenance"].map((t) => ({ _id: t, name: t }))), false, { xs: 12, sm: 6, md: 3 })];

  return (
    <>
      <CommonBreadcrumbs title={PAGE_TITLE.ANNOUNCEMENT.BASE} maxItems={1} breadcrumbs={BREADCRUMBS.ANNOUNCEMENT.BASE} />

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

export default Announcement;
