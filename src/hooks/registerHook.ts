import { useFormik } from 'formik';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { registerSchema } from './schemas/registerSchema';
import { register } from '../services/authService';
import { useAuthStore } from '../store/authStore';

export const useRegister = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const loginUser = useAuthStore((state) => state.login);

  const onRegisterSubmit = async (values: { email: string; password: string; firstname: string; lastname: string }) => {
    setIsLoading(true);
    const response = await register({ 
      email: values.email, 
      passwordHash: values.password, 
      firstname: values.firstname,
      lastname: values.lastname
    });
    loginUser({ ...response.user, token: response.token });
    navigate("/dashboard");
    setIsLoading(false);
  }

  const formik = useFormik({
    initialValues: {
      email: "",
      firstname: "",
      lastname: "",
      password: "",
      passwordConfirmation: ""
    },
    validationSchema: registerSchema,
    onSubmit: onRegisterSubmit
  })


  return { formik, isLoading, navigate };

}