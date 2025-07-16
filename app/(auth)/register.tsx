import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { AuthLayout } from '@/components/auth/layout/AuthLayout';
import { Input } from '@/components/auth/ui/Input';
import { Button } from '@/components/auth/ui/Button';
import { SocialButton } from '@/components/auth/ui/SocialButton';
import { SignInFormData } from '@/components/auth/types/auth';
import Entypo from '@expo/vector-icons/Entypo';
import AntDesign from '@expo/vector-icons/AntDesign';
import { registerAuthForm } from '@/components/auth/hooks/registerAuth';
import { Link } from 'expo-router';

export default function Register(){
     const { control, handleSubmit, errors } = registerAuthForm();

  const onSubmit = (data: SignInFormData) => {
    console.log(data);
    // Handle sign in logic here
  };

    return (
        <AuthLayout
      title="Criar Conta"
      subtitle="Bem vindo a esta jornada e fique pronto para explorar as dezenas de surpresas que preparamos para si!"
    >
      {/* Social Login Buttons */}
      <View className='flex-row gap-4 justify-center items-center'>
     <SocialButton
        icon={ <Entypo name="facebook-with-circle" size={24} color="black" />}
        text="Facebook"
        onPress={() => console.log('Facebook login')}
      />
      <SocialButton
        icon={<AntDesign name="google" size={24} color="black" />}
        text="Google"
        onPress={() => console.log('Google login')}
      />
      </View>
 

      {/* Divider */}
      <View className='flex-row items-center my-6'>
        <View className='flex-1 h-px bg-gray-300' />
        <Text className='px-4 text-gray-500'>Ou</Text>
        <View className='flex-1 h-px bg-gray-300' />
      </View>
    <Input
        control={control}
        name="name"
        placeholder="Digite seu nome"
        error={errors.password}
        secureTextEntry
      />

      {/* Email Input */}
      <Input
        control={control}
        name="email"
        placeholder="alphainvent@gmail.com"
        error={errors.email}
      />

      {/* Password Input */}
      <Input
        control={control}
        name="password"
        placeholder="••••••••"
        error={errors.password}
        secureTextEntry
      />

   

      {/* Sign In Button */}
      <Button title="Registrar" onPress={handleSubmit(onSubmit)} />

      {/* Sign Up Link */}
      <View className='flex-row justify-center mt-4'>
        <Text className='text-gray-500'>Já tens uma conta? </Text>
        <Link asChild href={'/(auth)/login'}>
        <TouchableOpacity>
          <Text className='text-blue-600'>Entrar</Text>
        </TouchableOpacity>
        </Link>
      </View>
    </AuthLayout>
    );
}