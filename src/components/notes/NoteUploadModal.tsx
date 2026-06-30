import UploadFileIcon from '@mui/icons-material/UploadFile';
import {
  Alert,
  Box,
  Button,
  CircularProgress,
  Typography,
} from '@mui/material';
import type { FormikProps } from 'formik';
import { useRef } from 'react';
import AppModal from '../common/AppModal';
import type { NoteUploadFormValues } from '../../hooks/schemas/noteUploadSchema';

interface NoteUploadModalProps {
  open: boolean;
  mode: 'create' | 'edit';
  formik: FormikProps<NoteUploadFormValues>;
  isLoading: boolean;
  onClose: () => void;
}

const NoteUploadModal = ({ open, mode, formik, isLoading, onClose }: NoteUploadModalProps) => {
  const isEdit = mode === 'edit';
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] ?? null;
    formik.setFieldValue('file', file);
  };

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
        {isEdit ? 'Actualizar' : 'Publicar'}
      </Button>
    </>
  );

  return (
    <AppModal
      open={open}
      title={isEdit ? 'Editar Nota' : 'Publicar Apunte'}
      onClose={onClose}
      disableClose={isLoading}
      maxWidth="xs"
      actions={actions}
    >
      <Box component="form" onSubmit={formik.handleSubmit} noValidate>
        {formik.status && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {formik.status}
          </Alert>
        )}

        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
          Formatos aceptados: PDF, Word (.doc/.docx) o Markdown (.md)
        </Typography>

        <input
          ref={fileInputRef}
          type="file"
          accept=".pdf,.doc,.docx,.md,.txt"
          style={{ display: 'none' }}
          onChange={handleFileChange}
        />
        <Button
          variant="outlined"
          startIcon={<UploadFileIcon />}
          onClick={() => fileInputRef.current?.click()}
          fullWidth
          sx={{ py: 1.5, justifyContent: 'flex-start' }}
        >
          {formik.values.file
            ? (formik.values.file as File).name
            : 'Seleccionar archivo…'}
        </Button>
        {formik.touched.file && formik.errors.file && (
          <Typography variant="caption" color="error" sx={{ mt: 0.5, display: 'block' }}>
            {String(formik.errors.file)}
          </Typography>
        )}
      </Box>
    </AppModal>
  );
};

export default NoteUploadModal;
