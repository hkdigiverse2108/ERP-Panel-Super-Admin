import { Box } from "@mui/material";
import { useEffect, useMemo, type FC } from "react";
import { Queries } from "../../Api";
import { CommonCheckbox } from "../../Attribute";
import { CommonCard, CommonDataGrid } from "../../Components/Common";
import type { AppGridColDef, ModuleAccessProps, PermissionColumnKey, PermissionKey, UserModulePermissionDataResponse } from "../../Types";
import { useDataGrid } from "../../Utils/Hooks";

const ModuleAccess: FC<ModuleAccessProps> = ({ data, moduleRows, setModuleRows }) => {
  const { sortModel, setSortModel, filterModel, setFilterModel, params } = useDataGrid({ active: false, pagination: false });

  const { data: ModuleData, isLoading, isFetching } = Queries.useGetModuleUserPermission({ ...params, moduleId: data?._id }, Boolean(data?._id));

  /* -------------------- */
  /* Prepare rows */
  /* -------------------- */
  const allModule = useMemo(() => ModuleData?.data?.map((m) => ({ ...m, id: m._id })) || [], [ModuleData]);

  useEffect(() => {
    setModuleRows(allModule);
  }, [allModule, setModuleRows]);

  /* -------------------- */
  /* Permission access map */
  /* -------------------- */
  const permissionAccessMap: Record<PermissionColumnKey, boolean> = {
    add: data?.hasAdd ?? false,
    edit: data?.hasEdit ?? false,
    delete: data?.hasDelete ?? false,
    view: data?.hasView ?? false,
    all: Boolean(data?.hasAdd || data?.hasEdit || data?.hasDelete || data?.hasView),
  };

  /* -------------------- */
  /* Row change handler */
  /* -------------------- */
  const handlePermissionChange = (rowId: string, key: PermissionColumnKey, value: boolean) => {
    setModuleRows((prev) =>
      prev.map((row) => {
        if (row.id !== rowId) return row;

        // ALL (row)
        if (key === "all") {
          return {
            ...row,
            permissions: {
              add: permissionAccessMap.add ? value : row.permissions.add,
              edit: permissionAccessMap.edit ? value : row.permissions.edit,
              delete: permissionAccessMap.delete ? value : row.permissions.delete,
              view: permissionAccessMap.view ? value : row.permissions.view,
            },
          };
        }

        if (!permissionAccessMap[key]) return row;

        return {
          ...row,
          permissions: {
            ...row.permissions,
            [key]: value,
          },
        };
      }),
    );
  };

  /* -------------------- */
  /* Header helpers */
  /* -------------------- */
  const isHeaderChecked = (key: PermissionKey) => {
    if (!permissionAccessMap[key]) return false;
    return moduleRows.length > 0 && moduleRows.every((r) => r.permissions[key]);
  };

  const handleHeaderChange = (key: PermissionKey, value: boolean) => {
    if (!permissionAccessMap[key]) return;

    setModuleRows((prev) =>
      prev.map((row) => ({
        ...row,
        permissions: {
          ...row.permissions,
          [key]: value,
        },
      })),
    );
  };

  /* -------------------- */
  /* ALL header logic */
  /* -------------------- */
  const isAllHeaderChecked = useMemo(() => {
    const keys: PermissionKey[] = ["add", "edit", "delete", "view"];
    const activeKeys = keys.filter((k) => permissionAccessMap[k]);
    if (!activeKeys.length) return false;

    return moduleRows.every((row) => activeKeys.every((k) => row.permissions[k]));
  }, [moduleRows, permissionAccessMap]);

  const handleAllHeaderChange = (value: boolean) => {
    setModuleRows((prev) =>
      prev.map((row) => ({
        ...row,
        permissions: {
          add: permissionAccessMap.add ? value : row.permissions.add,
          edit: permissionAccessMap.edit ? value : row.permissions.edit,
          delete: permissionAccessMap.delete ? value : row.permissions.delete,
          view: permissionAccessMap.view ? value : row.permissions.view,
        },
      })),
    );
  };

  /* -------------------- */
  /* Permission column factory */
  /* -------------------- */
  const permissionColumnWithHeader = (key: PermissionKey, label: string): AppGridColDef<UserModulePermissionDataResponse> => ({
    field: `has${label}`,
    headerName: label,
    width: 170,
    align: "center",
    headerAlign: "center",
    sortable: false,
    filterable: false,

    renderHeader: () => (permissionAccessMap[key] ? <CommonCheckbox name="" label={label} value={isHeaderChecked(key)} onChange={(e) => handleHeaderChange(key, e)} /> : <span>{label}</span>),

    renderCell: (params) => (permissionAccessMap[key] ? <CommonCheckbox name="" value={params.row.permissions[key]} onChange={(e) => handlePermissionChange(params.row.id!, key, e)} /> : <span>-</span>),
  });

  /* -------------------- */
  /* ALL column */
  /* -------------------- */
  const allColumn: AppGridColDef<UserModulePermissionDataResponse> = {
    field: "hasAll",
    headerName: "All",
    width: 150,
    align: "center",
    headerAlign: "center",
    sortable: false,
    filterable: false,

    renderHeader: () => (permissionAccessMap.all ? <CommonCheckbox name="" label="All" value={isAllHeaderChecked} onChange={(e) => handleAllHeaderChange(e)} /> : <span>All</span>),

    renderCell: (params) => {
      const allowedKeys: PermissionKey[] = ["add", "edit", "delete", "view"];

      const isAllChecked = allowedKeys.filter((k) => permissionAccessMap[k]).every((k) => params.row.permissions[k]);

      return permissionAccessMap.all ? <CommonCheckbox name={""} value={isAllChecked} onChange={(e) => handlePermissionChange(params.row.id!, "all", e)} /> : <span>-</span>;
    },
  };

  /* -------------------- */
  /* Columns */
  /* -------------------- */
  const columns: AppGridColDef<UserModulePermissionDataResponse>[] = [
    { field: "fullName", headerName: "User Full Name", width: 300 }, //
    { field: "email", headerName: "User Email", width: 300 },
    permissionColumnWithHeader("add", "Add"),
    permissionColumnWithHeader("edit", "Edit"),
    permissionColumnWithHeader("delete", "Delete"),
    permissionColumnWithHeader("view", "View"),
    allColumn,
  ];
  
  const CommonDataGridOption = {
    columns,
    rows: moduleRows,
    rowCount: moduleRows.length,
    loading: isLoading || isFetching,
    sortModel,
    onSortModelChange: setSortModel,
    filterModel,
    onFilterModelChange: setFilterModel,
    isExport: false,
    pagination: false,
  };

  return (
    <Box sx={{ p: 2 }}>
      <CommonCard>
        <CommonDataGrid {...CommonDataGridOption} />
      </CommonCard>
    </Box>
  );
};

export default ModuleAccess;
