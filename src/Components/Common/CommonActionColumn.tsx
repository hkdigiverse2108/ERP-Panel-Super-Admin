import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import { Grid, IconButton } from "@mui/material";
import type { GridColDef } from "@mui/x-data-grid";
import { Link } from "react-router-dom";
import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";

interface CommonActionColumnProps<T> {
  editRoute?: string;
  onEdit?: (row: T) => void;
  onDelete?: (row: T) => void;
  active?: (row: T) => void;
}

const CommonActionColumn = <T extends { _id?: string; isActive?: boolean }>({ active, editRoute, onDelete, onEdit }: CommonActionColumnProps<T>): GridColDef<T> => ({
  field: "actions",
  headerName: "Actions",
  width: 140,
  sortable: false,
  filterable: false,
  disableExport: true,
  renderCell: (params) => {
    const isActive = params.row.isActive;
    return (
      <Grid container spacing={1}>
        {active && (
          <Grid size="auto">
            <IconButton size="small" color={isActive ? "success" : "error"} onClick={() => active(params.row)}>
              {isActive ? <VisibilityIcon /> : <VisibilityOffIcon />}
            </IconButton>
          </Grid>
        )}
        {editRoute && (
          <Grid size="auto">
            <Link to={editRoute} state={{ data: params.row }}>
              <IconButton size="small">
                <EditIcon />
              </IconButton>
            </Link>
          </Grid>
        )}
        {onEdit && (
          <Grid size="auto">
            <IconButton size="small" onClick={() => onEdit(params.row)}>
              <EditIcon />
            </IconButton>
          </Grid>
        )}
        {onDelete && (
          <Grid size="auto">
            <IconButton color="error" size="small" onClick={() => onDelete(params.row)}>
              <DeleteIcon />
            </IconButton>
          </Grid>
        )}
      </Grid>
    );
  },
});

export default CommonActionColumn;
