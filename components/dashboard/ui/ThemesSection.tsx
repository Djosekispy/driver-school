import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, FlatList, ActivityIndicator } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { COLORS } from '@/hooks/useColors';
import { VideoLessonCategory } from '@/types/VideoLesson';
import { CategoryProgress } from '@/types/User';


interface ThemeSectionProps {
 categories : CategoryProgress;
  loading : boolean

}

const categoryIcons: Record<VideoLessonCategory, string> = {
  'teórica': 'book-education',
  'prática': 'car',
  'legislação': 'scale-balance'
};

const categoryTitles: Record<VideoLessonCategory, string> = {
  'teórica': 'Teórica',
  'prática': 'Prática',
  'legislação': 'Legislação'
};

const ThemeCard: React.FC<{ theme: CategoryProgress }> = ({ theme }) => {
  const progressPercentage = theme.totalLessons > 0 
    ? Math.round((theme.completedLessons / theme.totalLessons) * 100)
    : 0;

  return (
    <TouchableOpacity 
      className="w-[48%] mb-4 p-4 rounded-xl"
      style={{ backgroundColor: COLORS.surface }}
    >
      <View 
        className="w-14 h-14 rounded-full justify-center items-center mb-3 self-center" 
        style={{ backgroundColor: COLORS.yellowLighten5 }}
      >
        <MaterialCommunityIcons 
          name={theme.icon} 
          size={24} 
          style={{ color: COLORS.primary }} 
        />
      </View>
      <Text className="text-center font-medium mb-1" style={{ color: COLORS.text }}>
        {theme.title}
      </Text>
      <Text className="text-xs text-center mb-2" style={{ color: COLORS.textLight }}>
        {theme.completedLessons}/{theme.totalLessons} aulas
      </Text>
      <View className="h-1 rounded-full" style={{ backgroundColor: COLORS.yellowLighten5 }}>
        <View 
          className="h-1 rounded-full" 
          style={{ 
            width: `${progressPercentage}%`,
            backgroundColor: COLORS.primary
          }}
        />
      </View>
    </TouchableOpacity>
  );
};

const ThemesSection: React.FC<ThemeSectionProps> = ({categories,loading}) => {

  if (loading) {
    return (
      <View className="mb-6">
        <ActivityIndicator color={COLORS.primary} />
      </View>
    );
  }

  return (
    <View className="mb-6">
      <Text className="text-lg font-semibold mb-3" style={{ color: COLORS.text }}>
        Temas para Estudo
      </Text>
      
      <FlatList
        data={categories}
        keyExtractor={item => item.id}
        numColumns={2}
        columnWrapperStyle={{ justifyContent: 'space-between' }}
        renderItem={({ item }) => <ThemeCard theme={item} />}
        scrollEnabled={false}
      />
    </View>
  );
};

export default ThemesSection;