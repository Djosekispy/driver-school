import React, { useEffect, useRef } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Animated,
} from 'react-native';
import { Input } from '@/components/auth/ui/Input';
import { SocialButton } from '@/components/auth/ui/SocialButton';
import Entypo from '@expo/vector-icons/Entypo';
import AntDesign from '@expo/vector-icons/AntDesign';
import { useAuthForm } from '@/components/auth/hooks/useAuthForm';
import { SignInFormData } from '@/components/auth/types/auth';
import { Link, useLocalSearchParams, useRouter } from 'expo-router';
import { useAuth } from '@/context/AuthContext';
import { COLORS } from '@/hooks/useColors';

export default function Login() {
 
  const { isAuthenticated, isLoading, login } = useAuth();
  const {email, password } = useLocalSearchParams<{email : string, password : string}>();
  const router = useRouter();
   const { control, handleSubmit, errors } = useAuthForm({email, password});

  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(30)).current;

  useEffect(() => {
    if (!isLoading && isAuthenticated) {
      router.replace('/(home)');
    }
  }, [isAuthenticated, isLoading]);

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 600,
        useNativeDriver: true,
      }),
      Animated.spring(slideAnim, {
        toValue: 0,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  const onSubmit = async (data: SignInFormData) => {
    try {
      await login(data.email, data.password);
    } catch (error) {
      console.error('Erro ao fazer login', error);
    }
  };

  return (
    <ScrollView
      contentContainerStyle={{
        flexGrow: 1,
        backgroundColor: COLORS.background,
        justifyContent: 'center',
        padding: 24,
      }}
      showsVerticalScrollIndicator={false}
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        className="flex-1 justify-center"
      >
        <Animated.View
          style={{
            opacity: fadeAnim,
            transform: [{ translateY: slideAnim }],
          }}
        >
          {/* Mensagem de boas-vindas */}
          <View className="mb-8 items-center">
            <Text
              style={{
                fontSize: 26,
                fontWeight: '700',
                color: COLORS.primary,
                marginBottom: 8,
              }}
            >
              Bem-vindo!
            </Text>
            <Text
              style={{
                fontSize: 16,
                textAlign: 'center',
                color: COLORS.textLight,
                paddingHorizontal: 10,
              }}
            >
              Digite suas credenciais e comece sua jornada. Conte conosco para o que precisar.
            </Text>
          </View>

          {/* Social Buttons */}
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
          <View className="flex-row items-center mb-6">
            <View className="flex-1 h-px bg-gray-300" />
            <Text className="px-4 text-gray-500">ou</Text>
            <View className="flex-1 h-px bg-gray-300" />
          </View>

          {/* Form Inputs */}
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

          {/* Forgot Password */}
          <TouchableOpacity className="items-end mb-4">
            <Text style={{ color: COLORS.primary, fontWeight: '500' }}>
              Esqueceu sua senha?
            </Text>
          </TouchableOpacity>

          {/* Submit Button */}
          <TouchableOpacity
            activeOpacity={0.8}
            className="justify-center items-center p-4 rounded-md mb-4"
            style={{ backgroundColor: COLORS.primary }}
            onPress={handleSubmit(onSubmit)}
          >
            <Text className="text-lg font-semibold" style={{ color: COLORS.surface }}>
              Entrar
            </Text>
          </TouchableOpacity>

          {/* Sign Up Link */}
          <View className="flex-row justify-center mt-2">
            <Text className="text-gray-500">Ainda não tem uma conta? </Text>
            <Link asChild href="/(auth)/register">
              <TouchableOpacity>
                <Text style={{ color: COLORS.primary, fontWeight: '600' }}>
                  Cadastrar-se
                </Text>
              </TouchableOpacity>
            </Link>
          </View>
        </Animated.View>
      </KeyboardAvoidingView>
    </ScrollView>
  );
}
