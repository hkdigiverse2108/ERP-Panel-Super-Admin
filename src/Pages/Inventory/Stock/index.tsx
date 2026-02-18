import { Box } from "@mui/material";
import { useMemo } from "react";
import { Queries } from "../../../Api";
import { AdvancedSearch, CommonBreadcrumbs, CommonCard, CommonDataGrid, CommonObjectNameColumn } from "../../../Components/Common";
import { PAGE_TITLE } from "../../../Constants";
import { BREADCRUMBS } from "../../../Data";
import type { AppGridColDef } from "../../../Types";
import type { StockBase } from "../../../Types/Stock";
import { useDataGrid } from "../../../Utils/Hooks";
import { CreateFilter, GenerateOptions } from "../../../Utils";

const Stock = () => {
  const { paginationModel, setPaginationModel, sortModel, setSortModel, filterModel, setFilterModel, isActive, setActive, params, advancedFilter, updateAdvancedFilter } = useDataGrid();

  const { data: stockData, isLoading: stockDataLoading, isFetching: stockDataFetching } = Queries.useGetStock(params);
  const { data: CompanyData, isLoading: CompanyDataLoading } = Queries.useGetCompanyDropdown();

  const allStock = useMemo(() => stockData?.data?.stock_data.map((emp) => ({ ...emp, id: emp?._id })) || [], [stockData]);
  const totalRows = stockData?.data?.totalData || 0;

  const columns: AppGridColDef<StockBase>[] = [CommonObjectNameColumn("companyId", { headerName: "Company Name", width: 200 }), { field: "name", headerName: "Product Name", width: 320 }, CommonObjectNameColumn("categoryId", { headerName: "Category Name", width: 230 }), CommonObjectNameColumn("subCategoryId", { headerName: "Sub Category Name", width: 230 }), CommonObjectNameColumn("brandId", { headerName: "Brand Name", width: 230 }), CommonObjectNameColumn("subBrandId", { headerName: "Sub Brand Name", width: 230 }), { field: "availableQty", headerName: "Available Qty", flex: 1, minWidth: 200 }];

  const CommonDataGridOption = {
    columns,
    rows: allStock,
    rowCount: totalRows,
    loading: stockDataLoading || stockDataFetching,
    isActive,
    setActive,
    paginationModel,
    onPaginationModelChange: setPaginationModel,
    sortModel,
    onSortModelChange: setSortModel,
    filterModel,
    onFilterModelChange: setFilterModel,
  };

  const filter = [CreateFilter("Select Company", "companyFilter", advancedFilter, updateAdvancedFilter, GenerateOptions(CompanyData?.data), CompanyDataLoading, { xs: 12, sm: 6, md: 3 })];

  return (
    <>
      <CommonBreadcrumbs title={PAGE_TITLE.INVENTORY.STOCK.BASE} maxItems={1} breadcrumbs={BREADCRUMBS.STOCK.BASE} />
      <Box sx={{ p: { xs: 2, md: 3 }, display: "grid", gap: 2 }}>
        <AdvancedSearch filter={filter} />
        <CommonCard hideDivider>
          <CommonDataGrid {...CommonDataGridOption} />
        </CommonCard>
      </Box>
    </>
  );
};

export default Stock;
