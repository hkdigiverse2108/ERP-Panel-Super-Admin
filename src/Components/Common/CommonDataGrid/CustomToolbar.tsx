import AddIcon from "@mui/icons-material/Add";
import ClearIcon from "@mui/icons-material/Clear";
import DownloadIcon from "@mui/icons-material/Download";
import FilterListIcon from "@mui/icons-material/FilterList";
import GridOnIcon from "@mui/icons-material/GridOn";
import PictureAsPdfIcon from "@mui/icons-material/PictureAsPdf";
import PrintIcon from "@mui/icons-material/Print";
import ViewColumnIcon from "@mui/icons-material/ViewColumn";
import { Box, Grid, IconButton, Menu, MenuItem, TextField, Tooltip } from "@mui/material";
import { GridToolbarContainer } from "@mui/x-data-grid";
import { useState, type FC } from "react";
import { CommonButton, CommonSwitch } from "../../../Attribute";
import { useAppSelector } from "../../../Store/hooks";
import type { CustomToolbarProps } from "../../../Types";
import { ExportDataGridToExcel } from "./ExportDataGridToExcel";
import { ExportDataGridToPDF } from "./ExportDataGridToPDF";

const CustomToolbar: FC<CustomToolbarProps> = ({ isExport = true, fileName, apiRef, columns, rows, handleAdd, isActive, setActive, filterModel, onFilterModelChange }) => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [searchText, setSearchText] = useState(filterModel?.quickFilterValues?.[0] || "");

  const { user } = useAppSelector((state) => state.auth);

  const handleSearch = () => {
    onFilterModelChange({ ...filterModel, quickFilterValues: [searchText] });
  };

  return (
    <GridToolbarContainer sx={{ p: 1 }}>
      <Box className="flex flex-wrap justify-between items-center w-full gap-2">
        <Box className="flex items-center relative! max-sm:w-full">
          <TextField
            sx={{
              width: { xs: "100%", sm: 250, md: 350 },
            }}
            className="bg-white dark:bg-gray-800"
            size="small"
            placeholder="Search"
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") handleSearch();
            }}
          />
          <Box className="absolute! top-1/2 right-1.5 -translate-y-1/2">
            {searchText && (
              <IconButton
                size="small"
                onClick={() => {
                  setSearchText("");
                  onFilterModelChange({
                    ...filterModel,
                    quickFilterValues: [],
                  });
                }}
              >
                <ClearIcon fontSize="small" />
              </IconButton>
            )}
            <CommonButton className="h-7.5!" size="small" variant="contained" onClick={handleSearch}>
              Search
            </CommonButton>
          </Box>
        </Box>
        {/* <GridToolbarQuickFilter /> */}
        <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
          {setActive && <CommonSwitch name="isActive" label="Active :" switchPlacement="start" value={isActive} onChange={(checked) => setActive(checked)} />}

          <Tooltip title="Columns">
            <IconButton onClick={() => apiRef.current.showPreferences("columns")}>
              <ViewColumnIcon />
            </IconButton>
          </Tooltip>

          {/* CUSTOM FILTER ICON */}
          <Tooltip title="Filters">
            <IconButton onClick={() => apiRef.current.showPreferences("filters")}>
              <FilterListIcon />
            </IconButton>
          </Tooltip>

          {/* EXPORT */}
          {isExport && (
            <Tooltip title="Export">
              <IconButton onClick={(e) => setAnchorEl(e.currentTarget)}>
                <DownloadIcon />
              </IconButton>
            </Tooltip>
          )}

          <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={() => setAnchorEl(null)}>
            {/* EXCEL */}
            <MenuItem
              onClick={() => {
                ExportDataGridToExcel({
                  columns,
                  rows,
                  fileName: fileName,
                  title: user?.fullName,
                });
                setAnchorEl(null);
              }}
            >
              <GridOnIcon fontSize="small" sx={{ mr: 1 }} />
              Excel
            </MenuItem>

            {/* PRINT */}
            <MenuItem
              onClick={() => {
                apiRef?.current?.exportDataAsPrint();
                setAnchorEl(null);
              }}
            >
              <PrintIcon fontSize="small" sx={{ mr: 1 }} />
              Print
            </MenuItem>

            {/* PDF */}
            <MenuItem
              onClick={() => {
                ExportDataGridToPDF({
                  columns,
                  rows,
                  fileName: fileName,
                  title: user?.fullName,
                });
                setAnchorEl(null);
              }}
            >
              <PictureAsPdfIcon fontSize="small" sx={{ mr: 1 }} />
              PDF
            </MenuItem>
          </Menu>
          {handleAdd && (
            <Grid size="auto">
              <CommonButton variant="contained" size="small" startIcon={<AddIcon />} onClick={handleAdd}>
                ADD
              </CommonButton>
            </Grid>
          )}
        </Box>
      </Box>
    </GridToolbarContainer>
  );
};

export default CustomToolbar;
