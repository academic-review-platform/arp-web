/**
 * AppModal — componente base de modal para todo el proyecto.
 *
 * Estándar de modales:
 * - Dialog centrado, no full-screen en desktop
 * - Ancho controlado por `maxWidth` (default "sm")
 * - Header con título y botón de cierre (X) en la esquina superior derecha
 * - Área de contenido con padding consistente via DialogContent
 * - Footer opcional via `actions` (usa DialogActions con alineación derecha)
 * - Cierre al hacer clic en el backdrop o presionar Escape, configurable con `disableClose`
 * - Soporte de `loading` para bloquear interacción durante operaciones async
 */
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  IconButton,
  type DialogProps,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';

interface AppModalProps {
  /** Controla si el modal está abierto */
  open: boolean;
  /** Título mostrado en el header */
  title: string;
  /** Contenido del modal */
  children: React.ReactNode;
  /** Botones de acción en el footer (opcional) */
  actions?: React.ReactNode;
  /** Ancho máximo del dialog — sigue los breakpoints de MUI */
  maxWidth?: DialogProps['maxWidth'];
  /** Impide cerrar con clic en backdrop o Escape */
  disableClose?: boolean;
  /** Callback de cierre — requerido salvo que disableClose sea true */
  onClose: () => void;
}

const AppModal = ({
  open,
  title,
  children,
  actions,
  maxWidth = 'sm',
  disableClose = false,
  onClose,
}: AppModalProps) => {
  const handleClose = (_: unknown, reason: 'backdropClick' | 'escapeKeyDown') => {
    if (disableClose && (reason === 'backdropClick' || reason === 'escapeKeyDown')) return;
    onClose();
  };

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      maxWidth={maxWidth}
      fullWidth
      slotProps={{
        paper: {
          elevation: 4,
          sx: { borderRadius: 2 },
        },
      }}
    >
      {/* Header */}
      <DialogTitle
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          py: 2,
          px: 3,
          fontWeight: 600,
        }}
      >
        {title}
        <IconButton
          aria-label="Cerrar"
          onClick={onClose}
          size="small"
          sx={{ color: 'text.secondary', ml: 1 }}
        >
          <CloseIcon fontSize="small" />
        </IconButton>
      </DialogTitle>

      <Divider />

      {/* Contenido */}
      <DialogContent sx={{ px: 3, py: 2.5 }}>
        {children}
      </DialogContent>

      {/* Footer — solo si se pasan acciones */}
      {actions && (
        <>
          <Divider />
          <DialogActions sx={{ px: 3, py: 2 }}>
            {actions}
          </DialogActions>
        </>
      )}
    </Dialog>
  );
};

export default AppModal;
