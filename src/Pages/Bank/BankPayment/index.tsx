import { CommonBreadcrumbs } from "../../../Components/Common";

import { PAGE_TITLE } from "../../../Constants";


const Payment = () => {
  // const { paginationModel, setPaginationModel } = useDataGrid({
  //   page: 0,
  //   pageSize: 10,
  // });

  // const [rowToDelete, setRowToDelete] = useState<any>(null);
  

  // const rows = useMemo(
  //   () =>
  //     Array.from({ length: 10 }).map((_, i) => ({
  //       id: i + 1,
  //       paymentNo: `PAY-00${i + 1}`,
  //       partyName: "ABC Traders",
  //       paymentMode: "Cash",
  //       type: "Received",
  //       date: "2025-01-10",
  //       amount: 12000,
  //       status: "Completed",
  //       createdBy: "Admin",
  //     })),
  //   []
  // );

  // const columns = [
  //   {
  //     field: "srNo",
  //     headerName: "Sr No",
  //     width: 80,
  //     renderCell: (params: any) => paginationModel.page * paginationModel.pageSize + params.api.getRowIndexRelativeToVisibleRows(params.id) + 1,
  //   },
  //   { field: "paymentNo", headerName: "Payment No", flex: 1 },
  //   { field: "partyName", headerName: "Party Name", flex: 1 },
  //   { field: "paymentMode", headerName: "Payment Mode", flex: 1 },
  //   { field: "type", headerName: "Type", flex: 1 },
  //   { field: "date", headerName: "Date", flex: 1 },
  //   {
  //     field: "amount",
  //     headerName: "Amount",
  //     flex: 1,
  //     renderCell: (params: any) => `₹ ${params.value}`,
  //   },
  //   { field: "status", headerName: "Status", flex: 1 },
  //   { field: "createdBy", headerName: "Created By", flex: 1 },
  //   {
  //     field: "actions",
  //     headerName: "Actions",
  //     width: 120,
  //     sortable: false,
  //     renderCell: (params: any) => (
  //       <Grid container spacing={1}>
  //         <Grid size="auto">
  //           <IconButton color="primary" size="small">
  //             <EditIcon />
  //           </IconButton>
  //         </Grid>
  //         <Grid size="auto">
  //           <IconButton color="error" size="small" onClick={() => setRowToDelete(params.row)}>
  //             <DeleteIcon />
  //           </IconButton>
  //         </Grid>
  //       </Grid>
  //     ),
  //   },
  // ];
  // const topContent = (
  //   <Grid container spacing={2} alignItems="center">
  //     <Grid size="auto">
  //       <Link to={ ROUTES.PAYMENT.ADD_EDIT }>
  //         <Button variant="contained" color="primary" size="large" sx={{ px: 4, fontSize: "0.9rem" }}>
  //           ADD
  //         </Button>
  //       </Link>
  //     </Grid>
  //   </Grid>
  // );
  // function handleDeleteBtn(): void {
  //   throw new Error("Function not implemented.");
  // }

  return (
    <>
      <CommonBreadcrumbs title={PAGE_TITLE.PAYMENT.BASE || "Payments"} maxItems={1} />

      <div className="m-4 md:m-6">
        {/* <CommonCard title="Payments" topContent={topContent}> */}
          {/* <CommonDataGrid columns={columns} rows={rows} rowCount={rows.length} paginationModel={paginationModel} onPaginationModelChange={setPaginationModel}  /> */}
        {/* </CommonCard> */}
      </div>

      {/* ================= Delete Confirmation ================= */}
        {/* <CommonDeleteModal open={Boolean(rowToDelete)} itemName={rowToDelete?.title} onClose={() => setRowToDelete(null)} onConfirm={() => handleDeleteBtn()} /> */}
    </>
  );
};

export default Payment;

