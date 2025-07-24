import React, { useState, useRef } from 'react';
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
import YoutubePlayer from 'react-native-youtube-iframe';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { Category } from '../types/admin';
import { db } from '@/firebase/firebase';

const videoCategories: Category[] = [
  { id: 'teoria', name: 'Teoria de Condução' },
  { id: 'pratica', name: 'Prática de Direção' },
  { id: 'seguranca', name: 'Segurança e Sinalização' }
];

const extractYouTubeId = (url: string) => {
  const regExp = /(?:youtube\.com.*(?:\?|&)v=|youtu\.be\/)([a-zA-Z0-9_-]+)/;
  const match = url.match(regExp);
  return match ? match[1] : null;
};

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

  const handleSubmit = async () => {
    const { title, categoryId, videoUrl } = formData;
    if (!title || !categoryId || !videoUrl) {
      Alert.alert('Campos obrigatórios', 'Preencha todos os campos marcados com *');
      return;
    }

    const youtubeId = extractYouTubeId(videoUrl);
    if (!youtubeId) {
      Alert.alert('Link inválido', 'Certifique-se de colar uma URL válida do YouTube.');
      return;
    }

    setIsLoading(true);
    try {
      await addDoc(collection(db, 'video_lessons'), {
        ...formData,
        createdAt: serverTimestamp(),
        youtubeId
      });

      Alert.alert('Sucesso', 'Videoaula salva com sucesso!');
      router.back();
    } catch (error) {
      console.error('Erro ao salvar vídeo:', error);
      Alert.alert('Erro', 'Falha ao salvar a videoaula.');
    } finally {
      setIsLoading(false);
    }
  };

  const youtubeId = extractYouTubeId(formData.videoUrl);

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      className="flex-1"
      style={{ backgroundColor: COLORS.background }}
    >
      {/* Header */}
      <View
        className="flex-row items-center justify-between px-4 pt-12 pb-4 border-b"
        style={{
          backgroundColor: COLORS.surface,
          borderBottomColor: COLORS.border
        }}
      >
        <TouchableOpacity onPress={() => router.back()} className="p-2 mr-2">
          <Feather name="arrow-left" size={24} color={COLORS.text} />
        </TouchableOpacity>
        <Text className="text-lg font-semibold flex-1 text-center" style={{ color: COLORS.text }}>
          Nova Videoaula
        </Text>
        <View className="w-10" />
      </View>

      <ScrollView className="px-4" contentContainerStyle={{ paddingBottom: 400 }}>
        {/* Título */}
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
            placeholder="Ex: Como estacionar corretamente"
            placeholderTextColor={COLORS.textLight}
          />
        </View>

        {/* Categoria */}
        <View className="mb-4">
          <CategorySelector
            categories={videoCategories}
            selectedId={formData.categoryId}
            onSelect={(id) => setFormData({ ...formData, categoryId: id })}
          />
        </View>

        {/* URL */}
        <View className="mb-4">
          <Text className="text-sm font-medium mb-2" style={{ color: COLORS.text }}>
            URL do Vídeo *
          </Text>
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
          />
        </View>

        {/* Preview do YouTube */}
        {youtubeId && (
          <View className="mb-6 rounded-xl overflow-hidden" style={{ height: 200 }}>
            <YoutubePlayer
              height={200}
              play={false}
              videoId={youtubeId}
            />
          </View>
        )}

        {/* Descrição */}
        <View className="mb-6">
          <Text className="text-sm font-medium mb-2" style={{ color: COLORS.text }}>
            Descrição
          </Text>
          <TextInput
            className="p-4 rounded-xl min-h-[120px]"
            style={{
              backgroundColor: COLORS.surface,
              color: COLORS.text,
              borderColor: COLORS.border,
              borderWidth: 1,
              textAlignVertical: 'top'
            }}
            value={formData.description}
            onChangeText={(text) => setFormData({ ...formData, description: text })}
            placeholder="Detalhe o conteúdo abordado na aula..."
            placeholderTextColor={COLORS.textLight}
            multiline
          />
        </View>
      </ScrollView>

      {/* Botão de salvar */}
      <View className="absolute bottom-0 left-0 right-0 p-4 border-t" style={{ backgroundColor: COLORS.surface, borderTopColor: COLORS.border }}>
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
            <ActivityIndicator color="#fff" />
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
