import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, FlatList, ActivityIndicator } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { COLORS } from '@/hooks/useColors';
import { auth } from '@/firebase/firebase';
import { VideoLessonCategory } from '@/types/VideoLesson';
import { fetchVideoLessons } from '@/services/videoLessonService';
import { fetchWatchedLessonsByUser } from '@/services/watcheLessonService';

interface CategoryProgress {
  id: string;
  title: string;
  icon: keyof typeof MaterialCommunityIcons.glyphMap;
  completedLessons: number;
  totalLessons: number;
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

const ThemesSection: React.FC = () => {
  const [categories, setCategories] = useState<CategoryProgress[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      if (auth.currentUser?.uid) {
        try {
          const [allLessons, watchedLessons] = await Promise.all([
            fetchVideoLessons(),
            fetchWatchedLessonsByUser(auth.currentUser.email || '')
          ]);

          // Criar mapa de aulas assistidas por ID para busca rápida
          const watchedLessonIds = new Set(
            watchedLessons.map(lesson => lesson.videoLessonId)
          );

          // Agrupar por categoria
          const categoriesData: Record<VideoLessonCategory, CategoryProgress> = {
            'teórica': { 
              id: 'teorica',
              title: categoryTitles['teórica'],
              icon: categoryIcons['teórica'],
              completedLessons: 0,
              totalLessons: 0
            },
            'prática': { 
              id: 'pratica',
              title: categoryTitles['prática'],
              icon: categoryIcons['prática'],
              completedLessons: 0,
              totalLessons: 0
            },
            'legislação': { 
              id: 'legislacao',
              title: categoryTitles['legislação'],
              icon: categoryIcons['legislação'],
              completedLessons: 0,
              totalLessons: 0
            }
          };

          // Contar aulas por categoria
          allLessons.forEach(lesson => {
            categoriesData[lesson.category].totalLessons++;
            if (watchedLessonIds.has(lesson.id)) {
              categoriesData[lesson.category].completedLessons++;
            }
          });

          setCategories(Object.values(categoriesData));
        } catch (error) {
          console.error('Error loading themes:', error);
        } finally {
          setLoading(false);
        }
      }
    };

    loadData();
  }, []);

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