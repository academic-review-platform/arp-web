import UploadFileIcon from '@mui/icons-material/UploadFile';
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
  Typography,
} from '@mui/material';
import type { FormikProps } from 'formik';
import { useRef } from 'react';
import AppModal from '../common/AppModal';
import type { BibliographyFormValues } from '../../hooks/schemas/bibliographySchema';

interface BibliographyFormModalProps {
  open: boolean;
  formik: FormikProps<BibliographyFormValues>;
  isLoading: boolean;
  onClose: () => void;
}

const BibliographyFormModal = ({
  open,
  formik,
  isLoading,
  onClose,
}: BibliographyFormModalProps) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const isUrl = formik.values.bibliographyType === 'URL';

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
        Publicar
      </Button>
    </>
  );

  return (
    <AppModal
      open={open}
      title="Añadir Bibliografía"
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

        <FormControl
          fullWidth
          error={formik.touched.bibliographyType && Boolean(formik.errors.bibliographyType)}
          sx={{ mb: 2 }}
        >
          <InputLabel id="bib-type-label">Tipo</InputLabel>
          <Select
            labelId="bib-type-label"
            name="bibliographyType"
            value={formik.values.bibliographyType}
            label="Tipo"
            onChange={(e) => {
              formik.setFieldValue('bibliographyType', e.target.value);
              formik.setFieldValue('file', null);
              formik.setFieldValue('url', '');
            }}
            onBlur={formik.handleBlur}
          >
            <MenuItem value="PDF">PDF</MenuItem>
            <MenuItem value="WORD">Word</MenuItem>
            <MenuItem value="POWERPOINT">PowerPoint</MenuItem>
            <MenuItem value="URL">URL</MenuItem>
          </Select>
          {formik.touched.bibliographyType && formik.errors.bibliographyType && (
            <FormHelperText>{formik.errors.bibliographyType}</FormHelperText>
          )}
        </FormControl>

        {isUrl ? (
          <TextField
            label="URL"
            name="url"
            fullWidth
            value={formik.values.url}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={formik.touched.url && Boolean(formik.errors.url)}
            helperText={formik.touched.url && formik.errors.url}
          />
        ) : (
          <Box>
            <input
              ref={fileInputRef}
              type="file"
              accept=".pdf,.doc,.docx,.ppt,.pptx,.md,.txt"
              style={{ display: 'none' }}
              onChange={handleFileChange}
            />
            <Button
              variant="outlined"
              startIcon={<UploadFileIcon />}
              onClick={() => fileInputRef.current?.click()}
              disabled={!formik.values.bibliographyType}
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
        )}
      </Box>
    </AppModal>
  );
};

export default BibliographyFormModal;
