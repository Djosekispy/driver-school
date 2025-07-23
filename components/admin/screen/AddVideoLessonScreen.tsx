import React, { useState } from 'react';
import { 
  View, 
  Text, 
  TextInput, 
  TouchableOpacity, 
  ScrollView, 
  Alert, 
  ActivityIndicator, 
  KeyboardAvoidingView,
  Platform
} from 'react-native';
import { Feather, MaterialCommunityIcons, AntDesign } from '@expo/vector-icons';
import { COLORS } from '@/hooks/useColors';
import { useRouter } from 'expo-router';
import CategorySelector from '../ui/CategorySelector';
import { Category } from '../types/admin';
import { mockCategories } from '../data/admin.mock';

const AddVideoLessonScreen = () => {
  const router = useRouter();
  const [formData, setFormData] = useState({
    title: '',
    categoryId: '',
    description: '',
    videoUrl: '',
    duration: ''
  });
  const [isLoading, setIsLoading] = useState(false);

  const videoCategories: Category[] = mockCategories || [
    { id: '1', name: 'Matemática' },
    { id: '2', name: 'Português' },
    { id: '3', name: 'Ciências' },
    { id: '4', name: 'História' },
    { id: '5', name: 'Geografia' },
  ];

  const handleSubmit = async () => {
    if (!formData.title || !formData.categoryId || !formData.videoUrl) {
      Alert.alert('Campos obrigatórios', 'Preencha todos os campos marcados com *');
      return;
    }

    if (!formData.videoUrl.startsWith('http')) {
      Alert.alert('URL inválida', 'A URL do vídeo deve começar com http ou https');
      return;
    }

    setIsLoading(true);

    try {
      // Simulação de chamada à API
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      Alert.alert('Sucesso', 'Videoaula adicionada com sucesso!');
      router.back();
    } catch (error) {
      console.error('Erro ao adicionar videoaula:', error);
      Alert.alert('Erro', 'Não foi possível salvar a videoaula');
    } finally {
      setIsLoading(false);
    }
  };

  return (
      <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      className="flex-1"
      style={{ backgroundColor: COLORS.background }}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 60 : 0}
    >
      {/* Header */}
      <View className="flex-row items-center justify-between px-4 pt-12 pb-4 border-b" 
        style={{ 
          backgroundColor: COLORS.surface,
          borderBottomColor: COLORS.border 
        }}>
        <TouchableOpacity 
          onPress={() => router.back()}
          className="p-2 mr-2"
        >
          <Feather name="arrow-left" size={24} color={COLORS.text} />
        </TouchableOpacity>
        <Text className="text-lg font-semibold flex-1 text-center" style={{ color: COLORS.text }}>
          Nova Videoaula
        </Text>
        <View className="w-10" />
      </View>

      <ScrollView 
        className="px-4"
        contentContainerStyle={{ paddingBottom: 100 }}
        keyboardShouldPersistTaps="handled"
      >
        {/* Seção de Informações Básicas */}
        <View className="mt-4">
          <Text className="text-sm font-medium mb-2" style={{ color: COLORS.text }}>
            Título *
          </Text>
          <TextInput
            className="p-4 rounded-xl mb-4"
            style={{ 
              backgroundColor: COLORS.surface,
              color: COLORS.text,
              borderColor: COLORS.border,
              borderWidth: 1
            }}
            value={formData.title}
            onChangeText={(text) => setFormData({ ...formData, title: text })}
            placeholder="Ex: Introdução à Álgebra"
            placeholderTextColor={COLORS.textLight}
            returnKeyType="next"
          />
        </View>

        {/* Seção de Categoria */}
        <View className="mb-4">
          <Text className="text-sm font-medium mb-2" style={{ color: COLORS.text }}>
            Categoria *
          </Text>
          <CategorySelector
            categories={videoCategories}
            selectedId={formData.categoryId}
            onSelect={(id) => setFormData({ ...formData, categoryId: id })}
          />
        </View>

        {/* Seção de URL do Vídeo */}
        <View className="mb-4">
          <Text className="text-sm font-medium mb-2" style={{ color: COLORS.text }}>
            URL do Vídeo *
          </Text>
          <View className="flex-row items-center mb-2">
            <MaterialCommunityIcons 
              name="video" 
              size={18} 
              color={COLORS.textLight} 
              style={{ marginRight: 8 }} 
            />
            <Text className="text-xs" style={{ color: COLORS.textLight }}>
              YouTube, Vimeo ou outro serviço de vídeo
            </Text>
          </View>
          <TextInput
            className="p-4 rounded-xl"
            style={{ 
              backgroundColor: COLORS.surface,
              color: COLORS.text,
              borderColor: COLORS.border,
              borderWidth: 1
            }}
            value={formData.videoUrl}
            onChangeText={(text) => setFormData({ ...formData, videoUrl: text })}
            placeholder="https://www.youtube.com/watch?v=..."
            placeholderTextColor={COLORS.textLight}
            keyboardType="url"
            returnKeyType="next"
          />
        </View>

        {/* Seção de Duração */}
        <View className="mb-4">
          <Text className="text-sm font-medium mb-2" style={{ color: COLORS.text }}>
            Duração
          </Text>
          <TextInput
            className="p-4 rounded-xl"
            style={{ 
              backgroundColor: COLORS.surface,
              color: COLORS.text,
              borderColor: COLORS.border,
              borderWidth: 1
            }}
            value={formData.duration}
            onChangeText={(text) => setFormData({ ...formData, duration: text })}
            placeholder="Ex: 15:30 ou 1h25m"
            placeholderTextColor={COLORS.textLight}
            returnKeyType="next"
          />
        </View>

        {/* Seção de Descrição */}
        <View className="mb-6">
          <Text className="text-sm font-medium mb-2" style={{ color: COLORS.text }}>
            Descrição
          </Text>
          <TextInput
            className="p-4 rounded-xl min-h-[120px] text-justify"
            style={{ 
              backgroundColor: COLORS.surface,
              color: COLORS.text,
              borderColor: COLORS.border,
              borderWidth: 1,
              textAlignVertical: 'top'
            }}
            value={formData.description}
            onChangeText={(text) => setFormData({ ...formData, description: text })}
            placeholder="Descreva o conteúdo da videoaula..."
            placeholderTextColor={COLORS.textLight}
            multiline
            returnKeyType="done"
          />
        </View>
      </ScrollView>

      {/* Botão de Salvar - Agora dentro do KeyboardAvoidingView mas fora do ScrollView */}
      <View className="absolute bottom-0 left-0 right-0 p-4 border-t" style={{ 
        backgroundColor: COLORS.surface,
        borderTopColor: COLORS.border
      }}>
        <TouchableOpacity
          className="flex-row justify-center items-center py-4 rounded-xl"
          style={{ 
            backgroundColor: COLORS.primary,
            opacity: (!formData.title || !formData.categoryId || !formData.videoUrl) ? 0.6 : 1
          }}
          onPress={handleSubmit}
          disabled={isLoading || !formData.title || !formData.categoryId || !formData.videoUrl}
        >
          {isLoading ? (
            <ActivityIndicator color="white" />
          ) : (
            <>
              <AntDesign name="save" size={20} color="white" />
              <Text className="text-white font-semibold ml-2">Salvar Videoaula</Text>
            </>
          )}
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
};

export default AddVideoLessonScreen;