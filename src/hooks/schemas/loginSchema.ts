import * as yup from "yup";

export const loginSchema = yup.object({
  email: yup
    .string()
    .email("No es un email válido")
    .required("El email es requerido"),
  password: yup
    .string()
    .min(6, "La contraseña debe tener al menos 6 caracteres")
    .required("La contraseña es requerida"),
});
