import React from 'react';
import { View, Text, TouchableOpacity, FlatList, ActivityIndicator } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { COLORS } from '@/hooks/useColors';
import { auth } from '@/firebase/firebase';
import { useNavigation } from '@react-navigation/native';
import { getUserStats } from '@/services/statsService';

const TestHistoryItem: React.FC<{ test: any }> = ({ test }) => {
  const passed = test.score >= test.pointToAprove;
  const scorePercentage = Math.round((test.correctAnswers / test.totalQuestions) * 100);

  return (
    <View className="mr-3 p-4 rounded-xl w-44" style={{ backgroundColor: COLORS.surface }}>
      <View className="flex-row justify-between items-center mb-2">
        <Text className="text-xs" style={{ color: COLORS.textLight }}>
          {new Date(test.quizDate?.seconds * 1000 || test.quizDate).toLocaleDateString('pt-BR')}
        </Text>
        {passed ? (
          <Feather name="check-circle" size={16} style={{ color: COLORS.success }} />
        ) : (
          <Feather name="x-circle" size={16} style={{ color: COLORS.error }} />
        )}
      </View>
      
      <Text 
        className="text-lg font-bold mb-1" 
        style={{ color: passed ? COLORS.success : COLORS.error }}
      >
        {scorePercentage}%
      </Text>
      
      <Text className="text-sm font-medium" style={{ color: COLORS.text }}>
        {test.testTitle}
      </Text>
      
      <Text className="text-xs mt-1" style={{ color: COLORS.textLight }}>
        {passed ? 'Aprovado' : 'Reprovado'} • {test.category}
      </Text>
      
      <Text className="text-xs mt-1" style={{ color: COLORS.textLight }}>
        {test.correctAnswers}/{test.totalQuestions} acertos
      </Text>
      
      <View className="mt-2 h-1 w-full rounded-full" style={{ backgroundColor: COLORS.surface }}>
        <View 
          className="h-1 rounded-full" 
          style={{ 
            width: `${scorePercentage}%`,
            backgroundColor: passed ? COLORS.success : COLORS.error
          }} 
        />
      </View>
    </View>
  );
};

const TestHistorySection: React.FC = () => {
  const [recentTests, setRecentTests] = React.useState<any[]>([]);
  const [loading, setLoading] = React.useState(true);
  const navigation = useNavigation();

  React.useEffect(() => {
    const loadRecentTests = async () => {
      if (auth.currentUser?.uid) {
        try {
          const stats = await getUserStats(auth.currentUser.uid);
          setRecentTests(stats.recentActivity.slice(0, 5)); // Mostrar apenas os 5 mais recentes
        } catch (error) {
          console.error('Error loading test history:', error);
        } finally {
          setLoading(false);
        }
      }
    };

    loadRecentTests();
  }, []);

  if (loading) {
    return (
      <View className="mb-6">
        <Text className="text-lg font-semibold mb-3" style={{ color: COLORS.text }}>
          Histórico de Testes
        </Text>
        <ActivityIndicator color={COLORS.primary} />
      </View>
    );
  }

  if (recentTests.length === 0) {
    return (
      <View className="mb-6">
        <Text className="text-lg font-semibold mb-3" style={{ color: COLORS.text }}>
          Histórico de Testes
        </Text>
        <Text className="text-sm" style={{ color: COLORS.textLight }}>
          Nenhum teste realizado ainda
        </Text>
      </View>
    );
  }

  return (
    <View className="mb-6">
      <View className="flex-row justify-between items-center mb-3">
        <Text className="text-lg font-semibold" style={{ color: COLORS.text }}>
          Histórico de Testes
        </Text>
        <TouchableOpacity onPress={() => navigation.navigate('TestHistory')}>
          <Text className="text-sm" style={{ color: COLORS.primary }}>
            Ver todos
          </Text>
        </TouchableOpacity>
      </View>
      
      <FlatList
        horizontal
        data={recentTests}
        keyExtractor={(item, index) => `${item.date}-${index}`}
        showsHorizontalScrollIndicator={false}
        renderItem={({ item }) => <TestHistoryItem test={item} />}
        contentContainerStyle={{ paddingRight: 16 }}
        ItemSeparatorComponent={() => <View style={{ width: 12 }} />}
      />
    </View>
  );
};

export default TestHistorySection;