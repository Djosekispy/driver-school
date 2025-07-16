import { useForm } from 'react-hook-form';
import {  SignUpFormData } from '../types/auth';

export const registerAuthForm = () => {
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<SignUpFormData>({
    defaultValues: {
      name:'',
      email: '',
      password: '',
    },
  });

  return { control, handleSubmit, errors };
};