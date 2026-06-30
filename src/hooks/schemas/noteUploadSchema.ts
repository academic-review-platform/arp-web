import * as Yup from 'yup';

const ACCEPTED_MIME_TYPES = [
  'application/pdf',
  'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  'text/markdown',
  'text/plain',
];

export const noteUploadSchema = Yup.object({
  file: Yup.mixed<File>()
    .required('El archivo es requerido')
    .test('fileType', 'Solo se permiten PDF, Word o Markdown', (value) => {
      if (!value) return false;
      return ACCEPTED_MIME_TYPES.includes((value as File).type);
    }),
});

export type NoteUploadFormValues = {
  file: File | null;
};
