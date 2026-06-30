import * as Yup from 'yup';

export const reviewSchema = Yup.object({
  score: Yup.number()
    .required('La calificación es requerida')
    .min(0, 'Mínimo 0')
    .max(100, 'Máximo 100'),
  comment: Yup.string(),
});

export type ReviewFormValues = Yup.InferType<typeof reviewSchema>;
