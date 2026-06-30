import { Alert, Box, Button, CircularProgress, TextField } from '@mui/material';
import AppModal from '../../common/AppModal';
import type { UseAddMenuReturn } from '../../../hooks/useAddMenu';

interface CreateCourseModalProps {
  open: boolean;
  onClose: UseAddMenuReturn['closeModal'];
  formik: UseAddMenuReturn['createFormik'];
  isLoading: UseAddMenuReturn['isCreating'];
}

const CreateCourseModal = ({ open, onClose, formik, isLoading }: CreateCourseModalProps) => {
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
        Crear
      </Button>
    </>
  );

  return (
    <AppModal
      open={open}
      title="Crear una Clase"
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

export default CreateCourseModal;
