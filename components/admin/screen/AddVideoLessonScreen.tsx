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
  Platform,
  Image
} from 'react-native';
import { Feather, MaterialCommunityIcons, AntDesign, Ionicons } from '@expo/vector-icons';
import { COLORS } from '@/hooks/useColors';
import { useRouter } from 'expo-router';
import CategorySelector from '../ui/CategorySelector';
import YoutubePlayer from 'react-native-youtube-iframe';
import { useFirebase } from '@/context/FirebaseContext';

const videoCategories = [
  { id: 'teórica', name: 'Teórica' },
  { id: 'prática', name: 'Prática' },
  { id: 'legislação', name: 'Legislação' }
];

const extractYouTubeId = (url: string) => {
  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
  const match = url.match(regExp);
  return (match && match[2].length === 11) ? match[2] : null;
};

const AddVideoLessonScreen = () => {
  const router = useRouter();
  const { addVideoLesson } = useFirebase();
  const [formData, setFormData] = useState({
    title: '',
    category: '',
    description: '',
    videoUrl: '',
    durationInMinutes: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const [isValidUrl, setIsValidUrl] = useState(false);
  const descriptionInputRef = React.useRef<TextInput>(null);


  const handleUrlChange = (text: string) => {
    setFormData({ ...formData, videoUrl: text });
    setIsValidUrl(extractYouTubeId(text) !== null);
  };

  const handleSubmit = async () => {
    if (!formData.title || !formData.category || !formData.videoUrl) {
      Alert.alert('Campos obrigatórios', 'Preencha todos os campos marcados com *');
      return;
    }

    if (!isValidUrl) {
      Alert.alert('Link inválido', 'Insira uma URL válida do YouTube');
      return;
    }

    setIsLoading(true);
    try {
      await addVideoLesson({
        title: formData.title,
        category: formData.category as any,
        description: formData.description,
        videoUrl: formData.videoUrl,
        durationInMinutes: formData.durationInMinutes ? parseInt(formData.durationInMinutes) : undefined,
        thumbnailUrl: `https://img.youtube.com/vi/${extractYouTubeId(formData.videoUrl)}/hqdefault.jpg`,
        createdBy: '001'
      });

      Alert.alert('Sucesso', 'Videoaula cadastrada com sucesso!', [
        { text: 'OK', onPress: () => router.back() }
      ]);
    } catch (error) {
      console.error('Erro ao salvar vídeo:', error);
      Alert.alert('Erro', 'Não foi possível salvar a videoaula');
    } finally {
      setIsLoading(false);
    }
  };

  const youtubeId = extractYouTubeId(formData.videoUrl);
  const thumbnailUrl = youtubeId ? `https://img.youtube.com/vi/${youtubeId}/hqdefault.jpg` : null;

  return (
 <KeyboardAvoidingView
          style={{ flex: 1, backgroundColor: COLORS.background }}
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          keyboardVerticalOffset={Platform.OS === 'ios' ? 60 : 30}
        >
      
        {/* Header */}
           <View className="flex-row items-center justify-between px-4 pt-4 pb-4 border-b" 
                  style={{ 
                    backgroundColor: COLORS.surface,
                    borderBottomColor: COLORS.border 
                  }}>
          <TouchableOpacity 
            onPress={() => router.back()} 
            className="p-2 rounded-full"
            style={{ backgroundColor: COLORS.yellowLighten4 }}
          >
            <Feather name="arrow-left" size={20} color={COLORS.yellowDarken4} />
          </TouchableOpacity>
          
          <Text className="text-lg font-bold" style={{ color: COLORS.text }}>
            Nova Aula em Video
          </Text>
          
          <View className="w-8" />
        </View>

       <ScrollView 
          contentContainerStyle={{ flexGrow: 2, justifyContent: 'center', paddingHorizontal: 10, paddingBottom: 428 }}
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}
      >
        {/* Preview Section */}
        {(youtubeId || formData.title) && (
          <View className="mb-6 rounded-xl overflow-hidden"
            style={{
              backgroundColor: COLORS.surface,
              shadowColor: COLORS.yellowDarken4,
              shadowOpacity: 0.1,
              shadowRadius: 8,
              elevation: 4
            }}
          >
            {/* Thumbnail */}
            <View className="h-40 bg-gray-200 relative">
              {youtubeId ? (
                <Image 
                  source={{ uri: thumbnailUrl }} 
                  className="w-full h-full"
                  resizeMode="cover"
                />
              ) : (
                <View className="flex-1 items-center justify-center"
                  style={{ backgroundColor: COLORS.yellowLighten5 }}
                >
                  <Ionicons name="videocam-outline" size={48} color={COLORS.yellowDarken2} />
                </View>
              )}
            </View>

            {/* Video Info */}
            <View className="p-4">
              <Text 
                className="text-lg font-bold mb-1" 
                style={{ color: COLORS.text }}
                numberOfLines={2}
              >
                {formData.title || 'Sem título'}
              </Text>
              
              {formData.category && (
                <View className="self-start px-3 py-1 rounded-full mb-2"
                  style={{ 
                    backgroundColor: 
                      formData.category === 'teórica' ? COLORS.info :
                      formData.category === 'prática' ? COLORS.success :
                      COLORS.warning
                  }}
                >
                  <Text className="text-xs font-medium text-white">
                    {videoCategories.find(c => c.id === formData.category)?.name}
                  </Text>
                </View>
              )}
            </View>
          </View>
        )}

        {/* Form Section */}
        <View className="gap-4 pt-2">
          {/* Título */}
          <View>
            <View className="flex-row items-center mb-1">
              <Text className="text-sm font-medium" style={{ color: COLORS.text }}>
                Título da aula *
              </Text>
              {!formData.title && (
                <Text className="text-xs ml-1" style={{ color: COLORS.error }}>
                  (obrigatório)
                </Text>
              )}
            </View>
            <TextInput
              className="p-4 rounded-xl"
              style={{
                backgroundColor: COLORS.surface,
                color: COLORS.text,
                borderColor: formData.title ? COLORS.border : COLORS.error,
                borderWidth: 1
              }}
              value={formData.title}
              onChangeText={(text) => setFormData({ ...formData, title: text })}
              placeholder="Ex: Como estacionar corretamente"
              placeholderTextColor={COLORS.textLight}
            />
          </View>

          {/* Categoria */}
          <View className='mt-2'>
          
            <CategorySelector
              categories={videoCategories}
              selectedId={formData.category}
              onSelect={(id) => setFormData({ ...formData, category: id })}
            />
          </View>

          {/* URL do YouTube */}
          <View>
            <View className="flex-row items-center mb-1">
              <Text className="text-sm font-medium" style={{ color: COLORS.text }}>
                URL do YouTube *
              </Text>
              {!isValidUrl && formData.videoUrl && (
                <Text className="text-xs ml-1" style={{ color: COLORS.error }}>
                  (URL inválida)
                </Text>
              )}
              {!formData.videoUrl && (
                <Text className="text-xs ml-1" style={{ color: COLORS.error }}>
                  (obrigatório)
                </Text>
              )}
            </View>
            <TextInput
              className="p-4 rounded-xl"
              style={{
                backgroundColor: COLORS.surface,
                color: COLORS.text,
                borderColor: isValidUrl ? COLORS.border : 
                            formData.videoUrl ? COLORS.error : COLORS.border,
                borderWidth: 1
              }}
              value={formData.videoUrl}
              onChangeText={handleUrlChange}
              placeholder="https://www.youtube.com/watch?v=..."
              placeholderTextColor={COLORS.textLight}
              keyboardType="url"
              autoCapitalize="none"
            />
            {formData.videoUrl && !isValidUrl && (
              <Text className="text-xs mt-1" style={{ color: COLORS.error }}>
                Insira uma URL válida do YouTube
              </Text>
            )}
          </View>

          {/* Duração */}
          <View>
            <Text className="text-sm font-medium mb-1" style={{ color: COLORS.text }}>
              Duração (minutos)
            </Text>
            <TextInput
              className="p-4 rounded-xl"
              style={{
                backgroundColor: COLORS.surface,
                color: COLORS.text,
                borderColor: COLORS.border,
                borderWidth: 1
              }}
              value={formData.durationInMinutes}
              onChangeText={(text) => setFormData({ ...formData, durationInMinutes: text.replace(/[^0-9]/g, '') })}
              placeholder="Ex: 15"
              placeholderTextColor={COLORS.textLight}
              keyboardType="numeric"
            />
          </View>

          {/* Descrição */}
          <View>
            <Text className="text-sm font-medium mb-1" style={{ color: COLORS.text }}>
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
              placeholder="Descreva o conteúdo da aula..."
              placeholderTextColor={COLORS.textLight}
              multiline
            />
          </View>
        </View>
    

        <TouchableOpacity
          className="flex-row items-center justify-center p-4 rounded-md mt-2 shadow-lg"
          style={{
            backgroundColor: 
              !formData.title || !formData.category || !isValidUrl ? 
              COLORS.textLight : COLORS.primary,
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.25,
            shadowRadius: 4,
            elevation: 5,
          }}
          onPress={handleSubmit}
          disabled={isLoading || !formData.title || !formData.category || !isValidUrl}
        >
          {isLoading ? (
            <ActivityIndicator color="white" />
          ) : (
            <>
              <MaterialCommunityIcons 
                name="content-save-check" 
                size={24} 
                color="white" 
              />
              <Text className="text-white font-bold ml-2">SALVAR</Text>
            </>
          )}
        </TouchableOpacity>
    
        </ScrollView>
    </KeyboardAvoidingView>
  );
};

export default AddVideoLessonScreen;