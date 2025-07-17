import React from 'react';
import { View, Text } from 'react-native';
import { CircularProgress } from 'react-native-circular-progress-indicator';

interface ProgressChartProps {
  progress: number;
}

const ProgressChart: React.FC<ProgressChartProps> = ({ progress }) => {
  return (
    <View className="px-5 my-6">
      <View className="bg-white rounded-xl p-6 shadow-sm">
        <Text className="text-lg font-semibold text-gray-900 mb-4">Seu progresso geral</Text>
        <View className="flex-row items-center justify-between">
          <CircularProgress
            value={progress}
            radius={80}
            duration={1500}
            progressValueColor="#1e40af"
            activeStrokeColor="#2563eb"
            inActiveStrokeColor="#dbeafe"
            inActiveStrokeOpacity={0.8}
            activeStrokeWidth={12}
            inActiveStrokeWidth={8}
            progressValueStyle={{ fontWeight: 'bold', fontSize: 24 }}
            valueSuffix={'%'}
          />
          <View className="ml-6 flex-1">
            <View className="flex-row items-center mb-4">
              <View className="w-3 h-3 bg-blue-500 rounded-full mr-2"></View>
              <Text className="text-gray-700">{progress}% Completo</Text>
            </View>
            <View className="flex-row items-center mb-4">
              <View className="w-3 h-3 bg-green-500 rounded-full mr-2"></View>
              <Text className="text-gray-700">12 dias consecutivos</Text>
            </View>
            <View className="flex-row items-center">
              <View className="w-3 h-3 bg-purple-500 rounded-full mr-2"></View>
              <Text className="text-gray-700">Nível Intermediário</Text>
            </View>
          </View>
        </View>
      </View>
    </View>
  );
};

export default ProgressChart;