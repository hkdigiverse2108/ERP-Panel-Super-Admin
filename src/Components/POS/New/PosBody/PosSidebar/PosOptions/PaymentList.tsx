import { Grid } from "@mui/material";
import type { GridColDef } from "@mui/x-data-grid";
import { useMemo, useState } from "react";
import { Queries } from "../../../../../../Api";
import { CommonRadio } from "../../../../../../Attribute";
import { PAYMENTS } from "../../../../../../Data";
import { useAppDispatch, useAppSelector } from "../../../../../../Store/hooks";
import { setPaymentListModal } from "../../../../../../Store/Slices/ModalSlice";
import type { BranchBase } from "../../../../../../Types";
import { useDataGrid } from "../../../../../../Utils/Hooks";
import { CommonCard, CommonDataGrid, CommonModal } from "../../../../../Common";

const PaymentList = () => {
  const { isPaymentListModal } = useAppSelector((state) => state.modal);
  const dispatch = useAppDispatch();
  const { paginationModel, setPaginationModel, sortModel, setSortModel, filterModel, setFilterModel, params } = useDataGrid({ active: true });
  const [contactType, setContactType] = useState("customer");

  const { data: branchData, isLoading: branchDataLoading, isFetching: branchDataFetching } = Queries.useGetBranch(params);
  const allBranches = useMemo(() => branchData?.data?.branch_data.map((branch) => ({ ...branch, id: branch?._id })) || [], [branchData]);
  const totalRows = branchData?.data?.totalData || 0;

  const columns: GridColDef<BranchBase>[] = [
    { field: "name", headerName: "Branch Name", flex: 1 },
    { field: "address", headerName: "Address", flex: 2 },
  ];
  const CommonDataGridOption = {
    columns,
    rows: allBranches,
    rowCount: totalRows,
    loading: branchDataLoading || branchDataFetching,
    paginationModel,
    onPaginationModelChange: setPaginationModel,
    sortModel,
    onSortModelChange: setSortModel,
    filterModel,
    onFilterModelChange: setFilterModel,
  };
  const topContent = (
    <Grid container spacing={2} alignItems="center">
      <Grid size="auto">
        <CommonRadio value={contactType} options={PAYMENTS} onChange={(e) => setContactType(e)} />
      </Grid>
    </Grid>
  );
  return (
    <CommonModal title="Payments" isOpen={isPaymentListModal} onClose={() => dispatch(setPaymentListModal())} className="max-w-[1000px]">
      <CommonCard topContent={topContent} hideDivider>
        <CommonDataGrid {...CommonDataGridOption} />
      </CommonCard>
    </CommonModal>
  );
};

export default PaymentList;
