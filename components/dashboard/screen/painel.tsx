import React, { useEffect, useState } from 'react';
import { View, ScrollView, TouchableOpacity, RefreshControl } from 'react-native';
import { 
  mockUser, 
  mockProgress, 
  mockTests, 
  mockThemes, 
  mockDailyTip, 
  mockFeaturedVideo 
} from '../data/data';
import Header from '../ui/Header';
import ProgressCard from '../ui/ProgressCard';
import TestHistorySection from '../ui/TestHistorySection';
import ThemesSection from '../ui/ThemesSection';
import DailyTipCard from '../ui/DailyTipCard';
import FeaturedVideoCard from '../ui/FeaturedVideoCard';
import { COLORS } from '@/hooks/useColors';
import { FontAwesome5 } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useAuth } from '@/context/AuthContext';
import UserStatsDashboard from '../ui/TestHistorySection';
import { getUserProgress, Progress } from '../data/progressData';
import { auth } from '@/firebase/firebase';
import { getUserStats, UserStats } from '@/services/statsService';
import { fetchVideoLessons } from '@/services/videoLessonService';
import { fetchWatchedLessonsByUser } from '@/services/watcheLessonService';
import { VideoLessonCategory } from '@/types/VideoLesson';
import { categoryIcons, CategoryProgress, categoryTitles } from '@/types/User';




const HomeScreen = () => {
  const router = useRouter()
  const { user } = useAuth();
  const [refreshing, setRefreshing] = React.useState(false);
  const [stats, setStats] = useState<UserStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');
  const [categories, setCategories] = useState<CategoryProgress[]>([]);

const [progress, setProgress] = useState<Progress>({
    completedLessons: 0,
    totalLessons: 0,
    percentage: 0,
    nextLesson: false,
    lastAccessed: null
  });

const onRefresh = React.useCallback(async() => {
    setRefreshing(true);
    const userProgress = await getUserProgress(user?.id || '');
    const userStats = await getUserStats(user?.id || '');
    setStats(userStats);
    setProgress(userProgress);
    await loadDataLessons();
    setTimeout(() => {
      setRefreshing(false);
    }, 2000);
  }, []);


    const loadDataLessons = async () => {
      if (auth.currentUser?.uid) {
        try {
          const [allLessons, watchedLessons] = await Promise.all([
            fetchVideoLessons(),
            fetchWatchedLessonsByUser(auth.currentUser.uid || '')
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

useEffect(() => {
    const loadUserProgress = async () => {
      if (auth.currentUser?.uid) {
        const userProgress = await getUserProgress(auth.currentUser.uid || '');
          const userStats = await getUserStats(auth.currentUser.uid);
            setStats(userStats);
        setProgress(userProgress);
        await loadDataLessons();
      }
      setLoading(false)
    };
    loadUserProgress();
}, [auth.currentUser?.uid]);

  return (
    <View className="flex-1" style={{ backgroundColor: COLORS.background }}>
      {user && <Header user={user} />}
    
      <ScrollView 
      className="flex-1 px-4 pt-4"
            refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }>
        <ProgressCard 
        completedLessons={progress.completedLessons}
        lastAccessed={progress.lastAccessed}
        nextLesson={progress.nextLesson}
        percentage={progress.percentage}
        totalLessons={progress.totalLessons}
        byCategory={progress.byCategory}
/>
        <UserStatsDashboard
        stats={stats}
        activeTab={activeTab}
        loading={loading}
        setActiveTab={setActiveTab}
        
        
        />
        <ThemesSection 
        categories={categories}
        loading={loading}

        />
        <DailyTipCard tip={mockDailyTip} />
        <FeaturedVideoCard video={mockFeaturedVideo} />
      </ScrollView>
    </View>
  );
};

export default HomeScreen;