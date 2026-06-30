import { useFormik } from 'formik';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { loginSchema } from './schemas/loginSchema';
import { login } from '../services/authService';
import { useAuthStore } from '../store/authStore';

export const useLogin = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const loginUser = useAuthStore((state) => state.login);

  const onLoginSubmit = async (values: { email: string; password: string }) => {
    setIsLoading(true);
    const response = await login({ email: values.email, password: values.password });
    loginUser({ ...response.user, token: response.token });
    navigate("/dashboard");
    setIsLoading(false);
  }

  const formik = useFormik({
    initialValues: {
      email: "",
      password: ""
    },
    validationSchema: loginSchema,
    onSubmit: onLoginSubmit
  })


  return { formik, isLoading, navigate };

}