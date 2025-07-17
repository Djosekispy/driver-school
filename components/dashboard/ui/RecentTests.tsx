import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { RecentTest } from '../types';

interface RecentTestsProps {
  tests: RecentTest[];
}

const RecentTests: React.FC<RecentTestsProps> = ({ tests }) => {
  const getScoreColor = (score: number) => {
    if (score >= 90) return { bg: 'bg-green-100', text: 'text-green-800' };
    if (score >= 70) return { bg: 'bg-blue-100', text: 'text-blue-800' };
    return { bg: 'bg-yellow-100', text: 'text-yellow-800' };
  };

  return (
    <View className="px-5 mt-2">
      <View className="bg-white rounded-xl p-6 shadow-sm">
        <View className="flex-row justify-between items-center mb-4">
          <Text className="text-lg font-semibold text-gray-900">Testes Recentes</Text>
          <TouchableOpacity className="flex-row items-center">
            <Text className="text-blue-600 mr-1">Ver todos</Text>
            <MaterialIcons name="chevron-right" size={20} color="#2563eb" />
          </TouchableOpacity>
        </View>

        {tests.map((test) => {
          const scoreColor = getScoreColor(test.score);
          return (
            <TouchableOpacity key={test.id} className="py-3 border-b border-gray-100 last:border-0">
              <View className="flex-row justify-between items-center">
                <View>
                  <Text className="text-gray-500 text-sm">{test.date}</Text>
                  <Text className="text-gray-900 font-medium mt-1">
                    {test.correct}/{test.total} questões corretas
                  </Text>
                </View>
                <View className="flex-row items-center">
                  <View className={`w-12 h-12 rounded-full justify-center items-center ${scoreColor.bg}`}>
                    <Text className={`font-bold ${scoreColor.text}`}>
                      {test.score}
                    </Text>
                  </View>
                  <MaterialIcons name="chevron-right" size={20} color="#9ca3af" />
                </View>
              </View>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
};

export default RecentTests;