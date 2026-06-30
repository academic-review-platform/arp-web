import { Button, CircularProgress, Typography } from '@mui/material';
import AppModal from './AppModal';

interface ConfirmModalProps {
  open: boolean;
  title: string;
  description: string;
  confirmLabel?: string;
  confirmColor?: 'error' | 'primary' | 'warning';
  isLoading?: boolean;
  onConfirm: () => void;
  onClose: () => void;
}

const ConfirmModal = ({
  open,
  title,
  description,
  confirmLabel = 'Confirmar',
  confirmColor = 'error',
  isLoading = false,
  onConfirm,
  onClose,
}: ConfirmModalProps) => {
  const actions = (
    <>
      <Button onClick={onClose} disabled={isLoading} color="inherit">
        Cancelar
      </Button>
      <Button
        variant="contained"
        color={confirmColor}
        onClick={onConfirm}
        disabled={isLoading}
        startIcon={isLoading ? <CircularProgress size={16} color="inherit" /> : null}
      >
        {confirmLabel}
      </Button>
    </>
  );

  return (
    <AppModal
      open={open}
      title={title}
      onClose={onClose}
      disableClose={isLoading}
      maxWidth="xs"
      actions={actions}
    >
      <Typography variant="body1" color="text.secondary">
        {description}
      </Typography>
    </AppModal>
  );
};

export default ConfirmModal;
