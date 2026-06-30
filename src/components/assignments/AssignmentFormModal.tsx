import {
  Alert,
  Box,
  Button,
  CircularProgress,
  FormControl,
  FormHelperText,
  InputLabel,
  MenuItem,
  Select,
  TextField,
} from '@mui/material';
import { DateTimePicker, LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs from 'dayjs';
import type { FormikProps } from 'formik';
import 'dayjs/locale/es';
import AppModal from '../common/AppModal';
import type { AssignmentFormValues } from '../../hooks/schemas/assignmentSchema';

interface AssignmentFormModalProps {
  open: boolean;
  mode: 'create' | 'edit';
  formik: FormikProps<AssignmentFormValues>;
  isLoading: boolean;
  onClose: () => void;
}

const AssignmentFormModal = ({
  open,
  mode,
  formik,
  isLoading,
  onClose,
}: AssignmentFormModalProps) => {
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
    <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="es">
      <AppModal
        open={open}
        title={isEdit ? 'Editar Tarea' : 'Nueva Tarea'}
        onClose={onClose}
        disableClose={isLoading}
        maxWidth="sm"
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
            sx={{ mb: 2 }}
          />

          <Box sx={{ display: 'flex', gap: 2, mb: 2, flexDirection: { xs: 'column', sm: 'row' } }}>
            <DateTimePicker
              label="Fecha y hora de inicio"
              value={formik.values.startDate ? dayjs(formik.values.startDate) : null}
              onChange={(val) => formik.setFieldValue('startDate', val ? val.toDate() : null)}
              ampm={false}
              minutesStep={1}
              slotProps={{
                textField: {
                  fullWidth: true,
                  name: 'startDate',
                  onBlur: () => formik.setFieldTouched('startDate', true),
                  error: formik.touched.startDate && Boolean(formik.errors.startDate),
                  helperText:
                    formik.touched.startDate && formik.errors.startDate
                      ? String(formik.errors.startDate)
                      : undefined,
                },
              }}
            />
            <DateTimePicker
              label="Fecha y hora de fin"
              value={formik.values.endDate ? dayjs(formik.values.endDate) : null}
              onChange={(val) => formik.setFieldValue('endDate', val ? val.toDate() : null)}
              ampm={false}
              minutesStep={1}
              minDateTime={formik.values.startDate ? dayjs(formik.values.startDate) : undefined}
              slotProps={{
                textField: {
                  fullWidth: true,
                  name: 'endDate',
                  onBlur: () => formik.setFieldTouched('endDate', true),
                  error: formik.touched.endDate && Boolean(formik.errors.endDate),
                  helperText:
                    formik.touched.endDate && formik.errors.endDate
                      ? String(formik.errors.endDate)
                      : undefined,
                },
              }}
            />
          </Box>

          <FormControl
            fullWidth
            error={formik.touched.assignmentStatus && Boolean(formik.errors.assignmentStatus)}
          >
            <InputLabel id="assignment-status-label">Estado</InputLabel>
            <Select
              labelId="assignment-status-label"
              name="assignmentStatus"
              value={formik.values.assignmentStatus}
              label="Estado"
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
            >
              <MenuItem value="DRAFT">Borrador</MenuItem>
              <MenuItem value="ACTIVE">Activa</MenuItem>
              <MenuItem value="CLOSED">Cerrada</MenuItem>
            </Select>
            {formik.touched.assignmentStatus && formik.errors.assignmentStatus && (
              <FormHelperText>{formik.errors.assignmentStatus}</FormHelperText>
            )}
          </FormControl>
        </Box>
      </AppModal>
    </LocalizationProvider>
  );
};

export default AssignmentFormModal;
