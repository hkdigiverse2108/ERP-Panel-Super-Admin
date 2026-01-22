import DeleteForeverIcon from "@mui/icons-material/DeleteForever";
import DriveFileRenameOutlineIcon from "@mui/icons-material/DriveFileRenameOutline";
import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import { Grid, IconButton } from "@mui/material";
import type { GridColDef } from "@mui/x-data-grid";
import { Link } from "react-router-dom";
import type { CommonActionColumnProps } from "../../Types";

const iconButtonStyle = {
  border: "1px solid #e0e0e0",
  borderRadius: "6px",
  width: 46,
  height: 34,
};

const CommonActionColumn = <T extends { _id?: string; isActive?: boolean }>({ active, editRoute, onDelete, onEdit }: CommonActionColumnProps<T>): GridColDef<T> => ({
  field: "actions",
  headerName: "Actions",
  headerAlign: "center",
  width: 200,
  minWidth: 100,
  sortable: false,
  filterable: false,
  disableExport: true,
  renderCell: (params) => {
    const isActive = params.row.isActive;
    return (
      <Grid container spacing={1} className="flex items-center justify-center">
        {active && (
          <Grid size="auto">
            <IconButton sx={iconButtonStyle} size="small" color={isActive ? "success" : "error"} onClick={() => active(params.row)}>
              {isActive ? <VisibilityIcon fontSize="small" /> : <VisibilityOffIcon fontSize="small" />}
            </IconButton>
          </Grid>
        )}
        {editRoute && (
          <Grid size="auto">
            <Link to={editRoute} state={{ data: params.row }}>
              <IconButton sx={iconButtonStyle} size="small">
                <DriveFileRenameOutlineIcon fontSize="small" />
              </IconButton>
            </Link>
          </Grid>
        )}
        {onEdit && (
          <Grid size="auto">
            <IconButton sx={iconButtonStyle} size="small" onClick={() => onEdit(params.row)}>
              <DriveFileRenameOutlineIcon fontSize="small" />
            </IconButton>
          </Grid>
        )}
        {onDelete && (
          <Grid size="auto">
            <IconButton sx={iconButtonStyle} color="error" size="small" onClick={() => onDelete(params.row)}>
              <DeleteForeverIcon fontSize="small" />
            </IconButton>
          </Grid>
        )}
      </Grid>
    );
  },
});

export default CommonActionColumn;
