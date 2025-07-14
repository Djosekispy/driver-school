import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { AuthLayout } from '@/components/auth/layout/AuthLayout';
import { Input } from '@/components/auth/ui/Input';
import { Button } from '@/components/auth/ui/Button';
import { SocialButton } from '@/components/auth/ui/SocialButton';
import { useAuthForm } from '@/components/auth/hooks/useAuthForm';
import { SignInFormData } from '@/components/auth/types/auth';
import Entypo from '@expo/vector-icons/Entypo';
import AntDesign from '@expo/vector-icons/AntDesign';

export default function Login(){
     const { control, handleSubmit, errors } = useAuthForm();

  const onSubmit = (data: SignInFormData) => {
    console.log(data);
    // Handle sign in logic here
  };

    return (
        <AuthLayout
      title="Sign In"
      subtitle="It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum."
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
        <Text className='px-4 text-gray-500'>Or</Text>
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
        <Text className='text-blue-600'>Forget Password?</Text>
      </TouchableOpacity>

      {/* Sign In Button */}
      <Button title="Log In" onPress={handleSubmit(onSubmit)} />

      {/* Sign Up Link */}
      <View className='flex-row justify-center mt-4'>
        <Text className='text-gray-500'>Don't have account? </Text>
        <TouchableOpacity>
          <Text className='text-blue-600'>Sign Up</Text>
        </TouchableOpacity>
      </View>
    </AuthLayout>
    );
}