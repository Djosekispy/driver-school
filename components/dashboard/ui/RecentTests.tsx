import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { COLORS } from '@/constants/Colors';

const testData = [
  { id: 1, title: 'Sinais de Trânsito', score: 85, date: '15/06/2023' },
  { id: 2, title: 'Legislação de Trânsito', score: 78, date: '10/06/2023' },
  { id: 3, title: 'Direção Defensiva', score: 92, date: '05/06/2023' },
];

const RecentTests = () => {
  return (
    <View className="mb-6">
      {testData.map((test) => (
        <TestCard key={test.id} test={test} />
      ))}
    </View>
  );
};

const TestCard = ({ test }: { test: typeof testData[0] }) => {
  const getScoreStyle = (score: number) => {
    if (score >= 80) return 'bg-green-50';
    if (score >= 60) return 'bg-yellow-50';
    return 'bg-red-50';
  };

  return (
    <TouchableOpacity className="flex-row items-center bg-white rounded-lg p-4 mb-3 shadow-sm">
      <View className="w-10 h-10 rounded-full justify-center items-center mr-3" 
        style={{ backgroundColor: COLORS.blue.lighten5 }}>
        <MaterialIcons name="quiz" size={20} color={COLORS.blue.default} />
      </View>
      
      <View className="flex-1">
        <Text className="font-medium" style={{ color: COLORS.text.primary }}>
          {test.title}
        </Text>
        <Text className="text-xs" style={{ color: COLORS.text.secondary }}>
          {test.date}
        </Text>
      </View>
      
      <View className={`px-3 py-1 rounded-full ${getScoreStyle(test.score)}`}>
        <Text className="font-bold text-sm" style={{ color: COLORS.text.primary }}>
          {test.score}%
        </Text>
      </View>
    </TouchableOpacity>
  );
};

export default RecentTests;