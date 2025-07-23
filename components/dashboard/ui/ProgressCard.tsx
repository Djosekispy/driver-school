import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { Progress } from '../types';
import { COLORS } from '@/hooks/useColors';
import { useRouter } from 'expo-router';

const ProgressCard: React.FC<{ progress: Progress }> = ({ progress }) => {

  const router = useRouter()
  return (
    <View className="mb-6 p-5 rounded-xl shadow-sm" style={{ backgroundColor: COLORS.surface }}>
      <View className="flex-row justify-between items-center mb-4">
        <Text className="text-lg font-semibold" style={{ color: COLORS.text }}>Seu Progresso</Text>
        <TouchableOpacity
        onPress={()=> router.push('/(details)/progress')}
        >
          <Text className="text-sm" style={{ color: COLORS.primary }}>Ver detalhes</Text>
        </TouchableOpacity>
      </View>
      
      <View className="flex-row items-center mb-3">
        <View className="flex-1 h-3 rounded-full" style={{ backgroundColor: COLORS.yellowLighten5 }}>
          <View 
            className="h-3 rounded-full" 
            style={{ 
              width: `${progress.percentage}%`,
              backgroundColor: COLORS.primary
            }}
          />
        </View>
        <Text className="ml-3 font-medium" style={{ color: COLORS.primary }}>{progress.percentage}%</Text>
      </View>
      
      <View className="flex-row justify-between gap-2">
        <View className="items-center">
          <Text className="text-2xl font-bold" style={{ color: COLORS.primary }}>{progress.completedLessons}</Text>
          <Text className="text-sm" style={{ color: COLORS.textLight }}>Aulas concluídas</Text>
        </View>
        
        <View className="items-center">
          <Text className="text-2xl font-bold" style={{ color: COLORS.text }}>{progress.totalLessons}</Text>
          <Text className="text-sm" style={{ color: COLORS.textLight }}>Total de aulas</Text>
        </View>
        
      
      </View>
    </View>
  );
};

export default ProgressCard;