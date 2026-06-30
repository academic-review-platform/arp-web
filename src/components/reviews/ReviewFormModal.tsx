import {
  Alert,
  Box,
  Button,
  CircularProgress,
  Slider,
  TextField,
  Typography,
} from '@mui/material';
import type { FormikProps } from 'formik';
import AppModal from '../common/AppModal';
import type { ReviewFormValues } from '../../hooks/schemas/reviewSchema';

interface ReviewFormModalProps {
  open: boolean;
  formik: FormikProps<ReviewFormValues>;
  isLoading: boolean;
  onClose: () => void;
  title?: string;
  submitLabel?: string;
}

const ReviewFormModal = ({ open, formik, isLoading, onClose, title, submitLabel }: ReviewFormModalProps) => {
  const parsedScore = Number.parseFloat(String(formik.values.score ?? 50));
  const scoreValue = Number.isFinite(parsedScore) ? parsedScore : 50;

  const actions = (
    <>
      <Button key="cancel" onClick={onClose} disabled={isLoading} color="inherit">
        Cancelar
      </Button>
      <Button
        key="submit"
        variant="contained"
        onClick={() => formik.handleSubmit()}
        disabled={isLoading || !formik.isValid}
        startIcon={isLoading ? <CircularProgress size={16} color="inherit" /> : null}
      >
        {submitLabel ?? 'Publicar revisión'}
      </Button>
    </>
  );

  return (
    <AppModal
      open={open}
      title={title ?? 'Realizar Revisión'}
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

        <Typography variant="body2" gutterBottom sx={{ mb: 0.5 }}>
          Calificación: <strong>{scoreValue}</strong> / 100
        </Typography>
        <Slider
          value={scoreValue}
          onChange={(_, value) => formik.setFieldValue('score', Array.isArray(value) ? value[0] : value)}
          onBlur={() => formik.setFieldTouched('score', true)}
          min={0}
          max={100}
          step={1}
          marks={[
            { value: 0, label: '0' },
            { value: 50, label: '50' },
            { value: 100, label: '100' },
          ]}
          valueLabelDisplay="auto"
          sx={{ mb: formik.touched.score && formik.errors.score ? 0.5 : 3 }}
        />
        {formik.touched.score && formik.errors.score && (
          <Typography variant="caption" color="error" sx={{ display: 'block', mb: 2 }}>
            {formik.errors.score}
          </Typography>
        )}

        <TextField
          label="Comentario (opcional)"
          name="comment"
          fullWidth
          multiline
          minRows={4}
          value={formik.values.comment}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          error={formik.touched.comment && Boolean(formik.errors.comment)}
          helperText={formik.touched.comment && formik.errors.comment}
        />
      </Box>
    </AppModal>
  );
};

export default ReviewFormModal;
