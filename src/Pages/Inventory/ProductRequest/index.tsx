import { useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { Queries } from "../../../Api";
import { CommonBreadcrumbs, CommonCard, CommonDataGrid } from "../../../Components/Common";
import { PAGE_TITLE, ROUTES } from "../../../Constants";
import type { AppGridColDef, ProductRequestBase } from "../../../Types";
import { useDataGrid } from "../../../Utils/Hooks";
import { Box } from "@mui/material";
import { BREADCRUMBS } from "../../../Data";

const ProductRequest = () => {
  const { paginationModel, setPaginationModel, sortModel, setSortModel, filterModel, setFilterModel, isActive, setActive, params } = useDataGrid();
  const navigate = useNavigate();

  const { data: productRequestData, isLoading: productRequestDataLoading, isFetching: productRequestDataFetching } = Queries.useGetProductRequest(params);

  const allProduct = useMemo(() => productRequestData?.data?.product_data.map((emp) => ({ ...emp, id: emp?._id })) || [], [productRequestData]);
  const totalRows = productRequestData?.data?.totalData || 0;

  const handleAdd = () => navigate(ROUTES.PRODUCT_REQUEST.ADD_EDIT);

  const columns: AppGridColDef<ProductRequestBase>[] = [
    { field: "name", headerName: "Name", width: 150 },
    { field: "printName", headerName: "Print Name", width: 200 },
    { field: "category", headerName: "Category", width: 170 },
    { field: "subCategory", headerName: "Sub Category", width: 170 },
    { field: "brand", headerName: "Brand", width: 240 },
    { field: "subBrand", headerName: "Sub Brand", width: 240 },
    { field: "productType", headerName: "Product Type", width: 150 },
    {
      field: "status",
      headerName: "status",
      width: 150,
      renderCell: (params) => <span style={{ color: params.row.status === "accepted" ? "green" : params.row.status === "rejected" ? "red" : "orange", fontWeight: 600 }}>{params.row.status}</span>,
    },
  ];

  const CommonDataGridOption = {
    columns,
    rows: allProduct,
    rowCount: totalRows,
    loading: productRequestDataLoading || productRequestDataFetching,
    isActive,
    setActive,
    handleAdd,
    paginationModel,
    onPaginationModelChange: setPaginationModel,
    sortModel,
    onSortModelChange: setSortModel,
    filterModel,
    onFilterModelChange: setFilterModel,
    isExport: false,
  };

  return (
    <>
      <CommonBreadcrumbs title={PAGE_TITLE.INVENTORY.PRODUCT.REQUEST.BASE} maxItems={1} breadcrumbs={BREADCRUMBS.PRODUCT.REQUEST.BASE} />
      <Box sx={{ p: { xs: 2, md: 3 }, display: "grid" }}>
        <CommonCard hideDivider>
          <CommonDataGrid {...CommonDataGridOption} />
        </CommonCard>
      </Box>
    </>
  );
};

export default ProductRequest;
