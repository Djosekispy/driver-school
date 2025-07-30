import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet } from 'react-native';
import { Feather, AntDesign, MaterialIcons } from '@expo/vector-icons';
import { COLORS } from '@/hooks/useColors';
import { getUserStats, UserStats } from '@/services/statsService';
import { useFirebase } from '@/context/FirebaseContext';
import { auth } from '@/firebase/firebase';
import { formatDistanceToNow } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { Timestamp } from 'firebase/firestore';
import { formatRelativeTimeFromFirebaseTimestamp } from '@/services/data';



const UserStatsDashboard = () => {
  const [stats, setStats] = useState<UserStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    const loadStats = async () => {
      if (auth.currentUser?.uid) {
        try {
          const userStats = await getUserStats(auth.currentUser.uid);
          setStats(userStats);
        } catch (error) {
          console.error('Error loading user stats:', error);
        } finally {
          setLoading(false);
        }
      }
    };

    loadStats();
  }, [auth]);
  if (loading) {
    return (
      <View className="flex-1 items-center justify-center bg-gray-50">
        <Text className="text-lg" style={{ color: COLORS.text }}>Carregando estatísticas...</Text>
      </View>
    );
  }

  if (!stats) {
    return (
      <View className="flex-1 items-center justify-center bg-gray-50">
        <Feather name="alert-circle" size={32} style={{ color: COLORS.error }} />
        <Text className="text-lg mt-4" style={{ color: COLORS.text }}>Não foi possível carregar as estatísticas</Text>
      </View>
    );
  }

  // Função auxiliar para renderizar barra de progresso
  const renderProgressBar = (percentage: number, color: string) => (
    <View className="h-2 bg-gray-200 rounded-full w-full overflow-hidden">
      <View 
        className="h-full rounded-full" 
        style={{ 
          width: `${percentage}%`,
          backgroundColor: color
        }}
      />
    </View>
  );

  return (
    <View className="flex-1 bg-gray-50">
      {/* Header */}


      {/* Tabs */}
      <View className="flex-row border-b border-gray-200 bg-white">
        <TouchableOpacity
          className={`flex-1 py-3 items-center ${activeTab === 'overview' ? 'border-b-2' : ''}`}
          style={{ borderBottomColor: activeTab === 'overview' ? COLORS.primary : 'transparent' }}
          onPress={() => setActiveTab('overview')}
        >
          <Text 
            className={`font-medium ${activeTab === 'overview' ? 'text-primary' : 'text-gray-500'}`}
            style={activeTab === 'overview' ? { color: COLORS.primary } : { color: COLORS.textLight }}
          >
            Visão Geral
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          className={`flex-1 py-3 items-center ${activeTab === 'categories' ? 'border-b-2' : ''}`}
          style={{ borderBottomColor: activeTab === 'categories' ? COLORS.primary : 'transparent' }}
          onPress={() => setActiveTab('categories')}
        >
          <Text 
            className={`font-medium ${activeTab === 'categories' ? 'text-primary' : 'text-gray-500'}`}
            style={activeTab === 'categories' ? { color: COLORS.primary } : { color: COLORS.textLight }}
          >
            Por Categoria
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          className={`flex-1 py-3 items-center ${activeTab === 'history' ? 'border-b-2' : ''}`}
          style={{ borderBottomColor: activeTab === 'history' ? COLORS.primary : 'transparent' }}
          onPress={() => setActiveTab('history')}
        >
          <Text 
            className={`font-medium ${activeTab === 'history' ? 'text-primary' : 'text-gray-500'}`}
            style={activeTab === 'history' ? { color: COLORS.primary } : { color: COLORS.textLight }}
          >
            Histórico
          </Text>
        </TouchableOpacity>
      </View>

      {/* Content */}
      <ScrollView className="flex-1 p-4">
        {activeTab === 'overview' && (
          <View>
            {/* Overall Stats Card */}
            <View className="bg-white rounded-xl shadow-sm p-5 mb-4">
              <Text className="text-lg font-semibold mb-4" style={{ color: COLORS.text }}>
                Desempenho Geral
              </Text>
              
            <ScrollView
  horizontal
  showsHorizontalScrollIndicator={false}
  className="mb-6"
  contentContainerStyle={{ flexDirection: 'row', gap: 16, paddingHorizontal: 16 }}
>
  <View className="items-center">
    <Text className="text-3xl font-bold" style={{ color: COLORS.primary }}>
      {stats.overall.totalTestsTaken}
    </Text>
    <Text className="text-sm" style={{ color: COLORS.textLight }}>
      Testes Realizados
    </Text>
  </View>

  <View className="items-center">
    <Text className="text-3xl font-bold" style={{ color: COLORS.primary }}>
      {stats.overall.averageScore.toFixed(1)}%
    </Text>
    <Text className="text-sm" style={{ color: COLORS.textLight }}>
      Média de Acertos
    </Text>
  </View>

  <View className="items-center">
    <Text className="text-3xl font-bold" style={{ color: COLORS.primary }}>
      {stats.overall.correctAnswers}
    </Text>
    <Text className="text-sm" style={{ color: COLORS.textLight }}>
      Questões Corretas
    </Text>
  </View>
</ScrollView>


              <View className="mb-4">
                <View className="flex-row justify-between mb-1">
                  <Text className="text-sm" style={{ color: COLORS.text }}>Melhor Categoria</Text>
                  <Text className="text-sm font-semibold" style={{ color: COLORS.primary }}>
                    {stats.overall.bestCategory}
                  </Text>
                </View>
                {renderProgressBar(
                  stats.byCategory[stats.overall.bestCategory]?.averageScore || 0,
                  COLORS.success
                )}
              </View>

              <View>
                <View className="flex-row justify-between mb-1">
                  <Text className="text-sm" style={{ color: COLORS.text }}>Categoria a Melhorar</Text>
                  <Text className="text-sm font-semibold" style={{ color: COLORS.error }}>
                    {stats.overall.worstCategory}
                  </Text>
                </View>
                {renderProgressBar(
                  stats.byCategory[stats.overall.worstCategory]?.averageScore || 0,
                  COLORS.error
                )}
              </View>
            </View>

            {/* Progress Chart */}
            <View className="bg-white rounded-xl shadow-sm p-5 mb-4">
              <Text className="text-lg font-semibold mb-4" style={{ color: COLORS.text }}>
                Progresso Recente
              </Text>
              
              <View className="flex-row h-40 items-end space-x-2">
                {stats.progressOverTime.map((item, index) => (
                  <View key={index} className="flex-1 items-center">
                    <View 
                      className="w-full rounded-t-sm" 
                      style={{ 
                        height: `${item.score}%`,
                        backgroundColor: item.score >= 70 ? COLORS.success : item.score >= 50 ? COLORS.warning : COLORS.error
                      }}
                    />
                    <Text className="text-xs mt-1" style={{ color: COLORS.textLight }}>
                      {index === stats.progressOverTime.length - 1 ? 'Hoje' : ''}
                    </Text>
                  </View>
                ))}
              </View>
            </View>
          </View>
        )}

        {activeTab === 'categories' && (
          <View>
            {Object.entries(stats.byCategory).map(([category, data]) => (
              <View key={category} className="bg-white rounded-xl shadow-sm p-5 mb-4">
                <View className="flex-row justify-between items-center mb-3">
                  <Text className="text-lg font-semibold" style={{ color: COLORS.text }}>
                    {category}
                  </Text>
                  <View className="px-3 py-1 rounded-full" style={{ backgroundColor: COLORS.yellowLighten5 }}>
                    <Text className="text-sm font-medium" style={{ color: COLORS.primary }}>
                      {data.averageScore.toFixed(1)}%
                    </Text>
                  </View>
                </View>

                <ScrollView style={{ overflow : 'hidden'}} horizontal showsHorizontalScrollIndicator={false} className="mb-4 gap-4">
                  <View>
                    <Text className="text-sm" style={{ color: COLORS.textLight }}>Testes Realizados</Text>
                    <Text className="text-xl font-bold" style={{ color: COLORS.text }}>
                      {data.testsTaken}
                    </Text>
                  </View>
                  <View>
                    <Text className="text-sm" style={{ color: COLORS.textLight }}>Questões Corretas</Text>
                    <Text className="text-xl font-bold" style={{ color: COLORS.text }}>
                      {data.correctAnswers}
                    </Text>
                  </View>
                  <View>
                    <Text className="text-sm" style={{ color: COLORS.textLight }}>Taxa de Acerto</Text>
                    <Text className="text-xl font-bold" style={{ color: COLORS.text }}>
                      {data.averageScore.toFixed(1)}%
                    </Text>
                  </View>
                </ScrollView>

                {data.bestTest.testTitle && (
                  <View className="border-t border-gray-100 pt-3">
                    <Text className="text-sm mb-1" style={{ color: COLORS.textLight }}>Melhor Teste</Text>
                    <View className="flex-row justify-between items-center">
                      <Text className="font-medium" style={{ color: COLORS.text }}>
                        {data.bestTest.testTitle}
                      </Text>
                      <Text className="font-bold" style={{ color: COLORS.success }}>
                        {data.bestTest.score.toFixed(1)}%
                      </Text>
                    </View>
                  </View>
                )}
              </View>
            ))}
          </View>
        )}

        {activeTab === 'history' && (
          <View>
            <Text className="text-lg font-semibold mb-3 px-2" style={{ color: COLORS.text }}>
              Atividade Recente
            </Text>
            
            {stats.recentActivity.map((activity, index) => (
              <View 
                key={index} 
                className="bg-white rounded-xl shadow-sm p-4 mb-3 flex-row justify-between items-center"
              >
                <View className="flex-1">
                  <Text className="font-medium" style={{ color: COLORS.text }}>
                    {activity.testTitle}
                  </Text>
                 <Text className="text-sm" style={{ color: COLORS.textLight }}>
              {formatRelativeTimeFromFirebaseTimestamp(activity.dateFormatted as string )}
            </Text>
                </View>
                
                <View className="items-end">
                  <Text 
                    className={`text-lg font-bold ${
                      activity.score >= 70 ? 'text-green-500' : 
                      activity.score >= 50 ? 'text-yellow-500' : 'text-red-500'
                    }`}
                  >
                    {activity.score.toFixed(1)}%
                  </Text>
                  <Text className="text-xs" style={{ color: COLORS.textLight }}>
                    {activity.score >= 70 ? 'Excelente' : activity.score >= 50 ? 'Bom' : 'Precisa melhorar'}
                  </Text>
                </View>
              </View>
            ))}
          </View>
        )}
      </ScrollView>
    </View>
  );
};

export default UserStatsDashboard;