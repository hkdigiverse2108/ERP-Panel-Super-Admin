import { Button, Grid, TextField } from '@mui/material';
import { CommonModal } from '../../../Components/Common';


const AddTransactionDialog = ({ open, onClose }: any) => {
  return (
    <CommonModal isOpen={open} onClose={onClose} className="max-w-xl" title='Add Bank Transaction'>
      <Grid container spacing={2}>
        <Grid size={6}>
          <TextField fullWidth label="From Account" />
        </Grid>

        <Grid size={6}>
          <TextField fullWidth label="To Account" />
        </Grid>

        <Grid size={6}>
          <TextField fullWidth label="Amount" type="number" />
        </Grid>

        <Grid size={6}>
          <TextField fullWidth label="Transaction Date" type="date" InputLabelProps={{ shrink: true }} />
        </Grid>

        <Grid size={12}>
          <TextField fullWidth label="Description" multiline rows={3} />
        </Grid>
      </Grid>

      <div className="flex justify-end gap-2 mt-6">
        <Button onClick={onClose}>Cancel</Button>
        <Button variant="contained">Save</Button>
      </div>
    </CommonModal>
  );
};

export default AddTransactionDialog
