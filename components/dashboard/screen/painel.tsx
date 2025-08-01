import React from 'react';
import { View, ScrollView, TouchableOpacity } from 'react-native';
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

const HomeScreen = () => {
  const router = useRouter()
  const { user } = useAuth();
  return (
    <View className="flex-1" style={{ backgroundColor: COLORS.background }}>
      {user && <Header user={user} />}
    
      <ScrollView className="flex-1 px-4 pt-4">
        <ProgressCard />
        <UserStatsDashboard />
        <ThemesSection  />
        <DailyTipCard tip={mockDailyTip} />
        <FeaturedVideoCard video={mockFeaturedVideo} />
      </ScrollView>
    </View>
  );
};

export default HomeScreen;