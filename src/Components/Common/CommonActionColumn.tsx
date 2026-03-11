import DeleteForeverIcon from "@mui/icons-material/DeleteForever";
import DriveFileRenameOutlineIcon from "@mui/icons-material/DriveFileRenameOutline";
import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import CurrencyRupeeIcon from "@mui/icons-material/CurrencyRupee";
import PrintIcon from "@mui/icons-material/Print";
import { Grid, IconButton } from "@mui/material";
import type { GridColDef } from "@mui/x-data-grid";
import { Link } from "react-router-dom";
import type { CommonActionColumnProps } from "../../Types";
import KeyIcon from '@mui/icons-material/Key';

const CommonActionColumn = <T extends { _id?: string; isActive?: boolean }>({ active, editRoute, onDelete, showDelete, onEdit, permissionRoute, onRefund, showRefund, onPrint }: CommonActionColumnProps<T>): GridColDef<T> => ({
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
        {onEdit && (
          <Grid size="auto">
            <IconButton className="iconButtonStyle" size="small" onClick={() => onEdit(params.row)}>
              <DriveFileRenameOutlineIcon fontSize="small" />
            </IconButton>
          </Grid>
        )}
        {onRefund && (!showRefund || showRefund(params.row)) && (
          <Grid size="auto">
            <IconButton className="iconButtonStyle" size="small" color="primary" onClick={() => onRefund(params.row)}>
              <CurrencyRupeeIcon fontSize="small" />
            </IconButton>
          </Grid>
        )}
        {onPrint && (
          <Grid size="auto">
            <IconButton className="iconButtonStyle" size="small" color="info" onClick={() => onPrint(params.row)}>
              <PrintIcon fontSize="small" />
            </IconButton>
          </Grid>
        )}
        {onDelete && (!showDelete || showDelete(params.row)) && (
          <Grid size="auto">
            <IconButton className="iconButtonStyle" color="error" size="small" onClick={() => onDelete(params.row)}>
              <DeleteForeverIcon fontSize="small" />
            </IconButton>
          </Grid>
        )}
      </Grid>
    );
  },
});

export default CommonActionColumn;
