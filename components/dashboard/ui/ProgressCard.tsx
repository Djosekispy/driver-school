import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { COLORS } from '@/hooks/useColors';
import { getUserProgress, Progress } from '../data/progressData';

const ProgressCard: React.FC<Progress> = ({completedLessons,lastAccessed,nextLesson,percentage,totalLessons,byCategory}) => {


  return (
    <View className="mb-6 p-5 rounded-xl shadow-sm" style={{ backgroundColor: COLORS.surface }}>
      <View className="flex-row justify-between items-center mb-4">
        <Text className="text-lg font-semibold" style={{ color: COLORS.text }}>Seu Progresso</Text>
      </View>
      
      <View className="flex-row items-center mb-3">
        <View className="flex-1 h-3 rounded-full" style={{ backgroundColor: COLORS.yellowLighten5 }}>
          <View 
            className="h-3 rounded-full" 
            style={{ 
              width: `${percentage}%`,
              backgroundColor: COLORS.primary
            }}
          />
        </View>
        <Text className="ml-3 font-medium" style={{ color: COLORS.primary }}>{percentage > 0 ? percentage : 0}%</Text>
      </View>
      
      <View className="flex-row justify-between gap-2">
        <View className="items-center">
          <Text className="text-2xl font-bold" style={{ color: COLORS.primary }}>{completedLessons}</Text>
          <Text className="text-sm" style={{ color: COLORS.textLight }}>Aulas concluídas</Text>
        </View>
        
        <View className="items-center">
          <Text className="text-2xl font-bold" style={{ color: COLORS.text }}>{totalLessons}</Text>
          <Text className="text-sm" style={{ color: COLORS.textLight }}>Total de aulas</Text>
        </View>
        
        <View className="items-center">
          <Text className="text-2xl font-bold" style={{ color: COLORS.text }}>
            {nextLesson ? nextLesson.split(' ').slice(0, 2).join(' ').toLocaleLowerCase() : '0'}...
          </Text>
           <Text className="text-sm" style={{ color: COLORS.textLight }}>Próxima aula</Text>
        </View>
      </View>
    </View>
  );
};

export default ProgressCard;