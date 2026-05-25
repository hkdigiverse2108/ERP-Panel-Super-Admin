import { Mutations, Queries } from "../../../Api";
import { useDataGrid, usePagePermission } from "../../../Utils/Hooks";
import type { AppGridColDef, ReportFormatBase } from "../../../Types";
import { PAGE_TITLE, ROUTES } from "../../../Constants";
import { CommonActionColumn, CommonBreadcrumbs, CommonCard, CommonDataGrid, CommonDeleteModal } from "../../../Components/Common";
import { Box } from "@mui/material";
import { BREADCRUMBS } from "../../../Data";
import { useNavigate } from "react-router-dom";

const ReportFormat = () => {
  const { paginationModel, setPaginationModel, sortModel, setSortModel, filterModel, setFilterModel, rowToDelete, setRowToDelete, isActive, setActive, params } = useDataGrid();

  const navigate = useNavigate();

  const { data: reportFormatData, isLoading: reportFormatDataLoading, isFetching: reportFormatDataFetching } = Queries.useGetReportFormat(params);

  const { mutate: deleteReportFormatMutate } = Mutations.useDeleteReportFormat();
  const { mutate: editReportFormat, isPending: isEditLoading } = Mutations.useEditReportFormat();

  const allRows = reportFormatData?.data?.map((reportFormat: ReportFormatBase) => ({ ...reportFormat, id: reportFormat._id })) || [];
  const totalRows = reportFormatData?.data?.length || 0;

  const permission = usePagePermission(PAGE_TITLE.SETTINGS.REPORT_FORMAT.BASE);

  const handleDeleteBtn = () => {
    if (!rowToDelete) return;
    deleteReportFormatMutate(rowToDelete?._id as string, {
      onSuccess: () => setRowToDelete(null),
    });
  };

  const handleAdd = () => navigate(ROUTES.REPORT_FORMAT.ADD_EDIT);

  const columns: AppGridColDef<ReportFormatBase>[] = [
    { field: "type", headerName: "Type", flex: 1, minWidth: 150 },
    { field: "formats.length", headerName: "Total Formats", flex: 1, minWidth: 150, renderCell: (params) => params.row?.formats?.length },

    ...(permission?.edit || permission?.delete
      ? [
          CommonActionColumn<ReportFormatBase>({
            ...(permission?.edit && { active: (row) => editReportFormat({ reportFormatId: row._id, isActive: !row.isActive }), editRoute: ROUTES.REPORT_FORMAT.ADD_EDIT }),
            ...(permission?.delete && { onDelete: (row) => setRowToDelete({ _id: row._id, title: row.type }) }),
          }),
        ]
      : []),
  ];

  const CommonDataGridOption = {
    columns,
    rows: allRows,
    rowCount: totalRows,
    loading: reportFormatDataLoading || reportFormatDataFetching || isEditLoading,
    isActive,
    setActive,
    ...(permission?.add && { handleAdd }),
    paginationModel,
    onPaginationModelChange: setPaginationModel,
    sortModel,
    onSortModelChange: setSortModel,
    filterModel,
    onFilterModelChange: setFilterModel,
    fileName: PAGE_TITLE.SETTINGS.REPORT_FORMAT.BASE,
  };

  return (
    <>
      <CommonBreadcrumbs title={PAGE_TITLE.SETTINGS.REPORT_FORMAT.BASE} maxItems={1} breadcrumbs={BREADCRUMBS.SETTINGS.REPORT_FORMAT} />
      <Box sx={{ p: { xs: 2, md: 3 }, display: "grid", gap: 2 }}>
        <CommonCard hideDivider>
          <CommonDataGrid {...CommonDataGridOption} />
        </CommonCard>
        <CommonDeleteModal open={Boolean(rowToDelete)} itemName={rowToDelete?.title} onClose={() => setRowToDelete(null)} onConfirm={() => handleDeleteBtn()} />
      </Box>
    </>
  );
};

export default ReportFormat;
