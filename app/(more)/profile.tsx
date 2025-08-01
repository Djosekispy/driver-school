import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, Image, Alert, ScrollView, ActivityIndicator, KeyboardAvoidingView, Platform } from 'react-native';
import { AntDesign, MaterialIcons, Feather, FontAwesome, Ionicons } from '@expo/vector-icons';
import { COLORS } from '@/hooks/useColors';
import { useRouter } from 'expo-router';
import { useAuth } from '@/context/AuthContext';
import { UserRole } from '@/types/User';
import * as ImagePicker from 'expo-image-picker';
import { getDownloadURL, getStorage, ref, uploadBytes } from 'firebase/storage';

enum UserRoleEnum {
  STUDENT = 'normal',
  ADMIN = 'admin'
}

const ProfileScreen = () => {
  const router = useRouter();
  const { user, logout, updatedUser } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [editedUser, setEditedUser] = useState({
    name: '',
    email: '',
    phone: '',
    address: ''
  });
  const [localImage, setLocalImage] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  // Inicializa os dados editáveis
  useEffect(() => {
    if (user) {
      setEditedUser({
        name: user.name || '',
        email: user.email || '',
        phone: user.phone || '',
        address: user.address || ''
      });
    }
  }, [user]);

  const firestoreTimestampToRelativeTime = (timestampObj: any): string => {
    if (!timestampObj?.seconds || !timestampObj?.nanoseconds) {
      return 'Data inválida';
    }

    const timestampDate = new Date(
      timestampObj.seconds * 1000 + timestampObj.nanoseconds / 1_000_000
    );
    const now = new Date();
    const diffMs = now.getTime() - timestampDate.getTime();

    const seconds = Math.floor(diffMs / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);
    const months = Math.floor(days / 30);
    const years = Math.floor(days / 365);

    if (seconds < 60) return `há ${seconds} segundo${seconds !== 1 ? 's' : ''}`;
    if (minutes < 60) return `há ${minutes} minuto${minutes !== 1 ? 's' : ''}`;
    if (hours < 24) return `há ${hours} hora${hours !== 1 ? 's' : ''}`;
    if (days < 30) return `há ${days} dia${days !== 1 ? 's' : ''}`;
    if (months < 12) return `há ${months} mês${months !== 1 ? 'es' : ''}`;
    return `há ${years} ano${years !== 1 ? 's' : ''}`;
  };

  const getRoleLabel = (role: UserRole) => {
    const roles = {
      [UserRoleEnum.STUDENT]: 'Aluno',
      [UserRoleEnum.ADMIN]: 'Administrador'
    };
    return roles[role] || role;
  };

  const pickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permissão necessária', 'Precisamos acessar sua galeria para selecionar uma imagem');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.7,
    });

    if (!result.canceled && result.assets.length > 0) {
      const imageUri = result.assets[0].uri;
      setLocalImage(imageUri);
      await uploadImageToFirebase(imageUri);
    }
  };

  const uploadImageToFirebase = async (uri: string) => {
    if (!uri) {
      Alert.alert('Erro', 'Imagem inválida ou não selecionada.');
      return;
    }

    setIsUploading(true);
    try {
      const response = await fetch(uri);
      const blob = await response.blob();

      const timestamp = Date.now();
      const storage = getStorage();
      const storageRef = ref(storage, `profile/avatar_${timestamp}.jpg`);

      const snapshot = await uploadBytes(storageRef, blob);
      const downloadURL = await getDownloadURL(snapshot.ref);

      await updatedUser({ avatarUrl: downloadURL });
      setLocalImage(null); // Reset local image after successful upload

    } catch (error: any) {
      console.error('Erro no upload:', error);
      Alert.alert('Erro no upload', error.message || 'Falha ao enviar a imagem para o Firebase');
    } finally {
      setIsUploading(false);
    }
  };

  const handleSave = async () => {
    try {
      await updatedUser(editedUser);
      setIsEditing(false);
    } catch (error) {
      Alert.alert('Erro', 'Não foi possível salvar as alterações');
      console.error(error);
    }
  };

  const handleLogout = () => {
    Alert.alert(
      'Sair da Conta',
      'Tem certeza que deseja sair da sua conta?',
      [
        { text: 'Cancelar', style: 'cancel' },
        { text: 'Sair', onPress: () => logout() }
      ]
    );
  };

  return (
    <View className="flex-1" style={{ backgroundColor: COLORS.background }}>
      {/* Cabeçalho */}
      <View className="flex-row items-center justify-between px-4 py-3 border-b" style={{ borderColor: COLORS.border }}>
        <TouchableOpacity onPress={() => router.back()}>
          <AntDesign name="arrowleft" size={24} color={COLORS.primary} />
        </TouchableOpacity>
        
        <Text className="text-xl font-bold" style={{ color: COLORS.primary }}>
          {isEditing ? 'Editar Perfil' : 'Meu Perfil'}
        </Text>
        
        {isEditing ? (
          <TouchableOpacity onPress={handleSave}>
            <Text className="text-base font-medium" style={{ color: COLORS.primary }}>
              Salvar
            </Text>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity onPress={() => setIsEditing(true)}>
            <Feather name="edit" size={20} color={COLORS.primary} />
          </TouchableOpacity>
        )}
      </View>
  <KeyboardAvoidingView
      style={{ flex: 1, backgroundColor: COLORS.background }}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 60 : 0}
    >
      <ScrollView className="flex-1" contentContainerStyle={{ paddingBottom: 30 }}>
       
        {/* Seção do perfil */}
        <View className="items-center px-4 py-8">
          <View className="relative mb-4">
            <Image 
              source={{ uri: localImage || user?.avatarUrl }} 
              className="w-32 h-32 rounded-full"
            />
            <TouchableOpacity 
              className="absolute bottom-0 right-0 bg-white p-2 rounded-full border"
              style={{ borderColor: COLORS.border }}
              onPress={pickImage}
            >
              {isUploading ? (
                <ActivityIndicator size="small" color={COLORS.primary} />
              ) : (
                <MaterialIcons name="photo-camera" size={20} color={COLORS.primary} />
              )}
            </TouchableOpacity>
          </View>

          {isEditing ? (
            <TextInput
              className="text-2xl font-bold text-center mb-1 p-2 border rounded-lg"
              style={{ color: COLORS.text, borderColor: COLORS.border }}
              value={editedUser.name}
              onChangeText={(text) => setEditedUser({...editedUser, name: text})}
            />
          ) : (
            <Text className="text-2xl font-bold mb-1" style={{ color: COLORS.text }}>
              {user?.name}
            </Text>
          )}

          <View className="flex-row items-center mb-4">
            <View 
              className="px-2 py-1 rounded-md mr-2"
              style={{ backgroundColor: COLORS.yellowLighten5 }}
            >
              <Text className="text-xs font-medium" style={{ color: COLORS.primary }}>
                {getRoleLabel(user?.role as UserRole)}
              </Text>
            </View>
            <Text className="text-sm" style={{ color: COLORS.textLight }}>
              Membro desde {firestoreTimestampToRelativeTime(user?.createdAt)}
            </Text>
          </View>
        </View>

        {/* Informações do usuário */}
        <View className="px-5 mb-6">
          <View className="border rounded-lg overflow-hidden" style={{ borderColor: COLORS.border }}>
            {/* E-mail */}
            <View className="flex-row items-center p-4 border-b" style={{ borderColor: COLORS.border }}>
              <MaterialIcons name="email" size={22} color={COLORS.textLight} />
              <View className="ml-4 flex-1">
                <Text className="text-sm" style={{ color: COLORS.textLight }}>
                  E-mail
                </Text>
                {isEditing ? (
                  <TextInput
                    className="text-base mt-1 p-2 border rounded-lg"
                    style={{ color: COLORS.text, borderColor: COLORS.border }}
                    value={editedUser.email}
                    onChangeText={(text) => setEditedUser({...editedUser, email: text})}
                    keyboardType="email-address"
                  />
                ) : (
                  <Text className="text-base mt-1" style={{ color: COLORS.text }}>
                    {user?.email}
                  </Text>
                )}
              </View>
            </View>

            {/* Telefone */}
            <View className="flex-row items-center p-4 border-b" style={{ borderColor: COLORS.border }}>
              <Feather name="phone" size={22} color={COLORS.textLight} />
              <View className="ml-4 flex-1">
                <Text className="text-sm" style={{ color: COLORS.textLight }}>
                  Telefone
                </Text>
                {isEditing ? (
                  <TextInput
                    className="text-base mt-1 p-2 border rounded-lg"
                    style={{ color: COLORS.text, borderColor: COLORS.border }}
                    value={editedUser.phone}
                    onChangeText={(text) => setEditedUser({...editedUser, phone: text})}
                    keyboardType="phone-pad"
                    placeholder="+244 XXX XXX XXX"
                  />
                ) : (
                  <Text className="text-base mt-1" style={{ color: COLORS.text }}>
                    {user?.phone || 'Não informado'}
                  </Text>
                )}
              </View>
            </View>

            {/* Endereço */}
            <View className="flex-row items-center p-4" style={{ borderColor: COLORS.border }}>
              <FontAwesome name="map-marker" size={22} color={COLORS.textLight} />
              <View className="ml-4 flex-1">
                <Text className="text-sm" style={{ color: COLORS.textLight }}>
                  Endereço
                </Text>
                {isEditing ? (
                  <TextInput
                    className="text-base mt-1 p-2 border rounded-lg"
                    style={{ color: COLORS.text, borderColor: COLORS.border }}
                    value={editedUser.address}
                    onChangeText={(text) => setEditedUser({...editedUser, address: text})}
                    placeholder="Digite seu endereço"
                  />
                ) : (
                  <Text className="text-base mt-1" style={{ color: COLORS.text }}>
                    {user?.address || 'Não informado'}
                  </Text>
                )}
              </View>
            </View>
          </View>
        </View>

        {/* Configurações de conta */}
        {!isEditing && (
          <View className="px-5 mb-6">
            <Text className="text-lg font-semibold mb-3" style={{ color: COLORS.primary }}>
              Configurações da Conta
            </Text>
            <View className="border rounded-lg overflow-hidden" style={{ borderColor: COLORS.border }}>
              <TouchableOpacity 
                className="flex-row items-center justify-between p-4 border-b" 
                style={{ borderColor: COLORS.border }}
                onPress={() => router.push('/(more)/changePassword')}
              >
                <View className="flex-row items-center">
                  <MaterialIcons name="lock" size={22} color={COLORS.text} />
                  <Text className="text-base ml-4" style={{ color: COLORS.text }}>
                    Alterar Senha
                  </Text>
                </View>
                <AntDesign name="right" size={16} color={COLORS.textLight} />
              </TouchableOpacity>

              <TouchableOpacity 
                className="flex-row items-center justify-between p-4" 
                onPress={handleLogout}
              >
                <View className="flex-row items-center">
                  <MaterialIcons name="logout" size={22} color="#e74c3c" />
                  <Text className="text-base ml-4" style={{ color: "#e74c3c" }}>
                    Sair da Conta
                  </Text>
                </View>
                <AntDesign name="right" size={16} color="#e74c3c" />
              </TouchableOpacity>
            </View>
          </View>
        )}
      </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
};

export default ProfileScreen;