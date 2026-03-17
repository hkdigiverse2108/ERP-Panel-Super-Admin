import CurrencyRupeeIcon from "@mui/icons-material/CurrencyRupee";
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";
import DriveFileRenameOutlineIcon from "@mui/icons-material/DriveFileRenameOutline";
import KeyIcon from "@mui/icons-material/Key";
import PrintIcon from "@mui/icons-material/Print";
import RotateLeftIcon from "@mui/icons-material/RotateLeft";
import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import { Grid, IconButton } from "@mui/material";
import type { GridColDef } from "@mui/x-data-grid";
import { Link } from "react-router-dom";
import type { CommonActionColumnProps } from "../../Types";

const CommonActionColumn = <T extends { _id?: string; isActive?: boolean; creditsRemaining?: number }>({ onSalesInvoice, onPrint, active, editRoute, onDelete, onEdit, onRefund, permissionRoute }: CommonActionColumnProps<T>): GridColDef<T> => ({
  field: "actions",
  headerName: "Actions",
  headerAlign: "center",
  align: "center",
  width: permissionRoute ? 240 : 180,
  minWidth: 100,
  sortable: false,
  filterable: false,
  disableExport: true,
  renderCell: (params) => {
    const isActive = params.row.isActive;
    return (
      <Grid container spacing={1} className="flex items-center justify-center w-full">
        {active && (
          <Grid size="auto">
            <IconButton className="iconButtonStyle" size="small" color={isActive ? "success" : "error"} onClick={() => active(params.row)}>
              {isActive ? <VisibilityIcon fontSize="small" /> : <VisibilityOffIcon fontSize="small" />}
            </IconButton>
          </Grid>
        )}
        {editRoute && (
          <Grid size="auto">
            <Link to={editRoute} state={{ data: params.row }}>
              <IconButton className="iconButtonStyle" size="small">
                <DriveFileRenameOutlineIcon fontSize="small" />
              </IconButton>
            </Link>
          </Grid>
        )}
        {permissionRoute && (
          <Grid size="auto">
            <Link to={permissionRoute} state={{ data: params.row }}>
              <IconButton className="iconButtonStyle" size="small">
                <KeyIcon fontSize="small" />
              </IconButton>
            </Link>
          </Grid>
        )}
        {onPrint && (
          <Grid size="auto">
            <IconButton className="iconButtonStyle" size="small" onClick={() => onPrint(params.row)}>
              <PrintIcon fontSize="small" />
            </IconButton>
          </Grid>
        )}
        {onEdit?.handleEdit && !onEdit?.isPermission?.(params.row) && (
          <Grid size="auto">
            <IconButton className="iconButtonStyle" size="small" onClick={() => onEdit.handleEdit(params.row)}>
              <DriveFileRenameOutlineIcon fontSize="small" />
            </IconButton>
          </Grid>
        )}
        {onRefund && params.row.creditsRemaining !== 0 && (
          <Grid size="auto">
            <IconButton className="iconButtonStyle" size="small" onClick={() => onRefund(params.row)}>
              <CurrencyRupeeIcon fontSize="small" />
            </IconButton>
          </Grid>
        )}
        {onDelete && (
          <Grid size="auto">
            <IconButton className="iconButtonStyle" color="error" size="small" onClick={() => onDelete(params.row)}>
              <DeleteForeverIcon fontSize="small" />
            </IconButton>
          </Grid>
        )}
        {onSalesInvoice?.handleSalesInvoice && !onSalesInvoice?.isPermission?.(params.row) && (
          <Grid size="auto">
            <IconButton className="iconButtonStyle" color="primary" size="small" onClick={() => onSalesInvoice.handleSalesInvoice(params.row)}>
              <RotateLeftIcon fontSize="small" />
            </IconButton>
          </Grid>
        )}
      </Grid>
    );
  },
});

export default CommonActionColumn;
