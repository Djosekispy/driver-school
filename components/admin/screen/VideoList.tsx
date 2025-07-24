import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, TouchableOpacity, Alert, Image, Modal, Platform } from 'react-native';
import { COLORS } from '@/hooks/useColors';
import { useNavigation, useRouter } from 'expo-router';
import { AntDesign, Feather, MaterialIcons, Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { VideoLesson } from '@/types/VideoLesson';
import { useFirebase } from '@/context/FirebaseContext';
import YoutubePlayer from 'react-native-youtube-iframe';

const VideoList = () => {
  const { videoLessons, loadVideoLessons, removeVideoLesson } = useFirebase();
  const router = useRouter();
  const [selectedVideo, setSelectedVideo] = useState<VideoLesson | null>(null);
  const [modalVisible, setModalVisible] = useState(false);
  
  useEffect(() => {
    loadVideoLessons();
  }, []);

  const handleDelete = (id: string) => {
    Alert.alert(
      'Confirmar Exclusão',
      'Tem certeza que deseja excluir esta vídeo-aula?',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Excluir',
          style: 'destructive',
          onPress: () => removeVideoLesson(id).catch(() => 
            Alert.alert('Erro', 'Falha ao excluir vídeo-aula')
          ),
        },
      ]
    );
  };

  const handleEdit = (video: VideoLesson) => {
    router.push({ pathname : '/(videos)/update', params : { id : video.id} });
  };

  const handlePreview = (video: VideoLesson) => {
    setSelectedVideo(video);
    setModalVisible(true);
  };

  const extractYoutubeId = (url: string) => {
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url.match(regExp);
    return (match && match[2].length === 11) ? match[2] : null;
  };

  const getCategoryStyle = (category: string) => {
    switch (category) {
      case 'teórica': return { bg: COLORS.info, text: 'white' };
      case 'prática': return { bg: COLORS.success, text: 'white' };
      case 'legislação': return { bg: COLORS.warning, text: 'white' };
      default: return { bg: COLORS.border, text: COLORS.text };
    }
  };

  const renderItem = ({ item }: { item: VideoLesson }) => {
    const categoryStyle = getCategoryStyle(item.category);
    const youtubeId = extractYoutubeId(item.videoUrl);
    const thumbnailUrl = youtubeId 
      ? `https://img.youtube.com/vi/${youtubeId}/hqdefault.jpg`
      : `https://picsum.photos/seed/${item.id}/300/200`;

    return (
      <TouchableOpacity 
        activeOpacity={0.9}
        onPress={() => handlePreview(item)}
      >
        <View 
          className="mb-6 rounded-2xl overflow-hidden shadow-lg px-2"
          style={{ 
            backgroundColor: COLORS.surface,
            shadowColor: COLORS.yellowDarken4,
            shadowOpacity: 0.1,
            shadowRadius: 8,
            elevation: 4
          }}
        >
          {/* Thumbnail with Play Button */}
          <View className="h-40 bg-gray-200 relative">
            <Image 
              source={{ uri: thumbnailUrl }} 
              className="w-full h-full"
              resizeMode="cover"
            />
            
            {/* Play Button Overlay */}
            <View className="absolute inset-0 items-center justify-center bg-black/20">
              <MaterialCommunityIcons 
                name="play-circle-outline" 
                size={48} 
                color="rgba(255,255,255,0.9)" 
              />
            </View>
            
            {/* Duration Badge */}
            <View 
              className="absolute bottom-2 right-2 px-2 py-1 rounded-md"
              style={{ backgroundColor: 'rgba(0,0,0,0.7)' }}
            >
              <Text className="text-white text-xs">
                {item.durationInMinutes || '--'} min
              </Text>
            </View>
          </View>

          {/* Content */}
          <View className="p-4">
            <View className="flex-row justify-between items-start mb-2">
              <Text 
                className="text-lg font-bold flex-1 mr-2" 
                style={{ color: COLORS.text }}
                numberOfLines={2}
              >
                {item.title}
              </Text>
              
              <View 
                className="px-3 py-1 rounded-full"
                style={{ backgroundColor: categoryStyle.bg }}
              >
                <Text 
                  className="text-xs font-medium"
                  style={{ color: categoryStyle.text }}
                >
                  {item.category}
                </Text>
              </View>
            </View>

            <Text 
              className="text-sm mb-4" 
              style={{ color: COLORS.textLight }}
              numberOfLines={3}
            >
              {item.description}
            </Text>

            {/* Footer with Actions */}
            <View className="flex-row justify-between items-center border-t pt-3"
              style={{ borderTopColor: COLORS.border }}
            >
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
                  {item.createdBy || 'Admin'}
                </Text>
              </View>

              <View className="flex-row gap-4">
                <TouchableOpacity 
                  className="flex-row items-center"
                  onPress={(e) => {
                    e.stopPropagation();
                    handleEdit(item);
                  }}
                >
                  <Feather name="edit" size={18} color={COLORS.primary} />
                  <Text 
                    className="ml-1 text-sm"
                    style={{ color: COLORS.primary }}
                  >
                    Editar
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity 
                  className="flex-row items-center"
                  onPress={(e) => {
                    e.stopPropagation();
                    handleDelete(item.id);
                  }}
                >
                  <AntDesign name="delete" size={18} color={COLORS.error} />
                  <Text 
                    className="ml-1 text-sm"
                    style={{ color: COLORS.error }}
                  >
                    Excluir
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <View 
      className="flex-1"
      style={{ backgroundColor: COLORS.background }}
    >
      {/* Header */}
      <View className="mb-6 pt-4 pb-4 px-2 bg-white">
        <View className="flex-row justify-between items-center">
          <View className="flex-row items-center">
            <TouchableOpacity 
              onPress={() => router.back()} 
              className="p-2 mr-2 rounded-full bg-white shadow-md"
            >
              <Feather name="arrow-left" size={20} color={COLORS.text} />
            </TouchableOpacity>

            <Text className="text-2xl font-bold" style={{ color: COLORS.text }}>
              Vídeo Aulas
            </Text>
          </View>

          <View 
            className="px-3 py-1 rounded-full" 
            style={{ backgroundColor: COLORS.yellowLighten4 }}
          >
            <Text 
              className="text-xs font-semibold" 
              style={{ color: COLORS.yellowDarken4 }}
            >
              {videoLessons.length} itens
            </Text>
          </View>
        </View>

        <Text 
          className="text-sm mt-2 ml-1" 
          style={{ color: COLORS.textLight }}
        >
          Gerencie e edite o conteúdo audiovisual da sua plataforma
        </Text>
      </View>

      {/* List */}
      <FlatList
        data={videoLessons}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        contentContainerStyle={{ paddingBottom: 24 }}
        ListEmptyComponent={
          <View 
            className="items-center justify-center py-12"
            style={{ backgroundColor: COLORS.yellowLighten5, borderRadius: 12 }}
          >
            <Ionicons name="videocam-off-outline" size={48} color={COLORS.yellowDarken2} />
            <Text 
              className="text-lg mt-4 text-center"
              style={{ color: COLORS.textLight }}
            >
              Nenhuma vídeo-aula cadastrada
            </Text>
            <Text 
              className="text-sm mt-1 text-center max-w-xs"
              style={{ color: COLORS.textLight }}
            >
              Clique no botão "+" para adicionar uma nova vídeo-aula
            </Text>
          </View>
        }
      />

      {/* YouTube Player Modal */}
      <Modal
        visible={modalVisible}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setModalVisible(false)}
      >
        <View 
          className="flex-1 justify-center bg-black/90 p-4"
          style={Platform.OS === 'ios' ? { paddingTop: 60 } : {}}
        >
          <TouchableOpacity 
            className="absolute top-4 right-4 z-10 p-2"
            onPress={() => setModalVisible(false)}
          >
            <AntDesign name="close" size={24} color="white" />
          </TouchableOpacity>

          {selectedVideo && (
            <>
              <Text 
                className="text-white text-lg font-bold mb-2 px-4"
                numberOfLines={2}
              >
                {selectedVideo.title}
              </Text>
              
              <View className="aspect-video">
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

              <View className="mt-4 px-4">
                <View className="flex-row items-center mb-2">
                  <MaterialIcons name="category" size={18} color="white" />
                  <Text className="text-white ml-2">
                    {selectedVideo.category}
                  </Text>
                </View>
                
                {selectedVideo.durationInMinutes && (
                  <View className="flex-row items-center mb-2">
                    <MaterialIcons name="access-time" size={18} color="white" />
                    <Text className="text-white ml-2">
                      {selectedVideo.durationInMinutes} minutos
                    </Text>
                  </View>
                )}

                <Text className="text-white mt-2">
                  {selectedVideo.description}
                </Text>
              </View>
            </>
          )}
        </View>
      </Modal>
    </View>
  );
};

export default VideoList;