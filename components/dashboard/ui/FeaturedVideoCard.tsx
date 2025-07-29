import React, { useState, useRef } from 'react';
import { View, Text, TouchableOpacity, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import YoutubePlayer from 'react-native-youtube-iframe';
import { FeaturedVideo } from '../types';
import { COLORS } from '@/hooks/useColors';

const FeaturedVideoCard: React.FC<{ video: FeaturedVideo }> = ({ video }) => {
  const [playing, setPlaying] = useState(false);
  const playerRef = useRef(null);

  // Extrai o ID do vídeo do YouTube da URL
  const getYouTubeId = (url: string) => {
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url.match(regExp);
    return (match && match[2].length === 11) ? match[2] : null;
  };

  const videoId = getYouTubeId(video.videoUrl);

  return (
    <View className="mb-6">
      <View className="flex-row justify-between items-center mb-3">
        <Text className="text-lg font-semibold" style={{ color: COLORS.text }}>Vídeo em Destaque</Text>
      </View>
      
      {videoId ? (
        <>
          {!playing ? (
            <View className="aspect-video bg-gray-200 rounded-xl justify-center items-center overflow-hidden relative">
              <Image
                source={{ uri: video.thumbnail }}
                className="w-full h-full absolute"
              />
              <View className="absolute inset-0 bg-black opacity-30" />
              <TouchableOpacity 
                className="absolute"
                onPress={() => setPlaying(true)}
              >
                <Ionicons name="play-circle" size={64} style={{ color: COLORS.surface }} />
              </TouchableOpacity>
            </View>
          ) : (
            <YoutubePlayer
              ref={playerRef}
              height={220}
              play={playing}
              videoId={videoId}
              onChangeState={(event) => {
                if (event === 'ended') {
                  setPlaying(false);
                }
              }}
              webViewProps={{
                injectedJavaScript: `
                  var element = document.getElementsByClassName('container')[0];
                  element.style.borderRadius = '12px';
                  element.style.overflow = 'hidden';
                  true;
                `,
              }}
            />
          )}
        </>
      ) : (
        <View className="aspect-video bg-gray-200 rounded-xl justify-center items-center">
          <Text style={{ color: COLORS.text }}>URL do vídeo inválida</Text>
        </View>
      )}
      
      <View className="mt-3">
        <Text className="font-medium" style={{ color: COLORS.text }}>{video.title}</Text>
        <View className="flex-row items-center mt-1">
          <Text className="text-xs mr-3" style={{ color: COLORS.textLight }}>
            {video.duration} min
          </Text>
          <Text className="text-xs mr-3" style={{ color: COLORS.textLight }}>
            {video.views} visualizações
          </Text>
          <Text className="text-xs" style={{ color: COLORS.textLight }}>
            {video.instructor}
          </Text>
        </View>
      </View>
    </View>
  );
};

export default FeaturedVideoCard;