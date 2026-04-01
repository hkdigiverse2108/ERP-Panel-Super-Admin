import { Box } from "@mui/material";
import { useMemo } from "react";
import { useDispatch } from "react-redux";
import { Mutations, Queries } from "../../../Api";
import { CommonActionColumn, CommonBreadcrumbs, CommonCard, CommonDataGrid, CommonDeleteModal } from "../../../Components/Common";
import { PAGE_TITLE } from "../../../Constants";
import { BREADCRUMBS } from "../../../Data";
import { setCredentialsModal } from "../../../Store/Slices/ModalSlice";
import type { AppGridColDef, CredentialsBase } from "../../../Types";
import { useDataGrid, usePagePermission } from "../../../Utils/Hooks";
import CredentialForm from "./CredentialForm";

const Credentials = () => {
  const { paginationModel, setPaginationModel, sortModel, setSortModel, filterModel, setFilterModel, rowToDelete, setRowToDelete, isActive, setActive, params } = useDataGrid();
  const dispatch = useDispatch();
  const permission = usePagePermission(PAGE_TITLE.CREDENTIALS.BASE);

  const { data: credentialsData, isLoading: credentialsLoading, isFetching: credentialsFetching } = Queries.useGetCredentials(params);
  const { mutate: deleteCredential } = Mutations.useDeleteCredential();
  const { mutate: editCredential, isPending: isEditLoading } = Mutations.useEditCredential();

  const allCredentials = useMemo(() => credentialsData?.data?.credential_data.map((credential) => ({ ...credential, id: credential?._id })) || [], [credentialsData]);
  const totalRows = credentialsData?.data?.totalData || 0;

  const handleDeleteBtn = () => {
    if (!rowToDelete) return;
    deleteCredential(rowToDelete?._id as string, { onSuccess: () => setRowToDelete(null) });
  };

  const handleAdd = () => dispatch(setCredentialsModal({ open: true, data: null }));

  const handleEdit = (row: CredentialsBase) => dispatch(setCredentialsModal({ open: true, data: row }));

  const columns: AppGridColDef<CredentialsBase>[] = [
    { field: "projectId", headerName: "Project ID", flex: 1, minWidth: 200 },
    { 
      field: "publishableKey", 
      headerName: "Publishable Key", 
      flex: 1, 
      minWidth: 300,
      renderCell: ({ value }) => "•".repeat(20) + value.slice(-4), // Masking the key
    },
    { field: "supabaseUrl", headerName: "Supabase URL", flex: 1, minWidth: 300 },
    { 
      field: "lastUsed", 
      headerName: "Last Used", 
      width: 180,
      renderCell: ({ value }) => value ? new Date(value).toLocaleString() : "Never",
    },

    ...(permission?.edit || permission?.delete
      ? [
          CommonActionColumn<CredentialsBase>({
            ...(permission?.edit && {
                active: (row) => editCredential({ credentialId: row?._id, isActive: !row.isActive }),
                onEdit: { handleEdit: (row) => handleEdit(row) },
            }),
            ...(permission?.delete && { onDelete: (row) => setRowToDelete({ _id: row?._id, title: row?.projectId }) }),
          }),
        ]
      : []),
  ];

  const gridOptions = {
    columns,
    rows: allCredentials,
    rowCount: totalRows,
    loading: credentialsLoading || credentialsFetching || isEditLoading,
    isActive,
    setActive,
    ...(permission?.add && { handleAdd }),
    paginationModel,
    onPaginationModelChange: setPaginationModel,
    sortModel,
    onSortModelChange: setSortModel,
    filterModel,
    onFilterModelChange: setFilterModel,
    fileName: PAGE_TITLE.CREDENTIALS.BASE,
  };

  return (
    <>
      <CommonBreadcrumbs title={PAGE_TITLE.CREDENTIALS.BASE} maxItems={1} breadcrumbs={(BREADCRUMBS as any).CREDENTIALS.BASE} />
      <Box sx={{ p: { xs: 2, md: 3 }, display: "grid" }}>
        <CommonCard hideDivider>
          <CommonDataGrid {...gridOptions} />
        </CommonCard>
        <CommonDeleteModal open={Boolean(rowToDelete)} itemName={rowToDelete?.title} onClose={() => setRowToDelete(null)} onConfirm={() => handleDeleteBtn()} />
        <CredentialForm />
      </Box>
    </>
  );
};

export default Credentials;
