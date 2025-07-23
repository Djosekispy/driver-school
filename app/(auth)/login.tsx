import React, { useEffect } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { AuthLayout } from '@/components/auth/layout/AuthLayout';
import { Input } from '@/components/auth/ui/Input';
import { Button } from '@/components/auth/ui/Button';
import { SocialButton } from '@/components/auth/ui/SocialButton';
import { useAuthForm } from '@/components/auth/hooks/useAuthForm';
import { SignInFormData } from '@/components/auth/types/auth';
import Entypo from '@expo/vector-icons/Entypo';
import AntDesign from '@expo/vector-icons/AntDesign';
import { Link, useRouter } from 'expo-router';
import { useAuth } from '@/AuthContext/AuthContext';

export default function Login(){
     const { control, handleSubmit, errors } = useAuthForm();
    const { isAuthenticated, isLoading , login} = useAuth();
      const router = useRouter();

      useEffect(() => {
        if (!isLoading && isAuthenticated) {
          router.replace('/(home)'); 
        }
      }, [isAuthenticated, isLoading]);

  const onSubmit = async (data: SignInFormData) => {
    try {
      await login(data.email,data.password);
    } catch (error) {
      console.error('Error ao fazer login',error)
    }
  };

    return (
        <AuthLayout
      title="Bem Vindo"
      subtitle="Digite suas credencias e comece sua jornada, e conte conosco para qualquer coisa"
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

      {/* Forgot Password */}
      <TouchableOpacity className='items-end mb-6'>
        <Text className='text-blue-600'>Esqueceu sua senha?</Text>
      </TouchableOpacity>

      {/* Sign In Button */}
      <Button title="Entrar" onPress={handleSubmit(onSubmit)} />

      {/* Sign Up Link */}
      <View className='flex-row justify-center mt-4'>
        <Text className='text-gray-500'>Ainda não tem uma conta? </Text>
        <Link asChild href={'/(auth)/register'}>
        <TouchableOpacity>
          <Text className='text-blue-600'>Cadastar-se</Text>
        </TouchableOpacity>
        </Link>
      </View>
    </AuthLayout>
    );
}