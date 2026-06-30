import * as Yup from 'yup';
import type { BibliographyType } from '../../services/models/bibliographyModels';

const ACCEPTED_MIME_TYPES = [
  'application/pdf',
  'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  'application/vnd.ms-powerpoint',
  'application/vnd.openxmlformats-officedocument.presentationml.presentation',
  'text/markdown',
  'text/plain',
];

export const bibliographySchema = Yup.object({
  title: Yup.string().required('El título es requerido').min(3, 'Mínimo 3 caracteres'),
  bibliographyType: Yup.string<BibliographyType>()
    .oneOf(['PDF', 'WORD', 'POWERPOINT', 'URL'], 'Tipo inválido')
    .required('El tipo es requerido'),
  url: Yup.string().when('bibliographyType', {
    is: 'URL',
    then: (schema) => schema.url('URL inválida').required('La URL es requerida'),
    otherwise: (schema) => schema,
  }),
  file: Yup.mixed<File>().when('bibliographyType', {
    is: (val: BibliographyType) => val !== 'URL',
    then: (schema) =>
      schema
        .required('El archivo es requerido')
        .test('fileType', 'Tipo de archivo no permitido', (value) => {
          if (!value) return false;
          return ACCEPTED_MIME_TYPES.includes((value as File).type);
        }),
    otherwise: (schema) => schema.nullable(),
  }),
});

export type BibliographyFormValues = {
  title: string;
  bibliographyType: BibliographyType | '';
  url: string;
  file: File | null;
};
