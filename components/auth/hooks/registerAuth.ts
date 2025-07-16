import { useForm } from 'react-hook-form';
import { yupResolver } from "@hookform/resolvers/yup"
import * as yup from "yup"

const schema = yup
  .object({
    name: yup.string().required('Campo obrigatório'),
    email: yup.string().email('E-mail inválido').required('Campo obrigatório'),
    password:  yup.string().min(4,'Senha deve ter pelo menos 4 caracteres').required('Campo obrigatório'),
  })
  .required()

export const registerAuthForm = () => {
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
     resolver: yupResolver(schema),
    defaultValues: {
      name:'',
      email: '',
      password: '',
    },
  });

  return { control, handleSubmit, errors };
};