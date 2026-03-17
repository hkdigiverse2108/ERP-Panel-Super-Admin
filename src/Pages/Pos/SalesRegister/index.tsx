import { Box, Grid } from "@mui/material";
import dayjs from "dayjs";
import { useMemo, useState } from "react";
import { Queries } from "../../../Api";
import { CommonDateRangeSelector } from "../../../Attribute";
import { AdvancedSearch, CalculateGridSummary, CommonBreadcrumbs, CommonCard, CommonDataGrid, CommonDataGridSummaryFooter, CommonObjectNameColumn } from "../../../Components/Common";
import { PAGE_TITLE } from "../../../Constants";
import { BREADCRUMBS } from "../../../Data";
import type { AppGridColDef, PosCashRegisterBase } from "../../../Types";
import { CreateFilter, FormatDate, GenerateOptions } from "../../../Utils";
import { useDataGrid } from "../../../Utils/Hooks";

const SalesRegister = () => {
  const { paginationModel, setPaginationModel, sortModel, setSortModel, filterModel, setFilterModel, params, advancedFilter, updateAdvancedFilter } = useDataGrid({ active: false });

  const [dateRange, setDateRange] = useState({ start: dayjs(), end: dayjs() });

  const { data: userDropdown, isLoading: userDropdownLoading } = Queries.useGetUserDropdown();

  const { data: CompanyData, isLoading: CompanyDataLoading } = Queries.useGetCompanyDropdown();

  const queryParams = useMemo(() => ({ ...params, startDate: dateRange.start.format("YYYY-MM-DD"), endDate: dateRange.end.format("YYYY-MM-DD") }), [params, dateRange]);

  const { data, isLoading, isFetching } = Queries.useGetPosCashRegister(queryParams);

  const rows = useMemo(() => {
    const apiData = data?.data?.posCashRegister_data;
    return apiData?.map((r: PosCashRegisterBase) => ({ ...r, id: r._id, shortExceed: (r.physicalDrawerCash || 0) - (r.totalCashLeftInDrawer || 0) })) || [];
  }, [data]);

  const totalRows = data?.data?.totalData || 0;

  const summary = useMemo(() => {
    return CalculateGridSummary(rows, ["openingCash", "cashPayment", "cardPayment", "upiPayment", "payLater", "totalSales", "creditAdvanceRedeemed", "salesReturn", "physicalDrawerCash", "shortExceed"]);
  }, [rows]);

  const salesmanOptions = useMemo(() => {
    return userDropdown?.data?.map((user) => ({ ...user, name: user.fullName || user.username || "Unnamed" })) || [];
  }, [userDropdown]);

  const columns: AppGridColDef<PosCashRegisterBase>[] = [
    CommonObjectNameColumn<PosCashRegisterBase>("companyId", { headerName: "Company", width: 200 }),
    {
      field: "salesManId",
      headerName: "Salesman",
      width: 180,
      renderCell: (params) => {
        const s = params.row.salesManId;
        return typeof s === "string" || !s ? "-" : s.fullName || "-";
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
    { field: "shortExceed", headerName: "Short/Exceed", width: 140 },
  ];

  const gridOptions = {
    columns,
    rows,
    rowCount: totalRows,
    loading: isLoading || isFetching,
    paginationModel,
    onPaginationModelChange: setPaginationModel,
    sortModel,
    onSortModelChange: setSortModel,
    filterModel,
    onFilterModelChange: setFilterModel,
    isExport: true,
    fileName: "Sales_Register",
    slots: {
      bottomContainer: () => <CommonDataGridSummaryFooter summary={summary} />,
    },
  };

  const filter = [CreateFilter("Select Company", "companyFilter", advancedFilter, updateAdvancedFilter, GenerateOptions(CompanyData?.data), CompanyDataLoading, { xs: 12, sm: 6, md: 3 }), CreateFilter("Select Salesman", "salesmanFilter", advancedFilter, updateAdvancedFilter, GenerateOptions(salesmanOptions), userDropdownLoading, { xs: 12, sm: 6, md: 3 })];

  return (
    <>
      <CommonBreadcrumbs title={PAGE_TITLE.POS.SALES_REGISTER} maxItems={1} breadcrumbs={BREADCRUMBS.SALES_REGISTER.BASE} />

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
