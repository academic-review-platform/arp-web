import LibraryBooksIcon from '@mui/icons-material/LibraryBooks';
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
import type { Bibliography } from '../../services/models/bibliographyModels';

interface ReferenceBibliographyModalProps {
  open: boolean;
  /** All bibliographies NOT yet referenced by this assignment */
  available: Bibliography[];
  isLoading: boolean;
  onConfirm: (selectedIds: string[]) => void;
  onClose: () => void;
}

const ReferenceBibliographyModal = ({
  open,
  available,
  isLoading,
  onConfirm,
  onClose,
}: ReferenceBibliographyModalProps) => {
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
      title="Referenciar Bibliografía"
      onClose={handleClose}
      disableClose={isLoading}
      actions={actions}
    >
      {available.length === 0 ? (
        <Alert severity="info">
          No hay bibliografías disponibles para referenciar en esta tarea.
        </Alert>
      ) : (
        <Box>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 1.5 }}>
            Selecciona las bibliografías que quieres asociar a esta tarea.
          </Typography>
          <FormGroup>
            {available.map((bib) => (
              <FormControlLabel
                key={bib.id}
                control={
                  <Checkbox
                    checked={selected.has(bib.id)}
                    onChange={() => toggle(bib.id)}
                    disabled={isLoading}
                    icon={<LibraryBooksIcon fontSize="small" sx={{ opacity: 0.4 }} />}
                    checkedIcon={<LibraryBooksIcon fontSize="small" color="primary" />}
                  />
                }
                label={
                  <Box>
                    <Typography variant="body2" sx={{ fontWeight: 600 }}>
                      {bib.title}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      {bib.bibliographyType}
                    </Typography>
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

export default ReferenceBibliographyModal;
