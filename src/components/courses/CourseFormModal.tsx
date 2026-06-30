import { Alert, Box, Button, CircularProgress, TextField } from '@mui/material';
import type { FormikProps } from 'formik';
import AppModal from '../common/AppModal';

interface CourseFormModalProps {
  open: boolean;
  mode: 'create' | 'edit';
  formik: FormikProps<{ title: string; description: string }>;
  isLoading: boolean;
  onClose: () => void;
}

const CourseFormModal = ({ open, mode, formik, isLoading, onClose }: CourseFormModalProps) => {
  const isEdit = mode === 'edit';
  const title = isEdit ? 'Editar Curso' : 'Crear una Clase';
  const submitLabel = isEdit ? 'Guardar' : 'Crear';

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
        {submitLabel}
      </Button>
    </>
  );

  return (
    <AppModal
      open={open}
      title={title}
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
          label="Descripción"
          name="description"
          fullWidth
          multiline
          minRows={3}
          value={formik.values.description}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          error={formik.touched.description && Boolean(formik.errors.description)}
          helperText={formik.touched.description && formik.errors.description}
        />
      </Box>
    </AppModal>
  );
};

export default CourseFormModal;
