import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert, ScrollView } from 'react-native';
import { AntDesign, MaterialIcons } from '@expo/vector-icons';
import { COLORS } from '@/hooks/useColors';
import { useRouter } from 'expo-router';
import { useAuth } from '@/context/AuthContext';

const ChangePasswordScreen = () => {
  const router = useRouter();
  const { changePassword } = useAuth();
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleChangePassword = async () => {
    if (!currentPassword || !newPassword || !confirmPassword) {
      Alert.alert('Erro', 'Por favor, preencha todos os campos');
      return;
    }

    if (newPassword !== confirmPassword) {
      Alert.alert('Erro', 'As novas senhas não coincidem');
      return;
    }

    if (newPassword.length < 6) {
      Alert.alert('Erro', 'A senha deve ter pelo menos 6 caracteres');
      return;
    }

    setLoading(true);
    try {
      await changePassword(newPassword);
      router.back();
    } catch (error: any) {
      console.error('Erro ao alterar senha:', error);
      Alert.alert('Erro', error.message || 'Falha ao alterar a senha');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View className="flex-1" style={{ backgroundColor: COLORS.background }}>
      {/* Cabeçalho */}
      <View className="flex-row items-center px-4 py-3 border-b" style={{ borderColor: COLORS.border }}>
        <TouchableOpacity onPress={() => router.back()}>
          <AntDesign name="arrowleft" size={24} color={COLORS.primary} />
        </TouchableOpacity>
        <Text className="text-xl font-bold flex-1 text-center" style={{ color: COLORS.primary }}>
          Alterar Senha
        </Text>
        <View className="w-8" />
      </View>

      <ScrollView className="flex-1 px-4 py-6" contentContainerStyle={{ paddingBottom: 30 }}>
        <Text className="text-base mb-6 text-center" style={{ color: COLORS.text }}>
          Por segurança, digite sua senha atual e a nova senha desejada
        </Text>

        {/* Senha Atual */}
        <View className="mb-4">
          <Text className="text-sm mb-1" style={{ color: COLORS.textLight }}>
            Senha Atual
          </Text>
          <View className="relative">
            <TextInput
              className="p-3 border rounded-lg pr-10"
              style={{ 
                borderColor: COLORS.border,
                color: COLORS.text
              }}
              placeholder="Digite sua senha atual"
              placeholderTextColor={COLORS.textLight}
              secureTextEntry={!showCurrentPassword}
              value={currentPassword}
              onChangeText={setCurrentPassword}
            />
            <TouchableOpacity
              className="absolute right-3 top-3"
              onPress={() => setShowCurrentPassword(!showCurrentPassword)}
            >
              <MaterialIcons 
                name={showCurrentPassword ? 'visibility-off' : 'visibility'} 
                size={22} 
                color={COLORS.textLight} 
              />
            </TouchableOpacity>
          </View>
        </View>

        {/* Nova Senha */}
        <View className="mb-4">
          <Text className="text-sm mb-1" style={{ color: COLORS.textLight }}>
            Nova Senha
          </Text>
          <View className="relative">
            <TextInput
              className="p-3 border rounded-lg pr-10"
              style={{ 
                borderColor: COLORS.border,
                color: COLORS.text
              }}
              placeholder="Digite a nova senha"
              placeholderTextColor={COLORS.textLight}
              secureTextEntry={!showNewPassword}
              value={newPassword}
              onChangeText={setNewPassword}
            />
            <TouchableOpacity
              className="absolute right-3 top-3"
              onPress={() => setShowNewPassword(!showNewPassword)}
            >
              <MaterialIcons 
                name={showNewPassword ? 'visibility-off' : 'visibility'} 
                size={22} 
                color={COLORS.textLight} 
              />
            </TouchableOpacity>
          </View>
          <Text className="text-xs mt-1" style={{ color: COLORS.textLight }}>
            Mínimo de 6 caracteres
          </Text>
        </View>

        {/* Confirmar Nova Senha */}
        <View className="mb-6">
          <Text className="text-sm mb-1" style={{ color: COLORS.textLight }}>
            Confirmar Nova Senha
          </Text>
          <View className="relative">
            <TextInput
              className="p-3 border rounded-lg pr-10"
              style={{ 
                borderColor: COLORS.border,
                color: COLORS.text
              }}
              placeholder="Confirme a nova senha"
              placeholderTextColor={COLORS.textLight}
              secureTextEntry={!showConfirmPassword}
              value={confirmPassword}
              onChangeText={setConfirmPassword}
            />
            <TouchableOpacity
              className="absolute right-3 top-3"
              onPress={() => setShowConfirmPassword(!showConfirmPassword)}
            >
              <MaterialIcons 
                name={showConfirmPassword ? 'visibility-off' : 'visibility'} 
                size={22} 
                color={COLORS.textLight} 
              />
            </TouchableOpacity>
          </View>
        </View>

        {/* Botão de Salvar */}
        <TouchableOpacity
          className="py-3 rounded-lg items-center justify-center"
          style={{ backgroundColor: COLORS.primary }}
          onPress={handleChangePassword}
          disabled={loading}
        >
          {loading ? (
            <View className="flex-row items-center">
              <Text className="text-white font-medium mr-2">Processando...</Text>
            </View>
          ) : (
            <Text className="text-white font-medium">Alterar Senha</Text>
          )}
        </TouchableOpacity>

        {/* Dicas de segurança */}
        <View className="mt-8 p-4 rounded-lg" style={{ backgroundColor: COLORS.yellowLighten5 }}>
          <Text className="font-semibold mb-2" style={{ color: COLORS.primary }}>
            Dicas para uma senha segura:
          </Text>
          <View className="flex-row items-start mb-1">
            <MaterialIcons name="check-circle" size={16} color={COLORS.primary} style={{ marginTop: 2, marginRight: 6 }} />
            <Text className="text-sm flex-1" style={{ color: COLORS.text }}>
              Use pelo menos 6 caracteres
            </Text>
          </View>
          <View className="flex-row items-start mb-1">
            <MaterialIcons name="check-circle" size={16} color={COLORS.primary} style={{ marginTop: 2, marginRight: 6 }} />
            <Text className="text-sm flex-1" style={{ color: COLORS.text }}>
              Combine letras, números e símbolos
            </Text>
          </View>
          <View className="flex-row items-start">
            <MaterialIcons name="check-circle" size={16} color={COLORS.primary} style={{ marginTop: 2, marginRight: 6 }} />
            <Text className="text-sm flex-1" style={{ color: COLORS.text }}>
              Evite informações pessoais óbvias
            </Text>
          </View>
        </View>
      </ScrollView>
    </View>
  );
};

export default ChangePasswordScreen;