import type { FC } from "react";
import { Box, Typography, Grid, Paper, IconButton } from "@mui/material";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CommonModal from "./Modal/CommonModal";
import type { ContactAddressApi } from "../../Types";

interface AddressSelectionModalProps {
  isOpen: boolean;
  onClose: () => void;
  addresses: ContactAddressApi[];
  onSelect: (addressId: string) => void;
  selectedAddressId?: string | null;
  title: string;
}

const AddressSelectionModal: FC<AddressSelectionModalProps> = ({ isOpen, onClose, addresses, onSelect, selectedAddressId, title }) => {
  return (
    <CommonModal isOpen={isOpen} onClose={onClose} title={title} className="max-w-2xl">
      <Grid container spacing={2}>
        {addresses?.length > 0 ? (
          addresses.map((addr: any, index) => {
            const isSelected = addr._id === selectedAddressId;
            return (
              <Grid size={{ xs: 12 }} key={addr._id || index}>
                <Paper
                  elevation={0}
                  onClick={() => {
                    onSelect(addr._id);
                    onClose();
                  }}
                  className={`p-4 border-2 cursor-pointer transition-all hover:border-blue-500 dark:bg-gray-800! ${isSelected ? "border-blue-500 bg-blue-50/50 dark:bg-gray-800" : "border-gray-200 dark:border-gray-800"}`}
                >
                  <Box display="flex" justifyContent="space-between" alignItems="flex-start">
                    <Box>
                      <Typography variant="subtitle2" fontWeight={600} className="text-gray-800 dark:text-gray-200">
                        {addr.contactCompanyName || `Address ${index + 1}`}
                      </Typography>
                      <Typography variant="body2" className="text-gray-600 dark:text-gray-400 mt-1">
                        {addr.addressLine1}
                        {addr.addressLine2 ? `, ${addr.addressLine2}` : ""}
                      </Typography>
                      <Typography variant="body2" className="text-gray-600 dark:text-gray-400">
                        {addr.city?.name}, {addr.state?.name}, {addr.country?.name} - {addr.pinCode}
                      </Typography>
                      {addr.gstIn && (
                        <Typography variant="caption" className="text-blue-600 dark:text-blue-400 font-medium mt-1 block">
                          GSTIN: {addr.gstIn}
                        </Typography>
                      )}
                    </Box>
                    {isSelected && (
                      <IconButton color="primary" size="small">
                        <CheckCircleIcon />
                      </IconButton>
                    )}
                  </Box>
                </Paper>
              </Grid>
            );
          })
        ) : (
          <Grid size={{ xs: 12 }}>
            <Box py={4} textAlign="center">
              <Typography color="text.secondary">No addresses found for this customer.</Typography>
            </Box>
          </Grid>
        )}
      </Grid>
    </CommonModal>
  );
};

export default AddressSelectionModal;
