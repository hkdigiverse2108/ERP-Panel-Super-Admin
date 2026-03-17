import { Box, Checkbox, List, ListItem, ListItemButton, ListItemIcon, ListItemText, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { Queries } from "../../../Api";
import { CommonButton } from "../../../Attribute";
import { CommonModal } from "../../../Components/Common";
import { useAppSelector } from "../../../Store/hooks";
import { setSelectedTermIds, setTermsAndConditionSelectionModal } from "../../../Store/Slices/ModalSlice";

const CommonTermsAndConditionSelectModal = () => {
  const { isTermsAndConditionSelectionModal } = useAppSelector((state) => state.modal);
  const dispatch = useDispatch();

  const { open, alreadySelectedIds, companyId } = isTermsAndConditionSelectionModal;

  const { data: termsData, isLoading } = Queries.useGetTermsCondition({ all: true, companyId: companyId || undefined }, { enabled: !!companyId && open });
  const termsList = termsData?.data?.termsCondition_data || [];

  // console.log("termsList", companyId);

  const [localSelectedIds, setLocalSelectedIds] = useState<string[]>([]);

  useEffect(() => {
    if (open) {
      setLocalSelectedIds(alreadySelectedIds || []);
    }
  }, [open, alreadySelectedIds]);

  const handleToggle = (id: string) => {
    const currentIndex = localSelectedIds.indexOf(id);
    const newChecked = [...localSelectedIds];

    if (currentIndex === -1) {
      newChecked.push(id);
    } else {
      newChecked.splice(currentIndex, 1);
    }

    setLocalSelectedIds(newChecked);
  };

  const handleClose = () => {
    dispatch(setTermsAndConditionSelectionModal({ open: false, alreadySelectedIds: [], companyId: "" }));
  };

  const handleSave = () => {
    dispatch(setSelectedTermIds(localSelectedIds));
    handleClose();
  };

  if (!open) return null;

  return (
    <CommonModal title="Select Terms & Conditions" isOpen={open} onClose={handleClose} className="w-full max-w-2xl">
      <Box sx={{ display: "flex", flexDirection: "column", gap: 1, height: "80vh", maxHeight: 600 }}>
        {/* Stats */}
        <Box display="flex" justifyContent="flex-end" alignItems="center">
          <Box sx={{ color: "text.secondary", fontSize: "0.875rem" }}>
            Selected: <b>{localSelectedIds.length}</b>
          </Box>
        </Box>

        {/* <Divider /> */}

        {/* List */}
        <Box sx={{ flex: 1, overflowY: "auto", border: 1, borderColor: "divider", borderRadius: 1 }}>
          {isLoading ? (
            <Box p={3} textAlign="center">
              <Typography>Loading Terms...</Typography>
            </Box>
          ) : termsList && termsList.length > 0 ? (
            <List dense disablePadding>
              {termsList.map((term, index) => {
                const labelId = `checkbox-list-label-${term._id}`;
                const isSelected = localSelectedIds.indexOf(term._id) !== -1;
                return (
                  <ListItem
                    key={term._id}
                    disablePadding
                    divider={index !== (termsList.length || 0) - 1}
                    sx={{
                      "&:hover": { bgcolor: "action.hover" },
                    }}
                  >
                    <ListItemButton role={undefined} onClick={() => handleToggle(term._id)} dense>
                      <ListItemIcon sx={{ minWidth: 40 }}>
                        <Checkbox edge="start" checked={isSelected} tabIndex={-1} disableRipple inputProps={{ "aria-labelledby": labelId }} />
                      </ListItemIcon>
                      <ListItemText
                        id={labelId}
                        primary={term.termsCondition}
                        // primaryTypographyProps={{
                        //   variant: "body2",
                        //   color: "text.primary",
                        //   sx: { whiteSpace: "pre-wrap" },
                        // }}
                      />
                    </ListItemButton>
                  </ListItem>
                );
              })}
            </List>
          ) : (
            <Box p={4} textAlign="center" color="text.secondary">
              <Typography>No terms found.</Typography>
            </Box>
          )}
        </Box>
        {/* Footer */}
        <Box display="flex" justifyContent="flex-end" alignItems="center" pt={1}>
          <Box display="flex" gap={2}>
            <CommonButton title="Cancel" variant="outlined" onClick={handleClose} />
            <CommonButton title={`Save (${localSelectedIds.length})`} variant="contained" onClick={handleSave} />
          </Box>
        </Box>
      </Box>
    </CommonModal>
  );
};
export default CommonTermsAndConditionSelectModal;
