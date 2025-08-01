import React, { useEffect, useRef, useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Animated,
  Alert,
} from 'react-native';
import { Input } from '@/components/auth/ui/Input';
import { useForm } from 'react-hook-form';
import { COLORS } from '@/hooks/useColors';
import { Link, useRouter } from 'expo-router';
import { ArrowLeft } from 'lucide-react-native';
import { sendPasswordResetEmail } from 'firebase/auth';
import { auth } from '@/firebase/firebase';

type ForgotPasswordFormData = {
  email: string;
};

export default function ForgotPassword() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const { control, handleSubmit, formState: { errors } } = useForm<ForgotPasswordFormData>();
 
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(30)).current;

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

const onSubmit = async (data: ForgotPasswordFormData) => {
  try {
    setIsLoading(true);
    // Envia o email de redefinição de senha
    await sendPasswordResetEmail(auth, data.email);
    
    Alert.alert(
      'Email enviado',
      'Verifique sua caixa de entrada para as instruções de redefinição de senha. ' +
      'Se não encontrar na caixa principal, verifique a pasta de spam.',
      [{ text: 'OK', onPress: () => router.back() }]
    );
  } catch (error: any) {
    let errorMessage = 'Ocorreu um erro ao enviar o email de recuperação';
    
    // Tratamento de erros específicos do Firebase
    switch (error.code) {
      case 'auth/user-not-found':
        errorMessage = 'Nenhuma conta encontrada com este email';
        break;
      case 'auth/invalid-email':
        errorMessage = 'Email inválido';
        break;
      case 'auth/too-many-requests':
        errorMessage = 'Muitas tentativas. Tente novamente mais tarde';
        break;
    }
    
    Alert.alert('Erro', errorMessage);
  } finally {
    setIsLoading(false);
  }
};

  return (
    <ScrollView
      contentContainerStyle={{
        flexGrow: 1,
        backgroundColor: COLORS.background,
        padding: 24,
      }}
      showsVerticalScrollIndicator={false}
      keyboardShouldPersistTaps="handled"
    >
                {/* Botão de voltar */}
        <TouchableOpacity 
          onPress={() => router.back()}
          className="mb-6 self-start"
          activeOpacity={0.7}
        >
          <ArrowLeft size={24} color={COLORS.text} />
        </TouchableOpacity>
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
          {/* Cabeçalho */}
          <View className="mb-8">
            <Text
              style={{
                fontSize: 26,
                fontWeight: '700',
                color: COLORS.primary,
                marginBottom: 8,
              }}
            >
              Redefinir senha
            </Text>
            <Text
              style={{
                fontSize: 16,
                color: COLORS.textLight,
              }}
            >
              Digite o email associado à sua conta para receber as instruções de redefinição de senha.
            </Text>
          </View>

          {/* Formulário */}
          <Input
            control={control}
            name="email"
            placeholder="seu@email.com"
            error={errors.email}
          />

          {/* Botão de envio */}
          <TouchableOpacity
            activeOpacity={0.8}
            className="justify-center items-center p-4 rounded-md my-4"
            style={{ backgroundColor: COLORS.primary }}
            onPress={handleSubmit(onSubmit)}
            disabled={isLoading}
          >
            <Text className="text-lg font-semibold" style={{ color: COLORS.surface }}>
              {isLoading ? 'Enviando...' : 'Enviar instruções'}
            </Text>
          </TouchableOpacity>

          {/* Link para voltar ao login */}
          <View className="flex-row justify-center mt-4">
            <Text className="text-gray-500">Lembrou sua senha? </Text>
            <Link asChild href="/(auth)/login">
              <TouchableOpacity>
                <Text style={{ color: COLORS.primary, fontWeight: '600' }}>
                  Fazer login
                </Text>
              </TouchableOpacity>
            </Link>
          </View>
        </Animated.View>
      </KeyboardAvoidingView>
    </ScrollView>
  );
}