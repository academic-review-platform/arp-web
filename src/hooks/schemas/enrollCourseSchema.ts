import * as Yup from 'yup';

export const enrollCourseSchema = Yup.object({
  enrollmentCode: Yup.string().required('El código es requerido'),
});
