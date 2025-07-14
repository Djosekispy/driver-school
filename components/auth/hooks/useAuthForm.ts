import { useForm } from 'react-hook-form';
import { SignInFormData } from '../types/auth';

export const useAuthForm = () => {
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<SignInFormData>({
    defaultValues: {
      email: '',
      password: '',
    },
  });

  return { control, handleSubmit, errors };
};