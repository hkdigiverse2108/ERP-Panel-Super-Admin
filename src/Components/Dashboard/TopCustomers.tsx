// import useBasicTableFilterHelper from "../../Utils/Hooks/useTableFilter";
// import dayjs from "dayjs";
// import { useState } from "react";
// import { CommonCard, CommonDataGrid } from "../Common";
// import { Grid } from "@mui/material";
// import { CommonDateRangeSelector } from "../../Attribute";

// const TopCustomers = () => {
//   const [range, setRange] = useState({
//     start: dayjs(),
//     end: dayjs(),
//   });

//   const { pageNumber, pageSize, sortBy, handlePaginationChange, handleSetSortBy } = useBasicTableFilterHelper({
//     sortKey: "sortBy",
//   });

//   // Example data
//   const rows = [
//     { id: 1, name: "Kenil", email: "kenil@gmail.com", status: "Active" },
//     { id: 2, name: "Amit", email: "amit@gmail.com", status: "Inactive" },
//   ];

//   const columns = [
//     {
//       field: "index",
//       headerName: "Sr No",
//       width: 90,
//       renderCell: (params) => {
//         const index = params.api.getRowIndexRelativeToVisibleRows(params.id);
//         return (pageNumber - 1) * pageSize + index + 1;
//       },
//     },
//     { field: "name", headerName: "Name", flex: 1, sortable: true },
//     { field: "email", headerName: "Email", flex: 1 },
//     {
//       field: "status",
//       headerName: "Status",
//       flex: 1,
//       renderCell: (params) => <span style={{ color: params.row.status === "Active" ? "green" : "red" }}>{params.row.status}</span>,
//     },
//   ];

//   const topContent = (
//     <Grid size={{ xs: 12, sm: 5, md: 4 }}>
//       <CommonDateRangeSelector value={range} onChange={setRange} active="This Month" />
//     </Grid>
//   );

//   return (
//     <CommonCard title="Top 20 Customers" topContent={topContent} grid={{ xs: 12, md: 6 }}>
//       <CommonDataGrid columns={columns} rows={rows} loading={false} page={pageNumber} limit={pageSize} total={20} sortBy={sortBy} onSortChange={handleSetSortBy} onPageChange={handlePaginationChange} height={450} />
//     </CommonCard>
//   );
// };

// export default TopCustomers;

import { Grid } from "@mui/material";
import dayjs from "dayjs";
import { useState } from "react";
import { CommonDateRangeSelector } from "../../Attribute";
import { CommonCard, CommonDataGrid } from "../Common";
import { useDataGrid } from "../../Utils/Hooks";

const TopCustomers = () => {
  const [range, setRange] = useState({
    start: dayjs(),
    end: dayjs(),
  });

  const { paginationModel, setPaginationModel, sortModel, setSortModel, filterModel, setFilterModel } = useDataGrid({
    page: 0,
    pageSize: 10,
  });

  // -----------------------------
  // Example full dataset (20 rows)
  // -----------------------------
  const rows = [
    { id: 1, name: "Kenil", email: "kenil@gmail.com", status: "Active" },
    { id: 2, name: "Amit", email: "amit@gmail.com", status: "Inactive" },
    { id: 3, name: "Priya", email: "priya@gmail.com", status: "Active" },
    { id: 4, name: "Rohan", email: "rohan@gmail.com", status: "Inactive" },
    { id: 5, name: "Sneha", email: "sneha@gmail.com", status: "Active" },
    { id: 6, name: "Divya", email: "divya@gmail.com", status: "Inactive" },
    { id: 7, name: "Mehul", email: "mehul@gmail.com", status: "Active" },
    { id: 8, name: "Varun", email: "varun@gmail.com", status: "Inactive" },
    { id: 9, name: "Harsh", email: "harsh@gmail.com", status: "Active" },
    { id: 10, name: "Rita", email: "rita@gmail.com", status: "Inactive" },
    { id: 11, name: "Pooja", email: "pooja@gmail.com", status: "Active" },
    { id: 12, name: "Karan", email: "karan@gmail.com", status: "Inactive" },
    { id: 13, name: "Dhruv", email: "dhruv@gmail.com", status: "Active" },
    { id: 14, name: "Mansi", email: "mansi@gmail.com", status: "Inactive" },
    { id: 15, name: "Hiren", email: "hiren@gmail.com", status: "Active" },
    { id: 16, name: "Nikhil", email: "nikhil@gmail.com", status: "Inactive" },
    { id: 17, name: "Tina", email: "tina@gmail.com", status: "Active" },
    { id: 18, name: "Vishal", email: "vishal@gmail.com", status: "Inactive" },
    { id: 19, name: "Bhavesh", email: "bhavesh@gmail.com", status: "Active" },
    { id: 20, name: "Anita", email: "anita@gmail.com", status: "Inactive" },
  ];

  // -----------------------------
  // Columns
  // -----------------------------
  const columns = [
    {
      field: "name",
      headerName: "Name",
      flex: 1,
    },
    {
      field: "email",
      headerName: "Email",
      flex: 1,
    },
    // {
    //   field: "status",
    //   headerName: "Status",
    //   flex: 1,
    //   renderCell: (params) => <span style={{ color: params.row.status === "Active" ? "green" : "red" }}>{params.row.status}</span>,
    // },
  ];

  // -----------------------------
  // Top section (date range)
  // -----------------------------
  const topContent = (
    <Grid size={{ xs: 12, sm: 5, md: 4 }}>
      <CommonDateRangeSelector value={range} onChange={setRange} active="This Month" />
    </Grid>
  );

  return (
    <CommonCard title="Top 20 Customers" topContent={topContent} grid={{ xs: 12, md: 6 }}>
      <CommonDataGrid BoxClass="h-100 p-3 rounded-md overflow-hidden" columns={columns} rows={rows} rowCount={rows.length} loading={false} paginationModel={paginationModel} onPaginationModelChange={setPaginationModel} sortModel={sortModel} onSortModelChange={setSortModel} filterModel={filterModel} onFilterModelChange={setFilterModel} pageSizeOptions={[5, 10, 25]} defaultHidden={["name"]} />
    </CommonCard>
  );
};

export default TopCustomers;
