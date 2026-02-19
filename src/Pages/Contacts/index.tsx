import { Box } from "@mui/material";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Mutations, Queries } from "../../Api";
import { AdvancedSearch, CommonActionColumn, CommonBreadcrumbs, CommonCard, CommonDataGrid, CommonDeleteModal, CommonPhoneColumns } from "../../Components/Common";
import { PAGE_TITLE, ROUTES } from "../../Constants";
import { BREADCRUMBS, CONTACT_TYPE } from "../../Data";
import type { AppGridColDef, ContactBase } from "../../Types";
import { useDataGrid, usePagePermission } from "../../Utils/Hooks";
import { CommonRadio } from "../../Attribute";
import { CommonObjectPropertyColumn } from "../../Components/Common/CommonDataGrid/CommonColumns";
import { CreateFilter, FormatDate, GenerateOptions } from "../../Utils";

const Contact = () => {
  const { paginationModel, setPaginationModel, sortModel, setSortModel, filterModel, setFilterModel, rowToDelete, setRowToDelete, isActive, setActive, updateAdvancedFilter, advancedFilter, params } = useDataGrid();

  const navigate = useNavigate();
  const permission = usePagePermission(PAGE_TITLE.CONTACT.BASE);

  const { data: contactData, isLoading: contactDataLoading, isFetching: contactDataFetching } = Queries.useGetContacts(params);
  const { data: CompanyData, isLoading: CompanyDataLoading } = Queries.useGetCompanyDropdown();
  const { mutate: deleteContactMutate, isPending: isDeleteLoading } = Mutations.useDeleteContacts();
  const { mutate: editContact, isPending: isEditLoading } = Mutations.useEditContacts();

  const allContact = contactData?.data?.contact_data?.map((contact: ContactBase) => ({ ...contact, id: contact?._id })) || [];
  const totalRows = contactData?.data?.totalData || 0;

  const handleDeleteBtn = () => {
    if (!rowToDelete) return;
    deleteContactMutate(rowToDelete?._id as string, {
      onSuccess: () => setRowToDelete(null),
    });
  };

  const handleAdd = () => navigate(ROUTES.CONTACTS.ADD_EDIT);

  const handleContactTypeChange = (value: string) => {
    updateAdvancedFilter("contact_type", [value]);
  };

  useEffect(() => {
    updateAdvancedFilter("contact_type", [CONTACT_TYPE[0]]);
  }, []);

  const columns: AppGridColDef<ContactBase>[] = [
    { field: "firstName", headerName: "Name", width: 240 },

    CommonPhoneColumns("phoneNo", { headerName: "Phone No", width: 240 }),
    CommonPhoneColumns("whatsappNo", { headerName: "WhatsApp No", width: 240 }),

    { field: "gstIn", headerName: "GSTIN", width: 150 },
    { field: "companyName", headerName: "Company Name", width: 220 },
    { field: "gstType", headerName: "GST Type", width: 150 },
    { field: "tanNo", headerName: "TAN No", width: 150 },
    { field: "transporterId", headerName: "Transporter ID", width: 240 },

    { field: "loyaltyPoints", headerName: "Loyalty Point", flex: 1, minWidth: 240 },
    { field: "panNo", headerName: "PAN No", width: 120 },
    { field: "telephoneNo", headerName: "Telephone No", width: 150 },
    { field: "customerType", headerName: "Customer Type", width: 150 },
    { field: "email", headerName: "Email", width: 220 },
    { field: "dob", headerName: "Date of Birth", width: 160, valueGetter: (v) => FormatDate(v) },
    { field: "anniversaryDate", headerName: "Anniversary Date", width: 180, valueGetter: (v) => FormatDate(v) },
    CommonObjectPropertyColumn<ContactBase>("bankName", "bankDetails", "name", { headerName: "Bank name", width: 300 }),
    CommonObjectPropertyColumn<ContactBase>("ifscCode", "bankDetails", "ifscCode", { headerName: "IFSC Code", width: 300 }),
    CommonObjectPropertyColumn<ContactBase>("branchName", "bankDetails", "branch", { headerName: "Branch Name", width: 300 }),
    CommonObjectPropertyColumn<ContactBase>("accountNumber", "bankDetails", "accountNumber", { headerName: "Account Number", width: 300 }),

    // Address
    {
      field: "addressLine1",
      headerName: "Address Line 1",
      width: 180,
      valueGetter: (_value, row) => row?.address?.[0]?.addressLine1 || "",
    },

    {
      field: "addressLine2",
      headerName: "Address Line 2",
      width: 180,
      valueGetter: (_value, row) => row?.address?.[0]?.addressLine2 || "",
    },
    {
      field: "pinCode",
      headerName: "Pin Code",
      width: 120,
      valueGetter: (_value, row) => row?.address?.[0]?.pinCode || "",
    },

    {
      field: "city",
      headerName: "City",
      width: 120,
      valueGetter: (_value, row) => row?.address?.[0]?.city?.name || "",
    },
    {
      field: "state",
      headerName: "State",
      width: 120,
      valueGetter: (_value, row) => row?.address?.[0]?.state?.name || "",
    },

    {
      field: "country",
      headerName: "Country",
      width: 120,
      valueGetter: (_value, row) => row?.address?.[0]?.country?.name || "",
    },
    ...(permission?.edit || permission?.delete
      ? [
        CommonActionColumn<ContactBase>({
          ...(permission?.edit && {
            active: (row) => editContact({ contactId: row?._id, isActive: !row.isActive }),
            editRoute: ROUTES.CONTACTS.ADD_EDIT,
          }),
          ...(permission?.delete && { onDelete: (row) => setRowToDelete({ _id: row?._id, title: row?.firstName }) }),
        }),
      ]
      : []),
  ];

  const CommonDataGridOption = {
    columns,
    rows: allContact,
    rowCount: totalRows,
    loading: contactDataLoading || contactDataFetching || isEditLoading,
    isActive,
    setActive,
    ...(permission?.add && { handleAdd }),
    paginationModel,
    onPaginationModelChange: setPaginationModel,
    sortModel,
    onSortModelChange: setSortModel,
    filterModel,
    onFilterModelChange: setFilterModel,
    defaultHidden: ["email", "dob", "anniversaryDate", "customerType", "telephoneNo", "panNo", "accountNumber", "branchName", "ifscCode", "bankName", "addressLine1", "addressLine2", "city", "state", "country", "pinCode", "gstIn", "gstType", "transporterId", "tanNo"],
  };

  const filter = [
    CreateFilter("Select Company", "companyFilter", advancedFilter, updateAdvancedFilter, GenerateOptions(CompanyData?.data), CompanyDataLoading, { xs: 12, sm: 6, md: 3 }),
  ];

  const topContent = <CommonRadio value={advancedFilter?.contact_type?.[0]} onChange={handleContactTypeChange} options={CONTACT_TYPE.map(c => ({ label: c, value: c }))} grid={{ xs: "auto" }} />;

  return (
    <>
      <CommonBreadcrumbs title={PAGE_TITLE.CONTACT.BASE} maxItems={1} breadcrumbs={BREADCRUMBS.CONTACT.BASE} />

      <Box sx={{ p: { xs: 2, md: 3 }, display: "grid", gap: 2 }}>
        <AdvancedSearch filter={filter} />
        <CommonCard topContent={topContent}>
          <CommonDataGrid {...CommonDataGridOption} />
        </CommonCard>

        <CommonDeleteModal open={Boolean(rowToDelete)} itemName={rowToDelete?.title} loading={isDeleteLoading} onClose={() => setRowToDelete(null)} onConfirm={handleDeleteBtn} />
      </Box>
    </>
  );
};

export default Contact;
