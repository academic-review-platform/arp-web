import { Alert, Box, Button, CircularProgress, TextField } from '@mui/material';
import AppModal from '../../common/AppModal';
import type { UseAddMenuReturn } from '../../../hooks/useAddMenu';

interface EnrollCourseModalProps {
  open: boolean;
  onClose: UseAddMenuReturn['closeModal'];
  formik: UseAddMenuReturn['enrollFormik'];
  isLoading: UseAddMenuReturn['isEnrolling'];
}

const EnrollCourseModal = ({ open, onClose, formik, isLoading }: EnrollCourseModalProps) => {
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
        Unirse
      </Button>
    </>
  );

  return (
    <AppModal
      open={open}
      title="Unirse a una Clase"
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
          label="Código de inscripción"
          name="enrollmentCode"
          fullWidth
          value={formik.values.enrollmentCode}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          error={formik.touched.enrollmentCode && Boolean(formik.errors.enrollmentCode)}
          helperText={formik.touched.enrollmentCode && formik.errors.enrollmentCode}
        />
      </Box>
    </AppModal>
  );
};

export default EnrollCourseModal;
