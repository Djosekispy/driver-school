import React from 'react';
import { SafeAreaView, ScrollView, StatusBar, View, Text } from 'react-native';
import { MaterialIcons, AntDesign, Feather } from '@expo/vector-icons';
import UserHeader from '../ui/UserHeader';
import StatsCard from '../ui/StatsCard';
import ProgressChart from '../ui/ProgressChart';
import RecentTests from '../ui/RecentTests';
import ActionCard from '../ui/ActionCard';
import { UserData, StatsData, RecentTest } from '../types';

const Dashboard: React.FC = () => {
  const userData: UserData = {
    id: 'user-123',
    name: "Carlos Silva",
    avatar: "https://randomuser.me/api/portraits/men/32.jpg",
    level: "Intermediário",
    progress: 68,
    daysStreak: 12,
  };

  const stats: StatsData = {
    testsCompleted: 24,
    correctAnswers: 82,
    bestScore: 94,
    signsMastered: 45,
  };

  const recentTests: RecentTest[] = [
    { id: 'test-1', date: "15/07/2023", score: 88, correct: 35, total: 40 },
    { id: 'test-2', date: "12/07/2023", score: 76, correct: 30, total: 40 },
    { id: 'test-3', date: "08/07/2023", score: 94, correct: 38, total: 40 },
  ];

  const handleActionPress = (action: string) => {
    console.log(`Action pressed: ${action}`);
    // Navegação ou ação específica aqui
  };

  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      <StatusBar barStyle="dark-content" />
      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        <UserHeader user={userData} />
        
        <View className="px-5 mt-4">
          <View className="flex-row justify-between items-center mb-4">
            <Text className="text-2xl font-bold text-gray-900">Seu Progresso</Text>
            <View className="flex-row items-center">
              <Text className="text-blue-600 mr-1">{userData.daysStreak}</Text>
              <MaterialIcons name="whatshot" size={20} color="#2563eb" />
              <Text className="text-gray-500 ml-2">dias seguidos</Text>
            </View>
          </View>

          <View className="flex-row flex-wrap -mx-2 mb-6">
            <StatsCard 
              icon={<AntDesign name="profile" size={20} color="#7c3aed" />}
              value={stats.testsCompleted.toString()}
              label="Testes realizados"
              color="bg-purple-50"
            />
            <StatsCard 
              icon={<AntDesign name="checkcircle" size={20} color="#10b981" />}
              value={`${stats.correctAnswers}%`}
              label="Acertos"
              color="bg-green-50"
            />
            <StatsCard 
              icon={<Feather name="award" size={20} color="#f59e0b" />}
              value={stats.bestScore.toString()}
              label="Melhor pontuação"
              color="bg-yellow-50"
            />
            <StatsCard 
              icon={<MaterialIcons name="traffic" size={20} color="#3b82f6" />}
              value={stats.signsMastered.toString()}
              label="Sinais dominados"
              color="bg-blue-50"
            />
          </View>
        </View>

        <ProgressChart progress={userData.progress} />

        <RecentTests tests={recentTests} />

        <View className="px-5 mt-6 mb-10">
          <Text className="text-2xl font-bold text-gray-900 mb-4">Comece agora</Text>
          <View className="flex-row flex-wrap -mx-2">
            <ActionCard 
              title="Teste Simulado" 
              icon={<MaterialIcons name="quiz" size={24} color="#2563eb" />}
              color="bg-blue-100"
              onPress={() => handleActionPress('Teste Simulado')}
            />
            <ActionCard 
              title="Sinais de Trânsito" 
              icon={<MaterialIcons name="traffic" size={24} color="#10b981" />}
              color="bg-green-100"
              onPress={() => handleActionPress('Sinais de Trânsito')}
            />
            <ActionCard 
              title="Dicas de Direção" 
              icon={<MaterialIcons name="directions-car" size={24} color="#f59e0b" />}
              color="bg-yellow-100"
              onPress={() => handleActionPress('Dicas de Direção')}
            />
            <ActionCard 
              title="Histórico Completo" 
              icon={<MaterialIcons name="history" size={24} color="#7c3aed" />}
              color="bg-purple-100"
              onPress={() => handleActionPress('Histórico Completo')}
            />
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default Dashboard;