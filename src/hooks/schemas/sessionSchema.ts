import * as Yup from 'yup';

export const sessionSchema = Yup.object({
  title: Yup.string().required('El título es requerido').min(3, 'Mínimo 3 caracteres'),
  summary: Yup.string().required('El resumen es requerido'),
  contentMd: Yup.string(),
});

export type SessionFormValues = Yup.InferType<typeof sessionSchema>;
