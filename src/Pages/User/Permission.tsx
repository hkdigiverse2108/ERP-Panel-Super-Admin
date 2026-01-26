import { Box } from "@mui/material";
import { useEffect, useMemo, useState } from "react";
import { useLocation } from "react-router-dom";
import { Mutations, Queries } from "../../Api";
import { CommonButton, CommonCheckbox } from "../../Attribute";
import { CommonBreadcrumbs, CommonCard, CommonDataGrid } from "../../Components/Common";
import type { AppGridColDef, PermissionColumnKey, PermissionDetailsApiPayload, PermissionKey } from "../../Types";
import { useDataGrid } from "../../Utils/Hooks";
import { PAGE_TITLE } from "../../Constants";
import { BREADCRUMBS } from "../../Data";

const PERMISSION_KEYS: PermissionKey[] = ["add", "edit", "delete", "view"];

const Permission = () => {
  const { sortModel, setSortModel, filterModel, setFilterModel, params } = useDataGrid({ active: false, pagination: false });

  const location = useLocation();
  const { data: userData } = location.state || {};

  const [permissionRows, setPermissionRows] = useState<PermissionDetailsApiPayload[]>([]);
  const { data, isLoading, isFetching } = Queries.useGetPermissionDetails({ ...params, userId: userData?._id }, Boolean(userData?._id));

  const { mutate: editPermission, isPending: isEditPermissionLoading } = Mutations.useEditUserPermission();
  /* -------------------- */
  /* Prepare rows */
  /* -------------------- */
  const allPermission = useMemo(() => data?.data?.map((m) => ({ ...m, id: m._id })) || [], [data]);

  useEffect(() => {
    setPermissionRows(allPermission);
  }, [allPermission]);

  /* -------------------- */
  /* Helpers */
  /* -------------------- */
  const hasAccess = (row: PermissionDetailsApiPayload, key: PermissionKey) => row[`has${key.charAt(0).toUpperCase() + key.slice(1)}` as keyof PermissionDetailsApiPayload];

  const isRowAllChecked = (row: PermissionDetailsApiPayload) => PERMISSION_KEYS.every((k) => !hasAccess(row, k) || row[k]);

  /* -------------------- */
  /* Row checkbox change */
  /* -------------------- */
  const handlePermissionChange = (rowId: string, key: PermissionColumnKey, value: boolean) => {
    if (key === "all") return;
    setPermissionRows((prev) =>
      prev.map((row) => {
        if (row.id !== rowId) return row;
        if (!hasAccess(row, key)) return row;
        return { ...row, [key]: value };
      }),
    );
  };

  const handleRowAllChange = (rowId: string, value: boolean) => {
    setPermissionRows((prev) =>
      prev.map((row) => {
        if (row.id !== rowId) return row;
        return {
          ...row,
          add: row.hasAdd ? value : row.add,
          edit: row.hasEdit ? value : row.edit,
          delete: row.hasDelete ? value : row.delete,
          view: row.hasView ? value : row.view,
        };
      }),
    );
  };

  /* -------------------- */
  /* Header helpers */
  /* -------------------- */
  const isHeaderChecked = (key: PermissionKey) => {
    const eligibleRows = permissionRows.filter((r) => hasAccess(r, key));
    if (!eligibleRows.length) return false;
    return eligibleRows.every((r) => r[key]);
  };

  const handleHeaderChange = (key: PermissionKey, value: boolean) => {
    setPermissionRows((prev) => prev.map((row) => (hasAccess(row, key) ? { ...row, [key]: value } : row)));
  };

  /* -------------------- */
  /* ALL header */
  /* -------------------- */
  const isAllHeaderChecked = useMemo(() => {
    if (!permissionRows.length) return false;
    return permissionRows.every((row) => isRowAllChecked(row));
  }, [permissionRows]);

  const handleAllHeaderChange = (value: boolean) => {
    setPermissionRows((prev) =>
      prev.map((row) => ({
        ...row,
        add: row.hasAdd ? value : row.add,
        edit: row.hasEdit ? value : row.edit,
        delete: row.hasDelete ? value : row.delete,
        view: row.hasView ? value : row.view,
      })),
    );
  };

  /* -------------------- */
  /* Permission column */
  /* -------------------- */
  const permissionColumn = (key: PermissionKey, label: string): AppGridColDef<PermissionDetailsApiPayload> => ({
    field: key,
    headerName: label,
    width: 150,
    align: "center",
    headerAlign: "center",
    sortable: false,
    filterable: false,
    renderHeader: () => <CommonCheckbox name="" label={label} value={isHeaderChecked(key)} onChange={(e) => handleHeaderChange(key, e)} />,
    renderCell: (params) => (hasAccess(params.row, key) ? <CommonCheckbox name="" value={params.row[key]} onChange={(e) => handlePermissionChange(params.row.id!, key, e)} /> : <span>-</span>),
  });

  /* -------------------- */
  /* ALL column */
  /* -------------------- */
  const allColumn: AppGridColDef<PermissionDetailsApiPayload> = {
    field: "all",
    headerName: "All",
    width: 150,
    align: "center",
    headerAlign: "center",
    sortable: false,
    filterable: false,
    renderHeader: () => <CommonCheckbox name="" label="All" value={isAllHeaderChecked} onChange={(e) => handleAllHeaderChange(e)} />,
    renderCell: (params) => <CommonCheckbox name="" value={isRowAllChecked(params.row)} onChange={(e) => handleRowAllChange(params.row.id!, e)} />,
  };

  const handleSaveAll = async () => {
    const payload = {
      userId: userData?._id,
      modules: permissionRows.map((row) => ({
        _id: row._id,
        view: !!row.view,
        add: !!row.add,
        edit: !!row.edit,
        delete: !!row.delete,
      })),
    };
    await editPermission(payload);
  };

  const topContent = <CommonButton variant="contained" title="Save All" size="small" loading={isEditPermissionLoading} onClick={handleSaveAll} />;

  const columns: AppGridColDef<PermissionDetailsApiPayload>[] = [
    { field: "tabName", headerName: "Tab Name", width: 300 }, //
    { field: "displayName", headerName: "Display Name", width: 300 },
    permissionColumn("add", "Add"),
    permissionColumn("edit", "Edit"),
    permissionColumn("delete", "Delete"),
    permissionColumn("view", "View"),
    allColumn,
  ];

  const CommonDataGridOption = {
    columns,
    rows: permissionRows,
    rowCount: permissionRows.length,
    loading: isLoading || isFetching,
    sortModel,
    onSortModelChange: setSortModel,
    filterModel,
    onFilterModelChange: setFilterModel,
    isExport: false,
    pagination: false,
  };

  return (
    <>
      <CommonBreadcrumbs title={PAGE_TITLE.USER.PERMISSION} maxItems={3} breadcrumbs={BREADCRUMBS.USER.PERMISSION} />
      <Box sx={{ p: 2 }}>
        <CommonCard title={`${userData?.fullName} (${userData?.username})`} topContent={topContent}>
          <CommonDataGrid {...CommonDataGridOption} />
        </CommonCard>
      </Box>
    </>
  );
};

export default Permission;
