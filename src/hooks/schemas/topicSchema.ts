import * as Yup from 'yup';

export const topicSchema = Yup.object({
  title: Yup.string().required('El título es requerido').min(3, 'Mínimo 3 caracteres'),
  description: Yup.string(),
});

export type TopicFormValues = Yup.InferType<typeof topicSchema>;
