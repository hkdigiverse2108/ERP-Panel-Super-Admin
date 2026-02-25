import { Box, Grid } from "@mui/material";
import dayjs from "dayjs";
import { useMemo, useState } from "react";
import { Queries } from "../../../Api";
import { CommonDateRangeSelector } from "../../../Attribute";
import { AdvancedSearch, CommonBreadcrumbs, CommonCard, CommonDataGrid } from "../../../Components/Common";
import { PAGE_TITLE } from "../../../Constants";
import { BREADCRUMBS } from "../../../Data";
import type { AppGridColDef } from "../../../Types";
import type { PosCashRegisterBase } from "../../../Types/PosCashRegister";
import { CreateFilter, FormatDate, GenerateOptions } from "../../../Utils";
import { useDataGrid } from "../../../Utils/Hooks";

const SalesRegister = () => {
  const { paginationModel, setPaginationModel, sortModel, setSortModel, filterModel, setFilterModel, isActive, setActive, params, advancedFilter, updateAdvancedFilter } = useDataGrid({ active: false });

  const [dateRange, setDateRange] = useState({ start: dayjs(), end: dayjs() });

  const { data: branchData, isLoading: branchLoading } = Queries.useGetBranchDropdown();
  const { data: userDropdown, isLoading: userDropdownLoading } = Queries.useGetUserDropdown();

  const queryParams = useMemo(() => ({ ...params, startDate: dateRange.start.format("YYYY-MM-DD"), endDate: dateRange.end.format("YYYY-MM-DD") }), [params, dateRange]);

  const { data, isLoading, isFetching } = Queries.useGetPosCashRegister(queryParams);

  const rows = useMemo(() => {
    const apiData = data?.data?.posCashRegister_data || data?.data?.posCashRegister_data;
    return apiData?.map((r: PosCashRegisterBase) => ({ ...r, id: r._id })) || [];
  }, [data]);

  const totalRows = data?.data?.totalData || 0;

  const columns: AppGridColDef<PosCashRegisterBase>[] = [
    {
      field: "createdBy",
      headerName: "Salesman",
      width: 180,
      renderCell: (params) => {
        const creator = params.row.createdBy;
        if (typeof creator === "object" && creator !== null) {
          return creator.fullName || creator.username || "-";
        }
        return creator || "-";
      },
    },
    { field: "createdAt", headerName: "From Date", width: 150, renderCell: (params) => FormatDate(params.value) },
    { field: "updatedAt", headerName: "To Date", width: 150, renderCell: (params) => FormatDate(params.value) },
    { field: "status", headerName: "Status", headerAlign: "center", width: 110, renderCell: (params) => <span className={`status-${params.row.status}`}>{params.row.status}</span> },
    { field: "openingCash", headerName: "Cash In Hand", width: 130 },
    { field: "cashPayment", headerName: "Cash", width: 110 },
    { field: "cardPayment", headerName: "Card", width: 110 },
    { field: "upiPayment", headerName: "UPI", width: 110 },
    { field: "payLater", headerName: "Pay Later", width: 110 },
    { field: "totalSales", headerName: "Total Sales", width: 130 },
    { field: "creditAdvanceRedeemed", headerName: "Credit/Advance Redeemed", width: 190 },
    { field: "salesReturn", headerName: "Sales Return Amount", width: 160 },
    { field: "bankTransferAmount", headerName: "Cash Transfered To HO", width: 180 },
    { field: "physicalDrawerCash", headerName: "Closing Amount", width: 150 },
    {
      field: "shortExceed",
      headerName: "Short/Exceed",
      width: 140,
      renderCell: (params) => {
        const physical = params.row.physicalDrawerCash || 0;
        const expected = params.row.totalCashLeftInDrawer || 0;
        return physical - expected;
      },
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

  const filter = [CreateFilter("Select Location", "branchFilter", advancedFilter, updateAdvancedFilter, GenerateOptions(branchData?.data), branchLoading, { xs: 12, sm: 6, md: 3 }), CreateFilter("Select Salesman", "salesmanFilter", advancedFilter, updateAdvancedFilter, GenerateOptions(userDropdown?.data), userDropdownLoading, { xs: 12, sm: 6, md: 3 })];

  return (
    <>
      <CommonBreadcrumbs title={PAGE_TITLE.POS.SALES_REGISTER.BASE} maxItems={1} breadcrumbs={BREADCRUMBS.SALES_REGISTER.BASE} />

      <Box sx={{ p: { xs: 2, md: 3 }, display: "grid", gap: 2 }}>
        <AdvancedSearch filter={filter}>
          <Grid size={{ xs: 12, sm: 6, md: 3 }}>
            <CommonDateRangeSelector value={dateRange} onChange={setDateRange} active="This Month" />
          </Grid>
        </AdvancedSearch>
        <CommonCard hideDivider>
          <CommonDataGrid {...gridOptions} />
        </CommonCard>
      </Box>
    </>
  );
};

export default SalesRegister;
