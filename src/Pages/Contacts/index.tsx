import { Box } from "@mui/material";

const Contact = () => {
  // const navigate = useNavigate();

  //  STATE 
  // const [contactType, setContactType] = useState("customer");
  // const [openDelete, setOpenDelete] = useState(false);
  // const [selectedRow, setSelectedRow] = useState(null);

  // const { paginationModel, setPaginationModel, sortModel, setSortModel, filterModel, setFilterModel } = useDataGrid({ page: 0, pageSize: 10 });

  //  TABLE DATA 
  // const data = {
  //   customer: [
  //     {
  //       id: 1,
  //       name: "Rahul Sharma",
  //       contactNo: "9876543210",
  //       whatsappNo: "9876543210",
  //       gstin: "27ABCDE1234F1Z5",
  //       createdBy: "admin@gmail.com",
  //       loyaltyPoint: 120,
  //       status: "Active",
  //     },
  //   ],
  //   vendor: [
  //     {
  //       id: 1,
  //       name: "Fresh Bakery Supplier",
  //       contactNo: "9123456780",
  //       whatsappNo: "9123456780",
  //       gstin: "24ABCDE5678F1Z9",
  //       createdBy: "admin@gmail.com",
  //       loyaltyPoint: 0,
  //       status: "Inactive",
  //     },
  //   ],
  //   transport: [
  //     {
  //       id: 1,
  //       name: "Speed Transport",
  //       contactNo: "9001122334",
  //       whatsappNo: "9001122334",
  //       gstin: "29ABCDE9999F1Z1",
  //       createdBy: "admin@gmail.com",
  //       loyaltyPoint: 0,
  //       status: "Active",
  //     },
  //   ],
  // };

  // const rows = data[contactType];

  //  HANDLERS
  // const handleAdd = () => {
  //   navigate(ROUTES.CONTACT.ADD_EDIT, { state: { type: contactType } });
  // };

  // const handleEdit = (row) => {
  //   navigate(ROUTES.CONTACT.ADD_EDIT.replace(":id", row.id), {
  //     state: { data: row, type: contactType },
  //   });
  // };

  // const handleDelete = (row) => {
  //   setSelectedRow(row);
  //   setOpenDelete(true);
  // };

  // const confirmDelete = () => {
  //   console.log("Deleted:", selectedRow);
  //   setOpenDelete(false);
  // };

  //  COLUMNS 
  // const columns = [
  //   {
  //     field: "id",
  //     headerName: "Sr No",
  //     width: 90,
  //     sortable: false,
  //     renderCell: (params) => {
  //       const index = params.api.getRowIndexRelativeToVisibleRows(params.id);
  //       return paginationModel.page * paginationModel.pageSize + index + 1;
  //     },
  //   },
  //   { field: "name", headerName: "Name", flex: 1 },
  //   { field: "contactNo", headerName: "Contact No", flex: 1 },
  //   { field: "whatsappNo", headerName: "WhatsApp No", flex: 1 },
  //   { field: "gstin", headerName: "GSTIN", flex: 1 },
  //   { field: "createdBy", headerName: "Created By (Email)", flex: 1 },
  //   { field: "loyaltyPoint", headerName: "Loyalty Point", flex: 1 },
  //   {
  //     field: "status",
  //     headerName: "Status",
  //     flex: 1,
  //     renderCell: (params) => <span style={{ color: params.value === "Active" ? "green" : "red", fontWeight: 500 }}>{params.value}</span>,
  //   },
  //   {
  //     field: "actions",
  //     headerName: "Actions",
  //     width: 120,
  //     sortable: false,
  //     renderCell: (params) => (
  //       <Grid container spacing={1}>
  //         <Grid size="auto">
  //           <IconButton size="small" color="primary" onClick={() => handleEdit(params.row)}>
  //             <EditIcon />
  //           </IconButton>
  //         </Grid>
  //         <Grid size="auto">
  //           <IconButton size="small" color="error" onClick={() => handleDelete(params.row)}>
  //             <DeleteIcon />
  //           </IconButton>
  //         </Grid>
  //       </Grid>
  //     ),
  //   },
  // ];

  //  TOP CONTENT 
  // const topContent = (
  //   <Grid container spacing={2} alignItems="center">
  //     <Grid size="auto" >
  //       <RadioGroup row value={contactType} onChange={(e) => setContactType(e.target.value)}>
  //         <FormControlLabel value="customer" control={<Radio />} label="Customer" />
  //         <FormControlLabel value="vendor" control={<Radio />} label="Vendor / Supplier" />
  //         <FormControlLabel value="transport" control={<Radio />} label="Transport" />
  //       </RadioGroup>
  //     </Grid>

  //     <Grid size="auto">
  //       <CommonButton title="ADD" variant="contained" onClick={handleAdd} />
  //     </Grid>
  //   </Grid>
  // );

  //  RENDER 
  return (
      
    <Box sx={{ p: { xs: 1, sm: 4, md: 3 } }}>
      {/* <CommonCard title="Contacts" topContent={topContent}>
        <CommonDataGrid rows={rows} columns={columns} rowCount={rows.length} paginationModel={paginationModel} onPaginationModelChange={setPaginationModel} sortModel={sortModel} onSortModelChange={setSortModel} filterModel={filterModel} onFilterModelChange={setFilterModel} pageSizeOptions={[5, 10, 25]} />
      </CommonCard> */}

      {/* Delete Dialog */}
      {/* <Dialog open={openDelete} onClose={() => setOpenDelete(false)}>
        <DialogTitle sx={{ color: "red" }}>Confirm Delete</DialogTitle>
        <DialogContent>Are you sure you want to delete "{selectedRow?.name}"?</DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDelete(false)}>No</Button>
          <Button color="error" onClick={confirmDelete}>
            Yes
          </Button>
        </DialogActions>
      </Dialog> */}
    </Box>
  );
};

export default Contact;
