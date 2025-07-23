// components/TestHistorySection.tsx
import React from 'react';
import { View, Text, TouchableOpacity, FlatList } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { TestResult } from '../types';
import { COLORS } from '@/hooks/useColors';

const TestHistoryItem: React.FC<{ test: TestResult }> = ({ test }) => {
  return (
    <View className="mr-3 p-4 rounded-xl w-40" style={{ backgroundColor: COLORS.surface }}>
      <View className="flex-row justify-between items-center mb-2">
        <Text className="text-sm" style={{ color: COLORS.textLight }}>
          {test.date.toLocaleDateString('pt-BR')}
        </Text>
        {test.passed ? (
          <Feather name="check-circle" size={16} style={{ color: COLORS.success }} />
        ) : (
          <Feather name="x-circle" size={16} style={{ color: COLORS.error }} />
        )}
      </View>
      <Text className="text-2xl font-bold mb-1" style={{ color: test.passed ? COLORS.success : COLORS.error }}>
        {test.score}%
      </Text>
      <Text className="text-xs" style={{ color: COLORS.textLight }}>
        {test.passed ? 'Aprovado' : 'Reprovado'} • {test.testType}
      </Text>
      <Text className="text-xs mt-1" style={{ color: COLORS.textLight }}>
        {test.correctAnswers}/{test.totalQuestions} acertos
      </Text>
    </View>
  );
};

const TestHistorySection: React.FC<{ tests: TestResult[] }> = ({ tests }) => {
  return (
    <View className="mb-6">
      <View className="flex-row justify-between items-center mb-3">
        <Text className="text-lg font-semibold" style={{ color: COLORS.text }}>Histórico de Testes</Text>
        <TouchableOpacity>
          <Text className="text-sm" style={{ color: COLORS.primary }}>Ver todos</Text>
        </TouchableOpacity>
      </View>
      
      <FlatList
        horizontal
        data={tests}
        keyExtractor={item => item.id}
        showsHorizontalScrollIndicator={false}
        renderItem={({ item }) => <TestHistoryItem test={item} />}
        contentContainerStyle={{ paddingRight: 16 }}
      />
    </View>
  );
};

export default TestHistorySection;