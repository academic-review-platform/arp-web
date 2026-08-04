import * as yup from 'yup';

export const registerSchema = yup.object({
  firstname: yup
    .string()
    .trim()
    .min(2, 'El nombre debe tener al menos 2 caracteres')
    .required('El nombre es obligatorio'),
  lastname: yup
    .string()
    .trim()
    .min(2, 'El apellido debe tener al menos 2 caracteres')
    .required('El apellido es obligatorio'),
  email: yup
    .string()
    .trim()
    .email('Email no válido')
    .required('El email es obligatorio'),
  password: yup
    .string()
    .min(8, 'La contraseña debe tener al menos 8 caracteres')
    .matches(/^(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9]).+$/, 'La contraseña debe tener una mayúscula, un número y un carácter especial')
    .required('La contraseña es obligatoria'),
  passwordConfirmation: yup
    .string()
    .oneOf([yup.ref('password')], 'Las contraseñas deben coincidir')
    .required('La confirmación de contraseña es obligatoria'),
});
