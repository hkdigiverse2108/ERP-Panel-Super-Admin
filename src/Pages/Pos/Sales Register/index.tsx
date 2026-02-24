import { Box } from "@mui/material";
import { useMemo } from "react";
import { PAGE_TITLE } from "../../../Constants";
import { useDataGrid, usePagePermission } from "../../../Utils/Hooks";
import { Queries } from "../../../Api";
import type { AppGridColDef } from "../../../Types";
import type { PosCashRegisterBase } from "../../../Types/PosCashRegister";
import { AdvancedSearch, CommonBreadcrumbs, CommonCard, CommonDataGrid, CommonObjectNameColumn } from "../../../Components/Common";
import { BREADCRUMBS } from "../../../Data";

const SalesRegister = () => {
  const { paginationModel, setPaginationModel, sortModel, setSortModel, filterModel, setFilterModel, isActive, setActive, params } = useDataGrid();
  const permission = usePagePermission(PAGE_TITLE.POS.SALES_REGISTER.BASE);
  const { data, isLoading, isFetching } = Queries.useGetPosCashRegister(params);

  const rows = useMemo(() => {
    return data?.data?.pos_cash_register_data?.map((r) => ({ ...r, id: r?._id })) || [];
  }, [data]);

  const totalRows = data?.data?.totalData || 0;

  const columns: AppGridColDef<PosCashRegisterBase>[] = [
    CommonObjectNameColumn<PosCashRegisterBase>("branchId", { headerName: "Branch", width: 180 }),
    { field: "openingCash", headerName: "Opening Cash", width: 150 },
    { field: "totalSales", headerName: "Total Sales", width: 150 },
    { field: "cashFlow", headerName: "Cash Flow", width: 150 },
    { field: "status", headerName: "Status", width: 120 },
    {
      field: "createdAt",
      headerName: "Date",
      flex: 1,
      minWidth: 150,
      renderCell: ({ value }) => (value ? new Date(value).toLocaleDateString() : "-"),
    },
  ];

  const gridOptions = {
    columns,
    rows,
    rowCount: totalRows,
    loading: isLoading || isFetching,
    isActive,
    setActive,
    paginationModel,
    onPaginationModelChange: setPaginationModel,
    sortModel,
    onSortModelChange: setSortModel,
    filterModel,
    onFilterModelChange: setFilterModel,
    isExport: true,
    fileName: "Sales_Register",
  };


  return (
    <>
      <CommonBreadcrumbs title={PAGE_TITLE.POS.SALES_REGISTER.BASE} maxItems={1} breadcrumbs={BREADCRUMBS.SALES_REGISTER.BASE} />

      <Box sx={{ p: { xs: 2, md: 3 }, display: "grid", gap: 2 }}>
        <CommonCard hideDivider>
          <CommonDataGrid {...gridOptions} />
        </CommonCard>
      </Box>
    </>
  );
};

export default SalesRegister;
