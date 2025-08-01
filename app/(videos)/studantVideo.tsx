import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, TouchableOpacity, Image, Modal, Platform, TextInput, ActivityIndicator, ScrollView } from 'react-native';
import { COLORS } from '@/hooks/useColors';
import { useRouter } from 'expo-router';
import { AntDesign, Feather, MaterialIcons, Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { VideoLesson, VideoLessonCategory } from '@/types/VideoLesson';
import { useFirebase } from '@/context/FirebaseContext';
import { useAuth } from '@/context/AuthContext';
import YoutubePlayer from 'react-native-youtube-iframe';

const StudentVideoLessonsScreen = () => {
  const { user } = useAuth();
  const { 
    videoLessons, 
    loadVideoLessons,
    markLessonAsWatched,
    loadWatchedLessonsByUser,
    watchedLessons
  } = useFirebase();
  
  const router = useRouter();
  const [selectedVideo, setSelectedVideo] = useState<VideoLesson | null>(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<VideoLessonCategory | 'all'>('all');
  const [loading, setLoading] = useState(true);
  const [isMarkingWatched, setIsMarkingWatched] = useState(false);

  // Carregar vídeos e aulas assistidas
  useEffect(() => {
    const loadData = async () => {
      try {
        await Promise.all([
          loadVideoLessons(),
          user?.id && loadWatchedLessonsByUser(user.id)
        ]);
      } catch (error) {
        console.error('Erro ao carregar dados:', error);
      } finally {
        setLoading(false);
      }
    };
    
    loadData();
  }, [user?.id]);

  // Filtrar vídeos
  const filteredVideos = videoLessons.filter(video => {
    // Filtro por busca
    const matchesSearch = video.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                         video.description.toLowerCase().includes(searchQuery.toLowerCase());
    
    // Filtro por categoria
    const matchesCategory = selectedCategory === 'all' || video.category === selectedCategory;
    
    return matchesSearch && matchesCategory;
  });

  // Verificar se vídeo foi assistido
  const isVideoWatched = (videoId: string) => {
    return watchedLessons.some(lesson => lesson.videoLessonId === videoId);
  };

  // Extrair ID do YouTube
  const extractYoutubeId = (url: string) => {
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url.match(regExp);
    return (match && match[2].length === 11) ? match[2] : null;
  };

  // Estilo da categoria
  const getCategoryStyle = (category: string) => {
    switch (category) {
      case 'teórica': return { bg: '#3b82f6', text: 'white' };
      case 'prática': return { bg: '#10b981', text: 'white' };
      case 'legislação': return { bg: '#f59e0b', text: 'white' };
      default: return { bg: COLORS.border, text: COLORS.text };
    }
  };
  const handleOpenVideo = async (video: VideoLesson) => {
    setSelectedVideo(video);
    setModalVisible(true);
    
    if (user?.id && !isVideoWatched(video.id)) {
      setIsMarkingWatched(true);
      try {
        await markLessonAsWatched({
          userId: user.id,
          videoLessonId: video.id,
          watchedAt : new Date()

        });
      } catch (error) {
        console.error('Erro ao marcar como assistido:', error);
      } finally {
        setIsMarkingWatched(false);
      }
    }
  };
  // Renderizar item da lista
  const renderItem = ({ item }: { item: VideoLesson }) => {
    const categoryStyle = getCategoryStyle(item.category);
    const youtubeId = extractYoutubeId(item.videoUrl);
    const thumbnailUrl = youtubeId 
      ? `https://img.youtube.com/vi/${youtubeId}/hqdefault.jpg`
      : `https://picsum.photos/seed/${item.id}/300/200`;

    return (
      <TouchableOpacity 
        activeOpacity={0.9}
        onPress={() => handleOpenVideo(item)}
      >
        <View 
          className="mb-6 rounded-2xl overflow-hidden"
          style={{ 
            backgroundColor: COLORS.surface,
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.1,
            shadowRadius: 4,
            elevation: 3
          }}
        >
          {/* Thumbnail */}
          <View className="h-40 bg-gray-200 relative">
            <Image 
              source={{ uri: thumbnailUrl }} 
              className="w-full h-full"
              resizeMode="cover"
            />
            
            {/* Overlay e ícone de play */}
            <View className="absolute inset-0 items-center justify-center bg-black/20">
              <MaterialCommunityIcons 
                name="play-circle-outline" 
                size={48} 
                color="rgba(255,255,255,0.9)" 
              />
            </View>
            
            {/* Badges */}
            <View className="absolute top-2 left-2 flex-row">
              <View 
                className="px-2 py-1 rounded-md mr-2"
                style={{ backgroundColor: categoryStyle.bg }}
              >
                <Text className="text-xs font-medium" style={{ color: categoryStyle.text }}>
                  {item.category}
                </Text>
              </View>
              
              {isVideoWatched(item.id) && (
                <View className="px-2 py-1 rounded-md" style={{ backgroundColor: '#10b981' }}>
                  <Text className="text-xs font-medium text-white">Assistido</Text>
                </View>
              )}
            </View>
            
            {/* Duração */}
            <View 
              className="absolute bottom-2 right-2 px-2 py-1 rounded-md"
              style={{ backgroundColor: 'rgba(0,0,0,0.7)' }}
            >
              <Text className="text-white text-xs">
                {item.durationInMinutes || '--'} min
              </Text>
            </View>
          </View>

          {/* Conteúdo */}
          <View className="p-4">
            <Text 
              className="text-lg font-bold mb-2" 
              style={{ color: COLORS.text }}
              numberOfLines={2}
            >
              {item.title}
            </Text>

            <Text 
              className="text-sm mb-3" 
              style={{ color: COLORS.textLight }}
              numberOfLines={2}
            >
              {item.description}
            </Text>

            {/* Progresso e informações */}
            <View className="flex-row justify-between items-center">
              <View className="flex-row items-center">
                <MaterialIcons 
                  name="person-outline" 
                  size={16} 
                  color={COLORS.textLight} 
                />
                <Text 
                  className="text-xs ml-1"
                  style={{ color: COLORS.textLight }}
                >
                  {item.createdBy || 'Instrutor'}
                </Text>
              </View>
              
              <View className="flex-row items-center">
                <MaterialIcons 
                  name="access-time" 
                  size={16} 
                  color={COLORS.textLight} 
                />
                <Text 
                  className="text-xs ml-1"
                  style={{ color: COLORS.textLight }}
                >
                  {item.durationInMinutes || '--'} min
                </Text>
              </View>
            </View>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  if (loading) {
    return (
      <View className="flex-1 items-center justify-center" style={{ backgroundColor: COLORS.background }}>
        <ActivityIndicator size="large" color={COLORS.primary} />
      </View>
    );
  }

  return (
    <View className="flex-1" style={{ backgroundColor: COLORS.background }}>
      {/* Cabeçalho */}
      <View className="px-4 pt-4 pb-3 bg-white shadow-sm">
        <View className="flex-row justify-between items-center mb-3">

        <TouchableOpacity 
          onPress={() => router.back()}
          className="p-2 mr-2"
        >
          <Feather name="arrow-left" size={24} color={COLORS.text} />
        </TouchableOpacity>

          <Text className="text-2xl font-bold" style={{ color: COLORS.primary }}>
            Vídeo Aulas
          </Text>
          
          <View className="flex-row items-center">
            <Text className="text-sm mr-2" style={{ color: COLORS.textLight }}>
              {filteredVideos.length} aulas
            </Text>
            <View 
              className="w-8 h-8 rounded-full items-center justify-center"
              style={{ backgroundColor: COLORS.yellowLighten5 }}
            >
              <Feather name="filter" size={18} color={COLORS.primary} />
            </View>
          </View>
        </View>

        {/* Barra de busca */}
        <View className="relative mb-3">
          <TextInput
            className="pl-10 pr-4 py-2 border rounded-full"
            style={{ 
              borderColor: COLORS.border,
              color: COLORS.text,
              backgroundColor: COLORS.surface
            }}
            placeholder="Buscar vídeo aulas..."
            placeholderTextColor={COLORS.textLight}
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
          <Feather 
            name="search" 
            size={18} 
            color={COLORS.textLight} 
            style={{ position: 'absolute', left: 12, top: 12 }}
          />
        </View>

        {/* Filtros de categoria */}
        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false}
          className="mb-1"
          contentContainerStyle={{ paddingRight: 16 }}
        >
          {['all', 'teórica', 'prática', 'legislação'].map((category) => (
            <TouchableOpacity
              key={category}
              className={`px-4 py-2 rounded-full mr-2 ${selectedCategory === category ? 'border-2' : 'border'}`}
              style={{ 
                borderColor: selectedCategory === category ? COLORS.primary : COLORS.border,
                backgroundColor: selectedCategory === category ? COLORS.yellowLighten5 : COLORS.surface
              }}
              onPress={() => setSelectedCategory(category as VideoLessonCategory | 'all')}
            >
              <Text 
                className="text-sm"
                style={{ 
                  color: selectedCategory === category ? COLORS.primary : COLORS.text,
                  fontWeight: selectedCategory === category ? '600' : '400'
                }}
              >
                {category === 'all' ? 'Todas' : category}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {/* Lista de vídeos */}
      <FlatList
        data={filteredVideos}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        contentContainerStyle={{ padding: 16 }}
        ListEmptyComponent={
          <View className="items-center justify-center py-12">
            <Ionicons name="videocam-off-outline" size={48} color={COLORS.textLight} />
            <Text className="text-lg mt-4 text-center" style={{ color: COLORS.text }}>
              Nenhuma vídeo aula encontrada
            </Text>
            <Text className="text-sm mt-1 text-center" style={{ color: COLORS.textLight }}>
              Tente ajustar seus filtros de busca
            </Text>
          </View>
        }
      />

      {/* Modal do Player */}
      <Modal
        visible={modalVisible}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setModalVisible(false)}
      >
        <View className="flex-1 bg-black/90">
          {/* Cabeçalho do modal */}
          <View className="pt-12 px-4 pb-4 flex-row justify-between items-center">
            <TouchableOpacity 
              onPress={() => setModalVisible(false)}
              className="p-2"
            >
              <AntDesign name="close" size={24} color="white" />
            </TouchableOpacity>
            
            {isMarkingWatched && (
              <View className="flex-row items-center">
                <ActivityIndicator size="small" color="white" />
                <Text className="text-white ml-2">Salvando progresso...</Text>
              </View>
            )}
          </View>

          {/* Player de vídeo */}
          {selectedVideo && (
            <View className="flex-1 justify-center px-2">
              <View className="aspect-video mb-4">
                <YoutubePlayer
                  height={300}
                  play={true}
                  videoId={extractYoutubeId(selectedVideo.videoUrl) || ''}
                  webViewProps={{
                    injectedJavaScript: `
                      var element = document.getElementsByClassName('container')[0];
                      element.style.borderRadius = '12px';
                      element.style.overflow = 'hidden';
                      true;
                    `
                  }}
                />
              </View>

              {/* Detalhes do vídeo */}
              <View className="px-4">
                <Text className="text-white text-xl font-bold mb-2">
                  {selectedVideo.title}
                </Text>
                
                <View className="flex-row items-center mb-2">
                  <View 
                    className="px-2 py-1 rounded-md mr-3"
                    style={{ backgroundColor: getCategoryStyle(selectedVideo.category).bg }}
                  >
                    <Text className="text-xs font-medium" style={{ color: getCategoryStyle(selectedVideo.category).text }}>
                      {selectedVideo.category}
                    </Text>
                  </View>
                  
                  <View className="flex-row items-center">
                    <MaterialIcons name="access-time" size={16} color="white" />
                    <Text className="text-white ml-1 text-sm">
                      {selectedVideo.durationInMinutes || '--'} min
                    </Text>
                  </View>
                </View>

                <Text className="text-white mt-3 mb-4">
                  {selectedVideo.description}
                </Text>

                {isVideoWatched(selectedVideo.id) && (
                  <View className="flex-row items-center mb-4">
                    <MaterialIcons name="check-circle" size={20} color="#10b981" />
                    <Text className="text-white ml-2">
                      Você completou esta aula
                    </Text>
                  </View>
                )}

                <TouchableOpacity
                  className="py-3 rounded-lg items-center justify-center mt-4"
                  style={{ backgroundColor: COLORS.primary }}
                  onPress={() => setModalVisible(false)}
                >
                  <Text className="text-white font-medium">Fechar Vídeo</Text>
                </TouchableOpacity>
              </View>
            </View>
          )}
        </View>
      </Modal>
    </View>
  );
};

export default StudentVideoLessonsScreen;