import { useForm } from 'react-hook-form';
import { yupResolver } from "@hookform/resolvers/yup"
import * as yup from "yup"
import { SignInFormData } from '../types/auth';

const schema = yup
  .object({
    email: yup.string().email('E-mail inválido').required('Campo obrigatório'),
    password:  yup.string().min(4,'Senha deve ter pelo menos 4 caracteres').required('Campo obrigatório'),
  })
  .required()

export const useAuthForm = (data : SignInFormData) => {
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      email: data.email || '',
      password: data.password || '',
    },
  });

  return { control, handleSubmit, errors };
};