import { Box, Grid } from "@mui/material";
import { useMemo, useState } from "react";
import { Queries } from "../../../Api";
import { CommonDateRangeSelector } from "../../../Attribute";
import { AdvancedSearch, CalculateGridSummary, CommonBreadcrumbs, CommonCard, CommonDataGrid, CommonDataGridSummaryFooter, CommonObjectNameColumn } from "../../../Components/Common";
import { PAGE_TITLE } from "../../../Constants";
import { BREADCRUMBS, SALES_REGISTER_STATUS } from "../../../Data";
import type { AppGridColDef, PosCashRegisterBase } from "../../../Types";
import { CreateFilter, DateConfig, GenerateOptions } from "../../../Utils";
import { useDataGrid } from "../../../Utils/Hooks";
import { CommonObjectPropertyColumn } from "../../../Components/Common/CommonDataGrid/CommonColumns";

const SalesRegister = () => {
  const { paginationModel, setPaginationModel, sortModel, setSortModel, filterModel, setFilterModel, params, advancedFilter, updateAdvancedFilter } = useDataGrid({ active: false });

  const [dateRange, setDateRange] = useState({ start: DateConfig.utc().startOf("month"), end: DateConfig.utc().endOf("month") });
  const queryParams = useMemo(() => ({ startDate: dateRange.start.toISOString(), endDate: dateRange.end.toISOString() }), [dateRange]);

  const { data: userDropdown, isLoading: userDropdownLoading } = Queries.useGetUserDropdown();
  const { data: CompanyData, isLoading: CompanyDataLoading } = Queries.useGetCompanyDropdown();
    const companyId = advancedFilter?.companyFilter?.[0] || "";
  const { data: BranchData, isLoading: BranchDataLoading } = Queries.useGetBranchDropdown({ companyFilter: companyId }, Boolean(companyId));

  const { data, isLoading, isFetching } = Queries.useGetPosCashRegister({ ...params, ...queryParams });
  const { refetch: fetchAll, isFetching: AllFetching, isLoading: AllLoading } = Queries.useGetPosCashRegister({}, false);
  const rows = useMemo(() => {
    const apiData = data?.data?.posCashRegister_data;
    return apiData?.map((r: PosCashRegisterBase) => ({ ...r, id: r._id, shortExceed: (r.physicalDrawerCash || 0) - (r.totalCashLeftInDrawer || 0) })) || [];
  }, [data]);

  const totalRows = data?.data?.totalData || 0;

  const summary = useMemo(() => {
    return CalculateGridSummary(rows, ["openingCash", "cashPayment", "cardPayment", "upiPayment", "payLater", "totalSales", "creditAdvanceRedeemed", "salesReturn", "physicalDrawerCash", "shortExceed"]);
  }, [rows]);

  const columns: AppGridColDef<PosCashRegisterBase>[] = [
    CommonObjectNameColumn<PosCashRegisterBase>("companyId", { headerName: "Company", width: 200 }), //
    CommonObjectNameColumn<PosCashRegisterBase>("branchId", { headerName: "Branch", width: 200 }),
    CommonObjectPropertyColumn<PosCashRegisterBase>("salesManId", "salesManId", ["fullName"], { headerName: "Sales Man", width: 150 }),
    CommonObjectPropertyColumn<PosCashRegisterBase>("created", "createdAt", [], { headerName: "From Date", width: 100, type: "date" }),
    CommonObjectPropertyColumn<PosCashRegisterBase>("updated", "updatedAt", [], { headerName: "To Date", width: 100, type: "date" }),
    CommonObjectPropertyColumn<PosCashRegisterBase>("status", "status", [], { headerName: "Status", width: 100, type: "status" }),
    { field: "openingCash", headerName: "Cash In Hand", width: 130, isSummary: true },
    { field: "cashPayment", headerName: "Cash", width: 110, isSummary: true },
    { field: "cardPayment", headerName: "Card", width: 110, isSummary: true },
    { field: "upiPayment", headerName: "UPI", width: 110, isSummary: true },
    { field: "payLater", headerName: "Pay Later", width: 110, isSummary: true },
    { field: "totalSales", headerName: "Total Sales", width: 130, isSummary: true },
    { field: "creditAdvanceRedeemed", headerName: "Credit/Advance Redeemed", width: 190, isSummary: true },
    { field: "salesReturn", headerName: "Sales Return Amount", width: 160, isSummary: true },
    { field: "bankTransferAmount", headerName: "Cash Transfered To HO", width: 180, isSummary: true },
    { field: "physicalDrawerCash", headerName: "Closing Amount", width: 150, isSummary: true },
    { field: "shortExceed", headerName: "Short/Exceed", width: 140, isSummary: true },
    CommonObjectPropertyColumn<PosCashRegisterBase>("createdBy", "createdBy", ["fullName"], { headerName: "Created By", flex: 1, minWidth: 150 }),
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
    fileName: PAGE_TITLE.POS.SALES_REGISTER,
    onExportAll: { onExportAll: fetchAll, isFetching: AllLoading || AllFetching },
    slots: {
      bottomContainer: () => <CommonDataGridSummaryFooter summary={summary} />,
    },
  };

  const filter = [
    CreateFilter("Select Company", "companyFilter", advancedFilter, updateAdvancedFilter, GenerateOptions(CompanyData?.data), CompanyDataLoading, { xs: 12, sm: 6, md: 3 }), //
    CreateFilter("Select Branch", "branchFilter", advancedFilter, updateAdvancedFilter, GenerateOptions(BranchData?.data), BranchDataLoading, { xs: 12, sm: 6, md: 3 }),
    CreateFilter("Select Salesman", "salesManFilter", advancedFilter, updateAdvancedFilter, GenerateOptions(userDropdown?.data), userDropdownLoading, { xs: 12, sm: 6, md: 3 }),
    CreateFilter("Select Status", "statusFilter", advancedFilter, updateAdvancedFilter, SALES_REGISTER_STATUS, false, { xs: 12, sm: 6, md: 3 }),
  ];

  return (
    <>
      <CommonBreadcrumbs title={PAGE_TITLE.POS.SALES_REGISTER} maxItems={1} breadcrumbs={BREADCRUMBS.SALES_REGISTER.BASE} />

      <Box sx={{ p: { xs: 2, md: 3 }, display: "grid", gap: 2 }}>
        <AdvancedSearch filter={filter} defaultExpanded>
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
