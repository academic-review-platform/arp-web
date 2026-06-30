import * as Yup from 'yup';

export const createCourseSchema = Yup.object({
  title: Yup.string().required('El título es requerido').min(3, 'Mínimo 3 caracteres'),
  description: Yup.string().required('La descripción es requerida'),
});
