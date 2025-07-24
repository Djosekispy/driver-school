import React from 'react';
import {
  View,
  Text,
  KeyboardAvoidingView,
  ScrollView,
  TouchableOpacity,
  Platform,
} from 'react-native';
import { Input } from '@/components/auth/ui/Input';
import { Button } from '@/components/auth/ui/Button';
import { SocialButton } from '@/components/auth/ui/SocialButton';
import { SignInFormData, SignUpFormData } from '@/components/auth/types/auth';
import Entypo from '@expo/vector-icons/Entypo';
import AntDesign from '@expo/vector-icons/AntDesign';
import { registerAuthForm } from '@/components/auth/hooks/registerAuth';
import { Link, useRouter } from 'expo-router';
import { COLORS } from '@/hooks/useColors';
import { useAuth } from '@/context/AuthContext';

export default function Register() {
  const { control, handleSubmit, errors } = registerAuthForm();
  const { isLoading, register } = useAuth()
  const router = useRouter()

  const onSubmit = async (data: SignUpFormData) => {
    try {
      await register(data,data.password);

      router.push({pathname : '/(auth)/login', params : { email : data.email, password : data.password}})
    } catch (error) {
      
    console.log(error);
    }
  };

  return (
    <ScrollView
      className="flex-1"
      style={{ backgroundColor: COLORS.background }}
      showsVerticalScrollIndicator={false}
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        className="flex-1 justify-center items-center px-6 py-12"
      >
        <View className="w-full max-w-md">

          {/* Título e subtítulo */}
          <View className="items-center mb-8">
            <Text className="text-3xl font-bold mb-2 text-center" style={{ color: COLORS.primary }}>
              Criar Conta
            </Text>
            <Text className="text-center" style={{ color: COLORS.textLight }}>
              Bem-vindo a esta jornada e fique pronto para explorar as dezenas de surpresas que preparamos para si!
            </Text>
          </View>

          {/* Botões de login social */}
         <View className="flex-row justify-center gap-4 mb-6">
            <SocialButton
              icon={<Entypo name="facebook-with-circle" size={24} color="black" />}
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
          <View className="flex-row items-center my-6">
            <View className="flex-1 h-px" style={{ backgroundColor: COLORS.border }} />
          <Text className="px-4 text-gray-500">ou</Text>
            <View className="flex-1 h-px" style={{ backgroundColor: COLORS.border }} />
          </View>

          {/* Campos de entrada */}
          <Input
            control={control}
            name="name"
            placeholder="Digite seu nome"
            error={errors.name}
          />
          <Input
            control={control}
            name="email"
            placeholder="alphainvent@gmail.com"
            error={errors.email}
          />
          <Input
            control={control}
            name="password"
            placeholder="••••••••"
            error={errors.password}
            secureTextEntry
          />

          {/* Botão de registro */}

              <TouchableOpacity
                      activeOpacity={0.8}
                      className="justify-center items-center p-4 rounded-md mb-4"
                      style={{ backgroundColor: COLORS.primary }}
                      onPress={handleSubmit(onSubmit)}
                    >
                      <Text className="text-lg font-semibold" style={{ color: COLORS.surface }}>
                        Registrar
                      </Text>
                    </TouchableOpacity>

          {/* Link para login */}
          <View className="flex-row justify-center mt-6">
            <Text className="text-gray-500">Já tens uma conta? </Text>
            <Link asChild href="/(auth)/login">
              <TouchableOpacity>
                   <Text style={{ color: COLORS.primary, fontWeight: '600' }}>Entrar</Text>
              </TouchableOpacity>
            </Link>
          </View>

        </View>
      </KeyboardAvoidingView>
    </ScrollView>
  );
}
