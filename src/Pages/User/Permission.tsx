import { Box } from "@mui/material";
import { useEffect, useMemo, useState } from "react";
import { Queries } from "../../Api";
import { CommonCard, CommonDataGrid } from "../../Components/Common";
import { useAppSelector } from "../../Store/hooks";
import type { AppGridColDef, PermissionDetailsApiPayload, PermissionKey } from "../../Types";
import { useDataGrid } from "../../Utils/Hooks";

const Permission = () => {
  const { sortModel, setSortModel, filterModel, setFilterModel, params } = useDataGrid({ active: false, pagination: false });
  const [permissionRows, setPermissionRows] = useState<PermissionDetailsApiPayload[]>([]);
  const { user } = useAppSelector((state) => state.auth);
  const { data: permissionData, isLoading, isFetching } = Queries.useGetPermissionDetails({ ...params, userId: user?._id }, Boolean(user?._id));

  /* -------------------- */
  /* Prepare rows */
  /* -------------------- */
  const allModule = useMemo(() => permissionData?.data?.map((m) => ({ ...m, id: m._id })) || [], [permissionData]);

  useEffect(() => {
    setPermissionRows(allModule);
  }, [allModule]);

  /* -------------------- */
  /* Permission access map */
  /* -------------------- */
    // const permissionAccessMap: Record<PermissionColumnKey, boolean> = {
    //   add: data?.hasAdd ?? false,
    //   edit: data?.hasEdit ?? false,
    //   delete: data?.hasDelete ?? false,
    //   view: data?.hasView ?? false,
    //   all: Boolean(data?.hasAdd || data?.hasEdit || data?.hasDelete || data?.hasView),
    // };

  /* -------------------- */
  /* Row change handler */
  /* -------------------- */
    // const handlePermissionChange = (rowId: string, key: PermissionColumnKey, value: boolean) => {
    //   setPermissionRows((prev) =>
    //     prev.map((row) => {
    //       if (row.id !== rowId) return row;

    //       // ALL (row)
    //       if (key === "all") {
    //         return {
    //           ...row,
    //           permissions: {
    //             add: permissionAccessMap.add ? value : row.add,
    //             edit: permissionAccessMap.edit ? value : row.edit,
    //             delete: permissionAccessMap.delete ? value : row.delete,
    //             view: permissionAccessMap.view ? value : row.view,
    //           },
    //         };
    //       }

    //       if (!permissionAccessMap[key]) return row;

    //       return {
    //         ...row,
    //         permissions: {
    //           ...row,
    //           [key]: value,
    //         },
    //       };
    //     }),
    //   );
    // };

  /* -------------------- */
  /* Header helpers */
  /* -------------------- */
    // const isHeaderChecked = (key: PermissionKey) => {
    //   if (!permissionAccessMap[key]) return false;
    //   return permissionRows.length > 0 && permissionRows.every((r) => r[key]);
    // };

    // const handleHeaderChange = (key: PermissionKey, value: boolean) => {
    //   if (!permissionAccessMap[key]) return;

    //   setPermissionRows((prev) =>
    //     prev.map((row) => ({
    //       ...row,
    //       permissions: {
    //         ...row.permissions,
    //         [key]: value,
    //       },
    //     })),
    //   );
    // };

  /* -------------------- */
  /* ALL header logic */
  /* -------------------- */
    // const isAllHeaderChecked = useMemo(() => {
    //   const keys: PermissionKey[] = ["add", "edit", "delete", "view"];
    //   const activeKeys = keys.filter((k) => permissionAccessMap[k]);
    //   if (!activeKeys.length) return false;

    //   return permissionRows.every((row) => activeKeys.every((k) => row.permissions[k]));
    // }, [permissionRows, permissionAccessMap]);

    // const handleAllHeaderChange = (value: boolean) => {
    //   setModuleRows((prev) =>
    //     prev.map((row) => ({
    //       ...row,
    //       permissions: {
    //         add: permissionAccessMap.add ? value : row.permissions.add,
    //         edit: permissionAccessMap.edit ? value : row.permissions.edit,
    //         delete: permissionAccessMap.delete ? value : row.permissions.delete,
    //         view: permissionAccessMap.view ? value : row.permissions.view,
    //       },
    //     })),
    //   );
    // };

  /* -------------------- */
  /* Permission column factory */
  /* -------------------- */
    const permissionColumnWithHeader = (key: PermissionKey, label: string): AppGridColDef<PermissionDetailsApiPayload> => ({
      field: `has${label}`,
      headerName: label,
      width: 170,
      align: "center",
      headerAlign: "center",
      sortable: false,
      filterable: false,

    //   renderHeader: () => (permissionAccessMap[key] ? <CommonCheckbox name="" label={label} value={isHeaderChecked(key)} onChange={(e) => handleHeaderChange(key, e)} /> : <span>{label}</span>),

    //   renderCell: (params) => (permissionAccessMap[key] ? <CommonCheckbox name="" value={params.row.permissions[key]} onChange={(e) => handlePermissionChange(params.row.id!, key, e)} /> : <span>-</span>),
    });

  /* -------------------- */
  /* ALL column */
  /* -------------------- */
  //   const allColumn: AppGridColDef<UserModulePermissionDataResponse> = {
  //     field: "hasAll",
  //     headerName: "All",
  //     width: 170,
  //     align: "center",
  //     headerAlign: "center",
  //     sortable: false,
  //     filterable: false,

  //     renderHeader: () => (permissionAccessMap.all ? <CommonCheckbox name="" label="All" value={isAllHeaderChecked} onChange={(e) => handleAllHeaderChange(e)} /> : <span>All</span>),

  //     renderCell: (params) => {
  //       const allowedKeys: PermissionKey[] = ["add", "edit", "delete", "view"];

  //       const isAllChecked = allowedKeys.filter((k) => permissionAccessMap[k]).every((k) => params.row.permissions[k]);

  //       return permissionAccessMap.all ? <CommonCheckbox name={""} value={isAllChecked} onChange={(e) => handlePermissionChange(params.row.id!, "all", e)} /> : <span>-</span>;
  //     },
  //   };

  /* -------------------- */
  /* Columns */
  /* -------------------- */
  const columns: AppGridColDef<PermissionDetailsApiPayload>[] = [
    { field: "tabName", headerName: "Tab Name", width: 300 }, //
    { field: "displayName", headerName: "Display Name", width: 300 },
    permissionColumnWithHeader("add", "Add"),
    permissionColumnWithHeader("edit", "Edit"),
    permissionColumnWithHeader("delete", "Delete"),
    permissionColumnWithHeader("view", "View"),
    // allColumn,
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
    <Box sx={{ p: 2 }}>
      <CommonCard>
        <CommonDataGrid {...CommonDataGridOption} />
      </CommonCard>
    </Box>
  );
};

export default Permission;
