'use client';
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from '@mui/material';

interface ConfirmationDialogProps {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

export const ConfirmationDialog = ({
  open,
  onClose,
  onConfirm,
}: ConfirmationDialogProps) => (
  <Dialog open={open} onClose={onClose}>
    <DialogTitle>Delete</DialogTitle>
    <DialogContent>
      <DialogContentText>
        Are you sure you want to delete? This action cannot be undone.
      </DialogContentText>
    </DialogContent>
    <DialogActions>
      <Button onClick={onClose} color="primary">
        Cancel
      </Button>
      <Button onClick={onConfirm} color="error" variant="contained" autoFocus>
        Delete
      </Button>
    </DialogActions>
  </Dialog>
);
