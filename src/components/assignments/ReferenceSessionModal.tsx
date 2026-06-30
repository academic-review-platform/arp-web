import MenuBookOutlinedIcon from '@mui/icons-material/MenuBookOutlined';
import {
  Alert,
  Box,
  Button,
  Checkbox,
  CircularProgress,
  FormControlLabel,
  FormGroup,
  Typography,
} from '@mui/material';
import { useState } from 'react';
import AppModal from '../common/AppModal';
import type { Session } from '../../services/models/sessionModels';

interface ReferenceSessionModalProps {
  open: boolean;
  /** Sessions NOT yet referenced by this assignment */
  available: Session[];
  isLoading: boolean;
  onConfirm: (selectedIds: string[]) => void;
  onClose: () => void;
}

const ReferenceSessionModal = ({
  open,
  available,
  isLoading,
  onConfirm,
  onClose,
}: ReferenceSessionModalProps) => {
  const [selected, setSelected] = useState<Set<string>>(new Set());

  const toggle = (id: string) => {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  const handleClose = () => {
    setSelected(new Set());
    onClose();
  };

  const handleConfirm = () => {
    onConfirm(Array.from(selected));
    setSelected(new Set());
  };

  const actions = (
    <>
      <Button onClick={handleClose} disabled={isLoading} color="inherit">
        Cancelar
      </Button>
      <Button
        variant="contained"
        onClick={handleConfirm}
        disabled={isLoading || selected.size === 0}
        startIcon={isLoading ? <CircularProgress size={16} color="inherit" /> : null}
      >
        Referenciar
      </Button>
    </>
  );

  return (
    <AppModal
      open={open}
      title="Referenciar Sesión"
      onClose={handleClose}
      disableClose={isLoading}
      actions={actions}
    >
      {available.length === 0 ? (
        <Alert severity="info">
          No hay sesiones disponibles para referenciar en esta tarea.
        </Alert>
      ) : (
        <Box>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 1.5 }}>
            Selecciona las sesiones que quieres asociar a esta tarea.
          </Typography>
          <FormGroup>
            {available.map((session) => (
              <FormControlLabel
                key={session.id}
                control={
                  <Checkbox
                    checked={selected.has(session.id)}
                    onChange={() => toggle(session.id)}
                    disabled={isLoading}
                    icon={<MenuBookOutlinedIcon fontSize="small" sx={{ opacity: 0.4 }} />}
                    checkedIcon={<MenuBookOutlinedIcon fontSize="small" color="primary" />}
                  />
                }
                label={
                  <Box>
                    <Typography variant="body2" sx={{ fontWeight: 600 }}>
                      {session.title}
                    </Typography>
                    {session.summary && (
                      <Typography variant="caption" color="text.secondary">
                        {session.summary}
                      </Typography>
                    )}
                  </Box>
                }
                sx={{ mb: 0.5 }}
              />
            ))}
          </FormGroup>
        </Box>
      )}
    </AppModal>
  );
};

export default ReferenceSessionModal;
