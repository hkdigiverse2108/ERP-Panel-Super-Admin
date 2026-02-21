import { Box } from "@mui/material";
import { useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { Mutations, Queries } from "../../../Api";
import { CommonActionColumn, CommonBreadcrumbs, CommonCard, CommonDataGrid, CommonDeleteModal } from "../../../Components/Common";
import { PAGE_TITLE, ROUTES } from "../../../Constants";
import { BREADCRUMBS } from "../../../Data";
import type { AppGridColDef, BankBase } from "../../../Types";
import { useDataGrid, usePagePermission } from "../../../Utils/Hooks";

const Bank = () => {
  const { paginationModel, setPaginationModel, sortModel, setSortModel, filterModel, setFilterModel, rowToDelete, setRowToDelete, isActive, setActive, params } = useDataGrid();
  const navigate = useNavigate();
  const permission = usePagePermission(PAGE_TITLE.BANK.BASE);

  const { data: bankData, isLoading, isFetching } = Queries.useGetBank(params);
  const { mutate: deleteBankMutate, isPending: isDeleteLoading } = Mutations.useDeleteBank();
  const { mutate: editBank, isPending: isEditLoading } = Mutations.useEditBank();

  const allBanks = useMemo(
    () =>
      bankData?.data?.bank_data?.map((bank) => ({
        ...bank,
        id: bank?._id,
      })) || [],
    [bankData],
  );

  const totalRows = bankData?.data?.totalData || 0;

  const handleDeleteBtn = () => {
    if (!rowToDelete) return;
    deleteBankMutate(rowToDelete?._id as string, {
      onSuccess: () => setRowToDelete(null),
    });
  };

  const handleAdd = () => navigate(ROUTES.BANK.ADD_EDIT);

  const columns: AppGridColDef<BankBase>[] = [
    { field: "name", headerName: "Bank Name", width: 200 },
    { field: "accountHolderName", headerName: "Account Holder Name", width: 200 },
    { field: "ifscCode", headerName: "IFSC Code", width: 160 },
    {
      field: "openingBalance",
      headerName: "Balance",
      width: 160,
      valueGetter: (_values, row) => {
        const credit = row.openingBalance?.creditBalance || 0;
        const debit = row.openingBalance?.debitBalance || 0;
        return credit - debit;
      },
    },
    { field: "bankAccountNumber", headerName: "Account No.", width: 200 },
    { field: "addressLine1", headerName: "Address", flex: 1, minWidth: 200 },
    ...(permission?.edit || permission?.delete
      ? [
        CommonActionColumn<BankBase>({
          ...(permission?.edit && {
            active: (row) => editBank({ bankId: row?._id, isActive: !row.isActive }),
            editRoute: ROUTES.BANK.ADD_EDIT,
          }),
          ...(permission?.delete && { onDelete: (row) => setRowToDelete({ _id: row?._id, title: row?.name }) }),
        }),
      ]
      : []),
  ];

  const CommonDataGridOption = {
    columns,
    rows: allBanks,
    rowCount: totalRows,
    loading: isLoading || isFetching || isEditLoading,
    isActive,
    setActive,
    ...(permission?.add && { handleAdd }),
    paginationModel,
    onPaginationModelChange: setPaginationModel,
    sortModel,
    onSortModelChange: setSortModel,
    filterModel,
    onFilterModelChange: setFilterModel,
  };

  return (
    <>
      <CommonBreadcrumbs title={PAGE_TITLE.BANK.BASE} maxItems={1} breadcrumbs={BREADCRUMBS.BANK.BASE} />

      <Box sx={{ p: { xs: 2, md: 3 }, display: "grid", gap: 2 }}>
        <CommonCard hideDivider>
          <CommonDataGrid {...CommonDataGridOption} />
        </CommonCard>

        <CommonDeleteModal open={Boolean(rowToDelete)} itemName={rowToDelete?.title} loading={isDeleteLoading} onClose={() => setRowToDelete(null)} onConfirm={handleDeleteBtn} />
      </Box>
    </>
  );
};

export default Bank;
