import { Box, Checkbox, Divider, List, ListItem, ListItemButton, ListItemIcon, ListItemText, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import { Queries } from "../../../Api";
import { CommonButton } from "../../../Attribute";
import { CommonModal } from "../../../Components/Common";
import type { SelectTermsModalProps } from "../../../Types";

const SelectTermsModal = ({ open, onClose, onSave, alreadySelected }: SelectTermsModalProps) => {
    const { data: termsData, isLoading } = Queries.useGetTermsCondition({ all: true });
    // Helper to handle both array and paginated response
    const termsList = termsData?.data?.termsCondition_data || [];

    const [selectedIds, setSelectedIds] = useState<string[]>([]);

    useEffect(() => {
        if (open) {
            setSelectedIds(alreadySelected.map((t) => t._id));
        }
    }, [open, alreadySelected]);

    const handleToggle = (id: string) => {
        const currentIndex = selectedIds.indexOf(id);
        const newChecked = [...selectedIds];

        if (currentIndex === -1) {
            newChecked.push(id);
        } else {
            newChecked.splice(currentIndex, 1);
        }

        setSelectedIds(newChecked);
    };

    const handleSave = () => {
        if (termsList) {
            const selectedTerms = termsList.filter((t) => selectedIds.includes(t._id));
            onSave(selectedTerms);
        }
        onClose();
    };

    return (
        <CommonModal title="Select Terms & Conditions" isOpen={open} onClose={onClose} className="w-full max-w-2xl">
            <Box sx={{ p: 2, display: "flex", flexDirection: "column", gap: 2, height: "80vh", maxHeight: 600 }}>
                {/* Stats */}
                <Box display="flex" justifyContent="flex-end" alignItems="center">
                    <Box sx={{ color: "text.secondary", fontSize: "0.875rem" }}>
                        Selected: <b>{selectedIds.length}</b>
                    </Box>
                </Box>

                <Divider />

                {/* List */}
                <Box sx={{ flex: 1, overflowY: "auto", border: 1, borderColor: "divider", borderRadius: 1 }}>
                    {isLoading ? (
                        <Box p={3} textAlign="center">
                            <Typography>Loading terms...</Typography>
                        </Box>
                    ) : termsList && termsList.length > 0 ? (
                        <List dense disablePadding>
                            {termsList.map((term, index) => {
                                const labelId = `checkbox-list-label-${term._id}`;
                                const isSelected = selectedIds.indexOf(term._id) !== -1;
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
                                                primaryTypographyProps={{
                                                    variant: "body2",
                                                    color: "text.primary",
                                                    sx: { whiteSpace: "pre-wrap" },
                                                }}
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
                        <CommonButton title="Cancel" variant="outlined" color="inherit" onClick={onClose} />
                        <CommonButton title={`Save (${selectedIds.length})`} variant="contained" onClick={handleSave} />
                    </Box>
                </Box>
            </Box>
        </CommonModal>
    );
};
export default SelectTermsModal;
