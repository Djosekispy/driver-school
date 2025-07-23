import React from 'react';
import { View, Text, TouchableOpacity, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { FeaturedVideo } from '../types';
import { COLORS } from '@/hooks/useColors';

const FeaturedVideoCard: React.FC<{ video: FeaturedVideo }> = ({ video }) => {
  return (
    <View className="mb-6">
      <View className="flex-row justify-between items-center mb-3">
        <Text className="text-lg font-semibold" style={{ color: COLORS.text }}>Vídeo em Destaque</Text>
        <TouchableOpacity>
          <Text className="text-sm" style={{ color: COLORS.primary }}>Ver todos</Text>
        </TouchableOpacity>
      </View>
      
      <View className="aspect-video bg-gray-200 rounded-xl justify-center items-center overflow-hidden">
        <Image
          source={{ uri: video.thumbnail }}
          className="w-full h-full absolute"
        />
        <View className="absolute inset-0 bg-black opacity-30" />
        <TouchableOpacity className="absolute">
          <Ionicons name="play-circle" size={64} style={{ color: COLORS.surface }} />
        </TouchableOpacity>
      </View>
      
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