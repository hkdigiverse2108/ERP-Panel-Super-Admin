import { Box, Checkbox, Divider, List, ListItem, ListItemButton, ListItemIcon, ListItemText, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import { Queries } from "../../../Api";
import { CommonButton } from "../../../Attribute";
import { CommonModal } from "../../../Components/Common";
import type { TermsConditionBase } from "../../../Types";

interface SelectTermsModalProps {
    open: boolean;
    onClose: () => void;
    onSave: (selected: TermsConditionBase[]) => void;
    alreadySelected: TermsConditionBase[];
}

const SelectTermsModal = ({ open, onClose, onSave, alreadySelected }: SelectTermsModalProps) => {
    const { data: termsData, isLoading } = Queries.useGetTermsConditionDropdown();
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
        if (termsData?.data) {
            const selectedTerms = termsData.data.filter((t) => selectedIds.includes(t._id));
            onSave(selectedTerms);
        }
        onClose();
    };

    return (
        <CommonModal title="Select Terms & Conditions" isOpen={open} onClose={onClose} className="w-full max-w-lg">
            <Box sx={{ p: 2 }}>
                {isLoading ? (
                    <Typography>Loading...</Typography>
                ) : (
                    <List sx={{ width: "100%", bgcolor: "background.paper", maxHeight: 400, overflow: "auto" }}>
                        {termsData?.data?.map((term) => {
                            const labelId = `checkbox-list-label-${term._id}`;
                            const isSelected = selectedIds.indexOf(term._id) !== -1;
                            return (
                                <ListItem key={term._id} disablePadding>
                                    <ListItemButton role={undefined} onClick={() => handleToggle(term._id)} dense>
                                        <ListItemIcon>
                                            <Checkbox edge="start" checked={isSelected} tabIndex={-1} disableRipple inputProps={{ 'aria-labelledby': labelId }} />
                                        </ListItemIcon>
                                        <ListItemText id={labelId} primary={term.termsCondition} />
                                    </ListItemButton>
                                </ListItem>
                            );
                        })}
                        {(!termsData?.data || termsData.data.length === 0) && <Typography align="center">No terms found.</Typography>}
                    </List>
                )}
                <Divider sx={{ my: 2 }} />
                <Box display="flex" justifyContent="flex-end" gap={2}>
                    <CommonButton title="Cancel" variant="outlined" onClick={onClose} />
                    <CommonButton title="Save" variant="contained" onClick={handleSave} />
                </Box>
            </Box>
        </CommonModal>
    );
};

export default SelectTermsModal;
