import * as Yup from 'yup';

export const assignmentSchema = Yup.object({
  title: Yup.string().required('El título es requerido').min(3, 'Mínimo 3 caracteres'),
  description: Yup.string().required('La descripción es requerida'),
  startDate: Yup.date()
    .required('La fecha de inicio es requerida')
    .typeError('Fecha de inicio inválida'),
  endDate: Yup.date()
    .required('La fecha de fin es requerida')
    .typeError('Fecha de fin inválida')
    .min(Yup.ref('startDate'), 'La fecha de fin debe ser posterior a la de inicio'),
  assignmentStatus: Yup.string<'DRAFT' | 'ACTIVE' | 'CLOSED'>().required(),
});

export type AssignmentFormValues = {
  title: string;
  description: string;
  startDate: Date | null;
  endDate: Date | null;
  assignmentStatus: 'DRAFT' | 'ACTIVE' | 'CLOSED';
};
