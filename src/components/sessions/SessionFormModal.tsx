import { Alert, Box, Button, CircularProgress, TextField } from '@mui/material';
import type { FormikProps } from 'formik';
import AppModal from '../common/AppModal';
import type { SessionFormValues } from '../../hooks/schemas/sessionSchema';

interface SessionFormModalProps {
  open: boolean;
  mode: 'create' | 'edit';
  formik: FormikProps<SessionFormValues>;
  isLoading: boolean;
  onClose: () => void;
}

const SessionFormModal = ({ open, mode, formik, isLoading, onClose }: SessionFormModalProps) => {
  const isEdit = mode === 'edit';

  const actions = (
    <>
      <Button onClick={onClose} disabled={isLoading} color="inherit">
        Cancelar
      </Button>
      <Button
        variant="contained"
        onClick={() => formik.handleSubmit()}
        disabled={isLoading || !formik.isValid}
        startIcon={isLoading ? <CircularProgress size={16} color="inherit" /> : null}
      >
        {isEdit ? 'Guardar' : 'Crear'}
      </Button>
    </>
  );

  return (
    <AppModal
      open={open}
      title={isEdit ? 'Editar Sesión' : 'Nueva Sesión'}
      onClose={onClose}
      disableClose={isLoading}
      actions={actions}
    >
      <Box component="form" onSubmit={formik.handleSubmit} noValidate>
        {formik.status && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {formik.status}
          </Alert>
        )}
        <TextField
          label="Título"
          name="title"
          fullWidth
          value={formik.values.title}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          error={formik.touched.title && Boolean(formik.errors.title)}
          helperText={formik.touched.title && formik.errors.title}
          sx={{ mb: 2 }}
        />
        <TextField
          label="Resumen"
          name="summary"
          fullWidth
          multiline
          minRows={3}
          value={formik.values.summary}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          error={formik.touched.summary && Boolean(formik.errors.summary)}
          helperText={formik.touched.summary && formik.errors.summary}
          sx={{ mb: 2 }}
        />
        <TextField
          label="Contenido Markdown (opcional)"
          name="contentMd"
          fullWidth
          multiline
          minRows={4}
          value={formik.values.contentMd}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          error={formik.touched.contentMd && Boolean(formik.errors.contentMd)}
          helperText={formik.touched.contentMd && formik.errors.contentMd}
          slotProps={{ htmlInput: { style: { fontFamily: 'monospace', fontSize: '0.875rem' } } }}
        />
      </Box>
    </AppModal>
  );
};

export default SessionFormModal;
